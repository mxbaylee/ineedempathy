import React, { useCallback, useState } from 'react'
import { CardGroupItem } from '../formatters/PrettyFormatter'
import { Draggable } from './Draggable'
import { CardGroupOptions } from './CardGroupOptions'
import { Card, CardPropsBase } from './Card'
import { SettingsItems } from '../hooks/useSettings'

export interface CardGroupProps {
  zIndexRef: React.MutableRefObject<number>
  cardGroup: CardGroupItem
  setCards: (cards: CardPropsBase[]) => void
  settings: SettingsItems
}

export const CardGroup = (props: CardGroupProps) => {
  const [ showOptions, setShowOptions ] = useState<boolean>(false)
  const { cardGroup, setCards, settings, zIndexRef } = props

  const actions = {
    cycleCardGroup: useCallback(() => {
      const newCards = cardGroup.cards.slice()
      const last = newCards.pop()
      if (last) {
        newCards.unshift(last)
      }
      setCards(newCards)
    }, [setCards, cardGroup]),
    handleSecondaryClick: useCallback(() => {
      setShowOptions(!showOptions)
    }, [showOptions, setShowOptions])
  }
  return (
    <Draggable
      className={showOptions ? 'card-group options' : 'card-group' }
      zIndexRef={zIndexRef}
      initialTop={cardGroup.top}
      initialLeft={cardGroup.left}
    >
      <>
        { cardGroup.cards.map((card: CardPropsBase, idx: number) => {
          return (
            <Card
              key={idx}
              dataIdx={idx}
              actions={actions}
              {...card}
              volume={settings.volume}
              initialFlipped={cardGroup.flipped || false}
            />
          )
        }) }
      </>
      { showOptions ? (
        <CardGroupOptions
          cards={cardGroup.cards}
          dataIdx={cardGroup.cards.length}
          volume={settings.volume}
          actions={actions}
        />
      ) : <></>}
    </Draggable>
  )
}
