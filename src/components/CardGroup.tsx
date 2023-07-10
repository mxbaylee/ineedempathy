import React, { useCallback, useState } from 'react'
import { CardGroupOptions } from './CardGroupOptions'
import { Card, CardType, CardPropsBase } from './Card'

export interface CardGroupProps {
  setCards: (cards: CardPropsBase[]) => void
  splitCards: (cardsOne: CardPropsBase[], cardsTwo: CardPropsBase[]) => void
  flipped: boolean
  cards: CardPropsBase[]
}

export interface CardGroupActions {
  cycleCardGroup: () => void
  flipOver: () => void
  handleSecondaryClick: () => void
  closeOptions: () => void
  splitTopCard: () => void
  splitBySize: () => void
  splitByType: () => void
  toggleDefineCard: () => void
}

export const CardGroup = (props: CardGroupProps) => {
  const { flipped: initialFlipped, cards, splitCards, setCards } = props
  const [ flipped, setFlipped ] = useState<boolean>(initialFlipped || false)
  const [ showDefinition, setShowDefinition ] = useState<boolean>(false)
  const [ showOptions, setShowOptions ] = useState<boolean>(false)

  const actions: CardGroupActions = {
    cycleCardGroup: useCallback(() => {
      const newCards = cards.slice()
      const last = newCards.pop()
      if (last) {
        newCards.unshift(last)
      }
      setCards(newCards)
    }, [setCards, cards]),
    flipOver: useCallback(() => {
      setFlipped(!flipped)
    }, [setFlipped, flipped]),
    handleSecondaryClick: useCallback(() => {
      setShowOptions(!showOptions)
    }, [showOptions, setShowOptions]),
    closeOptions: useCallback(() => {
      setShowOptions(false)
    }, [setShowOptions]),
    toggleDefineCard: useCallback(() => {
      setShowDefinition(!showDefinition)
    }, [setShowDefinition, showDefinition]),
    splitTopCard: useCallback(() => {
      const newCards = cards.slice()
      const topCard = newCards.pop()
      if (topCard) {
        splitCards(newCards, [topCard])
      }
    }, [cards, splitCards]),
    splitBySize: useCallback(() => {
      const newCards = cards.slice()
      const firstSet = newCards.slice(0, Math.floor(newCards.length / 2))
      const secondSet = newCards.slice(Math.floor(newCards.length / 2))
      splitCards(firstSet, secondSet)
    }, [cards, splitCards]),
    splitByType: useCallback(() => {
      const newCards = cards.slice()
      const feelings = newCards.filter((card: CardPropsBase) => {
        return card.type === CardType.Feeling
      })
      const needs = newCards.filter((card: CardPropsBase) => {
        return card.type === CardType.Need
      })
      splitCards(feelings, needs)
    }, [cards, splitCards]),
  }

  return (
    <div className={showOptions ? 'card-group options' : 'card-group'}>
      <>
        { cards.map((card: CardPropsBase, idx: number) => {
          return (
            <Card
              key={idx}
              dataIdx={idx}
              actions={actions}
              showDefinition={showDefinition}
              card={card}
              flipped={flipped}
            />
          )
        }) }
      </>
      { showOptions ? (
        <CardGroupOptions
          cards={cards}
          dataIdx={cards.length}
          actions={actions}
        />
      ) : <></>}
    </div>
  )
}
