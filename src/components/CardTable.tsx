import React, { useCallback, useState } from 'react'
import { ItemTypes, CardProps, Card } from './Card'
import { useDrop } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { TableItem } from './TableItem'

export interface CardTableProps {
  initialCards: CardProps[]
}

export interface DragItem {
  id: string
}

export const CardTable = ({ initialCards }: CardTableProps) => {
  const [tableItems, setTableItems] = useState<any>(initialCards.reduce((memo, card: CardProps) => {
    const id = card.type + card.name
    return {
      ...memo,
      [id]: { id, left: 20, top: 80, card }
    }
  }, {}))

  const moveBox = useCallback((id: string, left: number, top: number) => {
    setTableItems({
      ...tableItems,
      [id]: { id, left, top, card: tableItems[id].card }
    })
  }, [tableItems, setTableItems])

  const [, drop] = useDrop(() => {
    return {
      accept: ItemTypes.BOX,
      drop({ id }: DragItem, monitor) {
        const item = tableItems[id]
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
      },
    }
  }, [moveBox])

  return (
    <div ref={drop} className="board">
      {Object.keys(tableItems).map((key) => {
        const { left, top, card } = tableItems[key]
        return (
          <TableItem
            key={key}
            id={key}
            left={left}
            top={top}
          >
            <Card {...card} />
          </TableItem>
        )
      })}
    </div>
  )
}
