import React, { useState } from 'react'
import { Draggable } from './Draggable'

export interface ContainedDraggableProps {
  zIndex?: number
  children: string | JSX.Element | JSX.Element[];
}
export const ContainedDraggable = ({
  zIndex,
  children,
}: ContainedDraggableProps) => {
  const [[top, left], setPosition] = useState([0, 0])
  return (
    <Draggable
      top={top}
      left={left}
      setPosition={(left: number, top: number) => {
        setPosition([left, top])
      }}
    >
      {children}
    </Draggable>
  )
}
