let backgroundImage;

function preload() {
  backgroundImage = loadImage('../image/smoke.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
