import React, { useMemo, useState } from 'react';
import quiz from '../../data/ck18-quiz.json';
import Button from '../shared/Button.jsx';
import './CK18Quiz.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK18Quiz({ onBack }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = quiz[qIndex];
  const done = qIndex >= quiz.length;
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
    <div className="ck18q">
      <Button variant="ghost" onClick={onBack} className="ck18q-menu-back">
        Back to Menu
      </Button>
      <h2>Area Knowledge Check</h2>
      {done ? (
        <div className="ck18q-result">
          <p>
            Score: {score} / {quiz.length}
          </p>
          <div className="ck18q-result-actions">
            <Button variant="accent" onClick={restart}>
              Play Again
            </Button>
            <Button variant="ghost" onClick={onBack}>
              Back to Menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="ck18q-question">
          <p className="ck18q-progress">
            Question {qIndex + 1} / {quiz.length}
          </p>
          <p className="ck18q-text">{q.question}</p>
          <div className="ck18q-options">
            {shuffledOptions.map((opt) => {
              let status = '';
              if (selected) {
                if (opt === q.answer) status = 'correct';
                else if (opt === selected) status = 'incorrect';
              }
              return (
                <button
                  key={opt}
                  className={`ck18q-option ${status}`}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="ck18q-explanation">
              <p>{q.explanation}</p>
              <Button variant="accent" onClick={next}>
                {qIndex + 1 === quiz.length ? 'See Score' : 'Next'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
