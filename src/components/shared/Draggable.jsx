import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Draggable({ id, data, disabled, children, className = '' }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: disabled ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sc-draggable ${isDragging ? 'sc-draggable--dragging' : ''} ${className}`}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
