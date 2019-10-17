importScripts("https://d3js.org/d3.v4.min.js");
importScripts("js-colormaps.js");

var canvasWidth;
var canvasHeight;
var min_x;
var max_x;
var min_y;
var max_y;
var data ;
var color = null;
var xScale;
var yScale;
var maxIterations = 1000;
var colorScale = d3.scaleLog()
    .domain([1, maxIterations])
    .range([0, 1]);

function compute_escape_time_mandelbrot(cx, cy, max_n) {
    // computes the number of iterations n for the point in the complex plane cx + i*cy to become unbounded
    var n = 1;
    var x = 0;
    var y = 0;
    var x_next = 0;
    var y_next = 0;
    while ((Math.pow(x, 2) + Math.pow(y, 2) <= 4) && (n <= max_n)) {
        x_next = Math.pow(x, 2) - Math.pow(y, 2) + cx;
        y_next = 2 * x * y + cy;
        x = x_next;
        y = y_next;
        n = n + 1;
    }
    return n;
}

function enforceBounds(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1){
        return 1;
    } else {
        return x;
    }
}

function interpolateLinearly(x, values) {

    // Split values into four lists
    var x_values = [];
    var r_values = [];
    var g_values = [];
    var b_values = [];
    for (i in values) {
        x_values.push(values[i][0]);
        r_values.push(values[i][1][0]);
        g_values.push(values[i][1][1]);
        b_values.push(values[i][1][2]);
    }

    var i = 1;
    while (x_values[i] < x) {
        i = i+1;
    }
    i = i-1;

    var width = Math.abs(x_values[i] - x_values[i+1]);
    var scaling_factor = (x - x_values[i]) / width;

    // Get the new color values though interpolation
    var r = r_values[i] + scaling_factor * (r_values[i+1] - r_values[i]);
    var g = g_values[i] + scaling_factor * (g_values[i+1] - g_values[i]);
    var b = b_values[i] + scaling_factor * (b_values[i+1] - b_values[i]);

    return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];

}

function computeMandelbrot() {
    var escapeIteration = 0;
    var completion = 0;
    for (var y = 0; y < canvasHeight; ++y) {
        console.log(`Computing ${y+1} of ${canvasHeight}`);
        for (var x = 0; x < canvasWidth; ++x) {
            escapeIteration = compute_escape_time_mandelbrot(xScale(x), yScale(y), maxIterations);
            var color = interpolateLinearly(enforceBounds(colorScale(escapeIteration)), Blues);
            if (isNaN(color[0])) {
                console.log(escapeIteration);
                console.log(color);
            }
            //data[y * canvasWidth + x] =
            //    (Math.round(255*color[0])) |     // red
            //    (Math.round(255*color[1] << 8)) |    // green
            //    (Math.round(255*color[2] << 16)) |    // blue
            //    (255 << 24);        // alpha
            for (let i = 0; i < 4; ++i) {
                let ind = (y * canvasWidth + x) * 4 + i;
                if (i < 3) {
                    data[ind] = Math.round(255 * color[i]);
                } else {
                    data[ind] = 255;
                }
            }
        }
        completion = Math.round((y+1)/canvasHeight*100);
        postMessage({"completion": completion, "data": null});
    }
    console.log("Mandelbrot compute complete");
    postMessage({"completion": completion, "data": data});
}

onmessage = e => {
    canvasWidth = e.data.width;
    canvasHeight = e.data.height;
    min_x = e.data.min_x;
    max_x = e.data.max_x;
    min_y = e.data.min_y;
    max_y = e.data.max_y;
    data = e.data.data;
    xScale = d3.scaleLinear()
        .domain([0.0, canvasWidth])
        .range([min_x, max_x]);

    yScale = d3.scaleLinear()
        .domain([canvasHeight, 0.0])
        .range([min_y, max_y]);

    computeMandelbrot();
}