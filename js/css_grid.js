document.addEventListener('DOMContentLoaded', () => {
    console.log(`DOMContentLoaded`);
    // determine window size
    var min_x = -2.5;
    var max_x = 1.0;
    var min_y = -1.0;
    var max_y = 1.0;
    var dx = max_x - min_x;
    var dy = max_y - min_y;
    var viewportWidth = getWidth();
    var viewportHeight = getHeight();
    var width = 0;
    var height = 0;
    //var ratio = 0.8;
    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;
    var lockAspectRatio = true;

    //width = Math.round(ratio * viewportWidth);
    height = document.querySelector('.container').offsetHeight;
    width = Math.round(height * dx / dy);
    //height = Math.round(width * dy / dx);
    //if (height > viewportHeight * ratio) {
    //    height = Math.round(ratio * viewportHeight);
    //    width = Math.round(height * dx / dy);
    //}
    var aspectRatio = height / parseFloat(width);
    if (width !== document.querySelector('.container').offsetWidth) {
        document.querySelector('.wrapper').style.setProperty('grid-template-columns', `auto ${width} auto`);
        console.log(`adjusted width to ${width}px`);
    }
});

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}