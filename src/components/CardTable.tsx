import React, { useCallback, useState } from 'react'
import { CardType, CardProps, Card } from './Card'
import { useDrop } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { TableItem } from './TableItem'
import { Help } from './Help'
import './CardTable.css'

export interface CardTableProps {
  helpVisible: boolean
  setHelpVisible: (value: boolean) => void
  initialCards: CardProps[]
}

export interface DragItem {
  id: string
}

let zIndexCounter = 0

export const CardTable = ({ helpVisible, setHelpVisible, initialCards }: CardTableProps) => {
  const [tableItems, setTableItems] = useState<any>(initialCards.reduce((memo, card: CardProps, idx: number) => {
    const id = card.type + card.name

    const firstOfItsType = () => {
      return !Object.values(memo).find((previousCard: any) => {
        return previousCard.card.type === card.type
      })
    }

    const top = (() => {
      return firstOfItsType() ? (
        30
      ) : (
        400 - (idx * 0.5)
      )
    })()

    const left = (() => {
      const columnWidth = window.innerWidth / 2
      const cardWidth = 210
      const sidePadding = (columnWidth-cardWidth)/2
      const columnPadding = columnWidth * (
        card.type === CardType.Feeling ? 0 : 1
      )
      return firstOfItsType() ? (
        card.type === CardType.Feeling ? (
          columnWidth - cardWidth
        ) : (
          columnWidth + 1
        )
      ) : (
        sidePadding + columnPadding + idx
      )
    })()

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

  const [[helpLeft, helpTop], setHelpLeftTop] = useState<[number, number]>([0,0])

  const moveBox = useCallback((id: string, left: number, top: number) => {
    console.log({id})
    if (id === 'help-menu') {
      setHelpLeftTop([left, top])
      return
    }
    setTableItems({
      ...tableItems,
      [id]: {
        card: tableItems[id].card,
        id, left, top,
        zIndex: (zIndexCounter++),
      }
    })
    console.log({zIndexCounter})
  }, [setHelpLeftTop, tableItems, setTableItems])

  const [, drop] = useDrop(() => {
    return {
      accept: 'CardTableItem',
      drop({ id }: DragItem, monitor) {
        const item = tableItems[id] || {
          id,
          left: helpLeft,
          top: helpTop,
        }
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
      },
    }
  }, [helpLeft, helpTop, moveBox])

  return (
    <div ref={drop} className="card-table">
      {helpVisible && (
        <TableItem
          zIndex={999999}
          id={'help-menu'}
          left={helpLeft}
          top={helpTop}
        >
          <Help setHelpVisible={setHelpVisible} />
        </TableItem>
      )}
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
