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
  fill(255, 237, 237, 240); // 투명도는 240으로 유지
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
  text("권경은", width * 0.5, height * 0.30);
  
  // 본문 텍스트
  textSize(22);
  fill(70, 70, 70, 230);
  let message = "\n\n\n\n감정 구슬이 쌓이다 결국 터지는 과정을 만들면서, 사람도 감정을 계속 외면하거나 꾹꾹 눌러두면\n언젠간 터질 수밖에 없다는 걸 다시 느꼈습니다.\n슬픔이나 화남 같은 감정도 무조건 나쁜 게 아니라는 걸 표현하고 싶었고,\n 그걸 코드로 풀어보는 경험이 꽤 새로웠습니다.\n팀원들과 같이 아이디어를 나누고, 각자 역할을 맡아 하나하나 해결해 나가는 과정도 재밌었습니다.\n처음엔 '팀플 어렵겠다'는 생각이 있었는데, 막상 해보니까 서로 도우면서 완성해 나가는 과정이 훨씬 값졌고,\n 끝났을 땐 정말 뿌듯했습니다.\n덕분에 협업에 대한 생각도 많이 바뀌었던 경험이었습니다.";
  
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
  let arrowSize = 50; // 화살표 크기는 draw 함수와 동일하게 설정

  // 오른쪽 화살표 버튼 영역
  let rightArrowX = width * 0.95;
  let rightArrowY = height * 0.5;

  // 화살표의 클릭 가능 영역 (간단한 사각형으로 처리)
  let arrowRectX = rightArrowX - arrowSize / 2;
  let arrowRectY = rightArrowY - arrowSize / 2;
  let arrowRectWidth = arrowSize;
  let arrowRectHeight = arrowSize;

  if (mouseX > arrowRectX && mouseX < arrowRectX + arrowRectWidth &&
      mouseY > arrowRectY && mouseY < arrowRectY + arrowRectHeight) {
    window.location.href = 'feel2.html'; // feel2.html로 이동
  }
}
