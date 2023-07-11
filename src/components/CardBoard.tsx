import React, { useRef, useCallback, useState } from 'react'
import { CardDefinitions } from '../CardDefinitions'
import { CardGroupItem, PrettyFormatter } from '../formatters/PrettyFormatter'
import { DraggableCardPile } from '../components/DraggableCardPile'
import { doCardsOverlap } from '../utils'

export interface CardBoardProps {
}

export const CardBoard = (props: CardBoardProps) => {
  const zIndexRef = useRef(1)
  const [cardGroups, setCardGroups] = useState<CardGroupItem[]>(
    PrettyFormatter(CardDefinitions)
  )

  const hasOverlap = useCallback((cardGroup: CardGroupItem): boolean => {
    return cardGroups.reduce((
      memo: boolean,
      cardGroupInner: CardGroupItem,
    ): boolean => {
      if (!memo && cardGroup.id !== cardGroupInner.id) {
        return doCardsOverlap(
          [cardGroup.left, cardGroup.top],
          [cardGroupInner.left, cardGroupInner.top],
        )
      }
      return memo
    }, false)
  }, [cardGroups])

  const mergeOverlappingGroups = useCallback((idx: number) => {
    return () => {
      const newCardGroups = cardGroups.slice()
      const mergeFrom = newCardGroups.splice(idx, 1)[0]
      const mergeToIdx = newCardGroups.findIndex((cardGroup: CardGroupItem) => {
        return doCardsOverlap(
          [mergeFrom.left, mergeFrom.top],
          [cardGroup.left, cardGroup.top],
        )
      })
      if (mergeFrom && mergeToIdx >= 0) {
        const mergeTo = newCardGroups.splice(mergeToIdx, 1)[0]
        const newCardList = mergeTo.cards.slice()
        newCardList.push(...mergeFrom.cards)
        newCardGroups.push({
          id: String(Math.random()),
          left: mergeTo.left,
          top: mergeTo.top,
          flipped: mergeTo.flipped,
          cards: newCardList,
        })
        setCardGroups(newCardGroups)
      }
    }
  }, [cardGroups, setCardGroups])

  return (
    <div className="card-board">
      {cardGroups.map((cardGroup: CardGroupItem, idx: number) => {
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
              const newCardGroups = cardGroups.slice()
              // intentional mutation
              newCardGroups[idx].flipped = value
              setCardGroups(newCardGroups)
            }}
            setPosition={(left: number, top: number) => {
              const newCardGroups = cardGroups.slice()
              // intentional mutation
              newCardGroups[idx].left = left
              newCardGroups[idx].top = top
              setCardGroups(newCardGroups)
            }}
            replaceCardGroup={(newGroups: CardGroupItem[]) => {
              const newCardGroups = cardGroups.slice()
              newCardGroups.splice(idx, 1)
              newCardGroups.push(...newGroups)
              setCardGroups(newCardGroups)
            }}
          />
        )
      })}
    </div>
  )
}
