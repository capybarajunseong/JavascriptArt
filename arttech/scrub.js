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
let requiredRubbingCount = 5; // 필요한 문지르기 횟수
let rubbingCount = 0; // 현재 문지르기 횟수
let lastRubbingTime = 0; // 마지막 문지르기 시간
let isRestored = false; // 구슬이 복원되었는지 여부
let isCentered = false; // 구슬이 중앙에 위치했는지 여부 (다시 추가)

// 추가된 변수
let sadnessImg;
let naalimImg;
let showTransitionImages = false; // 전환 이미지를 표시할지 여부
let transitionImageIndex = 0; // 0: 없음, 1: sadness.png, 2: naalim.jpg
let transitionStartTime = 0; // 이미지 표시 시작 시간
const sadnessImageDuration = 1900; // sadness.png 표시 시간 (1.6초 -> 1.9초)
const naalimImageDuration = 1900; // naalim.jpg 표시 시간 (1.6초 -> 1.9초)
let isTransitionTriggered = false; // 전환 시퀀스 트리거 여부

const messageDisplayDuration = 1900; // '재 닦기 완료' 메시지 표시 시간 (1.6초 -> 1.9초)
let showInitialMonologue = true; // 초기 독백 표시 여부

function preload() {
  backgroundImage = loadImage('../image/inFire.jpg', 
    () => {
      console.log('이미지 로드 성공');
      imageLoaded = true;
    },
    () => {
      console.log('이미지 로드 실패');
      imageLoaded = true;
    }
  );
  // 추가된 이미지 로드
  sadnessImg = loadImage('../image/sadness.png',
    () => { console.log('sadness.png 로드 성공'); },
    () => { console.log('sadness.png 로드 실패'); }
  );
  naalimImg = loadImage('../image/naalim.jpg',
    () => { console.log('naalim.jpg 로드 성공'); },
    () => { console.log('naalim.jpg 로드 실패'); }
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

  // 전환 이미지 표시 로직
  if (showTransitionImages) {
    let currentTime = millis();
    if (transitionImageIndex === 1) { // sadness.png 표시 중
      if (sadnessImg) image(sadnessImg, 0, 0, width, height);
      if (currentTime - transitionStartTime >= sadnessImageDuration) {
        transitionImageIndex = 2; // naalim.jpg로 전환
        transitionStartTime = currentTime; // 시간 재설정
      }
    } else if (transitionImageIndex === 2) { // naalim.jpg 표시 중
      if (naalimImg) image(naalimImg, 0, 0, width, height);
      if (currentTime - transitionStartTime >= naalimImageDuration) {
        showTransitionImages = false; // 전환 종료
        transitionImageIndex = 0; // 인덱스 초기화
        // 여기에 다시 scrub.js 화면으로 돌아가는 로직 (예: 상태 초기화) 추가 가능
        // 현재는 단순히 오버레이만 사라지고 아래 구슬들이 다시 그려짐
      }
    }
    return; // 전환 이미지 표시 중에는 아래의 다른 그리기 로직을 건너뜀
  }

  // 구슬 닦기 횟수 2에 도달 시 전환 이미지 표시 트리거
  if (rubbingCount >= 2 && !isTransitionTriggered) {
    showTransitionImages = true;
    transitionImageIndex = 1; // sadness.png부터 시작
    transitionStartTime = millis();
    isTransitionTriggered = true; // 트리거 방지
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
      // 특수 구슬은 항상 중앙에 그려지도록 합니다.
      // 만약 isCentered 상태가 아니라면, 클릭 시 중앙으로 이동하도록 mousePressed에서 처리됩니다.
      translate(pos.x, pos.y);
      
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
      for (let r_draw = pos.r * 2.1; r_draw > 0; r_draw -= 2) { // 변수명 변경: r -> r_draw
        let inter = map(r_draw, 0, pos.r * 2.1, 1, 0);
        let c = lerpColor(color('#87CEEB'), color('#808080'), inter);
        fill(c);
        ellipse(0, 0, r_draw);
      }
      
      // 하이라이트
      fill(255, 255, 255, 70);
      ellipse(-pos.r/3, -pos.r/3, pos.r/1.8);
      
      // 그림자
      let shadowColor = color(0, 0, 0, 40);
      fill(shadowColor);
      ellipse(2, 2, pos.r * 2.1);

      // 문지르기 진행 상태 표시 (draggedMarble이 설정되면 표시)
      if (draggedMarble === pos && !isRestored) { 
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
  if (isRestored) {
    textAlign(CENTER);
    textSize(20);
    fill(100);
    text("재 닦기 완료", width/2, height - 30);
  }

  // 초기 독백 표시
  if (showInitialMonologue) {
    textAlign(CENTER);
    textSize(25); // 폰트 크기 조정
    fill(0); // 검은색 텍스트
    text("어? 재가 많이 쌓였네. 저 빛나는 구슬은 뭐지?", width/2, height * 0.15); // 중앙 상단
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
  if (showTransitionImages) return; // 전환 이미지 표시 중에는 이벤트 무시
  handX = mouseX;
  handY = mouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  for (let pos of marblePositions) {
    if (pos.isSpecial && dist(mouseX, mouseY, pos.x, pos.y) < pos.r) {
      if (!isCentered) { // 첫 번째 클릭: 구슬을 화면 중앙으로 이동 후 문지르기 모드로 전환
        draggedMarble = pos;

        // ⭐ 클릭된 구슬을 배열 맨 뒤로 보내서 가장 위에 그려지도록 함
        marblePositions.splice(marblePositions.indexOf(pos), 1);
        marblePositions.push(pos);

        // 구슬의 실제 위치를 중앙으로 설정
        pos.x = width/2;
        pos.y = height/2;

        isCentered = true; // isCentered 다시 설정
        rubbingCount = 0;
        lastRubbingTime = millis();
        showInitialMonologue = false; // 구슬 클릭 시 초기 독백 숨김
      } else { // 이미 중앙에 있는 경우: 문지르기 모드 유지 (재클릭 시 구슬 위치는 고정)
        draggedMarble = pos; // 드래그 대상 구슬로 설정 (손 모양을 위해)
        // isCentered가 true이므로, 구슬은 이미 중앙에 있습니다.
        // 구슬의 위치를 업데이트할 필요는 없습니다.
      }
      break; // 구슬을 찾으면 루프 종료
    }
  }
}

function mouseDragged() {
  if (showTransitionImages) return; // 전환 이미지 표시 중에는 이벤트 무시
  handX = mouseX;
  handY = mouseY;

  if (draggedMarble && draggedMarble.isSpecial) { // 특수 구슬이 드래그 중이고
    if (isCentered && !isRestored) { // 구슬이 중앙에 있고 아직 복원되지 않았다면 문지르기 모드
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
            for (let p of marblePositions) { // Use 'p' to avoid conflict with 'pos' in draw
              if (p.isSpecial) {
                p.color = color('#A5D8FF');
              }
            }
            // '재 닦기 완료' 메시지 표시 후 algoboni.html로 전환
            setTimeout(() => {
                window.location.href = 'algoboni.html';
            }, messageDisplayDuration);
          }
        }
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    }
    // 다른 경우 (예: 자유로운 드래그 모드)는 특수 구슬에는 적용되지 않음
  }
}

function mouseReleased() {
  isRubbing = false;
  draggedMarble = null; // 마우스 떼면 draggedMarble 초기화
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateMarbles(); // 창 크기가 변경될 때만 구슬 재생성
}