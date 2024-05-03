import Matter from 'matter-js';

export class Block {
  // コンストラクタでブロックの幅、高さ、物理体を設定し、Matter.jsのワールドに追加
  constructor(x, y, w, h, world, img = null, isStatic = false) {
    // ブロックの幅と高さを設定
    this.w = w;
    this.h = h;

    // Matter.jsを使用してブロックの物理体を作成
    this.body = Matter.Bodies.rectangle(x, y, w, h, { isStatic: isStatic });

    // 画像をインスタンス変数に保存
    this.blockImage = img;

    // 作成したブロックの物理体をMatter.jsのワールドに追加
    Matter.World.add(world, this.body);
  }

  show(p) {
    // ブロックの位置と角度を取得
    let pos = this.body.position;
    let angle = this.body.angle;

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(angle);

    // ブロックに画像が設定されている場合は画像を描画
    if (this.blockImage) {
      p.imageMode(p.CENTER);
      p.image(this.blockImage, 0, 0, this.w, this.h);
    } else {
      // ブロックに画像が設定されていない場合は塗りつぶし色を設定して矩形を描画
      p.fill(this.color || 255);
      p.rectMode(p.CENTER);
      p.rect(0, 0, this.w, this.h);
    }

    p.pop();
  }

  isOffScreen() {
    // ブロックが画面外に出た場合はtrueを返す
    let pos = this.body.position;
    return pos.y > 600;
  }

  addScore() {
    // このメソッドはSketch.jsでオーバーライドされる
  }
}