
document.addEventListener('DOMContentLoaded', () => {
    var w;
    var progressBar = document.getElementById("progressBar");

    startWorker();

    function startWorker() {
        if (typeof(Worker) !== "undefined") {
            w = new Worker("js/progress_bar_worker.js");
            w.onmessage = function (event) {
                progressBar.style.width = `${Math.round(event.data.completion)}%`;
                if (event.data.completion >= 100) {
                    console.log("forwards: false");
                    w.postMessage({'forwards': false});
                } else if (event.data.completion <= 0) {
                    console.log("forwards: true");
                    w.postMessage({'forwards': true});
                }
            };
        } else {
            document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
        }
    }

    function stopWorker() {
      w.terminate();
      w = undefined;
    }
});



