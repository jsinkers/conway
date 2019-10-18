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
    console.log(viewportWidth);
    var viewportHeight = getHeight();
    console.log(viewportHeight);
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
    var lockAspectRatio = false;

    width = Math.round(ratio * viewportWidth);
    height = Math.round(width * dy / dx);
    if (height > viewportHeight * ratio) {
        height = Math.round(ratio * viewportHeight);
        width = Math.round(height * dx / dy);
    }
    var aspectRatio = height/parseFloat(width);
    var canvas = d3.select('#container')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'canvas')
        .node();

    function getWidth() {
      return Math.min(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
    }

    function getHeight() {
      return Math.min(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );
    }

    document.getElementById("btnClear").addEventListener("click", () => {
        //disable render button
        document.getElementById("btnRender").disabled = true;
        document.getElementById("btnClear").disabled = true;
        // delete existing box if there is one
        var rect = document.querySelector(".rectangle");
        if (rect) {
            rect.remove();
        }
    });

    canvas.addEventListener('mousedown', function(e) {
        getCursorPosition(canvas, e);
        if (element !== null) {
            element = null;
            canvas.style.cursor = "default";
            console.log("finish drawing");
            boxDrawn();
        } else {
            //disable render button
            document.getElementById("btnRender").disabled = true;
            document.getElementById("btnClear").disabled = true;
            // delete existing box if there is one
            var rect = document.querySelector(".rectangle");
            if (rect) {
                rect.remove();
            }
            console.log("begin drawing");
            //mouse.x = mouse.x - document.getElementById('canvas').offsetLeft;
            mouse.startX = mouse.x + canvas.offsetLeft;
            mouse.startY = mouse.y;
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
                element.style.width = w + 'px';
                element.style.height = h + 'px';
                element.style.left = l + 'px';
                element.style.top = t + 'px';
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

    document.getElementById("chkAspect").addEventListener("change", function() {
       lockAspectRatio = !!this.checked;
    });
});

function boxDrawn() {
    // enable render button
    document.getElementById("btnRender").disabled = false;
    document.getElementById("btnClear").disabled = false;

    // determine (x,y)|(min, max) for the box

}



