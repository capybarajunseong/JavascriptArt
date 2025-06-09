let algoboniImage;
let ggadarmImage;
let currentImage;

// 추가된 변수
let transitionState = 0; // 0: algoboni 보임, 1: algoboni 페이드 아웃, 2: ggadarm 페이드 인, 3: ggadarm 보임
let fadeStartTime = 0;
const fadeDuration = 500; // 0.5초 동안 페이드
let imageAlpha = 255; // 이미지 투명도 (0-255)

function preload() {
  algoboniImage = loadImage('../image/algoboni.jpg');
  ggadarmImage = loadImage('../image/ggadarm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentImage = algoboniImage;
  imageAlpha = 255;
  transitionState = 0;

  // 1초 후 algoboni.jpg 페이드 아웃 시작
  setTimeout(() => {
    transitionState = 1; // 페이드 아웃 상태로 변경
    fadeStartTime = millis(); // 페이드 시작 시간 기록
  }, 1000); // 1000 milliseconds = 1 second
}

function draw() {
  // 상태에 따른 알파 값 업데이트
  if (transitionState === 1) { // algoboni 페이드 아웃 중
    let elapsed = millis() - fadeStartTime;
    imageAlpha = map(elapsed, 0, fadeDuration, 255, 0);
    if (elapsed >= fadeDuration) {
      imageAlpha = 0;
      currentImage = ggadarmImage;
      transitionState = 2; // ggadarm 페이드 인 상태로 변경
      fadeStartTime = millis(); // 페이드 시작 시간 재기록
    }
  } else if (transitionState === 2) { // ggadarm 페이드 인 중
    let elapsed = millis() - fadeStartTime;
    imageAlpha = map(elapsed, 0, fadeDuration, 0, 255);
    if (elapsed >= fadeDuration) {
      imageAlpha = 255;
      transitionState = 3; // ggadarm 보임 상태로 변경 (전환 완료)
      fadeStartTime = millis(); // ggadarm이 보이기 시작한 시간 기록
    }
  } else if (transitionState === 3) { // ggadarm이 보이는 상태
    // ggadarm이 보이기 시작한 후 1초가 지나면 clean.js로 이동
    if (millis() - fadeStartTime >= 1000) {
      window.location.href = 'clean.html';
    }
  }

  if (currentImage) {
    tint(255, imageAlpha); // 알파 값 적용하여 그리기
    image(currentImage, 0, 0, width, height);
    noTint(); // 다음 그리기 시에는 틴트 해제
  }
}
