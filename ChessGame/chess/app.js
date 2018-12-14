var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");


var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

// app.get("/", (req, res) => {
//     res.render("splash.ejs", { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted });
// });

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};//property: websocket, value: game
/*
 * regularly clean up the websockets object
 */
setInterval(function () {
    for (let i in websockets) {
        if (websockets.hasOwnProperty(i)) {
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if (gameObj.finalStatus != null) {
                console.log("\tDeleting element " + i);
                delete websockets[i];
            }
        }
    }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;//each websocket receives a unique ID
wss.on("connection", function connection(ws) {
    console.log("connection made");

    /*
     * two-player game: every two players are added to the same game
     */
    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

    /*
     * inform the client about its assigned player type
     */
    con.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);


    /*
     * once we have two players, there is no way back; 
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame.playerA.send(JSON.stringify(messages.O_START));
        currentGame.playerB.send(JSON.stringify(messages.O_START));
        currentGame = new Game(gameStatus.gamesInitialized++);
        
    }
    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP 
     */
    con.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);

        let gameObj = websockets[con.id];
        let isPlayerA = (gameObj.playerA == con) ? true : false;

        //incoming message with which piece is selected returns an array with possible moves                                        

        if (oMsg.type == messages.T_SELECT_A_PIECE) {
            console.log("selected piece: " + oMsg.data);
            let turn = gameObj.turn(oMsg.data);

            if (playerType == "A" && turn == 'w') {
                let msg = messages.O_AVAILABLE_MOVES;
                msg.data = gameObj.getMoves(oMsg.data);
                console.log(gameObj.getMoves(oMsg.data));
                con.send(JSON.stringify(msg));
            }
            if (playerType == "A" && turn == 'b') {
                con.send(messages.S_NOT_YOUR_MOVE);
            }

            if (playerType == "B" && turn == 'b') {
                let msg = messages.O_AVAILABLE_MOVES;
                msg.data = gameObj.getMoves(oMsg.data);
                console.log(gameObj.getMoves(oMsg.data));
                con.send(JSON.stringify(msg));

            }
            if (playerType == "B" && turn == 'w') {
                con.send(messages.S_NOT_YOUR_MOVE);
            }

        }

        if (oMsg.type == messages.T_MAKE_A_MOVE) {
            console.log("Move made by ", playerType);
            let turn = gameObj.turn(oMsg.data[0]);

            if (playerType == "A" && turn == 'w') {

                gameObj.makeMove(oMsg.data);

                let moveMsg = messages.O_MOVE_MADE;
                moveMsg.data = oMsg.data;
                gameObj.playerA.send(JSON.stringify(moveMsg));
                gameObj.playerB.send(JSON.stringify(moveMsg));

                if (gameObj.checkmate()) {
                    let winMsg = messages.O_GAME_WON_BY;
                    console.log(playerType + " won");
                    var winner = playerType;
                    winMsg.data = winner;

                    gameObj.playerA.send(JSON.stringify(winMsg));
                    gameObj.playerB.send(JSON.stringify(winMsg));
                }
            }
            if (playerType == "A" && turn == 'b') { con.send(messages.S_NOT_YOUR_MOVE); }
            if (playerType == "B" && turn == 'b') {

                gameObj.makeMove(oMsg.data);

                let moveMsg = messages.O_MOVE_MADE;
                moveMsg.data = oMsg.data;
                gameObj.playerA.send(JSON.stringify(moveMsg));
                gameObj.playerB.send(JSON.stringify(moveMsg));

                if (gameObj.checkmate()) {
                    let winMsg = messages.O_GAME_WON_BY;
                    console.log(playerType + " won");
                    var winner = playerType;
                    winMsg.data = winner;

                    gameObj.playerA.send(JSON.stringify(winMsg));
                    gameObj.playerB.send(JSON.stringify(winMsg));
                }

                let historyMsg = messages.O_HISTORY;
                historyMsg.data = gameObj.getHistory();
                gameObj.playerA.send(JSON.stringify(historyMsg));
                gameObj.playerB.send(JSON.stringify(historyMsg));
            }
            if (playerType == "B" && turn == 'w') { con.send(messages.S_NOT_YOUR_MOVE); }

        }

        if(oMsg.type == messages.T_FORFEIT){
            let winMsg = messages.O_GAME_WON_BY;
            if(playerType == "A")
            var winner = "B";
            if(playerType == "B")
            var winner = "A";
            console.log(winner + " won");
            
            winMsg.data = winner;

            gameObj.playerA.send(JSON.stringify(winMsg));
            gameObj.playerB.send(JSON.stringify(winMsg));
        }

        if(oMsg.type == messages.T_ASK_DRAW) {
            let drawMsg = messages.O_ASK_DRAW;
            drawMsg.data = playerType;
            if(playerType == "A")
                gameObj.playerB.send(JSON.stringify(drawMsg));
            if(playerType == "B")
                gameObj.playerA.send(JSON.stringify(drawMsg));
        }

        if(oMsg.type == messages.T_DRAW){
            let conDrawMsg = messages.O_DRAW;
            gameObj.playerA.send(JSON.stringify(conDrawMsg));
            gameObj.playerB.send(JSON.stringify(conDrawMsg));
        }

        if(oMsg.type == messages.T_DRAW_DENIED){
            let denDrawMsg = messages.O_DRAW_DENIED;
            denDrawMsg.data = playerType;
            if(playerType == "A")
                gameObj.playerB.send(JSON.stringify(denDrawMsg));
            if(playerType == "B")
                gameObj.playerA.send(JSON.stringify(denDrawMsg))
        }

    });

    con.on("close", function (code) {

        /*
         * code 1001 means almost always closing initiated by the client;
         * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
         */
        console.log(con.id + " disconnected ...");

        if (code == "1001") {
            /*
            * if possible, abort the game; if not, the game is already completed
            */
            let gameObj = websockets[con.id];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");
                gameStatus.gamesAborted++;
                

                /*
                 * determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                }
                catch (e) {
                    console.log("Player A closing: " + e);
                }

                try {
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                }
                catch (e) {
                    console.log("Player B closing: " + e);
                }
            }

        }
    });
});

server.listen(port);
