import { CardType, CardPropsBase } from '../components/Card'

export type CardPileItem = {
  id: string
  top: number
  left: number
  flipped: boolean
  cards: CardPropsBase[]
}

const columnWidth = window.innerWidth / 2
const cardWidth = 210
const cardHeight = 294

export const PrettyFormatter = (cards: CardPropsBase[]): CardPileItem[] => {
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
    left: columnWidth - (cardWidth / 2),
    flipped: true,
    cards: [],
  }, {
    id: 'Rainbow Need',
    top: 50,
    left: columnWidth + (cardWidth / 2),
    flipped: true,
    cards: [],
  }, {
    id: 'Feelings',
    top: 50 + (cardHeight * 1.2),
    left: columnWidth - cardWidth,
    flipped: false,
    cards: [],
  }, {
    id: 'Needs',
    top: 50 + (cardHeight * 1.2),
    left: columnWidth + cardWidth,
    flipped: false,
    cards: [],
  } ])
}
