import React, { useMemo, useState } from 'react';
import promise from '../../data/ne03b-promise.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './NE03b.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const totalBlanks = promise.segments.filter((s) => typeof s === 'object').length;

export default function NE03b() {
  const tokens = useMemo(
    () => shuffle(promise.wordBank.map((word, idx) => ({ id: `token-${idx}`, word }))),
    []
  );
  const [filled, setFilled] = useState({});
  const [usedTokens, setUsedTokens] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const allFilled = Object.keys(filled).length === totalBlanks;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const token = tokens.find((t) => t.id === active.id);
    const blankNum = Number(String(over.id).replace('blank-', ''));
    const blankDef = promise.segments.find((s) => typeof s === 'object' && s.blank === blankNum);

    if (blankDef && blankDef.accepts.includes(token.word)) {
      setFilled((f) => ({ ...f, [blankNum]: token.word }));
      setUsedTokens((u) => ({ ...u, [token.id]: true }));
      setFeedback('correct');
    } else {
      setWrongId(token.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ne03b">
        <h2>Complete the Sea Cadet Promise</h2>
        <div className="ne03b-text">
          {promise.segments.map((seg, i) =>
            typeof seg === 'string' ? (
              <span key={i}>{seg}</span>
            ) : filled[seg.blank] ? (
              <span key={i} className="ne03b-filled">
                {filled[seg.blank]}
              </span>
            ) : (
              <Droppable key={i} id={`blank-${seg.blank}`} className="ne03b-blank">
                &nbsp;
              </Droppable>
            )
          )}
        </div>

        <div className="ne03b-bank">
          {tokens
            .filter((t) => !usedTokens[t.id])
            .map((t) => (
              <Draggable key={t.id} id={t.id}>
                <Card status={wrongId === t.id ? 'incorrect' : 'default'}>{t.word}</Card>
              </Draggable>
            ))}
        </div>

        <Button variant="accent" disabled={!allFilled}>
          {allFilled ? 'Promise Complete!' : `Fill the blanks (${Object.keys(filled).length}/${totalBlanks})`}
        </Button>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}
