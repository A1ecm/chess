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

//set everything up, including the WebSocket
(function setup(){
    console.log(Setup.WEB_SOCKET_URL);
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);

    // TODO possibly create a GameState object here

    // socket.onmessage = function (event) {
    //     let incomingMsg = JSON.parse(event.data);
    // };

    socket.onopen = function(){
        socket.send("{}");
    };

    socket.onerror = function(){  
    };

})();