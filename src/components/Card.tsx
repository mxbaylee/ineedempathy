import React, { useCallback, useState } from 'react'
import './Card.css'

export const ItemTypes = {
  BOX: 'box',
}

export enum CardCategory {
  Ruff,
  Meow,
}

export enum CardType {
  Feeling,
  Need,
}

export interface CardProps {
  top?: number
  left?: number
  type: CardType
  name: string
  category?: CardCategory
  definition?: string
  source?: string
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(false)
  const { type, name } = props
  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`
  ) : (
    `/ineedempathy/assets/cards/${name}.jpg`
  )

  const flipCard = useCallback(() => {
    setFlipped(!flipped)
  }, [flipped, setFlipped])

  return (
    <div className="card" onClick={flipCard}>
      <img
        alt={name}
        src={cardUrl}
      />
    </div>
  )
}
