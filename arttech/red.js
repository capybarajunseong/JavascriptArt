let redBgImage; // red.jpg 이미지를 저장할 변수
let currentBgImage; // 현재 배경 이미지를 저장할 변수

function preload() {
  // red.jpg 이미지 로드
  redBgImage = loadImage('../image/red.jpg', () => {
    console.log("red.jpg loaded successfully in preload.");
  }, (event) => {
    console.error("Failed to load red.jpg in preload: ", event);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 캔버스 크기를 창 크기에 맞게 조정

  // 초기 배경 이미지를 redBgImage (red.jpg)로 설정
  if (redBgImage) { // 이미지가 로드되었는지 확인
    currentBgImage = redBgImage;
  } else {
    currentBgImage = null; // 이미지 로드 실패 시 배경 이미지 없음
  }

  // 이미지 상의 "SKIP" 버튼 영역 좌표 및 크기 설정 (사용자 제공 좌표 기반)
  skipButtonX = 516;
  skipButtonY = 135;
  skipButtonWidth = 414;
  skipButtonHeight = 110;

  console.log(`Button area: X=${skipButtonX}, Y=${skipButtonY}, Width=${skipButtonWidth}, Height=${skipButtonHeight}`); // 버튼 영역 로그
}

function draw() {
  // 배경 이미지를 화면 전체에 그립니다.
  if (currentBgImage) {
    image(currentBgImage, 0, 0, width, height);
  } else {
    // 이미지가 로드되지 않았을 경우 대체 배경 (선택 사항)
    background(240); // 연한 회색 배경
  }

  // ... existing code ...
}
