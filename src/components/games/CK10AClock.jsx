import React, { useMemo, useState } from 'react';
import times from '../../data/ck10a-times.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK10AClock.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK10AClock({ onBack }) {
  const pool = useMemo(() => shuffle(times), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = pool.filter((t) => !matched[t.id]);
  const total = times.length;
  const allDone = Object.keys(matched).length === total;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) {
      setMatched((m) => ({ ...m, [active.id]: true }));
      setFeedback('correct');
    } else {
      setWrongId(active.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck10ac">
        <Button variant="ghost" onClick={onBack} className="ck10ac-menu-back">
          Back to Menu
        </Button>
        <h2>24-Hour Clock Match</h2>
        <p className="ck10ac-hint">Drag each 12-hour time onto its matching 24-hour time.</p>

        <div className="ck10ac-zones">
          {times.map((t) => (
            <Droppable key={t.id} id={t.id} className="ck10ac-zone">
              <span className="ck10ac-zone-label">{t.value}</span>
              {matched[t.id] && <Card status="locked">{t.label}</Card>}
            </Droppable>
          ))}
        </div>

        <div className="ck10ac-pool">
          {remaining.map((t) => (
            <Draggable key={t.id} id={t.id}>
              <Card status={wrongId === t.id ? 'incorrect' : 'default'}>{t.label}</Card>
            </Draggable>
          ))}
        </div>

        <p className="ck10ac-progress">{Object.keys(matched).length} / {total} matched</p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />

        {allDone && (
          <div className="ck10ac-end">
            <p>Well done! All times matched.</p>
            <Button variant="accent" onClick={onBack}>
              Back to Menu
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
