function forfeit(){
    var outgoingMsg = Messages.O_FORFEIT;
    socketSend(outgoingMsg);
}
function goMain(){
    window.location="../splash.html";
}