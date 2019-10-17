//import("helpers.js");

document.addEventListener('DOMContentLoaded', () => {
    console.log(`DOMContentLoaded`);
    // determine window size
    var min_x = -2.5;
    var max_x = 1.0;
    var min_y = -1.0;
    var max_y = 1.0;
    var dx = max_x - min_x;
    var dy = max_y - min_y;
    var viewportWidth = getWidth();
    var viewportHeight = getHeight();
    var width = 0;
    var height = 0;
    var ratio = 0.8;

    if (viewportHeight >= viewportWidth) {
        width = Math.round(ratio * viewportWidth);
        height = Math.round(width * dy / dx);
    } else {
        height = Math.round(ratio * viewportHeight);
        width = Math.round(height * dx / dy);
    }

    var canvas = d3.select('#container')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .node();

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    //var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    var drawing = false;
    var customBase = document.createElement('custom');
    var custom = d3.select(customBase); // This is your SVG replacement and the parent of all other elements

    var svg = d3.select('#container')
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = 0;
    var y = 0;

    canvas.addEventListener('click', function(event) {
        // x, y coordinates relative to canvas
        x = event.pageX - canvas.offsetLeft;
        y = event.pageY - canvas.offsetTop;

        drawing = true;
        ctx.strokeRect(x, y, 0, 0);
    });

    canvas.addEventListener('onmousemove', function(event) {

    });

});

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

