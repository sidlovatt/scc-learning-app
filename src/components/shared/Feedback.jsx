import React, { useEffect, useState } from 'react';
import './Feedback.css';

export default function Feedback({ status, message, onDone, duration = 1200 }) {
  const [visible, setVisible] = useState(!!status);

  useEffect(() => {
    if (!status) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [status, message, duration, onDone]);

  if (!visible || !status) return null;

  return (
    <div className={`sc-feedback sc-feedback--${status}`}>
      <span>{message || (status === 'correct' ? 'Correct!' : 'Try again')}</span>
    </div>
  );
}
