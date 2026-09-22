import React, { useMemo, useState } from 'react';
import parts from '../../data/ne02a-ship-parts.json';
import shipImage from '../../assets/images/ship-topdown.webp';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './NE02a.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NE02a() {
  const shuffled = useMemo(() => shuffle(parts), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffled.filter((p) => !matched[p.id]);
  const allDone = Object.keys(matched).length === parts.length;

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
      <div className="ne02a">
        <h2>Drag each term to the correct part of the ship</h2>

        <div className="ne02a-diagram-wrap">
          <div className="ne02a-diagram">
            <img src={shipImage} alt="Top-down ship diagram" className="ne02a-svg" />
            {parts.map((p) => (
              <div key={p.id} className="ne02a-hotspot-pos" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <Droppable id={p.id} className="ne02a-hotspot" activeClassName="ne02a-hotspot--over">
                  {matched[p.id] ? <Card status="locked">{p.term}</Card> : <span className="ne02a-dot" />}
                </Droppable>
              </div>
            ))}
          </div>
        </div>

        <div className="ne02a-terms">
          {remaining.map((p) => (
            <Draggable key={p.id} id={p.id}>
              <Card status={wrongId === p.id ? 'incorrect' : 'default'}>{p.term}</Card>
            </Draggable>
          ))}
        </div>

        <Button variant="accent" disabled={!allDone}>
          {allDone ? 'All Correct!' : `Submit (${Object.keys(matched).length}/${parts.length})`}
        </Button>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
