import React, { useCallback } from 'react'
import { CardGroupItem } from '../formatters/PrettyFormatter'
import { CardGroup } from '../components/CardGroup'
import { CardPropsBase } from '../components/Card'
import { Draggable } from './Draggable'

export interface DraggableCardPileProps {
  zIndexRef?: React.MutableRefObject<number>
  replaceCardGroup: (groups: CardGroupItem[]) => void
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
  replaceCardGroup,
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
    replaceCardGroup([{
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
  }, [left, top, flipped, replaceCardGroup])

  const setCards = useCallback((cards: CardPropsBase[]) => {
    replaceCardGroup([{
      id: String(Math.random()),
      flipped: flipped,
      top: top,
      left: left,
      cards: cards,
    }])
  }, [top, left, flipped, replaceCardGroup])

  const handleClick = useCallback(() => {
    if (hasOverlap) {
      mergeOverlappingGroups()
    }
  }, [hasOverlap, mergeOverlappingGroups])

  return (
    <Draggable
      handleClick={handleClick}
      className={hasOverlap ? 'has-overlap' : ''}
      zIndexRef={zIndexRef}
      left={left}
      top={top}
      setPosition={setPosition}
    >
      <CardGroup
        flipped={flipped}
        cards={cards}
        setCards={setCards}
        splitCards={splitCards}
        setFlipped={setFlipped}
      />
    </Draggable>
  )
}
