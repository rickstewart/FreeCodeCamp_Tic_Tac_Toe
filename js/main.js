/**
 * Created by Rick Stewart on 05/10/2016.
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
        argsObject.ended = false;                                // holds state of game play - false still playing - true game won or tied.
        argsObject.nowPlaying = '';                              // holds mark of current turn holder, player or AI.
        argsObject.xRef = document.getElementById('X');          // holds a reference to radio button X label.
        argsObject.oRef = document.getElementById('O');          // holds a reference to radio button O label.
        argsObject.coordCenterSquare = [[60, 60], [188, 60], [316, 60], [60, 188], [188, 188], [318, 188], [60, 316], [188, 318], [318, 318]];
        calculateBoardDimensions();
        argsObject.paper = Raphael('canvas_container');     // create new Raphael object.
        argsObject.paper.setViewBox(0, 0, 400, 400, true);  // anchor viewbox to upper left corner of canvas_container, size 400 X 400 px.
        argsObject.svg = document.querySelector('svg');
        argsObject.svg.removeAttribute('width');            // Raphael sets an absolute width on svg, removed for proper scaling.
        argsObject.svg.removeAttribute('height');           // Raphael sets an absolute height on svg, removed for proper scaling.
        drawBoard();
    }

    /* function calculateBoardDimensions() updates the variables holding the board dimensions, as well as
     the dimensions of the container holding the board. */
    function calculateBoardDimensions() {
        argsObject.viewportHeight = window.innerHeight;     // get current height of viewport.
        argsObject.viewportWidth = window.innerWidth;       // get current width of viewport.
        argsObject.headerHeight = jQuery('header').outerHeight();   // get number of pixels header taking up, Y-axis.
        if (argsObject.viewportWidth > argsObject.viewportHeight) {    // if viewport aspect ratio is landscape shaped.
            argsObject.gameboardLengthOfSide = argsObject.viewportHeight * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        else {                                   // else viewport aspect ratio is portrait shaped.
            argsObject.gameboardLengthOfSide = argsObject.viewportWidth * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        argsObject.zeroCoordinateX = (argsObject.viewportWidth / 2) - (argsObject.gameboardLengthOfSide / 2);  // find upper left corner of container - X coordinate.
        argsObject.zeroCoordinateY = argsObject.headerHeight + 60; // find upper left corner of container - Y coordinate. ( 60 pixels down from header )
    }

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        argsObject.paper.drawnLine(20, 132, 380, 132, 5).attr({'stroke': 'red', 'stroke-width': 2});  // draw 4 lines of game board.
        argsObject.paper.drawnLine(20, 262, 380, 264, 5).attr({'stroke': 'red', 'stroke-width': 2});
        argsObject.paper.drawnLine(132, 20, 132, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        argsObject.paper.drawnLine(262, 20, 262, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        addClickdetectPad();
        for (var i = 0; i < argsObject.moves.length; i++) {          // iterate over array of moves on put them on the game board. ( for resize )
            if ((argsObject.moves[i] !== 'U')) {
                argsObject.moves[i] === 'X' ? drawX(i) : drawO(i);
            }
        }
    }

    /* function addClickDetectPad() adds a square area to each square on the game board that will be sensitive to a mouse click. */
    // TODO test make sure user not clicking already picked square
    function addClickdetectPad() {
        var temp;
        var temp2;
        for (var i = 0; i < argsObject.coordCenterSquare.length; i++) {
            temp = i;
            temp2 = argsObject.paper.rect(argsObject.coordCenterSquare[i][0] - 50, argsObject.coordCenterSquare[i][1] - 50, 120, 120).attr({
                'stroke': '#ffa500',
                'fill': '#ffa500'
            });
            temp2.node.setAttribute('class', 'clickPad');
            temp2.node.setAttribute('id', temp);
        }
    }

    /*  */
    function makeMove(tilePicked, whoseTurn) {
        if (argsObject.playerPiece !== '') {                                  // test to make sure player picked a marker, else board disabled.
            if (whoseTurn === 'player' && argsObject.playersTurn) {
                argsObject.playersTurn = !argsObject.playersTurn;                                   // flip player / AI state.
                argsObject.movesCounter++;
                argsObject.playerPiece === 'X' ? drawX(tilePicked) : drawO(tilePicked);   // update game board.
                checkForWinOrTie();
            }
            else if (whoseTurn === 'AI' && !argsObject.playersTurn) {
                argsObject.playersTurn = !argsObject.playersTurn;            // flip player / AI state.
                argsObject.movesCounter++;
                argsObject.playerPiece === 'X' ? drawO(tilePicked) : drawX(tilePicked);   // update game board.
                checkForWinOrTie();
            }
        }
    }

    /* function drawX() draws a stylized X on the board. The parameter 'square' is an integer from 0 - 8
     * and corresponds to the board position to place the X. */
    function drawX(square) {
        argsObject.moves[square] = 'X';                                             // record move.
        //  use +20px offset from x center.
        argsObject.paper.drawnCircularArc(argsObject.coordCenterSquare[square][0] + 25, argsObject.coordCenterSquare[square][1] + 17, 20, 100, 260).attr({
            'stroke': 'blue',
            'stroke-width': 4
        });
        //  use -20px offset from x center.
        argsObject.paper.drawnCircularArc(argsObject.coordCenterSquare[square][0] - 14, argsObject.coordCenterSquare[square][1] + 14, 20, 270, 80).attr({
            'stroke': 'blue',
            'stroke-width': 4
        });
        argsObject.nowPlaying = 'X';
        checkForWinOrTie();
    }

    /* function drawO() draws a stylized O on the board. The parameter 'square' is an integer value from 0 - 8
     * and corresponds to the board position to place the O. */
    function drawO(square) {
        argsObject.moves[square] = 'O';                                            // record move.
        // paper.drawnCircle(centerX, centerY, radius, wobble)
        argsObject.paper.drawnCircle(argsObject.coordCenterSquare[square][0] + 10, argsObject.coordCenterSquare[square][1] + 14, 23, 3).attr({
            'stroke': 'blue',
            'stroke-width': 4
        }); //  use +20px offset from x center.
        argsObject.nowPlaying = 'O';
        checkForWinOrTie();
    }

    /* function play() sets up a turn based loop to control the flow of the game. */
    function play() {
        var randomNumber;
        if (argsObject.playerPiece === 'O' && argsObject.movesCounter % 2 === 0 && !argsObject.ended) {   // if player picked 'O' mark AND its the AI's move.
            randomNumber = Math.floor((Math.random() * 8) + 1);
            while (argsObject.moves[randomNumber] !== 'U') {
                randomNumber = Math.floor((Math.random() * 8) + 1);
            }
            argsObject.playersTurn = false;
            makeMove(randomNumber, 'AI');
        }
        else if (argsObject.playerPiece === 'X' && argsObject.movesCounter % 2 !== 0 && !argsObject.ended) {   // if player picked 'X' mark AND its the AI's move.
            randomNumber = Math.floor((Math.random() * 8) + 1);
            while (argsObject.moves[randomNumber] !== 'U') {
                randomNumber = Math.floor((Math.random() * 8) + 1);
            }
            argsObject.playersTurn = false;
            makeMove(randomNumber, 'AI');
        }
    }

    /*  */
    function checkForWinOrTie() {       // mark - X or O.
        var checkTheseMoves = '';            // holds moves made so far by either X or O.
        var won = false;
        if (argsObject.movesCounter > 4) {              // ignore less than 5 moves, takes at least 5 to win.
            for (var i = 0; i < 9; i++) {
                if (argsObject.moves[i] === argsObject.nowPlaying) {
                    checkTheseMoves = checkTheseMoves + i;
                }
            }
            if (checkTheseMoves.length > 2) {                               // no need to run if not at least 3 moves.
                argsObject.allWinningCombos.forEach(function (element) {             // check each possible winning combination.
                    for (var j = 0; j < element.length; j++) {
                        if (checkTheseMoves.indexOf(element[j]) === -1 && !argsObject.ended) { // test if no match for this move.
                            break;                                       // if no match break and go on to test next winning combination.
                        }
                        if (j === 2) {
                            won = true;
                        }
                    }
                    if (won && !argsObject.ended) {                // if winning combination found, won is true.
                        alert(argsObject.nowPlaying + ' won!');
                        argsObject.ended = true;
                    }
                });
                if (argsObject.movesCounter === 9 && !argsObject.ended) {
                    alert('Its a Tie!');
                    argsObject.ended = true;
                }
            }
        }
    }

    /* Listener added to detect player's choice of playing as X or O.  Once fired the group is disabled from further changes. */
    $(':radio').click(function (e) {
        document.getElementById('radioO').disabled = true;
        document.getElementById('radioX').disabled = true;
        if (e.currentTarget.id === 'radioX') {
            argsObject.playerPiece = 'X';
            argsObject.xRef.style.backgroundColor = '#FFA500';          //  style radio button label X.
            argsObject.xRef.style.color = 'black';
            argsObject.xRef.style.border = 'solid 2px #7B56A7';
            argsObject.xRef.style.borderRadius = '0.6em';
            argsObject.xRef.style.padding = '1px 0 1px 5px';
            argsObject.xRef.style.margin = '0 5px 0 0';
            argsObject.playersTurn = true;
            play();
        }
        else {
            argsObject.playerPiece = 'O';
            argsObject.oRef.style.backgroundColor = '#FFA500';          //  style radio button label O.
            argsObject.oRef.style.color = 'black';
            argsObject.oRef.style.border = 'solid 2px #7B56A7';
            argsObject.oRef.style.borderRadius = '0.6em';
            argsObject.oRef.style.padding = '1px 3px 1px 2px';
            argsObject.oRef.style.margin = '0 5px 0 0';
            play();
        }
    });

    /* Listener added to detect when a player has made a move, and which square was clicked. Update game board and record move. */
    $('#canvas_container').on('click', '.clickPad', function (e) {  // syntax for Listener on dynamically created content.
        argsObject.lastClickedSquare = e.currentTarget.id;                    // get id of clicked square.
        if (argsObject.moves[argsObject.lastClickedSquare] === 'U' && !argsObject.ended) {
            makeMove(argsObject.lastClickedSquare, 'player');
        }
        play();
    });

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        argsObject.paper.clear();  // working.
        drawBoard();
    });

    /* program entry point */
    init();
})();
