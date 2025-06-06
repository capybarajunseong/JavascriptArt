let faceX, faceY;
let hairColor;
let eyeColor;
let skinColor;

let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let maxMarbles = 4; // 5개에서 4개로 변경 (첫 번째 노란 구슬 제외)

// 구슬 순서 정의 (0: 빨강, 1: 파랑, 2: 노랑)
let marbleOrder = [1, 2, 0, 1]; // 파랑-노랑-빨강-파랑 순서 (첫 번째 노란 구슬 제외)

let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

// 배경 이미지 변수
let backgroundImage;

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/first.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정
  slopeStart = createVector(900, 375);
  slopeEnd = createVector(1220, 470);
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산
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

  // 캐릭터 위치 설정
  faceX = width/2;
  faceY = height/2;
  
  // 색상 설정
  hairColor = color(139, 69, 19);
  eyeColor = color(0);
  skinColor = color(255, 218, 185);

  // 구슬들을 바로 슬롯에 배치
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
}

function draw() {
  // 배경 이미지 그리기
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(245);
  }

  drawSlope();

  // 모든 구슬 그리기
  for (let marble of marbles) {
    drawMarble(marble);
  }
}

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

// 창 크기가 변경될 때 캔버스 크기도 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 대각선 발판 위치 재조정
  slopeStart = createVector(900, 375);
  slopeEnd = createVector(1220, 470);
  floorY = slopeEnd.y + 20;

  // 슬롯 위치 재조정
  for (let i = 0; i < slots.length; i++) {
    let spacing = windowWidth * 0.07;
    slots[i].x = slopeEnd.x - 200 - (maxMarbles - 1 - i) * spacing;
    slots[i].y = floorY - 20;
  }
}
