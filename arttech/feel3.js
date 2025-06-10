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
  // 하늘색 파스텔 그라데이션 배경
  setGradientBackground();
  
  // 베이지색 모서리가 둥근 네모 그리기
  noStroke();
  fill(255, 255, 242, 240); // 투명도는 240으로 유지
  let rectWidth = width * 0.8; // 가로 길이를 0.85에서 0.8로 줄임
  let rectHeight = height * 0.7; // 세로 길이는 유지
  let rectX = width * 0.5 - rectWidth * 0.5; // 가운데 정렬
  let rectY = height * 0.5 - rectHeight * 0.5; // 가운데 정렬
  let borderRadius = 40; // 둥근 모서리 반지름

  rect(rectX, rectY, rectWidth, rectHeight, borderRadius);
  
  // 폰트 적용
  textFont('Gowun Batang'); // '고운 바탕' 폰트 적용

  // 제목 텍스트
  textSize(45);
  fill(70, 70, 70, 230);
  text("윤채원", width * 0.5, height * 0.3);
  
  // 본문 텍스트
  textSize(22);
  fill(70, 70, 70, 230);
  let message = "\n\n\n\n입학하고서 처음으로 해본 팀플이었는데요!\n저는 팀 프로젝트보다는 혼자 하는 것이 훨씬 효율도 좋고 수고도 덜하다는 편견을 \n가지고 있었습니다. \n하지만 동료들과 함께 하니까 오히려 제 능력이 닿지 않는 부분을 채워주었고\n지칠때는 힘 낼 수 있게 해주는 존재들이었습니다. \n이 활동을 통해서 팀플에 대한 편견이 사라졌고 시너지라는 말을 이젠 믿을 \n수 있게 되었습니다!";
  
  // 텍스트를 여러 줄로 나누어 표시
  let lines = message.split('\n');
  let lineHeight = 32;
  let startY = height * 0.25;
  
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width * 0.5, startY + (i * lineHeight));
  }

  // X 버튼 그리기
  drawXButton();
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

function setGradientBackground() {
  // 하늘색 파스텔 그라데이션 색상
  let c1 = color(173, 216, 230); // 밝은 하늘색
  let c2 = color(135, 206, 235); // 하늘색
  
  // 수직 그라데이션
  for(let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  // 기존 화살표 버튼 클릭 감지 로직 (만약 있다면 아래에 추가)
  // let arrowSize = 50;
  // let rightArrowX = width * 0.95;
  // let rightArrowY = height * 0.5;
  // let arrowRectX = rightArrowX - arrowSize / 2;
  // let arrowRectY = rightArrowY - arrowSize / 2;
  // let arrowRectWidth = arrowSize;
  // let arrowRectHeight = arrowSize;

  // if (mouseX > arrowRectX && mouseX < arrowRectX + arrowRectWidth &&
  //     mouseY > arrowRectY && mouseY < arrowRectY + arrowRectHeight) {
  //   window.location.href = 'feel4.html'; // 예시
  // }
}
