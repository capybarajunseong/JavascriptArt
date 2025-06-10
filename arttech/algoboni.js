let algoboniImage;
let ggadarmImage;
let sadnessImage;
let currentImage;

// 기존 변수
let transitionState = 0; // 0: sadness.png 보임, 1: algoboni.jpg 시작, 2: algoboni 페이드 아웃, 3: ggadarm 페이드 인, 4: ggadarm 보임
let fadeStartTime = 0;
const fadeDuration = 900; // 0.5초에서 0.9초로 페이드 시간 증가
let imageAlpha = 255; // 이미지 투명도 (0-255)

// sadness.png 표시 시간을 위한 새로운 상수
const sadnessDisplayDuration = 1400; // 1초에서 1.4초로 sadness.png 표시 시간 증가

function preload() {
  algoboniImage = loadImage('../image/algoboni.jpg');
  ggadarmImage = loadImage('../image/ggadarm.jpg');
  sadnessImage = loadImage('../image/sadness.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentImage = sadnessImage;
  imageAlpha = 255;
  transitionState = 0;
  fadeStartTime = millis();
}

function draw() {
  if (transitionState === 0) { // sadness.png 보임
    if (millis() - fadeStartTime >= sadnessDisplayDuration) {
      currentImage = algoboniImage;
      imageAlpha = 255;
      transitionState = 1;
      fadeStartTime = millis();
    }
  } else if (transitionState === 1) { // algoboni.jpg 보임 (기존 로직의 1초 대기)
    if (millis() - fadeStartTime >= 1400) { // 1초 대기에서 1.4초 대기로 변경
      transitionState = 2; // algoboni 페이드 아웃 상태로 변경
      fadeStartTime = millis(); // 페이드 시작 시간 기록
    }
  } else if (transitionState === 2) { // algoboni 페이드 아웃 중
    let elapsed = millis() - fadeStartTime;
    imageAlpha = map(elapsed, 0, fadeDuration, 255, 0);
    if (elapsed >= fadeDuration) {
      imageAlpha = 0;
      currentImage = ggadarmImage;
      transitionState = 3;
      fadeStartTime = millis();
    }
  } else if (transitionState === 3) { // ggadarm 페이드 인 중
    let elapsed = millis() - fadeStartTime;
    imageAlpha = map(elapsed, 0, fadeDuration, 0, 255);
    if (elapsed >= fadeDuration) {
      imageAlpha = 255;
      transitionState = 4;
      fadeStartTime = millis();
    }
  } else if (transitionState === 4) { // ggadarm이 보이는 상태
    if (millis() - fadeStartTime >= 1600) {
      window.location.href = 'clean.html';
    }
  }

  if (currentImage) {
    tint(255, imageAlpha);
    image(currentImage, 0, 0, width, height);
    noTint();
  }
}
