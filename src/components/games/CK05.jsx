import React, { useState } from 'react';
import vessels from '../../data/ck05-vessels.json';
import Button from '../shared/Button.jsx';
import './CK05.css';

const vesselImageFiles = import.meta.glob('../../assets/images/vessels/*.webp', { eager: true, query: '?url', import: 'default' });
const vesselImageMap = Object.fromEntries(
  Object.entries(vesselImageFiles).map(([path, url]) => [path.split('/').pop(), url])
);

const STATS = [
  { key: 'displacement', label: 'Displacement (T)' },
  { key: 'length', label: 'Length (M)' },
  { key: 'speed', label: 'Speed (Knots)' },
  { key: 'width', label: 'Width (M)' },
  { key: 'crew', label: 'Crew' },
  { key: 'vesselsInClass', label: 'Vessels in Class' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function VesselCard({ vessel, highlightStat }) {
  return (
    <div className="ck05-card">
      <img src={vesselImageMap[vessel.image]} alt="" className="ck05-card-image" />
      <div className="ck05-card-name">{vessel.name}</div>
      <ul className="ck05-stats">
        {STATS.map((s) => (
          <li key={s.key} className={s.key === highlightStat ? 'ck05-stat--active' : ''}>
            <span>{s.label}</span>
            <span>{vessel[s.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function canBeat(vessel, champion) {
  return STATS.some((s) => vessel[s.key] > champion[s.key]);
}

function drawChallenger(pool, champion) {
  const idx = pool.findIndex((v) => canBeat(v, champion));
  const pick = idx === -1 ? 0 : idx;
  const challenger = pool[pick];
  const rest = [...pool.slice(0, pick), ...pool.slice(pick + 1)];
  return { challenger, rest };
}

function initGame() {
  const [champion, ...pool] = shuffle(vessels);
  const { challenger, rest } = drawChallenger(pool, champion);
  return { champion, challenger, pool: rest };
}

export default function CK05() {
  const [{ champion, challenger, pool }, setState] = useState(initGame);
  const [turn, setTurn] = useState('Team 1');
  const [scores, setScores] = useState({ 'Team 1': 0, 'Team 2': 0 });
  const [selectedStat, setSelectedStat] = useState(null);
  const [finished, setFinished] = useState(false);

  const revealed = selectedStat !== null;
  const isCorrect = revealed && challenger[selectedStat] > champion[selectedStat];

  function pickStat(statKey) {
    if (revealed) return;
    setSelectedStat(statKey);
    if (challenger[statKey] > champion[statKey]) {
      setScores((s) => ({ ...s, [turn]: s[turn] + 1 }));
    }
  }

  function nextRound() {
    const newChampion = isCorrect ? challenger : champion;
    const newTurn = turn === 'Team 1' ? 'Team 2' : 'Team 1';
    setSelectedStat(null);
    setTurn(newTurn);
    if (pool.length === 0) {
      setState({ champion: newChampion, challenger: null, pool: [] });
      setFinished(true);
      return;
    }
    const { challenger: next, rest } = drawChallenger(pool, newChampion);
    setState({ champion: newChampion, challenger: next, pool: rest });
  }

  function playAgain() {
    setState(initGame());
    setTurn('Team 1');
    setScores({ 'Team 1': 0, 'Team 2': 0 });
    setSelectedStat(null);
    setFinished(false);
  }

  if (finished) {
    const winner =
      scores['Team 1'] === scores['Team 2'] ? null : scores['Team 1'] > scores['Team 2'] ? 'Team 1' : 'Team 2';
    return (
      <div className="ck05">
        <div className={`ck05-team-panel ${winner === 'Team 1' ? 'ck05-team-panel--active' : ''}`}>
          <div className="ck05-team-label">Team 1</div>
          <div className="ck05-team-score">{scores['Team 1']}</div>
        </div>

        <div className="ck05-main">
          <h2>Vessel Top Trumps</h2>
          <div className="ck05-end">
            <p>{winner ? `${winner} wins!` : "It's a tie!"}</p>
            <Button variant="accent" onClick={playAgain}>
              Play Again
            </Button>
          </div>
        </div>

        <div className={`ck05-team-panel ${winner === 'Team 2' ? 'ck05-team-panel--active' : ''}`}>
          <div className="ck05-team-label">Team 2</div>
          <div className="ck05-team-score">{scores['Team 2']}</div>
        </div>
      </div>
    );
  }

  const statLabel = revealed ? STATS.find((s) => s.key === selectedStat).label : null;

  return (
    <div className="ck05">
      <div className={`ck05-team-panel ${turn === 'Team 1' ? 'ck05-team-panel--active' : ''}`}>
        <div className="ck05-team-label">Team 1</div>
        <div className="ck05-team-score">{scores['Team 1']}</div>
      </div>

      <div className="ck05-main">
        <h2>Vessel Top Trumps</h2>
        <p className="ck05-prompt">
          <strong>{turn}</strong>'s turn - pick a stat you think the challenger beats the champion on
        </p>
        <p className="ck05-poolcount">{pool.length} cards left</p>

        <div className="ck05-board">
          <VesselCard vessel={champion} highlightStat={selectedStat} />

          {revealed ? (
            <VesselCard vessel={challenger} highlightStat={selectedStat} />
          ) : (
            <div className="ck05-card ck05-card--hidden">
              <img src={vesselImageMap[challenger.image]} alt="" className="ck05-card-image" />
              <div className="ck05-card-name">{challenger.name}</div>
              <div className="ck05-stat-picker">
                {STATS.map((s) => (
                  <button key={s.key} className="ck05-stat-button" onClick={() => pickStat(s.key)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {revealed && (
          <div className="ck05-result">
            <p>
              {statLabel}: {champion[selectedStat]} vs {challenger[selectedStat]} -{' '}
              {isCorrect ? `${turn} correct! Challenger becomes champion.` : 'Not beaten - champion stays.'}
            </p>
            <Button variant="accent" onClick={nextRound}>
              Next Round
            </Button>
          </div>
        )}
      </div>

      <div className={`ck05-team-panel ${turn === 'Team 2' ? 'ck05-team-panel--active' : ''}`}>
        <div className="ck05-team-label">Team 2</div>
        <div className="ck05-team-score">{scores['Team 2']}</div>
      </div>
    </div>
  );
}
