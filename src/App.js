import React, { useState } from 'react';
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
      <header>
        <div className="navbar bg-base-100 shadow-lg">
          <a className="btn btn-ghost normal-case text-xl">からあげ積み増しタワー</a>
          <a>矢印キーか画面タップで操作.現在スマホはXシェア起動しないかも..</a>  
        </div>
      </header>
      <div className="flex justify-center items-center mt-10">      
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="hidden md:block"> {/*画面が大きい時はスマホモック*/}
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1 relative">
                  <Sketch />               
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden relative">
            <Sketch />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between">
        <button className="btn btn-primary btn-lg" onClick={handleLeftArrowClick}>
          ←Left
        </button>
        <button className="btn btn-primary btn-lg" onClick={handleRightArrowClick}>
          Right→
        </button>
      </div>
    </div>
  );
}

export default App;