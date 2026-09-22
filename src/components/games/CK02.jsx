import React, { useMemo, useState } from 'react';
import rankOrder from '../../data/ck02-rank-order.json';
import DndProvider from '../shared/DndProvider.jsx';
import Draggable from '../shared/Draggable.jsx';
import Droppable from '../shared/Droppable.jsx';
import Card from '../shared/Card.jsx';
import Button from '../shared/Button.jsx';
import Feedback from '../shared/Feedback.jsx';
import './CK02.css';

const rnBadgeFiles = import.meta.glob('../../assets/images/badges-rn/*.webp', { eager: true, query: '?url', import: 'default' });
const rmBadgeFiles = import.meta.glob('../../assets/images/badges-rm/*.webp', { eager: true, query: '?url', import: 'default' });

function toBadgeMap(files) {
  return Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop(), url]));
}

const BADGE_MAPS = {
  'Royal Navy': toBadgeMap(rnBadgeFiles),
  'Royal Marines': toBadgeMap(rmBadgeFiles),
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function RankBadge({ badge, badgeMap }) {
  if (!badge) return <span className="ck02-no-badge">No insignia</span>;
  return <img src={badgeMap[badge]} alt="" className="ck02-badge-img" />;
}

function OrderChallenge({ fleet, list }) {
  const badgeMap = BADGE_MAPS[fleet];
  const shuffled = useMemo(() => shuffle(list), [list]);
  const [placed, setPlaced] = useState({});
  const [wrongName, setWrongName] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const placedNames = new Set(Object.values(placed).map((r) => r.name));
  const remaining = shuffled.filter((r) => !placedNames.has(r.name));
  const allDone = Object.keys(placed).length === list.length;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const idx = Number(String(over.id).replace('slot-', ''));
    if (list[idx].name === active.id) {
      setPlaced((p) => ({ ...p, [idx]: list[idx] }));
      setFeedback('correct');
    } else {
      setWrongName(active.id);
      setFeedback('incorrect');
      setTimeout(() => setWrongName(null), 400);
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="ck02-challenge">
        <div className="ck02-endpoints">
          <span>Lowest Rank</span>
          <span>Highest Rank</span>
        </div>
        <div className="ck02-line">
          {list.map((rank, idx) => (
            <Droppable key={idx} id={`slot-${idx}`} className="ck02-slot">
              {placed[idx] ? (
                <Card status="locked">
                  <RankBadge badge={placed[idx].badge} badgeMap={badgeMap} />
                  <span>{placed[idx].name}</span>
                </Card>
              ) : (
                <span className="ck02-slot-num">{idx + 1}</span>
              )}
            </Droppable>
          ))}
        </div>
        <div className="ck02-pool">
          {remaining.map((rank) => (
            <Draggable key={rank.name} id={rank.name}>
              <Card status={wrongName === rank.name ? 'incorrect' : 'default'}>
                <RankBadge badge={rank.badge} badgeMap={badgeMap} />
                <span>{rank.name}</span>
              </Card>
            </Draggable>
          ))}
        </div>
        <div className="ck02-status">
          {allDone ? `${fleet} order complete!` : `${Object.keys(placed).length}/${list.length} placed`}
        </div>
        <Feedback status={feedback} onDone={() => setFeedback(null)} />
      </div>
    </DndProvider>
  );
}

export default function CK02() {
  const fleets = Object.keys(rankOrder);
  const [active, setActive] = useState(fleets[0]);

  return (
    <div className="ck02">
      <h2>Rank Order Challenge</h2>
      <div className="ck02-tabs">
        {fleets.map((f) => (
          <Button key={f} variant={active === f ? 'accent' : 'ghost'} onClick={() => setActive(f)}>
            {f}
          </Button>
        ))}
      </div>
      <OrderChallenge key={active} fleet={active} list={rankOrder[active]} />
    </div>
  );
}
