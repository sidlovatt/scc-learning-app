import React, { useEffect, useState } from 'react';
import PhoneticAlphabet from '../shared/PhoneticAlphabet.jsx';
import Button from '../shared/Button.jsx';
import words from '../../data/ck06-words.json';
import './CK06.css';

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function HangmanDrawing({ wrong }) {
  return (
    <svg viewBox="0 0 120 140" className="ck06-drawing">
      <line x1="10" y1="135" x2="90" y2="135" stroke="#003b5c" strokeWidth="4" />
      <line x1="30" y1="135" x2="30" y2="10" stroke="#003b5c" strokeWidth="4" />
      <line x1="30" y1="10" x2="80" y2="10" stroke="#003b5c" strokeWidth="4" />
      <line x1="80" y1="10" x2="80" y2="25" stroke="#003b5c" strokeWidth="4" />
      {wrong > 0 && <circle cx="80" cy="35" r="10" stroke="#c62828" strokeWidth="3" fill="none" />}
      {wrong > 1 && <line x1="80" y1="45" x2="80" y2="80" stroke="#c62828" strokeWidth="3" />}
      {wrong > 2 && <line x1="80" y1="55" x2="65" y2="70" stroke="#c62828" strokeWidth="3" />}
      {wrong > 3 && <line x1="80" y1="55" x2="95" y2="70" stroke="#c62828" strokeWidth="3" />}
      {wrong > 4 && <line x1="80" y1="80" x2="68" y2="105" stroke="#c62828" strokeWidth="3" />}
      {wrong > 5 && <line x1="80" y1="80" x2="92" y2="105" stroke="#c62828" strokeWidth="3" />}
    </svg>
  );
}

export default function CK06() {
  const [phase, setPhase] = useState('mode-select');
  const [mode, setMode] = useState(null);
  const [letterCount, setLetterCount] = useState(5);
  const [targetWord, setTargetWord] = useState(null);
  const [targetDefinition, setTargetDefinition] = useState(null);
  const [blanks, setBlanks] = useState([]);
  const [wrongLetters, setWrongLetters] = useState(new Set());
  const [correctLetters, setCorrectLetters] = useState(new Set());
  const [pickerIndex, setPickerIndex] = useState(null);

  const wrong = wrongLetters.size;

  function chooseManual() {
    setMode('manual');
    setPhase('setup');
  }

  function choosePredefined() {
    const entry = words[Math.floor(Math.random() * words.length)];
    setMode('predefined');
    setTargetWord(entry.word);
    setTargetDefinition(entry.definition);
    setBlanks(Array(entry.word.length).fill(''));
    setWrongLetters(new Set());
    setCorrectLetters(new Set());
    setPhase('playing');
  }

  function startManualGame() {
    setBlanks(Array(letterCount).fill(''));
    setWrongLetters(new Set());
    setPhase('playing');
  }

  function fillBlank(letter) {
    setBlanks((b) => b.map((v, i) => (i === pickerIndex ? letter : v)));
    setPickerIndex(null);
  }

  function markLetterWrong(letter) {
    if (phase !== 'playing' || wrongLetters.has(letter)) return;
    const next = new Set(wrongLetters);
    next.add(letter);
    setWrongLetters(next);
    if (next.size >= MAX_WRONG) setPhase('lost');
  }

  function guessLetterPredefined(letter) {
    if (phase !== 'playing' || wrongLetters.has(letter) || correctLetters.has(letter)) return;
    if (targetWord.includes(letter)) {
      setCorrectLetters((s) => new Set(s).add(letter));
      setBlanks((b) => b.map((v, i) => (targetWord[i] === letter ? letter : v)));
    } else {
      markLetterWrong(letter);
    }
  }

  useEffect(() => {
    if (phase === 'playing' && blanks.length > 0 && blanks.every((b) => b !== '')) {
      setPhase('won');
    }
  }, [blanks, phase]);

  function playAgain() {
    setPhase('mode-select');
    setMode(null);
    setTargetWord(null);
    setTargetDefinition(null);
    setBlanks([]);
    setWrongLetters(new Set());
    setCorrectLetters(new Set());
    setPickerIndex(null);
  }

  if (phase === 'mode-select') {
    return (
      <div className="ck06">
        <h2>Hangman</h2>
        <div className="ck06-setup">
          <p>Choose a mode</p>
          <div className="ck06-mode-choices">
            <button className="ck06-mode-card" onClick={choosePredefined}>
              <span className="ck06-mode-title">Predefined Words</span>
              <span className="ck06-mode-desc">Game picks a Sea Cadet themed word - tap letters to guess</span>
            </button>
            <button className="ck06-mode-card" onClick={chooseManual}>
              <span className="ck06-mode-title">Manual Mode</span>
              <span className="ck06-mode-desc">One cadet thinks of a word - board-cadet judges each guess</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const usedLetters = mode === 'predefined' ? new Set([...wrongLetters, ...correctLetters]) : wrongLetters;
  const onPhoneticTap = mode === 'predefined' ? guessLetterPredefined : markLetterWrong;
  const trackerLabel =
    mode === 'predefined' ? 'Tap a letter to guess' : 'Tap a letter in the list below if it was called out and wrong';

  return (
    <div className="ck06">
      <h2>Hangman</h2>

      {phase === 'setup' && (
        <div className="ck06-setup">
          <p>How many letters is the word or phrase?</p>
          <div className="ck06-stepper">
            <Button variant="ghost" onClick={() => setLetterCount((n) => Math.max(1, n - 1))}>
              -
            </Button>
            <span className="ck06-count">{letterCount}</span>
            <Button variant="ghost" onClick={() => setLetterCount((n) => Math.min(20, n + 1))}>
              +
            </Button>
          </div>
          <Button variant="accent" onClick={startManualGame}>
            Start
          </Button>
        </div>
      )}

      {phase !== 'setup' && (
        <div className="ck06-content">
          <div className="ck06-board">
            <div className="ck06-drawing-col">
              <HangmanDrawing wrong={wrong} />
              <p className="ck06-wrong-count">
                Wrong guesses: {wrong} / {MAX_WRONG}
              </p>
            </div>

            <div className="ck06-blanks-col">
              <div className="ck06-blanks">
                {blanks.map((letter, i) =>
                  mode === 'manual' ? (
                    <button key={i} className="ck06-blank" onClick={() => setPickerIndex(i)}>
                      {letter || '_'}
                    </button>
                  ) : (
                    <div key={i} className="ck06-blank ck06-blank--static">
                      {letter || '_'}
                    </div>
                  )
                )}
              </div>

              {phase === 'won' && (
                <div className="ck06-end">
                  <p>Word complete!{mode === 'predefined' ? ` It was ${targetWord}.` : ''}</p>
                  {mode === 'predefined' && <p className="ck06-definition">{targetDefinition}</p>}
                  <Button variant="accent" onClick={playAgain}>
                    Play Again
                  </Button>
                </div>
              )}
              {phase === 'lost' && (
                <div className="ck06-end">
                  <p>Out of guesses!{mode === 'predefined' ? ` It was ${targetWord}.` : ''}</p>
                  {mode === 'predefined' && <p className="ck06-definition">{targetDefinition}</p>}
                  <Button variant="accent" onClick={playAgain}>
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </div>

          <p className="ck06-wrong-tracker-label">{trackerLabel}</p>
          <PhoneticAlphabet usedLetters={usedLetters} onLetterTap={onPhoneticTap} />
        </div>
      )}

      {pickerIndex !== null && (
        <div className="ck06-modal-backdrop" onClick={() => setPickerIndex(null)}>
          <div className="ck06-modal" onClick={(e) => e.stopPropagation()}>
            <p>Enter the correct letter</p>
            <div className="ck06-letter-grid">
              {ALPHABET.map((l) => (
                <button key={l} className="ck06-letter" onClick={() => fillBlank(l)}>
                  {l}
                </button>
              ))}
              <button className="ck06-letter ck06-letter--clear" onClick={() => fillBlank('')}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
