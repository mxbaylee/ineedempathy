import React, { CSSProperties } from 'react'
import { useSecondaryClick, useSound } from '../utils'
import { CardPropsBase } from './Card'
import { CardGroupActions } from './CardGroup'

export interface CardGroupOptionsProps {
  cards: CardPropsBase[]
  volume: number
  dataIdx: number
  actions: CardGroupActions
}

export const CardGroupOptions = ({
  cards,
  volume,
  dataIdx,
  actions,
}: CardGroupOptionsProps) => {
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
      actions.closeOptions()
    }
  }
  const wrapSound = (fn: () => void): () => void => {
    return () => {
      playSound()
      return fn()
    }
  }
  const [onMouseDown, onTouchStart] = useSecondaryClick(
    actions.handleSecondaryClick
  )
  return (
    <div
      style={{
        '--idx': String(dataIdx),
      } as CSSProperties}
      className="options"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <h3>Group Options</h3>
      { hasMultipleCards ? (
        <>
          <hr />
          <ul>
            <li onClick={wrapClose(wrapSound(actions.splitTopCard))}>
              Split top Card
            </li>
            <li onClick={wrapClose(wrapSound(actions.splitBySize))}>
              Split by Size
            </li>
            { hasMultipleTypes ? (
              <li onClick={wrapClose(wrapSound(actions.splitByType))}>
                Split by Type
              </li>
            ) : null }
          </ul>
        </>
      ) : null }
      <hr />
      <ul>
        <li onClick={wrapClose(wrapSound(actions.toggleDefineCard))}>
          { hasMultipleCards ? 'Define top Card' : 'Define Card' }
        </li>
        <li onClick={wrapClose(wrapSound(actions.flipOver))}>
          { hasMultipleCards ? 'Flip group over' : 'Flip over' }
        </li>
      </ul>
      <hr />
      <ul>
        <li onClick={wrapClose(wrapSound(actions.handleSecondaryClick))}>
          Dismiss
        </li>
      </ul>
      <hr />
    </div>
  )
}
