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

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        paper.drawnLine(20, 132, 380, 132, 2).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnLine(20, 262, 380, 264, 2).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnLine(132, 20, 132, 380, 2).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnLine(262, 20, 262, 380, 2).attr({'stroke': 'red', 'stroke-width': 2});
    }

    /* function init() runs at the beginning of the program to initialize variables and settings. */
    function init() {
        moves = ['U', 'U', 'U', 'U', 'U', 'U','U', 'U', 'U'];   // U is unoccupied square, one for each of 9 positions.
        coordCenterSquare = [[56, 56], [188, 56], [320, 56], [56, 188], [188, 188], [320, 188], [56, 320], [188, 320], [320, 320]];
        calculateBoardDimensions();
        paper = Raphael('canvas_container');     // create new Raphael object.
        paper.setViewBox(0, 0, 400, 400, true);  // anchor viewbox to upper left corner of canvas_container, size 400 X 400 px.
        svg = document.querySelector('svg');
        svg.removeAttribute('width');            // Raphael sets an absolute width on svg, removed for proper scaling.
        svg.removeAttribute('height');           // Raphael sets an absolute height on svg, removed for proper scaling.
        drawBoard();
    }

    /* function drawX() draws a stylized X on the board. The parameter 'square' is an integer value between 1 - 9
     * and corresponds to the board position to place the X. */
    function drawX(square) {
        paper.drawnCircularArc(200, 200, 20, 90, 270).attr({'stroke': 'blue', 'stroke-width': 4});
        paper.drawnCircularArc(162, 200, 20, 270, 90).attr({'stroke': 'blue', 'stroke-width': 4});
    }

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        paper.clear();  // working.
        drawBoard();
    });

    /* run at start of program */
    init();
})();
