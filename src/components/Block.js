import Matter from 'matter-js';

export class Block {
  constructor(x, y, w, h, world, img = null, isStatic = false) {
    this.w = w;
    this.h = h;
    this.body = Matter.Bodies.rectangle(x, y, w, h, { isStatic: isStatic });
    this.blockImage = img; // 画像をインスタンス変数に保存
    Matter.World.add(world, this.body);
  }

  show(p) {
    let pos = this.body.position;
    let angle = this.body.angle;

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(angle);
    if (this.blockImage) {
      p.imageMode(p.CENTER);
      p.image(this.blockImage, 0, 0, this.w, this.h);
    } else {
      p.fill(this.color || 255);  // 塗りつぶし色を設定
      p.rectMode(p.CENTER);
      p.rect(0, 0, this.w, this.h);
    }
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