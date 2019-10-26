// TODO: add generation counter
// TODO: center grid
// TODO: add mouse click to initialise cells
// add reset button
// TODO: redraw grid when size of window changes
// TODO: mobile responsive

document.addEventListener('DOMContentLoaded', () => {
    var screen_proportion = 1;
    var dead_style = "#fff";//"#343a40"; //"#6c757d";
    var live_style = "#2C2AF1";
    var running = true;
    //const divWidth = +d3.select('#grid').style('width').slice(0, -2);
    //const divHeight = +d3.select('#grid').style('height').slice(0, -2);
    const divWidth = document.querySelector('.content').offsetWidth;
    const divHeight = document.querySelector('.content').offsetHeight;
    var delayInMilliseconds = 500;
    var intervalID = null;
    const minDelay = 100;
    const maxDelay = 5000;

    const numCols = 100;
    const width = screen_proportion * divWidth / numCols;
    //const marginX = divWidth - numCols * width;
    const height = width;
    const numRows = Math.floor(screen_proportion * divHeight / height);
    //const marginY = divHeight - numCols * height;
    const svgWidth = numCols * width;
    const svgHeight = numRows * height;

    function seedCell() {
        if (Math.random() < 0.5) {
            return live_style;
        } else {
            return dead_style;
        }
    }

    function nextGeneration(griddata, grid) {
        // return updated griddata
        var data = new Array();
        for (var row = 0; row < griddata.length; row++) {
            data.push( new Array() );
            for (var col = 0; col < griddata[0].length; col++) {
                data[row].push({state: nextCellState(row, col, griddata)});
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
        for (var row = cell_row - 1; row <= cell_row + 1; row++) {
            for (var col = cell_col - 1; col <= cell_col + 1; col++) {
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

        //const numRows = Math.floor(screen_proportion * window.innerHeight / height);
        //const width = screen_proportion * window.innerWidth / numCols;
        var data = new Array();
        var xpos = 0; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 0;

        //var g = document.getElementById("grid");
        //g.style.setProperty("marginLeft", marginX/2);
        //g.style.setProperty("marginTop", marginY/2);
        //var click = 0;
        for (var row = 0; row < numRows; row++) {
            data.push( new Array() );
            for (var column = 0; column < numCols; column++) {
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
    var griddata = gridData();
    var grid = d3.select("#grid")
        .append("svg")
        .attr("viewBox", `${0}, ${0}, ${svgWidth}, ${svgHeight}`);
        //.attr("max-height", svgHeight);
        //.attr("width", svgWidth)
        //.attr("height", svgHeight);

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
        .style("stroke", "#222");

    intervalManager(true);

    document.getElementById("btnPause").onclick = function() {
        if (running) {
            this.innerText = "Start";
        } else {
            this.innerText = "Pause";
        }
        running = !running;
        intervalManager(running);
    };

    document.getElementById("form").onsubmit = function(ev) {
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
    };

    function intervalManager(flag) {
        if (flag) {
            intervalID = setInterval(function () {
                griddata = nextGeneration(griddata, d3.select("#grid"));
            }, delayInMilliseconds);
        } else {
            clearInterval(intervalID);
        }
    }

    document.getElementById("btnReset").onclick = function() {
        griddata = seedGrid();
    };

    function seedGrid() {
        var data = new Array();
        for (var row = 0; row < griddata.length; row++) {
            data.push( new Array() );
            for (var col = 0; col < griddata[0].length; col++) {
                data[row].push({state: seedCell()});
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
});


