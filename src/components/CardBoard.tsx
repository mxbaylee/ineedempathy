import React, { useRef, useState } from 'react'
import { CardDefinitions } from '../CardDefinitions'
import { CardGroupItem, PrettyFormatter } from '../formatters/PrettyFormatter'
import { CardGroup } from '../components/CardGroup'
import { CardPropsBase } from '../components/Card'
import { Draggable } from './Draggable'

export interface CardBoardProps {

}

export const CardBoard = (props: CardBoardProps) => {
  const zIndexRef = useRef(1)
  const [cardGroups, setCardGroups] = useState<CardGroupItem[]>(
    PrettyFormatter(CardDefinitions)
  )

  return (
    <div className="card-board">
      {cardGroups.map((cardGroup: CardGroupItem, idx: number) => {
        const splitCards = (cardsOne: CardPropsBase[], cardsTwo: CardPropsBase[]) => {
          const newCardGroupItems = cardGroups.slice()
          newCardGroupItems[idx] = {
            ...newCardGroupItems[idx],
            cards: cardsOne,
          }
          newCardGroupItems.push({
            ...newCardGroupItems[idx],
            cards: cardsTwo,
          })
          setCardGroups(newCardGroupItems)
        }
        const setCards = (cards: CardPropsBase[]) => {
          const newCardGroupItems = cardGroups.slice()
          newCardGroupItems[idx] = {
            ...newCardGroupItems[idx],
            cards: cards,
          }
          setCardGroups(newCardGroupItems)
        }
        return (
          <Draggable
            key={idx}
            zIndexRef={zIndexRef}
            initialTop={cardGroup.top}
            initialLeft={cardGroup.left}
          >
            <CardGroup
              flipped={cardGroup.flipped}
              cards={cardGroup.cards}
              setCards={setCards}
              splitCards={splitCards}
            />
          </Draggable>
        )
      })}
    </div>
  )
}
