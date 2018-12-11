// var Chess = require('../../node_modules/chess.js/chess').Chess;
// // var readline = require('readline-sync');
// var chess = new Chess();

function main(){
    "use strict";
    
    $(".chessboard td").on("click", function(event){
        if(event.target.innerHTML != ""){
            var space = event.target.id;
            var outgoingMsg = Messages.O_SELECT_A_PIECE;
            
            outgoingMsg.data = space;
            socketSend(outgoingMsg);
        } 

    });

};
$(document).ready(main);