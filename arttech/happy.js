let yellowImage;
let imageDisplayTime = 2000; // 이미지 표시 시간 (2초)
let startTime;
// let closeButtonImage; // 닫기 버튼 이미지 변수 제거

function preload() {
  yellowImage = loadImage('../image/yellow.jpg'); // Load the yellow.jpg image
  // closeButtonImage = loadImage('../image/close_button.png'); // 닫기 버튼 이미지 로드 코드 제거
  startTime = millis();
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
}

function draw() {
  let currentTime = millis() - startTime;
  
  // 이미지 표시 시간 동안만 이미지 표시
  if (currentTime < imageDisplayTime) {
    if (yellowImage) {
      image(yellowImage, 0, 0, width, height); // Display the background image
    }
  } else {
    // 이미지 표시 시간이 지나면 바로 다음 페이지로 이동
    window.location.href = 'hppull.html';
  }

  // 닫기 버튼 그리기 (빨간색 원에 흰색 X)
  let buttonSize = 50; // 버튼 크기
  let margin = 20; // 여백
  // 버튼 위치 계산: 오른쪽에서 여백만큼, 추가로 왼쪽으로 50픽셀 이동
  let buttonX = width - buttonSize / 2 - margin - 50;
  let buttonY = margin + buttonSize / 2;

  // 빨간색 원 (파스텔톤 빨강으로 변경)
  noStroke();
  fill('#FFB3B3'); // 파스텔 빨강
  ellipse(buttonX, buttonY, buttonSize, buttonSize);

  // 흰색 X
  stroke(255); // 흰색
  strokeWeight(5); // 선 굵기
  let xOffset = buttonSize * 0.2; // X의 팔 길이 조정
  line(buttonX - xOffset, buttonY - xOffset, buttonX + xOffset, buttonY + xOffset);
  line(buttonX + xOffset, buttonY - xOffset, buttonX - xOffset, buttonY + xOffset);
}

// 마우스 클릭 이벤트 처리
function mousePressed() {
  let buttonSize = 50; // 버튼 크기 (draw 함수와 동일하게 설정)
  let margin = 20; // 여백 (draw 함수와 동일하게 설정)
  // 버튼 위치 계산: 오른쪽에서 여백만큼, 추가로 왼쪽으로 50픽셀 이동
  let buttonX = width - buttonSize / 2 - margin - 50; // 버튼 원의 중심 X
  let buttonY = margin + buttonSize / 2; // 버튼 원의 중심 Y

  // 마우스 클릭 위치가 버튼 원 영역 안에 있는지 확인 (원 중심으로부터 거리 계산)
  let d = dist(mouseX, mouseY, buttonX, buttonY);
  if (d < buttonSize / 2) {
    // 버튼 클릭 시 second.html로 이동
    window.location.href = 'hppull.html';
  }
}

// 창 크기가 변경될 때 캔버스 크기도 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
