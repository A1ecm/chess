/* basic constructor of game state */
function GameState(socket) {
    this.gameStarted = false;
    this.playerType = null;

    this.getPlayerType = function () {
        return this.playerType;
    };

    this.getGameStarted = function () {
        return this.gameStarted;
    };

    this.setPlayerType = function (p) {
        console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
        this.playerType = p;
    };

    this.setGameStarted = function (p) {
        console.assert(typeof p == "boolean", "%s: Expecting a boolean, got a %s", arguments.callee.name, typeof p);
        this.gameStarted = p;
    };
    this.whoWon = function () {
        if (this.playerType == null)
            return null;
    };
}


function socketSend(message) {
    socket.send(JSON.stringify(message));
}

//Change possible moves elements color; returns the unshow Function to can be called immediately without need to parse the array again
function showMoves(ids) {
    var arrayLength = ids.length;
    $("layer.layer").css("background-color", "");
    for (var i = 0; i < arrayLength; i++) {
        let potspace = ids[i];
        if (potspace.length > 2) {
            if (potspace.includes("+") || potspace.includes("#")) {
                potspace = potspace.substring(potspace.length - 3, potspace.length - 1);
            }
            else {
                potspace = potspace.substring(potspace.length - 2);
            }
        }
        document.getElementById(potspace).style.backgroundColor = "#618757";
    }
}





//set everything up, including the WebSocket
(function setup() {
    console.log(Setup.WEB_SOCKET_URL);
    socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);



    // return TODO possibly create a GameState object here

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        //set player type
        if (incomingMsg.type == "PLAYER-TYPE") {
            gs.setPlayerType(incomingMsg.data);
            alert("You are player: " + gs.getPlayerType());
            //var element = document.getElementById("p"+gs.getPlayerType()+"show");
            //element.style.fontWeight = 800;
            $("#p" + gs.getPlayerType() + "show").toggleClass('player');
        }

        if (gs.getGameStarted() == false) {
            if (incomingMsg.type == Messages.T_START) {
                gs.setGameStarted(true);
            }
            incomingMsg.type = null;
            incomingMsg.data = null;
        }


        if (incomingMsg.type == Messages.T_AVAILABLE_MOVES) {
            console.log(incomingMsg.data);
            showMoves(incomingMsg.data);
            arrayInput(incomingMsg.data);
        }
        if (incomingMsg.type == Messages.T_NOT_YOUR_MOVE) {
            console.log(incomingMsg.data);
        }

        if (incomingMsg.type == Messages.T_MOVE_MADE) {
            $("layer.layer").css("background-color", "");
            console.log(incomingMsg.data);
            document.getElementById(incomingMsg.data[1]).innerHTML = document.getElementById(incomingMsg.data[0]).innerHTML;
            document.getElementById(incomingMsg.data[0]).innerHTML = "";
        }

        if (incomingMsg.type == Messages.T_HISTORY) {
            var pastmoves = incomingMsg.data;
            for (var i = document.getElementById("movesTable").rows.length; i > 0; i--) {
                document.getElementById("movesTable").deleteRow(i - 1);
            }
            var table = document.getElementById("movesTable");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = "Count";
            cell2.innerHTML = "White";
            cell3.innerHTML = "Black";

            for (let c = 0; c < pastmoves.length - (c + 1); c++) {
                var table = document.getElementById("movesTable");
                var row = table.insertRow(c + 1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = c + 1;
                cell2.innerHTML = pastmoves[2 * c];
                cell3.innerHTML = pastmoves[2 * c + 1];
            }
        }
        if (incomingMsg.type == Messages.T_ASK_DRAW) {
            askDraw(incomingMsg.data);
        }

        if (incomingMsg.type == Messages.T_DRAW) {
            drawGame();
        }

        if (incomingMsg.type == Messages.T_DRAW_DENIED) {
            alert("Player " + incomingMsg.data + " has denied your draw request");
        }

        if (incomingMsg.type == Messages.T_GAME_WON_BY) {
            winGame(incomingMsg.data);
        }
    };

    socket.onopen = function () {
        socket.send("{}");
        let cookiesArray = document.cookie.split("; ");
        let counter = cookiesArray.length - 1;
        document.getElementById("visits").innerHTML = "You have been here " + counter + " times before";

    };

    socket.onerror = function () {
    };

    socket.onclose = function () {
        let countDownDate = new Date().getTime();
        document.cookie = countDownDate + "=null;  expires=Fri, 24-Jan-2019 12:45:00 GMT";
        if (gs.whoWon() == null) {
            abortGame();
        }
    };

})();

async function winGame(winner) {
    alert("Player " + winner + " wins!");
    await sleep(5000);
    window.location = "../";
}

async function askDraw(player) {
    await sleep(3000);
    var question = confirm("Player " + player + " is asking for a draw. Do you accept?");
    if (question == true) {
        var outgoingMsg = Messages.O_DRAW;
        socketSend(outgoingMsg);
    }
    else {
        var outgoingMsg = Messages.O_DRAW_DENIED;
        socketSend(outgoingMsg);
    }
}

async function drawGame() {
    alert("It's a draw");
    await sleep(5000);
    window.location = "../";
}

async function abortGame() {
    alert("Game aborted");
    await sleep(5000);
    window.location = "../";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



