let backgroundImage; // 배경 이미지를 저장할 변수

function preload() {
  // 배경 이미지 파일 로드 (파일 이름이 다르면 수정해주세요!)
  backgroundImage = loadImage('../image/fire.jpg', () => {
    console.log("Background image loaded successfully.");
  }, (event) => {
    console.error("Failed to load background image: ", event);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 캔버스 크기를 창 크기에 맞게 조정
  // 여기에 필요한 초기 설정을 추가합니다.

  // 3초 후에 smoke.html로 이동
  setTimeout(() => {
    window.location.href = 'smoke.html';
  }, 1000); // 3000 밀리초 = 3초
}

function draw() {
  // 배경 이미지를 화면 전체에 그립니다.
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    // 이미지가 로드되지 않았을 경우 대체 배경 (선택 사항)
    background(100); // 어두운 회색 배경
  }

  // 여기에 불꽃 또는 기타 그림 코드를 추가합니다.
}

// 창 크기가 변경될 때 캔버스 크기도 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
