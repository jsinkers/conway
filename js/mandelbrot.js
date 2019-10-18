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
    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;
    var lockAspectRatio = true;

    width = Math.round(ratio * viewportWidth);
    height = Math.round(width * dy / dx);
    if (height > viewportHeight * ratio) {
        height = Math.round(ratio * viewportHeight);
        width = Math.round(height * dx / dy);
    }
    var aspectRatio = height/parseFloat(width);
    var btnRender = document.getElementById("btnRender");
    var canvas = d3.select('#container')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'canvas')
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

    renderMandelbrot();

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

    function renderMandelbrot() {
        if (typeof (Worker) !== "undefined") {
            var w = new Worker("js/mandelbrot_worker.js");
            var message = {
                "width": width, "height": height,
                "min_x": min_x, "max_x": max_x,
                "min_y": min_y, "max_y": max_y,
                "data": data
            };
            w.postMessage(message);
            w.onmessage = function (event) {
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
    }

    document.getElementById("btnClear").addEventListener("click", () => {
        deleteBox();
    });

    function deleteBox() {
        //disable render, clear buttons
        document.getElementById("btnRender").disabled = true;
        document.getElementById("btnClear").disabled = true;
        // delete existing box if there is one
        var rect = document.querySelector(".rectangle");
        if (rect) {
            rect.remove();
        }
    }

    canvas.addEventListener('mousedown', function(e) {
        getCursorPosition(canvas, e);
        if (element !== null) {
            element = null;
            canvas.style.cursor = "default";
            console.log("finish drawing");
            boxDrawn();
        } else {
            deleteBox();
            console.log("begin drawing");
            //mouse.x = mouse.x - document.getElementById('canvas').offsetLeft;
            mouse.startX = mouse.x + canvas.offsetLeft;
            mouse.startY = mouse.y + canvas.offsetTop;
            console.log(`x${mouse.x}, y${mouse.y}`);
            element = document.createElement('div');
            element.className = 'rectangle';
            element.style.left = `${mouse.startX}px`;
            element.style.top = `${mouse.startY}px`;
            document.getElementById("container").appendChild(element);
            canvas.style.cursor = "crosshair";

        }
    });

    canvas.addEventListener("mousemove", (ev) => {
        getCursorPosition(canvas, ev);
        if (element !== null) {
            if (lockAspectRatio) {
                // define box size by x position
                // AR = height/width
                let w = Math.abs(mouse.x + canvas.offsetLeft - mouse.startX);
                let h = w * aspectRatio;
                let l = (mouse.x - mouse.startX + canvas.offsetLeft < 0) ? mouse.x + canvas.offsetLeft : mouse.startX;
                let t = (mouse.y - mouse.startY < 0) ? mouse.startY - h : mouse.startY;
                // enforce canvas boundaries
                if (t+h > canvas.offsetTop + canvas.height) {
                    h = canvas.offsetTop + canvas.height - t;
                    w = h / aspectRatio;
                } else if (t < canvas.offsetTop) {
                    h = mouse.startY - canvas.offsetTop;
                    t = canvas.offsetTop;
                    w = h / aspectRatio;
                }
                element.style.width = `${w}px`;
                element.style.height = `${h}px`;
                element.style.left = `${l}px`;
                element.style.top = `${t}px`;
            } else {
                element.style.width = Math.abs(mouse.x + canvas.offsetLeft - mouse.startX) + 'px';
                element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
                element.style.left = (mouse.x - mouse.startX + canvas.offsetLeft < 0) ? mouse.x + canvas.offsetLeft + 'px' : mouse.startX + 'px';
                element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
            }
        }
    });

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        //console.log("x: " + mouse.x + " y: " + mouse.y);
    }


    document.getElementById("btnRender").addEventListener("click", function() {
        var el = document.querySelector(".rectangle");
        if (el) {
            // get box coordinates relative to canvas
            var x1 = unPixel(el.style.left) - canvas.offsetLeft;
            var x2 = x1 + unPixel(el.style.width);
            var y1 = unPixel(el.style.top) - canvas.offsetTop;
            var y2 = y1 + unPixel(el.style.height);

            // validate box
            if ((x2 - x1 <= 0) || (y2 - y1 <= 0)) {
                deleteBox();
                alert("Invalid box drawn");
                return ;
            }
            deleteBox();

            // transform into complex coordinates
            var xScale = d3.scaleLinear()
                .domain([0.0, canvasWidth])
                .range([min_x, max_x]);

            var yScale = d3.scaleLinear()
                .domain([canvasHeight, 0.0])
                .range([min_y, max_y]);

            min_x = xScale(x1);
            max_x = xScale(x2);
            min_y = yScale(y2);
            max_y = yScale(y1);

            // run worker and re-render
            renderMandelbrot();
        }
    });
});

function unPixel(x) {
    return parseFloat(x.slice(0,-2));
}

function boxDrawn() {
    // enable render button
    document.getElementById("btnRender").disabled = false;
    document.getElementById("btnClear").disabled = false;
}


