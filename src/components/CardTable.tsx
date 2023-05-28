import React, { useCallback, useState } from 'react'
import { CardType, CardProps, Card } from './Card'
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
    const columnWidth = window.innerWidth / 2
    const cardWidth = 210
    const sidePadding = (columnWidth-cardWidth)/2
    const columnPadding = columnWidth * (
      card.type === CardType.Feeling ? 0 : 1
    )
    const firstOfItsType = !Object.values(memo).find((previousCard: any) => {
      return previousCard.card.type === card.type
    })

    const top = firstOfItsType ? (
      30
    ) : (
      400 - (idx * 0.5)
    )
    const left = firstOfItsType ? (
      card.type === CardType.Feeling ? (
        columnWidth - cardWidth
      ) : (
        columnWidth + 1
      )
    ) : (
      sidePadding + columnPadding + idx
    )

    return {
      ...memo,
      [id]: {
        id, top, left,
        zIndex: (zIndexCounter++),
        card: {
          initialFlipped: firstOfItsType,
          ...card,
        },
      }
    }
  }, {}))

  const moveBox = useCallback((id: string, left: number, top: number) => {
    setTableItems({
      ...tableItems,
      [id]: {
        card: tableItems[id].card,
        id, left, top,
        zIndex: (zIndexCounter++),
      }
    })
    console.log({zIndexCounter})
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
