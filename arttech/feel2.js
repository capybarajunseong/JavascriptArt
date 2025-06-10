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
  fill(255, 246, 237, 240); // 투명도는 240으로 유지
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
  text("김준성", width * 0.5, height * 0.30);
  
  // 본문 텍스트
  textSize(22);
  fill(70, 70, 70, 230);
  let message = "\n\n\n\n저는 인생에서 코딩이라는 것을 해본 적이 없었는데,\n 글로벌미디어학부 전공 수업을 통해 처음으로 심도 있게 배울 수 있는 기회를 가지게 되었습니다.\n이번 팀 과제를 통해 저희 팀이 처음부터 끝까지 직접 기획하고 구현한 코드와 애니메이션을 만들어보면서,\n코드로 정말 많은 것들을 표현하고 구현할 수 있다는것을 확실히 깨닫게되었습니다.\n처음에는 막막하고 어려웠지만, 함께 고민하고 문제를 해결해 나가면서 협업의 즐거움도 느끼고,\n완성된 결과물을 보았을 때의 뿌듯한 기분도 느꼈습니다.\n이번 팀과제 를 통해 코딩에 대한 두려움을 조금이나마 극복할 수 있었고,\n앞으로 코딩으로 다양한 창작물을 만들어보고싶다는 생각을 가지게되었습니다.";
  
  // 텍스트를 여러 줄로 나누어 표시
  let lines = message.split('\n');
  let lineHeight = 32;
  let startY = height * 0.25;
  
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width * 0.5, startY + (i * lineHeight));
  }

  // 화살표 버튼 그리기
  let arrowSize = 50; // 화살표 크기
  let arrowColor = color(100, 100, 100, 200); // 어두운 회색, 약간 투명하게

  noStroke();
  fill(arrowColor);

  // 왼쪽 화살표 (제거)
  // let leftArrowX = width * 0.05;
  // let leftArrowY = height * 0.5;
  // triangle(leftArrowX + arrowSize/2, leftArrowY - arrowSize/2,
  //          leftArrowX - arrowSize/2, leftArrowY,
  //          leftArrowX + arrowSize/2, leftArrowY + arrowSize/2);

  // 오른쪽 화살표
  let rightArrowX = width * 0.95;
  let rightArrowY = height * 0.5;
  triangle(rightArrowX - arrowSize/2, rightArrowY - arrowSize/2,
           rightArrowX + arrowSize/2, rightArrowY,
           rightArrowX - arrowSize/2, rightArrowY + arrowSize/2);


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

  // 기존 화살표 버튼 클릭 감지 로직 (만약 있다면)
  let arrowSize = 50; // 화살표 크기는 draw 함수와 동일하게 설정
  let rightArrowX = width * 0.95;
  let rightArrowY = height * 0.5;
  let arrowRectX = rightArrowX - arrowSize / 2;
  let arrowRectY = rightArrowY - arrowSize / 2;
  let arrowRectWidth = arrowSize;
  let arrowRectHeight = arrowSize;

  if (mouseX > arrowRectX && mouseX < arrowRectX + arrowRectWidth &&
      mouseY > arrowRectY && mouseY < arrowRectY + arrowRectHeight) {
    window.location.href = 'feel3.html'; // feel3.html로 이동
  }
}
