let backgroundImage;
let characterImg;
let character = {
    x: 400,
    y: 300,
    speed: 5,
    width: 90, // 최대 크기(실제 사용은 drawCharacter에서 동적으로 결정)
    height: 180
};

// 오두막 위치와 크기(예시)
const cabin = {
    x: 900, // 오두막 중심 x
    y: 300, // 오두막 중심 y (더 위로)
    width: 180,
    height: 180
};

function preload() {
    backgroundImage = loadImage('../image/follow.jpg', 
        () => { console.log('배경 이미지 로드 성공'); },
        () => { console.log('배경 이미지 로드 실패'); }
    );
    characterImg = loadImage('../image/backfollow.png',
        () => { console.log('캐릭터 이미지 로드 성공'); },
        () => { console.log('캐릭터 이미지 로드 실패'); }
    );
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // 캐릭터를 화면 맨 아래 중앙에 위치
    character.x = (width - character.width) / 2;
    character.y = height - character.height;
}

function draw() {
    // 배경 이미지 그리기
    if (backgroundImage) {
        image(backgroundImage, 0, 0, width, height);
    } else {
        background(210, 195, 160);
    }

    // 캐릭터 이동 처리
    handleMovement();
    
    // 캐릭터 그리기
    drawCharacter();

    // 오두막 문과 충돌 체크 (문은 오두막 하단 중앙, x축 왼쪽으로 180 이동)
    let cx = character.x + character.width / 2;
    let cy = character.y + character.height / 2;
    let doorX = cabin.x - 180; // 왼쪽으로 180 이동 (더 늘림)
    let doorY = cabin.y + cabin.height / 2; // 하단 중앙
    let distToDoor = dist(cx, cy, doorX, doorY);
    if (distToDoor < 50) {
        window.location.href = 'scrub.html';
    }
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
}

function drawCharacter() {
    if (characterImg) {
        // 오두막 중심과 캐릭터 중심 사이 거리 계산
        let cx = character.x + character.width / 2;
        let cy = character.y + character.height / 2;
        let distToCabin = dist(cx, cy, cabin.x, cabin.y);
        // 거리 기반 크기 보간 (최대 400px 거리에서 최소 크기, 0px 거리에서 최대 크기)
        let minW = 20, maxW = 120;
        let minH = 40, maxH = 240;
        let d = constrain(distToCabin, 0, 400);
        let w = map(d, 0, 400, minW, maxW);
        let h = map(d, 0, 400, minH, maxH);
        // 캐릭터 중심이 유지되도록 위치 보정
        let drawX = cx - w / 2;
        let drawY = cy - h / 2;
        image(characterImg, drawX, drawY, w, h);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
