import React, { useEffect, useState } from 'react';
import { GAME_COMPONENTS } from './games/registry.js';
import './GameContainer.css';

export default function GameContainer({ gameCode, onBack }) {
  const GameComponent = GAME_COMPONENTS[gameCode];
  const [backOverride, setBackOverride] = useState(null);

  useEffect(() => {
    setBackOverride(null);
  }, [gameCode]);

  return (
    <div className="game-container">
      <button className="back-button" onClick={() => (backOverride ? backOverride() : onBack())}>
        ← Back
      </button>
      <div className="game-body">
        {GameComponent ? (
          <GameComponent onBack={onBack} registerBack={setBackOverride} />
        ) : (
          <div className="game-placeholder">
            <h2>{gameCode}</h2>
            <p>Coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
