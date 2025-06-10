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
  let rectWidth = width * 0.9; // 가로 길이를 0.85에서 0.9로 늘림
  let rectHeight = height * 0.85; // 세로 길이를 0.8에서 0.85로 늘림
  let rectX = width * 0.5 - rectWidth * 0.5; // 가운데 정렬
  let rectY = height * 0.5 - rectHeight * 0.5; // 가운데 정렬
  let borderRadius = 40; // 둥근 모서리 반지름

  rect(rectX, rectY, rectWidth, rectHeight, borderRadius);

  // 폰트 적용
  textFont('Gowun Batang'); // '고운 바탕' 폰트 적용

  // 제목 텍스트 (가운데 정렬 유지)
  textSize(45);
  fill(70, 70, 70, 230); // 어두운 회색으로 변경
  text("함수 및 문법", width * 0.5, height * 0.15 + 40); // 제목 위치 살짝 아래로 조정

  // 본문 텍스트 (JavaScript/P5.js bullet points) - 왼쪽 정렬
  push(); // 텍스트 정렬 및 위치 조정을 위해 push/pop 사용
  textAlign(LEFT, TOP); // 왼쪽 상단 정렬
  textSize(22);
  fill(70, 70, 70, 230); // 어두운 회색으로 변경
  let message = "java script\n- 배열, 반복, 조건문 등 (for, if)\n\np5.js\n- preload(), setup(), draw(), mousePressed() 등의 마우스와 키보드 이벤트, dist() 수학함수 등";
  
  // 텍스트를 여러 줄로 나누어 표시
  let lines = message.split('\n');
  let lineHeight = 30; // 줄 간격 조정
  let startY = height * 0.28; // 본문 텍스트 시작 Y 위치 조정
  let textX = rectX + 40; // 사각형 왼쪽 여백 추가

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], textX, startY + (i * lineHeight));
  }
  pop();

  // --- 새로운 "주요 함수" 섹션 추가 시작 ---
  push();
  textAlign(LEFT, TOP); // 왼쪽 상단 정렬
  textSize(25); // "주요 함수" 제목 크기
  fill(70, 70, 70, 230);
  text("주요 함수", textX, height * 0.55); // "주요 함수" 제목 위치

  textSize(18); // 본문 텍스트 크기
  let functionsText = `
let scaleAmount = map(enlargeProgress, 0, enlargeDuration, 1, 8)
— 현재 진행도를 총 지속시간 범위에서 1에서 8 사이의 값으로 변환하여 구슬이 자연스럽게 8배까지 확대되는 효과 구현.실제 물체가 커지는 것처럼 자연스러운 애니메이션을 구현.

dist(mouseX, mouseY, prevMouseX, prevMouseY)
— 현재 마우스 위치와 방금 전 마우스 위치를 통해 얼마나 움직였는지를 계산하여 미세한 떨림에는 반응하지 않고 진짜 문지르는 것처럼 구현.

keyIsDown()
— 방향키가 현재 눌러져있는지 실시간으로 감지하여 true/false를 반환하여 이를 통해 캐릭터의 연속적인 움직임 구현.
  `;
  
  let functionLines = functionsText.trim().split('\n'); // 앞뒤 공백 제거 후 줄바꿈 기준으로 분리
  let functionLineHeight = 25; // 함수 설명 줄 높이
  let functionStartY = height * 0.59; // "주요 함수" 내용 시작 Y 위치

  for (let i = 0; i < functionLines.length; i++) {
    text(functionLines[i], textX, functionStartY + (i * functionLineHeight)); // X 위치 조정
  }
  pop();
  // --- 새로운 "주요 함수" 섹션 추가 끝 ---

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
