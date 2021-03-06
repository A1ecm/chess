// var Chess = require('../../node_modules/chess.js/chess').Chess;
// // var readline = require('readline-sync');
// var chess = new Chess();
var selected = false;
var selPiece;
var nextPossible;

function main() {
    "use strict";
    
    $(".chessboard td").on("click", function (event) {
        //console.log(selected);
        if ((selected == false || nextPossible == undefined) && event.target.id != "") {
            selectNewPiece(event);
            selPiece = event.target.id;
            console.log(event.target.type);
            selected = true;
        }
        else {
            for (var i = 0; i < nextPossible.length; i++) {
                let selPos = nextPossible[i];
                if (selPos.length > 2) {
                    if (selPos.includes("+") || selPos.includes("#")) {
                        selPos = selPos.substring(selPos.length - 3, selPos.length - 1);
                    }
                    else {
                        selPos = selPos.substring(selPos.length - 2);
                    }
                }
                if (selPos == event.target.id) {
                    // send to server 
                    var outgoingMsg = Messages.O_MAKE_A_MOVE;
                    var moveArray = [selPiece, selPos];
                    outgoingMsg.data = moveArray;
                    socketSend(outgoingMsg);
                    selected = false;
                    i = nextPossible.length;

                }
                else {
                    selected = false;
                    $("layer.layer").css("background-color", "");
                }

            }
            if (selected == true) {
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

function arrayInput(nextMoves) {
    nextPossible = nextMoves;
}

