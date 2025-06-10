function setup() {
  console.log('setup() 실행됨');
  createCanvas(windowWidth, windowHeight);
  textFont('Gowun Batang'); // '고운 바탕' 폰트 적용
  textAlign(LEFT, CENTER);
  textSize(35); // 텍스트 크기
}

function draw() {
  console.log('draw() 실행됨');
  // 파스텔톤 빨간색 그라데이션 배경
  setGradient(0, 0, width, height, color('#FFB3B3'), color('#FFD1D1'));

  // 베이지색 모서리가 둥근 네모 그리기
  noStroke();
  fill(255, 255, 242, 240); // 투명도는 240으로 유지
  let rectWidth = width * 0.8; // 가로 길이를 0.85에서 0.8로 줄임
  let rectHeight = height * 0.7; // 세로 길이는 유지
  let rectX = width * 0.5 - rectWidth * 0.5; // 가운데 정렬
  let rectY = height * 0.5 - rectHeight * 0.5; // 가운데 정렬
  let borderRadius = 40; // 둥근 모서리 반지름

  rect(rectX, rectY, rectWidth, rectHeight, borderRadius);

  // 텍스트 표시
  fill(70, 70, 70, 230);
  textSize(45); // 제목 크기 조정
  textAlign(CENTER, CENTER); // 제목 중앙 정렬
  text("\nAI 사용", width * 0.5, height * 0.15 + 40); // 제목 위치 조정
  textAlign(LEFT, CENTER); // 본문 텍스트 정렬
  textSize(35); // 본문 텍스트 크기
  text("\n배경 그림 및 주인공 : 그림을 직접 그린 후 gpt로 수정 및 보완\n코드: cusor ai 사용\n\nai 사용 비율 80%", rectX + 40, rectY + rectHeight / 2); // 텍스트 위치 조정

  // X 버튼 그리기
  drawXButton();
}

// 그라데이션 함수
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

// X 버튼 그리기 함수 (feel3.js에서 가져옴)
function drawXButton() {
  let buttonSize = 40;
  let buttonX = width - buttonSize - 20; // 오른쪽 상단에 배치
  let buttonY = 20;

  noFill();
  stroke(70, 70, 70, 230); // 테두리 색상
  strokeWeight(2);
  ellipse(buttonX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize);

  stroke(70, 70, 70, 230);
  line(buttonX + buttonSize * 0.25, buttonY + buttonSize * 0.25, buttonX + buttonSize * 0.75, buttonY + buttonSize * 0.75);
  line(buttonX + buttonSize * 0.75, buttonY + buttonSize * 0.25, buttonX + buttonSize * 0.25, buttonY + buttonSize * 0.75);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // X 버튼 클릭 감지 (feel3.js에서 가져옴)
  let buttonSize = 40;
  let buttonX = width - buttonSize - 20;
  let buttonY = 20;

  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
      mouseY > buttonY && mouseY < buttonY + buttonSize) {
    window.location.href = 'final.html'; // final.html로 이동
  }
}
