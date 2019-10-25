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
const m1 = 0.1 + Math.random();
const m2 = 0.1 + Math.random();
const M = m1 + m2;
const l1 = 0.3 + Math.random();
const l2 = 0.2 + Math.random();
const h = 0.001;
const refresh_rate = 60;
const sound_refresh_rate = 30;
const soundDelay = 1/sound_refresh_rate*1000;
const refresh_period = 1/refresh_rate;
const update_iterations = Math.round(refresh_period/h);
var centreX, centreY;
const numPoints = 500;
var baseFreq1;
var baseFreq2;

if (m1 >= m2) {
    baseFreq1 = 440;
    baseFreq2 = baseFreq1 / m2 * m1;
} else {
    baseFreq2 = 440;
    baseFreq1 = baseFreq2 / m1 * m2;
}


// initial conditions
var vector = { theta1: 0,
               theta2: 0,
               alpha1: -3 + 10*Math.random(),
               alpha2: -3 + 10*Math.random()
              };
var dwgDiv = null;
var svg =  null;

var lengthScale = null;
var points = [];
var lines = [];

function drawPendulum() {
    // draw pendulum for given masses, lengths
    // get dims of div
    const divWidth = dwgDiv.clientWidth;
    const divHeight = dwgDiv.clientHeight;

    const dwgSize = Math.min(divHeight, divWidth);

    svg
        .attr("width", divWidth)
        .attr("height", divHeight);

    // find centre
    centreX = divWidth/2;
    centreY = divHeight/2;

    // proportion of svg to use
    const svgProp = 0.8;
    lengthScale = svgProp / (l1 + l2) * dwgSize/2;
    const y1 = centreY + lengthScale*l1;
    const y2 = y1 + lengthScale*l2;
    var jsonCircles = [
                         { "x_axis": centreX, "y_axis": centreY, "radius": 5, "color" : "black", "pendulum": 0 },
                         { "x_axis": centreX, "y_axis": y1, "radius": m1*20/1.1, "color" : "purple", "pendulum": 1},
                         { "x_axis": centreX, "y_axis": y2, "radius": m2*20/1.1, "color" : "red", "pendulum": 2}];
    var jsonLines = [{"x1": centreX, "y1": centreY, "x2": centreX, "y2": y1, "pendulum": 1},
                     {"x1": centreX, "y1": y1, "x2": centreX, "y2": y2, "pendulum": 2}];

    // draw lines
    var pendula = svg.selectAll("line[pendulum]")
        .data(jsonLines)
        .enter()
        .append("line");

    var lineAttributes = pendula
                        .attr("x1", function (d) {return d.x1})
                        .attr("y1", function (d) {return d.y1})
                        .attr("x2", function (d) {return d.x2})
                        .attr("y2", function (d) {return d.y2})
                        .attr("pendulum", function (d) {return d.pendulum})
                        .attr("stroke-width", 2)
                        .attr("stroke", "black");

    // draw masses
    var circles = svg.selectAll("circle[pendulum]")
        .data(jsonCircles)
        .enter()
        .append("circle");

    var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .attr("pendulum", function (d) {return d.pendulum})
                       .style("fill", function(d) { return d.color; });

    const point = svg.append('circle')
                           .attr('cx', centreX)
                           .attr('cy', y2)
                           .attr('r', 1)
                           .style('fill', "red");
          points.push(point);

    var pendulum1 = d3.selectAll("[pendulum='1']");
    var pendulum2 = d3.selectAll("[pendulum='2']");


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
    var pendula = svg.selectAll("line[pendulum]").data(jsonLines);
    var lineAttributes = pendula
                        .attr("x1", function (d) {return d.x1})
                        .attr("y1", function (d) {return d.y1})
                        .attr("x2", function (d) {return d.x2})
                        .attr("y2", function (d) {return d.y2});

    // update masses
    var circles = svg.selectAll("circle[pendulum]").data(jsonCircles);
    var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; });

    // draw trace
    const point = svg.append('circle')
                           .attr('cx', dwgX2)
                           .attr('cy', dwgY2)
                           .attr('r', 1)
                           .style('fill', "red")
                            .moveToBack();

    points.push(point);
    while (points.length > numPoints) {
        points[0].remove();
        points.shift();
    }



}

document.addEventListener('DOMContentLoaded', () =>  {
    document.querySelector("#volume").addEventListener("click", () => {
        if (sound_active) {
            osc1.stop();
            osc2.stop();
            sound_active = false;
            document.querySelector("#unmute").hidden = true;
            document.querySelector("#mute").hidden = false;
        } else {
            sound_active = true;
            context = new (window.AudioContext || window.webkitAudioContext)();
            osc1 = context.createOscillator();
            gain1 = context.createGain();
            osc1.type = "sine";
            osc1.connect(gain1);
            gain1.connect(context.destination);
            osc1.frequency.value = baseFreq1;
            osc1.start();
            osc2 = context.createOscillator();
            gain2 = context.createGain();
            osc2.type = "sine";
            osc2.connect(gain1);
            gain2.connect(context.destination);
            osc2.frequency.value = baseFreq2;
            osc2.start();
            document.querySelector("#unmute").hidden = false;
            document.querySelector("#mute").hidden = true;
        }
    });

    dwgDiv = document.getElementById("drawing");
    svg =  d3.select(dwgDiv).append("svg");
    drawPendulum();
    computePendulum();

});

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

function computePendulum() {
    if (typeof (Worker) !== "undefined") {
        var w = new Worker("js/double_pendulum_worker.js");
        var message = {
            type: "initialise",
            g: g, M: M,
            m1: m1, m2: m2,
            l1: l1, l2: l2,
            h: h, update_iterations: update_iterations,
            vector: vector
        };
        w.postMessage(message);
        message = {type: "calculate"};

        w.onmessage = function (e) {
            console.log("received msg from worker");
            vector = e.data.vector;
            setTimeout(function () {
                console.log("sending message to worker");
                updatePendulum(vector, centreX, centreY);
                updateSound(vector);
                w.postMessage(message);
            }, refresh_period*1000);
        };
    } else {
        alert("Sorry! No Web Worker support.");
    }
}

var sound_active = false;
var context;
var osc1;
var gain1;
var last_time = Date.now();


function updateSound() {
    if (sound_active && (Date.now()-last_time) > soundDelay) {
        gain1.gain.setValueAtTime(Math.abs(vector.alpha1)/10, context.currentTime);
        gain2.gain.setValueAtTime(Math.abs(vector.alpha2)/10, context.currentTime);
        osc1.frequency.setValueAtTime((vector.alpha1/50 + 1)*baseFreq1, context.currentTime);
        osc1.frequency.setValueAtTime((vector.alpha2/50 + 1)*baseFreq2, context.currentTime);
        last_time = Date.now()
    }

}

