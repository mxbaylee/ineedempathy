import { CardType, CardPropsBase } from '../components/Card'
import { CardDefinitions } from '../CardDefinitions'


/**
 * [id, left, top, flipped, ...cardId]
 **/
export type CardPileDef = number[]


/**
 * This function decodes a card pile from a URL hash.
 *
 * @param cardPileSegment: string The URL hash containing the card pile data.
 * @returns CardPile[]|false A list of CardPile arrays, or `false` if the hash could not be decoded.
 **/
export const urlDecode = (cardPileSegment: string): CardPileDef[]|false => {
  try {
    const cardPileHash: string = cardPileSegment.slice(1) // Trim the '#'
    const isJson = cardPileHash.startsWith('[')
    if (!isJson) {
      return JSON.parse(decodeURIComponent(cardPileHash))
    }
    return JSON.parse(cardPileHash)
  } catch (e) {
    return false
  }
}

/**
 * This function encodes a card pile to a URL hash.
 *
 * @param cardPile CardPile[] The list of CardPile arrays to encode.
 * @returns string The URL hash containing the card pile data.
 **/
export const urlEncode = (cardPile: CardPileDef[]): string => {
  return encodeURIComponent(JSON.stringify(cardPile))
}

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
export const PrettyFormatter = (cardSize: number = 10): CardPileDef[] => {
  const cardWidth = defaultCardWidth * (cardSize / 10)
  const cardHeight = defaultCardHeight * (cardSize / 10)
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
