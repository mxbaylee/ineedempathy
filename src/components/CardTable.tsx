import React, { useEffect, useCallback, useState } from 'react'
import { detectUnorderedPiles, pickupUnorderedPiles, PrettyFormatter } from '../formatters/PrettyFormatter'
import { CardType, CardPropsBase } from './Card'
import { DraggableCardPile } from '../components/DraggableCardPile'
import { doCardsOverlap, newId, sortTopRightToBottomLeftWrapper } from '../utils'
import { CardDefinitions } from '../CardDefinitions'
import { CardPileDef } from '../formatters/types'
import { urlDecode, urlEncode } from '../formatters/encoders'
import { CardSize } from '../hooks/useSettings'
import './css/CardTable.css'

export interface CardTableProps {
  cardSize: CardSize;
}

export const cardsFromHash = (): CardPileDef[]|false => {
  return urlDecode(
    window.location.hash
  )
}

export const CardTable = ({ cardSize }: CardTableProps) => {
  const [cardPiles, setCardPiles] = useState<CardPileDef[]>(() => {
    return cardsFromHash() || PrettyFormatter(cardSize);
  });
  const [unorderedPiles, setUnorderedPiles] = useState<boolean>(detectUnorderedPiles(cardPiles, cardSize));
  const sortTopRightToBottomLeft = useCallback((a: CardPileDef, b: CardPileDef) => {
    return sortTopRightToBottomLeftWrapper(cardSize)(a, b);
  }, [cardSize]);

  useEffect(() => {
    // If no cards have been moved, and the user changes the card size, reset the cards
    if (!cardsFromHash()) {
      setCardPiles(PrettyFormatter(cardSize))
    }
  }, [cardSize, setCardPiles])

  useEffect(() => {
    // Capture card groups from the hash change event
    const captureCardGroups = () => {
      try {
        const newCardPiles = cardsFromHash()
        if (newCardPiles) {
          setCardPiles(newCardPiles.sort(sortTopRightToBottomLeft));
        }
      } catch (e) {}
    }

    window.addEventListener('hashchange', captureCardGroups)
    return () => {
      window.removeEventListener('hashchange', captureCardGroups)
    }
  }, [cardPiles, setCardPiles, sortTopRightToBottomLeft])

  const handleCardPileUpdate = useCallback((localCardPiles: CardPileDef[]) => {
    // Update the card piles and save them to the hash
    const newCardPiles = localCardPiles.map((cardPile: CardPileDef): CardPileDef => {
      return [newId(), ...cardPile.slice(1)] as CardPileDef;
    }).sort(sortTopRightToBottomLeft);
    window.location.hash = urlEncode(newCardPiles)
  }, [sortTopRightToBottomLeft])

  const orderCards = useCallback(() => {
    handleCardPileUpdate(pickupUnorderedPiles(cardPiles, cardSize))
  }, [cardPiles, cardSize, handleCardPileUpdate])

  useEffect(() => {
    const checkForMessyPiles = () => {
      setUnorderedPiles(detectUnorderedPiles(cardPiles, cardSize));
    };

    checkForMessyPiles();
    window.addEventListener('resize', checkForMessyPiles);
    return () => window.removeEventListener('resize', checkForMessyPiles);
  }, [cardPiles, cardSize]);

  return (
    <>
      { unorderedPiles && (
        <button
          className="floating-button"
          onClick={orderCards}
          title="Click to order cards on the table"
        >
          I Need Order
        </button>
      )}
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
              ] as CardPileDef[])
              handleCardPileUpdate(newCardPiles)
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
              ] as CardPileDef[])
              handleCardPileUpdate(newCardPiles)
            }}
            splitTopCard={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push(...[
                [-1, left - 15, top - 15, flipped, ...cardIds.slice(0, -1)],
                [-1, left + 15, top + 15, flipped, ...cardIds.slice(-1)],
              ] as CardPileDef[])
              handleCardPileUpdate(newCardPiles)
            }}
            cycleCards={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped,
                ...cardIds.slice(-1), // top card, now bottom
                ...cardIds.slice(0, -1) // new top cards
              ] as CardPileDef)
              handleCardPileUpdate(newCardPiles)
            }}
            flipOver={() => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped === 0 ? 1 : 0, ...cardIds
              ] as CardPileDef)
              handleCardPileUpdate(newCardPiles)
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
              ] as CardPileDef)
              handleCardPileUpdate(newCardPiles)
            }}
            setPosition={(left: number, top: number) => {
              const newCardPiles = cardPiles.slice().filter(([innerId]: number[]): boolean => {
                return innerId !== id
              })
              newCardPiles.push([
                -1, left, top, flipped, ...cardIds
              ] as CardPileDef)
              handleCardPileUpdate(newCardPiles)
            }}
          />
        )
      })}
    </>
  )
}
