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

document.addEventListener('load', () => {
    console.log(`load`);
});

document.addEventListener('readystatechange', (event) => {
    console.log(`readystate: ${document.readyState}`);
});

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
        height = Math.round(width * dy/dx);
    } else {
        height = Math.round(ratio * viewportHeight);
        width = Math.round(height * dx/dy);
    }

    var canvas = d3.select('#container')
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
    //var data = new Uint32Array(buf);
    var data = buf8;
    var progressBar = document.getElementById("progressBar");
    //var lastDraw = (new Date).valueOf();

    if (typeof(Worker) !== "undefined") {
        var w = new Worker("js/mandelbrot_worker.js");
        w.postMessage({"width": width, "height": height,
                        "min_x": min_x, "max_x": max_x,
                        "min_y": min_y, "max_y": max_y,
                        "data": data
                    });
        w.onmessage = function(event) {
            progressBar.style.width = `${event.data.completion}%`;
            if (event.data.data) {
                data = imageData.data;
                //data = event.data.data;
                data = Object.assign(data, event.data.data);
                w.terminate();
                w = undefined;
                //imageData.data.set(buf8);
                ctx.putImageData(imageData, 0, 0);
            }
        };
    } else {
        alert("Sorry! No Web Worker support.");
    }

    function shouldReDraw(){
            var dNow = (new Date).valueOf();
            if(dNow - lastDraw > 16){
                // around 60fps
                lastDraw = dNow;
                return true;
            }else{
                return false;
            }
    }
});


