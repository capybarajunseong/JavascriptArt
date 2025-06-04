// 전역 변수
let singleMarble; // 하나의 구슬 객체
let draggedMarble = null; // 현재 드래그 중인 구슬
let restoredMarbles = []; // 복원된 구슬들을 저장할 배열 (단일 구슬에서는 복원 개념이 달라질 수 있으나 일단 유지)
let handX = 400; // 손의 x 위치
let handY = 500; // 손의 y 위치
let rubbingProgress = 0; // 문지르기 진행도 (단일 구슬에 맞춰 사용 방식 변경 가능)
let isRubbing = false; // 문지르기 중인지 여부
let prevMouseX = 0; // 이전 마우스 X 위치
let prevMouseY = 0; // 이전 마우스 Y 위치
let rubbingThreshold = 5; // 문지르기로 인정할 최소 이동 거리
let requiredRubbingCount = 3; // 필요한 문지르기 횟수
let isDraggingMode = true; // 드래그 모드인지 문지르기 모드인지 구분 (단일 구슬에 맞춰 로직 변경)
// let originalPositions = []; // 단일 구슬이므로 필요 없음
// let colorOrder = []; // 단일 구슬이므로 필요 없음

// 배경 이미지 변수 추가
let backgroundImage;

// 이미지를 미리 로드하는 함수
function preload() {
  backgroundImage = loadImage('../image/touchbg.png'); // 이미지 파일 경로 설정
}

// 구슬 클래스
class Marble {
    constructor(x, y, size) { // 크기를 생성자에서 받도록 수정
        this.x = x;
        this.y = y;
        this.isGray = true;
        this.isRestored = false; // 단일 구슬에서는 이 상태가 최종 복원 상태를 나타낼 수 있음
        this.size = size; // 생성자에서 받은 크기 사용
        this.targetX = x; // 단일 구슬에서는 드래그 모드 시에만 사용될 수 있음
        this.targetY = y;
        this.color = null; // 문지르기 후 변경될 색상
        this.isGrabbed = false; // 손에 잡혔는지 여부
        this.rubbingCount = 0; // 문지른 횟수
        this.lastRubbingTime = 0; // 마지막 문지른 시간
    }

    display() {
        noStroke();
        push();
        // 단일 구슬은 항상 중앙에 상대적으로 위치
        // translate(this.x, this.y);
        translate(width/2, height/2);
        
        // 구슬 그라데이션 효과
        let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
        if (this.isGray) {
            gradient.addColorStop(0, 'rgba(180, 180, 180, 1)');
            gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
            gradient.addColorStop(1, 'rgba(120, 120, 120, 1)');
        } else {
            // 복원된 상태의 색상 사용
            let c = this.color || color(100, 100, 100); // 색상이 설정되지 않았다면 기본 회색 사용
            let r = red(c);
            let g = green(c);
            let b = blue(c);
            gradient.addColorStop(0, `rgba(${min(r+50, 255)}, ${min(g+50, 255)}, ${min(b+50, 255)}, 1)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
            gradient.addColorStop(1, `rgba(${max(r-30, 0)}, ${max(g-30, 0)}, ${max(b-30, 0)}, 1)`);
        }
        
        drawingContext.fillStyle = gradient;
        circle(0, 0, this.size); // translate(width/2, height/2)를 사용했으므로 (0,0)에 그림
        
        // 하이라이트 효과
        fill(255, 255, 255, 50);
        ellipse(-this.size/6, -this.size/6, this.size/3);
        
        // 문지르기 진행도 표시 (회색 상태이고 잡혔을 때)
        if (this.isGrabbed && this.isGray) {
            // 진행도 바 배경
            fill(200, 200, 200, 100);
            rect(-this.size/2, -this.size/2 - 20, this.size, 10, 5);
            
            // 진행도 바
            let progressWidth = (this.rubbingCount / requiredRubbingCount) * this.size;
            fill(100, 200, 255, 200); // 파란색 진행도 바
            rect(-this.size/2, -this.size/2 - 20, progressWidth, 10, 5);
            
            // 진행도 텍스트
            fill(0); // 검은색 텍스트
            textSize(this.size * 0.12);
            textAlign(CENTER);
            text(`${this.rubbingCount}/${requiredRubbingCount}`, 0, -this.size/2 - 25);
        }
        
        pop();
    }

    // 단일 구슬이므로 isMouseOver 대신 isHandOver만 사용
    isHandOver() {
        // 손 위치와 구슬 중앙 위치 간의 거리 체크
        return dist(handX, handY, width/2, height/2) < this.size/2;
    }

    restore() {
        if (this.isGray) {
            // 최소 100ms 간격으로 문지르기 카운트 증가
            let currentTime = millis();
            if (currentTime - this.lastRubbingTime > 100) {
                this.rubbingCount++;
                this.lastRubbingTime = currentTime;
                
                if (this.rubbingCount >= requiredRubbingCount) {
                    this.isGray = false; // 회색 상태 해제
                    // 단일 구슬이므로 복원될 색상 하나를 미리 지정
                    this.color = color('#A5D8FF'); // 예시 색상 (하늘색), 원하는 색상으로 변경
                    this.isRestored = true; // 복원 완료 상태 표시
                    return true; // 복원 성공
                }
            }
        }
        return false; // 복원 실패 또는 이미 복원됨
    }

    // 단일 구슬은 드래그 모드 시에만 위치가 변함
    moveTo(x, y) {
         this.targetX = x;
         this.targetY = y;
    }

    update() {
        // 단일 구슬은 드래그 모드일 때만 마우스 위치를 따라가도록 업데이트
        if (isDraggingMode && this.isGrabbed) {
             this.x = lerp(this.x, mouseX, 0.5); // 마우스 위치로 부드럽게 이동
             this.y = lerp(this.y, mouseY, 0.5);
        } else {
            // 드래그 중이 아닐 때는 화면 중앙에 고정
            this.x = width/2;
            this.y = height/2;
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CORNER); // 배경 이미지를 (0,0) 기준으로 그리기 위해 CORNER 모드 사용
    
    // 화면 중앙에 하나의 큰 구슬 생성
    let marbleSize = min(width, height) * 0.3; // 화면 크기의 30% 크기
    singleMarble = new Marble(width/2, height/2, marbleSize); // 색상은 restore 함수에서 설정
    
    // 단일 구슬이므로 restoredMarbles 배열에 미리 추가하지 않음
    // restoredMarbles.push(singleMarble);
}

function draw() {
    // 배경 이미지 그리기 (캔버스 크기에 맞게)
    if (backgroundImage) {
      image(backgroundImage, 0, 0, width, height);
    } else {
      // 이미지가 로드되지 않았을 경우 대체 배경
      background(240); // 이전 배경색 또는 다른 색상
    }
    
    handX = mouseX; // 손 위치를 마우스 위치로 업데이트
    handY = mouseY;
    
    // 구슬 표시 및 업데이트
    if (singleMarble) {
        singleMarble.update();
        singleMarble.display();
    }
    
    // 손수건 표시 (문지르기 중일 때)
    if (isRubbing) {
        drawHandkerchief();
    }
    
    // 손 표시 (항상 표시)
    drawHand();

    // 단일 구슬이 복원되었을 때 안내 문구 표시 (필요하다면)
    if (singleMarble && singleMarble.isRestored) {
         textAlign(CENTER);
         textSize(20);
         fill(100);
         text("구슬이 복원되었습니다!", width/2, height - 30);
         
         // 복원 후 3초 뒤 hug.html로 이동 (선택 사항)
         // setTimeout(() => {
         //     window.location.href = 'hug.html';
         // }, 3000);
    }
}

// 손수건 그리는 함수 (이전 코드에서 유지)
function drawHandkerchief() {
    push();
    translate(handX, handY);
    // 마우스 움직임에 따라 손수건 회전
    let angle = atan2(mouseY - prevMouseY, mouseX - prevMouseX);
    rotate(angle);
    
    // 손수건 본체
    fill(255, 255, 255, 230);
    stroke(200, 200, 200);
    strokeWeight(2);
    rect(-40, -40, 80, 80, 10);
    
    // 손수건 장식
    fill(200, 200, 255, 150);
    noStroke();
    rect(-35, -35, 70, 70, 5);
    
    // 손수건 테두리 장식
    stroke(150, 150, 200);
    strokeWeight(1);
    noFill();
    rect(-38, -38, 76, 76, 12);
    
    pop();
}

// 손 그리는 함수 (이전 코드에서 유지)
function drawHand() {
    push();
    translate(handX, handY);
    
    // 손바닥
    fill(255, 220, 180);
    noStroke();
    ellipse(0, 0, 50, 35);
    
    // 손가락들
    let fingerAngles = [-PI/4, -PI/8, 0, PI/8, PI/4];
    let fingerLengths = [35, 40, 45, 40, 35];
    
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        // 손가락 본체
        fill(255, 220, 180);
        ellipse(0, -fingerLengths[i]/2, 15, fingerLengths[i]);
        // 손가락 끝
        fill(255, 210, 170);
        ellipse(0, -fingerLengths[i], 12, 12);
        pop();
    }
    
    // 손톱
    fill(255, 240, 230);
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        ellipse(0, -fingerLengths[i] + 2, 8, 6);
        pop();
    }
    
    pop();
}

function mousePressed() {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    // 단일 구슬이 손 위치에 있는지 확인
    if (singleMarble && singleMarble.isHandOver()) {
        // 드래그 모드와 문지르기 모드 모두 여기서 시작 가능
        singleMarble.isGrabbed = true;
        draggedMarble = singleMarble; // 단일 구슬을 드래그 대상으로 설정
        
        // 마우스가 눌렸을 때 현재 모드에 따라 분기
        if (isDraggingMode) {
            // 드래그 모드 시작
            // isDragging = true; // 단일 구슬에서는 isGrabbed로 충분할 수 있음
        } else {
            // 문지르기 모드 시작
            isRubbing = true;
        }
    }
}

function mouseReleased() {
    if (draggedMarble) {
        if (isDraggingMode) {
            // 드래그 모드에서 마우스를 놓으면 (여기서는) 문지르기 모드로 전환
            isDraggingMode = false; // 문지르기 모드로 전환
            // draggedMarble.isGrabbed = false; // 손을 놓더라도 문지르기 위해 잡힘 상태 유지
            // 단일 구슬을 화면 중앙으로 이동
             draggedMarble.moveTo(width/2, height/2); // 중앙으로 이동하도록 target 설정

        } else {
            // 문지르기 모드에서 마우스를 놓으면 문지르기 종료
            // draggedMarble.isGrabbed = false; // 문지르기 종료 시 잡힘 상태 해제
            isRubbing = false; // 문지르기 상태 해제
            // 복원이 완료된 경우 isRestored 상태는 유지됨
            // isDraggingMode = true; // 문지르기 종료 후 다시 드래그 모드로 전환
        }
        // draggedMarble = null; // 단일 구슬이므로 null로 설정할 필요 없음
    }
     // isDragging = false; // 단일 구슬에서는 isGrabbed로 충분
     // isRubbing = false; // mouseReleased 내에서 이미 처리
     isDraggingMode = !isDraggingMode; // 마우스를 뗄 때마다 모드 전환
}

function mouseDragged() {
    if (draggedMarble && draggedMarble.isGrabbed) { // 잡힌 상태일 때만 드래그/문지르기 실행
        if (isDraggingMode) {
            // 드래그 모드일 때는 구슬을 마우스 위치로 이동
            // draggedMarble.moveTo(mouseX, mouseY); // update 함수에서 처리
        } else if (draggedMarble.isGray) { // 회색 구슬일 때만 문지르기 가능
            // 문지르기 모드일 때는 문지르기 동작 수행
            let moveDistance = dist(mouseX, mouseY, prevMouseX, prevMouseY);
            if (moveDistance > rubbingThreshold) {
                draggedMarble.restore(); // 문지르기 카운트 증가 및 복원 시도
                prevMouseX = mouseX;
                prevMouseY = mouseY;
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windoㄴwHeight);
    // 화면 크기 변경 시 단일 구슬 위치 및 크기 업데이트
    if (singleMarble) {
        singleMarble.size = min(width, height) * 0.3; // 크기 다시 계산
        singleMarble.x = width/2; // 중앙으로 이동
        singleMarble.y = height/2; // 중앙으로 이동
        singleMarble.targetX = width/2; // target 위치도 업데이트
        singleMarble.targetY = height/2;
    }
}

// keyPressed 함수는 여러 구슬 정렬 기능이므로 제거합니다.
