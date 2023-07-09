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
  cycleCardGroup: () => void
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(!!props.initialFlipped)
  const { type, name, display, dataIdx, cycleCardGroup } = props
  const dragStartRef = useRef([0,0])
  const sound = new Howl({
    volume: (props.volume || 4) / 10,
    src: ['/ineedempathy/assets/audio/toggle-card.mp3'],
  });
  const playSound = throttle(() => { sound.play() })

  const ignoreWhileDragging = useCallback((fn: (...args: any[]) => any): (event: any) => Promise<void> => {
    return (event: any): Promise<void> => {
      const xMatches = event.clientX === dragStartRef.current[0]
      const yMatches = event.clientY === dragStartRef.current[1]
      if (xMatches && yMatches) {
        return Promise.resolve().then(fn)
      }
      return Promise.resolve()
    }
  }, [dragStartRef])

  const flipCard = ignoreWhileDragging(useCallback((event: any) => {
    setFlipped(!flipped)
    playSound()
  }, [playSound, flipped, setFlipped]))

  const cycleCard = ignoreWhileDragging(useCallback((event: any) => {
    cycleCardGroup()
    playSound()
  }, [playSound, cycleCardGroup]))

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
      onClick={flipped || dataIdx === 0 ? flipCard : cycleCard}
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
    >
      <img
        className="card-back"
        alt={name}
        src={`/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`}
      />
      <img
        className="card-front"
        alt={name}
        src={`/ineedempathy/assets/cards/md/${name}.jpg`}
      />
      <span className="title">{(display || name).toUpperCase()}</span>
    </div>
  )
}
