let marblePositions = [];
let backgroundImage;
let pastelColors = ['#808080']; // 회색으로 변경
let imageLoaded = false;
let marblesGenerated = false;

function preload() {
  backgroundImage = loadImage('../image/inTrash.jpg', 
    () => {
      console.log('이미지 로드 성공');
      imageLoaded = true;
    },
    () => {
      console.log('이미지 로드 실패');
      imageLoaded = true;
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateMarbles(); // 구슬을 한 번만 생성
}

function generateMarbles() {
  let marbleSize = 55; 
  let numMarbles = 1000;
  marblePositions = [];
  let outline = [];
  let step = marbleSize * 0.8;

  // 윤곽선 계산
  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    let nx = map(x, width * 0.1, width * 0.9, 0, 5);
    let y = height - 100 - noise(nx) * 400;
    outline.push({x, y});
  }

  // 구슬 생성
  for (let i = 0; i < numMarbles; i++) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 500) {
      tries++;
      let randomOutlinePoint = random(outline);
      let baseX = randomOutlinePoint.x;
      let outlineY = randomOutlinePoint.y;
      let x = baseX + random(-step/2, step/2);
      let y = random(outlineY, height);
      if (y > height - 100 - marbleSize * 0.5) y = height - 100 - marbleSize * 0.5;

      let overlapping = false;
      for (let pos of marblePositions) {
        if (dist(x, y, pos.x, pos.y) < marbleSize) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        let randomColor = random(pastelColors);
        marblePositions.push({x, y, r: marbleSize, color: color(randomColor), isSpecial: false});
        placed = true;
      }
    }
  }

  // Y 좌표 기준으로 정렬
  marblePositions.sort((a, b) => a.y - b.y);

  // 상위 10% 구슬들 중에서 무작위로 하나를 선택하여 특별한 구슬로 만듦
  let topMarblesCount = Math.floor(marblePositions.length * 0.1);
  let randomIndex = Math.floor(random(topMarblesCount));
  marblePositions[randomIndex].isSpecial = true;
  
  marblesGenerated = true;
}

function draw() {
  if (!imageLoaded) {
    background(210, 195, 160);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text('로딩중...', width/2, height/2);
    return;
  }

  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(210, 195, 160);
  }

  // 구슬 그리기
  for (let pos of marblePositions) {
    if (pos.isSpecial) {
      push();
      translate(pos.x, pos.y);
      
      // 반짝이는 효과
      let sparkleSize = pos.r * 0.15;
      let sparkleAngle = frameCount * 0.1;
      for (let j = 0; j < 4; j++) {
        let angle = sparkleAngle + (j * PI/2);
        let x = cos(angle) * pos.r * 0.7;
        let y = sin(angle) * pos.r * 0.7;
        fill(255, 255, 255, 150);
        ellipse(x, y, sparkleSize);
      }

      // 테두리 효과
      stroke(255, 255, 255, 100);
      strokeWeight(3);
      noFill();
      ellipse(0, 0, pos.r * 2.2);
      
      noStroke();
      
      // 그라데이션 효과
      for (let r = pos.r * 2.1; r > 0; r -= 2) {
        let inter = map(r, 0, pos.r * 2.1, 1, 0);
        let c = lerpColor(color('#87CEEB'), color('#808080'), inter);
        fill(c);
        ellipse(0, 0, r);
      }
      
      // 하이라이트
      fill(255, 255, 255, 70);
      ellipse(-pos.r/3, -pos.r/3, pos.r/1.8);
      
      // 그림자
      let shadowColor = color(0, 0, 0, 40);
      fill(shadowColor);
      ellipse(2, 2, pos.r * 2.1);
      pop();
    } else {
      drawMarble(pos.x, pos.y, pos.r, pos.color);
    }
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
    if (pos.isSpecial && dist(mouseX, mouseY, pos.x, pos.y) < pos.r) {
      window.location.replace('touch.html');
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateMarbles(); // 창 크기가 변경될 때만 구슬 재생성
}