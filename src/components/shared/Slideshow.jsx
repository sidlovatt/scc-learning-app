import React, { useState } from 'react';
import Button from './Button.jsx';
import './Slideshow.css';

export default function Slideshow({ title, slides, jumps, onExit }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <div className="slideshow">
      <h2>{title}</h2>

      {jumps && jumps.length > 0 && (
        <div className="slideshow-jumps">
          {jumps.map((j) => (
            <Button key={j.label} variant="ghost" onClick={j.onClick}>
              Jump to: {j.label}
            </Button>
          ))}
        </div>
      )}

      <div className="slideshow-body">
        <h3 className="slideshow-slide-title">{slide.title}</h3>
        <div className="slideshow-slide-content">
          {slide.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {slide.list && (
            <ul>
              {slide.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="slideshow-nav">
        <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          Back
        </Button>
        <span className="slideshow-progress">
          {index + 1} / {slides.length}
        </span>
        {isLast ? (
          <Button variant="accent" onClick={onExit}>
            Done
          </Button>
        ) : (
          <Button variant="accent" onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
