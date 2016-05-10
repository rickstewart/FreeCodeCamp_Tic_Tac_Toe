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
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    paper.drawnLine(100, 100, 200, 200, wobble).attr({stroke: 'red'});
})();
