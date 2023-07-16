import React, { useCallback } from 'react'
import { CardPileItem } from '../formatters/PrettyFormatter'
import { CardPile } from '../components/CardPile'
import { CardPropsBase } from '../components/Card'
import { Draggable } from './Draggable'

export interface DraggableCardPileProps {
  zIndexRef?: React.MutableRefObject<number>
  replaceCardPile: (groups: CardPileItem[]) => void
  cards: CardPropsBase[]
  left: number
  top: number
  flipped: boolean
  hasOverlap: boolean
  setPosition: (left: number, top: number) => void
  mergeOverlappingGroups: () => void
  setFlipped: (value: boolean) => void
}

export const DraggableCardPile = ({
  zIndexRef,
  replaceCardPile,
  cards,
  flipped,
  left,
  top,
  hasOverlap,
  setPosition,
  setFlipped,
  mergeOverlappingGroups,
}: DraggableCardPileProps) => {
  const splitCards = useCallback((cardsOne: CardPropsBase[], cardsTwo: CardPropsBase[]) => {
    replaceCardPile([{
      id: String(Math.random()),
      flipped: flipped,
      top: top + 15,
      left: left + 15,
      cards: cardsOne,
    }, {
      id: String(Math.random()),
      flipped: flipped,
      top: top - 15,
      left: left - 15,
      cards: cardsTwo,
    }])
  }, [left, top, flipped, replaceCardPile])

  const setCards = useCallback((cards: CardPropsBase[]) => {
    replaceCardPile([{
      id: String(Math.random()),
      flipped: flipped,
      top: top,
      left: left,
      cards: cards,
    }])
  }, [top, left, flipped, replaceCardPile])

  const handleDrop = useCallback(() => {
    if (hasOverlap) {
      mergeOverlappingGroups()
    }
  }, [hasOverlap, mergeOverlappingGroups])

  return (
    <Draggable
      handleDrop={handleDrop}
      className={hasOverlap ? 'has-overlap' : ''}
      zIndexRef={zIndexRef}
      left={left}
      top={top}
      setPosition={setPosition}
    >
      <CardPile
        flipped={flipped}
        cards={cards}
        setCards={setCards}
        splitCards={splitCards}
        setFlipped={setFlipped}
      />
    </Draggable>
  )
}
