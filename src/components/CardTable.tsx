import React, { ReactElement, useCallback, useState } from 'react'
import { CardProps, Card } from './Card'
import { useDrop } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { TableItem } from './TableItem'
import { DragItem, DragCard, PrettyFormatter } from './formatters/PrettyFormatter'
import { PreferenceItems } from '../hooks/preferences'
import './CardTable.css'

export interface CardTableProps {
  initialCards: CardProps[]
  windows: ReactElement[]
  preferences: PreferenceItems
}

let zIndexCounter = 0

export const CardTable = ({ windows, initialCards, preferences }: CardTableProps) => {
  const [tableCards, setTableCards] = useState<Record<string, DragCard>>(
    initialCards.reduce(PrettyFormatter , {})
  )

  const [windowPos, setWindowPos] = useState<DragItem[]>(
    windows.reduce((memo: DragItem[], WindowItem: ReactElement, idx: number): DragItem[] => { 
      memo.push({
        id: 'window-' + idx,
        zIndex: 99999,
        left: 0,
        top: 0
      })
      return memo
    }, [])
  )

  const moveBox = useCallback((id: string, left: number, top: number) => {
    if (id.match(/window/)) {
      setWindowPos([...windowPos].map((item: DragItem) => {
        if (item.id !== id) {
          return item
        }
        return {
          ...item,
          left, top,
        }
      }))
    } else {
      setTableCards({
        ...tableCards,
        [id]: {
          ...tableCards[id],
          left, top,
          zIndex: (zIndexCounter++),
        }
      })
    }
  }, [windowPos, setWindowPos, tableCards, setTableCards])

  const [, drop] = useDrop(() => {
    return {
      accept: 'CardTableItem',
      drop({ id }: DragItem, monitor) {
        const item = tableCards[id] || windowPos.find(pos => pos.id === id) || {
          left: 0,
          top: 0,
        }
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
      },
    }
  }, [moveBox])

  return (
    <div ref={drop} className="card-table">
      {windows.map((WindowItem: ReactElement, idx: number) => {
        const { zIndex, id, left, top } = windowPos[idx]
        const isVisible = preferences[WindowItem.key as keyof PreferenceItems]
        if (!isVisible) return <></>
        return (
          <TableItem
            key={idx}
            zIndex={zIndex}
            id={id}
            left={left}
            top={top}
          >
            {WindowItem}
          </TableItem>
        )
      })}
      {Object.keys(tableCards).map((key) => {
        const { zIndex, left, top, card } = tableCards[key]
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
