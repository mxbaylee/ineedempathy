import React, { CSSProperties } from 'react'
import { useSecondaryClick, useSound } from '../utils'
import { CardPropsBase } from './Card'

export interface CardGroupOptionsProps {
  cards: CardPropsBase[]
  volume: number
  dataIdx: number
  actions: Record<string, () => void>
}

export const CardGroupOptions = ({
  volume,
  dataIdx,
  actions,
}: CardGroupOptionsProps) => {
  const [playSound] = useSound(volume)
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
      <hr />
      <ul>
        <li onClick={wrapSound(actions.splitTopCard)}>
          Split top Card
        </li>
        <li onClick={wrapSound(actions.splitBySize)}>
          Split by Size
        </li>
        <li onClick={wrapSound(actions.splitByCategory)}>
          Split by Category
        </li>
      </ul>
      <hr />
      <ul>
        <li onClick={wrapSound(actions.handleSecondaryClick)}>
          Define
        </li>
        <li onClick={wrapSound(actions.handleSecondaryClick)}>
          Flip group over
        </li>
      </ul>
      <hr />
      <ul>
        <li onClick={wrapSound(actions.handleSecondaryClick)}>
          Dismiss
        </li>
      </ul>
      <hr />
    </div>
  )
}
