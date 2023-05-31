import React, { useRef, useState } from 'react'
import { useDraggable } from '@neodrag/react';
import { throttle } from '../utils'
import './css/Draggable.css'

export interface DraggableProps {
  zIndex?: number
  zIndexRef?: React.MutableRefObject<number>
  initialLeft?: number
  initialTop?: number
  children: string | JSX.Element | JSX.Element[];
}

export const Draggable = ({
  zIndex,
  zIndexRef,
  children,
  initialLeft = 0,
  initialTop = 0
}: DraggableProps) => {
  const [zeeIndex, setZeeIndex] = useState(
    zIndex || (zIndexRef && zIndexRef.current) || 1
  )
  const cardDragRef = useRef(null)
  useDraggable(cardDragRef, {
    defaultPosition: { x: initialLeft, y: initialTop }
  })

  const incrementIndex = throttle(() => {
    if (zIndex) {
      setZeeIndex(zeeIndex + 1)
    } else if (zIndexRef) {
      zIndexRef.current += 1
      setZeeIndex(zIndexRef.current)
    }
  })

  return (
    <div
      style={{zIndex: zeeIndex}}
      ref={cardDragRef}
      onMouseDown={incrementIndex}
      onTouchStart={incrementIndex}
      className={"draggable-item"}
    >
      {children}
    </div>
  )
}
