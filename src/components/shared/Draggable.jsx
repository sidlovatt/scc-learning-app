import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useStageScale } from './StageScaleContext.js';

export default function Draggable({ id, data, disabled, children, className = '' }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  // dnd-kit tracks drag position in raw pointer pixels, which is correct for its own
  // collision detection (droppable rects are already measured in real screen pixels).
  // But the Stage wrapper renders everything inside a CSS scale(), so the element's own
  // local transform gets shrunk/grown again by that ancestor scale when the browser
  // paints it. Divide only the visual CSS transform by the stage scale (not the value
  // dnd-kit itself tracks) so the rendered position matches the cursor without breaking
  // drop detection.
  const scale = useStageScale();
  const style = {
    transform: transform ? `translate3d(${transform.x / scale}px, ${transform.y / scale}px, 0)` : undefined,
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
