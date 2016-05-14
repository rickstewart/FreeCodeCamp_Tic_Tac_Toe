/**
 * Created by Rick Stewart on 05/10/2016.
 */
/**
 * set JSHint not to flag these variables as 'unresolved variable'
 * @param channelResponse.stream
 * @param channelResponse.stream.channel
 * @param data.logo
 *
 */

/*
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
    var rect0, rect1, rect2, rect3, rect4, rect5, rect6, rect7, rect8; // one for each game board square.

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
        paper.drawnCircle(coordCenterSquare[square][0], coordCenterSquare[square][1], 23, 3).attr({'stroke': 'blue', 'stroke-width': 3}); //  use +20px offset from x center.
    }

    /* function drawX() draws a stylized X on the board. The parameter 'square' is an integer from 0 - 8
     * and corresponds to the board position to place the X. */
    function drawX(square) {
        //  use +20px offset from x center.
        paper.drawnCircularArc(coordCenterSquare[square][0] + 20, coordCenterSquare[square][1], 20, 90, 270).attr({'stroke': 'blue', 'stroke-width': 3});
        //  use -20px offset from x center.
        paper.drawnCircularArc(coordCenterSquare[square][0] - 20, coordCenterSquare[square][1], 20, 270, 90).attr({'stroke': 'blue', 'stroke-width': 3});
    }

    /* function addClickDetectPad() adds a square area to each square on the game board that will be sensitive to a mouse click. */
    function addClickdetectPad() {
        var temp;
        for(var i = 0; i < coordCenterSquare.length; i+=1) {
             temp = 'rect' + i;
             temp = paper.rect(coordCenterSquare[i][0] - 50, coordCenterSquare[i][1] - 50, 110, 110).attr({'stroke': 'red', 'stroke-width': 2, 'fill':'green'});
        }
    }

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        moves = ['U', 'X', 'O', 'U', 'O', 'O','X', 'X', 'X'];
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
        moves = ['U', 'U', 'U', 'U', 'U', 'U','U', 'U', 'U'];   // U is unoccupied square, one for each of 9 positions.
        coordCenterSquare = [[66, 70], [198, 70], [324, 70], [66, 194], [198, 194], [324, 194], [66, 320], [198, 320], [324, 320]];
        calculateBoardDimensions();
        paper = Raphael('canvas_container');     // create new Raphael object.
        paper.setViewBox(0, 0, 400, 400, true);  // anchor viewbox to upper left corner of canvas_container, size 400 X 400 px.
        svg = document.querySelector('svg');
        svg.removeAttribute('width');            // Raphael sets an absolute width on svg, removed for proper scaling.
        svg.removeAttribute('height');           // Raphael sets an absolute height on svg, removed for proper scaling.
        drawBoard();
    }

    /* Listener added to detect a player has made a move. */
    $(paper).click(function(e) {
        var offset = $(this).offset();
        alert(e.pageX - offset.left);
        alert(e.pageY - offset.top);
    });

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        paper.clear();  // working.
        drawBoard();
    });

    /* run at start of program */
    init();
})();
