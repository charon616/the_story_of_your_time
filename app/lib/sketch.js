import p5 from "p5";
import { Scribble } from "./tab4";
import { BMWalker } from "./bmwalker";
import { RectBox, Ball, Boundary } from "./matterobj";
import { Engine, Bodies, Composite, Vector, Body, Constraint, Mouse, MouseConstraint } from "matter-js";

export const sketch = (p, data, distance) => {
  class Human {
    constructor(tmpX) {
      this.bmw = new BMWalker();
      // this.x = tmpX;
  
      this.bmw.setSpeed(1.0);
      const bodyStructure = 16.0;
      const weight = 1.0;
      const nervousness = 0.0;
      const happiness = -5;
      this.bmw.setWalkerParam(bodyStructure, weight, nervousness, happiness);
    }
  
    draw(phaze) {
      // Set walker parameters.
      const azimuth = Math.PI;
      const angularVelocity = 0;
      const elevation = Math.PI / 6;
      const roll = p.map(phaze, 0, 1, 0, Math.PI / 2);
      this.bmw.setSpeed(p.map(phaze, 0, 1, 1, 0));
      this.bmw.setCameraParam(azimuth, angularVelocity, elevation, roll);

      const walkerHeight = humanSize;
      const markers = this.bmw.getMarkers(walkerHeight);

      const lineMarkers = this.bmw.getLineMarkers(walkerHeight);

      p.push();
      // translate(this.x, 0);
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

      p.fill(255);
      p.noStroke();
  
      markers.forEach((m) => {
        if (m.desc == "Head") {
          sc.scribbleEllipse(m.x, m.y-10, 72, 72);
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

  let cam;
  let camz = 0;
  let font_heading, font_body;

  let humanSize;
  let circleSize;
  let human;

  let matterParts = [];
  let isSplit = false;
  let engine;
  let ground;

  let sc = new Scribble(p);

  // -1 : 左へ進行
  //  0 : 静止
  //  1 : 右へ進行
  let walkerStatus = 0;

  let offsetZ = 0;
  let scrollAllowed = false;

  p.preload = () => {
    font_heading = p.loadFont('LondrinaSolid-Black.ttf'); // Preload the font. For 3D to work, we need a font file (not a linked font).
    font_body = p.loadFont('LondrinaSolid-Light.ttf'); // Preload the font. For 3D to work, we need a font file (not a linked font). 
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth-48, p.windowHeight*2/3, p.WEBGL);
    p.frameRate(10);

    cam = p.createCamera();
    p.textWrap(p.WORD);

    humanSize = 300;
    circleSize = p.width * 0.0125;

    human = new Human(0);

    engine = Engine.create();
    ground = new Boundary(0, 100, p.width, 20, engine);

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
      scrollAllowed = true;
      cam.setPosition(0, -200, camz);
    } else {
      offsetZ -= p.frameCount*1;
      cam.setPosition(0, -200, 1000 + offsetZ);
      camz = 1000 + offsetZ;
    }
    p.orbitControl();

    p.strokeWeight(10);
    p.stroke(255,99,71);
    p.line(180, 0, 1000, 180, 0, -4000);
    p.line(-180, 0, 1000, -180, 0, -4000);
    sc.scribbleLine(180, 0, 180, 0);
    p.fill(255,99,71);
    // p.plane(360, 1000);

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
  

    let w = 300;

    let items = data;

    p.stroke(255,99,71);
    p.strokeWeight(4);
    for(let i=0; i<items.length; i++) {
      p.line(-500, 0,  -items[i].pos, 500, 0,  -items[i].pos);
      if(i%2 == 0) {
        drawCard(items[i].year, items[i].event, -500, -200, -items[i].pos, w, offsetZ);
      } else {
        drawCard(items[i].year, items[i].event, 500 - w+50, -200, -items[i].pos, w, offsetZ);
      }
    }

    p.push();
    p.translate(0, -100, offsetZ);
    let phaze = 0;
    if(offsetZ < -distance + 250){
      phaze = p.map(offsetZ, -distance + 250, -distance, 0, 1);
    }
    human.draw(phaze);
    p.pop();
    p.pop();
    p.pop();
  };

  p.mouseWheel= (event) => {
    // 垂直方向のスクロール量を取得
    if(scrollAllowed) {
      let scrollAmount = event.deltaY;
      camz += scrollAmount;
    }
  }

  function drawCard(title, body, x, y, z, w=300, offset=0) {
    p.push();
    p.translate(x, y, z);
  
    // テキストの行数を計算
    p.textSize(28);
    p.textFont(font_body);
    let lineHeight = 32; // 1行あたりの高さ
    let maxCharsPerLine = Math.floor((w - 28) / 14); // 1行あたりの最大文字数（おおよその計算）
    // let maxCharsPerLine = 26; // 1行あたりの最大文字数（おおよその計算）
    let lines = Math.ceil(body.length / maxCharsPerLine); // 行数を計算
    let rectHeight = 100 + lines * lineHeight; // タイトル部分の高さ + 行数に応じた高さ
  
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