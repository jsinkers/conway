//let font,
//  fontsize = 40;

//function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  //font = loadFont('assets/SourceSansPro-Regular.otf');
//}

//todo: add checkbox
function setup() {
  // number of neighbours per side
  neighbours = 2;
  // number of cells to consider
  cells = neighbours*2 + 1;
  // number of configurations
  configs = Math.pow(2, cells);
  console.log("configs=" +configs);
  // number of rules
  rules = Math.pow(2, configs);  // default rule

  ruleNum = 2025966643;

  let height = windowHeight-100;
  height = height < 100 ? 100 : height;
  createCanvas(windowWidth, height);
  //createCanvas(800, 800);
  frameRate(15);
  strokeWeight(0.7);
  // display rule
  ruleLabel = createElement('h2',"");
  //ruleLabel.style('font-family: Tahoma;')
  //ruleSlider = createSlider(0, 255,255);
  //ruleSlider.position(20,20);
  //ruleSlider.style('width','500px');
  buttonMinus = createButton('-');
  buttonPlus = createButton('+');

  // create a slider
  slider = createSlider(0, rules, ruleNum);
  slider.mouseReleased(readSlider);
  slider.touchEnded(readSlider);
  slider.addClass("slider-rule");
  slider.addClass("slider");

  buttonRandom = createButton('Randomise');
  buttonMinus.attribute("type", "button");
  buttonMinus.addClass("btn");
  buttonMinus.addClass("btn-dark");
  buttonPlus.attribute("type", "button");
  buttonPlus.addClass("btn");
  buttonPlus.addClass("btn-dark");
  buttonRandom.attribute("type", "button");
  buttonRandom.addClass("btn");
  buttonRandom.addClass("btn-dark");

  //buttonMinus.position(10,10);
  //buttonPlus.position(30,10);
  //buttonRandom.position(60,10);
  //buttonMinus.position(10,10);
  //buttonPlus.position(30,10);
  //buttonRandom.position(60,10);

  buttonMinus.mousePressed(decrementRule);
  buttonPlus.mousePressed(incrementRule);
  buttonRandom.mousePressed(randomise);
  
  //ruleLabel.position(150,-5);
  updateRuleLabel();
  // grid size
  w = 5;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // make 2D array
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }
  //console.log("columns: " + columns + ", rows: " + rows);
  // array to store new column
  next = new Array(rows);
  for (let i = 0; i < rows; i++) {
    next[i] = 0;
  }
  // initialise the rule
  init();

}

function draw() {
  //const ruleNum = floor(ruleSlider.value());
  updateRuleLabel();
  background(250);
  rule(ruleNum);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 1) {
        fill(0);
        stroke(0);
        rect(i * w, j * w, w - 1, w - 1);
      } else {
        fill(255);
      }
      //stroke(0);
      //rect(i * w, j * w, w - 1, w - 1);
    }
  }
}

function rule(ruleNum) {

  // compute new column
  for (let j = 0; j < rows; j++) {
    var cell = 0;
    for (let k = -neighbours; k <= neighbours; k++) {
      let ind = (k+j) % (rows)
      if (ind < 0) {
        ind = rows-1;
      } 
      cell = cell * 2 + board[0][ind];
    }
    next[j] = ruleValue(cell, ruleNum);
  }
  // move columns along
  for (let i = columns - 1; i > 0; i--) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = board[i - 1][j];
    }
  }
  // Swap!
  for (let j = 0; j < rows; j++) {
    board[0][j] = next[j];
    next[j] = 0;
  }
  
}

function ruleValue(cell, ruleNum) {
  //console.log("cell: " + cell + ", rule: " + ruleNum);
  return (ruleNum >> cell) & 1;
}

function init() {
  // set middle cell of board only
  board[0][floor(rows / 2)] = 1;
}

function incrementRule() {
  if (ruleNum < rules) {
    ruleNum++;
    //updateRuleLabel();
    updateSlider();
  }
  resetBoard();
  init()
}

function decrementRule() {
  if (ruleNum > 0) {
    ruleNum--;
    //updateRuleLabel();
    updateSlider();
  }
  resetBoard();
  init()
}

function resetBoard() {
  console.log("Rule " + ruleNum);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }
  
  //text
}

function randomise() {
  resetBoard();
  for (let j = 0; j < rows; j++) {
    board[0][j] = random([0,1]);
  }
}

function updateRuleLabel() {
  ruleLabel.html("Rule " +  slider.value());
}

function updateSlider() {
  slider.value(ruleNum);
}

function readSlider() {
  ruleNum = slider.value();
  updateRuleLabel();
  resetBoard();
  init();
}
