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
    console.log(viewportWidth);
    var viewportHeight = getHeight();
    console.log(viewportHeight);
    var width = 0;
    var height = 0;
    var ratio = 0.8;

    if (viewportHeight*dy <= viewportWidth*dx) {
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
        .attr('id', 'canvas')
        .node();

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    //var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    var x = 0;
    var y = 0;

    //initDraw(document.getElementById('canvas'));

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



    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };

    var element = null;

    //const canvas = document.querySelector('#canvas');
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
            element.style.width = Math.abs(mouse.x + canvas.offsetLeft - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX + canvas.offsetLeft < 0) ? mouse.x + canvas.offsetLeft + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
    });

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        console.log("x: " + mouse.x + " y: " + mouse.y);
    }


});

/*function initDraw(canvas) {
    function setMousePosition(e) {
        var ev = e;
        if (ev.pageX) { //Moz
            mouse.x = ev.pageX + window.pageXOffset;
            mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
            mouse.x = ev.clientX + document.body.scrollLeft;
            mouse.y = ev.clientY + document.body.scrollTop;
        }
    }

    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;

    canvas.onmousemove = function (e) {
        setMousePosition(e);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
    };

    canvas.onclick = function (e) {
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
            mouse.x = mouse.x - document.getElementById('canvas').offsetLeft;
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            console.log(`x${mouse.x}, y${mouse.y}`);
            element = document.createElement('div');
            element.className = 'rectangle';
            element.style.left = `${mouse.x}px}`;
            element.style.top = mouse.y + 'px';
            document.getElementById("container").appendChild(element);
            canvas.style.cursor = "crosshair";
        }
    }
}*/




function boxDrawn() {
    // enable render button
    document.getElementById("btnRender").disabled = false;
    document.getElementById("btnClear").disabled = false;

    // determine (x,y)|(min, max) for the box


}



