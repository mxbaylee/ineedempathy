import { CardType, CardPropsBase } from '../components/Card'

export type WrappedCardProps = [CardPropsBase, {
  left: number
  top: number
}]

export const PrettyFormatter = (cards: CardPropsBase[]): WrappedCardProps[] => {
  const typeSet = new Set()

  return cards.map((card: CardPropsBase, idx: number): WrappedCardProps => {
    const firstOfItsType = !typeSet.has(card.type)
    typeSet.add(card.type)
    const top = (() => {
      return firstOfItsType ? (
        30
      ) : (
        400 - (idx * 0.5)
      )
    })()

    const left = (() => {
      const columnWidth = window.innerWidth / 2
      const cardWidth = 210
      const sidePadding = (columnWidth-cardWidth)/2
      const columnPadding = columnWidth * (
        card.type === CardType.Feeling ? 0 : 1
      )
      return firstOfItsType ? (
        card.type === CardType.Feeling ? (
          columnWidth - cardWidth
        ) : (
          columnWidth + 1
        )
      ) : (
        sidePadding + columnPadding + idx
      )
    })()

    return [
      {
        ...card,
        initialFlipped: firstOfItsType,
      },
      {left, top}
    ]
  })
}
