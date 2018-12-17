function forfeit(){
    var outgoingMsg = Messages.O_FORFEIT;
    socketSend(outgoingMsg);
}

function goMain(){
    window.location="../";
}

function draw(){
    var outgoingMsg = Messages.O_ASK_DRAW;
    socketSend(outgoingMsg);
}