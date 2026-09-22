import React, { useEffect, useRef, useState } from 'react';
import questions from '../../data/ne02b-quiz-questions.json';
import Button from '../shared/Button.jsx';
import './NE02b.css';

const QUESTION_SECONDS = 45;
const POINTS_CORRECT = 100;

export default function NE02b() {
  const [serverInfo, setServerInfo] = useState(null);
  const [players, setPlayers] = useState({});
  const [phase, setPhase] = useState('lobby'); // lobby | question | reveal | final
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const answersRef = useRef({});
  const timerRef = useRef(null);

  const bridgeAvailable = typeof window !== 'undefined' && !!window.ne02b;

  useEffect(() => {
    if (!bridgeAvailable) return undefined;

    window.ne02b.startServer();
    window.ne02b.getServerInfo().then(setServerInfo);

    const offMessage = window.ne02b.onMessage(({ clientId, data }) => {
      if (data.type === 'join') {
        setPlayers((p) => ({ ...p, [clientId]: { name: data.name, score: 0 } }));
        window.ne02b.sendTo(clientId, { type: 'joined', ok: true });
      } else if (data.type === 'answer') {
        answersRef.current[clientId] = data.optionIndex;
      }
    });

    const offClient = window.ne02b.onClientEvent(({ type, clientId }) => {
      if (type === 'disconnected') {
        setPlayers((p) => {
          const next = { ...p };
          delete next[clientId];
          return next;
        });
      }
    });

    return () => {
      offMessage();
      offClient();
      window.ne02b.stopServer();
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function broadcastQuestion(index) {
    const q = questions[index];
    answersRef.current = {};
    window.ne02b.broadcast({
      type: 'question',
      term: q.term,
      options: q.options,
      duration: QUESTION_SECONDS,
    });
  }

  function startQuiz() {
    setQIndex(0);
    setPhase('question');
    setTimeLeft(QUESTION_SECONDS);
    broadcastQuestion(0);
    runTimer();
  }

  function runTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          reveal();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function reveal() {
    const q = questions[qIndex];
    const correctIndex = q.options.indexOf(q.answer);
    setPlayers((prev) => {
      const next = { ...prev };
      Object.entries(answersRef.current).forEach(([clientId, optionIndex]) => {
        if (!next[clientId]) return;
        if (optionIndex === correctIndex) {
          next[clientId] = { ...next[clientId], score: next[clientId].score + POINTS_CORRECT };
        }
      });
      return next;
    });
    window.ne02b.broadcast({ type: 'reveal', correctAnswer: q.answer });
    setPhase('reveal');
  }

  function sendLeaderboard(isFinal) {
    setPlayers((current) => {
      const standings = Object.values(current).sort((a, b) => b.score - a.score);
      window.ne02b.broadcast({ type: isFinal ? 'final' : 'leaderboard', standings });
      return current;
    });
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      sendLeaderboard(true);
      setPhase('final');
      return;
    }
    sendLeaderboard(false);
    const next = qIndex + 1;
    setQIndex(next);
    setPhase('question');
    setTimeLeft(QUESTION_SECONDS);
    broadcastQuestion(next);
    runTimer();
  }

  function restart() {
    setPlayers((p) => {
      const reset = {};
      Object.entries(p).forEach(([id, v]) => (reset[id] = { ...v, score: 0 }));
      return reset;
    });
    setQIndex(0);
    setPhase('lobby');
  }

  const standings = Object.values(players).sort((a, b) => b.score - a.score);
  const answeredCount = Object.keys(answersRef.current).length;

  if (!bridgeAvailable) {
    return (
      <div className="ne02b">
        <h2>Sea Cadet Terms Quiz</h2>
        <p className="ne02b-warning">
          Multiplayer requires the desktop app (Electron) — the WebSocket server only runs there, not in the
          browser dev preview.
        </p>
      </div>
    );
  }

  return (
    <div className="ne02b">
      <h2>Sea Cadet Terms Quiz</h2>

      {phase === 'lobby' && (
        <div className="ne02b-lobby">
          {serverInfo && (
            <p className="ne02b-join-info">
              On the same WiFi, open a browser to <strong>http://{serverInfo.ip}:{serverInfo.port}</strong>
            </p>
          )}
          <p>Players joined: {Object.keys(players).length}</p>
          <ul className="ne02b-player-list">
            {Object.values(players).map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
          <Button variant="accent" onClick={startQuiz} disabled={Object.keys(players).length === 0}>
            Start Quiz
          </Button>
        </div>
      )}

      {phase === 'question' && (
        <div className="ne02b-question">
          <p className="ne02b-progress">
            Question {qIndex + 1} / {questions.length} - {timeLeft}s
          </p>
          <p className="ne02b-term">What does "{questions[qIndex].term}" mean?</p>
          <p className="ne02b-answered">
            {answeredCount} / {Object.keys(players).length} answered
          </p>
          <Button variant="ghost" onClick={reveal}>
            Reveal Now
          </Button>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="ne02b-reveal">
          <p>
            Correct answer: <strong>{questions[qIndex].answer}</strong>
          </p>
          <ol className="ne02b-leaderboard">
            {standings.map((p, i) => (
              <li key={i}>
                {p.name} - {p.score}
              </li>
            ))}
          </ol>
          <Button variant="accent" onClick={nextQuestion}>
            {qIndex + 1 === questions.length ? 'Show Final Leaderboard' : 'Next Question'}
          </Button>
        </div>
      )}

      {phase === 'final' && (
        <div className="ne02b-reveal">
          <h3>Final Leaderboard</h3>
          <ol className="ne02b-leaderboard">
            {standings.map((p, i) => (
              <li key={i}>
                {p.name} - {p.score}
              </li>
            ))}
          </ol>
          <Button variant="accent" onClick={restart}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
