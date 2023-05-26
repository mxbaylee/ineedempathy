import React, { useState } from 'react';
import './Card.css'

export interface CardProps {
  type: 'feeling' | 'need'
  name: string
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(false)

  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${props.type}_back.jpg`
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
