

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
var vector = {theta1: 0, theta2: 0, alpha1: 0, alpha2: 0};


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

    // find centre

    // draw line 0-1

    // draw line 1-2

    // draw mass 1

    // draw mass 2

}

function updatePendulum(vector) {
    // based on new values, update drawing
    // compute x1, y1 from l1, theta1

    // compute x2, y2 from x1, y1, l2, theta2

    // update positions
}

document.addEventListener('DOMContentLoaded', () =>  {


});
