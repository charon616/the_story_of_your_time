import { Scribble } from "./scribble";
import { BMWalker } from "./bmwalker";

export const sketch = (p) => {
  class Human {
    constructor(tmpX) {
      this.bmw = new BMWalker();
      this.x = tmpX;
  
      this.bmw.setSpeed(1.0);
      const bodyStructure = 1.0;
      const weight = 1.0;
      const nervousness = 0.0;
      const happiness = 2.0;
      this.bmw.setWalkerParam(bodyStructure, weight, nervousness, happiness);
    }
  
    show() {
      switch (walkerStatus) {
        case -1:
          this.bmw.setCameraParam(-1.5, 0, 0, 0);
          break;
        case 0:
          this.bmw.setCameraParam(0, 0, 0, 0);
          break;
        case 1:
          this.bmw.setCameraParam(1.5, 0, 0, 0);
          break;
      }
  
      const walkerHeight = humanSize;
      const markers = this.bmw.getMarkers(walkerHeight);
  
      const lineMarkers = this.bmw.getLineMarkers(walkerHeight);
  
      p.push();
      p.translate(this.x, 0);
  
      // draw the lines
      lineMarkers.forEach((m) => {
        let delta;
        if (m[0].i == 0) {
          delta = 95 / 2;
        } else {
          delta = 0;
        }
        sc.scribbleLine(m[0].x, m[0].y + delta, m[1].x, m[1].y);
      });
  
      // draw head
      p.fill(255);
      p.noStroke();
      markers.forEach((m) => {
        if (m.desc == "Head") {
          sc.scribbleEllipse(m.x, m.y, 20, 20);
        }
      });
      p.pop();
    }
  }

  let humanSize;
  let human;

  let sc = new Scribble(p);

  let ox = 0;
  let prevOx = 0;

  // -1 : go left
  //  0 : stop
  //  1 : go right
  let walkerStatus = 1;

  let sign = 1; // 1 or -1
  let alpha = 255;
  let direction = 1; // 1: right, -1: left

  p.setup = () => {
    p.createCanvas(p.windowWidth-96, 160); // make horizontal canvas
    p.frameRate(10);

    humanSize = 120;
    human = new Human(0);

    sc.roughness = 1.5;
    sc.bowing = 2.0;
    sc.maxOffset = 1.0;

    p.strokeWeight(2);
  };

  p.draw = () => {
    p.background(218, 219, 205, alpha);
    p.push();
    p.translate(p.width / 2, p.height / 2 + 20);

    p.push();
    ox += 10 * sign;

    let translateX = p.map(ox, 0, p.width, -p.width/2, p.width/2);
    if(translateX >= p.width/2 && direction === 1) {
      sign *= -1;
      walkerStatus *= -1;
      alpha = 255;
      direction = -1;
    } else if(translateX <= -p.width/2 && direction === -1) {
      sign *= -1;
      walkerStatus *= -1;
      alpha = 255;
      direction = 1;
    }

    p.translate(translateX, 0);
    human.show();
    p.pop();
    p.pop();

    alpha -= 5;
    if(alpha < 0) alpha = 0;

    prevOx = ox;
  };

  p.windowResized= () => {
    p.resizeCanvas(p.windowWidth-96, 160);
  }
};