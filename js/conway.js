// TODO: add generation counter
// TODO: add mouse click to initialise cells
// TODO: mobile responsive
document.addEventListener('DOMContentLoaded', () => {
    var grid_container = document.querySelector('.grid_container');
    grid_container.style.setProperty("height",`${window.innerHeight}px`);

    var screen_proportion = 1;
    var dead_style = "#fff";//"#343a40"; //"#6c757d";
    var live_style = "#2C2AF1";
    var running = true;
    const divWidth = document.querySelector('.content').offsetWidth;
    const divHeight = document.querySelector('.content').offsetHeight;
    var delayInMilliseconds = 500;
    var intervalID = null;
    const minDelay = 100;
    const maxDelay = 5000;

    const numCols = 100;
    const width = screen_proportion * divWidth / numCols;
    const height = width;
    const numRows = Math.floor(screen_proportion * divHeight / height);
    const svgWidth = numCols * width;
    const svgHeight = numRows * height;

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

    // Functions
    function seedCell() {
        if (Math.random() < 0.5) {
            return live_style;
        } else {
            return dead_style;
        }
    }

    function nextGeneration(griddata, grid) {
        // return updated griddata
        var data = [];
        for (let row = 0; row < griddata.length; row++) {
            data.push( [] );
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

    function seedGrid() {
        var data = [];
        for (let row = 0; row < griddata.length; row++) {
            data.push( [] );
            for (let col = 0; col < griddata[0].length; col++) {
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

    function intervalManager(flag) {
        if (flag) {
            intervalID = setInterval(function () {
                griddata = nextGeneration(griddata, d3.select("#grid"));
            }, delayInMilliseconds);
        } else {
            clearInterval(intervalID);
        }
    }

    // Callbacks
    document.getElementById("btnPause").addEventListener("click", function() {
        if (running) {
            this.innerText = "Start";
        } else {
            this.innerText = "Pause";
        }
        running = !running;
        intervalManager(running);
    });

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
});


