import React, { CSSProperties, useRef, useCallback, useState } from 'react'
import { useSecondaryClick, useSound } from '../utils'
import { CardGroupActions } from './CardGroup'
import { SourceLink } from './SourceLink'
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
}

export interface CardProps extends CardPropsBase {
  showDefinition: boolean
  flipped: boolean
  volume: number
  dataIdx: number
  actions: CardGroupActions
}

export const Card = (props: CardProps) => {
  const {
    type,
    name,
    display,
    definition,
    source,
    flipped,
    showDefinition,
    dataIdx,
    actions
  } = props
  const dragStartRef = useRef([0,0])
  const [playSound] = useSound(props.volume)

  const wrapSound = useCallback((fn: () => void): () => void => {
    return () => {
      playSound()
      fn()
    }
  }, [playSound])

  const ignoreWhileDragging = useCallback((fn: (...args: any[]) => any): (event: any) => Promise<void> => {
    return (event: any): Promise<void> => {
      const xMatches = event.clientX === dragStartRef.current[0]
      const yMatches = event.clientY === dragStartRef.current[1]
      if (xMatches && yMatches) { return Promise.resolve().then(fn) }
      return Promise.resolve()
    }
  }, [dragStartRef])

  const flipCard = ignoreWhileDragging(
    wrapSound(() => {
      actions.flipOver()
    })
  )

  const cycleCard = ignoreWhileDragging(
    wrapSound(() => {
      actions.cycleCardGroup()
    })
  )

  const [onMouseDown, onTouchStart] = useSecondaryClick(
    actions.handleSecondaryClick
  )

  const handleMouseDown = useCallback((event: any) => {
    dragStartRef.current = [event.clientX, event.clientY]
    playSound()
    return onMouseDown(event)
  }, [onMouseDown, playSound, dragStartRef])

  const handleDrag = (event: any) => {
    event.preventDefault()
  }

  const cardClasses = ['card']
  cardClasses.push(flipped ? 'back' : 'front')
  cardClasses.push(showDefinition ? 'text' : 'graphic')

  const classicNoop = (event: any) => {
    event.stopPropagation()
  }

  return (
    <div
      className={cardClasses.join(' ')}
      onMouseDown={handleMouseDown}
      onTouchStart={onTouchStart}
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
      <div
        onMouseDown={classicNoop}
        onTouchStart={classicNoop}
        onClick={classicNoop}
        className="definition"
      >
        <dl>
          <dt>{(display || name).toUpperCase()}</dt>
          <dd>{definition}</dd>
          <dd><SourceLink url={source} /></dd>
        </dl>
        <ul>
          <li onClick={actions.toggleDefineCard}>Dismiss</li>
        </ul>
      </div>
    </div>
  )
}
