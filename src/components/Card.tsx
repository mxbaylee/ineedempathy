import React, { useState } from 'react';
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
  category?: CardCategory
  definition?: string
  source?: string
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(false)
  const back = CardType[props.type].toLowerCase()
  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${back}_back.jpg`
  ) : (
    `/ineedempathy/assets/cards/${props.name}.jpg`
  )
  const flipCard = () => {
    setFlipped(!flipped)
  }

  return (
    <div className="card" onClick={flipCard}>
      <img
        alt={props.name}
        src={cardUrl}
      />
    </div>
  )
}
