let faceX, faceY;
let hairColor;
let eyeColor;
let skinColor;

let marbles = [];
let isRolling = false;
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let startButton;
let spawnInterval = 1000; // 구슬 생성 간격
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
let isEnlarging = false; // Initial enlargement to center
let enlargeProgress = 0;
let enlargeDuration = 60; // 프레임 단위로 애니메이션 지속 시간

let isFinalEnlarging = false; // Final enlargement to fill screen
let finalEnlargeProgress = 0;
let finalEnlargeDuration = 90; // 프레임 단위로 최종 확대 지속 시간

let isTransitioningToHappy = false; // happy.html로 전환 중인지 확인
let transitionProgress = 0;
let transitionDuration = 60; // 프레임 단위로 그라데이션 전환 지속 시간

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
    let y = floorY - 20;
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
      // 이미지가 로드되지 않았을 경우 대체 배경 (이전 그라데이션 또는 단색)
      background(245);
    }

    // 대각선 발판 그리기
    drawSlope();

    // 구슬 그리기 (최종 확대 중이 아닐 때만)
    if (!isFinalEnlarging) {
      for (let marble of marbles) {
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
              marble.y = floorY - slot.stackHeight - 10;
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
                  isEnlarging = true; // Start initial enlargement
                  enlargeProgress = 0;
                }
              }
            }
          }
        }

        // 구슬 그리기
        drawMarble(marble);
      }
    }

    // 구슬 계속 굴리기 (최종 확대 중이 아닐 때만)
    if (isRolling && !isFinalEnlarging) {
      if (millis() - lastSpawnTime > spawnInterval && marbleCount < maxMarbles) {
        spawnMarble();
        lastSpawnTime = millis();
      }
    }
  }

  // 확대된 구슬 그리기 (화면 전환 중이거나 최종 확대 중일 때)
  if (isGlowing && glowingMarble && (isEnlarging || isFinalEnlarging)) {
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
  push();
  
  let targetX = width/2;
  let targetY = height/2;
  let scaleAmount = 1; // Default scale

  let currentMarbleX = glowingMarble.x;
  let currentMarbleY = glowingMarble.y;

  if (isEnlarging) {
    // 중앙으로 이동하는 초기 애니메이션
    currentMarbleX = map(enlargeProgress, 0, enlargeDuration, glowingMarble.x, targetX);
    currentMarbleY = map(enlargeProgress, 0, enlargeDuration, glowingMarble.y, targetY);
    scaleAmount = map(enlargeProgress, 0, enlargeDuration, 1, 8);
    
    // 애니메이션 진행
    if (enlargeProgress < enlargeDuration) {
      enlargeProgress++;
    } else if (!isFinalEnlarging && !isTransitioningToHappy) {
        // Initial enlargement is complete, and not yet in final phases
        // Stay at the center and scaled up, waiting for click
        currentMarbleX = targetX;
        currentMarbleY = targetY;
        scaleAmount = 8; // Stay at 8x scale
    }
    
  } else if (isFinalEnlarging) {
    // 화면 전체를 채우는 최종 애니메이션
    currentMarbleX = targetX; // Already at the center from initial phase
    currentMarbleY = targetY;

    // 화면을 채울 정도의 큰 스케일 계산
    let maxScale = max(width / (glowingMarble.r * 2), height / (glowingMarble.r * 2));
    scaleAmount = map(finalEnlargeProgress, 0, finalEnlargeDuration, 8, maxScale);

    // 최종 확대 애니메이션 진행
    if (finalEnlargeProgress < finalEnlargeDuration) {
      finalEnlargeProgress++;
    } else {
      // 최종 확대 애니메이션 완료 후 전환 시작
      isFinalEnlarging = false; // Stop final enlargement
      isTransitioningToHappy = true; // Start transition
      transitionProgress = 0; // Reset transition progress
      // Do NOT navigate here yet, drawTransitionOverlay will handle it
    }
  }
  
  // Apply translation and scaling based on calculated values
  translate(currentMarbleX, currentMarbleY);
  scale(scaleAmount);

  // === Draw elements relative to the marble's scaled position (origin at 0,0) ===

  // 빛나는 효과 그리기
  // Draw glow relative to the enlarged marble (scaleAmount is applied)
  // 빛나는 효과는 초기 확대가 완료되고 최종 확대/전환 중이 아닐 때만 그립니다.
  if (enlargeProgress >= enlargeDuration && !isFinalEnlarging && !isTransitioningToHappy) {
    push();
    // translate(0, 0); // Already translated to marble center
    
    // 구슬 색상 기반으로 빛나는 색상 설정
    let glowColor = color(glowingMarble.color);
    
    // 여러 개의 원을 겹쳐 그려 빛나는 효과 생성
    for (let i = 0; i < 5; i++) { 
      // Glow size is relative to the current scaled marble size
      // We draw at the origin (marble center), scale is already applied.
      let baseGlowSize = glowingMarble.r * 2; // Base diameter of the marble
      let glowRingSize = baseGlowSize + (i * 10 / scaleAmount); // Add scaled down increment
      glowColor.setAlpha(map(i, 0, 4, 40, 0)); // Keep opacity logic
      fill(glowColor);
      ellipse(0, 0, glowRingSize, glowRingSize);
    }
    pop();
  }

  // 구슬 그림자
  // Shadow position and size should be scaled correctly. Offset is relative to marble center.
  noStroke();
  fill(0, 0, 0, 30);
  // Position offset (2,2) needs to be scaled down relative to the current scaleAmount
  // Size is the marble's diameter (2*r). This also gets scaled by scaleAmount.
  ellipse(2/scaleAmount, 2/scaleAmount, glowingMarble.r * 2, glowingMarble.r * 2);

  // 구슬 본체
  fill(glowingMarble.color);
  ellipse(0, 0, glowingMarble.r * 2, glowingMarble.r * 2); // Use diameter for clarity
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  // Position offset (-r/4, -r/4) needs to be scaled down. Size (r/3) gets scaled up.
  ellipse(-glowingMarble.r/4 / scaleAmount, -glowingMarble.r/4 / scaleAmount, glowingMarble.r/3 * 2, glowingMarble.r/3 * 2); // Use diameter for clarity
  
  // 텍스트 표시 (only when initial enlargement is complete and not final enlarging or transitioning)
  if (enlargeProgress >= enlargeDuration && !isFinalEnlarging && !isTransitioningToHappy) {
    textAlign(CENTER, CENTER);
    textSize(24 / scaleAmount); // Text size scaled down
    fill(0);
    // Text position (100px below center) scaled down
    text("터치해서 구슬에 담긴 추억을 확인해보세요!", 0, 100 / scaleAmount);
  }

  pop(); // Restore original drawing settings
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
  // Detect click only when initial enlargement is complete and waiting for final enlargement, and not transitioning
  if (isGlowing && glowingMarble && isAllMarblesStopped && enlargeProgress >= enlargeDuration && !isFinalEnlarging && !isTransitioningToHappy) {
    // Mouse position is in screen coordinates. 
    // Marble is at width/2, height/2 with a scale of 8.
    let marbleCenterX = width/2;
    let marbleCenterY = height/2;
    // The clickable radius is the marble's original radius (glowingMarble.r) scaled by 8.
    let clickableRadius = glowingMarble.r * 8;
    
    let d = dist(mouseX, mouseY, marbleCenterX, marbleCenterY);
    
    // Check if the mouse click is within the scaled marble's area
    if (d < clickableRadius / 2) { // Use radius (half of diameter)
      // Start final enlargement
      isEnlarging = false; // Stop initial enlargement state
      isFinalEnlarging = true;
      finalEnlargeProgress = 0; // Start final enlargement progress
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
  let speed = 5;

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
    slots[i].y = floorY - 20;
  }
}
