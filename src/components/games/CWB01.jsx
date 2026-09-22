import React, { useState } from 'react';
import bucketData from '../../data/cwb01-stress-bucket.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import './CWB01.css';

const CAPACITY = 100;

export default function CWB01() {
  const [stressorPool, setStressorPool] = useState(bucketData.stressors);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('playing'); // playing | won | lost

  const won = status === 'won';
  const lost = status === 'lost';

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || over.id !== 'bucket' || status !== 'playing') return;
    const data = active.data.current;

    if (data.type === 'stressor') {
      const newLevel = level + data.amount;
      if (newLevel > CAPACITY) {
        setLevel(CAPACITY);
        setStatus('lost');
        return;
      }
      setLevel(newLevel);
      const nextPool = stressorPool.filter((s) => s.id !== data.id);
      setStressorPool(nextPool);
      if (nextPool.length === 0) setStatus('won');
    } else {
      setLevel((l) => Math.max(0, l - data.amount));
    }
  }

  function reset() {
    setStressorPool(bucketData.stressors);
    setLevel(0);
    setStatus('playing');
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="cwb01">
        <h2>Stress Bucket Challenge</h2>
        <p className="cwb01-hint">
          Drag stressors into the bucket. Drag coping strategies onto the bucket to drain it. Add every
          stressor without overflowing.
        </p>

        <div className="cwb01-layout">
          <div className="cwb01-column">
            <h3>Stressors</h3>
            {stressorPool.map((s) => (
              <Draggable key={s.id} id={`stressor-${s.id}`} data={{ type: 'stressor', id: s.id, amount: s.amount }} disabled={status !== 'playing'}>
                <Card>{s.label}</Card>
              </Draggable>
            ))}
          </div>

          <Droppable id="bucket" className="cwb01-bucket" activeClassName="cwb01-bucket--over">
            <div className="cwb01-bucket-fill" style={{ height: `${Math.min(level, 100)}%` }} />
            <span className="cwb01-bucket-label">{level}%</span>
          </Droppable>

          <div className="cwb01-column">
            <h3>Coping Strategies</h3>
            {bucketData.copingStrategies.map((s) => (
              <Draggable key={s.id} id={`strategy-${s.id}`} data={{ type: 'strategy', id: s.id, amount: s.amount }} disabled={status !== 'playing'}>
                <Card>{s.label}</Card>
              </Draggable>
            ))}
          </div>
        </div>

        {(won || lost) && (
          <div className="cwb01-end">
            <p>{won ? 'All stressors managed - well done!' : 'Bucket overflowed - try again.'}</p>
            <Button variant="accent" onClick={reset}>
              Play Again
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
