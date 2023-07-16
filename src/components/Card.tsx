import React, { CSSProperties, useState, useCallback } from 'react'
import { getDistance, useSecondaryClick, useSound } from '../utils'
import { CardPileActions } from './CardPile'
import { SourceLink } from './SourceLink'
import { useSettings } from '../hooks/useSettings'
import './css/Card.css'

export enum CardCategory {
  Ruff,
  Meow, }
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

export interface CardProps {
  showDefinition: boolean
  flipped: boolean
  dataIdx: number
  actions: CardPileActions
  card: CardPropsBase
}

export const Card = (props: CardProps) => {
  const {
    card,
    flipped,
    showDefinition,
    dataIdx,
    actions
  } = props
  const [lastPosition, setLastPosition] = useState<[number, number]>([0,0])
  const [{volume}] = useSettings()
  const [playSound] = useSound(volume)

  const wrapSound = useCallback((fn: () => void): () => void => {
    return () => {
      playSound()
      fn()
    }
  }, [playSound])

  const ignoreWhileDragging = useCallback((fn: (...args: any[]) => any): (event: any) => Promise<void> => {
    return (event: any): Promise<void> => {
      const distance = getDistance(
        event.clientX,
        event.clientY,
        lastPosition[0],
        lastPosition[1]
      )
      if (distance < 10) { return Promise.resolve().then(fn) }
      return Promise.resolve()
    }
  }, [lastPosition])

  const flipCard = ignoreWhileDragging(
    wrapSound(() => {
      actions.flipOver()
    })
  )

  const cycleCard = ignoreWhileDragging(
    wrapSound(() => {
      actions.cycleCardPile()
    })
  )


  const {
    onMouseDown,
    onTouchStart,
    onTouchEnd,
  } = useSecondaryClick(
    actions.handleSecondaryClick
  )

  const handleMouseDown = useCallback((event: any) => {
    setLastPosition([event.clientX, event.clientY])
    return onMouseDown(event)
  }, [onMouseDown, setLastPosition])

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
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchEnd}
      onClick={flipped ? flipCard : cycleCard}
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
    >
      <img
        onMouseDown={handleMouseDown}
        className="card-back"
        alt={card.name}
        src={`/assets/cards/${CardType[card.type].toLowerCase()}_back.jpg`}
      />
      <img
        onMouseDown={handleMouseDown}
        className="card-front"
        alt={card.name}
        src={`/assets/cards/md/${card.name}.jpg`}
      />
      <span className="title">{(card.display || card.name).toUpperCase()}</span>
      <div
        onMouseDown={classicNoop}
        onTouchStart={classicNoop}
        onClick={classicNoop}
        className="definition"
      >
        <dl>
          <dt>{(card.display || card.name).toUpperCase()}</dt>
          <dd>{card.definition}</dd>
          <dd><SourceLink url={card.source} /></dd>
        </dl>
        <ul>
          <li onClick={actions.toggleDefineCard}>Dismiss</li>
        </ul>
      </div>
    </div>
  )
}
