let faceX, faceY;
let hairColor;
let eyeColor;
let skinColor;

let marbles = [];
let isRolling = false;
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let startButton;
let spawnInterval = 500; // 구슬 생성 간격을 1000ms에서 500ms로 줄임
let lastSpawnTime = 0;
let marbleCount = 0;
let maxMarbles = 5; // 6개에서 5개로 변경

// 구슬 순서 정의 (0: 빨강, 1: 파랑, 2: 노랑)
let marbleOrder = [2, 1, 2, 0, 1]; // 노랑-파랑-노랑-빨강-파랑 순서

let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

// 확대 애니메이션을 위한 변수들
let isGlowing = false;
let glowingMarble = null;
let isAllMarblesStopped = false; // 모든 구슬이 멈췄는지 확인
let isEnlarging = false; // 제자리에서 확대 중인지
let enlargeProgress = 0;
let enlargeDuration = 30; // 프레임 단위 (애니메이션 속도 조정)
let currentScale = 1; // 현재 스케일을 저장하는 변수 추가

// 최종 확대 및 전환을 위한 변수들
let isFinalEnlarging = false; // 더 이상 사용하지 않음
let finalEnlargeProgress = 0;
let finalEnlargeDuration = 60;
let isTransitioningToHappy = false; // 더 이상 사용하지 않음
let transitionProgress = 0;
let transitionDuration = 30;

// 배경 이미지 변수 추가
let backgroundImage;

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/first.jpg'); // 이미지 파일 경로 업데이트
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정 (고정된 픽셀 좌표)
  slopeStart = createVector(900, 375); // Moved start point further left
  slopeEnd = createVector(1220, 470); // Fixed end point
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산 (화면 크기에 맞게 조정)
  for (let i = 0; i < maxMarbles; i++) {
    let spacing = windowWidth * 0.07;
    let x = slopeEnd.x - (maxMarbles - 1 - i) * spacing;
    let y = floorY + 10; // Y축으로 30픽셀 더 아래로 조정 (원래 -20 -> +10)
    slots.push({
      x,
      y,
      filled: false,
      stackHeight: 0,
      marbles: []
    });
  }

  startButton = createButton('Start');
  startButton.position(windowWidth / 2 - 30, windowHeight / 2);
  startButton.mousePressed(() => {
    startButton.hide();
    RollInMarbles();
  });

  // Customize button style
  startButton.style('background-color', '#FFDAB9'); // 파스텔 피치 색상
  startButton.style('color', '#8B4513'); // 진한 갈색 텍스트
  startButton.style('font-family', 'Arial, sans-serif'); // 폰트 변경 (둥근 느낌의 폰트가 설치되어 있다면 그 폰트 이름으로 변경 가능)
  startButton.style('font-size', '28px'); // 폰트 크기 증가
  startButton.style('padding', '20px 40px'); // 버튼 패딩 증가 (크기 증가)
  startButton.style('border-radius', '30px'); // 둥근 모서리
  startButton.style('border', 'none'); // 테두리 제거
  startButton.style('cursor', 'pointer'); // 마우스 오버 시 포인터 변경
  startButton.style('box-shadow', '3px 3px 5px rgba(0,0,0,0.2)'); // 그림자 효과
  startButton.style('transition', 'all 0.3s ease'); // 부드러운 전환 효과
  
  // Add hover effect (optional, P5.js doesn't directly support :hover, but can be done with mouseX/Y or by adding a CSS class)
  // For simplicity, we'll just apply the base style here. For hover, custom CSS would be better.

  // 캐릭터 위치 설정
  faceX = width/2;
  faceY = height/2;
  
  // 색상 설정
  hairColor = color(139, 69, 19); // 갈색 머리
  eyeColor = color(0); // 검은 눈
  skinColor = color(255, 218, 185); // 피부색
}

function draw() {
  // 화면 전환 중이 아닐 때만 first.js의 기본 요소들을 그립니다.
  if (!isTransitioningToHappy) {
    // 배경 이미지 그리기 (캔버스 크기에 맞게)
    if (backgroundImage) {
      image(backgroundImage, 0, 0, width, height);
    } else {
      background(245);
    }

    // 대각선 발판 그리기
    drawSlope();

    // 구슬 그리기 (빛나는 구슬 제외하고 그리기)
    for (let marble of marbles) {
      // 빛나는 구슬은 건너뛰기
      if (isGlowing && glowingMarble && marble === glowingMarble) continue;

      if (!marble.stopped) {
        // 구슬 이동 및 회전
        marble.x += marble.vx;
        marble.y += marble.vy;
        marble.rotation += marble.vx * 2;

        // 바구니 안에 닿으면 슬롯에 넣기
        if (marble.y >= floorY - marble.r / 2) {
          let slot = findNextAvailableSlot();
          if (slot) {
            // 구슬을 슬롯에 추가
            slot.marbles.push(marble);
            slot.stackHeight += marble.r * 0.8;
            
            // 구슬 위치 조정 (바구니 안쪽으로)
            marble.x = slot.x;
            marble.y = floorY - slot.stackHeight + 20; // Y축으로 30픽셀 더 아래로 조정 (원래 -10 -> +20)
            marble.vx = 0;
            marble.vy = 0;
            marble.stopped = true;
            slot.filled = true;
            filledSlots++;

            // 모든 구슬이 멈췄는지 확인
            if (filledSlots >= maxMarbles && !isAllMarblesStopped) {
              isAllMarblesStopped = true;
              // 첫 번째 노란 구슬 찾기
              let firstYellowMarble = findFirstYellowMarble();
              if (firstYellowMarble) {
                isGlowing = true;
                glowingMarble = firstYellowMarble;
                isEnlarging = true;
                enlargeProgress = 0;
              }
            }
          }
        }
      }

      // 구슬 그리기
      drawMarble(marble);
    }

    // 구슬 계속 굴리기
    if (isRolling && marbleCount < maxMarbles) {
      if (millis() - lastSpawnTime > spawnInterval) {
        spawnMarble();
        lastSpawnTime = millis();
      }
    }
  }

  // 확대된 구슬 그리기 (항상 마지막에 그려서 다른 구슬들 위에 표시)
  if (isGlowing && glowingMarble) {
    drawEnlargedMarble();
  }

  // 그라데이션 전환 효과 그리기 (화면 전환 중일 때만)
  if (isTransitioningToHappy) {
    drawTransitionOverlay();
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

function drawBasket() {
  // 바구니 크기를 화면 크기에 맞게 조정 (왼쪽으로 확장, 높이 감소)
  let basketWidth = windowWidth * 0.8; // Further increased width
  let basketHeight = windowHeight * 0.1; // Decreased height
  
  // 바구니 배경
  noStroke();
  fill(220, 220, 220, 100);
  rect(slopeEnd.x - basketWidth/2, floorY - basketHeight, basketWidth, basketHeight);

  // 바구니 테두리
  stroke(180);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(slopeEnd.x - basketWidth/2, floorY - basketHeight);
  vertex(slopeEnd.x + basketWidth/2, floorY - basketHeight);
  vertex(slopeEnd.x + basketWidth/2, floorY);
  vertex(slopeEnd.x - basketWidth/2, floorY);
  endShape(CLOSE);

  // 바구니 패턴
  stroke(160);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let y = floorY - basketHeight + i * (basketHeight/5);
    line(slopeEnd.x - basketWidth/2, y, slopeEnd.x + basketWidth/2, y);
  }
  for (let i = 0; i < 8; i++) {
    let x = slopeEnd.x - basketWidth/2 + i * (basketWidth/8);
    line(x, floorY - basketHeight, x, floorY);
  }

  // 바구니 그림자
  noStroke();
  fill(0, 0, 0, 20);
  rect(slopeEnd.x - basketWidth/2, floorY, basketWidth, 10);
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

function drawEnlargedMarble() {
  if (!glowingMarble) return;

  push();
  translate(glowingMarble.x, glowingMarble.y);
  let finalScale = 1.3; // 최종 확대 배율을 1.3으로 설정
  let scaleAmount = currentScale;

  if (isEnlarging) {
    scaleAmount = map(enlargeProgress, 0, enlargeDuration, 1, finalScale);
    enlargeProgress++;
    if (enlargeProgress > enlargeDuration) {
      isEnlarging = false;
      currentScale = finalScale; // 확대 끝나면 1.3으로 고정
      scaleAmount = finalScale;
    } else {
      currentScale = scaleAmount; // 애니메이션 중에는 계속 갱신
    }
  } else if (isFinalEnlarging) {
    let maxScale = max(width / (glowingMarble.r * 2), height / (glowingMarble.r * 2));
    scaleAmount = map(finalEnlargeProgress, 0, finalEnlargeDuration, finalScale, maxScale);
    finalEnlargeProgress++;
    if (finalEnlargeProgress > finalEnlargeDuration) {
      isFinalEnlarging = false;
      // 구슬의 상태를 localStorage에 저장
      localStorage.setItem('marbleScale', scaleAmount);
      localStorage.setItem('marbleX', glowingMarble.x);
      localStorage.setItem('marbleY', glowingMarble.y);
      localStorage.setItem('marbleRadius', glowingMarble.r);
      window.location.href = 'happy.html';
    }
  } else {
    // 확대 애니메이션이 끝난 뒤에는 1.3배 유지
    currentScale = finalScale;
    scaleAmount = finalScale;
  }

  scale(scaleAmount);

  // 빛나는 효과 (확대 끝난 후에도 계속)
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
  ellipse(2/scaleAmount, 2/scaleAmount, glowingMarble.r * 2, glowingMarble.r * 2);
  // 구슬 본체
  fill(glowingMarble.color);
  ellipse(0, 0, glowingMarble.r * 2, glowingMarble.r * 2);
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-glowingMarble.r/4 / scaleAmount, -glowingMarble.r/4 / scaleAmount, glowingMarble.r/3 * 2, glowingMarble.r/3 * 2);

  // 메시지 표시 (확대 완료 후, 최종 확대 전)
  if (!isEnlarging && !isFinalEnlarging) {
    textAlign(CENTER, CENTER);
    textSize(24 / scaleAmount);
    fill(0);
    text("구슬을 눌러 추억을 확인해보세요!", 0, glowingMarble.r * 2 / scaleAmount + 30 / scaleAmount);
  }

  pop();
}

function drawTransitionOverlay() {
  if (isTransitioningToHappy) {
    if (transitionProgress < transitionDuration) {
      // 점차 투명해지는 노란색 오버레이를 그려서 first.js 화면을 완전히 덮습니다.
      let alpha = map(transitionProgress, 0, transitionDuration, 0, 255); // Fade from transparent to opaque
      fill(255, 255, 165, alpha); // Yellow color with increasing alpha (pastelColors[2] is yellow)
      rect(0, 0, width, height); // Draw a rectangle over the entire canvas
      transitionProgress++;
    } else {
      // Transition complete, navigate to happy.html
      window.location.href = 'happy.html';
    }
  }
}

function mousePressed() {
  // 빛나는 구슬이 있고 확대 애니메이션이 끝났을 때만 클릭 감지
  if (isGlowing && glowingMarble && !isEnlarging && !isFinalEnlarging) {
    let marbleCenterX = glowingMarble.x;
    let marbleCenterY = glowingMarble.y;
    let finalScale = 1.3;
    let clickableRadius = glowingMarble.r * finalScale;
    let d = dist(mouseX, mouseY, marbleCenterX, marbleCenterY);
    if (d < clickableRadius / 2) {
      isFinalEnlarging = true;
      finalEnlargeProgress = 0;
    }
  }
}

function RollInMarbles() {
  if (marbleCount < maxMarbles) {
    isRolling = true;
    lastSpawnTime = millis();
  }
}

function spawnMarble() {
  let startX = slopeStart.x - 50;
  let startY = slopeStart.y - 50;
  let angle = atan2(slopeEnd.y - slopeStart.y, slopeEnd.x - slopeStart.x);
  let speed = 6; // 속도를 5에서 10으로 증가

  // 지정된 순서대로 색상 지정
  let colorIndex = marbleOrder[marbleCount];
  let color = pastelColors[colorIndex];

  marbles.push({
    x: startX,
    y: startY,
    vx: cos(angle) * speed,
    vy: sin(angle) * speed,
    r: 40,
    color: color,
    rotation: random(0, 360),
    stopped: false
  });

  marbleCount++;
}

function findNextAvailableSlot() {
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i].filled) return slots[i];
  }
  return null;
}

// 첫 번째 노란 구슬 찾기
function findFirstYellowMarble() {
  // 슬롯을 순서대로 검사
  for (let slot of slots) {
    // 각 슬롯의 구슬들을 순서대로 검사
    for (let marble of slot.marbles) {
      // 첫 번째로 발견되는 노란 구슬 반환
      if (marble.color === pastelColors[2]) {
        return marble;
      }
    }
  }
  return null;
}

// 구슬 제거 함수
function removeMarble(marbleToRemove) {
  // marbles 배열에서 제거
  marbles = marbles.filter(m => m !== marbleToRemove);
  
  // 슬롯에서도 제거
  for (let slot of slots) {
    slot.marbles = slot.marbles.filter(m => m !== marbleToRemove);
    if (slot.marbles.length === 0) {
      slot.filled = false;
      slot.stackHeight = 0;
    }
  }
  
  // 남은 구슬들의 위치 재조정
  for (let slot of slots) {
    if (slot.marbles.length > 0) {
      let newStackHeight = 0;
      for (let marble of slot.marbles) {
        marble.y = floorY - newStackHeight - 10;
        newStackHeight += marble.r * 0.8;
      }
      slot.stackHeight = newStackHeight;
    }
  }
  
  filledSlots--;
}

// 창 크기가 변경될 때 캔버스 크기도 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 대각선 발판 위치 재조정
  slopeStart = createVector(900, 375); // Moved start point further left
  slopeEnd = createVector(1220, 470); // Fixed end point
  floorY = slopeEnd.y + 20;

  // 슬롯 위치 재조정
  for (let i = 0; i < slots.length; i++) {
    let spacing = windowWidth * 0.07;
    slots[i].x = slopeEnd.x - (maxMarbles - 1 - i) * spacing;
    slots[i].y = floorY + 10; // Y축으로 30픽셀 더 아래로 조정 (원래 -20 -> +10)
  }
}
