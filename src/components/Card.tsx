import React, { CSSProperties, useRef, useCallback, useState } from 'react'
import { throttle } from '../utils'
import { Howl } from 'howler';
import './css/Card.css'

export enum CardCategory {
  Ruff,
  Meow,
}

export enum CardType {
  Feeling,
  Need,
}

export interface CardPropsBase {
  type: CardType
  name: string
  display?: string
  category: CardCategory
  definition: string
  source: string
  initialFlipped?: boolean
}

export interface CardProps extends CardPropsBase {
  initialFlipped: boolean
  volume: number
  dataIdx: number
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(!!props.initialFlipped)
  const { type, name, display, dataIdx } = props
  const dragStartRef = useRef([0,0])
  const cardUrl = flipped ? (
    `/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`
  ) : (
    `/ineedempathy/assets/cards/md/${name}.jpg`
  )
  const sound = new Howl({
    volume: (props.volume || 4) / 10,
    src: ['/ineedempathy/assets/audio/toggle-card.mp3'],
  });
  const playSound = throttle(() => { sound.play() })

  const flipCard = useCallback((event: any) => {
    const xMatches = event.clientX === dragStartRef.current[0]
    const yMatches = event.clientY === dragStartRef.current[1]
    // Only flip if it didn't move between mouseDown and click
    if (xMatches && yMatches) {
      setFlipped(!flipped)
      playSound()
    }
  }, [playSound, flipped, setFlipped])

  const handleMouseDown = (event: any) => {
    dragStartRef.current = [event.clientX, event.clientY]
    playSound()
    if (event.button === 2) {
      console.log('handle right click')
    }
  };

  const handleDrag = (event: any) => {
    event.preventDefault()
  }

  return (
    <div
      className={"card " + (flipped ? 'back' : 'front')}
      onMouseDown={handleMouseDown}
      onTouchStart={playSound}
      onDrag={handleDrag}
      onClick={flipCard}
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
    >
      <img
        alt={name}
        src={cardUrl}
      />
      <span className="title">{(display || name).toUpperCase()}</span>
    </div>
  )
}
