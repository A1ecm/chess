var Chess = require('../../node_modules/chess.js/chess').Chess;
// var readline = require('readline-sync');
var chess = new Chess();

function main(){
    "use strict";
    var pieceSelect = false;
    $(".chessboard td").on("click", function(event){
        if(event.target.innerHTML != ""){
            pieceSelect = true;
            alert(chess.moves({square: event.target.id}));
        }
       
    
    });

};
$(document).ready(main);