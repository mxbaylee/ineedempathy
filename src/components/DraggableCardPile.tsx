import React from 'react'
import { CardPile } from '../components/CardPile'
import { CardPropsBase } from './Card'
import { Draggable } from './Draggable'

export interface DraggableCardPileProps {
  zIndexRef?: React.MutableRefObject<number>
  left: number
  top: number
  flipped: boolean
  cards: CardPropsBase[]
  splitByType: () => void
  splitBySize: () => void
  splitTopCard: () => void
  cycleCards: () => void
  flipOver: () => void
  hasOverlap: (left: number, top: number) => boolean
  setPosition: (left: number, top: number) => void
  mergeOverlappingGroups: (left: number, top: number) => void
}

// TODO passthrough group can be axed
export const DraggableCardPile = ({
  zIndexRef,
  left,
  top,
  flipped,
  cards,
  splitByType,
  splitBySize,
  splitTopCard,
  cycleCards,
  flipOver,
  hasOverlap,
  setPosition,
  mergeOverlappingGroups,
}: DraggableCardPileProps) => {
  return (
    <Draggable
      zIndexRef={zIndexRef}
      left={left}
      top={top}
      setPosition={setPosition}
      hasOverlap={hasOverlap}
      mergeOverlappingGroups={mergeOverlappingGroups}
    >
      <CardPile
        flipped={flipped}
        cards={cards}
        splitByType={splitByType}
        splitBySize={splitBySize}
        splitTopCard={splitTopCard}
        cycleCards={cycleCards}
        flipOver={flipOver}
      />
    </Draggable>
  )
}
