let sadnessImage;
let algoboniImage;
let currentImage;

function preload() {
  sadnessImage = loadImage('../image/sadness.jpg');
  algoboniImage = loadImage('../image/algoboni.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentImage = sadnessImage; // Set initial background

  // Change background after 2 seconds
  setTimeout(() => {
    currentImage = algoboniImage;
  }, 2000); // 2000 milliseconds = 2 seconds
}

function draw() {
  if (currentImage) {
    image(currentImage, 0, 0, width, height);
  }
}
