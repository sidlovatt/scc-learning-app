import React, { useState } from 'react';
import games from '../data/games.json';
import './HomeScreen.css';

const TABS = ['NEW ENTRY CADET', 'CADET', 'CADET FIRST CLASS'];

export default function HomeScreen({ onSelectGame }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>Sea Cadets Interactive Learning</h1>
      </header>

      <nav className="rank-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`rank-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="game-grid">
        {(games[activeTab] || []).map((game) => (
          <button
            key={game.code}
            className="game-card"
            onClick={() => onSelectGame(game.code)}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-code">{game.code}</span>
            <span className="game-name">{game.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
