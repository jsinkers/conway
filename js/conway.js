document.addEventListener('DOMContentLoaded', () => {
    var screen_proportion = 0.9;
    var dead_style = "#fff";
    var live_style = "#2C2AF1";

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
                if (row > 0 && row < griddata.length &&
                    col > 0 && col < griddata[0].length &&
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
        var data = new Array();
        var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 1;
        const numCols = 100;
        const width = screen_proportion * window.innerWidth / numCols;
        const height = width;
        const numRows = Math.floor(screen_proportion * window.innerHeight / height);
        var click = 0;

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
            xpos = 1;
            ypos += height;
        }
        return data;
    }

    var griddata = gridData();
    // I like to log the data to the console for quick debugging
    console.log(griddata);

    var grid = d3.select("#grid")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

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

    var delayInMilliseconds = 500; //1 second

    setInterval(function() {
        // check if anything is alive
        // if not, clear the interval
        griddata = nextGeneration(griddata, d3.select("#grid"));
        // progress to the next generation

    }, delayInMilliseconds);

});


