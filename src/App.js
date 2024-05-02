import React from 'react';
import Sketch from './components/Sketch';

function App() {
  const handleLeftArrowClick = () => {
    dispatchKeyboardEvent('ArrowLeft');
  };

  const handleRightArrowClick = () => {
    dispatchKeyboardEvent('ArrowRight');
  };

  const dispatchKeyboardEvent = (key) => {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
  };

  return (
    <div className="App min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <a className="btn btn-ghost normal-case text-xl">Block Stacking Game</a>
      </div>
      <div className="flex justify-center items-center mt-10">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <Sketch />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between">
        <button className="btn btn-primary" onClick={handleLeftArrowClick}>
          Left
        </button>
        <button className="btn btn-primary" onClick={handleRightArrowClick}>
          Right
        </button>
      </div>
    </div>
  );
}

export default App;