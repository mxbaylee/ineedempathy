import { CardType, CardProps } from '../Card'

export interface DragItem {
  id: string
  top: number
  left: number
  zIndex: number
}

export interface DragCard extends DragItem {
  card: CardProps
}

export type formatterReturn = Record<string, DragCard>

export const PrettyFormatter = (memo: formatterReturn, card: CardProps, idx: number): formatterReturn => {
  const id = card.type + card.name

  const firstOfItsType = (): boolean => {
    return !Object.values(memo).find((previousCard: any) => {
      return previousCard.card.type === card.type
    })
  }

  const top = (() => {
    return firstOfItsType() ? (
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
    return firstOfItsType() ? (
      card.type === CardType.Feeling ? (
        columnWidth - cardWidth
      ) : (
        columnWidth + 1
      )
    ) : (
      sidePadding + columnPadding + idx
    )
  })()

  return {
    ...memo,
    [id]: {
      id, top, left,
      zIndex: 1,
      card: {
        initialFlipped: firstOfItsType(),
        ...card,
      },
    }
  }
}
