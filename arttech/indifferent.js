let character;
let balls = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    character = new IndifferentCharacter(width / 2, height - 50);

    // Create balls (red, blue, yellow)
    balls.push(new ThoughtBubble(width / 4, 50, 30, color(255, 0, 0))); // Red
    balls.push(new ThoughtBubble(width / 2, 50, 30, color(0, 0, 255))); // Blue
    balls.push(new ThoughtBubble(3 * width / 4, 50, 30, color(255, 255, 0))); // Yellow
}

function draw() {
    background(220);

    character.display();

    for (let i = 0; i < balls.length; i++) {
        balls[i].move();
        balls[i].display();
    }
}

class IndifferentCharacter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        // Table
        stroke(0);
        strokeWeight(2);
        line(this.x - 100, this.y, this.x + 100, this.y); // Table top
        line(this.x - 80, this.y, this.x - 80, this.y + 50); // Left leg
        line(this.x + 80, this.y, this.x + 80, this.y + 50); // Right leg

        // Body (simple shape behind the table)
        noStroke();
        fill(200);
        rect(this.x - 30, this.y - 60, 60, 60); // Upper body placeholder

        // Head (more rectangular with rounded corners)
        fill(255, 220, 180);
        rect(this.x - 25, this.y - 110, 50, 60, 10); // Rounded rectangle for head

        // Arms and hands (턱을 괴고 있는 모습, based on drawing)
        stroke(0);
        strokeWeight(2);
        // Right arm and hand
        line(this.x + 10, this.y - 60, this.x + 40, this.y - 30);
        line(this.x + 40, this.y - 30, this.x + 20, this.y - 100); // Hand on chin area
        // Left arm and hand
        line(this.x - 10, this.y - 60, this.x - 40, this.y - 30);
        line(this.x - 40, this.y - 30, this.x - 20, this.y - 100); // Hand on chin area

        // Eyes (덜 뜬 눈, straight lines)
        stroke(0);
        strokeWeight(3);
        line(this.x - 15, this.y - 100, this.x - 5, this.y - 100); // Left eye
        line(this.x + 5, this.y - 100, this.x + 15, this.y - 100); // Right eye

        // Mouth (무표정, straight line)
        line(this.x - 10, this.y - 85, this.x + 10, this.y - 85);
    }
}

class ThoughtBubble {
    constructor(x, y, r, c) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
        this.speed = random(0.5, 1.5); // Slower speed to look like thought bubbles
    }

    move() {
        this.y += this.speed;
        // Reset if it goes off screen
        if (this.y > height + this.r) {
            this.y = -this.r;
            this.x = random(width);
            this.speed = random(0.5, 1.5);
        }
    }

    display() {
        fill(this.c);
        stroke(0);
        strokeWeight(2);
        // Draw a somewhat irregular ellipse shape like in the drawing
        beginShape();
        let xoff = 0;
        for (let a = 0; a < TWO_PI; a += radians(10)) {
            let offset = map(noise(xoff, this.y), 0, 1, -this.r * 0.3, this.r * 0.3);
            let r = this.r + offset;
            let x = this.x + r * cos(a);
            let y = this.y + r * sin(a);
            vertex(x, y);
            xoff += 0.1;
        }
        endShape(CLOSE);
    }
} 