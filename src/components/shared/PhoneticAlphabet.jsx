import React from 'react';
import phonetic from '../../data/phonetic-alphabet.json';
import './PhoneticAlphabet.css';

export default function PhoneticAlphabet({ usedLetters, onLetterTap }) {
  const interactive = !!onLetterTap;

  return (
    <div className="phonetic-alphabet">
      {phonetic.map(({ letter, word }) => {
        const used = usedLetters?.has(letter);
        const Tag = interactive ? 'button' : 'div';
        return (
          <Tag
            key={letter}
            className={`phonetic-entry ${used ? 'phonetic-entry--used' : ''}`}
            onClick={interactive ? () => onLetterTap(letter) : undefined}
            disabled={interactive ? used : undefined}
          >
            <span className="phonetic-letter">{letter}</span>
            <span className="phonetic-word">{word}</span>
          </Tag>
        );
      })}
    </div>
  );
}
