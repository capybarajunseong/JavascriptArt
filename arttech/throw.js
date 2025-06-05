let marbleX = 0;
let marbleY = 0;
let t = 0;
let isMarbleMoving = true;
let isMarbleVisible = true;
let backgroundImage;

function preload() {
  backgroundImage = loadImage('../image/trash.png', 
    () => { console.log('배경 이미지 로드 성공'); },
    () => { console.log('배경 이미지 로드 실패'); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // 배경 이미지 그리기
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(210, 195, 160); // 이미지 없을 시 기본 배경색
  }

  if (isMarbleMoving && isMarbleVisible) {
    // 포물선 경로 계산 (오두막 안으로 들어가도록 조정)
    let startX = 0; // 왼쪽 상단에서 시작
    let startY = 0; // 왼쪽 상단에서 시작
    let cp1X = width * 0.1;   // 새로운 시작점에 맞는 제어점
    let cp1Y = height * 0.1;  // 새로운 시작점에 맞는 제어점
    let cp2X = width * 0.25; 
    let cp2Y = height * 0.2; 
    // 오두막 굴뚝 위치 (이미지 기반 대략적인 좌표)
    let endX = width * 0.45;   
    let endY = height * 0.25; // 오두막 지붕/굴뚝 근처 Y 좌표

    marbleX = bezierPoint(startX, cp1X, cp2X, endX, t);
    marbleY = bezierPoint(startY, cp1Y, cp2Y, endY, t);

    drawMarble(marbleX, marbleY, 30); // 회색 구슬 그리기

    t += 0.012; // 애니메이션 속도 증가
    if (t >= 1) {
      isMarbleMoving = false;
      isMarbleVisible = false; // 도착 후 사라지게
    }
  }
}

function drawMarble(x, y, r) {
  push();
  translate(x, y);

  // 구슬 그라데이션 효과 (회색)
  let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, r);
  gradient.addColorStop(0, 'rgba(200, 200, 200, 1)');
  gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
  gradient.addColorStop(1, 'rgba(100, 100, 100, 1)');

  drawingContext.fillStyle = gradient;
  noStroke();
  ellipse(0, 0, r * 2);

  // 하이라이트 효과
  fill(255, 255, 255, 50);
  ellipse(-r/3, -r/3, r/2);

  pop();
}

function mousePressed() {
  // 이전 창고 문 손잡이 클릭 이벤트 제거됨
  // 필요한 경우 새로운 클릭 이벤트를 여기에 추가할 수 있습니다.
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 창 크기 변경 시 애니메이션 초기화 (필요하다면)
  // t = 0; isMarbleMoving = true; isMarbleVisible = true;
}
