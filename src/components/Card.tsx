import React, { CSSProperties, useRef, useCallback, useState } from 'react'
import { useSound } from '../utils'
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
  actions: Record<string, () => void>
}

export const Card = (props: CardProps) => {
  const [flipped, setFlipped] = useState<boolean>(!!props.initialFlipped)
  const { type, name, display, dataIdx, actions } = props
  const dragStartRef = useRef([0,0])
  const [playSound] = useSound(props.volume)

  const ignoreWhileDragging = useCallback((fn: (...args: any[]) => any): (event: any) => Promise<void> => {
    return (event: any): Promise<void> => {
      const xMatches = event.clientX === dragStartRef.current[0]
      const yMatches = event.clientY === dragStartRef.current[1]
      if (xMatches && yMatches) { return Promise.resolve().then(fn) }
      return Promise.resolve()
    }
  }, [dragStartRef])

  const flipCard = ignoreWhileDragging(useCallback((event: any) => {
    setFlipped(!flipped)
    playSound()
  }, [playSound, flipped, setFlipped]))

  const cycleCard = ignoreWhileDragging(useCallback((event: any) => {
    actions.cycleCardGroup()
    playSound()
  }, [playSound, actions]))

  const handleMouseDown = useCallback((event: any) => {
    dragStartRef.current = [event.clientX, event.clientY]
    playSound()
    if (event.button === 2) {
      const preventRightClickMenu = (event: any) => {
        event.preventDefault();
      }
      document.addEventListener('contextmenu', preventRightClickMenu);
      setTimeout(() => {
        document.removeEventListener("contextmenu", preventRightClickMenu);
      }, 0)
      actions.handleSecondaryClick()
    }
  }, [actions, playSound, dragStartRef])

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
        onMouseDown={handleMouseDown}
        className="card-back"
        alt={name}
        src={`/ineedempathy/assets/cards/${CardType[type].toLowerCase()}_back.jpg`}
      />
      <img
        onMouseDown={handleMouseDown}
        className="card-front"
        alt={name}
        src={`/ineedempathy/assets/cards/md/${name}.jpg`}
      />
      <span className="title">{(display || name).toUpperCase()}</span>
    </div>
  )
}
