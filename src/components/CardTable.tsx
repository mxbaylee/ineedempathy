import React, { useCallback, useState } from 'react'
import { CardProps, Card } from './Card'
import { useDrop } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { TableItem } from './TableItem'
import './CardTable.css'

export interface CardTableProps {
  initialCards: CardProps[]
}

export interface DragItem {
  id: string
}

let zIndexCounter = 0

export const CardTable = ({ initialCards }: CardTableProps) => {
  const [tableItems, setTableItems] = useState<any>(initialCards.reduce((memo, card: CardProps, idx: number) => {
    const id = card.type + card.name
    return {
      ...memo,
      [id]: {
        id, card,
        left: 215 * idx, top: 10,
        zindex: (zIndexCounter++),
      }
    }
  }, {}))

  const moveBox = useCallback((id: string, left: number, top: number) => {
    setTableItems({
      ...tableItems,
      [id]: {
        id, left, top,
        zindex: (zIndexCounter++),
        card: tableItems[id].card
      }
    })
  }, [tableItems, setTableItems])

  const [, drop] = useDrop(() => {
    return {
      accept: 'CardTableItem',
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
    <div ref={drop} className="card-table">
      {Object.keys(tableItems).map((key) => {
        const { zIndex, left, top, card } = tableItems[key]
        return (
          <TableItem
            zIndex={zIndex}
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
