import React, { useEffect, useState } from 'react';
import Slideshow from '../shared/Slideshow.jsx';
import CK10BMatch from './CK10BMatch.jsx';
import './CK10B.css';

const SLIDES = [
  {
    title: 'Why Watches?',
    body: [
      "A ship runs 24 hours a day, so the crew is split into watches - shifts that take turns keeping the ship running, on watch and off watch.",
      'There are seven watches in a day. Most are four hours long, but two short two-hour watches - the Dog Watches - split up the evening.',
    ],
  },
  {
    title: 'The Seven Watches',
    body: ['Each watch covers a set period of the 24-hour clock.'],
    list: [
      'First Watch: 2000 - 0000',
      'Middle Watch: 0000 - 0400',
      'Morning Watch: 0400 - 0800',
      'Forenoon Watch: 0800 - 1200',
      'Afternoon Watch: 1200 - 1600',
      'First Dog Watch: 1600 - 1800',
      'Last Dog Watch: 1800 - 2000',
    ],
  },
  {
    title: 'Why the Dog Watches?',
    body: [
      'Splitting the evening into two short two-hour Dog Watches makes the total number of watches odd, so a crew member does not stand the exact same watch every single day.',
      'Discuss: why might it be unfair if every sailor always had the same watch, every day?',
    ],
  },
  {
    title: 'Duty Watch',
    body: [
      "A ship's company is first split into Port Watch and Starboard Watch. Each of those is split again into a First and Second team.",
      'This gives four duty teams: 1P, 1S, 2P and 2S - First of Port, First of Starboard, Second of Port, Second of Starboard.',
    ],
  },
  {
    title: 'A Fair Rota',
    body: [
      'The four teams rotate through the seven watches over several days, so that everyone shares the unpopular night watches fairly - no one team gets stuck with the Middle Watch every day.',
      'Handout 2 has a blank rota template - as a group, try building a fair rota using the four duty teams.',
    ],
  },
  {
    title: "Ship's Bells",
    body: [
      "Before accurate clocks, time at sea was kept with a half-hour sand glass. Every time it ran out, the watchkeeper turned it over and struck the ship's bell.",
      'The bells count up through each four-hour watch, resetting back to one bell at the start of the next watch - so the number of bells always tells you how far into the watch you are.',
    ],
  },
  {
    title: 'Counting the Bells',
    body: [
      'Bells are struck in pairs to make them easier to count from a distance, with any odd bell struck on its own at the end - for example, five bells is struck as ding-ding, ding-ding, ding.',
      'Try the matching activity to practise watches, bell times, and bell patterns.',
    ],
  },
];

export default function CK10B({ registerBack }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    registerBack?.(() => (activity ? () => setActivity(null) : null));
  }, [activity, registerBack]);

  if (activity === 'slides') {
    return (
      <Slideshow
        title="CK10-B: Times, Watches, and Bells"
        slides={SLIDES}
        jumps={[{ label: 'Matching Activity', onClick: () => setActivity('match') }]}
        onExit={() => setActivity(null)}
      />
    );
  }

  if (activity === 'match') {
    return <CK10BMatch onBack={() => setActivity(null)} />;
  }

  return (
    <div className="ck10b">
      <h2>CK10-B: Times, Watches, and Bells</h2>
      <p className="ck10b-hint">Choose an activity</p>
      <div className="ck10b-choices">
        <button className="ck10b-card" onClick={() => setActivity('slides')}>
          <span className="ck10b-card-title">Watches &amp; Bells Explained</span>
          <span className="ck10b-card-desc">Why ships use watches, the Dog Watches, duty rotas, and how ship's bells work</span>
        </button>
        <button className="ck10b-card" onClick={() => setActivity('match')}>
          <span className="ck10b-card-title">Matching Activity</span>
          <span className="ck10b-card-desc">Match watch names to times, times to bell counts, and bell counts to strike patterns</span>
        </button>
      </div>
    </div>
  );
}
