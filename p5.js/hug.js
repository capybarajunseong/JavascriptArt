let marbles = [];
let marbleColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5', '#FFB3B3', '#A5D8FF'];
let startTime;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  startTime = millis();
  
  // 구슬 위치를 캐릭터 기준으로 아래쪽에 배치
  let centerX = width / 2;
  let centerY = height / 2 + 60;
  let spacing = 70;
  
  for (let i = 0; i < 5; i++) {
    let x = centerX + (i - 2) * spacing;
    let y = centerY + (abs(i - 2) * 10); // 살짝 곡선 배치
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

  drawArms();

  // 안내 문구 추가
  textAlign(CENTER);
  textSize(20);
  fill(100);
  text("Press 'c' key to organize marbles", width/2, height - 30);

  // 3초 후 final.html로 이동
  if (millis() - startTime > 3000) {
    window.location.href = 'final.html';
  }
}

function drawCharacter() {
  push();
  translate(width/2 - 200, height/2 - 200); // 캐릭터를 화면 중앙으로 이동
  
  noStroke(); 
  
  fill('#1F1A15');
  rect(100, 200, 200, 190); //뒷 머리카락

  fill(0);
  ellipse(200, 205, 197, 240);
  
  fill('#F8E1D6');
  ellipse(200, 205, 197, 235); //머리
  
  rect(173, 300, 60, 100); //목
  
  ellipse(300, 217, 38, 50); //귀 오
  ellipse(100, 217, 38, 50); //귀 왼
  
  fill(70);
  arc(103, 220, 30, 37, radians(90), radians(270));
  fill('#F8E1D6');
  arc(105, 220, 30, 43, radians(90), radians(270));
  fill(70);
  ellipse(100, 220, 10, 20);
  //왼쪽 귀 그림자
  arc(298, 220, 30, 37, radians(270), radians(90));
  fill('#F8E1D6');
  arc(296, 220, 30, 43, radians(270), radians(90));
  fill(70);
  ellipse(300, 220, 10, 20);
  //오른쪽 귀 그림자
  
  fill(255);
  ellipse(100, 237, 8, 7);
  ellipse(300, 237, 8, 7);
  //귀걸이 왼오
  fill(40);
  ellipse(84, 219, 15, 6);
  ellipse(84, 219, 3, 10);
  //피어싱
  
  fill('#C1EDF8');
  rect(70, 370, 265, 100, 30); //어깨
  
  fill(0);
  arc(203, 370, 60, 50, radians(0), radians(180)); //목 둥글 그림자
  fill('#F8E1D6');
  arc(203, 370, 60, 48, radians(0), radians(180));  //목 둥근 부분
  
  fill('#1F1A15');
  arc(200, 100, 100, 100, radians(0), radians(180)); //머리 위쪽1
  arc(200, 115, 140, 60, radians(170), radians(355)); //머리 위쪽2
  arc(140, 142, 90, 140, radians(300), radians(120)); //앞머리 왼
  arc(250, 140, 120, 150, radians(40), radians(230)); //앞머리 오
  fill('#1F1A15');
  arc(160, 200, 130, 210, radians(180), radians(270));
  arc(240, 200, 130, 210, radians(270), radians(360));

  fill(100);
  ellipse(200, 280, 100, 100, radians(70), radians(110));
  fill('#F8E1D6');
  ellipse(200, 270, 126, 109, radians(70), radians(110));
  //턱 그림자
  
  fill(0);
  ellipse(200, 233, 110, 100);
  fill('#F8E1D6');
  ellipse(200, 232, 118, 99);
  //입
  
  fill(0);
  ellipse(205, 243, 25, 30);
  fill('#F8E1D6');
  ellipse(207, 241, 34, 30);
  //코
  
  fill('#1F1A15');
  arc(140, 142, 90, 140, radians(300), radians(120)); //앞머리 왼
  arc(250, 140, 120, 150, radians(40), radians(230)); //앞머리 오
  
  fill('#F9AFED49');
  ellipse(145, 254, 40, 30);
  ellipse(255, 254, 40, 30);
  //볼따구
  
  fill(0);
  ellipse(119, 220, 3, 3);
  ellipse(271, 227, 3, 3);
  //점
  
  fill('#4B4D4EDD');
  arc(260, 140, 120, 120, radians(70), radians(230));
  fill('#1F1A15');
  arc(262, 138, 124, 119, radians(70), radians(230));
  fill('#3F4244DD');
  arc(258, 125, 110, 110, radians(93), radians(174));
  fill('#1F1A15');
  arc(259, 123, 112, 112, radians(93), radians(174));
  fill('#565758DD');
  arc(220, 176, 120, 120, radians(270), radians(360));
  fill('#1F1A15');
  arc(218, 176, 120, 120, radians(270), radians(360));
  //오른쪽 머리 광
  
  fill('#515457DD');
  arc(125, 150, 100, 100, radians(350), radians(110));
  fill('#1F1A15');
  arc(123, 150, 100, 105, radians(348), radians(110));
  fill('#303233DD');
  arc(167, 165, 100, 100, radians(180), radians(270));
  fill('#1F1A15');
  arc(168, 165, 98, 101, radians(180), radians(270));
  // 왼쪽 머리 광
  
  fill('#5D5F61DD');
  rect(120, 300, 10, 60);
  fill('#1F1A15');
  rect(121, 300, 10, 60);

  fill('#666A6DDD');
  rect(250, 324, 10, 40);
  fill('#1F1A15');
  rect(251, 324, 10, 40);
  
  fill('#666A6DDD');
  rect(275, 300, 10, 70);
  fill('#1F1A15');
  rect(276, 300, 10, 70);
  // 뒷머리카락 광
  
  rect(138, 189, 40, 8, 30); //눈썹
  
  fill('#335263');
  rect(205, 160, 50, 18, 30);

  // 감은 눈 (윙크)
  stroke(0);
  strokeWeight(2);
  noFill();
  arc(160, 225, 43, 12, radians(0), radians(180));

  // 평소 눈
  noStroke();
  fill(0); ellipse(160, 224, 48, 33); // 아이라인
  fill(255); ellipse(160, 225, 50, 30); // 흰자
  fill(0); ellipse(160, 225, 30, 30); // 눈동자
  fill(255); ellipse(163, 225, 10, 10); ellipse(155, 222, 5, 5); // 반짝이

  // 오른쪽 눈 (항상 그대로)
  noStroke();
  fill(0); ellipse(240, 224, 48, 33);
  fill(255); ellipse(240, 225, 50, 30);
  fill(0); ellipse(240, 225, 30, 30);
  fill(255); ellipse(245, 225, 10, 10); ellipse(237, 222, 5, 5);

  pop();
}

function drawArms() {
  push();
  translate(width/2, height/2 + 40);

  // 왼팔
  stroke(255, 220, 200);
  strokeWeight(25);
  noFill();
  beginShape();
  curveVertex(-90, -10);
  curveVertex(-90, -10);
  curveVertex(-60, 20);
  curveVertex(-40, 50);
  endShape();

  // 오른팔
  beginShape();
  curveVertex(90, -10);
  curveVertex(90, -10);
  curveVertex(60, 20);
  curveVertex(40, 50);
  endShape();

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