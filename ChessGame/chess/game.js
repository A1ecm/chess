var Chess = require('../../node_modules/chess.js/chess').Chess;
var readline = require('readline-sync');
var chess = new Chess();

while (!chess.game_over()) {
  console.log(chess.ascii());
  var origin = readline.question("From where?");
  var destination = readline.question("To?");
  chess.move({from: origin, to: destination});
  console.log(chess.history());
  }
  
  window.onload = function () {
  document.getElementById("a1").addEventListener("click", clicked);
  function clicked(){
    alert("a1 clicked");
  }
}