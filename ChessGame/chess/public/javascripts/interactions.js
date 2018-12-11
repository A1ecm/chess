/* basic constructor of game state */
function GameState(socket){

    this.playerType = null;

    this.getPlayerType = function () {
        return this.playerType;
    };

    this.setPlayerType = function (p) {
        console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
        this.playerType = p;
    };

    // maybe implement not sure
    // this.whoWon = function(){
    // };
}


function socketSend(message){
    socket.send(JSON.stringify(message));
}

//Change possible moves elements color; returns the unshow Function to can be called immediately without need to parse the array again
function showMoves(ids) {
    var arrayLength = ids.length;
    $("layer.layer").css("background-color","");
    for (var i = 0; i < arrayLength; i++) {
        let potspace = ids[i];
        if(potspace.length > 2){
           potspace = potspace.substring(potspace.length -2);
        }

        document.getElementById(potspace).firstChild.style.backgroundColor = "#618757";
    }
}




//set everything up, including the WebSocket
(function setup(){
    console.log(Setup.WEB_SOCKET_URL);
    socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);

    // TODO possibly create a GameState object here

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("data incoming");

        //set player type
        if (incomingMsg.type == "PLAYER-TYPE") {
            gs.setPlayerType(incomingMsg.data);
        }
        console.log(gs.getPlayerType());
        
        if( incomingMsg.type == Messages.T_AVAILABLE_MOVES){
            showMoves(incomingMsg.data);
            arrayInput(incomingMsg.data);
        }
    };

    socket.onopen = function(){
        socket.send("{}");
        
    };

    socket.onerror = function(){  
    };

})();



