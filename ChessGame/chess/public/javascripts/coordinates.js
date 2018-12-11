// var Chess = require('../../node_modules/chess.js/chess').Chess;
// // var readline = require('readline-sync');
// var chess = new Chess();
var selected = false;
var selPiece;
var nextPossible;

function main() {
    "use strict";

    $(".chessboard td").on("click", function (event) {
        if(selected == false){
            selectNewPiece(event);
            selPiece = event.target.id;
            selected = true;
        }
        else{
            for(var i = 0; i < nextPossible.lenght; i++){
                let selPos = nextPossible[i];
                if(selPos.length > 2){
                   selPos = selPos.substring(selPos.length -2);
                }
                if(selPos === selPiece){
                   getElementById(selPiece).innerHTML = "A";
                   // send to server 
                   selPiece = false;
                   i = nextPossible.lenght;
                }
            }
            if(selPiece = true){
                selectNewPiece(event);
                selPiece = event.target.id;
            }
        }
       

    });

};
$(document).ready(main);

function selectNewPiece(event) {
    if (event.target.innerHTML != "") {
        var space = event.target.id;
        var outgoingMsg = Messages.O_SELECT_A_PIECE;
        outgoingMsg.data = space;
        socketSend(outgoingMsg);
    }
}

function arrayInput(nextMoves){
    nextPossible = nextMoves;
}