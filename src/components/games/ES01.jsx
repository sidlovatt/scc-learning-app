import React, { useMemo, useState } from 'react';
import countryside from '../../data/es01-countryside.json';
import Button from '../shared/Button.jsx';
import './ES01.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const cards = countryside.flatMap((entry) => [
    { key: `${entry.id}-p`, pairId: entry.id, type: 'principle', text: entry.principle },
    { key: `${entry.id}-e`, pairId: entry.id, type: 'example', text: entry.example },
  ]);
  return shuffle(cards);
}

export default function ES01() {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [busy, setBusy] = useState(false);

  const won = matched.size === countryside.length;

  function handleFlip(idx) {
    if (busy || flipped.includes(idx) || matched.has(deck[idx].pairId)) return;
    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      const isMatch = deck[a].pairId === deck[b].pairId && deck[a].type !== deck[b].type;
      setTimeout(() => {
        if (isMatch) {
          setMatched((m) => new Set(m).add(deck[a].pairId));
        }
        setFlipped([]);
        setBusy(false);
      }, isMatch ? 500 : 900);
    }
  }

  function playAgain() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setBusy(false);
  }

  return (
    <div className="es01">
      <h2>Countryside Code Memory Match</h2>
      {won ? (
        <div className="es01-win">
          <p>All pairs matched!</p>
          <Button variant="accent" onClick={playAgain}>
            Play Again
          </Button>
        </div>
      ) : (
        <div className="es01-grid">
          {deck.map((card, idx) => {
            const isFaceUp = flipped.includes(idx) || matched.has(card.pairId);
            const isMatched = matched.has(card.pairId);
            return (
              <button
                key={card.key}
                className={`es01-card ${isFaceUp ? 'es01-card--up' : ''} ${
                  isMatched ? `es01-card--matched es01-color-${card.pairId % 8}` : ''
                }`}
                onClick={() => handleFlip(idx)}
              >
                {isFaceUp ? card.text : '?'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
