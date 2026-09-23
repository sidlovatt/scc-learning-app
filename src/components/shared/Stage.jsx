import React, { useLayoutEffect, useRef, useState } from 'react';
import { StageScaleContext } from './StageScaleContext.js';
import './Stage.css';

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

export default function Stage({ children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function updateScale() {
      const el = outerRef.current;
      if (!el) return;
      const scaleX = el.clientWidth / STAGE_WIDTH;
      const scaleY = el.clientHeight / STAGE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="stage-outer" ref={outerRef}>
      <div
        className="stage-inner"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
      >
        <StageScaleContext.Provider value={scale}>{children}</StageScaleContext.Provider>
      </div>
    </div>
  );
}
