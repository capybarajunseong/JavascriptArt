let yellowImage;
let isShrinking = false;
let shrinkProgress = 0;
let shrinkDuration = 30;
let currentScale;
let marbleX, marbleY, marbleRadius;
let imageDisplayTime = 2000; // 이미지 표시 시간 (2초)
let startTime;

let initialScale; // 축소 시작 시점의 스케일 저장용

function preload() {
  yellowImage = loadImage('../image/yellow.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // localStorage에서 구슬 상태 복원
  currentScale = parseFloat(localStorage.getItem('marbleScale')) || 1.3;
  marbleX = parseFloat(localStorage.getItem('marbleX')) || width / 2;
  marbleY = parseFloat(localStorage.getItem('marbleY')) || height / 2;
  marbleRadius = parseFloat(localStorage.getItem('marbleRadius')) || 40;
  startTime = millis();
}

function draw() {
  let currentTime = millis() - startTime;

  // 이미지 표시 시간 동안만 이미지 표시
  if (currentTime < imageDisplayTime) {
    if (yellowImage) {
      image(yellowImage, 0, 0, width, height);
    }
  } else {
    // 이미지 표시 시간이 지나면 구슬 축소 시작
    if (!isShrinking) {
      isShrinking = true;
      shrinkProgress = 0;
      initialScale = currentScale; // 축소 시작할 때의 스케일 저장!!
    }
  }

  // 구슬 축소 애니메이션
  if (isShrinking) {
    let t = constrain(shrinkProgress / shrinkDuration, 0, 1);
    currentScale = easeOutQuad(t) * (initialScale - 1) + 1; // 부드럽게 1로 줄어듦
    shrinkProgress++;

    // 구슬 그리기
    push();
    translate(marbleX, marbleY);
    scale(currentScale);

    // 구슬 그림자
    noStroke();
    fill(0, 0, 0, 30);
    ellipse(2, 2, marbleRadius * 2, marbleRadius * 2);

    // 구슬 본체 (파스텔 노랑)
    fill('#FFF5A5');
    ellipse(0, 0, marbleRadius * 2, marbleRadius * 2);

    // 구슬 하이라이트
    fill(255, 255, 255, 100);
    ellipse(-marbleRadius / 2, -marbleRadius / 2, marbleRadius, marbleRadius);
    pop();

    if (shrinkProgress > shrinkDuration) {
      isShrinking = false;
      window.location.href = 'second.html';
    }
  }
}

function easeOutQuad(t) {
  return t * (2 - t); // 부드러운 감속
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 창 크기가 변경될 때 구슬 위치 업데이트
  if (!localStorage.getItem('marbleX')) {
    marbleX = width / 2;
    marbleY = height / 2;
  }
}