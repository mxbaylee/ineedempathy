import React, { CSSProperties, useState, useCallback } from 'react'
import { getDistance, useSecondaryClick, useSound } from '../utils'
import { SourceLink } from './SourceLink'
import { useSettings } from '../hooks/useSettings'
import './css/Card.css'

export enum CardType {
  Feeling,
  Need,
}

export interface CardPropsBase {
  uid: number
  type: CardType
  name: string
  display?: string
  definition: string
  source: string
}

export interface CardProps {
  card: CardPropsBase
  flipped: boolean
  showDefinition: boolean
  dataIdx: number
  onlyCard: boolean
  flipOver: () => void
  cycleCardPile: () => void
  handleSecondaryClick: () => void
  toggleDefineCard: () => void
}

export const Card = (props: CardProps) => {
  const {
    card,
    flipped,
    showDefinition,
    dataIdx,
    onlyCard,
    flipOver,
    cycleCardPile,
    handleSecondaryClick,
    toggleDefineCard,
  } = props
  const [lastPosition, setLastPosition] = useState<[number, number]>([0,0])
  const [{volume}] = useSettings()
  const [playSound] = useSound(volume)

  // Generic function to wrap other fn's
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
      flipOver()
    })
  )

  const cycleCard = ignoreWhileDragging(
    wrapSound(() => {
      cycleCardPile()
    })
  )


  const {
    onMouseDown,
    onTouchStart,
    onTouchEnd,
  } = useSecondaryClick(
    handleSecondaryClick
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
      onClick={flipped ? (
        flipCard
      ) : (
        onlyCard ? () => {} : cycleCard
      )}
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
    >
      <div
        onMouseDown={handleMouseDown}
        className="card-img card-back"
        title={card.name}
        style={{
          backgroundImage: `url(/assets/cards/${CardType[card.type].toLowerCase()}_back.jpg)`
        }}
      />
      <div
        onMouseDown={handleMouseDown}
        className="card-img card-front"
        title={card.name}
        style={{
          backgroundImage: `url(/assets/cards/md/${card.name}.jpg)`
        }}
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
          <li onClick={toggleDefineCard}>Dismiss</li>
        </ul>
      </div>
    </div>
  )
}
