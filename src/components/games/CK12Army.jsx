import React from 'react';
import ranks from '../../data/ck12-army-ranks.json';
import RankMatchGame from './RankMatchGame.jsx';

const badgeFiles = import.meta.glob('../../assets/images/ck12-army/*.webp', { eager: true, query: '?url', import: 'default' });
const badgeMap = Object.fromEntries(
  Object.entries(badgeFiles).map(([path, url]) => [path.split('/').pop(), url])
);

export default function CK12Army() {
  return <RankMatchGame title="British Army Ranks & Rates" ranks={ranks} badgeMap={badgeMap} />;
}
