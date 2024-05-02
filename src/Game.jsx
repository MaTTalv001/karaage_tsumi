import React, { useState, useEffect } from 'react';
import p2 from 'p2';

const Game = () => {
  const [world, setWorld] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newWorld = new p2.World({
      gravity: [0, -9.82]
    });
    setWorld(newWorld);
    createGround(newWorld);
  }, []);

  const createGround = (world) => {
    const ground = new p2.Body({
      mass: 0,
      position: [0, -1]
    });
    const groundShape = new p2.Plane();
    ground.addShape(groundShape);
    world.addBody(ground);
  };

  const addBlock = (x, y) => {
    if (gameOver) return;
    const block = new p2.Body({
      mass: 1,
      position: [x, y]
    });
    const blockShape = new p2.Box({ width: 0.5, height: 0.5 });
    block.addShape(blockShape);
    world.addBody(block);
    setBlocks(prevBlocks => [...prevBlocks, block]);
    setScore(prevScore => prevScore + 1);
  };

  const checkStability = () => {
    blocks.forEach(block => {
      if (block.position[1] < -0.75) {
        setGameOver(true);
      }
    });
  };

  useEffect(() => {
    if (!world) return;
    const interval = setInterval(() => {
      world.step(1 / 60);
      checkStability();
      if (gameOver) clearInterval(interval);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [world, blocks, gameOver]);

  return (
    <div>
      <h1>ブロック積みゲーム</h1>
      <div>Score: {score}</div>
      {gameOver && <div>Game Over</div>}
      <button onClick={() => addBlock(0, 2)}>ブロックを追加</button>
    </div>
  );
};

export default Game;

