import React, { useCallback, useState } from 'react'
import { CardPileOptions } from './CardPileOptions'
import { Card, CardPropsBase } from './Card'

export interface CardPileProps {
  flipped: boolean
  cards: CardPropsBase[]
  splitByType: () => void
  splitBySize: () => void
  splitTopCard: () => void
  cycleCards: () => void
  flipOver: () => void
}

export const CardPile = (props: CardPileProps) => {
  const { cards, flipped, flipOver, cycleCards } = props
  const { splitByType, splitBySize, splitTopCard } = props
  const [ showDefinition, setShowDefinition ] = useState<boolean>(false)
  const [ showOptions, setShowOptions ] = useState<boolean>(false)

  const handleSecondaryClick = useCallback(() => {
    setShowOptions(!showOptions)
  }, [showOptions, setShowOptions])

  const closeOptions = useCallback(() => {
    setShowOptions(false)
  }, [setShowOptions])

  const toggleDefineCard = useCallback(() => {
    setShowDefinition(!showDefinition)
  }, [setShowDefinition, showDefinition])

  const classNames: string[] = []
  classNames.push('card-group')
  showOptions && classNames.push('options')

  return (
    <div className={classNames.join(' ')}>
      <>
        { cards.map((card: CardPropsBase, idx: number) => {
          return (
            <Card
              key={`${cards.length}|${idx}`}
              card={card}
              flipped={flipped}
              showDefinition={showDefinition}
              dataIdx={idx}
              onlyCard={cards.length === 1}
              flipOver={flipOver}
              cycleCardPile={cycleCards}
              handleSecondaryClick={handleSecondaryClick}
              toggleDefineCard={toggleDefineCard}
            />
          )
        }) }
      </>
      { showOptions ? (
        <CardPileOptions
          cards={cards}
          dataIdx={cards.length}
          flipOver={flipOver}
          toggleDefineCard={toggleDefineCard}
          closeOptions={closeOptions}
          handleSecondaryClick={handleSecondaryClick}
          splitByType={splitByType}
          splitBySize={splitBySize}
          splitTopCard={splitTopCard}
        />
      ) : <></>}
    </div>
  )
}
