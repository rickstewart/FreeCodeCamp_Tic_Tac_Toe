/**
 * Created by Rick Stewart on 05/10/2016.
 */

/**
 * set JSHint not to flag these variables as 'unresolved variable'
 * @param Raphael
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
    var viewportHeight;                          // holds the height dimension of the viewport.
    var viewportWidth;                           // holds the width dimension of the viewport.
    var headerHeight;                            // holds the height dimension of the page header.
    var gameboardLengthOfSide;                   // holds the length of a side of the playing board.
    var zeroCoordinateX;                         // holds the X coordinate of the upper left corner of the board.
    var zeroCoordinateY;                         // holds the Y coordinate of the upper left corner of the board.
    var paper;                                   // holds a reference to the Raphael object.
    var svg;                                     // holds a reference to the svg object.
    var moves;                                   // holds player and AI game moves.
    var coordCenterSquare;                       // holds map of (x, y) of center of each board square.
    var lastClickedSquare;                       // holds the name of the last clicked game board square.
    var movesCounter;                            // holds a running count of moves made.
    var playerPiece;                             // holds player's choice of playing X ro O.
    var xRef;                                    // holds a reference to radio button X label.
    var oRef;                                    // holds a reference to radio button O label.

    /* function calculateBoardDimensions() updates the variables holding the board dimensions, as well as
     the dimensions of the container holding the board. */
    function calculateBoardDimensions() {
        viewportHeight = window.innerHeight;     // get current height of viewport.
        viewportWidth = window.innerWidth;       // get current width of viewport.
        headerHeight = jQuery('header').outerHeight();   // get number of pixels header taking up, Y-axis.
        if (viewportWidth > viewportHeight) {    // if viewport aspect ratio is landscape shaped.
            gameboardLengthOfSide = viewportHeight * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        else {                                   // else viewport aspect ratio is portrait shaped.
            gameboardLengthOfSide = viewportWidth * 0.5;  // calculate length of a side of board container. ( container is square )
        }
        zeroCoordinateX = (viewportWidth / 2) - (gameboardLengthOfSide / 2);  // find upper left corner of container - X coordinate.
        zeroCoordinateY = headerHeight + 60; // find upper left corner of container - Y coordinate. ( 60 pixels down from header )
    }

    /* function drawO() draws a stylized O on the board. The parameter 'square' is an integer value from 0 - 8
     * and corresponds to the board position to place the O. */
    function drawO(square) {
        // paper.drawnCircle(centerX, centerY, radius, wobble)
        paper.drawnCircle(coordCenterSquare[square][0] + 10, coordCenterSquare[square][1] + 14, 23, 3).attr({'stroke': 'blue', 'stroke-width': 4}); //  use +20px offset from x center.
    }

    /* function drawX() draws a stylized X on the board. The parameter 'square' is an integer from 0 - 8
     * and corresponds to the board position to place the X. */
    function drawX(square) {
        //  use +20px offset from x center.
        paper.drawnCircularArc(coordCenterSquare[square][0] + 25, coordCenterSquare[square][1] + 17, 20, 100, 260).attr({'stroke': 'blue', 'stroke-width': 4});
        //  use -20px offset from x center.
        paper.drawnCircularArc(coordCenterSquare[square][0] - 14, coordCenterSquare[square][1] + 14, 20, 270, 80).attr({'stroke': 'blue', 'stroke-width': 4});
    }

    /*  */
    function makeMove(square) {
        if(playerPiece !== '') {                                   // test to make sure player picked a marker, else board disabled.
            moves[square] = playerPiece;                           // record move.
            playerPiece === 'X' ? drawX(square) : drawO(square);   // update game board.
        }
    }

    /* function addClickDetectPad() adds a square area to each square on the game board that will be sensitive to a mouse click. */
    function addClickdetectPad() {
        var temp;
        var temp2;
        for(var i = 0; i < coordCenterSquare.length; i+=1) {
            temp = i;
            temp2 = paper.rect(coordCenterSquare[i][0] - 50, coordCenterSquare[i][1] - 50, 120, 120).attr({'stroke': '#ffa500', 'fill': '#ffa500'});
            temp2.node.setAttribute('class', 'clickPad');
            temp2.node.setAttribute('id', temp);
        }
    }

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        paper.drawnLine(20, 132, 380, 132, 5).attr({'stroke': 'red', 'stroke-width': 2});  // draw 4 lines of game board.
        paper.drawnLine(20, 262, 380, 264, 5).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnLine(132, 20, 132, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnLine(262, 20, 262, 380, 5).attr({'stroke': 'red', 'stroke-width': 2});
        addClickdetectPad();
        for(var i = 0; i < moves.length; i+=1) {          // iterate over array of moves on put them on the game board.
            if((moves[i] !== 'U')) {
                moves[i] === 'X' ? drawX(i) : drawO(i);
            }
        }
    }

    /* function init() runs at the beginning of the program to initialize variables and settings. */
    function init() {
        moves = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];   // U is unoccupied square, one for each of 9 positions.
        playerPiece = '';
        movesCounter = 0;
        xRef = document.getElementById('X');
        oRef = document.getElementById('O');
        coordCenterSquare = [[60, 60], [188, 60], [316, 60], [60, 188], [188, 188], [318, 188], [60, 316], [188, 318], [318, 318]];
        calculateBoardDimensions();
        paper = Raphael('canvas_container');     // create new Raphael object.
        paper.setViewBox(0, 0, 400, 400, true);  // anchor viewbox to upper left corner of canvas_container, size 400 X 400 px.
        svg = document.querySelector('svg');
        svg.removeAttribute('width');            // Raphael sets an absolute width on svg, removed for proper scaling.
        svg.removeAttribute('height');           // Raphael sets an absolute height on svg, removed for proper scaling.
        drawBoard();
    }
    
    /* Listener attached to radio button group.  When fired the group is disabled from further changes. Choice highlighted. */
    $(':radio').click(function(e){
        document.getElementById('radioO').disabled = true;
        document.getElementById('radioX').disabled = true;
        movesCounter++;
        if(e.currentTarget.id === 'radioX') {
            playerPiece = 'X';
            xRef.style.backgroundColor='#FFA500';          //  style radio button label X.
            xRef.style.color='black';
            xRef.style.border='solid 2px #7B56A7';
            xRef.style.borderRadius='0.6em';
            xRef.style.padding='1px 0 1px 5px';
            xRef.style.margin='0 5px 0 0';
        }
        else {
            playerPiece = 'O';
            oRef.style.backgroundColor='#FFA500';          //  style radio button label O.
            oRef.style.color='black';
            oRef.style.border='solid 2px #7B56A7';
            oRef.style.borderRadius='0.6em';
            oRef.style.padding='1px 3px 1px 2px';
            oRef.style.margin='0 5px 0 0';

        }
        play();
    });

    /* Listener added to detect when a player has made a move, and which square was clicked. Update game board and record move. */
    $('#canvas_container').on('click', '.clickPad', function(e) {  // syntax for Listener on dynamically created content.
        lastClickedSquare = e.currentTarget.id;                    // get id of clicked square.
        makeMove(lastClickedSquare);
    });

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        paper.clear();  // working.
        drawBoard();
    });

    /* function evaluateBoard() tests the current state of all moves to test for a win or tie. */
    function evaluateBoard() {

    }
    
    /* function play() sets up a turn based loop to control the flow of the game. */
    play() {
        if(playerPiece === 'O')

    }

    /* run initialize at start of program */
    init();
})();
