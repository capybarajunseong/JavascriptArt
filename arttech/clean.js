let backgroundImage1;
let backgroundImage2;
let currentImage;
let imageLoaded1 = false;
let imageLoaded2 = false;
let startTime;

function preload() {
  backgroundImage1 = loadImage('../image/beforeClean.png',
    () => { // 이미지 로드 성공 콜백
      console.log('첫 번째 이미지 로드 성공');
      imageLoaded1 = true;
    },
    () => { // 이미지 로드 실패 콜백
      console.log('첫 번째 이미지 로드 실패');
    }
  );
  
  backgroundImage2 = loadImage('../image/afterClean.png',
    () => { // 이미지 로드 성공 콜백
      console.log('두 번째 이미지 로드 성공');
      imageLoaded2 = true;
    },
    () => { // 이미지 로드 실패 콜백
      console.log('두 번째 이미지 로드 실패');
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startTime = millis();
  currentImage = backgroundImage1;
}

function draw() {
  // 이미지 로딩 중일 때 로딩 메시지 표시
  if (!imageLoaded1 || !imageLoaded2) {
    background(210, 195, 160);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text('이미지 로딩 중...', width/2, height/2);
    return;
  }

  // 0.5초 후에 이미지 전환
  if (millis() - startTime > 1500) {
    currentImage = backgroundImage2;
  }

  // 현재 이미지 그리기
  if (currentImage) {
    image(currentImage, 0, 0, width, height);
  } else {
    background(210, 195, 160);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
