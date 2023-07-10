import React, { useRef, useState } from 'react'
import { CardDefinitions } from '../CardDefinitions'
import { CardGroupItem, PrettyFormatter } from '../formatters/PrettyFormatter'
import { DraggableCardPile } from '../components/DraggableCardPile'

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
        return (
          <DraggableCardPile
            key={cardGroup.id}
            zIndexRef={zIndexRef}
            cardGroup={cardGroup}
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
