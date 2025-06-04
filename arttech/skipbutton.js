let isHovering = false;
let buttonScale = 1;
let cursorScale = 1;
let cursorRotation = 0;
let buttonX, buttonY, buttonWidth, buttonHeight;
let buttonDepth = 5; // 버튼의 두께
let cursorAngle = 0;
let cursorDistance = 0;
let isClicking = false;
let clickProgress = 0;

// 배경 이미지 변수
let skipBgImage;
let skipPressedBgImage;
let currentBgImage; // 현재 보여질 배경 이미지

// 클릭 가능한 "SKIP" 버튼 영역의 좌표 및 크기 (이미지 위치에 맞게 조정)
let skipButtonX, skipButtonY, skipButtonWidth, skipButtonHeight;

// 이미지를 미리 로드하는 함수
function preload() {
  // try-catch 블록을 사용하여 이미지 로딩 실패 시 오류를 잡습니다.
  try {
    skipBgImage = loadImage('../image/skip.jpg'); // skip.jpg 이미지 로드
    skipPressedBgImage = loadImage('../image/skipPressed.jpg'); // skipPressed.jpg 이미지 로드
    console.log("Images loaded successfully in preload."); // 이미지 로드 성공 로그
  } catch (error) {
    console.error("Error loading images in preload:", error);
    // 이미지 로딩 실패 시 기본 배경색 사용
    skipBgImage = null;
    skipPressedBgImage = null;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 캔버스 크기를 창 크기에 맞게 조정
  
  // 초기 배경 이미지를 skipBgImage (skip.jpg)로 설정
  if (skipBgImage) { // 이미지가 로드되었는지 확인
    currentBgImage = skipBgImage;
  } else {
    currentBgImage = null; // 이미지 로드 실패 시 배경 이미지 없음
  }

  // 이미지 상의 "SKIP" 버튼 영역 좌표 및 크기 설정 (사용자 제공 좌표 기반)
  skipButtonX = 516;
  skipButtonY = 135;
  skipButtonWidth = 414;
  skipButtonHeight = 110;

  console.log(`Button area: X=${skipButtonX}, Y=${skipButtonY}, Width=${skipButtonWidth}, Height=${skipButtonHeight}`); // 버튼 영역 로그
}

function draw() {
  // 배경 이미지 그리기 (캔버스 크기에 맞게)
  if (currentBgImage) {
    image(currentBgImage, 0, 0, width, height);
  } else {
    // 이미지가 로드되지 않았을 경우 대체 배경 및 메시지
    background(240); // 연한 회색 배경
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("배경 이미지를 불러오지 못했습니다.\n웹 서버에서 실행 중인지, 이미지 파일이 올바른 경로에 있는지 확인하세요.", width/2, height/2);
  }

  // 클릭 애니메이션 업데이트
  if (isClicking) {
    clickProgress = lerp(clickProgress, 1, 0.2);
  } else {
    clickProgress = lerp(clickProgress, 0, 0.2);
  }

  // 커서 그리기 (마우스를 따라다니도록)
  drawCursor(mouseX, mouseY);

  // 이미지 배경을 사용하므로 기존에 얼굴이나 버튼을 직접 그렸던 함수 호출은 모두 제거해야 합니다.
  // drawFace(); // 이런 함수 호출은 여기에 있으면 안 됩니다.
  // drawButton(); // 이런 함수 호출도 여기에 있으면 안 됩니다.
  // drawSlope(); // 예시: 다른 화면 요소 그리기 함수도 마찬가지
  // drawBasket(); // 예시: 다른 화면 요소 그리기 함수도 마찬가지
  // ... 다른 그리기 함수 호출들 ...
}

// drawButton 함수는 배경 이미지로 대체되므로 삭제하거나 주석 처리합니다.
/*
function drawButton() {
  // 기존 버튼 그리기 코드 (삭제 또는 주석 처리)
  // ...
}
*/

// 커서 모양을 그리는 함수 (이전 코드에서 재사용)
function drawCursor(x, y) {
  push();
  translate(x, y);
  // 회전 및 거리 조정 로직은 더 이상 필요 없으므로 제거
  // rotate(cursorAngle);

  // 커서 그림자
  push();
  translate(3, 3);
  scale(0.95);
  drawCursorShape(50); // 알파값 적용
  pop();

  // 커서 본체
  drawCursorShape(255); // 알파값 적용

  // 클릭 효과
  if (clickProgress > 0) {
    push();
    translate(0, 10 * clickProgress);
    scale(1 - clickProgress * 0.2);
    drawCursorShape(200); // 알파값 적용
    pop();
  }

  pop();
}

// 커서 모양 자체를 그리는 상세 함수 (이전 코드에서 재사용)
function drawCursorShape(alpha) {
  // p5.js의 color 함수와 fill/stroke를 사용하도록 수정
  let mainColor = color(50, 50, 50, alpha); // 커서 본체 색상 (알파 적용)
  let highlightColor = color(100, 100, 100, alpha); // 커서 하이라이트 색상 (알파 적용)
  let borderColor = color(0, 0, 0, alpha); // 커서 테두리 색상 (알파 적용)

  // 커서 본체
  noStroke();
  fill(mainColor);
  beginShape();
  vertex(0, 0);
  vertex(15, 15);
  vertex(5, 15);
  vertex(0, 25);
  vertex(-5, 15);
  vertex(-15, 15);
  endShape(CLOSE);

  // 커서 하이라이트
  noStroke(); // 하이라이트도 스트로크 없음
  fill(highlightColor);
  beginShape();
  vertex(0, 0);
  vertex(12, 12);
  vertex(4, 12);
  vertex(0, 20);
  vertex(-4, 12);
  vertex(-12, 12);
  endShape(CLOSE);

  // 커서 테두리
  stroke(borderColor); // 테두리 색상 (알파 적용)
  strokeWeight(1);
  noFill(); // 테두리만 그림
  beginShape();
  vertex(0, 0);
  vertex(15, 15);
  vertex(5, 15);
  vertex(0, 25);
  vertex(-5, 15);
  vertex(-15, 15);
  endShape(CLOSE);
}

function mousePressed() {
  console.log(`Mouse pressed at: (${mouseX}, ${mouseY})`); // 마우스 클릭 위치 로그
  isClicking = true;
  clickProgress = 0; // 클릭 애니메이션 시작

  // 마우스 클릭 위치가 "SKIP" 버튼 영역 안에 있는지 확인
  // 현재 배경이 skipBgImage (skip.jpg)이고 이미지가 제대로 로드되었을 때만 배경 전환 로직 실행
  if (currentBgImage === skipBgImage && skipBgImage) {
    console.log("Current background is skip.jpg, checking button area..."); // 현재 배경 확인 로그
    // 마우스 클릭 위치가 "SKIP" 버튼 영역 안에 있는지 확인
    // skipButtonX, skipButtonY, skipButtonWidth, skipButtonHeight는 setup/windowResized에서 계산됩니다.
    if (mouseX > skipButtonX && mouseX < skipButtonX + skipButtonWidth &&
        mouseY > skipButtonY && mouseY < skipButtonY + skipButtonHeight) {

      console.log("Clicked inside button area!"); // 버튼 영역 클릭 성공 로그
      // SKIP 버튼 클릭 시 배경 이미지를 skipPressedBgImage (skipPressed.jpg)로 변경
      // skipPressedBgImage가 제대로 로드되었을 때만 변경합니다.
      if (skipPressedBgImage) {
        currentBgImage = skipPressedBgImage;
        console.log("Background changed to skipPressed.jpg"); // 배경 변경 로그

        // 배경이 바뀐 후 3초 뒤에 throw.html로 이동
        setTimeout(() => {
          console.log("Navigating to throw.html..."); // 페이지 이동 로그
          window.location.replace('throw.html');
        }, 1000); // 1000 밀리초 = 1초 대기
      } else {
        // 두 번째 이미지 로드 실패 시 처리 (예: 메시지 표시 또는 즉시 이동)
        console.warn("skipPressed.jpg not loaded, cannot change background.");
        // window.location.replace('throw.html'); // 필요시 즉시 이동
      }
    } else {
       console.log("Clicked outside button area."); // 버튼 영역 밖 클릭 로그
    }
  } else if (currentBgImage === skipPressedBgImage && skipPressedBgImage) {
     console.log("Current background is skipPressed.jpg."); // 배경이 이미 눌린 상태
     // 배경이 skipPressed.jpg일 때 클릭하면 즉시 throw.html로 이동 (예시, 필요에 따라 수정)
     // setTimeout 대기 중이라면 setTimeout이 먼저 실행될 것입니다.
     // window.location.replace('throw.html');
  } else {
    console.warn("skip.jpg not loaded, cannot check button click."); // 첫 번째 이미지 로드 실패 경고
    // 이미지 로드 실패 시 클릭해도 아무 일 일어나지 않도록 함
  }
}

function mouseReleased() {
  isClicking = false; // 클릭 애니메이션 중지
  // 마우스를 떼면 clickProgress가 0으로 서서히 돌아갑니다.
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 창 크기가 변경되면 버튼 영역도 업데이트 (여기서는 고정된 픽셀 값 사용)
  // 만약 화면 크기에 비례하여 버튼 위치를 조정하고 싶다면 다른 계산 방식 적용 필요
  skipButtonX = 516;
  skipButtonY = 135;
  skipButtonWidth = 414;
  skipButtonHeight = 110;
   console.log(`Window resized, updated button area: X=${skipButtonX}, Y=${skipButtonY}, Width=${skipButtonWidth}, Height=${skipButtonHeight}`); // 창 크기 변경 로그
}
// 기존에 직접 그림을 그렸던 함수들은 필요 없으므로 삭제하거나 주석 처리합니다.
// 예: drawFace, drawHair, drawEyes, drawNose, drawMouth, drawEyebrows 등
// 이 함수들이 파일에 남아있고 draw 함수에서 호출된다면 배경 이미지 위에 그려지게 됩니다.

