import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`sc-button sc-button--${variant}`} {...props}>
      {children}
    </button>
  );
}
