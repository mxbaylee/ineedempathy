import React, { useRef, useState } from 'react'
import { useDraggable } from '@neodrag/react';

export interface ContainedDraggableProps {
  children: string | JSX.Element | JSX.Element[];
}
export const ContainedDraggable = ({
  children,
}: ContainedDraggableProps) => {
  const [[left, top], setPosition] = useState([0, 0])
  const cardDragRef = useRef(null)
  useDraggable(cardDragRef, {
    handle: '.title',
    position: { x: left, y: top },
    onDrag: ({ offsetX, offsetY }) => {
      setPosition([offsetX, offsetY])
    },
  })
  return (
    <div
      style={{
        'zIndex': 9999999,
      }}
      ref={cardDragRef}
      className={'draggable-item'}
    >
      {children}
    </div>
  )
}
