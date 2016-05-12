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
    var boardLengthOfSide;                       // holds the length of a side of the playing board.
    var zeroCoordinateX;                         // holds the X coordinate of the upper left corner of the board.
    var zeroCoordinateY;                         // holds the Y coordinate of the upper left corner of the board.
    var paper;                                   // holds a reference to the Raphael object.
    var svg;                                     // holds a reference to the svg object.

    /* function init() runs at the beginning of the program to initialize variables and settings. */
    function init() {
        paper = Raphael('canvas_container', boardLengthOfSide, boardLengthOfSide);
        svg = document.querySelector('svg');
        svg.removeAttribute('width');  // Raphael sets an absolute width on svg, remove this for proper scaling.
        svg.removeAttribute('height'); // Raphael sets an absolute height on svg, remove this for proper scaling.
    }

    /* function calculateBoardDimensions() updates the variables holding the board dimensions, as well as
     the dimensions of the container holding the board. */
    function calculateBoardDimensions() {
        viewportHeight = window.innerHeight;     // get current height of viewport.
        viewportWidth = window.innerWidth;       // get current width of viewport.
        headerHeight = jQuery('header').outerHeight();   // get number of pixels header taking up, Y-axis.
        if (viewportWidth > viewportHeight) {    // detect if viewport aspect ratio portrait or landscape shaped.
            boardLengthOfSide = viewportHeight * 0.5;  // calculate length of a side of board container. ( container is square )
            zeroCoordinateX = (viewportWidth / 2) - (boardLengthOfSide / 2);  // find upper left corner of container - X coordinate.
            zeroCoordinateY = headerHeight + 60; // find upper left corner of container - Y coordinate. ( 60 pixels down from header )
        }
        else {                                   // else if portrait.
            boardLengthOfSide = viewportWidth * 0.5;  // calculate length of a side of board container. ( container is square )
            zeroCoordinateX = (viewportWidth / 2) - (boardLengthOfSide / 2);  // find upper left corner of container - X coordinate.
            zeroCoordinateY = headerHeight + 60; // find upper left corner of container - Y coordinate. ( 60 pixels down from header )
        }
    }

    /* function drawBoard() paints the graphics unto the browser window. */
    function drawBoard() {
        paper.drawnRect(0, 0, boardLengthOfSide + 40, boardLengthOfSide + 40, 0.1).attr({'stroke': 'red', 'stroke-width': 2});
    }

    /* Listener added to detect changes to the viewport size and adjust board accordingly. */
    $(window).on('resize orientationChange', function () {
        calculateBoardDimensions();
        paper.clear();
        drawBoard();
    });

    /* run at start of program */
    init();
    $(window).trigger('resize');
})();

//paper.drawnRect(10,10,600,600,4).attr({"fill":"#17A9C6", "stroke":"#2A6570", "stroke-width":4});

//paper.setViewBox(0, 0, viewportWidth, viewportHeight, true);

// ok, raphael sets width/height even though a viewBox has been set, so let's rip out those attributes (yes, this will not work for VML)
// var svg = document.querySelector("svg");
// svg.removeAttribute("width");
// svg.removeAttribute("height");


// draw some random vectors:
// var path = "M " + viewportWidth / 2 + " " + viewportHeight / 2;
// for (var i = 0; i < 100; i++){
//     var x = Math.random() * viewportHeight;
//     var y = Math.random() * viewportWidth;
//     paper.circle(x,y,
//         Math.random() * 60 + 2).
//     attr("fill", "rgb("+Math.random() * 255+",0,0)").
//     attr("opacity", 0.5);
//     path += "L " + x + " " + y + " ";
// }
// //
// paper.path(path).attr("stroke","#ffffff").attr("stroke-opacity", 0.2);
// //
// paper.text(200,100,"Resize the window").attr("font","30px Arial").attr("fill","#ffffff");