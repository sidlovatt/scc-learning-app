import React, { useMemo, useState } from 'react';
import roles from '../../data/ck18-area-roles.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK18RoleMatch.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CK18RoleMatch({ onBack }) {
  const pool = useMemo(() => shuffle(roles), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = pool.filter((r) => !matched[r.id]);
  const total = roles.length;
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
      <div className="ck18rm">
        <Button variant="ghost" onClick={onBack} className="ck18rm-menu-back">
          Back to Menu
        </Button>
        <h2>Guess Who: Area Team Roles</h2>
        <p className="ck18rm-hint">Drag each description onto the role it belongs to.</p>

        <div className="ck18rm-zones">
          {roles.map((r) => (
            <Droppable key={r.id} id={r.id} className="ck18rm-zone">
              <span className="ck18rm-zone-label">{r.role}</span>
              {matched[r.id] && <Card status="locked">{r.description}</Card>}
            </Droppable>
          ))}
        </div>

        <div className="ck18rm-pool">
          {remaining.map((r) => (
            <Draggable key={r.id} id={r.id}>
              <Card status={wrongId === r.id ? 'incorrect' : 'default'}>{r.description}</Card>
            </Draggable>
          ))}
        </div>

        <p className="ck18rm-progress">{Object.keys(matched).length} / {total} matched</p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />

        {allDone && (
          <div className="ck18rm-end">
            <p>Well done! You've matched every role.</p>
            <Button variant="accent" onClick={onBack}>
              Back to Menu
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
