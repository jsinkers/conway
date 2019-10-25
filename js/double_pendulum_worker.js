importScripts("https://d3js.org/d3.v4.min.js");

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

var g, m1, m2, M, l1, l2, h, vector, update_iterations;

onmessage = e => {
    if (e.data.type === "initialise") {
        //console.log("initialising worker");
        g = e.data.g;
        m1 = e.data.m1;
        m2 = e.data.m2;
        M = e.data.M;
        l1 = e.data.l1;
        l2 = e.data.l2;
        h = e.data.h;
        update_iterations = e.data.update_iterations;
        vector = e.data.vector;
        vector = calculateAngAcceleration(vector);
        postMessage({vector: vector});
    } else if (e.data.type === "calculate") {
        //console.log("calculating pendulum");
        let start_time = Date.now();
        for (let i=0; i < update_iterations; i++) {
            vector = calculateNextIteration(vector);
        }

        let calc_time = Date.now() - start_time;
        //console.log(`Calc time: ${calc_time}ms`)
        postMessage({"vector": vector})
    }
};
