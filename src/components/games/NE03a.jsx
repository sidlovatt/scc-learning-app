import React, { useMemo, useState } from 'react';
import values from '../../data/ne03a-values.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './NE03a.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NE03a() {
  const shuffledDefs = useMemo(() => shuffle(values), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffledDefs.filter((d) => !matched[d.id]);
  const allDone = Object.keys(matched).length === values.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const defId = active.id;
    const valueId = over.id;
    if (defId === valueId) {
      setMatched((m) => ({ ...m, [defId]: true }));
      setFeedback('correct');
    } else {
      setWrongId(defId);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ne03a">
        <h2>Match the value to its definition</h2>
        <div className="ne03a-layout">
          <div className="ne03a-values">
            {values.map((v) => (
              <Droppable key={v.id} id={v.id} className="ne03a-value-zone">
                <span className="ne03a-value-label">{v.value}</span>
                {matched[v.id] && (
                  <Card status="locked" className="ne03a-locked-def">
                    {v.definition}
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
          <div className="ne03a-definitions">
            {remaining.map((d) => (
              <Draggable key={d.id} id={d.id}>
                <Card status={wrongId === d.id ? 'incorrect' : 'default'}>{d.definition}</Card>
              </Draggable>
            ))}
          </div>
        </div>
        <Button variant="accent" disabled={!allDone}>
          {allDone ? 'All Matched!' : `Submit (${Object.keys(matched).length}/${values.length})`}
        </Button>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
