import React from 'react';
import ranks from '../../data/ranks-rmc.json';
import RankMatchGame from './RankMatchGame.jsx';

const badgeFiles = import.meta.glob('../../assets/images/badges-rmc/*.webp', { eager: true, query: '?url', import: 'default' });
const badgeMap = Object.fromEntries(
  Object.entries(badgeFiles).map(([path, url]) => [path.split('/').pop(), url])
);

export default function NE04b() {
  return <RankMatchGame title="Royal Marines Cadet Ranks & Rates" ranks={ranks} badgeMap={badgeMap} themeClass="rmc-theme" />;
}
