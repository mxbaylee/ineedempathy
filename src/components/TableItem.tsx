import { useDrag } from 'react-dnd'
import React from 'react'
import './TableItem.css'

export interface TableItemProps {
  id: any
  left: number
  top: number
  zIndex: number
  children?: any
}

export const TableItem = ({ id, zIndex = 0, left = 0, top = 0, children }: TableItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CardTableItem',
    item: { id, left, top, zIndex },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, left, top])

  if (isDragging) {
    return <div ref={drag} />
  }

  return (
    <div
      className="table-item"
      ref={drag}
      style={{ zIndex, left, top }}
    >
      {children}
    </div>
  )
}
