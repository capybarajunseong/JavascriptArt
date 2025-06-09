let faceX, faceY;
let hairColor;
let eyeColor;
let skinColor;

let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서

let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

// 배경 이미지 변수 추가
let backgroundImage;
let secondBackgroundImage;

// 빛나는 효과를 위한 변수들
let glowSize = 0;
let glowDirection = 1;
let messageAlpha = 0;
let messageDirection = 1;

// 드래그 관련 변수
let isDragging = false;
let draggedMarble = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// 캐릭터 위치
let characterX = 425; // 300 + (250/2) = 425 (사각형의 중심 x좌표)
let characterY = 475; // 200 + (550/2) = 475 (사각형의 중심 y좌표)
let characterWidth = 250; // 사각형의 너비
let characterHeight = 550; // 사각형의 높이

let isActionTriggered = false; // 액션(구슬 사라짐 및 전환)이 한 번만 실행되도록 하는 플래그

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/first.jpg');
  secondBackgroundImage = loadImage('../image/second.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정 (고정된 픽셀 좌표)
  slopeStart = createVector(900, 375);
  slopeEnd = createVector(1220, 470);
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산 (화면 크기에 맞게 조정)
  for (let i = 0; i < 5; i++) {
    let spacing = windowWidth * 0.07;
    let x = slopeEnd.x - (4 - i) * spacing;
    let y = floorY - 20;
    slots.push({
      x,
      y,
      filled: true,
      stackHeight: 0,
      marbles: []
    });
  }

  // 구슬 순서대로 배치 (노랑-파랑-노랑-빨강-파랑)
  let marbleOrder = [2, 1, 2, 0, 1];
  for (let i = 0; i < 5; i++) {
    let colorIndex = marbleOrder[i];
    let marble = {
      x: slots[i].x,
      y: floorY - 20,
      r: i === 0 ? 40 * 2.0 : 40, // 첫 번째 구슬만 2.0배 크기
      color: pastelColors[colorIndex],
      rotation: 0,
      stopped: true,
      isGlowing: i === 0, // 첫 번째 구슬만 빛나도록 설정
      isDraggable: i === 0 // 첫 번째 구슬만 드래그 가능하도록 설정
    };
    marbles.push(marble);
    slots[i].marbles.push(marble);
    slots[i].stackHeight = i === 0 ? 40 * 2.0 : 40; // 첫 번째 구슬의 높이도 2.0배
  }

  // 캐릭터 위치 설정
  faceX = width/2;
  faceY = height/2;
  
  // 색상 설정
  hairColor = color(139, 69, 19); // 갈색 머리
  eyeColor = color(0); // 검은 눈
  skinColor = color(255, 218, 185); // 피부색
}

function draw() {
  // 배경 이미지 그리기 (캔버스 크기에 맞게)
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(245);
  }

  // 대각선 발판 그리기
  drawSlope();

  // 구슬 그리기
  for (let marble of marbles) {
    if (marble.isGlowing) {
      drawGlowingMarble(marble);
    } else {
      drawMarble(marble);
    }
  }

  // 빛나는 효과 업데이트
  updateGlowEffect();

  // 드래그 중인 구슬 업데이트
  if (isDragging && draggedMarble) {
    draggedMarble.x = mouseX - dragOffsetX;
    draggedMarble.y = mouseY - dragOffsetY;

    // 캐릭터와의 충돌 체크 (사각형 영역)
    let marbleX = draggedMarble.x;
    let marbleY = draggedMarble.y;
    
    // 구슬이 사각형 영역 안에 있고, 아직 액션이 트리거되지 않았다면
    if (marbleX > 300 && marbleX < 550 && 
        marbleY > 200 && marbleY < 750 && 
        !isActionTriggered) {
      
      isActionTriggered = true; // 액션 트리거됨 설정

      // 노란색 구슬 사라지게 하기 (배열에서 제거)
      marbles = marbles.filter(m => m !== draggedMarble);
      
      // 드래그 상태 종료
      isDragging = false;
      draggedMarble = null;

      // 배경 이미지 변경
      backgroundImage = secondBackgroundImage;
      
      console.log("Marble collided with character! Preparing for transition..."); // 충돌 감지 로그
      // 0.05초 후 second.html로 전환
      setTimeout(() => {
        console.log("Navigating to second.html now!"); // 전환 시작 로그
        window.location.href = 'second.html'; // href 사용
      }, 50); // 50 milliseconds 지연
    }
  }

  // 디버깅용: 캐릭터 위치 표시 (개발 중에만 사용)
  // noFill(); // 주석 처리
  // stroke(255, 0, 0); // 주석 처리
  // rect(300, 200, 250, 550); // 충돌 영역 시각화 비활성화
}

function mousePressed() {
  // 첫 번째 구슬(노란색)과의 충돌 체크
  let firstMarble = marbles[0];
  if (firstMarble && firstMarble.isDraggable) {
    let d = dist(mouseX, mouseY, firstMarble.x, firstMarble.y);
    if (d < firstMarble.r) { // 이미 1.3배 크기이므로 그대로 사용
      isDragging = true;
      draggedMarble = firstMarble;
      dragOffsetX = mouseX - firstMarble.x;
      dragOffsetY = mouseY - firstMarble.y;
    }
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
    draggedMarble = null;
  }
}

function drawSlope() {
  // 파스텔 핑크 기본 색상 (RGB)
  let basePink = color(255, 182, 193);
  // 그림자 색상 (더 어둡게)
  let shadowPink = color(220, 150, 160);
  // 하이라이트 색상 (더 밝게)
  let highlightPink = color(255, 200, 210);

  let slopeThickness = 15; // 발판 두께 설정

  // 발판 본체 (면으로 그리기)
  noStroke();
  fill(basePink);
  quad(
    slopeStart.x, slopeStart.y,
    slopeEnd.x, slopeEnd.y,
    slopeEnd.x, slopeEnd.y + slopeThickness,
    slopeStart.x, slopeStart.y + slopeThickness
  );

  // 발판 하이라이트 (위쪽 면)
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
  
  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2, 2, marble.r, marble.r);
  
  // 구슬 본체
  fill(marble.color);
  ellipse(0, 0, marble.r, marble.r);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-marble.r/4, -marble.r/4, marble.r/3, marble.r/3);
  
  pop();
}

function drawGlowingMarble(marble) {
  push();
  translate(marble.x, marble.y);
  rotate(marble.rotation);
  
  // 빛나는 효과
  noStroke();
  for (let i = 3; i > 0; i--) {
    let alpha = 100 - i * 30;
    fill(255, 255, 200, alpha);
    ellipse(0, 0, marble.r * 1.3 * (1 + glowSize * 0.1) + i * 10);
  }
  
  // 구슬 그림자
  fill(0, 0, 0, 30);
  ellipse(2, 2, marble.r * 1.3, marble.r * 1.3);
  
  // 구슬 본체
  fill(marble.color);
  ellipse(0, 0, marble.r * 1.3, marble.r * 1.3);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-marble.r/4, -marble.r/4, marble.r/3, marble.r/3);
  
  pop();

  // 메시지 그리기
  textAlign(CENTER);
  textSize(20);
  fill(0, messageAlpha);
  text("구슬을 끌어당겨 주인공의 반응을 확인해보세요!", marble.x, marble.y + marble.r * 1.5 + 30);
}

function updateGlowEffect() {
  // 빛나는 효과 업데이트
  glowSize += 0.05 * glowDirection;
  if (glowSize > 1) {
    glowDirection = -1;
  } else if (glowSize < 0) {
    glowDirection = 1;
  }

  // 메시지 투명도 업데이트
  messageAlpha += 2 * messageDirection;
  if (messageAlpha > 255) {
    messageDirection = -1;
  } else if (messageAlpha < 0) {
    messageDirection = 1;
  }
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
    slots[i].x = slopeEnd.x - (4 - i) * spacing;
    slots[i].y = floorY - 20;
  }

  // 구슬 위치도 재조정
  for (let i = 0; i < marbles.length; i++) {
    marbles[i].x = slots[i].x;
    marbles[i].y = floorY - 20; // 모든 구슬의 y좌표를 동일하게 설정
  }
}