let characterImage;
let hearts = [];
let displayMessage = null; // 표시할 메시지
let messageStartTime = 0; // 메시지 표시 시작 시간
const MESSAGE_DURATION = 5000; // 메시지 표시 시간 (밀리초, 5초)

function preload() {
  // 여기에 실제 이미지 파일 경로를 넣어주세요. (예: 'character.png')
  characterImage = loadImage('../image/character.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, TOP); // 텍스트 정렬 설정
  textSize(32); // 텍스트 크기 설정
  
  // 초기 안내 메시지 설정
  displayMessage = "h키를 누르면 하트 뿅뿅!!><";
  messageStartTime = millis();
}

function draw() {
  background(255);

  // 이미지를 화면 중앙에 표시
  if (characterImage) {
    // 이미지 비율을 유지하면서 화면에 꽉 차도록 조정
    let aspectRatio = characterImage.width / characterImage.height;
    let imgWidth, imgHeight;

    if (width / height > aspectRatio) {
      // 캔버스가 이미지보다 가로로 길 때
      imgHeight = height;
      imgWidth = imgHeight * aspectRatio;
    } else {
      // 캔버스가 이미지보다 세로로 길거나 같을 때
      imgWidth = width;
      imgHeight = imgWidth / aspectRatio;
    }
    
    image(characterImage, width / 2, height / 2, imgWidth, imgHeight);
  }

  // 메시지 표시
  if (displayMessage !== null && millis() - messageStartTime < MESSAGE_DURATION) {
    fill(0); // 텍스트 색상 (검은색)
    text(displayMessage, width / 2, height * 0.1); // 화면 중앙 상단 근처에 표시
  } else if (displayMessage !== null && millis() - messageStartTime >= MESSAGE_DURATION) {
      // 메시지 표시 시간이 지나면 메시지 비활성화
      displayMessage = null;
  }

  // 저장된 하트 그리기
  for (let i = 0; i < hearts.length; i++) {
    drawHeart(hearts[i].x, hearts[i].y, hearts[i].size);
  }
}

function keyPressed() {
  // 'h' 키를 누르면 하트 추가 및 메시지 비활성화
  if (key === 'h' || key === 'H') {
    // 안내 메시지 비활성화
    displayMessage = null;
    
    // 하트 추가
    let heartSize = random(30, 60); // 랜덤 크기
    let heartX = random(width * 0.2, width * 0.8); // 화면 가운데 영역에 랜덤 위치
    let heartY = random(height * 0.2, height * 0.8); // 화면 가운데 영역에 랜덤 위치
    hearts.push({ x: heartX, y: heartY, size: heartSize });
  }
}

// 하트 그리는 함수
function drawHeart(x, y, size) {
  push();
  translate(x, y);
  fill(255, 0, 0, 150); // 반투명 빨간색 하트
  noStroke();
  beginShape();
  vertex(0, size / 4);
  bezierVertex(size / 2, -size / 2, size, 0, 0, size);
  bezierVertex(-size, 0, -size / 2, -size / 2, 0, size / 4);
  endShape(CLOSE);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 화면 크기 변경 시 이미지 위치 업데이트는 draw 함수에서 자동으로 처리됩니다.
}