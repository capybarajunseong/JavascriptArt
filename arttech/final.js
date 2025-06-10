let marbles = [];
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let backgroundImage;


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 구슬 초기화
  marbles = [
    {
      x: width * 0.3,
      y: height * 0.5,
      r: 40,
      color: pastelColors[1], // 하늘색
      rotation: 0
    },
    {
      x: width * 0.5,
      y: height * 0.5,
      r: 40,
      color: pastelColors[2], // 노란색
      rotation: 0
    },
    {
      x: width * 0.7,
      y: height * 0.5,
      r: 40,
      color: pastelColors[0], // 빨간색
      rotation: 0
    }
  ];
}

function draw() {
  // 배경 이미지 그리기
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(245); // 기본 파스텔 배경색
  }

  // 구슬 그리기
  for (let marble of marbles) {
    drawMarble(marble);
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
