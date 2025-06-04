// 전역 변수들
let marbles = []; // 구슬 객체들을 저장할 배열
let isDragging = false; // 드래그 상태
let draggedMarble = null; // 현재 드래그 중인 구슬
let restoredMarbles = []; // 복원된 구슬들을 저장할 배열
let handX = 400; // 손의 x 위치
let handY = 500; // 손의 y 위치
let rubbingProgress = 0; // 문지르기 진행도
let isRubbing = false; // 문지르기 중인지 여부
let prevMouseX = 0; // 이전 마우스 X 위치
let prevMouseY = 0; // 이전 마우스 Y 위치
let rubbingThreshold = 5; // 문지르기로 인정할 최소 이동 거리
let requiredRubbingCount = 5; // 필요한 문지르기 횟수
let isDraggingMode = true; // 드래그 모드인지 문지르기 모드인지 구분
let originalPositions = []; // 구슬들의 원래 위치 저장
let colorOrder = []; // 색상 순서 저장

// 구슬 클래스
class Marble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isGray = true;
        this.isRestored = false;
        this.size = 120;
        this.targetX = x;
        this.targetY = y;
        this.color = null;
        this.isGrabbed = false;
        this.rubbingCount = 0; // 문지른 횟수
        this.lastRubbingTime = 0; // 마지막 문지른 시간
    }

    display() {
        noStroke();
        push();
        translate(this.x, this.y);
        
        // 구슬 그라데이션 효과
        let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
        if (this.isGray) {
            gradient.addColorStop(0, 'rgba(180, 180, 180, 1)');
            gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
            gradient.addColorStop(1, 'rgba(120, 120, 120, 1)');
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
        
        // 하이라이트 효과
        fill(255, 255, 255, 50);
        ellipse(-this.size/6, -this.size/6, this.size/3);
        
        // 문지르기 진행도 표시
        if (this.isGrabbed && this.isGray) {
            // 진행도 바 배경
            fill(200, 200, 200, 100);
            rect(-this.size/2, -this.size/2 - 20, this.size, 10, 5);
            
            // 진행도 바
            let progressWidth = (this.rubbingCount / requiredRubbingCount) * this.size;
            fill(100, 200, 255, 200);
            rect(-this.size/2, -this.size/2 - 20, progressWidth, 10, 5);
            
            // 진행도 텍스트
            fill(0);
            textSize(14);
            textAlign(CENTER);
            text(`${this.rubbingCount}/${requiredRubbingCount}`, 0, -this.size/2 - 25);
        }
        
        pop();
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.size/2;
    }

    isHandOver() {
        return dist(handX, handY, this.x, this.y) < this.size/2;
    }

    restore() {
        if (this.isGray) {
            // 최소 100ms 간격으로 문지르기 카운트 증가
            let currentTime = millis();
            if (currentTime - this.lastRubbingTime > 100) {
                this.rubbingCount++;
                this.lastRubbingTime = currentTime;
                
                if (this.rubbingCount >= requiredRubbingCount) {
                    this.isGray = false;
                    this.color = color(colorOrder[restoredMarbles.length]);
                    return true;
                }
            }
        }
        return false;
    }

    moveTo(x, y) {
        if (isDraggingMode) {
            // 드래그 모드일 때는 구슬이 움직일 수 있음
            this.targetX = x;
            this.targetY = y;
        } else {
            // 문지르기 모드일 때는 구슬이 고정됨
            this.targetX = this.x;
            this.targetY = this.y;
        }
    }

    update() {
        if (isDraggingMode) {
            // 드래그 모드일 때는 부드럽게 이동
            this.x = lerp(this.x, this.targetX, 0.1);
            this.y = lerp(this.y, this.targetY, 0.1);
        } else {
            // 문지르기 모드일 때는 고정
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }
}

function setup() {
    createCanvas(800, 600);
    
    // 색상 순서 랜덤 생성 (각 색상 3개씩)
    let colors = [
        '#A5D8FF', '#A5D8FF', '#A5D8FF',  // 하늘색 3개
        '#FFF5A5', '#FFF5A5', '#FFF5A5',  // 노란색 3개
        '#FFB3B3', '#FFB3B3', '#FFB3B3'   // 빨간색 3개
    ];
    // Fisher-Yates 셔플 알고리즘으로 색상 순서 섞기
    for (let i = colors.length - 1; i > 0; i--) {
        let j = Math.floor(random(i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    colorOrder = colors;
    
    // 구슬 생성 (9개)
    for (let i = 0; i < 9; i++) {
        let x = random(100, 200);
        let y = random(100, 500);
        let marble = new Marble(x, y);
        originalPositions.push({x: x, y: y}); // 원래 위치 저장
        marbles.push(marble);
    }
}

function draw() {
    background(240);
    
    // 캐릭터 그리기
    drawCharacter();
    
    handX = mouseX;
    handY = mouseY;
    
    // 구슬들 표시
    for (let marble of marbles) {
        marble.update();
        marble.display();
    }
    
    for (let marble of restoredMarbles) {
        marble.update();
        marble.display();
    }
    
    // 손수건 표시
    if (isRubbing) {
        drawHandkerchief();
    }
    
    drawHand();
}

function drawCharacter() {
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
}

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
    
    for (let marble of marbles) {
        if (marble.isHandOver()) {
            if (isDraggingMode) {
                // 드래그 모드일 때
                marble.isGrabbed = true;
                draggedMarble = marble;
                isDragging = true;
            } else {
                // 문지르기 모드일 때
                marble.isGrabbed = true;
                draggedMarble = marble;
                isRubbing = true;
            }
            break;
        }
    }
}

function mouseReleased() {
    if (draggedMarble) {
        if (isDraggingMode) {
            // 드래그 모드에서 마우스를 놓으면 문지르기 모드로 전환
            isDraggingMode = false;
            draggedMarble.isGrabbed = false;
            // 구슬을 화면 중앙으로 이동
            draggedMarble.moveTo(width/2, height/2);
        } else {
            // 문지르기 모드에서 마우스를 놓으면 초기화
            draggedMarble.isGrabbed = false;
            if (!draggedMarble.isGray) {
                draggedMarble.moveTo(draggedMarble.x, draggedMarble.y);
                restoredMarbles.push(draggedMarble);
                marbles = marbles.filter(m => m !== draggedMarble);
            }
            isDraggingMode = true; // 다시 드래그 모드로 전환
        }
        draggedMarble = null;
    }
    isDragging = false;
    isRubbing = false;
}

function mouseDragged() {
    if (draggedMarble) {
        if (isDraggingMode) {
            // 드래그 모드일 때는 구슬을 마우스 위치로 이동
            draggedMarble.moveTo(mouseX, mouseY);
        } else if (draggedMarble.isGray) {
            // 문지르기 모드일 때는 문지르기 동작 수행
            let moveDistance = dist(mouseX, mouseY, prevMouseX, prevMouseY);
            if (moveDistance > rubbingThreshold) {
                draggedMarble.restore();
                prevMouseX = mouseX;
                prevMouseY = mouseY;
            }
        }
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        // 색상별로 구슬 분류
        let blueMarbles = [];
        let yellowMarbles = [];
        let redMarbles = [];
        
        for (let marble of restoredMarbles) {
            let c = marble.color;
            let r = red(c);
            let g = green(c);
            let b = blue(c);
            
            // 색상 비교를 더 정확하게 수정
            if (r === 165 && g === 216 && b === 255) { // 하늘색 (#A5D8FF)
                blueMarbles.push(marble);
            } else if (r === 255 && g === 245 && b === 165) { // 노란색 (#FFF5A5)
                yellowMarbles.push(marble);
            } else if (r === 255 && g === 179 && b === 179) { // 빨간색 (#FFB3B3)
                redMarbles.push(marble);
            }
        }
        
        // 각 색상별로 3열 정렬
        let startX = width - 300; // 오른쪽에서 시작
        let startY = 100; // 위에서 시작
        
        // 하늘색 구슬 배치
        for (let i = 0; i < blueMarbles.length; i++) {
            blueMarbles[i].moveTo(startX, startY + (i * 50));
        }
        
        // 노란색 구슬 배치
        for (let i = 0; i < yellowMarbles.length; i++) {
            yellowMarbles[i].moveTo(startX + 100, startY + (i * 50));
        }
        
        // 빨간색 구슬 배치
        for (let i = 0; i < redMarbles.length; i++) {
            redMarbles[i].moveTo(startX + 200, startY + (i * 50));
        }
        
        // 회색 구슬들을 원래 위치로 정리
        for (let i = 0; i < marbles.length; i++) {
            marbles[i].moveTo(originalPositions[i].x, originalPositions[i].y);
        }
    }
}
