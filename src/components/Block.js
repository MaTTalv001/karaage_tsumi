import Matter from 'matter-js';

export class Block {
  constructor(x, y, w, h, world) {
    this.w = w;
    this.h = h;
    this.body = Matter.Bodies.rectangle(x, y, w, h);
    Matter.World.add(world, this.body);
  }

  show(p) {
    let pos = this.body.position;
    let angle = this.body.angle;

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(angle);
    p.fill(255);
    p.rectMode(p.CENTER);
    p.rect(0, 0, this.w, this.h);
    p.pop();
  }

  isOffScreen() {
    let pos = this.body.position;
    return pos.y > 600;
  }

  addScore() {
    // This method will be overwritten in Sketch.js
  }
}