/**
 * Created by Rick Stewart on 06/09/2016.
 */

/**
 :::: This shows how the Game Board is mapped - zero indexed for array indexing. ::::

 0 | 1 | 2
 ---------
 3 | 4 | 5
 ---------
 6 | 7 | 8

 */

/* function tictactoe() is the main container to scope the shared variables and methods. */
(function tictactoe() {
    'use strict';
    var argsObject = {};                 // holds collection of program variables.

    /* function init() runs at the beginning of the program to initialize variables and settings. */
    function init() {
        argsObject.moves = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];   // U is unoccupied square, one for each of 9 positions.
        argsObject.allWinningCombos = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];  // holds winning combinations.
        argsObject.playerPiece = '';                             // holds player's choice of playing X ro O.
        argsObject.movesCounter = 0;                             // holds a running count of moves made.
        argsObject.playersTurn = false;                          // holds true if players turn, false if AI's turn.
        argsObject.nowPlaying = '';                              // holds mark of current turn holder, player or AI.
        argsObject.lastMoveAI = '';                              // holds the position of the AIs last move.
        argsObject.mode = 'normal';                              // holds current mode of normalModePlay - Normal or Hard.
        argsObject.xRef = document.getElementById('X');          // holds a reference to radio button X label.
        argsObject.oRef = document.getElementById('O');          // holds a reference to radio button O label.
        argsObject.coordCenterSquare = [[60, 60], [188, 60], [316, 60], [60, 188], [188, 188], [318, 188], [60, 316], [188, 318], [318, 318]];
        calculateBoardDimensions();
        argsObject.paper = Raphael('canvas_container');          // create new Raphael object.
        argsObject.paper.setViewBox(0, 0, 400, 400, true);       // anchor viewbox to upper left corner of canvas_container, size 400 X 400 px.
        argsObject.svg = document.querySelector('svg');
        argsObject.svg.removeAttribute('width');                 // Raphael sets an absolute width on svg, removed for proper scaling.
        argsObject.svg.removeAttribute('height');                // Raphael sets an absolute height on svg, removed for proper scaling.
        drawBoard();
    }

    /* function calculateBoardDimensions() updates the variables holding the board dimensions, as well as
     * the dimensions of the container holding the board. */
    function calculateBoardDimensions() {
        argsObject.viewportHeight = window.innerHeight;          // get current height of viewport.
        argsObject.viewportWidth = window.innerWidth;            // get current width of viewport.
        argsObject.headerHeight = jQuery('header').outerHeight();                // get number of pixels header taking up, Y-axis.
        if (argsObject.viewportWidth > argsObject.viewportHeight) {              // if viewport aspect ratio is landscape shaped.
            argsObject.gameboardLengthOfSide = argsObject.viewportHeight * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        else {                                                   // else viewport aspect ratio is portrait shaped.
            argsObject.gameboardLengthOfSide = argsObject.viewportWidth * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        // find upper left corner of container - X coordinate.
        argsObject.zeroCoordinateX = (argsObject.viewportWidth / 2) - (argsObject.gameboardLengthOfSide / 2);
        argsObject.zeroCoordinateY = argsObject.headerHeight + 60; // find upper left corner of container - Y coordinate. ( 60 pixels down from header )
    }

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        argsObject.paper.drawnLine(20, 132, 380, 132, 5).attr({'stroke': 'red', 'stroke-width': 2});  // draw 4 lines of the game board.
        argsObject.paper.drawnLine(20, 262, 380, 264, 5).attr({'stroke': 'red', 'stroke-width': 2});
        argsObject.paper.drawnLine(132, 20, 132, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        argsObject.paper.drawnLine(262, 20, 262, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        addClickdetectPad();
        for (var i = 0; i < argsObject.moves.length; i++) {      // iterate over array of moves on put them on the game board. ( for resize )
            if ((argsObject.moves[i] !== 'U')) {
                argsObject.moves[i] === 'X' ? drawX(i) : drawO(i);
            }
        }
    }

    /* function addClickDetectPad() adds a square area to each square on the game board that will be sensitive to a mouse click. */
    function addClickdetectPad() {
        var temp;
        var temp2;
        for (var i = 0; i < argsObject.coordCenterSquare.length; i++) {  // loop once for each game board square.
            temp = i;
            temp2 = argsObject.paper.rect(argsObject.coordCenterSquare[i][0] - 50, argsObject.coordCenterSquare[i][1] - 50, 120, 120).attr({
                'stroke': '#ffa500',
                'fill': '#ffa500'
            });
            temp2.node.setAttribute('class', 'clickPad');        // add class "clickPad" to each.
            temp2.node.setAttribute('id', temp);                 // add an id to each.
        }
    }

    /* function makeMove() is passed a tile number and whose turn it currently is, and then calls a function to have drawn
     * the appropriate X or O mark on the board. */
    function makeMove(tilePicked, whoseTurn) {
        var promise;
        var finished = false;
        if (argsObject.playerPiece !== '') {                     // board state disabled unless player selected a Mark.
            if (whoseTurn === 'player' && argsObject.playersTurn) {      // players tern to move.
                argsObject.playersTurn = !argsObject.playersTurn;        // flip player / AI state.
                argsObject.movesCounter++;
                promise = new Promise(function(resolve, reject) {
                    finished = argsObject.playerPiece === 'X' ? drawX(tilePicked) : drawO(tilePicked);     // draw Mark.
                    if(finished) {
                        resolve();
                    }
                });
            }
            else if (whoseTurn === 'AI' && !argsObject.playersTurn) {    // AIs turn to move
                argsObject.playersTurn = !argsObject.playersTurn;        // flip player / AI state.
                argsObject.movesCounter++;
                promise = new Promise(function(resolve, reject) {
                    finished = argsObject.playerPiece === 'X' ? drawO(tilePicked) : drawX(tilePicked);   // draw Mark.
                    if(finished) {
                        resolve();
                    }
                });
            }
        }
        promise.then(function() {
            setTimeout(function() {
                return true;
            },100);
        });
    }

    /* function drawX() draws a stylized X on the board. The parameter 'square' is an integer from 0 - 8
     * and corresponds to the board position to place the X. */
    function drawX(square) {
        argsObject.moves[square] = 'X';                          // update the moves array - it tracks all moves.
        argsObject.paper.drawnCircularArc(argsObject.coordCenterSquare[square][0] + 25,  // use +25px offset from x center.
            argsObject.coordCenterSquare[square][1] + 17, 20, 100, 260).attr({
            'stroke': 'blue',
            'stroke-width': 4
        });
        argsObject.paper.drawnCircularArc(argsObject.coordCenterSquare[square][0] - 14,  // use -14px offset from x center.
            argsObject.coordCenterSquare[square][1] + 14, 20, 270, 80).attr({
            'stroke': 'blue',
            'stroke-width': 4
        });
        argsObject.nowPlaying = 'X';
        setTimeout(function() {
            checkForWinOrTie();
        },100);
    }

    /* function drawO() draws a stylized O on the board. The parameter 'square' is an integer value from 0 - 8
     * and corresponds to the board position to place the O. */
    function drawO(square) {
        argsObject.moves[square] = 'O';                          // update the moves array - it tracks all moves.
        argsObject.paper.drawnCircle(argsObject.coordCenterSquare[square][0] + 10,   // use -10px offset from o center.
            argsObject.coordCenterSquare[square][1] + 14, 23, 3).attr({
            'stroke': 'blue',
            'stroke-width': 4
        });
        argsObject.nowPlaying = 'O';
        setTimeout(function() {
            checkForWinOrTie();
        },100);
    }

    /* function drawWinningLine() is called when either the player or AI wins.  The function draws a straight line
     * through the three winning Marks. The parameter winningPattern tells the function where to draw the line. */
    function drawWinningLine(winningPattern) {
        var drawWinningLinePaths = [[[66, 36], [66, 360]], [[195, 36], [195, 364]], [[320, 36], [320, 364]], [[36, 76], [360, 76]], [[36, 198], [360, 198]],
            [[36, 330], [360, 330]], [[36, 44], [360, 368]], [[36, 360], [360, 36]]];      // vector paths for drawing the winning line.
        var whichPath = drawWinningLinePaths[winningPattern];                              // pick the appropriate path for the winning combination.
        var selectedPath = ('M' + whichPath[0][0] + ' ' + whichPath[0][1] + 'L' + whichPath[1][0] + ' ' + whichPath[1][1] );  // build path string.
        argsObject.paper.path(selectedPath).attr({'stroke': 'green', 'stroke-width': 2});  // draw the line.
    }

    /* function makeRandomMove() picks a random move out of still available open squares. Parameter maxValue is the largest random
     * number (inclusive) to be returned. */
    function makeRandomMove(maxValue) {
        var randomNumber = Math.floor(Math.random() * (maxValue + 1));
        while (argsObject.moves[randomNumber] !== 'U') {         // test if square is occupied, loop until un-occupied.
            randomNumber = Math.floor(Math.random() * (maxValue + 1));
        }
        return randomNumber;
    }

    /* function nextMoveWinTest() explores if possible to make a winning move by current player. Returns winning square
     * if there is one. Passed argument is X or O. */
    function nextMoveWinTest(player) {
        var moves = '';
        var win = ['m', 'm', 'm'];                               // set all "hit" slots to "m" for missed hit.
        var hits = 0;                                            // holds number of hits found.
        for (var i = 0; i < 9; i++) {                            // loop through all game board squares.
            if (argsObject.moves[i] === player) {                // test if square holds player/AI Mark.
                moves = moves + i;                               // add square number if found.
            }
        }
        for (var k = 0; k < argsObject.allWinningCombos.length; k++) {   // check each possible winning combination.
            win = ['m', 'm', 'm'];                               // reset to 'missed' for next loop.
            hits = 0;                                            // reset hit counter for next loop.
            breakToHere:                                         // Label for 'continue' statement.
                for (var j = 0; j < 3; j++) {                    // loop once for each move in this winning combination.
                    if (moves.indexOf(argsObject.allWinningCombos[k][j]) === -1) { // test if no match for this move.
                        continue breakToHere;                    // if no match go on to next winning combination.
                    }
                    win[j] = 'h';                                // if match record h for hit.
                    hits++;                                      // increment hit counter.
                    if (hits === 2) {                            // when 'true' found 2 out of 3 matches in a winning combination.
                        var temp = win.indexOf('m');             // find index of third element.
                        temp = argsObject.allWinningCombos[k][temp];     // convert index to a square on the board.
                        if (argsObject.moves[temp] === 'U') {    // test if square is occupied, and if not, found a winning move.
                            return temp;                         // return winning move.
                        }
                    }
                }
        }
        return -1;                                               // return -1 if no winning move found.
    }

    /* function normalModePlay() sets the game to play in 'normal' mode, function picks AIs next move.
     *  Normal mode consists of the AI making Random moves. */
    function normalModePlay() {
        var randomNumber;
        if (argsObject.playerPiece === 'O' && argsObject.movesCounter % 2 === 0) {   // if player picked 'O' mark AND its the AI's move.
            randomNumber = Math.floor(Math.floor(Math.random() * 9));                // pick a random number 0 to 8 inclusive.
            while (argsObject.moves[randomNumber] !== 'U') {     // test if move was already made.
                randomNumber = Math.floor(Math.random() * 9);    // pick next random number.
            }
            makeMove(randomNumber, 'AI');                        // found a move, call makeMove().
        }
        else if (argsObject.playerPiece === 'X' && argsObject.movesCounter % 2 !== 0) {  // if player picked 'X' mark AND its the AI's move.
            randomNumber = Math.floor(Math.floor(Math.random() * 9));
            while (argsObject.moves[randomNumber] !== 'U') {
                randomNumber = Math.floor(Math.floor(Math.random() * 9));
            }
            makeMove(randomNumber, 'AI');
        }
    }

    /* function hardlModePlay() sets the game to play in 'hard' mode, function looks for AIs next move.
     * Hard mode consists of the AI making intelligent moves. At best Player can tie, but not win. */
    function hardModePlay() {
        var corners = [0, 2, 6, 8];                              // array of game board corners.
        var edges = [1, 3, 5, 7];                                // array of game board edges.
        var openingMoves = [0, 2, 4, 6, 8];                      // array of allowed AI opening moves.
        var move = '';                                           // holds the decided upon AI move (returned value).
        var randomNum;                                           // holds a random number.
        var winningMoveX = -1;                                   // holds found winning X move, -1 move not found.
        var winningMoveO = -1;                                   // holds found winning O move, -1 move not found.
        var lastAI = argsObject.lastMoveAI;                      // holds the last move by the AI.
        var lastPlayer = '';                                     // holds the Players last move.
        if (argsObject.lastClickedSquare !== null) {             // 'null' if Player has not moved yet.
            lastPlayer = parseInt(argsObject.lastClickedSquare); // record last move.
        }
        /* Player picked 'O', AI is making the first move. */
        if (argsObject.playerPiece === 'O' && argsObject.movesCounter % 2 === 0) {
            // *****AIs first move.*****
            if (argsObject.movesCounter === 0) {
                move = openingMoves[makeRandomMove(4)];          // randomize an allowed opening move. ( makes game seem more natural )
            }
            // *****AIs second move.*****
            else if (argsObject.movesCounter === 2) {
                if (lastPlayer === 4) {                                              // player picked center square.
                    if (lastAI === 0) {
                        move = 8;
                    }
                    else if (lastAI === 2) {
                        move = 6;
                    }
                    else if (lastAI === 6) {
                        move = 0;
                    }
                    else if (lastAI === 8) {
                        move = 2;
                    }
                }
                else if ((lastPlayer === 1 || lastPlayer === 7) && lastAI !== 4) {   // player picked edge 1 or 7.
                    if (lastAI === 0) {
                        move = 6;
                    }
                    else if (lastAI === 2) {
                        move = 8;
                    }
                    else if (lastAI === 6) {
                        move = 0;
                    }
                    else if (lastAI === 8) {
                        move = 2;
                    }
                }
                else if ((lastPlayer === 3 || lastPlayer === 5) && lastAI !== 4) {   // player picked edge 3 or 5.
                    if (lastAI === 0) {
                        move = 2;
                    }
                    else if (lastAI === 2) {
                        move = 0;
                    }
                    else if (lastAI === 6) {
                        move = 8;
                    }
                    else if (lastAI === 8) {
                        move = 6;
                    }
                }
                else if (lastPlayer === 0 && lastAI !== 4) {                         // player picked corner 0.
                    if (lastAI === 2) {
                        move = 8;
                    }
                    else if (lastAI === 6) {
                        move = 8;
                    }
                    else if (lastAI === 8) {
                        move = 2;
                    }
                }
                else if (lastPlayer === 2 && lastAI !== 4) {                         // player picked corner 2.
                    if (lastAI === 0) {
                        move = 6;
                    }
                    else if (lastAI === 6) {
                        move = 0;
                    }
                    else if (lastAI === 8) {
                        move = 6;
                    }
                }
                else if (lastPlayer === 6 && lastAI !== 4) {                         // player picked corner 6.
                    if (lastAI === 0) {
                        move = 2;
                    }
                    else if (lastAI === 2) {
                        move = 0;
                    }
                    else if (lastAI === 8) {
                        move = 2;
                    }
                }
                else if (lastPlayer === 8 && lastAI !== 4) {                         // player picked corner 8.
                    if (lastAI === 0) {
                        move = 2;
                    }
                    else if (lastAI === 2) {
                        move = 0;
                    }
                    else if (lastAI === 6) {
                        move = 0;
                    }
                }
                else if (lastAI === 4 && (lastPlayer === 1 || lastPlayer === 5)) {   // AI in center && player picked edge 1 or 5.
                    move = 6;
                }
                else if (lastAI === 4 && (lastPlayer === 3 || lastPlayer === 7)) {   // AI in center && player picked edge 3 or 7.
                    move = 2;
                }
                else if (lastAI === 4 && lastPlayer === 0) {     // AI in center && player picked corner 0.
                    move = 8;
                }
                else if (lastAI === 4 && lastPlayer === 2) {     // AI in center && player picked corner 2.
                    move = 6;
                }
                else if (lastAI === 4 && lastPlayer === 6) {     // AI in center && player picked corner 6.
                    move = 2;
                }
                else if (lastAI === 4 && lastPlayer === 8) {     // AI in center && player picked corner 8.
                    move = 0;
                }
            }
            // *****AIs third move.*****
            else if (argsObject.movesCounter === 4) {
                winningMoveO = nextMoveWinTest('O');             // could be a winning move here, test for winning move.
                winningMoveX = nextMoveWinTest('X');
                if (lastPlayer === 1 && argsObject.moves[4] !== 'U') {               // if player blocked win using square 1, center open.
                    argsObject.moves[6] !== 'U' ? 8 : 6;
                }
                else if (lastPlayer === 3 && argsObject.moves[4] !== 'U') {          // if player blocked win using square 3, center open.
                    argsObject.moves[2] !== 'U' ? 8 : 2;
                }
                else if (lastPlayer === 5 && argsObject.moves[4] !== 'U') {          // if player blocked win using square 5, center open.
                    argsObject.moves[0] !== 'U' ? 6 : 0;
                }
                else if (lastPlayer === 7 && argsObject.moves[4] !== 'U') {          // if player blocked win using square 7, center open.
                    argsObject.moves[0] !== 'U' ? 2 : 0;
                }
                else if (argsObject.moves[4] === 'U') {                              // catch remaining conditions.
                    move = 4;
                }
                // players last move to corner && player in center.
                else if (argsObject.moves[4] === 'O' && (lastPlayer === 0 || lastPlayer === 2 || lastPlayer === 6 || lastPlayer === 8)) {
                    if (argsObject.moves[0] === 'U') {                               // pick last still open corner.
                        move = 0;
                    }
                    else if (argsObject.moves[2] === 'U') {
                        move = 2;
                    }
                    else if (argsObject.moves[6] === 'U') {
                        move = 6;
                    }
                    else if (argsObject.moves[8] === 'U') {
                        move = 8;
                    }
                }
                // player last move to edge && player in center.
                else if (argsObject.moves[4] === 'O' && (lastPlayer === 1 || lastPlayer === 3 || lastPlayer === 5 || lastPlayer === 7)) {
                    if (lastPlayer === 1) {                                          // pick opposite edge.
                        move = 0;
                    }
                    else if (lastPlayer === 3) {
                        move = 5;
                    }
                    else if (lastPlayer === 5) {
                        move = 3;
                    }
                    else if (lastPlayer === 7) {
                        move = 1;
                    }
                }
                // AI in center && player last move an edge.
                else if (argsObject.moves[4] === 'X' && (lastPlayer === 1 || lastPlayer === 3 || lastPlayer === 5 || lastPlayer === 7)) {
                    if (lastAI === 0 && lastPlayer === 1) {
                        move = 6;
                    }
                    else if (lastAI === 0 && lastPlayer === 3) {
                        move = 2;
                    }
                    else if (lastAI === 2 && lastPlayer === 1) {
                        move = 8;
                    }
                    else if (lastAI === 2 && lastPlayer === 5) {
                        move = 0;
                    }
                    else if (lastAI === 6 && lastPlayer === 3) {
                        move = 8;
                    }
                    else if (lastAI === 6 && lastPlayer === 7) {
                        move = 0;
                    }
                    else if (lastAI === 8 && lastPlayer === 5) {
                        move = 6;
                    }
                    else if (lastAI === 8 && lastPlayer === 7) {
                        move = 2;
                    }
                }
                if (winningMoveO !== -1) {                                           // test if there is a winning player move to block.
                    move = winningMoveO;
                }
                else if (winningMoveX !== -1) {                                      // test if there is a AI winning move.
                    move = winningMoveX;
                }
            }
            // *****AIs forth move.*****
            else if (argsObject.movesCounter === 6) {
                winningMoveO = nextMoveWinTest('O');
                winningMoveX = nextMoveWinTest('X');
                if (winningMoveO !== -1) {                                           // test if there is a winning player move to block.
                    move = winningMoveO;
                }
                else if (winningMoveX !== -1) {                                      // test if there is a AI winning move.
                    move = winningMoveX;
                }
                else {
                    move = makeRandomMove(8);                                        // else make a random move.
                }
            }
            // *****AIs last move.*****
            else if (argsObject.movesCounter === 8) {
                move = argsObject.moves.indexOf('U');                                // pick last available move.
            }
            argsObject.lastMoveAI = move;                                            // record AIs move.
            makeMove(move, 'AI');                                                    // make the move.
        }
        /************************************************************************************************************************
         ************************************************************************************************************************/
        /* Player picked 'X', Player moved first and now it is the AIs turn. */
        else if (argsObject.playerPiece === 'X' && argsObject.movesCounter % 2 !== 0) {
            // *****AIs first move.*****
            if (argsObject.movesCounter === 1) {
                if (lastPlayer === 4) {                                              // player picked center square for their first move.
                    move = corners[Math.floor(Math.random() * 4)];                   // AI plays a random corner.
                }
                else {
                    move = 4;                                                        // if player picked other than center, AI picks the center.
                }
            }
            // *****AIs second move.*****
            else if (argsObject.movesCounter === 3) {
                // AI in center and player last move was a corner.
                if (lastAI === 4 && (lastPlayer === 0 || lastPlayer === 2 || lastPlayer === 6 || lastPlayer === 8)) {
                    randomNum = Math.floor(Math.random() * 4);
                    while (argsObject.moves[edges[randomNum]] !== 'U') {
                        randomNum = Math.floor(Math.random() * 4);                   // AI picks any edge.
                    }
                    move = edges[randomNum];
                }
                // AI in center and player last move was a edge.
                else if (lastAI === 4 && (lastPlayer === 1 || lastPlayer === 3 || lastPlayer === 5 || lastPlayer === 7)) {
                    if (argsObject.moves[0] === 'X' && lastPlayer === 5) {
                        move = 7;
                    }
                    else if (argsObject.moves[0] === 'X' && lastPlayer === 7) {
                        move = 5;
                    }
                    else if (argsObject.moves[2] === 'X' && lastPlayer === 3) {
                        move = 7;
                    }
                    else if (argsObject.moves[2] === 'X' && lastPlayer === 7) {
                        move = 3;
                    }
                    else if (argsObject.moves[6] === 'X' && lastPlayer === 1) {
                        move = 5;
                    }
                    else if (argsObject.moves[6] === 'X' && lastPlayer === 5) {
                        move = 1;
                    }
                    else if (argsObject.moves[8] === 'X' && lastPlayer === 1) {
                        move = 3;
                    }
                    else if (argsObject.moves[8] === 'X' && lastPlayer === 3) {
                        move = 1;
                    }
                    else if ((argsObject.moves[1] === 'X' && argsObject.moves[3] === 'X') || (argsObject.moves[5] === 'X' && argsObject.moves[7] === 'X')) {
                        move = 6;
                    }
                    else if ((argsObject.moves[1] === 'X' && argsObject.moves[5] === 'X') || (argsObject.moves[3] === 'X' && argsObject.moves[7] === 'X')) {
                        move = 8;
                    }
                }
                else if (argsObject.moves[4] === 'X') {                               // player in the center, AI on a corner.
                    if ((lastPlayer === 0 && lastAI === 8) || (lastPlayer === 8 && lastAI === 0)) {   // player picks another open corner.
                        move = 2;
                    }
                    else if ((lastPlayer === 2 && lastAI === 6) || (lastPlayer === 6 && lastAI === 2)) {
                        move = 0;
                    }
                    else {
                        randomNum = Math.floor(Math.random() * 4);
                        while (argsObject.moves[edges[randomNum]] !== 'U') {
                            randomNum = Math.floor(Math.random() * 4);               // all other conditions AI picks any edge.
                        }
                        move = edges[randomNum];
                    }
                }
            }
            // *****AIs third move.*****
            else if (argsObject.movesCounter === 5) {
                if (argsObject.moves[4] === 'O') {                                   // if AI in the center.
                    randomNum = Math.floor(Math.random() * 4);
                    while (argsObject.moves[edges[randomNum]] !== 'U') {
                        randomNum = Math.floor(Math.random() * 4);                   // AI picks any edge.
                    }
                    move = edges[randomNum];
                }
                else {                                                               // else make a random available move.
                    move = makeRandomMove(8);
                }
            }
            // *****AIs forth move.*****
            else if (argsObject.movesCounter === 7) {
                move = makeRandomMove(8);                                            // make a random available move.
            }
            winningMoveO = nextMoveWinTest('O');
            winningMoveX = nextMoveWinTest('X');
            if (winningMoveO !== -1) {                                               // test if there is a AI winning move.
                move = winningMoveO;
            }
            else if (winningMoveX !== -1) {                                          // test if there is a winning player move to block.
                move = winningMoveX;
            }
            argsObject.lastMoveAI = move;                                            // record AIs move.
            makeMove(move, 'AI');                                                    // make the move.
        }
    }

    /* function checkForWinOrTie() does just that - tests the current board moves to see if there is a win, lose or tie
     * on the board.  If found a popup informs the player, and closing the popup resets the board for a new game. */
    function checkForWinOrTie() {
        var checkTheseMoves = '';                                // holds moves made so far by either X or O.
        var won = false;                                         // holds win flag.
        var tripped = false;                                     // holds flag to say win, lose or tie reached.
        var winningPattern = -1;
        if (argsObject.movesCounter > 4) {                       // ignore less than 5 moves, takes at least 5 to win.
            for (var i = 0; i < 9; i++) {
                if (argsObject.moves[i] === argsObject.nowPlaying) {                 // collect current players moves.
                    checkTheseMoves = checkTheseMoves + i;
                }
            }
            if (checkTheseMoves.length > 2) {                    // no need to check if not at least 3 'X' or 'O' moves.
                for (var k = 0; k < argsObject.allWinningCombos.length; k++) {       // loop once for each possible winning combination.
                    winningPattern++;
                    for (var j = 0; j < argsObject.allWinningCombos[k].length; j++) {  // check each move in this winning combination.
                        if (checkTheseMoves.indexOf(argsObject.allWinningCombos[k][j]) === -1) { // test if no match for this move.
                            break;                               // if no match break and go on to test next winning combination.
                        }
                        if (j === 2) {
                            won = true;                          // if all 3 winning move positions matched, someone won.
                        }
                    }
                    if (won) {                                   // if winning combination found, won is true.
                        drawWinningLine(winningPattern);
                        tripped = true;
                        setTimeout(function() {
                            if (!argsObject.playersTurn) {           // if won == true and playersTurn == false, player is the winner.
                                reset(true, 'You Won!');             // reset for next game.
                            }
                            else {                                   // else it was the AI's win.
                                reset(true, 'You Lose!');            // reset for next game.
                            }
                        },100);
                    }
                    if (k === 7) {                               // true if all possible winning combinations have been tested.
                        tripped = true;
                    }
                    if (tripped) {                               // true if any condition tripped the flag.
                        break;
                    }
                }
                if (argsObject.movesCounter === 9 && !won) {     // all 9 moves taken, and its a tie.
                    reset(true, 'Its a Tie!');                   //  reset for next game.
                }
            }
        }
    }

    /* function xClicked() is responsible to style the users selection of the X Mark radio button. */
    function xClicked() {
        argsObject.playerPiece = 'X';                            // record the users selection.
        argsObject.xRef.style.backgroundColor = '#FFA500';       // style radio button label X.
        argsObject.xRef.style.color = 'black';
        argsObject.xRef.style.border = 'solid 2px #7B56A7';
        argsObject.xRef.style.borderRadius = '0.6em';
        argsObject.xRef.style.padding = '1px 0 1px 5px';
        argsObject.xRef.style.margin = '0 5px 0 0';
        argsObject.oRef.style.backgroundColor = 'transparent';   // style radio button label O.
        argsObject.oRef.style.color = 'orange';
        argsObject.oRef.style.border = 'none';
        argsObject.oRef.style.borderRadius = '0';
        argsObject.oRef.style.padding = '0';
        argsObject.oRef.style.margin = '0';
        argsObject.playersTurn = true;                           // set - its the players turn to move.
    }

    /* function oClicked() is responsible to style the users selection of the O Mark radio button. */
    function oClicked() {
        argsObject.playerPiece = 'O';                            // record the users selection.
        argsObject.oRef.style.backgroundColor = '#FFA500';       // style radio button label O.
        argsObject.oRef.style.color = 'black';
        argsObject.oRef.style.border = 'solid 2px #7B56A7';
        argsObject.oRef.style.borderRadius = '0.6em';
        argsObject.oRef.style.padding = '1px 3px 1px 2px';
        argsObject.oRef.style.margin = '0 5px 0 0';
        argsObject.xRef.style.backgroundColor = 'transparent';   // style radio button label X.
        argsObject.xRef.style.color = 'orange';
        argsObject.xRef.style.border = 'none';
        argsObject.xRef.style.borderRadius = '0';
        argsObject.xRef.style.padding = '0';
        argsObject.xRef.style.margin = '0';
    }

    /* function selectMode() steers game play in the correct game mode. */
    function selectMode() {
        if (argsObject.mode === 'normal') {
            normalModePlay();
        }
        else {
            hardModePlay();
        }
    }

    /* Listener added to detect player's choice of playing as X or O.  Once fired the group is disabled from further changes. */
    $(':radio').click(function (e) {
        document.getElementById('radioO').disabled = true;       // disable radio buttons.
        document.getElementById('radioX').disabled = true;
        if (e.currentTarget.id === 'radioX') {                   // test if user picked 'X'.
            xClicked();                                          // if user picked 'X' style for that choice.
            selectMode();                                        // play first move.
        }
        else {
            oClicked();                                          // else user picked 'O' style for that choice.
            selectMode();                                        // play AIs first move.
        }
    });

    /* Listener added to detect if player has chosen to switch from playing 'X' for 'O', or from playing 'O' for 'X'. */
    $('#change').click(function () {                             // detect 'Change Mark' button clicked.
        argsObject.playerPiece === 'X' ? oClicked() : xClicked();
        reset(false, '');                                        // start a new game.
    });

    /* Listener added to detect when a player has made a move, and which square was clicked. Update game board and record move. */
    $('#canvas_container').on('click', '.clickPad', function (e) {      // syntax for Listener on dynamically created content.
        argsObject.lastClickedSquare = e.currentTarget.id;       // get id of clicked square.
        var promise;
        var finished = false;
        if (argsObject.moves[argsObject.lastClickedSquare] === 'U') {   // test that square was available.
            promise = new Promise(function(resolve, reject) {
                finished = makeMove(argsObject.lastClickedSquare, 'player');    // execute players move.
                setTimeout(function() {
                    resolve();
                },100);
            });
        }
        promise.then(function() {
            setTimeout(function() {
                selectMode();                                // its now AIs turn.
            }, 200);                                         // slight delay in AI making move, just cosmetic.
        });
    });

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();                              // get new board dimensions.
        argsObject.paper.clear();                                // clear the canvas.
        drawBoard();                                             // re-draw the board using new dimensions.
    });

    /* Listener added to detect if player has chosen to switch play mode - Normal to Hard or vise versa. */
    $('#mode').click(function () {                                // detect 'Change Mode' button clicked.
        var current = $(this).html();                            // retrieve current state.
        if (current === 'Select Hard Mode') {
            $(this).html('Select Normal Mode');                  // change button text.
            argsObject.mode = 'hard';                            // toggle to 'Hard' mode.
        }
        else {
            $(this).html('Select Hard Mode');                    // change button text.
            argsObject.mode = 'normal';                          // toggle to 'Normal' mode.
        }
        reset();                                                 // start a new game.
    });

    /* function reset() starts a new game. If the previous game went to a win, lose or tie the argument 'useAlert' is true
     * and the argument 'message' tells the user via a popup if they won, lost, or had a tie. */
    function reset(useAlert, message) {
        if (useAlert) {                                          // true if there is a message to the player.
            alert(message);
        }
        argsObject.movesCounter = 0;                             // reset moves counter to zero moves.
        argsObject.moves = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];  // reset board moves all to 'unoccupied'.
        argsObject.paper.clear();                                // clear the canvas.
        drawBoard();                                             // draw a new game board.
        argsObject.ended = false;                                // reset flag.
        if (argsObject.playerPiece === 'X') {                    // test if player is playing 'X'.
            argsObject.playersTurn = true;                       // 'X' moves first - its the players turn.
            argsObject.nowPlaying = 'X';                         // 'X' is currently being played.
        }
        else {                                                   // else player is playing 'O'.
            argsObject.playersTurn = false;                      // its the AIs turn.
            argsObject.nowPlaying = 'O';                         // 'O' is currently being played.
        }
        selectMode();                                            // play first round, either 'Normal' or 'Hard'.
    }

    /* program entry point */
    init();
})();
