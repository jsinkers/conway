// TODO: add generation counter
// TODO: add mouse click to initialise cells
document.addEventListener('DOMContentLoaded', () => {
    var grid_container = document.querySelector('.grid_container');
    grid_container.style.setProperty("height",`${window.innerHeight}px`);

    var screen_proportion = 1;
    var dead_style = "#fff";//"#343a40"; //"#6c757d";"#d3d3d3";
    var live_style = "#2C2AF1";
    var running = true;
    const divWidth = document.querySelector('.content').offsetWidth;
    const divHeight = document.querySelector('.content').offsetHeight;
    var delayInMilliseconds = 500;
    var intervalID = null;
    const minDelay = 50;
    const maxDelay = 5000;
    const sliderMin = 0;
    const sliderMax = 100;

    const numCols = 100;
    const width = screen_proportion * divWidth / numCols;
    const height = width;
    const numRows = Math.floor(screen_proportion * divHeight / height);
    const svgWidth = numCols * width;
    const svgHeight = numRows * height;
    var mobile = false;
    var slider = document.querySelector("#sliderDelay");
    slider.min = sliderMin;
    slider.max = sliderMax;
    var mouseDown = false;
    var toggleEvent = new Event('toggle');

    // test if we are on a mobile device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // if so let's reduce workload
        console.log('Mobile');
        mobile = true;
    }

    var griddata = gridData();
    var grid = d3.select("#grid")
        .append("svg")
        .attr("viewBox", `${0}, ${0}, ${svgWidth}, ${svgHeight}`);
        //.attr("max-height", svgHeight);
        //.attr("width", svgWidth)
        //.attr("height", svgHeight);

    if (mobile) {
        d3.select("svg")
            .attr("width", svgWidth);
    }

    var row = grid.selectAll(".row")
        .data(griddata)
        .enter().append("g")
        .attr("class", "row");

    var column = row.selectAll(".square")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class","square")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("state", function(d) { return d.state;})
        .style("fill", function(d) { return d.state; })
        .style("stroke", "#222")
        .on("mouseover", function(d) {
            if (!running && mouseDown) {
                if (d.state === live_style) {
                    d.state = dead_style;
                    d3.select(this).style("fill", dead_style);
                } else if (d.state === dead_style) {
                    d.state = live_style;
                    d3.select(this).style("fill", live_style);
                }
            }
        })
        .on("click", function(d) {
            if (!running) {
                if (d.state === live_style) {
                    d.state = dead_style;
                    d3.select(this).style("fill", dead_style);
                } else if (d.state === dead_style) {
                    d.state = live_style;
                    d3.select(this).style("fill", live_style);
                }
            }
        })
        .on("toggle", function(d) {
            console.log("toggling");
            if (!running && mouseDown) {
                if (d.state === live_style) {
                    d.state = dead_style;
                    d3.select(this).style("fill", dead_style);
                } else if (d.state === dead_style) {
                    d.state = live_style;
                    d3.select(this).style("fill", live_style);
                }
            }
        });

    function toggleCell(d) {
        if (!running && mouseDown) {
            if (d.state === live_style) {
                d.state = dead_style;
                d3.select(this).style("fill", dead_style);
            } else if (d.state === dead_style) {
                d.state = live_style;
                d3.select(this).style("fill", live_style);
            }
        }
    }

    var sliderScale = d3.scaleLog()
        .base(10)
        .domain([minDelay, maxDelay])
        .range([sliderMax, sliderMin]);

    slider.value = sliderScale(delayInMilliseconds);

    intervalManager(true);

    function seedCell() {
        if (Math.random() < 0.5) {
            return live_style;
        } else {
            return dead_style;
        }
    }

    function nextGeneration(grid) {
        // return updated griddata
        var gData = grid.selectAll(".row").data();
        var data = [];
        for (let row = 0; row < gData.length; row++) {
            data.push( [] );
            for (var col = 0; col < gData[0].length; col++) {
                data[row].push({state: nextCellState(row, col, gData)});
            }
        }
        var rows = grid.selectAll(".row")
            .data(data);

        var column = rows.selectAll(".square")
            .data(function(d) { return d; })
            .attr("state", function(d) { return d.state; })
            .style("fill", function(d) { return d.state; });

        return data;
    }

    function nextCellState(row, col, griddata) {
        var neighbours = countNeighbours(row, col, griddata);

        // is cell alive and num neighbours = 2 or 3 it lives
        if (griddata[row][col].state === live_style && (neighbours === 2 || neighbours === 3)) {
            return live_style;
        // otherwise if dead cell with 3 live neighbours, cell to live
        } else if (griddata[row][col].state === dead_style && neighbours === 3) {
            return live_style;
        } else {
            return dead_style;
        }
    }

    function countNeighbours(cell_row, cell_col, griddata) {
        // returns a count of the number of live neighbour cells in grid data to the cell at (cell_row, cell_col)
        var neighbours = 0;
        for (let row = cell_row - 1; row <= cell_row + 1; row++) {
            for (let col = cell_col - 1; col <= cell_col + 1; col++) {
                if (row >= 0 && row < griddata.length &&
                    col >= 0 && col < griddata[0].length &&
                    !(row === cell_row && col === cell_col)) {
                    if (griddata[row][col].state === live_style) {
                        neighbours++;
                    }
                }
            }
        }
        return neighbours;
    }

    function gridData() {
        var data = [];
        var xpos = 0; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 0;

        for (let row = 0; row < numRows; row++) {
            data.push( [] );
            for (let column = 0; column < numCols; column++) {
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    state: seedCell()
                });
                xpos += width;
            }
            xpos = 0;
            ypos += height;
        }
        return data;

    }

    function seedGrid(value) {
        var data = [];
        for (let row = 0; row < griddata.length; row++) {
            data.push( [] );
            for (let col = 0; col < griddata[0].length; col++) {
                let seedVal = value ? value : seedCell();
                data[row].push({state: seedVal});
            }
        }

        var rows = grid.selectAll(".row")
            .data(data);

        var column = rows.selectAll(".square")
            .data(function(d) { return d; })
            .attr("state", function(d) { return d.state; })
            .style("fill", function(d) { return d.state; });

        return data;
    }

    function intervalManager(flag) {
        if (flag) {
            intervalID = setInterval(function () {
                //griddata = nextGeneration(d3.select("svg").selectAll(".row").data(), d3.select("#grid"));
                griddata = nextGeneration(d3.select("#grid"));
            }, delayInMilliseconds);
        } else {
            clearInterval(intervalID);
        }
    }

    function toggleRunState() {
        running = !running;
        if (!running) {
            document.getElementById("btnPause").innerText = "Start";
        } else {
            document.getElementById("btnPause").innerText = "Pause";
        }
        intervalManager(running);
    }

    // Callbacks
    document.getElementById("btnPause").addEventListener("click", toggleRunState);

    document.getElementById("btnReset").addEventListener("click", function() {
        griddata = seedGrid();
    });

    document.getElementById("form").addEventListener("submit",function(ev) {
        ev.preventDefault();
        const el = document.getElementById("inpDelay");
        const x = el.value;
        // validate input
        if (isNaN(x) || x < minDelay || x > maxDelay) {
            alert(`Input error: delay must be a number between ${minDelay}ms and ${maxDelay}ms`);
        } else {
            // if valid set a new value for delay
            delayInMilliseconds = x;
            // restart interval with new delay value
            if (running) {
                intervalManager(false);
                intervalManager(true);
            }
        }
        el.value = "";
    });

    slider.addEventListener("input", function() {
        delayInMilliseconds = sliderScale.invert(this.value);
        console.log(`Delay: ${delayInMilliseconds}ms`);
        //document.getElementById("sliderVal").innerText = `${delayInMilliseconds}ms`;
        // restart interval with new delay value
        if (running) {
            intervalManager(false);
            intervalManager(true);
        }
    });

    document.querySelector("svg").addEventListener("mouseover", function() {
        if (!running) {
            this.style.cursor = "crosshair";
        } else {
            this.style.cursor = "auto";
        }
    });

    //document.querySelector("svg").addEventListener("click", function() {
    //    mouseDown = true;
    //});

    document.querySelector("svg").addEventListener("mousedown", function() {
        mouseDown = true;
    });

    document.querySelector("svg").addEventListener("mouseup", function () {
        mouseDown = false;
    });

    var lastTarget = null;

    document.querySelector("svg").addEventListener("touchmove", function(event) {
        var myLocation = event.touches[0];
        var realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
        if (realTarget !== lastTarget) {
            //console.log(realTarget);
            //mouseDown = true;
            realTarget.dispatchEvent(toggleEvent);
            lastTarget = realTarget;
        }
    });
    // touch compatibility
    document.querySelector("svg").addEventListener("touchstart", function() {
        mouseDown = true;
        console.log("touchstart");
    });

    document.querySelector("svg").addEventListener("touchend", function() {
        mouseDown = false;
        console.log("touchend");
    });

    document.querySelector("#btnClear").addEventListener("click", function() {
        if (running) {
            toggleRunState();
        }
        seedGrid(dead_style);
    })
});


