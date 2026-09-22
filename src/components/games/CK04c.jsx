import React, { useMemo, useState } from 'react';
import terms from '../../data/ck04-naval-terms.json';
import customs from '../../data/ck04b-customs.json';
import Button from '../shared/Button.jsx';
import './CK04c.css';

const COLS = 5;
const COL_HEIGHTS = [6, 5, 6, 5, 6];
const HEX_BOX_W = 170;
const HEX_W = HEX_BOX_W * 0.75;
const HEX_H = 100;
const GOAL_ROWS = 5;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function colX(col) {
  return (col + 1) * HEX_W;
}

function colY(col, row) {
  const isTall = col % 2 === 0;
  return row * HEX_H + (isTall ? 0 : HEX_H / 2);
}

function buildGrid() {
  const hexes = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < COL_HEIGHTS[col]; row++) {
      hexes.push({ id: `${col}-${row}`, col, row, x: colX(col), y: colY(col, row) });
    }
  }
  return hexes;
}

function buildAdjacency(grid) {
  const adjacency = {};
  for (const a of grid) {
    adjacency[a.id] = [];
    for (const b of grid) {
      if (a.id === b.id) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist <= 150) adjacency[a.id].push(b.id);
    }
  }
  return adjacency;
}

function buildQuestionPool() {
  const termQs = terms.map((t) => {
    const distractors = shuffle(terms.filter((o) => o.id !== t.id))
      .slice(0, 3)
      .map((o) => o.definition);
    return {
      id: `term-${t.id}`,
      scenario: `What does "${t.term}" mean?`,
      options: shuffle([t.definition, ...distractors]),
      answer: t.definition,
    };
  });
  const customQs = customs.map((c) => ({
    id: `custom-${c.id}`,
    scenario: c.scenario,
    options: shuffle(c.options),
    answer: c.answer,
  }));
  return shuffle([...termQs, ...customQs]);
}

function hasWinPath(claimed, adjacency) {
  const claimedSet = new Set(claimed);
  const start = [...claimedSet].filter((id) => id.startsWith('0-'));
  const visited = new Set();
  const stack = [...start];
  while (stack.length) {
    const cur = stack.pop();
    if (visited.has(cur)) continue;
    visited.add(cur);
    if (cur.startsWith(`${COLS - 1}-`)) return true;
    for (const n of adjacency[cur] || []) {
      if (claimedSet.has(n) && !visited.has(n)) stack.push(n);
    }
  }
  return false;
}

export default function CK04c() {
  const grid = useMemo(buildGrid, []);
  const adjacency = useMemo(() => buildAdjacency(grid), [grid]);
  const [pool, setPool] = useState(buildQuestionPool);
  const [claimed, setClaimed] = useState({});
  const [blocked, setBlocked] = useState({});
  const [activeHex, setActiveHex] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);

  const won = useMemo(() => hasWinPath(Object.keys(claimed), adjacency), [claimed, adjacency]);
  const boardFull = Object.keys(claimed).length + Object.keys(blocked).length === grid.length;

  function openHex(hex) {
    if (claimed[hex.id] || blocked[hex.id] || won) return;
    let nextPool = pool;
    if (nextPool.length === 0) nextPool = buildQuestionPool();
    const [q, ...rest] = nextPool;
    setPool(rest);
    setQuestion(q);
    setActiveHex(hex.id);
    setSelected(null);
  }

  function answer(option) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      if (option === question.answer) {
        setClaimed((c) => ({ ...c, [activeHex]: true }));
      } else {
        setBlocked((b) => ({ ...b, [activeHex]: true }));
      }
      setQuestion(null);
      setActiveHex(null);
    }, 700);
  }

  function restart() {
    setPool(buildQuestionPool());
    setClaimed({});
    setBlocked({});
    setActiveHex(null);
    setQuestion(null);
    setSelected(null);
  }

  const goalTop = colY(1, 0);

  return (
    <div className="ck04c">
      <h2>Blockbuster {won ? '- You Win!' : ''}</h2>
      <p className="ck04c-hint">Connect a path of claimed hexagons from the blue side to the blue side.</p>

      <div className="ck04c-grid">
        {Array.from({ length: GOAL_ROWS }).map((_, row) => (
          <div
            key={`goal-left-${row}`}
            className="ck04c-hex ck04c-hex--goal"
            style={{ left: '0px', top: `${goalTop + row * HEX_H}px` }}
          />
        ))}
        {Array.from({ length: GOAL_ROWS }).map((_, row) => (
          <div
            key={`goal-right-${row}`}
            className="ck04c-hex ck04c-hex--goal"
            style={{ left: `${colX(COLS)}px`, top: `${goalTop + row * HEX_H}px` }}
          />
        ))}

        {grid.map((hex) => {
          let cls = 'ck04c-hex';
          if (claimed[hex.id]) cls += ' ck04c-hex--claimed';
          else if (blocked[hex.id]) cls += ' ck04c-hex--blocked';
          return (
            <button
              key={hex.id}
              className={cls}
              style={{ left: `${hex.x}px`, top: `${hex.y}px` }}
              onClick={() => openHex(hex)}
              disabled={won}
            />
          );
        })}
      </div>

      {(won || boardFull) && (
        <div className="ck04c-end">
          <p>{won ? 'Path complete!' : 'Board full - no connecting path made.'}</p>
          <Button variant="accent" onClick={restart}>
            Play Again
          </Button>
        </div>
      )}

      {question && (
        <div className="ck04c-modal-backdrop">
          <div className="ck04c-modal">
            <p className="ck04c-scenario">{question.scenario}</p>
            <div className="ck04c-options">
              {question.options.map((opt) => {
                let status = '';
                if (selected) {
                  if (opt === question.answer) status = 'correct';
                  else if (opt === selected) status = 'incorrect';
                }
                return (
                  <button
                    key={opt}
                    className={`ck04c-option ${status}`}
                    onClick={() => answer(opt)}
                    disabled={!!selected}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
