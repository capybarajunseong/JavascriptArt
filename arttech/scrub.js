let marblePositions = [];
let backgroundImage;
let pastelColors = ['#808080']; // 회색으로 변경
let imageLoaded = false;
let marblesGenerated = false;
let draggedMarble = null; // 드래그 중인 구슬
let handX = 0; // 손의 x 위치
let handY = 0; // 손의 y 위치
let isRubbing = false; // 문지르기 중인지 여부
let prevMouseX = 0; // 이전 마우스 X 위치
let prevMouseY = 0; // 이전 마우스 Y 위치
let rubbingThreshold = 5; // 문지르기로 인정할 최소 이동 거리
let isDraggingMode = true; // 드래그 모드인지 문지르기 모드인지 구분
let requiredRubbingCount = 5; // 필요한 문지르기 횟수
let rubbingCount = 0; // 현재 문지르기 횟수
let lastRubbingTime = 0; // 마지막 문지르기 시간
let isRestored = false; // 구슬이 복원되었는지 여부
let isCentered = false; // 구슬이 중앙에 위치했는지 여부
let isExpanding = false; // 구슬이 확장 중인지 여부
let expansionSpeed = 10; // 구슬 확장 속도

function preload() {
  backgroundImage = loadImage('../image/inTrash.jpg', 
    () => {
      console.log('이미지 로드 성공');
      imageLoaded = true;
    },
    () => {
      console.log('이미지 로드 실패');
      imageLoaded = true;
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateMarbles(); // 구슬을 한 번만 생성
}

function generateMarbles() {
  let marbleSize = 55; 
  let numMarbles = 1000;
  marblePositions = [];
  let outline = [];
  let step = marbleSize * 0.8;

  // 윤곽선 계산
  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    let nx = map(x, width * 0.1, width * 0.9, 0, 5);
    let y = height - 100 - noise(nx) * 400;
    outline.push({x, y});
  }

  // 구슬 생성
  for (let i = 0; i < numMarbles; i++) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 500) {
      tries++;
      let randomOutlinePoint = random(outline);
      let baseX = randomOutlinePoint.x;
      let outlineY = randomOutlinePoint.y;
      let x = baseX + random(-step/2, step/2);
      let y = random(outlineY, height);
      if (y > height - 100 - marbleSize * 0.5) y = height - 100 - marbleSize * 0.5;

      let overlapping = false;
      for (let pos of marblePositions) {
        if (dist(x, y, pos.x, pos.y) < marbleSize) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        let randomColor = random(pastelColors);
        marblePositions.push({x, y, r: marbleSize, color: color(randomColor), isSpecial: false});
        placed = true;
      }
    }
  }

  // Y 좌표 기준으로 정렬
  marblePositions.sort((a, b) => a.y - b.y);

  // 상위 10% 구슬들 중에서 무작위로 하나를 선택하여 특별한 구슬로 만듦
  let topMarblesCount = Math.floor(marblePositions.length * 0.1);
  let randomIndex = Math.floor(random(topMarblesCount));
  marblePositions[randomIndex].isSpecial = true;
  
  marblesGenerated = true;
}

function draw() {
  if (!imageLoaded) {
    background(210, 195, 160);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text('로딩중...', width/2, height/2);
    return;
  }

  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(210, 195, 160);
  }

  // 구슬 그리기
  for (let pos of marblePositions) {
    if (pos.isSpecial) {
      push();
      translate(pos.x, pos.y);
      
      if (isExpanding) {
        pos.r += expansionSpeed;
        // 화면 전체를 덮을 만큼 커졌는지 확인
        if (pos.r * 2 > dist(0, 0, width, height)) {
          window.location.href = 'algoboni.html'; // 다음 화면으로 전환
        }
      }

      // 반짝이는 효과
      let sparkleSize = pos.r * 0.15;
      let sparkleAngle = frameCount * 0.1;
      for (let j = 0; j < 4; j++) {
        let angle = sparkleAngle + (j * PI/2);
        let x = cos(angle) * pos.r * 0.7;
        let y = sin(angle) * pos.r * 0.7;
        fill(255, 255, 255, 150);
        ellipse(x, y, sparkleSize);
      }

      // 테두리 효과
      stroke(255, 255, 255, 100);
      strokeWeight(3);
      noFill();
      ellipse(0, 0, pos.r * 2.2);
      
      noStroke();
      
      // 그라데이션 효과
      for (let r = pos.r * 2.1; r > 0; r -= 2) {
        let inter = map(r, 0, pos.r * 2.1, 1, 0);
        let c = lerpColor(color('#87CEEB'), color('#808080'), inter);
        fill(c);
        ellipse(0, 0, r);
      }
      
      // 하이라이트
      fill(255, 255, 255, 70);
      ellipse(-pos.r/3, -pos.r/3, pos.r/1.8);
      
      // 그림자
      let shadowColor = color(0, 0, 0, 40);
      fill(shadowColor);
      ellipse(2, 2, pos.r * 2.1);

      // 문지르기 진행 상태 표시
      if (!isDraggingMode && draggedMarble === pos && !isRestored && !isExpanding) {
        // 프로그레스 바 배경
        fill(200, 200, 200, 100);
        rect(-pos.r * 1.2, -pos.r * 1.5, pos.r * 2.4, pos.r * 0.3, 10);

        // 프로그레스 바 진행 상태
        let progressWidth = (rubbingCount / requiredRubbingCount) * (pos.r * 2.4);
        fill(100, 200, 255, 200);
        rect(-pos.r * 1.2, -pos.r * 1.5, progressWidth, pos.r * 0.3, 10);

        // 카운트 텍스트
        fill(0);
        textSize(pos.r * 0.25); // 텍스트 크기 증가
        textAlign(CENTER);
        text(`${rubbingCount}/${requiredRubbingCount}`, 0, -pos.r * 1.3);
      }
      
      pop();
    } else {
      drawMarble(pos.x, pos.y, pos.r, pos.color);
    }
  }

  // 손수건 그리기 (손보다 먼저 그려서 손이 위에 오도록)
  if (isRubbing) {
    drawHandkerchief();
  }

  // 손 그리기
  if (draggedMarble) {
    drawHand();
  }

  // 문지르기 완료 메시지
  if (isRestored && !isExpanding) {
    textAlign(CENTER);
    textSize(20);
    fill(100);
    text("재 닦기 완료", width/2, height - 30);
  }
}

function drawMarble(x, y, r, c) {
  push();
  translate(x, y);
  noStroke();
  fill(c);
  ellipse(0, 0, r * 2);
  fill(255, 255, 255, 50);
  ellipse(-r/3, -r/3, r/2);
  let shadowColor = color(0, 0, 0, 30);
  fill(shadowColor);
  ellipse(2, 2, r * 2);
  pop();
}

function drawHandkerchief() {
  push();
  translate(handX, handY);
  let angle = atan2(mouseY - prevMouseY, mouseX - prevMouseX);
  rotate(angle);

  fill(255, 255, 255, 230);
  stroke(200, 200, 200);
  strokeWeight(2);
  rect(-40, -40, 80, 80, 10);

  pop();
}

function drawHand() {
    push();
    translate(handX, handY);
    
    // 손바닥
    fill(255, 220, 180);
    noStroke();
    ellipse(0, 0, 50, 45);
    
    // 손가락들
    let fingerAngles = [-PI/4, -PI/8, 0, PI/8, PI/4];
    let fingerLengths = [35, 40, 45, 40, 35];
    
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        // 손가락 본체
        fill(255, 220, 180);
        ellipse(0, -fingerLengths[i]/2, 15, fingerLengths[i]);
        // 손가락 끝
        fill(255, 210, 170);
        ellipse(0, -fingerLengths[i], 12, 12);
        pop();
    }
    
    // 손톱
    fill(255, 240, 230);
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        ellipse(0, -fingerLengths[i] + 2, 8, 6);
        pop();
    }
    
    pop();
}

function mousePressed() {
  handX = mouseX;
  handY = mouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  for (let pos of marblePositions) {
    if (pos.isSpecial && dist(mouseX, mouseY, pos.x, pos.y) < pos.r) {
      if (!isCentered) {
        // 첫 번째 클릭: 구슬을 화면 중앙으로 이동 후 문지르기 모드로 전환
        draggedMarble = pos;

        // ⭐ 클릭된 구슬을 배열 맨 뒤로 보내서 가장 위에 그려지도록 함
        marblePositions.splice(marblePositions.indexOf(pos), 1);
        marblePositions.push(pos);

        pos.x = width/2;
        pos.y = height/2;
        isCentered = true;
        isDraggingMode = false;
        rubbingCount = 0;
        lastRubbingTime = millis();
      } else {
        // 이미 중앙에 있는 경우: 문지르기 모드 유지
        draggedMarble = pos;

        // ⭐ 여기도 필요! 다시 클릭해도 맨 앞으로 정렬되도록
        marblePositions.splice(marblePositions.indexOf(pos), 1);
        marblePositions.push(pos);

        isDraggingMode = false;
      }
      break;
    }
  }

  // 문지르기 완료 후 다시 터치했을 때 확장 시작
  if (isRestored && !isExpanding) {
    for (let pos of marblePositions) {
      if (pos.isSpecial && dist(mouseX, mouseY, pos.x, pos.y) < pos.r) {
        isExpanding = true;
        break;
      }
    }
  }
}

function mouseDragged() {
  handX = mouseX;
  handY = mouseY;
  
  if (draggedMarble) {
    if (isDraggingMode && !isCentered) {
      // 드래그 모드: 구슬을 마우스 위치로 이동
      draggedMarble.x = mouseX;
      draggedMarble.y = mouseY;
    } else if (!isDraggingMode && !isRestored) {
      // 문지르기 모드: 손수건 표시 및 문지르기 횟수 증가
      let dx = mouseX - prevMouseX;
      let dy = mouseY - prevMouseY;
      let d = dist(mouseX, mouseY, prevMouseX, prevMouseY);

      if (d > rubbingThreshold) {
        isRubbing = true;
        let currentTime = millis();
        if (currentTime - lastRubbingTime > 400) {
          rubbingCount++;
          lastRubbingTime = currentTime;
          
          if (rubbingCount >= requiredRubbingCount) {
            isRestored = true;
            // 구슬 색상 변경
            for (let pos of marblePositions) {
              if (pos.isSpecial) {
                pos.color = color('#A5D8FF');
              }
            }
          }
        }
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    }
  }
}

function mouseReleased() {
  isRubbing = false;
  if (draggedMarble && !isDraggingMode) {
    draggedMarble = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateMarbles(); // 창 크기가 변경될 때만 구슬 재생성
}