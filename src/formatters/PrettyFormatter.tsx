import { CardType, CardPropsBase } from '../components/Card'

export type CardPileItem = {
  id: string
  top: number
  left: number
  flipped: boolean
  cards: CardPropsBase[]
}

const centerLine = window.innerWidth / 2
const defaultCardWidth = 300
const defaultCardHeight = 420

export const PrettyFormatter = (cards: CardPropsBase[], cardSize: number = 10): CardPileItem[] => {
  const cardWidth = defaultCardWidth * (cardSize / 10)
  const cardHeight = defaultCardHeight * (cardSize / 10)
  return cards.reduce((memo: CardPileItem[], card: CardPropsBase, idx: number): CardPileItem[] => {
    if (card.type === CardType.Feeling) {
      if (memo[0].cards.length === 0) {
        memo[0].cards.push(card)
      } else {
        memo[2].cards.push(card)
      }
    } else {
      if (memo[1].cards.length === 0) {
        memo[1].cards.push(card)
      } else {
        memo[3].cards.push(card)
      }
    }
    return memo
  }, [ {
    id: 'Rainbow Feeling',
    top: 50,
    left: centerLine - (cardWidth * 1.02),
    flipped: true,
    cards: [],
  }, {
    id: 'Rainbow Need',
    top: 50,
    left: centerLine + (cardWidth * 0.02),
    flipped: true,
    cards: [],
  }, {
    id: 'Feelings',
    top: 50 + (cardHeight * 1.2),
    left: centerLine - (cardWidth * 1.3),
    flipped: false,
    cards: [],
  }, {
    id: 'Needs',
    top: 50 + (cardHeight * 1.2),
    left: centerLine + (cardWidth * 0.3),
    flipped: false,
    cards: [],
  } ])
}
