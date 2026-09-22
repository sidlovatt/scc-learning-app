import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable({ id, data, children, className = '', activeClassName = 'sc-droppable--over' }) {
  const { setNodeRef, isOver } = useDroppable({ id, data });

  return (
    <div ref={setNodeRef} className={`sc-droppable ${isOver ? activeClassName : ''} ${className}`}>
      {children}
    </div>
  );
}
