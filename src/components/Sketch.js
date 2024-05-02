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
      let gameStarted = false;
      let countdown = 5;
      let countdownTimer;
      let blockImage;

      p.preload = () => {
        blockImage = p.loadImage('images/karaage.png', () => {
          console.log('Image loaded successfully');
        }, () => {
          console.error('Error loading image');
        });
      };

      p.setup = () => {
        p.createCanvas(400, 600).parent(containerRef.current);
        engine = Matter.Engine.create();
        world = engine.world;

        // 床のブロックを設置
        baseBlock = new Block(p.width / 2, p.height - 20, 120, 40, world);
        baseBlock.body.isStatic = true; // 床は動かないように設定
      };

      p.draw = () => {
        p.background(200);
        Matter.Engine.update(engine);

        p.fill(0);
        p.textSize(24);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Score: " + score, 10, 10);

        if (!gameStarted) {
          displayStartButton(p);
        } else if (countdown > 0) {
          displayCountdown(p);
        } else {
          updateGame(p);
        }

        if (gameOver) {
          displayGameOver(p);
        }
      };

      function displayStartButton(p) {
        p.fill(255);
        p.rect(p.width / 2 - 50, p.height / 2 - 25, 100, 50);
        p.fill(0);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Start", p.width / 2, p.height / 2);

        if (p.mouseIsPressed && p.mouseX > p.width / 2 - 50 && p.mouseX < p.width / 2 + 50 && p.mouseY > p.height / 2 - 25 && p.mouseY < p.height / 2 + 25) {
          gameStarted = true;
          startCountdown();
        }
      }

      function startCountdown() {
        countdownTimer = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(countdownTimer);
            newBlock();
          }
        }, 1000);
      }

      function displayCountdown(p) {
        p.fill(255, 0, 0);
        p.textSize(48);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(countdown.toString(), p.width / 2, p.height / 2);
      }

      function updateGame(p) {
        baseBlock.show(p);

        for (let i = blocks.length - 1; i >= 0; i--) {
          let block = blocks[i];
          block.show(p);

          if (block.isOffScreen()) {
            gameOver = true;
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
      }

      function displayGameOver(p) {
        p.fill(255, 0, 0);
        p.textSize(48);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Game Over!", p.width / 2, p.height / 2 - 50);

        p.fill(255);
        p.rect(p.width / 2 - 50, p.height / 2 + 25, 100, 50);
        p.fill(0);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Restart", p.width / 2, p.height / 2 + 50);

        if (p.mouseIsPressed && p.mouseX > p.width / 2 - 50 && p.mouseX < p.width / 2 + 50 && p.mouseY > p.height / 2 + 25 && p.mouseY < p.height / 2 + 75) {
          window.location.reload();
        }
      }

      p.keyPressed = () => {
        if (!gameOver) {
          if (p.keyCode === p.LEFT_ARROW) {
            Matter.Body.setVelocity(currentBlock.body, { x: -2, y: 0 });
          } else if (p.keyCode === p.RIGHT_ARROW) {
            Matter.Body.setVelocity(currentBlock.body, { x: 2, y: 0 });
          }
        }
      };

      function newBlock() {
        let x = p.random(40, p.width - 40);
        currentBlock = new Block(x, 40, 80, 40, world, blockImage);
        blocks.push(currentBlock);
        Matter.Events.on(engine, 'collisionStart', checkCollision);
      }

      function checkCollision(event) {
        const { pairs } = event;
        const activeBlocks = blocks.map(block => block.body.id);

        for (let i = 0; i < pairs.length; i++) {
          const { bodyA, bodyB } = pairs[i];

          if ((bodyA.id === currentBlock.body.id && (bodyB.id === baseBlock.body.id || activeBlocks.includes(bodyB.id))) ||
              (bodyB.id === currentBlock.body.id && (bodyA.id === baseBlock.body.id || activeBlocks.includes(bodyA.id)))) {
            if (!gameOver) {
              addScore();
            }
            break;
          }
        }
      }

      function addScore() {
        score++;
        Matter.Events.off(engine, 'collisionStart', checkCollision);

        if (!gameOver) {
          newBlock();
        }
      }
    };

    new p5(Sketch);
  }, []);

  return <div ref={containerRef}></div>;
};

export default Sketch;