import React from 'react';
import Slideshow from '../shared/Slideshow.jsx';
import selfDisciplinePoster from '../../assets/images/cv02/self-discipline-poster.webp';
import honestyPoster from '../../assets/images/cv02/honesty-integrity-poster.webp';
import galileo1 from '../../assets/images/cv02/galileo-1-telescope.webp';
import galileo2 from '../../assets/images/cv02/galileo-2-arrested.webp';
import galileo3 from '../../assets/images/cv02/galileo-3-door.webp';

const SLIDES = [
  {
    title: 'Self-Discipline',
    image: selfDisciplinePoster,
    body: [
      '"To do my best and do what I must" - one of the Sea Cadet Corps Values.',
      'Activity 1 - Warm-up: Card Towers. In pairs or small groups, build the tallest card tower you can in 5 minutes. As you build, think about how you are showing self-discipline: controlling frustration, not rushing, letting teammates take their turn, following the rules without being asked.',
      'A point goes to the tallest tower, and another to whoever best explains how they showed self-discipline while building it.',
    ],
  },
  {
    title: 'Discussion: What Does Self-Discipline Mean to You?',
    body: [
      'As a group, agree on a definition of self-discipline based on how you showed it in the card tower challenge.',
      'When do we need to show self-discipline in Sea Cadets?',
    ],
    list: [
      'Keeping uniform standards without being prompted',
      'Drill lessons - everyone moving as one takes a lot of self-discipline',
      'Duke of Edinburgh expeditions - training and practice over a long period of time',
    ],
  },
  {
    title: 'Self-Discipline Case Study',
    body: [
      'As a group, pick someone inspiring from the world of sport, and someone inspiring from performing arts. Add your unit\'s CO/OIC as a third example.',
      'How did self-discipline help each of them succeed?',
      'Instructor note: if available, invite your CO/OIC in for 2-3 minutes to talk about how self-discipline has helped them in the Sea Cadets.',
    ],
  },
  {
    title: 'Honesty & Integrity',
    image: honestyPoster,
    body: [
      '"To tell the truth and be a good person" - another of the Sea Cadet Corps Values.',
      'Activity 4 - the story of Galileo looks at what it means to tell the truth even when it is unpopular.',
    ],
  },
  {
    title: 'Galileo',
    image: galileo1,
    body: [
      'Galileo was an Italian astronomer, physicist and engineer. He lived from 1564-1642. From his studies of gravity and space, he concluded that the Earth revolved around the Sun.',
    ],
  },
  {
    title: 'Galileo',
    image: galileo2,
    body: [
      'Before this, most people believed the Sun revolved around the Earth. His discovery was unpopular, and he was even arrested and put under pressure to be quiet.',
    ],
  },
  {
    title: 'Galileo',
    image: galileo3,
    body: [
      'But he continued to publish books about his discovery.',
    ],
  },
  {
    title: 'Discuss: Galileo',
    body: [
      'How do you think Galileo felt when he was arrested?',
      'Why do you think Galileo continued to publish books about his discovery?',
      'Can you think of a time when you had to tell the truth even though it was unpopular?',
      'Do you think Galileo showed the Sea Cadet value of Honesty and Integrity?',
    ],
  },
  {
    title: 'Honesty & Integrity Continuum',
    body: [
      'Read out each statement below. Cadets move to one side of the room if they strongly agree, the other side if they strongly disagree, or the middle if they feel mixed. Take opinions from a range of positions on the line.',
    ],
    list: [
      '"The world would be better if everyone told the truth all the time."',
      '"Displaying honesty and integrity would be important if you were serving in the Navy."',
    ],
  },
  {
    title: 'Wrap-up',
    body: [
      'There are times telling the truth might conflict with another value, like respect - for example, you don\'t have to comment on a haircut you don\'t like.',
      'Next session looks at Cadet Action Plans, and how self-discipline and honesty and integrity can help reach your next goals.',
      'Life Skills: "I was a Sea Cadet, whose Corps Values included self-discipline, honesty and integrity. I always aim to demonstrate these values in my life outside of cadets." Cadets can use this as a guide to write their own, with their own examples, for CVs and personal statements.',
    ],
  },
];

export default function CV02({ onBack }) {
  return <Slideshow title="CV02: Self-Discipline and Honesty &amp; Integrity" slides={SLIDES} onExit={onBack} />;
}
