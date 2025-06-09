let backgroundImage;
let cloudImage;
let cloudImageLoaded = false;
let smellImage;
let smellImageLoaded = false;
let smellX, smellY;
let smellInitialPositionSet = false;
// let smokeOverlayImage; // smokking.png 관련 변수 주석 처리
// let smokeImageLoaded = false; // smokking.png 로드 여부 변수는 필요 없으므로 유지할 필요 없음

let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
let isDownPressed = false;

// Variables for marbles and slope, copied from second.js
let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let maxMarbles = 3; 
let marbleOrder = [2, 0, 1]; // 노랑-빨강-파랑 순서
let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

function preload() {
  backgroundImage = loadImage('../image/smoke.jpg');
  cloudImage = loadImage('../image/cloud.png', () => {
    cloudImageLoaded = true;
  });
  smellImage = loadImage('../image/smell.png', () => {
    smellImageLoaded = true;
  });
  // smokeOverlayImage = loadImage('../image/smokking.png', () => { // smokking.png 로드 주석 처리
  //   smokeImageLoaded = true;
  // });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  angleMode(DEGREES); // Needed for marble rotation

  // Slope setup copied from second.js
  slopeStart = createVector(860, 395);
  slopeEnd = createVector(1180, 490);
  floorY = slopeEnd.y + 20;

  // Slot coordinates copied from second.js
  for (let i = 0; i < maxMarbles; i++) {
    let spacing = windowWidth * 0.07;
    let x = slopeEnd.x - 200 - (maxMarbles - 1 - i) * spacing;
    let y = floorY - 20;
    slots.push({
      x,
      y,
      filled: false,
      stackHeight: 0,
      marbles: []
    });
  }

  // Place marbles into slots (static display, no animation) copied from second.js
  for (let i = 0; i < maxMarbles; i++) {
    let colorIndex = marbleOrder[i];
    let color = pastelColors[colorIndex];
    
    let marble = {
      x: slots[i].x,
      y: floorY - (slots[i].stackHeight + 20),
      r: 40,
      color: color,
      rotation: random(0, 360)
    };
    
    slots[i].marbles.push(marble);
    slots[i].stackHeight += marble.r * 0.8;
    slots[i].filled = true;
    marbles.push(marble);
    filledSlots++;
  }

  if (smellImageLoaded) {
    // Set initial position once image and floorY are ready
    if (!smellInitialPositionSet) {
      smellX = width * 0.36; // Moved slightly more to the right
      smellY = floorY - (smellImage.height * 0.65) + 230; // Moved further down
      smellInitialPositionSet = true;
      console.log("smellImage initial position set:", "X: ", smellX, "Y: ", smellY, "Width: ", smellImage.width, "Height: ", smellImage.height, "FloorY: ", floorY);
    }
    image(smellImage, smellX, smellY, smellImage.width * 0.65, smellImage.height * 0.65); // Increased size
    console.log("smellImage current position:", "X: ", smellX, "Y: ", smellY);
  }
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(0); // Fallback if image not loaded
  }

  if (cloudImageLoaded) {
    image(cloudImage, -150, 0, cloudImage.width, cloudImage.height);
  }

  if (smellImageLoaded) {
    image(smellImage, smellX, smellY, smellImage.width * 0.6, smellImage.height * 0.6); // Increased size
  }

  let moveAmount = 5; // Adjust movement speed for continuous movement

  if (isLeftPressed) {
    smellX -= moveAmount;
  }
  if (isRightPressed) {
    smellX += moveAmount;
  }
  if (isUpPressed) {
    smellY -= moveAmount;
  }
  if (isDownPressed) {
    smellY += moveAmount;
  }

  // Check for transition to follow.html
  // The image's current scale is 0.65 (smellImage.width * 0.65)
  if (smellX + (smellImage.width * 0.65) < 0) {
    window.location.href = 'follow.html';
  }

  drawSlope();

  // Draw all marbles statically
  for (let marble of marbles) {
    drawMarble(marble);
  }

  // if (smokeImageLoaded) { // smokking.png 그리기 주석 처리
  //   image(smokeOverlayImage, 0, 0, width, height);
  // }
}

// drawSlope and drawMarble functions copied from second.js
function drawSlope() {
  let basePink = color(255, 182, 193);
  let shadowPink = color(220, 150, 160);
  let highlightPink = color(255, 200, 210);

  let slopeThickness = 15;

  noStroke();
  fill(basePink);
  quad(
    slopeStart.x, slopeStart.y,
    slopeEnd.x, slopeEnd.y,
    slopeEnd.x, slopeEnd.y + slopeThickness,
    slopeStart.x, slopeStart.y + slopeThickness
  );

  fill(highlightPink);
  quad(
    slopeStart.x, slopeStart.y,
    slopeStart.x - slopeThickness * (slopeEnd.x - slopeStart.x) / (slopeStart.y - slopeEnd.y), slopeStart.y + slopeThickness,
    slopeEnd.x, slopeEnd.y + slopeThickness,
    slopeEnd.x, slopeEnd.y
  );
}

function drawMarble(marble) {
  push();
  translate(marble.x, marble.y);
  rotate(marble.rotation);
  
  noStroke();
  fill(0, 0, 0, 30); // 그림자
  ellipse(2, 2, marble.r, marble.r);
  
  fill(marble.color);
  ellipse(0, 0, marble.r, marble.r);
  
  fill(255, 255, 255, 100); // 하이라이트
  ellipse(-marble.r/4, -marble.r/4, marble.r/3, marble.r/3);
  
  pop();
}

function keyPressed() {
  // let moveAmount = 10; // Adjust movement speed

  if (keyCode === LEFT_ARROW) {
    isLeftPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    isRightPressed = true;
  } else if (keyCode === UP_ARROW) {
    isUpPressed = true;
  } else if (keyCode === DOWN_ARROW) {
    isDownPressed = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    isLeftPressed = false;
  } else if (keyCode === RIGHT_ARROW) {
    isRightPressed = false;
  } else if (keyCode === UP_ARROW) {
    isUpPressed = false;
  } else if (keyCode === DOWN_ARROW) {
    isDownPressed = false;
  }
}
