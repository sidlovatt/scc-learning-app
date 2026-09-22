import React, { useMemo, useState } from 'react';
import eras from '../../data/ck09-tech-advances.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK09TechAdvances.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const allItems = eras.flatMap((e) => e.items.map((item) => ({ ...item, era: e.era, color: e.color })));

function MatchStage({ onComplete }) {
  const shuffledImpacts = useMemo(() => shuffle(allItems), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffledImpacts.filter((i) => !matched[i.id]);
  const allDone = Object.keys(matched).length === allItems.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) {
      const next = { ...matched, [active.id]: true };
      setMatched(next);
      setFeedback('correct');
      if (Object.keys(next).length === allItems.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setWrongId(active.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck09ta-stage">
        <p className="ck09ta-hint">Stage 1: Match each advancement to its impact on us today.</p>
        <div className="ck09ta-layout">
          <div className="ck09ta-advancements">
            {allItems.map((item) => (
              <Droppable key={item.id} id={item.id} className="ck09ta-advancement-zone">
                <span className="ck09ta-advancement-label">{item.advancement}</span>
                {matched[item.id] && <Card status="locked">{item.impact}</Card>}
              </Droppable>
            ))}
          </div>
          <div className="ck09ta-impacts">
            {remaining.map((item) => (
              <Draggable key={item.id} id={item.id}>
                <Card status={wrongId === item.id ? 'incorrect' : 'default'}>{item.impact}</Card>
              </Draggable>
            ))}
          </div>
        </div>
        <p className="ck09ta-progress">
          {Object.keys(matched).length} / {allItems.length} matched
        </p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

function SortStage({ onComplete }) {
  const shuffledItems = useMemo(() => shuffle(allItems), []);
  const [sorted, setSorted] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = shuffledItems.filter((i) => !sorted[i.id]);
  const allDone = Object.keys(sorted).length === allItems.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const item = allItems.find((i) => i.id === active.id);
    if (item.era === over.id) {
      const next = { ...sorted, [item.id]: item };
      setSorted(next);
      setFeedback('correct');
      if (Object.keys(next).length === allItems.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setWrongId(item.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck09ta-stage">
        <p className="ck09ta-hint">Stage 2: Sort each advancement into the era it belongs to.</p>
        <div className="ck09ta-eras">
          {eras.map((e) => (
            <Droppable key={e.era} id={e.era} className="ck09ta-era-bin" activeClassName="ck09ta-era-bin--over">
              <span className="ck09ta-era-label" style={{ background: e.color }}>
                {e.era}
              </span>
              <div className="ck09ta-era-items">
                {Object.values(sorted)
                  .filter((i) => i.era === e.era)
                  .map((i) => (
                    <Card key={i.id} status="locked">
                      {i.advancement}
                    </Card>
                  ))}
              </div>
            </Droppable>
          ))}
        </div>
        <div className="ck09ta-pool">
          {remaining.map((item) => (
            <Draggable key={item.id} id={item.id}>
              <Card status={wrongId === item.id ? 'incorrect' : 'default'}>{item.advancement}</Card>
            </Draggable>
          ))}
        </div>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

export default function CK09TechAdvances({ onBack }) {
  const [stage, setStage] = useState('match');

  return (
    <div className="ck09ta">
      <Button variant="ghost" onClick={onBack} className="ck09ta-menu-back">
        Back to Menu
      </Button>
      <h2>Technological Advances</h2>

      {stage === 'match' && <MatchStage onComplete={() => setStage('sort')} />}
      {stage === 'sort' && <SortStage onComplete={() => setStage('done')} />}
      {stage === 'done' && (
        <div className="ck09ta-end">
          <p>Well done! You've matched and sorted every advancement.</p>
          <Button variant="accent" onClick={onBack}>
            Back to Menu
          </Button>
        </div>
      )}
    </div>
  );
}
