import { CardSize } from "../hooks/useSettings";
import { getCardDimensions, newId } from "../utils";
import { CardPileDef, Point } from "./types";

/**
 * Internal helper function for creating a new card pile.
 */
export const newCardPile = ({ x, y, isFlipped }: Point & { isFlipped: 1|0 }): CardPileDef => {
  return [newId(), x, y, isFlipped]
}

/**
 * Merges the two largest piles, prioritizing combining non-flipped piles first.
 * Sorts piles by flip state and size (ascending), then combines the last two.
 * If one pile is flipped and the other is not, the top card of the non-flipped pile is preserved.
 */
export const combineLargestTwoPiles = (cardPiles: CardPileDef[]): CardPileDef[] => {
  if (cardPiles.length <= 1) return cardPiles;

  // Sort by: flipped (0 before 1), then size (smaller to larger)
  const withIndex = cardPiles.map((pile, index) => ({
    index,
    pile,
    flipped: pile[3],
    size: pile.length - 4,
  }));

  const sorted = withIndex.sort((a, b) => {
    if (a.flipped !== b.flipped) return a.flipped - b.flipped; // non-flipped first
    return a.size - b.size; // smallest to largest
  });

  const a = sorted[sorted.length - 2];
  const b = sorted[sorted.length - 1];
  if (!a || !b) return cardPiles;

  const [idA, xA, yA, flippedA, ...cardsA] = a.pile;
  const [idB, , , flippedB, ...cardsB] = b.pile;

  const preserveB = flippedA < flippedB || flippedA === flippedB;
  const mergedCards = preserveB ? [...cardsB, ...cardsA] : [...cardsA, ...cardsB];
  const combinedPile: CardPileDef = [Math.max(idA, idB), xA, yA, Math.min(flippedA, flippedB), ...mergedCards];

  // Rebuild array by replacing b and removing a
  return cardPiles.reduce<CardPileDef[]>((acc, pile, i) => {
    if (i === b.index) acc.push(combinedPile);
    else if (i !== a.index) acc.push(pile);
    return acc;
  }, []);
};

/**
 * Checks if a card pile is off the board.
 */
export const isOffBoard = (pile: CardPileDef, cardSize: CardSize): boolean => {
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const [, x, y] = pile;
  return (
    x < 0 ||
    y < 0 ||
    x + cardWidth > boardWidth ||
    y + cardHeight > boardHeight
  );
};

/**
 * Finds the closest available space to a card pile.
 */
export const findClosestSpace = (
  pile: CardPileDef,
  spaces: Point[]
): Point | null => {
  if (spaces.length === 0) return null;

  const [, pileX, pileY] = pile;

  return spaces.reduce((closest, space) => {
    const currentDist = Math.hypot(space.x - pileX, space.y - pileY);
    const closestDist = Math.hypot(closest.x - pileX, closest.y - pileY);
    return currentDist < closestDist ? space : closest;
  });
};

/**
 * Dynamically finds the best available margin for a given pile count.
 */
export const getAvailableSpotsForPileCount = (
  pileCount: number,
  cardSize: CardSize
): Point[] => {
  const margins = [1.25, 1.2, 1.15, 1.1, 1.05];

  const fallbackSpots = findAvailableSpots(cardSize, 1.0);

  for (const margin of margins) {
    const spots = findAvailableSpots(cardSize, margin);
    if (spots.length >= pileCount || spots.length === fallbackSpots.length) {
      // Use early if it's good enough or not worse than our fallback
      return spots;
    }
  }

  return fallbackSpots;
};

/**
 * Gather fallen piles and return them in a new array.
 */
export const gatherFallenPiles = (cardPiles: CardPileDef[], cardSize: CardSize): CardPileDef[] => {
  let piles = [...cardPiles];

  const availableSpots = getAvailableSpotsForPileCount(piles.length, cardSize);

  while (availableSpots.length < piles.length) {
    piles = combineLargestTwoPiles(piles);
  }

  const sortedPiles = [...piles].sort((a, b) => {
    const aIsOff = isOffBoard(a, cardSize) ? 1 : 0;
    const bIsOff = isOffBoard(b, cardSize) ? 1 : 0;
    return aIsOff - bIsOff; // On-board (0) before off-board (1)
  });

  const placed: CardPileDef[] = [];
  const usedSpots = new Set<number>();

  for (const pile of sortedPiles) {
    const space = findClosestSpace(pile, availableSpots.filter((_, i) => !usedSpots.has(i)));
    if (!space) break;

    const [id, , , flipped, ...cards] = pile;
    placed.push([id, space.x, space.y, flipped, ...cards]);

    const idx = availableSpots.findIndex((s) => s.x === space.x && s.y === space.y);
    usedSpots.add(idx);
  }

  return placed;
};

/**
 * Finds the available spots for a given card size and margin.
 */
export const findAvailableSpots = (
  cardSize: CardSize,
  margin: number
): Point[] => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;

  let spacingX = cardWidth * margin;
  let spacingY = cardHeight * margin;

  const columns = Math.floor(boardWidth / spacingX);
  const rows = Math.floor(boardHeight / spacingY);
  const actualCardCount = columns * rows;

  spacingX = Math.floor(boardWidth / columns);
  spacingY = Math.floor(boardHeight / rows);

  const result: Point[] = [];

  for (let i = 0; i < actualCardCount; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * spacingX + (spacingX - cardWidth) / 2;
    const y = row * spacingY + (spacingY - cardHeight) / 2;
    result.push({ x, y });
  }

  if (result.length === 0) {
    return [{ x: 0, y: 0 }];
  }

  return result;
}

export const doCardsOverlap = (
  cardSize: CardSize,
  cardOne: CardPileDef,
  cardTwo: CardPileDef,
): boolean => {
  const [, cardOneX, cardOneY, , ] = cardOne;
  const [, cardTwoX, cardTwoY, , ] = cardTwo;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  return (
    cardOneX < cardTwoX + cardWidth &&
    cardOneX + cardWidth > cardTwoX &&
    cardOneY < cardTwoY + cardHeight &&
    cardOneY + cardHeight > cardTwoY
  )
}
