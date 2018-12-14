(function(exports){
    
    /* 
     * Client to server: game is complete, the winner is ... 
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";             
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };

    /*
     * Server to client: abort game (e.g. if second player exited the game) 
     */
    exports.O_GAME_ABORTED = {                          
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: set as player A 
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {                            
        type: exports.T_PLAYER_TYPE,
        data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    /* 
     * Server to client: set as player B 
     */
    exports.O_PLAYER_B = {                            
        type: exports.T_PLAYER_TYPE,
        data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    /* 
     * Player A to server OR Player B to server: Select a piece
     */
    exports.T_SELECT_A_PIECE = "SELECT-A-PIECE";         
    exports.O_SELECT_A_PIECE = {
        type: exports.T_SELECT_A_PIECE,
        data: null
    };

    /**
     * Server to Player A or Player B: Available moves
     */
    exports.T_AVAILABLE_MOVES = "AVAILABLE-MOVES";
    exports.O_AVAILABLE_MOVES = {
        type: exports.T_AVAILABLE_MOVES,
        data: null
    };

    exports.T_NOT_YOUR_MOVE = "NOT_YOUR_MOVE";
    exports.O_NOT_YOUR_MOVE = {
        type: exports.T_NOT_YOUR_MOVE,
        data: "Not your move"
    };
    exports.S_NOT_YOUR_MOVE = JSON.stringify(exports.O_NOT_YOUR_MOVE);
    

    /* 
     * Player A to server OR Player B to server: Make a move
     */
    exports.T_MAKE_A_MOVE = "MAKE-A-MOVE";         
    exports.O_MAKE_A_MOVE = {
        type: exports.T_MAKE_A_MOVE,
        data: null
    };

    /**
     * Server to client: Move made
     */
    exports.T_MOVE_MADE = "MOVE-MADE";
    exports.O_MOVE_MADE = {
        type: exports.T_MOVE_MADE,
        data: null
    };
    
    /**
     * Server to client: History
     */
    exports.T_HISTORY = "HISTORY";
    exports.O_HISTORY = {
        type: exports.T_HISTORY,
        data: null
    };

    /**
     * Server to client: ready to start a game;
     */
    exports.T_START = "START";
    exports.O_START = {
        type: exports.T_START,
        data: null
    };

    /**
     * Client to server: Forfeit
     */
    exports.T_FORFEIT = "FORFEIT";
    exports.O_FORFEIT = {
        type: exports.T_FORFEIT,
        data: null
    };

    /**
     * Player A or B to server and server to Player A or B: DRAW
     */
    exports.T_DRAW = "DRAW";
    exports.O_DRAW = {
        type: exports.T_DRAW,
        data: null
    };

    /**
     * Player A or B to server and server to Player A or B: ASK FOR DRAW
     */
    exports.T_ASK_DRAW = "ASK-DRAW";
    exports.O_ASK_DRAW = {
        type: exports.T_ASK_DRAW,
        data: null
    };

     /**
     * Player A or B to server and server to Player A or B: DRAW DENIED
     */
    exports.T_DRAW_DENIED = "DRAW-DENIED";
    exports.O_DRAW_DENIED = {
        type: exports.T_DRAW_DENIED,
        data: null
    };

    /* 
     * Server to Player A & B: game over with result won/loss 
     */
    exports.T_GAME_OVER = "GAME-OVER";              
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null
    };

}(typeof exports === "undefined" ? this.Messages = {} : exports));