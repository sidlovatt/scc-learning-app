import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen.jsx';
import GameContainer from './components/GameContainer.jsx';
import Stage from './components/shared/Stage.jsx';

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <Stage>
      {activeGame ? (
        <GameContainer gameCode={activeGame} onBack={() => setActiveGame(null)} />
      ) : (
        <HomeScreen onSelectGame={setActiveGame} />
      )}
    </Stage>
  );
}
