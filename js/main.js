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
(function() {
    var svg = new Raphael(document.getElementById('canvas_container'), 500, 500);
    var circle = svg.drawnCircle(250, 250, 100, 5);
    circle.attr({"stroke":"red", "stroke-width": 5});
    var line= svg.drawnRect(1, 1, 100, 100, 5);
    line.attr({"stroke":"red", "stroke-width": 5});
})();
