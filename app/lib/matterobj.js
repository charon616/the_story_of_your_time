// Class definition for matter.js objects to draw stick figure
import { Bodies, Composite, Vector, Body } from "matter-js";

export class RectBox {
  constructor(x, y, w, h, angle, _engine, _p, _sc) {
    this.p = _p; // p5 instance
    this.sc = _sc; // scribble instance

    let options = { restitution: 0, frictionAir: 0.0 };
    this.body = Bodies.rectangle(x, y, w, h, { angle: angle, ...options });

    // set initial velocity
    Body.setVelocity(this.body, Vector.create(this.p.random(-5, 5), this.p.random(-5, 5)));
    Body.setAngularVelocity(this.body, this.p.random(-0.1, 0.1));
    Composite.add(_engine.world, this.body);

    this.w = w;
    this.h = h;
    this.angle = angle;
  }

  removeBody() {
    Composite.remove(_engine.world, this.body);
  }

  limit() {
    if(this.body.position.y > height + 100) {
      this.removeBody();
    }
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;

    this.p.rectMode(this.p.CENTER);
    // fill(0);
    this.p.stroke(0);

    this.p.push();
    this.p.translate(position.x, position.y);
    this.p.rotate(angle);
    this.sc.scribbleLine(-this.w, this.h, this.w, this.h);
    
    this.p.pop();
  }
}

export class Ball {
  constructor(x, y, size, _engine, _p, _sc) {
    this.p = _p; // p5 instance
    this.sc = _sc; // scribble instance

    this.w = size;
    this.body = Bodies.circle(x, y, this.w);
    Composite.add(_engine.world, this.body);
  }

  removeBody() {
    Composite.remove(_engine.world, this.body);
  }

  limit() {
    if(this.body.position.y > height + 100) {
      this.removeBody();
    }
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;
    
    this.p.push();
    this.p.translate(position.x, position.y);
    this.p.rotate(angle);
    this.sc.scribbleEllipse(0, 0, 72, 72);
    this.p.pop();
  }
}

export class Boundary {
  constructor(x, y, w, h, _engine, _p) {
    this.p = _p; // p5 instance

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let options = { isStatic: true };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    Composite.add(_engine.world, this.body);
  }
  
  show() {
    this.p.rectMode(CENTER);
    this.p.fill(127);
    this.p.stroke(0);
    this.p.strokeWeight(2);    
    this.p.rect(this.x, this.y, this.w, this.h);
  }
}