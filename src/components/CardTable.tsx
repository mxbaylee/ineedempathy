import React, { useEffect, useRef, useCallback, useState } from 'react'
import { newId, PrettyFormatter } from '../formatters/PrettyFormatter'
import { CardType, CardPropsBase } from './Card'
import { DraggableCardPile } from '../components/DraggableCardPile'
import { doCardsOverlap } from '../utils'
import { CardDefinitions } from '../CardDefinitions'
import { CardPileDef } from '../formatters/types'
import { urlDecode, urlEncode } from '../formatters/encoders'
import { CardSize } from '../hooks/useSettings'

export interface CardTableProps {
  cardSize: CardSize;
}

export const cardsFromHash = (): CardPileDef[]|false => {
  return urlDecode(
    window.location.hash
  )
}

export const CardTable = ({ cardSize }: CardTableProps) => {
  const zIndexRef = useRef(1)
  const [cardPiles, _setCardPiles] = useState<CardPileDef[]>(
    cardsFromHash() || PrettyFormatter(cardSize)
  )

  useEffect(() => {
    const captureCardGroups = () => {
      try {
        const newCardPiles = cardsFromHash()
        if (newCardPiles) {
          _setCardPiles(newCardPiles)
        }
      } catch (e) {}
    }

    window.addEventListener('hashchange', captureCardGroups)
    return () => {
      window.removeEventListener('hashchange', captureCardGroups)
    }
  }, [cardPiles, _setCardPiles])

  const setCardPiles = useCallback((localCardPiles: CardPileDef[]) => {
    const newCardPiles = localCardPiles.map((cardPile: number[]) => {
      return [newId(), ...cardPile.slice(1)]
    })
    window.location.hash = urlEncode(newCardPiles)
  }, [])

  return (
    <div className="card-table">
      { cardPiles.map(([id, left, top, flipped, ...cardIds]: CardPileDef): any => {
        const cards = cardIds.map((cardId: number): CardPropsBase => {
          const cardIdx = cardId - 1
          return CardDefinitions[cardIdx]
        })
        const findOverlappingGroup = (left: number, top: number): CardPileDef|undefined => {
          return cardPiles.slice().filter(([innerId]: number[]): boolean => {
            return innerId !== id
          }).find(([_, innerLeft, innerTop]: number[]) => {
            return doCardsOverlap(
              cardSize,
              [left, top],
              [innerLeft, innerTop],
            )
          })
        }
        return (
          <DraggableCardPile
            key={String(id)}
            left={left}
            top={top}
            flipped={flipped === 1}
            cards={cards}
            zIndexRef={zIndexRef}
            hasOverlap={(left: number, top: number): boolean => {
              return findOverlappingGroup(left, top) !== undefined
            }}
            splitByType={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              const firstSet = cards.filter((card: CardPropsBase): boolean => {
                return card.type === CardType.Feeling
              }).map((card: CardPropsBase): number => {
                return card.uid
              })
              const secondSet = cards.filter((card: CardPropsBase): boolean => {
                return card.type === CardType.Need
              }).map((card: CardPropsBase): number => {
                return card.uid
              })
              newCardPiles.push(...[
                [-1, left + 15, top + 15, flipped, ...firstSet],
                [-1, left - 15, top - 15, flipped, ...secondSet],
              ])
              setCardPiles(newCardPiles)
            }}
            splitBySize={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              const firstSet = cardIds.slice(0, Math.floor(cards.length / 2))
              const secondSet = cardIds.slice(Math.floor(cards.length / 2))
              newCardPiles.push(...[
                [-1, left + 15, top + 15, flipped, ...firstSet],
                [-1, left - 15, top - 15, flipped, ...secondSet],
              ])
              setCardPiles(newCardPiles)
            }}
            splitTopCard={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push(...[
                [-1, left - 15, top - 15, flipped, ...cardIds.slice(0, -1)],
                [-1, left + 15, top + 15, flipped, ...cardIds.slice(-1)],
              ])
              setCardPiles(newCardPiles)
            }}
            cycleCards={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped,
                ...cardIds.slice(-1), // top card, now bottom
                ...cardIds.slice(0, -1) // new top cards
              ])
              setCardPiles(newCardPiles)
            }}
            flipOver={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped === 0 ? 1 : 0, ...cardIds
              ])
              setCardPiles(newCardPiles)
            }}
            mergeOverlappingGroups={(left: number, top: number) => {
              const overlappingGroup = findOverlappingGroup(left, top)
              if (!overlappingGroup) {
                throw Error('No overlapping group found.')
              }
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id && innerId !== overlappingGroup[0]
              })
              newCardPiles.push([
                ...overlappingGroup.slice(0, 3), // id, left, top
                0, // flipped
                ...overlappingGroup.slice(4), // bottom cards
                ...cardIds // newCards
              ])
              setCardPiles(newCardPiles)
            }}
            setPosition={(left: number, top: number) => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped, ...cardIds
              ])
              setCardPiles(newCardPiles)
            }}
          />
        )
      })}
    </div>
  )
}
