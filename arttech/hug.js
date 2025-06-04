let marbles = [];
let marbleColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5', '#FFB3B3', '#A5D8FF'];
let startTime;

function setup() {
  createCanvas(windowWidth, windowHeight); // 전체 화면으로 다시 변경
  noStroke();
  startTime = millis();
  
  // 구슬 위치를 캐릭터 기준으로 아래쪽에 배치 (캔버스 크기 변경에 맞게 수정)
  // 캐릭터 위치와 크기를 고려하여 구슬 시작 위치 조정
  let characterBaseY = height / 2 + 100; // 캐릭터가 화면 중앙 아래쪽에 위치한다고 가정
  let centerX = width / 2;
  let spacing = 70; // 구슬 간격
  
  for (let i = 0; i < 5; i++) {
    let x = centerX + (i - 2.5) * spacing; // 중앙에 5개 구슬 정렬
    let y = characterBaseY + 80 + (abs(i - 2) * 10); // 캐릭터 아래쪽에 살짝 곡선으로 배치
    let m = new Marble(x, y);
    m.isGray = false;
    m.color = color(marbleColors[i]);
    marbles.push(m);
  }
}

function draw() {
  background(255, 240, 245);

  drawCharacter();
  
  for (let m of marbles) {
    m.display();
  }

  drawArms(marbles); // 팔 함수에 구슬 배열 전달

  // 하트 그리기 (예시 위치)
  drawHeart(width * 0.15, height * 0.3, 50);
  drawHeart(width * 0.1, height * 0.5, 40);
  drawHeart(width * 0.85, height * 0.3, 50);
  drawHeart(width * 0.9, height * 0.5, 40);
  drawHeart(width * 0.3, height * 0.7, 30);
  drawHeart(width * 0.7, height * 0.7, 30);

  // 3초 후 final.html로 이동
  if (millis() - startTime > 3000) {
    window.location.href = 'final.html';
  }
}

function drawCharacter() {
  push();
  // 캐릭터를 화면 중앙 하단으로 이동
  translate(width / 2, height / 2 + 100); // 필요에 따라 위치 조정

  // 여기서부터 제공해주신 코드를 바탕으로 캐릭터 얼굴, 머리, 표정 등을 그립니다.
  // 캔버스의 (0,0)이 아닌 translate된 (0,0) 기준으로 좌표를 사용합니다.

  // 배경색은 draw 함수에서 이미 처리했으므로 여기서 다시 그릴 필요 없습니다.

  // 뒷 머리카락
  stroke('#C99A6A');
  strokeWeight(1.5);
  fill(255, 230, 120);
  rect(-100, -200, 200, 190); // 좌표 조정

  noStroke();

  // 머리 외곽선 및 살색
  fill(0); // 외곽선 색
  ellipse(0, -195, 197, 240); // 좌표 조정
  fill('#F8E1D6'); // 살색
  ellipse(0, -195, 197, 235); // 좌표 조정

  // 목
  rect(-27, -100, 60, 100); // 좌표 조정

  // 귀
  ellipse(100, -183, 38, 50); // 오른쪽 귀 (좌표 조정)
  ellipse(-100, -183, 38, 50); // 왼쪽 귀 (좌표 조정)

  // 귀 그림자 (좌표 조정)
  fill(70);
  arc(-97, -180, 30, 37, radians(90), radians(270));
  fill('#F8E1D6');
  arc(-95, -180, 30, 43, radians(90), radians(270));
  fill(70);
  ellipse(-100, -180, 10, 20);

  arc(103, -180, 30, 37, radians(270), radians(90));
  fill('#F8E1D6');
  arc(101, -180, 30, 43, radians(270), radians(90));
  fill(70);
  ellipse(100, -180, 10, 20);

  // 귀걸이 (좌표 조정)
  fill(255);
  ellipse(-100, -163, 8, 7);
  ellipse(100, -163, 8, 7);

  // 어깨 (이 부분은 팔과 겹치므로 나중에 조정 필요)
  // fill('#C1EDF8');
  // rect(-130, 70, 265, 100, 30); // 좌표 조정

  // 목 둥근 부분 (좌표 조정)
  fill(0);
  arc(3, 70, 60, 50, radians(0), radians(180));
  fill('#F8E1D6');
  arc(3, 70, 60, 48, radians(0), radians(180));

  // 머리 위쪽 및 앞머리 (좌표 조정)
  fill(255, 230, 120);
  arc(0, -300, 100, 100, radians(0), radians(180));
  arc(0, -285, 140, 60, radians(170), radians(355));
  arc(-60, -258, 90, 140, radians(300), radians(120));
  arc(50, -260, 120, 150, radians(40), radians(230));
  fill(255, 230, 120);
  arc(-40, -195, 130, 210, radians(180), radians(270));
  arc(40, -195, 130, 210, radians(270), radians(360));

  // 턱 그림자 (좌표 조정)
  fill(100);
  ellipse(0, -120, 100, 100, radians(70), radians(110));
  fill('#F8E1D6');
  ellipse(0, -130, 126, 109, radians(70), radians(110));

  // 입 (활짝 웃는 표정으로 변경)
  noFill(); // 입 안쪽 채우기 없음
  stroke(0); // 입 선 색
  strokeWeight(3);
  arc(0, -150, 60, 40, radians(0), radians(180)); // 위로 볼록한 웃는 입

  // 코 (좌표 조정)
  fill(0);
  ellipse(5, -157, 25, 30);
  fill('#F8E1D6');
  ellipse(7, -159, 34, 30);

  // 앞머리 (겹치는 부분 다시 그리기, 좌표 조정)
  stroke('#C99A6A');
  strokeWeight(1.5);
  fill(255, 230, 120);
  arc(-60, -258, 90, 140, radians(300), radians(120));
  arc(50, -260, 120, 150, radians(40), radians(230));

  noStroke();

  // 볼따구 (좌표 조정)
  fill('#F9AFED49');
  ellipse(-55, -146, 40, 30);
  ellipse(55, -146, 40, 30);

  // 점 (좌표 조정)
  fill(0);
  ellipse(-81, -180, 3, 3);
  ellipse(71, -173, 3, 3);

  // 머리 광 (좌표 조정)
  fill('#4B4D4EDD');
  arc(60, -260, 120, 120, radians(70), radians(230));
  fill(255, 230, 120);
  arc(62, -262, 124, 119, radians(70), radians(230));
  fill('#3F4244DD');
  arc(58, -275, 110, 110, radians(93), radians(174));
  fill(255, 230, 120);
  arc(59, -277, 112, 112, radians(93), radians(174));
  fill('#565758DD');
  arc(20, -224, 120, 120, radians(270), radians(360));
  fill(255, 230, 120);
  arc(18, -224, 120, 120, radians(270), radians(360));

  fill('#515457DD');
  arc(-75, -250, 100, 100, radians(350), radians(110));
  fill(255, 230, 120);
  arc(-77, -250, 100, 105, radians(348), radians(110));
  fill('#303233DD');
  arc(-33, -235, 100, 100, radians(180), radians(270));
  fill(255, 230, 120);
  arc(-32, -235, 98, 101, radians(180), radians(270));

  // 뒷머리카락 광 (좌표 조정)
  fill('#5D5F61DD');
  rect(-80, -100, 10, 60);
  fill(255, 230, 120);
  rect(-79, -100, 10, 60);

  fill('#666A6DDD');
  rect(50, -76, 10, 40);
  fill(255, 230, 120);
  rect(51, -76, 10, 40);

  fill('#666A6DDD');
  rect(75, -100, 10, 70);
  fill(255, 230, 120);
  rect(76, -100, 10, 70);

  // 눈썹 (좌표 조정)
  rect(-62, -211, 40, 8, 30);

  // 눈 (활짝 웃는 표정으로 변경)
  noStroke();
  fill(0); // 아이라인
  ellipse(-20, -186, 48, 33); // 왼쪽 눈
  fill(255); ellipse(-20, -185, 50, 30); // 왼쪽 흰자
  fill(0); ellipse(-20, -185, 30, 30); // 왼쪽 눈동자
  fill(255); ellipse(-17, -185, 10, 10); ellipse(-25, -188, 5, 5); // 왼쪽 반짝이

  fill(0); // 아이라인
  ellipse(20, -186, 48, 33); // 오른쪽 눈
  fill(255); ellipse(20, -185, 50, 30); // 오른쪽 흰자
  fill(0); ellipse(20, -185, 30, 30); // 오른쪽 눈동자
  fill(255); ellipse(25, -185, 10, 10); ellipse(17, -188, 5, 5); // 오른쪽 반짝이

  pop();
}

// 구슬을 껴안는 팔 그리는 함수
function drawArms(marbles) {
    push();
    // 캐릭터 위치와 동일하게 이동
    translate(width / 2, height / 2 + 100); // 캐릭터 위치와 동일하게 조정

    stroke('#C1EDF8'); // 팔 색상
    strokeWeight(25); // 팔 두께
    noFill();

    // 구슬들을 감싸는 팔 라인 그리기
    // 구슬들의 대략적인 위치를 기준으로 팔 위치를 조정합니다.
    // 이 부분은 구슬 위치 및 캐릭터 크기에 따라 미세 조정이 필요할 수 있습니다.

    // 왼쪽 팔
    beginShape();
    curveVertex(-50, 0); // 시작점 (캐릭터 몸통 근처)
    curveVertex(-50, 0);
    curveVertex(-100, 70); // 구슬 왼쪽 상단을 감싸는 커브
    curveVertex(-50, 150); // 구슬 아래쪽을 지나가는 커브
    curveVertex(20, 170); // 끝점 (반대편 구슬 아래)
    endShape();

    // 오른쪽 팔
    beginShape();
    curveVertex(50, 0); // 시작점 (캐릭터 몸통 근처)
    curveVertex(50, 0);
    curveVertex(100, 70); // 구슬 오른쪽 상단을 감싸는 커브
    curveVertex(50, 150); // 구슬 아래쪽을 지나가는 커브
    curveVertex(-20, 170); // 끝점 (반대편 구슬 아래)
    endShape();

    pop();
}

// 하트 그리는 함수
function drawHeart(x, y, size) {
  push();
  translate(x, y);
  fill(255, 0, 0); // 빨간색 하트
  noStroke();
  beginShape();
  vertex(0, size / 4);
  bezierVertex(size / 2, -size / 2, size, 0, 0, size);
  bezierVertex(-size, 0, -size / 2, -size / 2, 0, size / 4);
  endShape(CLOSE);
  pop();
}

// 네 기존 Marble 클래스를 그대로 사용
class Marble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
    this.isGray = true;
    this.color = null;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // 그라데이션
    let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
    if (this.isGray) {
      gradient.addColorStop(0, 'rgba(180,180,180,1)');
      gradient.addColorStop(1, 'rgba(120,120,120,1)');
    } else {
      let c = this.color;
      let r = red(c);
      let g = green(c);
      let b = blue(c);
      gradient.addColorStop(0, `rgba(${r+50}, ${g+50}, ${b+50}, 1)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
      gradient.addColorStop(1, `rgba(${r-30}, ${g-30}, ${b-30}, 1)`);
    }
    drawingContext.fillStyle = gradient;
    circle(0, 0, this.size);
    
    // 하이라이트
    fill(255, 255, 255, 50);
    ellipse(-this.size/6, -this.size/6, this.size/3);

    pop();
  }
}