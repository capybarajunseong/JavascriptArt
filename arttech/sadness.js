let sadnessImage;

function preload() {
  sadnessImage = loadImage('../image/sadness.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cursor(HAND);
}

function draw() {
  if (sadnessImage) {
    image(sadnessImage, 0, 0, width, height);
  }

  // 닫기 버튼 그리기
  let buttonSize = 50;
  let margin = 20;
  let buttonX = width - buttonSize / 2 - margin - 50;
  let buttonY = margin + buttonSize / 2;

  // 빨간색 원
  noStroke();
  fill('#FFB3B3');
  ellipse(buttonX, buttonY, buttonSize, buttonSize);

  // 흰색 X
  stroke(255);
  strokeWeight(5);
  let xOffset = buttonSize * 0.2;
  line(buttonX - xOffset, buttonY - xOffset, buttonX + xOffset, buttonY + xOffset);
  line(buttonX + xOffset, buttonY - xOffset, buttonX - xOffset, buttonY + xOffset);
}

function mousePressed() {
  let buttonSize = 50;
  let margin = 20;
  let buttonX = width - buttonSize / 2 - margin - 50;
  let buttonY = margin + buttonSize / 2;

  let d = dist(mouseX, mouseY, buttonX, buttonY);
  if (d < buttonSize / 2) {
    window.location.href = 'second.html';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}