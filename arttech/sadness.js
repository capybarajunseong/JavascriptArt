let sadnessImage;

function preload() {
  sadnessImage = loadImage('../image/sadness.png'); // sadness.png 이미지 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 캔버스를 창 크기에 맞게 생성
}

function draw() {
  if (sadnessImage) {
    image(sadnessImage, 0, 0, width, height); // 이미지를 배경으로 표시
  }
}
