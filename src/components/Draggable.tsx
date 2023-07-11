import React, { useRef, useState } from 'react'
import { useDraggable } from '@neodrag/react';
import { throttle } from '../utils'
import './css/Draggable.css'

export interface DraggableProps {
  zIndex?: number
  zIndexRef?: React.MutableRefObject<number>
  left: number
  top: number
  setPosition: (left: number, top: number) => void
  handleClick?: () => void
  className?: string
  children: string | JSX.Element | JSX.Element[];
}
export const Draggable = ({
  zIndex,
  zIndexRef,
  children,
  className,
  left,
  top,
  setPosition,
  handleClick = () => {},
}: DraggableProps) => {
  const [zeeIndex, setZeeIndex] = useState(
    zIndex || (zIndexRef && zIndexRef.current) || 1
  )
  const cardDragRef = useRef(null)
  useDraggable(cardDragRef, {
    position: { x: left, y: top },
    onDrag: ({ offsetX, offsetY }) => {
      setPosition(offsetX, offsetY)
    },
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
      onClick={handleClick}
      className={
        [
          className,
          "draggable-item"
        ].join(' ')
      }
    >
      {children}
    </div>
  )
}
