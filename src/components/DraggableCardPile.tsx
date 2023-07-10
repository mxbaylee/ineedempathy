import React, { useState, useCallback } from 'react'
import { CardGroupItem } from '../formatters/PrettyFormatter'
import { CardGroup } from '../components/CardGroup'
import { CardPropsBase } from '../components/Card'
import { Draggable } from './Draggable'

export interface DraggableCardPileProps {
  zIndexRef?: React.MutableRefObject<number>
  replaceCardGroup: (groups: CardGroupItem[]) => void
  cardGroup: CardGroupItem
}

export const DraggableCardPile = ({
  zIndexRef,
  replaceCardGroup,
  cardGroup,
}: DraggableCardPileProps) => {
  const [{left, top}, _setPosition] = useState<{top: number, left: number}>({
    left: cardGroup.left,
    top: cardGroup.top,
  })
  const splitCards = useCallback((cardsOne: CardPropsBase[], cardsTwo: CardPropsBase[]) => {
    replaceCardGroup([{
      id: String(Math.random()),
      flipped: cardGroup.flipped,
      top: top + 15,
      left: left + 15,
      cards: cardsOne,
    }, {
      id: String(Math.random()),
      flipped: cardGroup.flipped,
      top: top - 15,
      left: left - 15,
      cards: cardsTwo,
    }])
  }, [left, top, cardGroup, replaceCardGroup])

  const setCards = useCallback((cards: CardPropsBase[]) => {
    replaceCardGroup([{
      id: String(Math.random()),
      flipped: cardGroup.flipped,
      top: top,
      left: left,
      cards: cards,
    }])
  }, [top, left, cardGroup, replaceCardGroup])

  const setPosition = (left: number, top: number) => {
    _setPosition({left, top})
  }

  return (
    <Draggable
      key={cardGroup.id}
      zIndexRef={zIndexRef}
      left={left}
      top={top}
      setPosition={setPosition}
    >
      <CardGroup
        flipped={cardGroup.flipped}
        cards={cardGroup.cards}
        setCards={setCards}
        splitCards={splitCards}
      />
    </Draggable>
  )
}
