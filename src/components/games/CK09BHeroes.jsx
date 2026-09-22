import React, { useMemo, useState } from 'react';
import heroes from '../../data/ck09b-heroes.json';
import Button from '../shared/Button.jsx';
import './CK09BHeroes.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK09BHeroes({ onBack }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = heroes[qIndex];
  const done = qIndex >= heroes.length;
  const shuffledOptions = useMemo(() => (q ? shuffle(q.options) : []), [qIndex]);

  function choose(option) {
    if (selected) return;
    setSelected(option);
    if (option === q.answer) setScore((s) => s + 1);
  }

  function next() {
    setSelected(null);
    setQIndex((i) => i + 1);
  }

  function restart() {
    setSelected(null);
    setQIndex(0);
    setScore(0);
  }

  return (
    <div className="ck09bh">
      <Button variant="ghost" onClick={onBack} className="ck09bh-menu-back">
        Back to Menu
      </Button>
      <h2>Royal Navy Heroes</h2>
      {done ? (
        <div className="ck09bh-result">
          <p>
            Score: {score} / {heroes.length}
          </p>
          <div className="ck09bh-result-actions">
            <Button variant="accent" onClick={restart}>
              Play Again
            </Button>
            <Button variant="ghost" onClick={onBack}>
              Back to Menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="ck09bh-question">
          <p className="ck09bh-progress">
            Question {qIndex + 1} / {heroes.length}
          </p>
          <p className="ck09bh-scenario">{q.scenario}</p>
          <div className="ck09bh-options">
            {shuffledOptions.map((opt) => {
              let status = '';
              if (selected) {
                if (opt === q.answer) status = 'correct';
                else if (opt === selected) status = 'incorrect';
              }
              return (
                <button
                  key={opt}
                  className={`ck09bh-option ${status}`}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="ck09bh-explanation">
              <p>{q.explanation}</p>
              <Button variant="accent" onClick={next}>
                {qIndex + 1 === heroes.length ? 'See Score' : 'Next'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
