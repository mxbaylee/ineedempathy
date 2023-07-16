import React, { useCallback, useState } from 'react'
import { Draggable } from './Draggable'

export interface ContainedDraggableProps {
  zIndex?: number
  children: string | JSX.Element | JSX.Element[];
}
export const ContainedDraggable = ({
  zIndex,
  children,
}: ContainedDraggableProps) => {
  const [[left, top], setPosition] = useState([0, 0])
  return (
    <Draggable
      left={left}
      top={top}
      setPosition={useCallback((left: number, top: number) => {
        setPosition([left, top])
      }, [setPosition])}
    >
      {children}
    </Draggable>
  )
}
