let backgroundImage;
let gowunBatang;

function preload() {
  // Google Fonts에서 로드된 폰트를 사용하기 위해 폰트 객체를 생성합니다.
  // P5.js의 loadFont()는 .ttf 또는 .otf 파일을 로드할 때 사용하며,
  // 웹 폰트의 경우 HTML에서 링크하고, P5.js에서는 font-family 이름을 사용합니다.
  // 여기서는 시스템 폰트처럼 'Gowun Batang'을 직접 사용합니다.
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  // 파스텔 노란색 그라데이션 배경
  setGradientBackground();
  
  // 베이지색 모서리가 둥근 네모 그리기
  noStroke();
  fill(250, 235, 215, 240); // 투명도는 240으로 유지
  let rectWidth = width * 0.8; 
  let rectHeight = height * 0.7; 
  let rectX = width * 0.5 - rectWidth * 0.5; // 가운데 정렬
  let rectY = height * 0.5 - rectHeight * 0.5; // 가운데 정렬
  let borderRadius = 40; // 둥근 모서리 반지름

  rect(rectX, rectY, rectWidth, rectHeight, borderRadius);

  // 폰트 적용
  textFont('Gowun Batang'); // '고운 바탕' 폰트 적용

  // 제목 텍스트
  textSize(45);
  fill(70, 70, 70, 230); // 어두운 회색으로 변경
  text("함수 및 문법", width * 0.5, height * 0.25); // 제목 및 위치 조정

  // 본문 텍스트
  textSize(22);
  fill(70, 70, 70, 230); // 어두운 회색으로 변경
  let message = "가장 어려웠던 것은 P5.js의 함수를 이해하고 적용하는 것이었습니다.\n특히, draw() 함수 내에서 여러 요소들의 렌더링 순서를 제어하는 것이 복잡했고,\n각 요소 간의 상호작용을 구현하는 데 많은 시행착오를 겪었습니다.\n\n또한, 변수 선언과 스코프, 조건문, 반복문 등 기본적인 문법을 활용하여\n구슬의 움직임, 색상 변화, 상호작용 등을 세밀하게 제어하는 것도 쉽지 않았습니다.\n오류가 발생했을 때 디버깅하는 과정도 매우 중요하고 어려웠습니다.\n\n하지만 이러한 어려움을 극복하는 과정에서\n코딩 실력이 크게 향상될 수 있었다고 생각합니다.\nP5.js는 시각적인 피드백이 즉각적이어서 학습에 매우 효과적이었습니다.\n앞으로도 꾸준히 학습하여 더 복잡하고 창의적인 작품을 만들고 싶습니다.";
  
  // 텍스트를 여러 줄로 나누어 표시
  let lines = message.split('\n');
  let lineHeight = 32;
  let startY = height * 0.25; // 제목 위치와 겹치지 않도록 조정
  
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width * 0.5, startY + (i * lineHeight));
  }

  // X 버튼 그리기
  drawXButton();
}

function setGradientBackground() {
  // 파스텔 노란색 그라데이션 색상
  let c1 = color(255, 255, 224); // 더 아주 연한 노란색 (레몬 쉬폰)
  let c2 = color(255, 255, 204); // 더 연한 노란색 (크림)
  
  // 수직 그라데이션
  for(let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

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

function mousePressed() {
  // X 버튼 클릭 감지
  let buttonSize = 40;
  let buttonX = width - buttonSize - 20;
  let buttonY = 20;

  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
      mouseY > buttonY && mouseY < buttonY + buttonSize) {
    window.location.href = 'final.html'; // final.html로 이동
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
