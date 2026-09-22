import React from 'react';
import './Card.css';

export default function Card({ children, status = 'default', className = '' }) {
  return <div className={`sc-card sc-card--${status} ${className}`}>{children}</div>;
}
