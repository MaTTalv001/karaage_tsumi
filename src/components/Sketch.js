import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { Block } from './Block';

const post = {
  title: "からあげ積み増しタワー",
  url: "https://karaage-tsumi.vercel.app/",
};

// ツイート共有機能
const handleTweet = (score) => {
  const tweetText = `【からあげ積み増しタワー】からあげ${score}個積み上げた！！ #からあげ積み増しタワー #RUNTEQ`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(post.url)}&text=${encodeURIComponent(tweetText)}`;
  window.open(twitterUrl, "_blank");
};

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

      // 画像の事前読み込み
      p.preload = () => {
        blockImage = p.loadImage('images/karaage.png', () => {
          console.log('画像読み込み');
        }, () => {
          console.error('画像読み込み失敗');
        });
      };

      // ゲームの初期化
      p.setup = () => {
        p.createCanvas(400, 600).parent(containerRef.current);
        engine = Matter.Engine.create();
        world = engine.world;

        // 重力の設定を変更
        engine.gravity.scale = 0.002; // 重力の大きさを設定
        engine.gravity.y = 0.2; // 重力の方向を設定（下向きの場合はy=1）

        // 床のブロックを設置
        baseBlock = new Block(p.width / 2, p.height - 20, 120, 40, world);
        baseBlock.body.isStatic = true; // 床は動かないように設定
      };

      // ゲームのメインループ
      p.draw = () => {
        p.background(200);
        Matter.Engine.update(engine);

        // スコアと操作方法を表示
        p.fill(0);
        p.textSize(24);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Score: " + score, 60, 60);
        p.text(" ←→で操作 " , 200, 60);

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

      // スタートボタンの表示
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

      // カウントダウンの開始
      function startCountdown() {
        countdownTimer = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(countdownTimer);
            newBlock();
          }
        }, 1000);
      }

      // カウントダウンの表示
      function displayCountdown(p) {
        p.fill(255, 0, 0);
        p.textSize(48);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(countdown.toString(), p.width / 2, p.height / 2);
      }

      // ゲームの更新
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

      // ゲームオーバー画面の表示
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

        p.fill(255);
        p.rect(p.width / 2 - 50, p.height / 2 + 100, 100, 50);
        p.fill(0);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Xでシェア", p.width / 2, p.height / 2 + 125);

        if (p.mouseIsPressed) {
          if (p.mouseX > p.width / 2 - 50 && p.mouseX < p.width / 2 + 50 && p.mouseY > p.height / 2 + 25 && p.mouseY < p.height / 2 + 75) {
            window.location.reload();
          } else if (p.mouseX > p.width / 2 - 50 && p.mouseX < p.width / 2 + 50 && p.mouseY > p.height / 2 + 100 && p.mouseY < p.height / 2 + 150) {
            handleTweet(score);
          }
        }
      }

      // タッチ操作のイベント処理
      p.touchStarted = (event) => {
        if (event.touches && event.touches.length > 0) {
          if (!gameOver && currentBlock) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            const canvasRect = p.canvas.getBoundingClientRect();
            const touchCanvasX = touchX - canvasRect.left;
            const touchCanvasY = touchY - canvasRect.top;
      
            if (touchCanvasX < p.width / 2) {
              Matter.Body.setVelocity(currentBlock.body, { x: -1.5, y: 1 });
            } else {
              Matter.Body.setVelocity(currentBlock.body, { x: 1.5, y: 1 });
            }
          }
      
          if (gameOver) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            const canvasRect = p.canvas.getBoundingClientRect();
            const touchCanvasX = touchX - canvasRect.left;
            const touchCanvasY = touchY - canvasRect.top;
      
            if (touchCanvasX > p.width / 2 - 50 && touchCanvasX < p.width / 2 + 50 && touchCanvasY > p.height / 2 + 100 && touchCanvasY < p.height / 2 + 150) {
              handleTweet(score);
            } else if (touchCanvasX > p.width / 2 - 50 && touchCanvasX < p.width / 2 + 50 && touchCanvasY > p.height / 2 + 25 && touchCanvasY < p.height / 2 + 75) {
              window.location.reload();
            }
          }
        }
      
        return false;
      };

      // キーボード操作のイベント処理
      p.keyPressed = (event) => {
        if (!gameOver && currentBlock) {
          if (event.key === 'ArrowLeft' || event.detail?.key === 'ArrowLeft') {
            Matter.Body.setVelocity(currentBlock.body, { x: -1.5, y: 1 });
          } else if (event.key === 'ArrowRight' || event.detail?.key === 'ArrowRight') {
            Matter.Body.setVelocity(currentBlock.body, { x: 1.5, y: 1 });
          }
        }
      };

      document.addEventListener('keydown', p.keyPressed);
      window.addEventListener('keydown', p.keyPressed);

      // 新しいブロックの生成
      function newBlock() {
        let x = p.random(40, p.width - 40);
        currentBlock = new Block(x, 40, 60, 40, world, blockImage);
        blocks.push(currentBlock);
        Matter.Events.on(engine, 'collisionStart', checkCollision);
      }

      // 衝突判定
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

      // スコアの加算
      function addScore() {
        score++;
        Matter.Events.off(engine, 'collisionStart', checkCollision);

        if (!gameOver) {
          newBlock();
        }
      }
    };

    new p5(Sketch);

    return () => {
      document.removeEventListener('keydown', Sketch.prototype.keyPressed);
      window.removeEventListener('keydown', Sketch.prototype.keyPressed);
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default Sketch;