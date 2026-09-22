import React, { useMemo, useState } from 'react';
import events from '../../data/ck09-timeline-events.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK09Timeline.css';

const ordered = [...events].sort((a, b) => a.year - b.year);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK09Timeline({ onBack }) {
  const shuffled = useMemo(() => shuffle(ordered), []);
  const [placed, setPlaced] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastFact, setLastFact] = useState(null);

  const placedIds = new Set(Object.values(placed).map((e) => e.id));
  const remaining = shuffled.filter((e) => !placedIds.has(e.id));
  const allDone = Object.keys(placed).length === ordered.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const idx = Number(String(over.id).replace('slot-', ''));
    if (ordered[idx].id === active.id) {
      setPlaced((p) => ({ ...p, [idx]: ordered[idx] }));
      setFeedback('correct');
      setLastFact(ordered[idx]);
    } else {
      setWrongId(active.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck09t">
        <Button variant="ghost" onClick={onBack} className="ck09t-menu-back">
          Back to Menu
        </Button>
        <h2>Timeline Challenge</h2>
        <p className="ck09t-hint">Drag each event into the correct chronological order.</p>

        <div className="ck09t-line">
          <span className="ck09t-endpoint">Earliest</span>
          {ordered.map((e, idx) => (
            <Droppable key={idx} id={`slot-${idx}`} className="ck09t-slot">
              {placed[idx] ? <Card status="locked">{placed[idx].label}</Card> : <span className="ck09t-slot-num">{idx + 1}</span>}
            </Droppable>
          ))}
          <span className="ck09t-endpoint">Latest</span>
        </div>

        <div className="ck09t-pool">
          {remaining.map((e) => (
            <Draggable key={e.id} id={e.id}>
              <Card status={wrongId === e.id ? 'incorrect' : 'default'}>{e.label}</Card>
            </Draggable>
          ))}
        </div>

        {lastFact && !allDone && <p className="ck09t-fact">{lastFact.year}: {lastFact.fact}</p>}

        {allDone && (
          <div className="ck09t-end">
            <p>Timeline complete!</p>
            <Button variant="accent" onClick={onBack}>
              Back to Menu
            </Button>
          </div>
        )}

        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
