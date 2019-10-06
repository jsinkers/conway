

// solution for equations of motion by Euler's method
// theta1 = angle of 1st pendulum wrt vertical
// theta2 = angle of 2nd pendulum wrt vertical [rad]
// alpha1 = d(theta1)/dt
// alpha2 = d(theta2)/dt [rad/s]
// gamma1 = d(alpha1)/dt
// gamma2 = d(alpha2)/dt [rad/s^2]
// m1, m2: masses of 1st, 2nd pendulum [kg]
// l1, l2: lengths of 1st, 2nd pendulum [m]
// g: acceleration due to gravity [m/s^2]
// h: step size [s]

const g = 9.81;
const m1 = 0.2;
const m2 = 0.2;
const M = m1 + m2;
const l1 = 0.3;
const l2 = 0.3;
var h = 0.01;

// initial conditions
var vector = {theta1: 0, theta2: 0, alpha1: 10, alpha2: 10    };
var dwgDiv = null;
var svg =  null;

var lengthScale = null;

function calculateAngAcceleration(vector) {
    // calculate the angular acceleration for the given iteration
    const theta1 = vector.theta1;
    const theta2 = vector.theta2;
    const dtheta = theta1 - theta2;
    const alpha1 = vector.alpha1;
    const alpha2 = vector.alpha2;
    var gamma1 = ((m2*g*Math.sin(theta2) - m2*l1*Math.pow(alpha1, 2)*Math.sin(dtheta))*Math.cos(dtheta) - m2*l2*Math.pow(alpha2, 2)*Math.sin(dtheta) - g*M*Math.sin(theta1))/(M*l1 - m2*l1*Math.pow(Math.cos(dtheta), 2));
    var gamma2 = (m2*l1*Math.pow(alpha1, 2)*Math.sin(dtheta) - m2*l1*gamma1*Math.cos(dtheta) - m2*g*Math.sin(theta2))/(m2*l2);
    vector.gamma1 = gamma1;
    vector.gamma2 = gamma2;
    return vector;
}

function calculateNextIteration(lastVector) {
    // use Euler's method to compute next iteration of the double pendulum
    const theta1 = lastVector.theta1 + h * lastVector.alpha1;
    const theta2 = lastVector.theta2 + h * lastVector.alpha2;
    const alpha1 = lastVector.alpha1 + h * lastVector.gamma1;
    const alpha2 = lastVector.alpha2 + h * lastVector.gamma2;
    var nextVector = {theta1: theta1, theta2: theta2, alpha1: alpha1, alpha2: alpha2};
    nextVector = calculateAngAcceleration(nextVector);
    return nextVector;
}

function drawPendulum() {
    // draw pendulum for given masses, lengths
    // get dims of div
    const divWidth = dwgDiv.clientWidth;
    const divHeight = dwgDiv.clientHeight;

    const dwgSize = Math.min(divHeight, divWidth);

    svg
        .attr("width", divWidth)
        .attr("height", divHeight);
        //.attr("border", 1);
        //style("border", "1px solid black");

    // find centre
    const centreX = divWidth/2;
    const centreY = divHeight/2;

    // proportion of svg to use
    const svgProp = 0.8;
    lengthScale = svgProp / (l1 + l2) * dwgSize/2;
    const y1 = centreY + lengthScale*l1;
    const y2 = y1 + lengthScale*l2;
    var jsonCircles = [
                         { "x_axis": centreX, "y_axis": centreY, "radius": 5, "color" : "black", "pendulum": 0 },
                         { "x_axis": centreX, "y_axis": y1, "radius": 20, "color" : "purple", "pendulum": 1},
                         { "x_axis": centreX, "y_axis": y2, "radius": 20, "color" : "red", "pendulum": 2}];
    var jsonLines = [{"x1": centreX, "y1": centreY, "x2": centreX, "y2": y1, "pendulum": 1},
                     {"x1": centreX, "y1": y1, "x2": centreX, "y2": y2, "pendulum": 2}];

    // draw lines
    var lines = svg.selectAll("line")
        .data(jsonLines)
        .enter()
        .append("line");

    var lineAttributes = lines
                        .attr("x1", function (d) {return d.x1})
                        .attr("y1", function (d) {return d.y1})
                        .attr("x2", function (d) {return d.x2})
                        .attr("y2", function (d) {return d.y2})
                        .attr("pendulum", function (d) {return d.pendulum})
                        .attr("stroke-width", 2)
                        .attr("stroke", "black");

    // draw masses
    var circles = svg.selectAll("circle")
        .data(jsonCircles)
        .enter()
        .append("circle");

    var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .attr("pendulum", function (d) {return d.pendulum})
                       .style("fill", function(d) { return d.color; });

    var pendulum1 = d3.selectAll("[pendulum='1']");
    var pendulum2 = d3.selectAll("[pendulum='2']");

    /*var interpol1 = d3.interpolateString(`rotate(0, ${centreX}, ${centreY})`, `rotate(30, ${centreX}, ${centreY})`);
    var interpol2 = d3.interpolateString(`rotate(0, ${centreX}, ${y1})`, `rotate(30, ${centreX}, ${y1})`);

    // rotate lines
    var rotation1 = pendulum1
        .transition()
            .duration(2000)
            //.attr("transform", `rotate(30, ${centreX}, ${y1})`);
        .attrTween("transform", function (d,i,a) {return interpol1});

    var rotation2 = pendulum2
        .transition()
            .duration(2000)
            //.attr("transform", `rotate(30, ${centreX}, ${y1})`);
        .attrTween("transform", function (d,i,a) {return interpol2});*/
    vector = calculateAngAcceleration(vector);

    setInterval(function() {
        vector = calculateNextIteration(vector);
        updatePendulum(vector, centreX, centreY);
    }, 0.1);

}

function updatePendulum(vector, centreX, centreY) {
    // based on new values, update drawing
    // compute x1, y1 from l1, theta1
    const x1 = l1 * Math.sin(vector.theta1);
    const y1 = -l1 * Math.cos(vector.theta1);
    // compute x2, y2 from x1, y1, l2, theta2
    const x2 = x1 + l2 * Math.sin(vector.theta2);
    const y2 = y1 - l2 * Math.cos(vector.theta2);

    // update positions
    const dwgX1 = centreX + x1 * lengthScale;
    const dwgY1 = centreY - y1 * lengthScale;
    const dwgX2 = centreX + x2 * lengthScale;
    const dwgY2 = centreY - y2 * lengthScale;
    jsonCircles = [{ "x_axis": centreX, "y_axis": centreY },
                   { "x_axis": dwgX1, "y_axis": dwgY1 },
                   { "x_axis": dwgX2, "y_axis": dwgY2 }];

    jsonLines = [{ "x1": centreX, "y1": centreY, "x2": dwgX1, "y2": dwgY1 },
                 { "x1": dwgX1, "y1": dwgY1, "x2": dwgX2, "y2": dwgY2 }];

    // update lines
    var lines = svg.selectAll("line").data(jsonLines);
    var lineAttributes = lines//.transition()
                        //.delay(2000)
                        .attr("x1", function (d) {return d.x1})
                        .attr("y1", function (d) {return d.y1})
                        .attr("x2", function (d) {return d.x2})
                        .attr("y2", function (d) {return d.y2});

    // update masses
    var circles = svg.selectAll("circle").data(jsonCircles);
    var circleAttributes = circles//.transition()
                        //.delay(2000)
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; });
}

document.addEventListener('DOMContentLoaded', () =>  {
    dwgDiv = document.getElementById("drawing");
    svg =  d3.select(dwgDiv).append("svg");
    drawPendulum();
});
