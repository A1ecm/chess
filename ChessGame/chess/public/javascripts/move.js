// var Chess = require('../../node_modules/chess.js/chess').Chess;
var chess = new Chess();


window.onload = function () {
    document.getElementById("a2").addEventListener("click", clicked);
    function clicked(){
      alert("a2 clicked");
      var movespiece = chess.moves({square: 'a2'});
      console.log(movespiece);
      for(let i = 0; i < movespiece.length; i++){
          movespiece[i].style.color = "green";
      }
    }

  }