import React, { useRef, useState } from 'react'
import { useDraggable } from '@neodrag/react';
import { throttle } from '../utils'
import './css/Draggable.css'

export interface DraggableProps {
  left: number
  top: number
  setPosition: (left: number, top: number) => void
  hasOverlap: (left: number, top: number) => boolean
  mergeOverlappingGroups: (left: number, top: number) => void
  children: string | JSX.Element | JSX.Element[]
}
export const Draggable = ({
  left,
  top,
  setPosition,
  hasOverlap,
  mergeOverlappingGroups,
  children,
}: DraggableProps) => {
  const [[localLeft, localTop], setLocalPosition] = useState<[number, number]>([ left, top ])
  const [zIndex, setZIndex] = useState(1);
  const incrementZIndex = () => {
    setZIndex(2);
  };
  const decrementZIndex = () => {
    setZIndex(1);
  };
  const cardDragRef = useRef(null)
  useDraggable(cardDragRef, {
    position: { x: localLeft, y: localTop },
    onDrag: ({ offsetX, offsetY }) => {
      incrementZIndex();
      setLocalPosition([offsetX, offsetY])
    },
    onDragEnd: ({ offsetX, offsetY }) => {
      // If we moved at all
      if (left !== offsetX || top !== offsetY) {
        if (hasOverlap(offsetX, offsetY)) {
          mergeOverlappingGroups(offsetX, offsetY)
        } else {
          setPosition(offsetX, offsetY)
        }
      }
      decrementZIndex();
    },
  })

  return (
    <div
      ref={cardDragRef}
      style={{zIndex: zIndex}}
      className={
        [
          hasOverlap(localLeft, localTop) ? 'has-overlap' : 'no-overlap',
          'draggable-item'
        ].join(' ')
      }
    >
      {children}
    </div>
  )
}
