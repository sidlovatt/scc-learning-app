import React from 'react';
import ranks from '../../data/ranks-sc.json';
import RankMatchGame from './RankMatchGame.jsx';

const badgeFiles = import.meta.glob('../../assets/images/badges-sc/*.webp', { eager: true, query: '?url', import: 'default' });
const badgeMap = Object.fromEntries(
  Object.entries(badgeFiles).map(([path, url]) => [path.split('/').pop(), url])
);

export default function NE04a() {
  return <RankMatchGame title="Sea Cadet Ranks & Rates" ranks={ranks} badgeMap={badgeMap} />;
}
