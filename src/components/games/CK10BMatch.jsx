import React, { useMemo, useState } from 'react';
import watches from '../../data/ck10b-watches.json';
import bells from '../../data/ck10b-bells.json';
import patterns from '../../data/ck10b-patterns.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import { playBellPattern } from '../../lib/bellSound.js';
import './CK10BMatch.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderDots(pattern) {
  return pattern.map((count) => '●'.repeat(count)).join('   ');
}

function WatchStage({ onComplete }) {
  const pool = useMemo(() => shuffle(watches), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = pool.filter((w) => !matched[w.id]);
  const total = watches.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) {
      const next = { ...matched, [active.id]: true };
      setMatched(next);
      setFeedback('correct');
      if (Object.keys(next).length === total) setTimeout(onComplete, 600);
    } else {
      setWrongId(active.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck10bm-stage">
        <p className="ck10bm-hint">Round 1: Drag each watch name onto its time period.</p>
        <div className="ck10bm-zones">
          {watches.map((w) => (
            <Droppable key={w.id} id={w.id} className="ck10bm-zone">
              <span className="ck10bm-zone-label">{w.range}</span>
              {matched[w.id] && <Card status="locked">{w.name}</Card>}
            </Droppable>
          ))}
        </div>
        <div className="ck10bm-pool">
          {remaining.map((w) => (
            <Draggable key={w.id} id={w.id}>
              <Card status={wrongId === w.id ? 'incorrect' : 'default'}>{w.name}</Card>
            </Draggable>
          ))}
        </div>
        <p className="ck10bm-progress">{Object.keys(matched).length} / {total} matched</p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

function BellsStage({ onComplete }) {
  const pool = useMemo(() => shuffle(bells), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = pool.filter((b) => !matched[b.id]);
  const total = bells.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const item = bells.find((b) => b.id === active.id);
    if (String(item.bells) === over.id) {
      const next = { ...matched, [item.id]: item };
      setMatched(next);
      setFeedback('correct');
      if (Object.keys(next).length === total) setTimeout(onComplete, 600);
    } else {
      setWrongId(item.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck10bm-stage">
        <p className="ck10bm-hint">Round 2: Drag each time onto the number of bells struck.</p>
        <div className="ck10bm-bell-zones">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Droppable key={n} id={String(n)} className="ck10bm-bell-zone">
              <span className="ck10bm-zone-label">{n} bell{n > 1 ? 's' : ''}</span>
              <div className="ck10bm-bell-zone-items">
                {Object.values(matched)
                  .filter((b) => b.bells === n)
                  .map((b) => (
                    <Card key={b.id} status="locked">{b.time}</Card>
                  ))}
              </div>
            </Droppable>
          ))}
        </div>
        <div className="ck10bm-pool">
          {remaining.map((b) => (
            <Draggable key={b.id} id={b.id}>
              <Card status={wrongId === b.id ? 'incorrect' : 'default'}>{b.time}</Card>
            </Draggable>
          ))}
        </div>
        <p className="ck10bm-progress">{Object.keys(matched).length} / {total} matched</p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

function PatternStage({ onComplete }) {
  const pool = useMemo(() => shuffle(patterns), []);
  const [matched, setMatched] = useState({});
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const remaining = pool.filter((p) => !matched[p.id]);
  const total = patterns.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const item = patterns.find((p) => p.id === active.id);
    if (String(item.bells) === over.id) {
      const next = { ...matched, [item.id]: item };
      setMatched(next);
      setFeedback('correct');
      playBellPattern(item.pattern);
      if (Object.keys(next).length === total) setTimeout(onComplete, 600);
    } else {
      setWrongId(item.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongId(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck10bm-stage">
        <p className="ck10bm-hint">Round 3: Drag each strike pattern onto its number of bells.</p>
        <div className="ck10bm-bell-zones">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Droppable key={n} id={String(n)} className="ck10bm-bell-zone">
              <span className="ck10bm-zone-label">{n} bell{n > 1 ? 's' : ''}</span>
              {Object.values(matched)
                .filter((p) => p.bells === n)
                .map((p) => (
                  <Card key={p.id} status="locked">{renderDots(p.pattern)}</Card>
                ))}
            </Droppable>
          ))}
        </div>
        <div className="ck10bm-pool">
          {remaining.map((p) => (
            <Draggable key={p.id} id={p.id}>
              <Card
                status={wrongId === p.id ? 'incorrect' : 'default'}
                className="ck10bm-pattern-card"
              >
                {renderDots(p.pattern)}
              </Card>
            </Draggable>
          ))}
        </div>
        <p className="ck10bm-progress">{Object.keys(matched).length} / {total} matched</p>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

export default function CK10BMatch({ onBack }) {
  const [stage, setStage] = useState('watches');

  return (
    <div className="ck10bm">
      <Button variant="ghost" onClick={onBack} className="ck10bm-menu-back">
        Back to Menu
      </Button>
      <h2>Times, Watches, and Bells</h2>

      {stage === 'watches' && <WatchStage onComplete={() => setStage('bells')} />}
      {stage === 'bells' && <BellsStage onComplete={() => setStage('pattern')} />}
      {stage === 'pattern' && <PatternStage onComplete={() => setStage('done')} />}
      {stage === 'done' && (
        <div className="ck10bm-end">
          <p>Well done! You've matched every watch, time, and bell pattern.</p>
          <Button variant="accent" onClick={onBack}>
            Back to Menu
          </Button>
        </div>
      )}
    </div>
  );
}
