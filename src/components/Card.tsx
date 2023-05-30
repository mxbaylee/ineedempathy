import React, { useCallback, useState } from 'react'
import { Howl } from 'howler';
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
  volume?: number
}

export const Card = (props: CardProps) => {

  const [flipped, setFlipped] = useState<boolean>(!!props.initialFlipped)
  const { type, name, display } = props
  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`
  ) : (
    `/ineedempathy/assets/cards/md/${name}.jpg`
  )
  const sound = new Howl({
    volume: (props.volume || 4) / 10,
    src: ['/ineedempathy/assets/audio/toggle-card.mp3'],
  });

  const flipCard = useCallback(() => {
    setFlipped(!flipped)
  }, [flipped, setFlipped])

  const handleDoubleClick = () => {
    console.log('double click')
  }

  const handleMouseDown = (event: any) => {
    sound.play()
    if (event.button === 2) {
      console.log('handle right click')
    }
  };

  return (
    <div
      className={"card " + (flipped ? 'back' : 'front')}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onClick={flipCard}
    >
      <img
        alt={name}
        src={cardUrl}
      />
      <span className="title">{(display || name).toUpperCase()}</span>
    </div>
  )
}
