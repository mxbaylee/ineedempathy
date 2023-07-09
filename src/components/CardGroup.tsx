import React from 'react'
import { CardGroupItem } from '../formatters/PrettyFormatter'
import { Draggable } from './Draggable'
import { Card, CardPropsBase } from './Card'
import { SettingsItems } from '../hooks/useSettings'

export interface CardGroupProps {
  zIndexRef: React.MutableRefObject<number>
  cardGroup: CardGroupItem
  setCards: (cards: CardPropsBase[]) => void
  settings: SettingsItems
}

export const CardGroup = (props: CardGroupProps) => {
  const { cardGroup, setCards, settings, zIndexRef } = props
  const cycleCardGroup = () => {
    const newCards = cardGroup.cards.slice()
    const last = newCards.pop()
    if (last) {
      newCards.unshift(last)
    }
    setCards(newCards)
  }
  return (
    <Draggable
      zIndexRef={zIndexRef}
      initialTop={cardGroup.top}
      initialLeft={cardGroup.left}
    >
      { cardGroup.cards.map((card: CardPropsBase, idx: number) => {
        return (
          <Card
            key={idx}
            dataIdx={idx}
            cycleCardGroup={cycleCardGroup}
            {...card}
            volume={settings.volume}
            initialFlipped={cardGroup.flipped || false}
          />
        )
      }) }
    </Draggable>
  )
}
