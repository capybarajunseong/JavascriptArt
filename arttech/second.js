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
let isGlowing = false;
let glowingMarble = null;
let isEnlarging = false; // 제자리에서 확대 중인지
let enlargeProgress = 0;
let enlargeDuration = 30; // 프레임 단위 (애니메이션 속도 조정)

// 최종 확대 및 전환을 위한 변수들 추가
let isFinalEnlarging = false; // 최종 확대 중인지
let finalEnlargeProgress = 0;
let finalEnlargeDuration = 60; // 최종 확대 애니메이션 지속 시간
let isTransitioning = false; // 전환 중인지
let transitionProgress = 0;
let transitionDuration = 30; // 전환 애니메이션 지속 시간

// 배경 이미지 변수 추가
let backgroundImage;

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/second.jpg');
}

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let showMessage = false;
let messageAlpha = 0;
let messageDirection = 1;
let transitionArea = {x: 300, y: 200, w: 250, h: 550};
let hasShownSadness = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정 (first.js와 동일한 위치)
  slopeStart = createVector(900, 375);
  slopeEnd = createVector(1220, 470);
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산 (first.js와 동일한 간격)
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

  // 캐릭터 위치 설정 (first.js와 동일)
  faceX = width/2;
  faceY = height/2;
  
  // 색상 설정 (first.js와 동일)
  hairColor = color(139, 69, 19);
  eyeColor = color(0);
  skinColor = color(255, 218, 185);

  // 구슬들을 바로 슬롯에 배치 (첫 번째 노란 구슬 제외하고 한 칸씩 앞으로)
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

  // 1초 후에 첫 번째 하늘색 구슬에 빛나는 효과 적용 및 확대 시작
   setTimeout(() => {
    let firstBlue = findFirstBlueMarble();
    if (firstBlue) {
      isGlowing = true;
      glowingMarble = firstBlue;
      isEnlarging = true; // 확대 애니메이션 시작
      enlargeProgress = 0;
    }
  }, 1000); // 1초 지연

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

  // 확대/빛나는 구슬 그리기 (원래 위치에서)
  if (isGlowing && glowingMarble) {
    drawEnlargedMarble();
  }

  // 전환 효과 그리기
  if (isTransitioning) {
    drawTransitionOverlay();
  }

  // 메시지 표시 (sadness.jpg 이후에만)
  if (hasShownSadness && showMessage && isGlowing && !isDragging) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0, messageAlpha);
    text("구슬을 가져다대보세요", width/2, height/2 + 100);
    
    // 메시지 페이드 인/아웃 효과
    messageAlpha += 2 * messageDirection;
    if (messageAlpha >= 255) {
      messageDirection = -1;
    } else if (messageAlpha <= 0) {
      messageDirection = 1;
    }
  }

  // 전환 영역 표시 (디버깅용)
  // noFill();
  // stroke(255, 0, 0);
  // rect(transitionArea.x, transitionArea.y, transitionArea.w, transitionArea.h);
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

// 확대/빛나는 구슬 그리기 함수 수정
function drawEnlargedMarble() {
  if (!glowingMarble) return;

  push();
  
  // 구슬의 원래 위치로 이동
  translate(glowingMarble.x, glowingMarble.y);
  
  let scaleAmount = 1; // 시작 스케일은 1 (원래 크기)
  let finalScale = 1.3; // 최종 확대 배율 (조금 더 커지는 정도)

  if (isEnlarging) {
    // 확대 애니메이션 진행
    scaleAmount = map(enlargeProgress, 0, enlargeDuration, 1, finalScale);
    enlargeProgress++;
    
    // 애니메이션 완료 체크
    if (enlargeProgress > enlargeDuration) {
      isEnlarging = false; // 확대 애니메이션 종료
      scaleAmount = finalScale; // 최종 크기 고정
    }
  } else if (isFinalEnlarging) {
    // 최종 확대 애니메이션
    let maxScale = max(width / (glowingMarble.r * 2), height / (glowingMarble.r * 2));
    scaleAmount = map(finalEnlargeProgress, 0, finalEnlargeDuration, finalScale, maxScale);
    finalEnlargeProgress++;
    
    if (finalEnlargeProgress > finalEnlargeDuration) {
      isFinalEnlarging = false;
      isTransitioning = true;
      transitionProgress = 0;
    }
  } else {
    // 확대 애니메이션이 끝났으면 최종 크기 유지
    scaleAmount = finalScale;
  }

  scale(scaleAmount);

  // === Draw elements relative to the marble's scaled position ===

  // 빛나는 효과 그리기 (확대 완료 후 또는 애니메이션 중에도 가능)
  if (!isEnlarging && !isFinalEnlarging) {
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
  }

  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2, 2, glowingMarble.r, glowingMarble.r);

  // 구슬 본체
  fill(glowingMarble.color);
  ellipse(0, 0, glowingMarble.r, glowingMarble.r);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-glowingMarble.r/4, -glowingMarble.r/4, glowingMarble.r/3, glowingMarble.r/3);
  
  pop();
}

// 전환 효과 그리기 함수 수정
function drawTransitionOverlay() {
  if (isTransitioning) {
    let alpha = map(transitionProgress, 0, transitionDuration, 0, 255);
    if (!hasShownSadness) {
      // 하늘색 구슬의 색상(pastelColors[1])을 사용하여 페이드 아웃
      let transitionColor = color(pastelColors[1]);
      transitionColor.setAlpha(alpha);
      fill(transitionColor);
    } else {
      fill(0, alpha);
    }
    rect(0, 0, width, height);
    transitionProgress++;
    
    if (transitionProgress > transitionDuration) {
      if (!hasShownSadness) {
        window.location.href = 'sadness.html';
      } else {
        window.location.href = 'third.html';
      }
    }
  }
}

// 마우스 클릭 이벤트 처리 함수 수정
function mousePressed() {
  if (isGlowing && glowingMarble && !isEnlarging && !isFinalEnlarging) {
    let marbleCenterX = glowingMarble.x;
    let marbleCenterY = glowingMarble.y;
    let finalScale = 1.3;
    let clickableRadius = glowingMarble.r * finalScale;
    let d = dist(mouseX, mouseY, marbleCenterX, marbleCenterY);
    
    if (d < clickableRadius / 2) {
      if (!hasShownSadness) {
        // 기존 기능: sadness.jpg로 전환
        isFinalEnlarging = true;
        finalEnlargeProgress = 0;
      } else {
        // 새로운 기능: 구슬 드래그 시작
        isDragging = true;
        dragOffsetX = mouseX - marbleCenterX;
        dragOffsetY = mouseY - marbleCenterY;
        showMessage = false;
      }
    }
  }
}

function mouseDragged() {
  if (isDragging && glowingMarble && hasShownSadness) {
    glowingMarble.x = mouseX - dragOffsetX;
    glowingMarble.y = mouseY - dragOffsetY;

    // 전환 영역과의 충돌 체크
    if (glowingMarble.x > transitionArea.x && 
        glowingMarble.x < transitionArea.x + transitionArea.w &&
        glowingMarble.y > transitionArea.y && 
        glowingMarble.y < transitionArea.y + transitionArea.h) {
      isFinalEnlarging = true;
      finalEnlargeProgress = 0;
      isDragging = false;
    }
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
  }
}

// 첫 번째 하늘색 구슬을 찾는 헬퍼 함수 (기존과 동일)
function findFirstBlueMarble() {
  // pastelColors 배열에서 하늘색(인덱스 1) 구슬 찾기
  const blueColor = pastelColors[1];
  for (let slot of slots) {
    for (let marble of slot.marbles) {
      if (marble.color === blueColor) {
        return marble; // 첫 번째 발견된 하늘색 구슬 반환
      }
    }
  }
  return null; // 찾지 못한 경우
}

// 창 크기가 변경될 때 캔버스 크기도 조정 (기존과 동일)
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

// sadness.html에서 돌아왔을 때 호출되는 함수
function onReturnFromSadness() {
  hasShownSadness = true;
  showMessage = true;
  messageAlpha = 0;
  messageDirection = 1;
}
