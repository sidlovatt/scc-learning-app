import React, { useMemo, useState } from 'react';
import terms from '../../data/ck04-naval-terms.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK04.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK04() {
  const shuffledDefs = useMemo(() => shuffle(terms), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffledDefs.filter((d) => !matched[d.id]);
  const allDone = Object.keys(matched).length === terms.length;

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
      <div className="ck04">
        <h2>Naval Terms Matching</h2>
        <div className="ck04-layout">
          <div className="ck04-terms">
            {terms.map((t) => (
              <Droppable key={t.id} id={t.id} className="ck04-term-zone">
                <span className="ck04-term-label">{t.term}</span>
                {matched[t.id] && <Card status="locked">{t.definition}</Card>}
              </Droppable>
            ))}
          </div>
          <div className="ck04-defs">
            {remaining.map((d) => (
              <Draggable key={d.id} id={d.id}>
                <Card status={wrongId === d.id ? 'incorrect' : 'default'}>{d.definition}</Card>
              </Draggable>
            ))}
          </div>
        </div>
        <Button variant="accent" disabled={!allDone}>
          {allDone ? 'All Matched!' : `Submit (${Object.keys(matched).length}/${terms.length})`}
        </Button>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
