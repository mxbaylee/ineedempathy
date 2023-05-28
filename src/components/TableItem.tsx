import { useDrag } from 'react-dnd'
import React from 'react'
import { ItemTypes } from './Card'

export interface TableItemProps {
  id: any
  left: number
  top: number
  children?: any
}

export const TableItem = ({ id, left = 0, top = 0, children }: TableItemProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )

  if (isDragging) {
    return <div ref={drag} />
  }
  return (
    <div
      className="box"
      ref={drag}
      style={{ left, top }}
      data-testid="box"
    >
      {children}
    </div>
  )
}
