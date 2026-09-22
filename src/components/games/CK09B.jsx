import React, { useEffect, useState } from 'react';
import Slideshow from '../shared/Slideshow.jsx';
import ImageSlideshow from '../shared/ImageSlideshow.jsx';
import CK09BHeroes from './CK09BHeroes.jsx';
import caseStudies from '../../data/ck09b-case-studies.json';
import heroBios from '../../data/ck09b-hero-bios.json';
import './CK09B.css';

const pptFiles = import.meta.glob('../../assets/images/ck09b-ppt/*.webp', { eager: true, query: '?url', import: 'default' });
const pptImages = Object.entries(pptFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

const LOCAL_HISTORY_SLIDES = [
  {
    title: 'Activity 2: Local Research',
    body: [
      "Once your timeline is built, add to it with some local naval history - your unit's own connection to the Royal Navy.",
      'This could be local heroes who won gallantry medals, affiliated ships and their exploits, or famous local connections.',
      'Use internet research, ask the adult volunteers in your unit, or invite a local veteran or historian along to talk to you.',
    ],
  },
  {
    title: 'Example: Wolverhampton Unit',
    body: [
      "At Wolverhampton Unit, cadets learn about the history of their adopted ship, HMS Newfoundland, and specifically her journey from Malta to Boston with no rudder after a U-boat attack.",
      'Cadets there also learn about Sergeant Frank Cooper MM RMLI, who won his Military Medal during the Battle of the Somme, and AB Douglas Harris, who won an Italian gallantry medal in 1917 while serving in the Mediterranean.',
    ],
  },
  {
    title: 'Your Turn',
    body: [
      'Does your unit have an adopted ship, a local hero, or a veteran connection? Research it, add it to your timeline, and share it with the group.',
      'Keep your timeline as creative and colourful as possible - this is also about taking a large amount of information and making it short, snappy and engaging.',
    ],
  },
];

export default function CK09B({ registerBack }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    registerBack?.(() => (activity ? () => setActivity(null) : null));
  }, [activity, registerBack]);

  if (activity === 'heroes-learn') {
    return <Slideshow title="Royal Navy Heroes" slides={heroBios} onExit={() => setActivity('heroes-quiz')} />;
  }

  if (activity === 'heroes-quiz') {
    return <CK09BHeroes onBack={() => setActivity(null)} />;
  }

  if (activity === 'timeline') {
    return <Slideshow title="Timeline Resource" slides={caseStudies} onExit={() => setActivity(null)} />;
  }

  if (activity === 'ppt') {
    return <ImageSlideshow title="Royal Navy History (Presentation)" images={pptImages} onExit={() => setActivity(null)} />;
  }

  if (activity === 'local') {
    return <Slideshow title="Local History" slides={LOCAL_HISTORY_SLIDES} onExit={() => setActivity(null)} />;
  }

  return (
    <div className="ck09b">
      <h2>CK09-B: Royal Navy History</h2>
      <p className="ck09b-hint">Choose an activity</p>
      <div className="ck09b-choices">
        <button className="ck09b-card" onClick={() => setActivity('heroes-learn')}>
          <span className="ck09b-card-title">Royal Navy Heroes</span>
          <span className="ck09b-card-desc">Learn about four real Victoria Cross and George Cross recipients, then take the quiz</span>
        </button>
        <button className="ck09b-card" onClick={() => setActivity('timeline')}>
          <span className="ck09b-card-title">Timeline Resource</span>
          <span className="ck09b-card-desc">Browse seven key case studies to help build your own Royal Navy history timeline</span>
        </button>
        <button className="ck09b-card" onClick={() => setActivity('ppt')}>
          <span className="ck09b-card-title">Presentation</span>
          <span className="ck09b-card-desc">The original Royal Navy History PowerPoint, slide by slide</span>
        </button>
        <button className="ck09b-card" onClick={() => setActivity('local')}>
          <span className="ck09b-card-title">Local History</span>
          <span className="ck09b-card-desc">How to add your own unit's local naval history to your timeline</span>
        </button>
      </div>
    </div>
  );
}
