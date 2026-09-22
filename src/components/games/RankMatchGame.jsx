import React, { useMemo, useState } from 'react';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './RankMatchGame.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RankMatchGame({ title, ranks, badgeMap, themeClass = '' }) {
  const shuffledNames = useMemo(() => shuffle(ranks), [ranks]);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffledNames.filter((r) => !matched[r.id]);
  const allDone = Object.keys(matched).length === ranks.length;

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
      <div className={`rank-match ${themeClass}`}>
        <h2>{title}</h2>
        <div className="rank-match-layout">
          <div className="rank-match-badges">
            {ranks.map((r) => (
              <Droppable key={r.id} id={r.id} className="rank-badge-zone">
                <img src={badgeMap[r.badge]} alt="" className="rank-badge-img" />
                {matched[r.id] && <Card status="locked">{r.name}</Card>}
              </Droppable>
            ))}
          </div>
          <div className="rank-match-names">
            {remaining.map((r) => (
              <Draggable key={r.id} id={r.id}>
                <Card status={wrongId === r.id ? 'incorrect' : 'default'}>{r.name}</Card>
              </Draggable>
            ))}
          </div>
        </div>
        <Button variant="accent" disabled={!allDone}>
          {allDone ? 'All Matched!' : `Submit (${Object.keys(matched).length}/${ranks.length})`}
        </Button>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
