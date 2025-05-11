import { CardType, CardPropsBase } from '../components/Card'
import { CardDefinitions } from '../CardDefinitions'
import { CardPileDef } from './types'
import { CardSize, getCardSizeScale } from '../hooks/useSettings'

/**
 * Returns a unique ID.
 *
 * @param {number} [id] The initial ID. If not specified, a new ID will be generated.
 * @returns {number} The unique ID.
 */
const idSet = new Set()
export const newId = (): number => {
  let id = new Date().valueOf()
  while (idSet.has(id)) {
    id -= 1
  }
  idSet.add(id)
  return id
}

/**
 * This function turns a list of `cards` into groups for presentation.
 *
 * @param cardSize number Configured in settings.
 * @returns CardPile[] The result of the presentation layer
 **/
const centerLine = window.innerWidth / 2
const defaultCardWidth = 300
const defaultCardHeight = 420
export const PrettyFormatter = (cardSize: CardSize): CardPileDef[] => {
  const cardWidth = defaultCardWidth * getCardSizeScale(cardSize)
  const cardHeight = defaultCardHeight * getCardSizeScale(cardSize)
  return CardDefinitions.reduce((memo: CardPileDef[], card: CardPropsBase, idx: number): CardPileDef[] => {
    if (card.type === CardType.Feeling) {
      if (memo[0].length === 4) {
        memo[0].push(card.uid)
      } else {
        memo[2].push(card.uid)
      }
    } else {
      if (memo[1].length === 4) {
        memo[1].push(card.uid)
      } else {
        memo[3].push(card.uid)
      }
    }
    return memo
  }, [
    [newId(), centerLine - (cardWidth * 1.02), 50,  1],
    [newId(), centerLine + (cardWidth * 0.02), 50, 1],
    [newId(), centerLine - (cardWidth * 1.3), 50 + (cardHeight * 1.2), 0],
    [newId(), centerLine + (cardWidth * 0.3), 50 + (cardHeight * 1.2), 0],
  ])
}
