import React, { useEffect, useState } from 'react';
import Slideshow from '../shared/Slideshow.jsx';
import CK09Timeline from './CK09Timeline.jsx';
import CK09TechAdvances from './CK09TechAdvances.jsx';
import './CK09A.css';

const SLIDES = [
  {
    title: 'Why have a Navy?',
    body: [
      'We are an island nation. Before looking at Royal Navy history, take a moment as a group to think about why the UK has a Navy and what it actually does.',
      'On paper or a whiteboard, write or draw what you think the answer is. Keep it in mind as you go through the next few slides - there are nine reasons, and it is worth talking through each one as a group.',
    ],
  },
  {
    title: 'Reason 1: Defends the United Kingdom',
    body: [
      'The Royal Navy patrols UK waters and protects our coastline, fishing grounds and offshore energy infrastructure from threats.',
      'Discuss: what do you think could threaten the UK from the sea?',
    ],
  },
  {
    title: 'Reason 2: Supports NATO commitments',
    body: [
      'The UK is part of NATO, an alliance of countries that agree to defend each other. Royal Navy ships regularly work alongside allied navies on joint exercises and operations.',
      'Discuss: why might working closely with other countries\' navies be useful?',
    ],
  },
  {
    title: 'Reason 3: Ensures free trade',
    body: [
      "Around 90% of the UK's imports and exports travel by sea. The Navy helps keep shipping lanes open and safe from piracy or blockade.",
      'Discuss: what everyday items in your home might have arrived by ship?',
    ],
  },
  {
    title: 'Reason 4: Provides disaster relief',
    body: [
      'Royal Navy ships carry supplies, medical teams and engineers to disaster zones, such as after hurricanes or earthquakes, often among the first responders to arrive.',
      'Discuss: why might a ship be a good way to deliver disaster aid?',
    ],
  },
  {
    title: 'Reason 5: Conducts anti-piracy operations',
    body: [
      'In areas like the Gulf of Aden, the Navy has escorted merchant ships and tackled pirate attacks to keep trade routes safe.',
      'Discuss: have you heard of any famous piracy hotspots in the world today?',
    ],
  },
  {
    title: 'Reason 6: Supports science and discovery',
    body: [
      'Royal Navy survey ships like HMS Protector map uncharted waters and support scientific research in places like the Antarctic.',
      'Discuss: what kind of science do you think happens on a survey ship?',
    ],
  },
  {
    title: 'Reason 7: Advances navigation and timekeeping',
    body: [
      'Many navigation tools we rely on today, from accurate clocks to detailed sea charts, were developed to solve naval problems.',
      'Discuss: can you think of a piece of technology in your pocket that relies on accurate timekeeping?',
    ],
  },
  {
    title: 'Reason 8: Engages in diplomacy and trade',
    body: [
      'Ships visiting foreign ports represent the UK abroad, building relationships and supporting trade deals - sometimes called "flying the flag".',
      'Discuss: why might visiting another country by ship make a good impression?',
    ],
  },
  {
    title: 'Reason 9: Maintains the nuclear deterrent',
    body: [
      "The Royal Navy operates the UK's nuclear deterrent, keeping a submarine on patrol 24 hours a day, 365 days a year, to help prevent conflict.",
      'Discuss: what do you think "deterrence" means?',
    ],
  },
  {
    title: 'Recap',
    body: ['As a group, feed back the key points you discussed. Between you, how many of the nine reasons did you come up with before seeing them?'],
    list: [
      'Defends the United Kingdom',
      'Supports NATO commitments',
      'Ensures free trade',
      'Provides disaster relief',
      'Conducts anti-piracy operations',
      'Supports science and discovery',
      'Advances navigation and timekeeping',
      'Engages in diplomacy and trade',
      'Maintains the nuclear deterrent',
    ],
  },
  {
    title: 'Key Naval Events',
    body: [
      'The Royal Navy has been shaped by seven key events across its history: the Spanish Armada, war with the Dutch, its founding under Henry VIII, Trafalgar, Jutland, the Battle of the Atlantic, and the Falklands War.',
      'Try the Timeline Challenge to put them in the correct order and learn a key fact about each one.',
    ],
  },
  {
    title: 'Technological Advances',
    body: [
      'The Royal Navy has led the way on many technological advances which still impact us today, from the marine chronometer to modern cyber security.',
      'Try the Technological Advances activity to match each advancement to its modern-day impact, then sort them into the era they belong to.',
    ],
  },
];

export default function CK09A({ registerBack }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    registerBack?.(() => (activity ? () => setActivity(null) : null));
  }, [activity, registerBack]);

  if (activity === 'slides') {
    return (
      <Slideshow
        title="CK09-A: Royal Navy History"
        slides={SLIDES}
        jumps={[
          { label: 'Timeline Challenge', onClick: () => setActivity('timeline') },
          { label: 'Technological Advances', onClick: () => setActivity('tech') },
        ]}
        onExit={() => setActivity(null)}
      />
    );
  }

  if (activity === 'timeline') {
    return <CK09Timeline onBack={() => setActivity(null)} />;
  }

  if (activity === 'tech') {
    return <CK09TechAdvances onBack={() => setActivity(null)} />;
  }

  return (
    <div className="ck09a">
      <h2>CK09-A: Royal Navy History</h2>
      <p className="ck09a-hint">Choose an activity</p>
      <div className="ck09a-choices">
        <button className="ck09a-card" onClick={() => setActivity('slides')}>
          <span className="ck09a-card-title">Discussion &amp; Key Events</span>
          <span className="ck09a-card-desc">Why have a Navy, and an introduction to the key events and technology activities</span>
        </button>
        <button className="ck09a-card" onClick={() => setActivity('timeline')}>
          <span className="ck09a-card-title">Timeline Challenge</span>
          <span className="ck09a-card-desc">Put seven key Royal Navy events into chronological order</span>
        </button>
        <button className="ck09a-card" onClick={() => setActivity('tech')}>
          <span className="ck09a-card-title">Technological Advances</span>
          <span className="ck09a-card-desc">Match advancements to their impact, then sort them by era</span>
        </button>
      </div>
    </div>
  );
}
