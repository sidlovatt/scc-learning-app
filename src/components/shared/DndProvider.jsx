import React, { useMemo } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useStageScale } from './StageScaleContext.js';

export default function DndProvider({ onDragEnd, onDragStart, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const scale = useStageScale();

  // The Stage wrapper scales the whole app to fit the screen. dnd-kit computes drag
  // transforms in raw pointer pixels, so without this the dragged item moves slower
  // or faster than the actual finger/cursor whenever scale isn't exactly 1.
  const modifiers = useMemo(
    () => [
      ({ transform }) => ({
        ...transform,
        x: transform.x / scale,
        y: transform.y / scale,
      }),
    ],
    [scale]
  );

  return (
    <DndContext sensors={sensors} modifiers={modifiers} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
    </DndContext>
  );
}
