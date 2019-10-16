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

document.addEventListener('DOMContentLoaded', () => {
    //var canvWidth = document.getElementById("canvasMandelbrot").
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

        width = ratio * viewportWidth;

        height = width * dy/dx;
    } else {
        height = ratio * viewportHeight;
        width = height * dx/dy;
    }

    var xScale = d3.scaleLinear()
        .domain([0.0, width])
        .range([min_x, max_x]);

    var yScale = d3.scaleLinear()
        .domain([height, 0.0])
        .range([min_y, max_y]);

    //var dataset = d3.range(dataSize).map(function(d, i){return d3.range(dataSize).map(function(d, i){return ~~(Math.random()*255);});});

    var canvas = d3.select('div')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .node();

    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);

    var maxIterations = 1000;

    var colorScale = d3.scaleLog()
        .domain([1, maxIterations])
        .range([0, 1]);

    var escapeIteration = null;
    var color = null;
    for (var y = 0; y < canvasHeight; ++y) {
        console.log(`Computing ${y} of ${canvasHeight}`);
        for (var x = 0; x < canvasWidth; ++x) {
            escapeIteration = compute_escape_time_mandelbrot(xScale(x), yScale(y), maxIterations);
            //escapeIteration = escapeTester(xScale(x), yScale(y), maxIterations);
            var color = interpolateLinearly(colorScale(escapeIteration), Blues);
            //if (escapeIteration >= maxIterations) {
            //    color = [0, 0, 0];
            //    console.log(`${x}, ${y}: ${escapeIteration}`);
            //} //else {
            //    color = [255, 255, 255];
            //}
            //console.log(color);
            data[y * canvasWidth + x] =
                (Math.round(255*color[0])) |     // red
                (Math.round(255*color[1] << 8)) |    // green
                (Math.round(color[2] << 16)) |    // blue
                (255 << 24);        // alpha
        }
    }

    imageData.data.set(buf8);

    ctx.putImageData(imageData, 0, 0);
});

function escapeTester(x, y, maxIterations) {
    if (Math.pow(x, 2) + Math.pow(y, 2) <= 1) {
        return maxIterations + 1;
    } else {
        return 0;
    }
}

function compute_escape_time_mandelbrot(cx, cy, max_n) {
    // computes the number of iterations n for the point in the complex plane cx + i*cy to become unbounded
    var n = 1;
    //var max_n = 1000;
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
    var r = r_values[i] + scaling_factor * (r_values[i+1] - r_values[i])
    var g = g_values[i] + scaling_factor * (g_values[i+1] - g_values[i])
    var b = b_values[i] + scaling_factor * (b_values[i+1] - b_values[i])

    return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];

}