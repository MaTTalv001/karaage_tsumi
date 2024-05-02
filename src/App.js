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
    const event = new CustomEvent('keydown', { detail: { key } });
    window.dispatchEvent(event);
  };

  return (
    <div className="App min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <a className="btn btn-ghost normal-case text-xl">からあげ積み増しタワー</a>
      </div>
      <div className="flex justify-center items-center mt-10">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="hidden md:block">
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1">
                  <Sketch />
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <Sketch />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between">
        <button className="btn btn-primary btn-wide" onClick={handleLeftArrowClick}>
          Left
        </button>
        <button className="btn btn-primary btn-wide" onClick={handleRightArrowClick}>
          Right
        </button>
      </div>
    </div>
  );
}

export default App;