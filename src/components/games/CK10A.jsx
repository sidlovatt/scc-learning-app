import React, { useEffect, useState } from 'react';
import Slideshow from '../shared/Slideshow.jsx';
import CK10AClock from './CK10AClock.jsx';
import CK10BMatch from './CK10BMatch.jsx';
import './CK10A.css';

const SLIDES = [
  {
    title: 'Why 24-Hour Time?',
    body: [
      'On land we usually say "8 o\'clock" and rely on am or pm to tell morning from evening. At sea, where safety-critical jobs run around the clock, that mix-up could be dangerous.',
      'The Royal Navy - like most of the world - uses the 24-hour clock instead, so every time of day has one unique number with no am/pm needed.',
    ],
  },
  {
    title: "The Ship's Day",
    body: [
      'The 24-hour clock runs from 0000 (midnight) through to 2359, then wraps back round to 0000 again.',
      '1200 is midday. Add 12 to any afternoon or evening hour to get its 24-hour time - so 3 pm becomes 1500.',
    ],
  },
  {
    title: 'Reading 24-Hour Time',
    body: [
      'A 24-hour time is written as four digits, HHMM - hours then minutes, with no colon and no am/pm.',
      'For example, 1430 is 2:30 pm, and 0245 is 2:45 am.',
      'Try the 24-Hour Clock Match to practise converting between the two.',
    ],
  },
  {
    title: 'The Watch-Keeping System',
    body: [
      "A ship's crew is split into watches - shifts that take turns keeping the ship running, day and night.",
    ],
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
    title: 'The Two-Watch System',
    body: [
      "A ship's company is split into Port Watch and Starboard Watch, each split again into a First and Second team - giving four duty teams: 1P, 1S, 2P and 2S.",
      'These four teams rotate through the seven watches over several days, so everyone shares the unpopular night watches fairly.',
    ],
  },
  {
    title: "Ship's Bells",
    body: [
      "Before accurate clocks, sailors kept time at sea with a half-hour sand glass, striking the ship's bell every time it ran out.",
      'The bells count up through each four-hour watch, struck in pairs to make them easier to count, resetting back to one bell at the start of the next watch.',
      'Try the Watches & Bells Matching activity to practise watch names, bell times, and bell patterns.',
    ],
  },
];

export default function CK10A({ registerBack }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    registerBack?.(() => (activity ? () => setActivity(null) : null));
  }, [activity, registerBack]);

  if (activity === 'slides') {
    return (
      <Slideshow
        title="CK10-A: Times, Watches, and Bells"
        slides={SLIDES}
        jumps={[
          { label: '24-Hour Clock Match', onClick: () => setActivity('clock') },
          { label: 'Watches & Bells Matching', onClick: () => setActivity('match') },
        ]}
        onExit={() => setActivity(null)}
      />
    );
  }

  if (activity === 'clock') {
    return <CK10AClock onBack={() => setActivity(null)} />;
  }

  if (activity === 'match') {
    return <CK10BMatch onBack={() => setActivity(null)} />;
  }

  return (
    <div className="ck10a">
      <h2>CK10-A: Times, Watches, and Bells</h2>
      <p className="ck10a-hint">Choose an activity</p>
      <div className="ck10a-choices">
        <button className="ck10a-card" onClick={() => setActivity('slides')}>
          <span className="ck10a-card-title">Times, Watches &amp; Bells Explained</span>
          <span className="ck10a-card-desc">24-hour time, the watch-keeping system, duty rotas, and how ship's bells work</span>
        </button>
        <button className="ck10a-card" onClick={() => setActivity('clock')}>
          <span className="ck10a-card-title">24-Hour Clock Match</span>
          <span className="ck10a-card-desc">Match 12-hour times to their 24-hour equivalent</span>
        </button>
        <button className="ck10a-card" onClick={() => setActivity('match')}>
          <span className="ck10a-card-title">Watches &amp; Bells Matching</span>
          <span className="ck10a-card-desc">Match watch names to times, times to bell counts, and bell counts to strike patterns</span>
        </button>
      </div>
    </div>
  );
}
