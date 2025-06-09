let backgroundImage;
let smokeOverlayImage;
let bgImageLoaded = false;
let smokeImageLoaded = false;

function preload() {
  backgroundImage = loadImage('../image/smoke.jpg',
    () => { console.log('배경 이미지 로드 성공'); bgImageLoaded = true; },
    () => { console.log('배경 이미지 로드 실패'); }
  );
  smokeOverlayImage = loadImage('../image/smokking.png',
    () => { console.log('연기 오버레이 이미지 로드 성공'); smokeImageLoaded = true; },
    () => { console.log('연기 오버레이 이미지 로드 실패'); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!bgImageLoaded || !smokeImageLoaded) {
    background(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text('이미지 로딩 중...', width / 2, height / 2);
    return;
  }

  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(0);
  }

  if (smokeOverlayImage) {
    image(smokeOverlayImage, 0, 0, width, height); // 배경 위에 연기 이미지 추가
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
