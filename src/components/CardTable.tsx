import React, { useRef, useCallback, useState } from 'react'
import { CardDefinitions } from '../CardDefinitions'
import { CardPileItem, PrettyFormatter } from '../formatters/PrettyFormatter'
import { DraggableCardPile } from '../components/DraggableCardPile'
import { doCardsOverlap } from '../utils'

export interface CardTableProps {
  cardSize: number
}

export const CardTable = ({ cardSize }: CardTableProps) => {
  const zIndexRef = useRef(1)
  const [cardGroups, setCardPiles] = useState<CardPileItem[]>(
    PrettyFormatter(CardDefinitions, cardSize)
  )

  const hasOverlap = useCallback((cardGroup: CardPileItem): boolean => {
    return cardGroups.reduce((
      memo: boolean,
      cardGroupInner: CardPileItem,
    ): boolean => {
      if (!memo && cardGroup.id !== cardGroupInner.id) {
        return doCardsOverlap(
          cardSize,
          [cardGroup.left, cardGroup.top],
          [cardGroupInner.left, cardGroupInner.top],
        )
      }
      return memo
    }, false)
  }, [cardSize, cardGroups])

  const mergeOverlappingGroups = useCallback((idx: number) => {
    return () => {
      const newCardPiles = cardGroups.slice()
      const mergeFrom = newCardPiles.splice(idx, 1)[0]
      const mergeToIdx = newCardPiles.findIndex((cardGroup: CardPileItem) => {
        return doCardsOverlap(
          cardSize,
          [mergeFrom.left, mergeFrom.top],
          [cardGroup.left, cardGroup.top],
        )
      })
      if (mergeFrom && mergeToIdx >= 0) {
        const mergeTo = newCardPiles.splice(mergeToIdx, 1)[0]
        const newCardList = mergeTo.cards.slice()
        newCardList.push(...mergeFrom.cards)
        newCardPiles.push({
          id: String(Math.random()),
          left: mergeTo.left,
          top: mergeTo.top,
          flipped: mergeTo.flipped,
          cards: newCardList,
        })
        setCardPiles(newCardPiles)
      }
    }
  }, [cardSize, cardGroups, setCardPiles])

  return (
    <div className="card-board">
      {cardGroups.map(useCallback((cardGroup: CardPileItem, idx: number) => {
        return (
          <DraggableCardPile
            key={cardGroup.id}
            zIndexRef={zIndexRef}
            cards={cardGroup.cards}
            flipped={cardGroup.flipped}
            left={cardGroup.left}
            top={cardGroup.top}
            hasOverlap={hasOverlap(cardGroup)}
            mergeOverlappingGroups={mergeOverlappingGroups(idx)}
            setFlipped={(value: boolean) => {
              const newCardPiles = cardGroups.slice()
              // intentional mutation
              newCardPiles[idx].flipped = value
              setCardPiles(newCardPiles)
            }}
            setPosition={(left: number, top: number) => {
              const newCardPiles = cardGroups.slice()
              // intentional mutation
              newCardPiles[idx].left = left
              newCardPiles[idx].top = top
              setCardPiles(newCardPiles)
            }}
            replaceCardPile={(newGroups: CardPileItem[]) => {
              const newCardPiles = cardGroups.slice()
              newCardPiles.splice(idx, 1)
              newCardPiles.push(...newGroups)
              setCardPiles(newCardPiles)
            }}
          />
        )
      }, [cardGroups, hasOverlap, mergeOverlappingGroups]))}
    </div>
  )
}
