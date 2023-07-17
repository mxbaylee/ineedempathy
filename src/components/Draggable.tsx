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
  hasOverlap: (left: number, top: number) => boolean
  mergeOverlappingGroups: (left: number, top: number) => void
  children: string | JSX.Element | JSX.Element[]
}
export const Draggable = ({
  zIndex,
  zIndexRef,
  left,
  top,
  setPosition,
  hasOverlap,
  mergeOverlappingGroups,
  children,
}: DraggableProps) => {
  const [[localLeft, localTop], setLocalPosition] = useState<[number, number]>([ left, top ])
  const [zeeIndex, setZeeIndex] = useState(
    zIndex || (zIndexRef && zIndexRef.current) || 1
  )
  const cardDragRef = useRef(null)
  useDraggable(cardDragRef, {
    position: { x: localLeft, y: localTop },
    onDrag: ({ offsetX, offsetY }) => {
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
