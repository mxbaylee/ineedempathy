import React, { useCallback, useState } from 'react'
import './Card.css'

export enum CardCategory {
  Ruff,
  Meow,
}

export enum CardType {
  Feeling,
  Need,
}

export interface CardProps {
  type: CardType
  name: string
  display?: string
  category: CardCategory
  definition: string
  source: string
  initialFlipped?: boolean
}

export const Card = (props: CardProps) => {
  console.log('unused', props.category, props.definition, props.source)
  const [flipped, setFlipped] = useState<boolean>(!!props.initialFlipped)
  const { type, name, display } = props
  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`
  ) : (
    `/ineedempathy/assets/cards/md/${name}.jpg`
  )

  const flipCard = useCallback(() => {
    setFlipped(!flipped)
  }, [flipped, setFlipped])

  return (
    <div className={"card " + (flipped ? 'back' : 'front')} onClick={flipCard}>
      <img
        alt={name}
        src={cardUrl}
      />
      <span className="title">{(display || name).toUpperCase()}</span>
    </div>
  )
}
