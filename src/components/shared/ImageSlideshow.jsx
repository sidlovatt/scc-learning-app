import React, { useState } from 'react';
import Button from './Button.jsx';
import './ImageSlideshow.css';

export default function ImageSlideshow({ title, images, onExit }) {
  const [index, setIndex] = useState(0);
  const isLast = index === images.length - 1;

  return (
    <div className="imgshow">
      <h2>{title}</h2>

      <div className="imgshow-frame">
        <img src={images[index]} alt={`Slide ${index + 1}`} className="imgshow-image" />
      </div>

      <div className="imgshow-nav">
        <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          Back
        </Button>
        <span className="imgshow-progress">
          {index + 1} / {images.length}
        </span>
        {isLast ? (
          <Button variant="accent" onClick={onExit}>
            Done
          </Button>
        ) : (
          <Button variant="accent" onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
