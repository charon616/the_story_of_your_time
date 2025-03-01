import { Engine, Bodies, Composite, Vector, Body, Constraint, Mouse, MouseConstraint } from "matter-js";

export class RectBox {
  constructor(x, y, w, h, angle) {
    let options = { restitution: 0, frictionAir: 0.0 };
    this.body = Bodies.rectangle(x, y, w, h, { angle: angle, ...options });

    // set initial velocity
    Body.setVelocity(this.body, Vector.create(random(-5, 5), random(-5, 5)));
    Body.setAngularVelocity(this.body, random(-0.1, 0.1));
    Composite.add(engine.world, this.body);

    this.w = w;
    this.h = h;
    this.angle = angle;
  }

  removeBody() {
    Composite.remove(engine.world, this.body);
  }

  limit() {
    if(this.body.position.y > height + 100) {
      this.removeBody();
    }
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;

    rectMode(CENTER);
    // fill(0);
    stroke(0);

    push();
    translate(position.x, position.y);
    rotate(angle);
    // rect(0, 0, this.w, this.h, this.h/2);
    sc.scribbleLine(-this.w, this.h, this.w, this.h);
    
    pop();
  }
}

export class Ball {
  constructor(x, y, size) {
    this.w = size;
    this.body = Bodies.circle(x, y, this.w);
    Composite.add(engine.world, this.body);
  }

  removeBody() {
    Composite.remove(engine.world, this.body);
  }

  limit() {
    if(this.body.position.y > height + 100) {
      this.removeBody();
    }
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;

    
    push();
    translate(position.x, position.y);
    rotate(angle);
    sc.scribbleEllipse(0, 0, 72, 72);
    pop();
  }
}

export class Boundary {
  constructor(x, y, w, h, engine) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let options = { isStatic: true };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    Composite.add(engine.world, this.body);
  }
  
  show() {
    rectMode(CENTER);
    fill(127);
    stroke(0);
    strokeWeight(2);    
    rect(this.x, this.y, this.w, this.h);
  }
}