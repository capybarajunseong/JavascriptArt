let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let backgroundImage;


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  // 구슬 초기화
  marbles = [
    {
      x: width * 0.18,
      y: height * 0.5,
      r: 250,
      color: pastelColors[1], // 하늘색
      rotation: 0,
      text: "소감"
    },
    {
      x: width * 0.5,
      y: height * 0.5,
      r: 250,
      color: pastelColors[2], // 노란색
      rotation: 0,
      text: "함수 및 문법"
    },
    {
      x: width * 0.83,
      y: height * 0.5,
      r: 250,
      color: pastelColors[0], // 빨간색
      rotation: 0,
      text: "AI 사용"
    }
  ];
}

function draw() {
  // 파스텔 그라데이션 배경
  setGradientBackground();
  
  // Ending Credits 텍스트
  textSize(60);
  fill(255, 255, 255, 200); // 반투명 흰색
  text("Ending Credits", width * 0.5, height * 0.15);
  
  // 구슬 그리기
  for (let marble of marbles) {
    drawMarble(marble);
    // 구슬 아래 텍스트
    textSize(40);
    fill(255, 255, 255, 200); // 반투명 흰색
    text(marble.text, marble.x, marble.y + marble.r - 30);
  }
}

function setGradientBackground() {
  // 파스텔 그라데이션 색상
  let c1 = color(255, 182, 193); // 파스텔 핑크
  let c2 = color(216, 191, 216); // 파스텔 보라색
  
  // 수직 그라데이션
  for(let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawMarble(marble) {
  push();
  translate(marble.x, marble.y);
  rotate(marble.rotation);
  
  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2, 2, marble.r, marble.r);
  
  // 구슬 본체
  fill(marble.color);
  ellipse(0, 0, marble.r, marble.r);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-marble.r/4, -marble.r/4, marble.r/3, marble.r/3);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 구슬 위치 재조정
  marbles[0].x = width * 0.3;
  marbles[0].y = height * 0.5;
  marbles[1].x = width * 0.5;
  marbles[1].y = height * 0.5;
  marbles[2].x = width * 0.7;
  marbles[2].y = height * 0.5;
}

function mousePressed() {
  // 하늘색 구슬 (marbles[0]) 클릭 감지
  let blueMarble = marbles[0];
  let dBlue = dist(mouseX, mouseY, blueMarble.x, blueMarble.y);
  if (dBlue < blueMarble.r / 2) { // 구슬 반지름의 절반보다 작으면 클릭으로 간주
    window.location.href = 'feel1.html'; // feel1.html로 이동
  }

  // 노란색 구슬 (marbles[1]) 클릭 감지
  let yellowMarble = marbles[1];
  let dYellow = dist(mouseX, mouseY, yellowMarble.x, yellowMarble.y);
  if (dYellow < yellowMarble.r / 2) {
    window.location.href = 'hamsu.html'; // hamsu.html로 이동
  }
}
