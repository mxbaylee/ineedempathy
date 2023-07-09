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
  const { cardGroup, setCards, settings, zIndexRef } = props
  const [ flipped, setFlipped ] = useState<boolean>(cardGroup.flipped || false)
  const [ showDefinition, setShowDefinition ] = useState<boolean>(false)
  const [ showOptions, setShowOptions ] = useState<boolean>(false)

  const actions: CardGroupActions = {
    cycleCardGroup: useCallback(() => {
      const newCards = cardGroup.cards.slice()
      const last = newCards.pop()
      if (last) {
        newCards.unshift(last)
      }
      setCards(newCards)
    }, [setCards, cardGroup]),
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
    splitTopCard: () => {
      console.log('not yet implemented')
      debugger
    },
    splitBySize: () => {
      console.log('not yet implemented')
      debugger
    },
    splitByType: () => {
      console.log('not yet implemented')
      debugger
    },
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
              showDefinition={showDefinition}
              {...card}
              volume={settings.volume}
              flipped={flipped}
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
