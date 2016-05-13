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
    
    /* function init() runs at the beginning of the program to initialize variables and settings. */
    function init() {
        calculateBoardDimensions();
        paper = Raphael('canvas_container', gameboardLengthOfSide, gameboardLengthOfSide);
        //svg = document.querySelector('svg');
        // svg.attr({'width': gameboardLengthOfSide});
        // svg.attr({'height': gameboardLengthOfSide});
        // svg.removeAttribute('width');  // Raphael sets an absolute width on svg, remove this for proper scaling.
        // svg.removeAttribute('height'); // Raphael sets an absolute height on svg, remove this for proper scaling.
    }



    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        paper.setViewBox(0, 5, gameboardLengthOfSide, gameboardLengthOfSide, true);
        paper.drawnRect(10, 10, gameboardLengthOfSide / 2, gameboardLengthOfSide / 2, 2).attr({'stroke': 'red', 'stroke-width': 2});
        paper.add([
            {
                type: 'rect',
                x: 20,
                y: 20,
                width: 100,
                height: 100,
                r: 40,
                fill: 'blue'
            }]);
        paper.drawnLine(50, 50, 200, 200, 2).attr({'stroke': 'red', 'stroke-width': 2});
        paper.drawnCircularArc(200, 200, 20, 90, 270).attr({'stroke': 'blue', 'stroke-width': 4});
        paper.drawnCircularArc(162, 200, 20, 270, 90).attr({'stroke': 'blue', 'stroke-width': 4});
        paper.path('M30 230H390');
    }

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        paper.clear();  // working.
        drawBoard();
    });

    /* run at start of program */
    init();
    $(window).trigger('resize');
}) ();
