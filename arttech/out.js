let backgroundImage;
let characterImg;
let character = {
    x: 0,
    y: 0,
    speed: 2,
    width: 80,
    height: 160
};

// 오두막 위치 (대략적인 위치, 필요시 조정)
const cabin = {
    x: 550, // 오두막 중심 x
    y: 350, // 오두막 중심 y
    width: 180,
    height: 180
};

function preload() {
  backgroundImage = loadImage('../image/out.png');
  characterImg = loadImage('../image/home.png',
    () => { console.log('캐릭터 이미지 로드 성공'); },
    () => { console.log('캐릭터 이미지 로드 실패'); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 캐릭터 초기 위치를 오두막 근처로 설정 (오른쪽으로 200픽셀 더 이동)
  character.x = cabin.x - character.width / 2 + 200;
  character.y = cabin.y + cabin.height / 2 - character.height; // 오두막 문 앞 바닥에
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(210, 195, 160); // 이미지 로드 실패 시 기본 배경색
  }

  handleMovement();
  drawCharacter();
}

function handleMovement() {
    if (keyIsDown(LEFT_ARROW)) {
        character.x -= character.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        character.x += character.speed;
    }
    if (keyIsDown(UP_ARROW)) {
        character.y -= character.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        character.y += character.speed;
    }

    // 화면 경계 체크
    character.x = constrain(character.x, 0, width - character.width);
    character.y = constrain(character.y, 0, height - character.height);

    // 캐릭터가 화면 아래쪽을 벗어나면 hug.js로 이동
    if (character.y >= height - character.height) {
        window.location.href = 'hug.html';
    }
}

function drawCharacter() {
    if (characterImg) {
        // 캐릭터의 Y 위치에 따라 크기 계산 (화면 아래로 내려올수록 커지도록)
        let minW = 5; // 최소 너비 (더 작게 조정)
        let maxW = 200; // 최대 너비
        let minH = 10; // 최소 높이 (더 작게 조정)
        let maxH = 400; // 최대 높이
        
        // character.y를 0 (화면 상단)에서 height (화면 하단)까지 매핑하여 크기 계산
        let w = map(character.y, 0, height, minW, maxW);
        let h = map(character.y, 0, height, minH, maxH);

        // 이미지 중심을 유지하면서 그리기 위한 위치 보정
        let drawX = character.x + character.width / 2 - w / 2;
        let drawY = character.y + character.height / 2 - h / 2;

        image(characterImg, drawX, drawY, w, h);
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 캐릭터 위치 재조정 (오른쪽으로 200픽셀 더 이동 유지)
  character.x = cabin.x - character.width / 2 + 200;
  character.y = cabin.y + cabin.height / 2 - character.height;
}
