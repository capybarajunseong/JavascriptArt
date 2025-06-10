function setup() {
  console.log('setup() 실행됨');
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, CENTER);
  textSize(24); // 텍스트 크기
}

function draw() {
  console.log('draw() 실행됨');
  // 파스텔톤 빨간색 그라데이션 배경
  setGradient(0, 0, width, height, color('#FFB3B3'), color('#FFD1D1'));

  // 텍스트 표시
  fill(0); // 텍스트 색상 검은색
  text("배경 그림 및 주인공 : 그림을 직접 그린 후 gpt로 수정 및 보완\n코드: cusor 안의 ai 사용\n\nai 사용 비율 90%", width * 0.1, height / 2);

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
