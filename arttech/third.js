let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let maxMarbles = 3; // 5개에서 4개로 변경 (첫 번째 노란 구슬 제외)

// 구슬 순서 정의 (0: 빨강, 1: 파랑, 2: 노랑)
let marbleOrder = [2, 0, 1]; // 파랑-노랑-빨강-파랑 순서 (첫 번째 노란 구슬 제외)

let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

// 날아가는 구슬을 위한 변수 추가
let flyingMarble = null;
let flyingMarbleTargetX, flyingMarbleTargetY;
let flyingMarbleStartX, flyingMarbleStartY;
let flyingMarbleProgress = 0;
let flyingMarbleDuration = 120; // 프레임 단위 (애니메이션 속도 조정)
let isFlying = false;

let backgroundImage;

function preload() {
  backgroundImage = loadImage('../image/third.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정 (second.js와 동일한 위치)
  slopeStart = createVector(900, 375);
  slopeEnd = createVector(1220, 470);
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산 (second.js와 동일한 간격)
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

  // 구슬들을 바로 슬롯에 배치 (second.js와 동일)
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

  // 날아가는 구슬 초기화
  const refWidth = 1200;
  const refHeight = 800;
  const targetX_ref = 300;
  const targetY_ref = 200;
  const targetW_ref = 250;
  const targetH_ref = 550;

  const scaleX = width / refWidth;
  const scaleY = height / refHeight;

  flyingMarbleStartX = targetX_ref * scaleX + (targetW_ref * scaleX) / 2;
  flyingMarbleStartY = targetY_ref * scaleY + (targetH_ref * scaleY) / 2;
  flyingMarbleTargetX = width - 100; // 오른쪽 상단으로
  flyingMarbleTargetY = 100;       // 오른쪽 상단으로

  flyingMarble = {
    x: flyingMarbleStartX,
    y: flyingMarbleStartY,
    r: 40, // 원래 크기 (그리기 함수에서 확대)
    color: pastelColors[1] // 하늘색
  };
  isFlying = true;
  flyingMarbleProgress = 0;
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  }

  drawSlope();

  // 모든 구슬 그리기
  for (let marble of marbles) {
    drawMarble(marble);
  }

  // 날아가는 구슬 그리기 및 애니메이션
  if (isFlying) {
    flyingMarble.x = lerp(flyingMarbleStartX, flyingMarbleTargetX, flyingMarbleProgress / flyingMarbleDuration);
    flyingMarble.y = lerp(flyingMarbleStartY, flyingMarbleTargetY, flyingMarbleProgress / flyingMarbleDuration);
    drawFlyingMarble(flyingMarble); // 날아가는 구슬 그리기

    flyingMarbleProgress++;
    if (flyingMarbleProgress > flyingMarbleDuration) {
      isFlying = false; // 애니메이션 종료
      window.location.href = 'throw.html'; // throw.html로 이동
    }
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

function drawFlyingMarble(marble) {
  push();
  translate(marble.x, marble.y);
  let scaleAmount = 1.3; // 1.3배 확대
  scale(scaleAmount);

  // 빛나는 효과 그리기
  let glowColor = color(marble.color);
  for (let i = 0; i < 5; i++) {
    let baseGlowSize = marble.r * 2;
    let glowRingSize = baseGlowSize + (i * 10 / scaleAmount);
    glowColor.setAlpha(map(i, 0, 4, 40, 0));
    fill(glowColor);
    ellipse(0, 0, glowRingSize, glowRingSize);
  }

  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2 / scaleAmount, 2 / scaleAmount, marble.r * 2, marble.r * 2);

  // 구슬 본체
  fill(marble.color);
  ellipse(0, 0, marble.r * 2, marble.r * 2);

  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-marble.r / 4 / scaleAmount, -marble.r / 4 / scaleAmount, marble.r / 3 * 2, marble.r / 3 * 2);
  pop();
}

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

  // 날아가는 구슬 위치 재조정 (선택 사항: 애니메이션 중이면 현재 위치 유지, 아니면 재계산)
  const refWidth = 1200;
  const refHeight = 800;
  const targetX_ref = 300;
  const targetY_ref = 200;
  const targetW_ref = 250;
  const targetH_ref = 550;

  const scaleX = width / refWidth;
  const scaleY = height / refHeight;

  flyingMarbleStartX = targetX_ref * scaleX + (targetW_ref * scaleX) / 2;
  flyingMarbleStartY = targetY_ref * scaleY + (targetH_ref * scaleY) / 2;
  flyingMarbleTargetX = width - 100; // 오른쪽 상단으로
  flyingMarbleTargetY = 100;       // 오른쪽 상단으로

  if (flyingMarble && !isFlying) { // 애니메이션이 끝나고 정지해 있다면 재위치
    flyingMarble.x = flyingMarbleTargetX;
    flyingMarble.y = flyingMarbleTargetY;
  }
}
