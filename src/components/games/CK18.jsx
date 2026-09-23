import React, { useEffect, useState } from 'react';
import CK18Quiz from './CK18Quiz.jsx';
import CK18RoleMatch from './CK18RoleMatch.jsx';
import ImageSlideshow from '../shared/ImageSlideshow.jsx';
import './CK18.css';

const pptFiles = import.meta.glob('../../assets/images/ck18-ppt/*.webp', { eager: true, query: '?url', import: 'default' });
const pptImages = Object.entries(pptFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

export default function CK18({ registerBack }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    registerBack?.(() => (activity ? () => setActivity(null) : null));
  }, [activity, registerBack]);

  if (activity === 'quiz') {
    return <CK18Quiz onBack={() => setActivity(null)} />;
  }

  if (activity === 'match') {
    return <CK18RoleMatch onBack={() => setActivity(null)} />;
  }

  if (activity === 'ppt') {
    return <ImageSlideshow title="Area Roles (Presentation)" images={pptImages} onExit={() => setActivity(null)} />;
  }

  return (
    <div className="ck18">
      <h2>CK18: Organisation of Sea Cadets at Area Level</h2>
      <p className="ck18-hint">Choose an activity</p>
      <div className="ck18-choices">
        <button className="ck18-card" onClick={() => setActivity('quiz')}>
          <span className="ck18-card-title">Area Knowledge Check</span>
          <span className="ck18-card-desc">How many areas are there, and who runs them?</span>
        </button>
        <button className="ck18-card" onClick={() => setActivity('match')}>
          <span className="ck18-card-title">Guess Who: Area Team Roles</span>
          <span className="ck18-card-desc">Match each Area Team role to what they do</span>
        </button>
        <button className="ck18-card" onClick={() => setActivity('ppt')}>
          <span className="ck18-card-title">Presentation</span>
          <span className="ck18-card-desc">The original Area Roles PowerPoint, slide by slide</span>
        </button>
      </div>
    </div>
  );
}
