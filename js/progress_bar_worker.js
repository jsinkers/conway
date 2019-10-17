var i = 0;
var forwards = true;

function updateProgressBar() {
    //console.log(`worker forwards: ${forwards}`);
    if (forwards) {
        i += 1;
    } else {
        i -= 1;
    }
    postMessage({"completion": i});

    setTimeout("updateProgressBar()", 100);
}
onmessage = e => {
    console.log("Worker received message");
    forwards = e.data.forwards;
};

updateProgressBar();


