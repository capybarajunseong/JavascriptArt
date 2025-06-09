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

  // 고정된 윤곽선 계산
  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    let nx = map(x, width * 0.1, width * 0.9, 0, 5);
    let y = height - 100 - sin(nx) * 200; // sin 함수로 고정된 곡선 생성
    outline.push({x, y});
  }

  // 구슬 배치 시도
  for (let i = 0; i < numMarbles; i++) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 500) {
      tries++;

      // 더 자연스러운 구슬 배치
      let outlineIndex = floor(i / 15) % outline.length; // 15개씩 같은 높이에 배치
      let baseX = outline[outlineIndex].x;
      let outlineY = outline[outlineIndex].y;

      // x 좌표를 약간의 오프셋을 주어 배치
      let xOffset = (i % 15) * (step * 0.9);
      let x = baseX + xOffset + sin(i * 0.5) * 10; // sin 함수로 약간의 변동 추가
      
      // y 좌표도 약간의 변동을 주어 배치
      let yOffset = floor(i / 150) * (marbleSize * 0.9);
      let y = outlineY + yOffset + cos(i * 0.3) * 15; // cos 함수로 약간의 변동 추가

      if (y > height - 100 - marbleSize * 0.5) y = height - 100 - marbleSize * 0.5;

      let overlapping = false;
      for (let pos of marblePositions) {
        if (dist(x, y, pos.x, pos.y) < marbleSize * 0.9) { // 겹침 판정 범위를 약간 줄임
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        // 색상을 더 자연스럽게 섞이도록 패턴 수정
        let colorIndex = (floor(i / 3) + floor(i / 7)) % 2;
        marblePositions.push({
          x: x,
          y: y,
          r: marbleSize,
          color: color(pastelColors[colorIndex])
        });
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