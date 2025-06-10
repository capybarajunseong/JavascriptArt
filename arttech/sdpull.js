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

// 확대 애니메이션을 위한 변수들
let isGlowing = true; // 항상 true로 설정
let glowingMarble = null;
let isEnlarging = false; // 애니메이션 없음
let enlargeProgress = 30; // 완료 상태로 설정
let enlargeDuration = 30;

// 드래그 관련 변수 추가
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// 배경 이미지 변수 추가
let backgroundImage;

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/second.jpg');
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

  // 첫 번째 하늘색 구슬을 바로 확대된 상태로 설정
  let firstBlue = findFirstBlueMarble();
  if (firstBlue) {
    glowingMarble = firstBlue;
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
    // 현재 빛나는 구슬이 아니라면 그립니다.
    if (marble !== glowingMarble) {
      drawMarble(marble);
    }
  }

  // 확대/빛나는 구슬 그리기
  if (isGlowing && glowingMarble) {
    drawEnlargedMarble();
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

function drawEnlargedMarble() {
  if (!glowingMarble) return;

  push();
  
  // 구슬의 원래 위치로 이동
  translate(glowingMarble.x, glowingMarble.y);
  
  // 항상 1.3배 크기로 고정
  let scaleAmount = 1.3;
  scale(scaleAmount);

  // 빛나는 효과 그리기
  push();
  let glowColor = color(glowingMarble.color);
  
  for (let i = 0; i < 5; i++) { 
    let baseGlowSize = glowingMarble.r * 2;
    let glowRingSize = baseGlowSize + (i * 10 / scaleAmount);
    glowColor.setAlpha(map(i, 0, 4, 40, 0));
    fill(glowColor);
    ellipse(0, 0, glowRingSize, glowRingSize);
  }
  pop();

  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2/scaleAmount, 2/scaleAmount, glowingMarble.r * 2, glowingMarble.r * 2);

  // 구슬 본체
  fill(glowingMarble.color);
  ellipse(0, 0, glowingMarble.r * 2, glowingMarble.r * 2);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-glowingMarble.r/4 / scaleAmount, -glowingMarble.r/4 / scaleAmount, glowingMarble.r/3 * 2, glowingMarble.r/3 * 2);
  
  // 메시지 표시
  textAlign(CENTER, CENTER);
  textSize(24 / scaleAmount);
  fill(0);
  text("구슬을 끌어당겨 주인공의 반응을 확인해보세요!", 0, glowingMarble.r * 2 / scaleAmount + 30 / scaleAmount);

  pop();
}

// 첫 번째 하늘색 구슬을 찾는 헬퍼 함수
function findFirstBlueMarble() {
  const blueColor = pastelColors[1];
  for (let slot of slots) {
    for (let marble of slot.marbles) {
      if (marble.color === blueColor) {
        return marble;
      }
    }
  }
  return null;
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

function mousePressed() {
  if (glowingMarble) {
    let finalScale = 1.3;
    let clickableRadius = glowingMarble.r * finalScale;
    
    let d = dist(mouseX, mouseY, glowingMarble.x, glowingMarble.y);
    
    if (d < clickableRadius / 2) {
      isDragging = true;
      offsetX = mouseX - glowingMarble.x;
      offsetY = mouseY - glowingMarble.y;
    }
  }
}

function mouseDragged() {
  if (isDragging) {
    glowingMarble.x = mouseX - offsetX;
    glowingMarble.y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;

    // 1200x800 기준의 사각형 범위
    const refWidth = 1200;
    const refHeight = 800;
    const targetX_ref = 300;
    const targetY_ref = 200;
    const targetW_ref = 250;
    const targetH_ref = 550;

    // 현재 캔버스 크기에 맞춰 범위 스케일 조정
    const scaleX = width / refWidth;
    const scaleY = height / refHeight;

    const targetX_scaled = targetX_ref * scaleX;
    const targetY_scaled = targetY_ref * scaleY;
    const targetW_scaled = targetW_ref * scaleX;
    const targetH_scaled = targetH_ref * scaleY;

    // 구슬의 중심이 범위 안에 있는지 확인
    if (glowingMarble.x > targetX_scaled && 
        glowingMarble.x < targetX_scaled + targetW_scaled &&
        glowingMarble.y > targetY_scaled &&
        glowingMarble.y < targetY_scaled + targetH_scaled) {

      window.location.href = 'third.html';
    }
  }
}
