// 전역 변수
let singleMarble; // 하나의 구슬 객체
let draggedMarble = null; // 현재 드래그 중인 구슬
let restoredMarbles = []; // 복원된 구슬들을 저장할 배열 (단일 구슬에서는 복원 개념이 달라질 수 있으나 일단 유지)
let handX = 400; // 손의 x 위치
let handY = 500; // 손의 y 위치
let isRubbing = false; // 문지르기 중인지 여부
let prevMouseX = 0; // 이전 마우스 X 위치
let prevMouseY = 0; // 이전 마우스 Y 위치
let rubbingThreshold = 5; // 문지르기로 인정할 최소 이동 거리
let requiredRubbingCount = 5; // 필요한 문지르기 횟수
let rubbingCount = 0; // 현재 문지르기 횟수
let lastRubbingTime = 0; // 마지막 문지르기 시간
let isRestored = false; // 구슬이 복원되었는지 여부
let isCentered = false; // 구슬이 중앙에 위치했는지 여부
let isExpanding = false; // 구슬이 확장 중인지 여부
let expansionSpeed = 10; // 구슬 확장 속도
let isDraggingMode = true; // 드래그 모드인지 문지르기 모드인지 구분

let backgroundImage; // 배경 이미지

function preload() {
  backgroundImage = loadImage('../image/touchbg.png'); // 배경 이미지 경로
}

class Marble {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.isGray = true;
    this.isRestored = false;
    this.size = size;
    this.targetX = x;
    this.targetY = y;
    this.color = null;
    this.isGrabbed = false;
    this.rubbingCount = 0;
    this.lastRubbingTime = 0;
  }

  display() {
    noStroke();
    push();
    translate(width / 2, height / 2);

    let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size / 2);
    if (this.isGray) {
      gradient.addColorStop(0, 'rgba(180, 180, 180, 1)');
      gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
      gradient.addColorStop(1, 'rgba(120, 120, 120, 1)');
    } else {
      let c = this.color || color(100, 100, 100);
      let r = red(c);
      let g = green(c);
      let b = blue(c);
      gradient.addColorStop(0, `rgba(${min(r + 50, 255)}, ${min(g + 50, 255)}, ${min(b + 50, 255)}, 1)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
      gradient.addColorStop(1, `rgba(${max(r - 30, 0)}, ${max(g - 30, 0)}, ${max(b - 30, 0)}, 1)`);
    }

    drawingContext.fillStyle = gradient;
    circle(0, 0, this.size);

    fill(255, 255, 255, 50);
    ellipse(-this.size / 6, -this.size / 6, this.size / 3);

    if (this.isGrabbed && this.isGray) {
      fill(200, 200, 200, 100);
      rect(-this.size / 2, -this.size / 2 - 20, this.size, 10, 5);

      let progressWidth = (this.rubbingCount / requiredRubbingCount) * this.size;
      fill(100, 200, 255, 200);
      rect(-this.size / 2, -this.size / 2 - 20, progressWidth, 10, 5);

      fill(0);
      textSize(this.size * 0.12);
      textAlign(CENTER);
      text(`${this.rubbingCount}/${requiredRubbingCount}`, 0, -this.size / 2 - 25);
    }
    pop();
  }

  isHandOver() {
    return dist(handX, handY, width / 2, height / 2) < this.size / 2;
  }

  restore() {
    if (this.isGray) {
      let currentTime = millis();
      if (currentTime - this.lastRubbingTime > 400) {
        this.rubbingCount++;
        this.lastRubbingTime = currentTime;

        if (this.rubbingCount >= requiredRubbingCount) {
          this.isGray = false;
          this.color = color('#A5D8FF'); // 복원 색상
          this.isRestored = true;
          return true;
        }
      }
    }
    return false;
  }

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    if (isDraggingMode && this.isGrabbed) {
      this.x = lerp(this.x, mouseX, 0.5);
      this.y = lerp(this.y, mouseY, 0.5);
    } else {
      this.x = width / 2;
      this.y = height / 2;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);

  let marbleSize = min(width, height) * 0.3;
  singleMarble = new Marble(width / 2, height / 2, marbleSize);
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(240);
  }

  handX = mouseX;
  handY = mouseY;

  if (singleMarble) {
    singleMarble.update();
    singleMarble.display();
  }

  if (isRubbing) {
    drawHandkerchief();
  }

  drawHand();

  if (singleMarble && singleMarble.isRestored) {
    textAlign(CENTER);
    textSize(20);
    fill(100);
    text("구슬이 복원되었습니다!", width / 2, height - 30);

    // 3초 후 페이지 전환
    // setTimeout(() => {
    //   window.location.href = 'hug.html';
    // }, 3000);
  }
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
    ellipse(0, 0, 50, 35);
    
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
  if (singleMarble && singleMarble.isHandOver()) {
    singleMarble.isGrabbed = true;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function mouseDragged() {
  if (singleMarble && singleMarble.isGrabbed) {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;
    let d = dist(mouseX, mouseY, prevMouseX, prevMouseY);

    if (d > rubbingThreshold) {
      isRubbing = true;
      singleMarble.restore();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }
  }
}

function mouseReleased() {
  isRubbing = false;
  if (singleMarble) {
    singleMarble.isGrabbed = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}