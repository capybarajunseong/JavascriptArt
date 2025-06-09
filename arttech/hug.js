let characterImage;
let hearts = [];
let displayMessage = null; // 표시할 메시지
let messageStartTime = 0; // 메시지 표시 시작 시간
const MESSAGE_DURATION = 5000; // 메시지 표시 시간 (밀리초, 5초)
let backgroundImage; // 배경 이미지를 위한 변수
let lastHeartTime = 0; // 마지막 하트 생성 시간
let heartInterval = 500; // 하트 생성 간격 (밀리초)
let leftHeartsCount = 0; // 생성된 왼쪽 하트 개수
let rightHeartsCount = 0; // 생성된 오른쪽 하트 개수
const MAX_HEARTS_SIDE = 5; // 한쪽 영역에 생성될 최대 하트 개수

function preload() {
  // 여기에 실제 이미지 파일 경로를 넣어주세요. (예: 'character.png')
  characterImage = loadImage('../image/character.png');
  // 배경 이미지를 로드합니다.
  backgroundImage = loadImage('../image/firstbackground.png',
    () => console.log('배경 이미지 로드 성공'),
    () => console.log('배경 이미지 로드 실패')
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, TOP); // 텍스트 정렬 설정
  textSize(32); // 텍스트 크기 설정
  
  // 시작할 때 바로 하트 하나 생성
  generateHeart();
}

function draw() {
  // 배경 이미지를 그립니다.
  if (backgroundImage) {
    // 배경 이미지를 캔버스 전체에 강제로 늘려 그립니다. (종횡비 무시)
    push(); // 현재 그리기 설정(imageMode 포함) 저장
    imageMode(CORNER); // 배경 이미지는 좌상단 기준 (0,0)으로 그립니다.
    image(backgroundImage, 0, 0, width, height); // 화면 전체에 이미지 그리기
    pop(); // 이전 그리기 설정 복원 (캐릭터 이미지는 CENTER로 그려야 하므로)

  } else {
    background(255); // 이미지 로드 실패 시 흰색 배경
  }

  // 캐릭터 이미지를 그립니다. (imageMode는 pop()으로 인해 CENTER로 유지됨)
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

  // 메시지 표시 - 이 부분은 이제 필요 없습니다.
  if (displayMessage !== null && millis() - messageStartTime < MESSAGE_DURATION) {
    fill(0); // 텍스트 색상 (검은색)
    text(displayMessage, width / 2, height * 0.1); // 화면 중앙 상단 근처에 표시
  } else if (displayMessage !== null && millis() - messageStartTime >= MESSAGE_DURATION) {
      // 메시지 표시 시간이 지나면 메시지 비활성화
      displayMessage = null;
  }

  // 일정 간격으로 하트 자동 생성 (총 하트 개수가 10개 미만일 때만 생성)
  if (hearts.length < MAX_HEARTS_SIDE * 2 && millis() - lastHeartTime > heartInterval) {
    generateHeart();
    lastHeartTime = millis();
  }

  // 저장된 하트 그리기
  for (let i = 0; i < hearts.length; i++) {
    drawHeart(hearts[i].x, hearts[i].y, hearts[i].size);
  }

  // 하트 생성이 완료되면 다음 화면으로 전환
  if (hearts.length === MAX_HEARTS_SIDE * 2) {
    // 모든 하트가 생성되고 잠시 대기 후 전환 (선택 사항, 바로 전환하려면 아래 setTimeout 제거)
    // setTimeout(() => {
       window.location.href = 'final.html'; // next screen
    // }, 1000); // 예: 1초 대기 후 전환
  }
}

function keyPressed() {
  // 'h' 키를 눌렀을 때의 동작 (이제 하트 생성은 자동)
  if (key === 'h' || key === 'H') {
    // 이 부분에 h 키를 눌렀을 때의 다른 동작을 추가할 수 있습니다.
    console.log("H key pressed - hearts are generated automatically now.");
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

// 하트 생성 함수
function generateHeart() {
  // 최대 하트 개수에 도달했으면 생성하지 않음
  if (hearts.length >= MAX_HEARTS_SIDE * 2) {
    return;
  }

  let heartSize = random(30, 60); // 랜덤 크기
  let heartX;
  // 화면 양 옆 영역 중 무작위로 선택하여 X 위치 지정
  if (random() < 0.5) { // 50% 확률로 왼쪽 영역
    // 왼쪽 영역에 생성될 하트 개수가 MAX_HEARTS_SIDE 미만일 때만 생성
    if (leftHeartsCount < MAX_HEARTS_SIDE) {
      heartX = random(0, width * 0.4);
      leftHeartsCount++;
    } else {
      // 왼쪽이 다 찼으면 오른쪽으로 강제 이동
      heartX = random(width * 0.6, width);
      rightHeartsCount++;
    }
  } else { // 50% 확률로 오른쪽 영역
    // 오른쪽 영역에 생성될 하트 개수가 MAX_HEARTS_SIDE 미만일 때만 생성
    if (rightHeartsCount < MAX_HEARTS_SIDE) {
      heartX = random(width * 0.6, width);
      rightHeartsCount++;
    } else {
      // 오른쪽이 다 찼으면 왼쪽으로 강제 이동
      heartX = random(0, width * 0.4);
      leftHeartsCount++;
    }
  }
  let heartY = random(height * 0.2, height * 0.8); // 화면 가운데 영역에 랜덤 위치
  hearts.push({ x: heartX, y: heartY, size: heartSize });
}