import React, { useCallback, CSSProperties } from 'react'
import { useSecondaryClick, useSound } from '../utils'
import { CardPropsBase } from './Card'
import { useSettings } from '../hooks/useSettings'

export interface CardPileOptionsProps {
  cards: CardPropsBase[]
  dataIdx: number
  flipOver: () => void
  toggleDefineCard: () => void
  closeOptions: () => void
  handleSecondaryClick: () => void
  splitByType: () => void
  splitBySize: () => void
  splitTopCard: () => void
}

export const CardPileOptions = ({
  cards,
  dataIdx,
  flipOver,
  toggleDefineCard,
  closeOptions,
  handleSecondaryClick,
  splitByType,
  splitBySize,
  splitTopCard,
}: CardPileOptionsProps) => {
  const [{ volume }] = useSettings()
  const [playSound] = useSound(volume)
  const hasMultipleCards = cards.length > 1
  const types = cards.reduce((types: string[], card: CardPropsBase): string[] => {
    if (!types.includes(card.type.toString())) {
      types.push(card.type.toString())
    }
    return types
  }, [])
  const hasMultipleTypes = types.length > 1
  const wrapClose = (fn: () => void): () => void => {
    return () => {
      fn()
      closeOptions()
    }
  }
  const wrapSound = (fn: () => void): () => void => {
    return () => {
      playSound()
      return fn()
    }
  }
  const {
    onMouseDown,
    onTouchStart,
    onTouchEnd,
  } = useSecondaryClick(
    handleSecondaryClick
  )

  // Disable secondary click, but don't trigger secondaryClick
  // for touch events
  const onTouch = useCallback((event: any) => {
    onTouchStart(event)
    onTouchEnd(event)
  }, [onTouchStart, onTouchEnd])

  return (
    <div
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
      className="options"
      onMouseDown={onMouseDown}
      onTouchStart={onTouch}
      onTouchEnd={onTouch}
    >
      <h3>{ hasMultipleCards ? 'Group Options' : 'Card Options' }</h3>
      { hasMultipleCards ? (
        <>
          <hr />
          <ul>
            <li onClick={wrapClose(wrapSound(splitTopCard))}>
              Separate Top Card
            </li>
            <li onClick={wrapClose(wrapSound(splitBySize))}>
              Split by Size
            </li>
            { hasMultipleTypes ? (
              <li onClick={wrapClose(wrapSound(splitByType))}>
                Split by Type
              </li>
            ) : null }
          </ul>
        </>
      ) : null }
      <hr />
      <ul>
        <li onClick={wrapClose(wrapSound(toggleDefineCard))}>
          { hasMultipleCards ? 'Define Top Card' : 'Define Card' }
        </li>
        <li onClick={wrapClose(wrapSound(flipOver))}>
          { hasMultipleCards ? 'Flip Top Card Over' : 'Flip Card Over' }
        </li>
      </ul>
      <hr />
      <ul>
        <li onClick={wrapClose(wrapSound(handleSecondaryClick))}>
          Dismiss
        </li>
      </ul>
    </div>
  )
}
