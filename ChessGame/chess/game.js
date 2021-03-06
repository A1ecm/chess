var Chess = require('./node_modules/chess.js/chess').Chess;

/* every game has two players, identified by their WebSocket */
var game = function (gameID) {
  this.playerA = null;
  this.playerB = null;
  this.id = gameID;
  this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
  this.chess = new Chess();
};

/*
 * The game can be in a number of different states.
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["A"] = 3; //White won
game.prototype.transitionStates["B"] = 4; //Black won
game.prototype.transitionStates["ABORTED"] = 5;

/*
 * Not all game states can be transformed into each other;
 * the matrix contains the valid transitions.
 * They are checked each time a state change is attempted.
 */
game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0],   //0 JOINT
  [1, 0, 1, 0, 0, 0],   //1 JOINT
  [0, 0, 0, 1, 1, 1],   //2 JOINT (note: once we have two players, there is no way back)
  [0, 0, 0, 0, 0, 0],   //White WON
  [0, 0, 0, 0, 0, 0],   //Black WON
  [0, 0, 0, 0, 0, 0]    //ABORTED
];

game.prototype.isValidTransition = function (from, to) {

  console.assert(typeof from == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
  console.assert(typeof to == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);
  console.assert(from in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
  console.assert(to in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);


  let i, j;
  if (!(from in game.prototype.transitionStates)) {
    return false;
  }
  else {
    i = game.prototype.transitionStates[from];
  }

  if (!(to in game.prototype.transitionStates)) {
    return false;
  }
  else {
    j = game.prototype.transitionStates[to];
  }

  return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
  return (s in game.prototype.transitionStates);
};

game.prototype.setStatus = function (w) {

  console.assert(typeof w == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);

  if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
  }
  else {
    return new Error("Impossible status change from %s to %s", this.gameState, w);
  }
};

game.prototype.hasTwoConnectedPlayers = function () {
  return (this.gameState == "2 JOINT");
};

game.prototype.getChess = function(){
  return this.chess;
}

game.prototype.getMoves = function(space){
  return this.chess.moves({square: space});
}

game.prototype.makeMove = function(pathArray){
  this.chess.move({from: pathArray[0], to: pathArray[1]});
  console.log(this.chess.ascii());
}
game.prototype.checkmate = function(){
  return this.chess.in_checkmate();
}
game.prototype.goodEnd = function(){
  if(this.chess.in_checkmate() || this.chess.in_draw() || thiss.chess.in_stalemate())
  return true;
}

game.prototype.turn = function(piece){
  console.log(piece);
  console.log(this.chess.get(piece));
  return this.chess.get(piece).color;
}

game.prototype.getHistory = function(){
  return this.chess.history();
}

game.prototype.addPlayer = function (p) {
  console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

  if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
    return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
  }

  /*
   * revise the game state
   */
  var error = this.setStatus("1 JOINT");
  if (error instanceof Error) {
    this.setStatus("2 JOINT");
  }

  if (this.playerA == null) {
    this.playerA = p;
    return "A";
  }
  else {
    this.playerB = p;
    return "B";
  }
};

module.exports = game;




// var chess = new Chess();

// while (!chess.game_over()) {
//   console.log(chess.ascii());
//   var origin = readline.question("From where?");
//   var destination = readline.question("To?");
//   chess.move({from: origin, to: destination});
//   console.log(chess.history());
//   }

//   window.onload = function () {
//   document.getElementById("a1").addEventListener("click", clicked);
//   function clicked(){
//     alert("a1 clicked");
//   }
// }