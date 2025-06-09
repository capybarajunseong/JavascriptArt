let backgroundImage1;
let backgroundImage2;
let currentImage;
let imageLoaded1 = false;
let imageLoaded2 = false;
let startTime;
let fadeAlpha = 255;
let transitionSound;
let soundLoaded = false;
let hasUserInteracted = false;
let hasPlayedSound = false;
let soundPlayScheduledTime = 0;
const SOUND_INITIAL_DELAY_MS = 1000; 

function preload() {
  // 이미지 로드
  backgroundImage1 = loadImage('../image/beforeClean.png',
    () => {
      console.log('첫 번째 이미지 로드 성공');
      imageLoaded1 = true;
    },
    () => {
      console.log('첫 번째 이미지 로드 실패');
    }
  );
  
  backgroundImage2 = loadImage('../image/afterClean.png',
    () => {
      console.log('두 번째 이미지 로드 성공');
      imageLoaded2 = true;
    },
    () => {
      console.log('두 번째 이미지 로드 실패');
    }
  );
  
  // 소리 로드
  try {
    transitionSound = loadSound('../sound/transition.mp3',
      () => {
        console.log('소리 로드 성공');
        soundLoaded = true;
        // 소리 설정
        transitionSound.setVolume(1.0);
      },
      (err) => {
        console.error('소리 로드 실패:', err);
      }
    );
  } catch (error) {
    console.error('소리 로드 중 오류 발생:', error);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentImage = backgroundImage1;
  
  // 사용자 상호작용을 기다림
  userStartAudio();
}

function mousePressed() {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    startTime = millis();
    soundPlayScheduledTime = millis() + SOUND_INITIAL_DELAY_MS;
  }
}

function draw() {
  // 이미지 로딩 중일 때 로딩 메시지 표시
  if (!imageLoaded1 || !imageLoaded2) {
    background(210, 195, 160);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text('이미지 로딩 중...', width/2, height/2);
    return;
  }

  // 사용자 상호작용이 없으면 첫 번째 이미지만 표시
  if (!hasUserInteracted) {
    if (currentImage) {
      image(currentImage, 0, 0, width, height);
    } else {
      background(210, 195, 160);
    }
    return;
  }

  // 소리 재생 (일정 시간 지연 후)
  if (hasUserInteracted && !hasPlayedSound && transitionSound && soundLoaded && millis() >= soundPlayScheduledTime) {
    try {
      transitionSound.play();
      hasPlayedSound = true;
      console.log('전환 소리 재생 (지연 후)');
    } catch (error) {
      console.error('전환 소리 재생 중 오류 발생:', error);
    }
  }

  // 0.5초 후에 이미지 전환
  if (millis() - startTime > 800) {
    if (currentImage === backgroundImage1) {
      // 페이드 아웃 효과
      fadeAlpha = max(0, fadeAlpha - 5);
      if (fadeAlpha === 0) {
        currentImage = backgroundImage2;
        fadeAlpha = 0;
      }
    } else {
      // 페이드 인 효과
      fadeAlpha = min(255, fadeAlpha + 5);
    }
  }

  // 현재 이미지 그리기
  if (currentImage) {
    tint(255, fadeAlpha);
    image(currentImage, 0, 0, width, height);
  } else {
    background(210, 195, 160);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
