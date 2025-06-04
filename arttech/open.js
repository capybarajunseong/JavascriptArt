let marblePositions = [];
let backgroundImage;
let pastelColors = ['#FFB3B3', '#A5D8FF']; // 빨강, 파랑만 사용

function preload() {
  backgroundImage = loadImage('../image/inTrash.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(210, 195, 160);
  }
  drawMarbles();
}

function drawMarbles() {
  let marbleSize = 55; 
  let numMarbles = 1000; // 생성 시도할 구슬 수
  marblePositions = [];
  let outline = [];
  let step = marbleSize * 0.8;

  // 기존 윤곽선 계산 (구슬 배치의 상한선 역할)
  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    let nx = map(x, width * 0.1, width * 0.9, 0, 5);
    let y = height - 100 - noise(nx) * 400; // 원래 윤곽선 Y 좌표
    outline.push({x, y});
  }

  // 구슬 배치 시도
  for (let i = 0; i < numMarbles; i++) {
    let placed = false;
    let tries = 0;
    // 시도 횟수 늘림
    while (!placed && tries < 500) { // 최대 500번 시도
      tries++;

      // 윤곽선 범위 내에서 가장 가까운 점 찾기
      let randomOutlinePoint = random(outline);
      let baseX = randomOutlinePoint.x; // 윤곽선 상의 X 위치
      let outlineY = randomOutlinePoint.y; // 해당 X에서의 윤곽선 Y

      // X 좌표는 윤곽선 점 주변으로 무작위 선택
      let x = baseX + random(-step/2, step/2);

      // Y 좌표는 화면 하단부터 윤곽선 Y까지 무작위 선택
      let y = random(outlineY, height); // Y 좌표 범위를 넓힘

      // (기존 코드 유지) Y 좌표 하한선 조정
      if (y > height - 100 - marbleSize * 0.5) y = height - 100 - marbleSize * 0.5;

      let overlapping = false;
      // 기존 구슬들과 겹치는지 확인
      for (let pos of marblePositions) {
        // 두 구슬 중심 사이의 거리가 구슬 지름(또는 그에 가까운 값)보다 작으면 겹침
        if (dist(x, y, pos.x, pos.y) < marbleSize) {
          overlapping = true;
          break;
        }
      }

      // 겹치지 않으면 구슬 위치 추가
      if (!overlapping) {
        let randomColor = random(pastelColors); // 파스텔 색상 중 무작위 선택
        marblePositions.push({x, y, r: marbleSize, color: color(randomColor)});
        placed = true;
      }
    }
  }

  // Y 좌표 기준으로 정렬 (하단에서부터 위로 그리도록)
  marblePositions.sort((a, b) => a.y - b.y);

  // 모든 구슬 그리기
  for (let pos of marblePositions) {
    drawMarble(pos.x, pos.y, pos.r, pos.color);
  }
}

function drawMarble(x, y, r, c) {
  push();
  translate(x, y);
  noStroke();
  fill(c);
  ellipse(0, 0, r * 2);
  fill(255, 255, 255, 50);
  ellipse(-r/3, -r/3, r/2);
  let shadowColor = color(0, 0, 0, 30);
  fill(shadowColor);
  ellipse(2, 2, r * 2);
  pop();
}

function mousePressed() {
  for (let pos of marblePositions) {
    if (dist(mouseX, mouseY, pos.x, pos.y) < pos.r / 2) {
      window.location.replace('touch.html');
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}