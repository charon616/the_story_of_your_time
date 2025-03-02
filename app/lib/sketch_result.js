import p5 from "p5";
import { Scribble } from "./scribble";
import { BMWalker } from "./bmwalker";
import { RectBox, Ball, Boundary } from "./matterobj";
import { Engine, Bodies, Composite, Vector, Body, Constraint, Mouse, MouseConstraint } from "matter-js";

export const sketch = (p, data, distance) => {
  // draw stick figure
  class Human {
    constructor() {
      // set the parameters of the walker
      this.bmw = new BMWalker();
      this.bmw.setSpeed(1.0);
      const bodyStructure = 16.0;
      const weight = 1.0;
      const nervousness = 0.0;
      const happiness = -5;
      this.bmw.setWalkerParam(bodyStructure, weight, nervousness, happiness);
    }
  
    show(phaze) {
      // if the phaze is close to 1, the walker will stop
      const azimuth = Math.PI;
      const angularVelocity = 0;
      const elevation = Math.PI / 6;
      const roll = p.map(phaze, 0, 1, 0, Math.PI / 2);
      this.bmw.setSpeed(p.map(phaze, 0, 1, 1, 0));
      this.bmw.setCameraParam(azimuth, angularVelocity, elevation, roll);

      const walkerHeight = humanSize;
      const markers = this.bmw.getMarkers(walkerHeight); // get position of the markers
      const lineMarkers = this.bmw.getLineMarkers(walkerHeight); // get position of the markers

      p.push();

      // draw the lines
      p.stroke(0);
      p.strokeWeight(5);
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
          sc.scribbleEllipse(m.x, m.y-10, 72, 72);
        }
      });

      p.pop();
    }
  }

  let cam;
  let camz = 0; // camera z position
  let font_heading, font_body;

  let humanSize;
  let human;

  let matterParts = [];
  let isSplit = false;
  let engine;
  let ground;

  let sc = new Scribble(p);

  let offsetZ = 0; // counter for camera movement
  let scrollAllowed = false; // flag for user to scroll

  p.preload = () => {
    font_heading = p.loadFont('LondrinaSolid-Black.ttf'); // preload the font
    font_body = p.loadFont('LondrinaSolid-Light.ttf'); // Preload the font
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth-48, p.windowHeight*2/3, p.WEBGL); // create a canvas
    p.frameRate(10); // reduce the frame rate to 10

    cam = p.createCamera();
    p.textWrap(p.WORD);

    humanSize = 300;
    human = new Human();

    engine = Engine.create();
    ground = new Boundary(0, 100, p.width, 20, engine);

    // settings for the scribble
    sc.roughness = 1.5;
    sc.bowing = 2.0;
    sc.maxOffset = 1.0;

    p.strokeWeight(4);
    p.background(218, 219, 205);
  };

  p.draw = () => {
    p.push();
    p.translate(0, -100, 0);
    p.background(218, 219, 205);

    if(offsetZ < -distance) {
      // if the camera reaches the end of the timeline, the user can scroll
      scrollAllowed = true;
      cam.setPosition(0, -200, camz);
    } else {
      // move the camera along the timeline
      offsetZ -= p.frameCount*1; // as the frameCount increases, the offsetZ decreases and the camera moves
      cam.setPosition(0, -200, 1000 + offsetZ);
      camz = 1000 + offsetZ;
    }
    p.orbitControl();

    // draw street side lines
    p.strokeWeight(10);
    p.stroke(255,99,71);
    p.line(180, 0, 1000, 180, 0, -4000);
    p.line(-180, 0, 1000, -180, 0, -4000);

    // draw street ground
    p.push();
    p.rotateX(p.PI/2);
    p.strokeWeight(2);
    let xCoords = [
      -360 / 2,
      360 / 2,
      360 / 2,
      -360 / 2,
    ];
    let yCoords = [
      -distance - 300,
      -distance - 300,
      300,
      300,
    ];
    sc.scribbleFilling(xCoords, yCoords, 22, 315);
    p.pop();
  
    // draw event as cards
    let w = 300; // card width
    let items = data; // event data
    p.stroke(255,99,71);
    p.strokeWeight(4);
    for(let i=0; i<items.length; i++) {
      p.line(-500, 0,  -items[i].pos, 500, 0,  -items[i].pos);
      // show cards alternatively on the left and right side of the street
      if(i%2 == 0) {
        drawCard(items[i].year, items[i].event, -500, -200, -items[i].pos, w, offsetZ);
      } else {
        drawCard(items[i].year, items[i].event, 500 - w+50, -200, -items[i].pos, w, offsetZ);
      }
    }

    // draw the stick figure
    p.push();
    p.translate(0, -100, offsetZ);
    let phaze = 0;
    if(offsetZ < -distance + 250){
      phaze = p.map(offsetZ, -distance + 250, -distance, 0, 1);
    }
    human.show(phaze);

    // if the camera reaches the end of the timeline, the user can scroll and draw the arrow for scrolling
    if (phaze >= 1) {
      p.fill(0);
      p.noStroke();
      p.textSize(50);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont(font_body);
      p.text("SCROLL", 0, -250);
      
      p.noFill();
      p.stroke(0);
      p.strokeWeight(7);
      p.translate(0, 80, 0);
      let arrowSize = 80;
      let arrowX = 0;
      let arrowY = -humanSize / 2 - 50;

      p.line(arrowX, arrowY, arrowX, arrowY - arrowSize); // draw center line
      p.line(arrowX, arrowY, arrowX - arrowSize / 2, arrowY - arrowSize + arrowSize / 2); // draw head
      p.line(arrowX, arrowY, arrowX + arrowSize / 2, arrowY - arrowSize + arrowSize / 2); // draw head
    }
    p.pop();
    p.pop();
  };

  p.mouseWheel= (event) => {
    // get vertical scroll amount
    if(scrollAllowed) {
      let scrollAmount = event.deltaY;
      camz += scrollAmount;
    }
  }

  p.windowResized= () => {
    p.resizeCanvas(p.windowWidth-48, p.windowHeight*2/3);
  }

  // function to draw a timeline event card
  function drawCard(title, body, x, y, z, w=300, offset=0) {
    p.push();
    p.translate(x, y, z);
  
    // calculate the number of lines and the height of the card
    p.textSize(28);
    p.textFont(font_body);
    let lineHeight = 32; // height of a line
    let maxCharsPerLine = Math.floor((w - 28) / 14); // maximum number of characters per line
    let lines = Math.ceil(body.length / maxCharsPerLine); // number of lines
    let rectHeight = 100 + lines * lineHeight; // height of the card
  
    // draw background
    p.strokeWeight(2);
    p.stroke(0);
    if(offset > z){
      p.fill(218, 219, 205);
    } else {
      p.fill(255,99,71);
    }
    p.rect(-20, -50, 300, rectHeight, 16);
  
    // draw text
    p.translate(0, 0, 0.1);
    p.fill(0);
    p.textSize(50);
    p.textAlign(p.TOP, p.LEFT);
    p.textFont(font_heading);
    p.text(title, 0, 0); // year
    p.textFont(font_body);
    p.textSize(24);
    p.textAlign(p.TOP, p.LEFT);
    p.text(body, 0, 40, w-24); // description
    p.pop();
  }
};
