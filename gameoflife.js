// State of the Game
// Before we start writing anything, we need to consider what would be the state of the game. A state is all of the data that is necessary to represent the current game. We need to get the state of the game right because we would then need to update our user interface using the state of the game.
// Here is the state of the game of life that we are going to implement.

const unitLength = 20;
let theme = 0;
const boxColor = "#fae";
const boxColorNight = "#fffc47";
const repeatColor = "#946cc4";
const repeatColorNight = "#ff9747";
const strokeColor = 224;
const strokeColorNight = 10;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let repeatBoard;
let num1 = document.querySelector("#surviveNum1");
let num2 = document.querySelector("#surviveNum2");
let num3 = document.querySelector("#dieNum");
let num4 = document.querySelector("#reproduceNum");
let fr = +document.querySelector("#framerate").value;

// Here are the descriptions of all of the states:

// unitLength: The width and height of a box.
// boxColor: The color of the box.
// strokeColor: The color of the stroke of the box.
// columns: Number of columns in our game of life. It is determined by the width of the container and unitLength.
// rows: Number of rows in our game of life. It is determined by the height of the container and unitLength.
// currentBoard: The states of the board of the current generation.
// nextBoard: The states of the board of the next generation. It is determined by the current generation.

// ========================================================================//
// Slider that controls frame rate

// let slider = document.getElementById("myRange");
// let output = document.getElementById("rangeValue");
// output.innerHTML = slider.value; // Display the default slider value

// // Update the current slider value (each time you drag the slider handle)
// slider.oninput = function () {
//   output.innerHTML = this.value;
// };

//========================================================================//

function setup() {
  const canvas = createCanvas(windowWidth - 100, windowHeight - 400);
  // scrollbars appears even though the canvas is exactly the same size as the window.
  // This is default behavior of some browsers.
  // To avoid this, set the style property display:block for the canvas element
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(windowWidth / unitLength);
  rows = floor(windowHeight / unitLength);

  // windowWidth and windowHeight are the width and height of the viewport.
  // width and height are the width and height of the canvas element.
  // We are calling createCanvas() with windowWidth and windowHeight - 100 to make a canvas that is as wide as the screen but 100 px shorter than the height. We then use .parent() to insert our canvas element to the element with id canvas.

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  repeatBoard = [];

  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
    repeatBoard[i] = [];
  }

  // We can then calculate the columns and rows using the width,height and the unitLength. We need to use the floor function because there is no guarantee that the quotients would be an integer.
  // After that , we can simply initialize currentBoard and nextBoard to be an array of array.
  // Then we run another function called init to initialize all the boxes' value to 0.
  // Now both currentBoard and nextBoard are array of array of undefined values.

  init(); // Set the initial values of the currentBoard and nextBoard
}
//========================================================================//
// Init Function
// Let's finish the init() function. We just need loop over both currentBoard and nextBoard to set all of the boxes' value to 0.

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // We can also use random input, for example we can use the random function to randomize initial state of currentBoard.
      // currentBoard[i][j] = random() > 0.8 ? 1 : 0;
      currentBoard[i][j] = random() > 0;
      // or currentBoard = 0
      nextBoard[i][j] = 0;
      repeatBoard[i][j] = 0;
    }
  }
}

//========================================================================//
// Draw Function
// As mentioned before, the draw() function is being run for every single frame. Therefore, we need to draw the state of the current generation to the canvas inside draw() function.

function draw() {
  // In the fi st line, we set the background to white ( (255,255,255) is the RGB code of white) with the function background().

  // connect slider value with framerate

  background(200, 200, 250);

  // Then we call the function generate() which calculates the next generation with current generation.
  generate();

  /* Within the nested for-loop, you can see we are checking if the currentBoard[i][j] ==1. 
It means that we are checking if the box has life. 
If true, then we set the filling color to the boxColor , else we set it to white. 
The stroke is set to strokeColor. 
Then we can call the rect function which conveniently use the configuration we just set (filling color is boxColor and stroke color is strokeColor) to make a rect. 
The parameters i * unitLength, j * unitLength sets the position of the top left corner of the rectangle and 
the parameters unitLength, unitLength set the size of the rectangle.*/
  if (theme == 0) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (currentBoard[i][j] == 1 && repeatBoard[i][j] == 1) {
          fill(repeatColor);
        } else if (currentBoard[i][j] == 1) {
          fill(boxColor);
        } else {
          fill(250);
        }
        stroke(strokeColor);
        rect(i * unitLength, j * unitLength, unitLength, unitLength, 50);
        // rect(i * unitLength, j * unitLength, unitLength, unitLength, 50);
      }
    }
  } else if (theme == 1) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (currentBoard[i][j] == 1 && repeatBoard[i][j] == 1) {
          fill(repeatColorNight);
        } else if (currentBoard[i][j] == 1) {
          fill(boxColorNight);
        } else {
          fill("#3a1769");
        }
        stroke(strokeColorNight);
        rect(i * unitLength, j * unitLength, unitLength, unitLength, 50);
      }
    }
  }

  frameRate(fr);
}

//========================================================================//
// Generate Function
//Generate function contains the core business logic of game of life.
//  It basically calculates the next generation solely with the information of the current generation.
// Let's look at the implementation of the generate() function first.

// generate function determines the life and death of the next box,
// then draw another box based on whether next box is 1 or 0

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding) of each box
      let neighbors = 0;

      // As you can see , calculating the neighbors of a cell involves counting all of the neighbors around the current cell.
      // That is what the nested for-loop here is doing.

      // As you can see, we loop over all of the Moore neighborhoods.
      // Except when i == 0 && j == 0 (which is basically the box itself).
      // We add the number of the neighbors' value.
      // Since 0 represent lifeless, we will add 1 to neighbors every box with life.
      // Note that we are using (x + i + columns) % columns and similar code in rows case.
      // Because we don't want our lives hit the edge of our board,
      // we would like them to wrap to the other side of the board.

      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            // The continue here is for skipping the 0,0 since it is essentially the element itself.
            // continue skip an execution of an iteration in the loop, if the specified condition is met, and then continue with the next iteration in the loop
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge --> [0][0]
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];

          // It becomes a problem since we are having a trouble at the edge.We may have our array out of bound.
          // There are two cases we need to cater:
          // cell at the corners
          // cell at the '0-sided' edge
          // To cater for the cells at the corners, we need to use the module operator % to limit our index between 0(inclusive) and columns/rows(exclusive).
          // To cater for the cells at the 0-sided, we need to use add columns/rows to the index to make them positive before using the modulo operator%.
          // Hint: We can add columns/rows to the index as we wish because -1 % 7 is the same as 6 % 7 which is also the same as 13 % 7.
        }
      }
      // Rules of Life
      // if (currentBoard[x][y] == 1 && neighbors < 2) {
      if (currentBoard[x][y] == num1.value && neighbors < num2.value) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
        repeatBoard[x][y] = 0;
        // console.log(num1.value, num2.value);
      } else if (currentBoard[x][y] == 1 && neighbors > num3.value) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
        repeatBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == num4.value) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
        repeatBoard[x][y] = 0;
      } else if (
        currentBoard[x][y] == 1 &&
        neighbors >= num2.value &&
        neighbors <= num3.value
      ) {
        nextBoard[x][y] = currentBoard[x][y];
        repeatBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
        repeatBoard[x][y] = 0;
      }
    }
  }
  // At the end, we need to swap the nextBoard to be the current Board
  //  Making the calculated next generation to be the current generation.
  [currentBoard, nextBoard, repeatBoard] = [
    nextBoard,
    currentBoard,
    repeatBoard,
  ];
}

//========================================================================//
// Mouse Interactions

// When mouse is dragged
function mouseDragged() {
  //If the mouse coordinate is outside the board

  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0
  ) {
    return;
  }

  // console.log(mouseX, mouseY);
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  //TODO image drag
  // image(img, x, y, 20, 20);

  if (theme == 0) {
    fill("#ff00cc");
    stroke(200);
    rect(
      x * unitLength,
      y * unitLength,
      unitLength * 1.5,
      unitLength * 1.5,
      50
    );
  } else if (theme == 1) {
    fill("#ffd1c2");
    stroke(20);
    rect(
      x * unitLength,
      y * unitLength,
      unitLength * 1.5,
      unitLength * 1.5,
      50
    );
  }
}
//When mouse is pressed
function mousePressed() {
  noLoop();
  mouseDragged();
}
// As you can see, we run noLoop() for mousePressed().
// It means that we want p5.js to stop running draw() whenever our mouse is pressed.
// We also resume the loop of running draw() when the mouse is released.
// So the game pauses when the user pressed on the canvas and resume when the mouse is released.
// We also reuse mouseDragged in mousePressed function.

// When mouse is released
function mouseReleased() {
  loop();
}
//========================================================================//
// toggle switch

const body = document.querySelector("body");
const canvas = document.querySelector("#canvas");
const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const para = document.querySelectorAll("p");
const slider = document.querySelector(".slider");
const frText = document.querySelector(".frText");
const rangeValue = document.querySelector("#rangeValue");

const toggle = document.getElementById("toggle");
toggle.onclick = function () {
  toggle.classList.toggle("active");
  body.classList.toggle("active");
  canvas.classList.toggle("active");
  slider.classList.toggle("active");
  rangeValue.classList.toggle("active");
  frText.classList.toggle("active");
  h1.classList.toggle("active");
  h2.classList.toggle("active");

  for (let paraElement of para) {
    paraElement.classList.toggle("active");
  }
  if (theme == 0) {
    theme = 1;
  } else if (theme == 1) {
    theme = 0;
  }
};
//========================================================================//
// framerate slide
function rangeSlide(value) {
  document.getElementById("rangeValue").innerHTML = value;
}

//========================================================================//
// Run! button

document.querySelector("#run").addEventListener("click", function () {
  loop();
});

//========================================================================//
// Pause button

document.querySelector("#pause").addEventListener("click", function () {
  noLoop();
});

//========================================================================//
// Reset button

document.querySelector("#reset-game").addEventListener("click", function () {
  num1.value = 1;
  num2.value = 2;
  num3.value = 3;
  num4.value = 3;
  init();
  draw();
});
//========================================================================//
// framerate slider

document.querySelector("#framerate").addEventListener("change", function (e) {
  fr = +e.target.value;
  frameRate(fr);
});

//========================================================================//
// change rules
document
  .querySelector("#minusSurviveNum1")
  .addEventListener("click", function () {
    newNum1 = parseInt(num1.value) - 1;
    num1.value = newNum1; // num1.value is string here because form input are all inherent string
    // console.log(newNum1, typeof newNum1); // 2 number
    // console.log(typeof num1.value);
    // newNum1 = num1;
    num1.innerHTML = num1;
  });

document
  .querySelector("#plusSurviveNum1")
  .addEventListener("click", function () {
    newNum1 = parseInt(num1.value) + 1;
    num1.value = newNum1; // num1.value is string here because form input are all inherent string
    // console.log(newNum1, typeof newNum1); // 2 number
    // console.log(typeof num1.value);
    // newNum1 = num1;
    num1.innerHTML = num1;
  });

document
  .querySelector("#minusSurviveNum2")
  .addEventListener("click", function () {
    newNum2 = parseInt(num2.value) - 1;
    num2.value = newNum2; // num1.value is string here because form input are all inherent string
    // console.log(newNum1, typeof newNum1); // 2 number
    // console.log(typeof num1.value);
    // newNum1 = num1;
    num2.innerHTML = num2;
  });

document
  .querySelector("#plusSurviveNum2")
  .addEventListener("click", function () {
    newNum2 = parseInt(num2.value) + 1;
    num2.value = newNum2; // num1.value is string here because form input are all inherent string
    // console.log(newNum1, typeof newNum1); // 2 number
    // console.log(typeof num1.value);
    // newNum1 = num1;
    num2.innerHTML = num2;
  });

document.querySelector("#minusDieNum").addEventListener("click", function () {
  newNum3 = parseInt(num3.value) - 1;
  num3.value = newNum3; // num1.value is string here because form input are all inherent string
  // console.log(newNum1, typeof newNum1); // 2 number
  // console.log(typeof num1.value);
  // newNum1 = num1;
  num3.innerHTML = num3;
});

document.querySelector("#plusDieNum").addEventListener("click", function () {
  newNum3 = parseInt(num3.value) + 1;
  num3.value = newNum3; // num1.value is string here because form input are all inherent string
  // console.log(newNum1, typeof newNum1); // 2 number
  // console.log(typeof num1.value);
  // newNum1 = num1;
  num3.innerHTML = num3;
});

document.querySelector("#minusReproNum").addEventListener("click", function () {
  newNum4 = parseInt(num4.value) - 1;
  num4.value = newNum4; // num1.value is string here because form input are all inherent string
  // console.log(newNum1, typeof newNum1); // 2 number
  // console.log(typeof num1.value);
  // newNum1 = num1;
  num4.innerHTML = num4;
});

document.querySelector("#plusReproNum").addEventListener("click", function () {
  newNum4 = parseInt(num4.value) + 1;
  num4.value = newNum4; // num1.value is string here because form input are all inherent string
  // console.log(newNum1, typeof newNum1); // 2 number
  // console.log(typeof num1.value);
  // newNum1 = num1;
  num4.innerHTML = num4;
});

//========================================================================//
// Resize window

function windowResized() {
  resizeCanvas(windowWidth - 100, windowHeight - 300);
  columns = floor(windowWidth / unitLength);
  rows = floor(windowHeight / unitLength);
  for (let i = 0; i < columns; i++) {
    if (!currentBoard[i]) {
      currentBoard[i] = [];
      nextBoard[i] = [];
      repeatBoard[i] = [];
    }
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == undefined) {
        currentBoard[i][j] = 0;
        nextBoard[i][j] = 0;
        repeatBoard[i][j] = 0;
      }
    }
  }
}

//========================================================================//
// user input
