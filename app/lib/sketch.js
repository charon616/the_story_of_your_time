import p5 from "p5";
import { Scribble } from "./tab4";
import { BMWalker } from "./bmwalker";

export const sketch = (p) => {
  let humanSize;
  let circleSize;
  let human;

  let sc = new Scribble(p);
  let floorY = 0;

  let ox = 0;
  let prevOx = 0;

  // -1 : 左へ進行
  //  0 : 静止
  //  1 : 右へ進行
  let walkerStatus = 1;

  p.setup = () => {
    p.createCanvas(2800,100); // 横長のキャンバスを作成
    p.frameRate(10);

    humanSize = 60;
    circleSize = p.width * 0.0125;

    human = new Human(0);

    sc.roughness = 0.5;
    sc.bowing = 2.0;
    sc.maxOffset = 1.0;

    const tmpVal = human.getValue();
    floorY = tmpVal[11].y;

    p.strokeWeight(2);
    p.background(255,99,71);
  };

  p.draw = () => {
    p.background(255,99,71);
    p.push();
    p.translate(p.width / 2, p.height / 2 + 20);

    p.push();
    

    // let translateX = p.constrain(ox - p.width / 2, -p.width/2, p.width/2);
    let translateX = ox - p.width / 2;
    console.log(translateX);
    if(translateX >= (p.width/2 - 100)) {
      // p.rotate(p.PI);
    } else {
      ox = p.frameCount*10;
    }
    
    p.translate(translateX, -12);
    human.draw();
    p.pop();
    p.pop();

    prevOx = ox;
  };

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
  
    draw() {
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
  
      lineMarkers.forEach((m) => {
        let delta;
        if (m[0].i == 0) {
          delta = 95 / 2;
        } else {
          delta = 0;
        }
        sc.scribbleLine(m[0].x, m[0].y + delta, m[1].x, m[1].y);
      });
  
      markers.forEach((m) => {
        if (m.desc == "Head") {
          p.fill(218, 219, 205);
          p.stroke(218, 219, 205);
          sc.scribbleEllipse(m.x, m.y, 16, 16);
  
          // switch (walkerStatus) {
          //   case -1:
          //     sc.scribbleEllipse(m.x - 20, m.y - 15, 15, 15);
          //     sc.scribbleLine(m.x - 40, m.y + 20, m.x - 10, m.y + 20);
          //     break;
          //   case 0:
          //     sc.scribbleEllipse(m.x - 20, m.y - 15, 15, 15);
          //     sc.scribbleEllipse(m.x + 20, m.y - 15, 15, 15);
          //     sc.scribbleLine(m.x - 20, m.y + 20, m.x + 20, m.y + 20);
          //     break;
          //   case 1:
          //     sc.scribbleEllipse(m.x + 20, m.y - 15, 15, 15);
          //     sc.scribbleLine(m.x + 10, m.y + 20, m.x + 40, m.y + 20);
          //     break;
          // }
        }
      });
      p.pop();
    }
  
    getValue() {
      const walkerHeight = humanSize;
      const markers = this.bmw.getMarkers(walkerHeight);
  
      return markers;
    }
  }
};