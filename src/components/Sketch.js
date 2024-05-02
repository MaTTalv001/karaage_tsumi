import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { Block } from './Block';

const Sketch = () => {
  const containerRef = useRef();

  useEffect(() => {
    const Sketch = (p) => {
      let engine;
      let world;
      let blocks = [];
      let baseBlock;
      let currentBlock;
      let score = 0;
      let gameOver = false;

      p.setup = () => {
        p.createCanvas(400, 600).parent(containerRef.current);
        engine = Matter.Engine.create();
        world = engine.world;

        baseBlock = new Block(p.width / 2, p.height - 20, 120, 40, world);
        baseBlock.body.isStatic = true;
        newBlock();
      };

      p.draw = () => {
        p.background(200);
        Matter.Engine.update(engine);
      
        baseBlock.show(p);
      
        for (let i = blocks.length - 1; i >= 0; i--) {
          let block = blocks[i];
          block.show(p);
      
          if (block.isOffScreen()) {
            gameOver = true; // 画面外に出たらゲームオーバー
            Matter.World.remove(world, block.body);
            blocks.splice(i, 1);
          }
        }
      
        if (!gameOver) {
          currentBlock.show(p);
      
          if (currentBlock.isOffScreen()) {
            gameOver = true;
          }
        }
      
        p.fill(0);
        p.textSize(24);
        p.text("Score: " + score, 10, 30);
      
        if (gameOver) {
          p.textSize(48);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Game Over!", p.width / 2, p.height / 2);
        }
      };
      

      p.keyPressed = () => {
        if (p.keyCode === p.LEFT_ARROW) {
          Matter.Body.setVelocity(currentBlock.body, { x: -2, y: 0 });
        } else if (p.keyCode === p.RIGHT_ARROW) {
          Matter.Body.setVelocity(currentBlock.body, { x: 2, y: 0 });
        }
      };

      function newBlock() {
        let x = p.random(40, p.width - 40);
        currentBlock = new Block(x, 40, 80, 40, world);
        blocks.push(currentBlock);  // 新しいブロックを配列に追加
        Matter.Events.on(engine, 'collisionStart', checkCollision);
      }
      
      function checkCollision(event) {
        const { pairs } = event;
        const activeBlocks = blocks.map(block => block.body.id);  // 既存ブロックのIDリスト
      
        for (let i = 0; i < pairs.length; i++) {
          const { bodyA, bodyB } = pairs[i];
      
          if ((bodyA.id === currentBlock.body.id && (bodyB.id === baseBlock.body.id || activeBlocks.includes(bodyB.id))) ||
              (bodyB.id === currentBlock.body.id && (bodyA.id === baseBlock.body.id || activeBlocks.includes(bodyA.id)))) {
            addScore();
            break;
          }
        }
      }
      
      function addScore() {
        score++;
        Matter.Events.off(engine, 'collisionStart', checkCollision);  // イベントリスナーを削除
        newBlock();  // 新しいブロックを生成
      }
      
      
      function addScore() {
        score++;
        Matter.Events.off(engine, 'collisionStart', checkCollision); // イベントリスナーを削除
        newBlock(); // 新しいブロックを生成
      }
      
    };

    new p5(Sketch);
  }, []);

  return <div ref={containerRef}></div>;
};

export default Sketch;