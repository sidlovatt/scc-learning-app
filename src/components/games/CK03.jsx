import React, { useMemo, useState } from 'react';
import data from '../../data/ck03-duties.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK03.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pool = data.wheels.flatMap((w) =>
  w.items.map((text, i) => ({ id: `${w.key}-${i}`, text, wheelKey: w.key }))
);

function BigWheel({ wheel, matched }) {
  const total = wheel.items.length;
  return (
    <Droppable id={wheel.key} className="ck03-wheel" activeClassName="ck03-wheel--over">
      <div className="ck03-wheel-center" style={{ background: wheel.color }}>
        {wheel.key}
      </div>
      {wheel.items.map((text, i) => {
        const angle = (360 / total) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 92;
        const x = 50 + (radius * Math.cos(rad)) / 2;
        const y = 50 + (radius * Math.sin(rad)) / 2;
        const id = `${wheel.key}-${i}`;
        const isFilled = matched[id];
        return (
          <div key={id} className="ck03-slot" style={{ left: `${x}%`, top: `${y}%` }}>
            {isFilled ? (
              <span className="ck03-slot-filled" style={{ background: wheel.color }}>
                {text}
              </span>
            ) : (
              <span className="ck03-slot-empty" />
            )}
          </div>
        );
      })}
    </Droppable>
  );
}

export default function CK03() {
  const shuffledPool = useMemo(() => shuffle(pool), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [activeWheel, setActiveWheel] = useState(data.wheels[0].key);

  const remaining = shuffledPool.filter((item) => !matched[item.id]);
  const allDone = remaining.length === 0;
  const wheel = data.wheels.find((w) => w.key === activeWheel);
  const wheelComplete = (w) => w.items.every((_, i) => matched[`${w.key}-${i}`]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const item = pool.find((p) => p.id === active.id);
    if (item.wheelKey === over.id) {
      setMatched((m) => ({ ...m, [item.id]: true }));
      setFeedback('correct');
    } else {
      setWrongId(item.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck03">
        <h2>Wheel of Duties {allDone ? '- Complete!' : ''}</h2>

        <div className="ck03-tabs">
          {data.wheels.map((w) => (
            <button
              key={w.key}
              className={`ck03-tab ${activeWheel === w.key ? 'ck03-tab--active' : ''} ${
                wheelComplete(w) ? 'ck03-tab--done' : ''
              }`}
              style={{ '--tab-color': w.color }}
              onClick={() => setActiveWheel(w.key)}
            >
              {w.label} {wheelComplete(w) ? '✓' : ''}
            </button>
          ))}
        </div>

        <div className="ck03-stage">
          <BigWheel wheel={wheel} matched={matched} />
        </div>

        <div className="ck03-pool">
          {remaining.map((item) => (
            <Draggable key={item.id} id={item.id}>
              <Card status={wrongId === item.id ? 'incorrect' : 'default'}>{item.text}</Card>
            </Draggable>
          ))}
        </div>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
