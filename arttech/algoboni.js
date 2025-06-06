let img1;
let img2;
let startTime;
let displayDuration = 3000; // 3 seconds in milliseconds
let isFirstImage = true;

function preload() {
  // 이미지를 로드합니다. 사용자의 다운로드 폴더 경로를 기준으로 합니다.
  img1 = loadImage('../../Downloads/KakaoTalk_Photo_2025-06-06-15-37-14 001.jpeg',
    () => console.log('첫 번째 이미지 로드 성공'),
    () => console.log('첫 번째 이미지 로드 실패')
  );
  img2 = loadImage('../../Downloads/KakaoTalk_Photo_2025-06-06-15-37-14 002.jpeg',
    () => console.log('두 번째 이미지 로드 성공'),
    () => console.log('두 번째 이미지 로드 실패')
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 전체 화면 캔버스 설정
  startTime = millis(); // 시작 시간 기록
  imageMode(CORNER); // 이미지를 좌상단 기준으로 그립니다.
}

function draw() {
  background(0); // 배경을 검정으로 지웁니다.

  let currentTime = millis();
  let elapsedTime = currentTime - startTime;

  if (isFirstImage) {
    if (img1) {
      image(img1, 0, 0, width, height); // 첫 번째 이미지 표시 (전체 화면)
    }
    if (elapsedTime >= displayDuration) {
      isFirstImage = false;
      startTime = currentTime; // 다음 이미지 표시를 위한 시간 재설정
    }
  } else {
    if (img2) {
      image(img2, 0, 0, width, height); // 두 번째 이미지 표시 (전체 화면)
    }
    if (elapsedTime >= displayDuration) {
      isFirstImage = true;
      startTime = currentTime; // 첫 번째 이미지 표시를 위한 시간 재설정
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 윈도우 크기 변경 시 캔버스 크기 조절
}
