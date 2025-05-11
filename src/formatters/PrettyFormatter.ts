import { CardType, CardPropsBase } from '../components/Card'
import { CardDefinitions } from '../CardDefinitions'
import { CardPileDef } from './types'
import { CardSize } from '../hooks/useSettings'
import { getCardDimensions } from '../utils'

const idSet = new Set()
export const newId = (): number => {
  let id = new Date().valueOf()
  while (idSet.has(id)) {
    id += 1
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
export const PrettyFormatter = (cardSize: CardSize): CardPileDef[] => {
  const centerLine = window.innerWidth / 2;
  const boardWidth = window.innerWidth;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const topFeeling = newCardPile({
    x: centerLine - (cardWidth * 1.02),
    y: 50,
    isFlipped: 1
  });
  const topNeed = newCardPile({
    x: centerLine + (cardWidth * 0.02),
    y: 50,
    isFlipped: 1
  });

  // Check if larger spacing would fit on the board
  const remainingFeelingsX = centerLine - (cardWidth * 1.3);
  const remainingNeedsX = centerLine + (cardWidth * 0.3);
  const totalRemainingWidth = (remainingNeedsX + cardWidth) - remainingFeelingsX;
  const useLargerSpacing = totalRemainingWidth <= boardWidth * 0.9;

  const remainingNeeds = newCardPile({
    x: centerLine + (cardWidth * (
      useLargerSpacing ? 0.3 : 0.02
    )),
    y: 50 + (cardHeight * 1.2),
    isFlipped: 0,
  });
  const remainingFeelings = newCardPile({
    x: centerLine - (cardWidth * (
      useLargerSpacing ? 1.3 : 1.02
    )),
    y: 50 + (cardHeight * 1.2),
    isFlipped: 0,
  });

  // Add cards to the various piles
  CardDefinitions.forEach((card: CardPropsBase, idx: number) => {
    const needsTopFeeling = topFeeling.length === 4;
    const needsTopNeed = topNeed.length === 4;
    if (card.type === CardType.Feeling) {
      if (needsTopFeeling) {
        topFeeling.push(card.uid)
      } else {
        remainingFeelings.push(card.uid)
      }
    } else {
      if (needsTopNeed) {
        topNeed.push(card.uid)
      } else {
        remainingNeeds.push(card.uid)
      }
    }
  });

  return [
    topFeeling,
    topNeed,
    remainingNeeds,
    remainingFeelings, // Goes last to get later z-index
  ];
};

const newCardPile = ({ x, y, isFlipped }: { x: number, y: number, isFlipped: 1|0 }): CardPileDef => {
  return [newId(), x, y, isFlipped]
}

/**
 * Calculate the maximum number of piles that can fit on the board if they are evenly distributed.
 */
const calculateMaxPiles = (cardSize: CardSize): number => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;

  const cardsPerRow = Math.floor(boardWidth / cardWidth);
  const cardsPerColumn = Math.floor(boardHeight / cardHeight);

  return cardsPerRow * cardsPerColumn;
};

const combineLargestTwoPiles = (cardPiles: CardPileDef[]): CardPileDef[] => {
  if (cardPiles.length <= 1) return cardPiles;

  // Step 1: Find indices of the two largest piles without sorting
  let firstMaxIdx = -1;
  let secondMaxIdx = -1;

  for (let i = 0; i < cardPiles.length; i++) {
    const length = cardPiles[i].length;
    if (firstMaxIdx === -1 || length > cardPiles[firstMaxIdx].length) {
      secondMaxIdx = firstMaxIdx;
      firstMaxIdx = i;
    } else if (secondMaxIdx === -1 || length > cardPiles[secondMaxIdx].length) {
      secondMaxIdx = i;
    }
  }

  if (firstMaxIdx === -1 || secondMaxIdx === -1) return cardPiles;

  const [id1, x1, y1, flipped1, ...cards1] = cardPiles[firstMaxIdx];
  const [,,,, ...cards2] = cardPiles[secondMaxIdx];
  const combinedPile: CardPileDef = [id1, x1, y1, flipped1, ...cards1, ...cards2];

  // Step 2: Build a new array preserving order, replacing the firstMaxIdx with the combined pile and skipping secondMaxIdx
  return cardPiles.reduce<CardPileDef[]>((acc, pile, idx) => {
    if (idx === firstMaxIdx) {
      acc.push(combinedPile);
    } else if (idx !== secondMaxIdx) {
      acc.push(pile);
    }
    return acc;
  }, []);
};

export const isOffBoard = (pile: CardPileDef, cardSize: CardSize) => {
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

export const pilesCollide = (pileOne: CardPileDef, pileTwo: CardPileDef, cardSize: CardSize) => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const [, pileOneX, pileOneY] = pileOne;
  const [, pileTwoX, pileTwoY] = pileTwo;
  return (
    pileOneX < pileTwoX + cardWidth &&
    pileOneX + cardWidth > pileTwoX &&
    pileOneY < pileTwoY + cardHeight &&
    pileOneY + cardHeight > pileTwoY
  );
};

const findAvailableSpace = (
  securePiles: CardPileDef[],
  cardSize: CardSize
): { x: number; y: number } | null => {
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  // Try each grid position
  for (let y = 0; y < boardHeight - cardHeight; y += 1) {
    for (let x = 0; x < boardWidth - cardWidth; x += 1) {
      const testPile: CardPileDef = [0, x, y];
      if (!securePiles.some(securePile => pilesCollide(securePile, testPile, cardSize))) {
        return { x, y };
      }
    }
  }
  return null;
};

const findIdealAvailableSpace = (
  fallenPile: CardPileDef,
  securePiles: CardPileDef[],
  cardSize: CardSize
): { x: number; y: number } | null => {
  const [, targetX, targetY] = fallenPile;
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const widthStep = Math.ceil(cardWidth / 10);
  const heightStep = Math.ceil(cardHeight / 10);

  const candidatePositions: { x: number; y: number }[] = [];

  for (let y = 0; y <= boardHeight - cardHeight; y += heightStep) {
    for (let x = 0; x <= boardWidth - cardWidth; x += widthStep) {
      candidatePositions.push({ x, y });
    }
  }

  // Sort positions by Euclidean distance from the original fallen pile location
  candidatePositions.sort((a, b) => {
    const da = Math.hypot(a.x - targetX, a.y - targetY);
    const db = Math.hypot(b.x - targetX, b.y - targetY);
    return da - db;
  });

  for (const pos of candidatePositions) {
    const testPile: CardPileDef = [0, pos.x, pos.y];
    if (!securePiles.some(pile => pilesCollide(pile, testPile, cardSize))) {
      return pos;
    }
  }

  return findAvailableSpace(securePiles, cardSize);
};

const findClosestPile = (space: { x: number; y: number }, piles: CardPileDef[]): CardPileDef | null => {
  if (piles.length === 0) return null;

  return piles.reduce((closest, pile) => {
    const [, pileX, pileY] = pile;
    const [, closestX, closestY] = closest;

    const currentDist = Math.hypot(space.x - pileX, space.y - pileY);
    const closestDist = Math.hypot(space.x - closestX, space.y - closestY);

    return currentDist < closestDist ? pile : closest;
  });
};

/**
 * Aggressively reorganizes all piles to ensure they fit on the board.
 * This approach:
 * 1. Combines the largest piles until we have a manageable number
 * 2. Places each pile in the closest available space
 * 3. Sorts piles from bottom-right to top-left
 *
 * Unlike the gentle approach, this will move ALL piles and may combine them
 * to ensure everything fits on the board. Returns false if even this aggressive
 * approach cannot fit all piles.
 */
export const aggressivelyGatherFallenPiles = (
  cardPiles: CardPileDef[],
  cardSize: CardSize
): CardPileDef[]|false => {
  let ungatheredPiles = [...cardPiles];
  const gatheredPiles: CardPileDef[] = [];

  // Combine piles until we have a manageable number
  while (ungatheredPiles.length > calculateMaxPiles(cardSize)) {
    ungatheredPiles = combineLargestTwoPiles(ungatheredPiles);
  }

  // For each pile, find the closest available space and move it there
  while (ungatheredPiles.length > 0) {
    const space = findAvailableSpace(gatheredPiles, cardSize);
    if (!space) break; // No more spaces available

    const closestPile = findClosestPile(space, ungatheredPiles);
    if (!closestPile) break;

    // Move the closest pile to the new space
    const [id, , , flipped, ...cards] = closestPile;
    gatheredPiles.push([id, space.x, space.y, flipped, ...cards]);

    // Remove the moved pile from currentPiles
    ungatheredPiles = ungatheredPiles.filter(pile => pile[0] !== id);
  }

  if (ungatheredPiles.length > 0) {
    return false;
  }

  // Sort the piles from bottom-right to top-left
  return gatheredPiles.sort((a, b) => {
    const yDiff = b[2] - a[2];
    if (yDiff !== 0) return yDiff;
    return b[1] - a[1];
  });
};

/**
 * Attempts to gather fallen piles by only moving them to empty spaces.
 * This is a gentle approach that preserves the positions of all non-fallen piles
 * and only moves fallen piles to available empty spaces.
 * Returns false if any fallen piles cannot be placed in empty spaces, which can happen
 * due to inefficient packing.
 */
export const gentlyGatherFallenPiles = (cardPiles: CardPileDef[], cardSize: CardSize): CardPileDef[]|false => {
  const securedPiles: CardPileDef[] = cardPiles.filter((pile) => !isOffBoard(pile, cardSize));
  const fallenPiles: CardPileDef[] = cardPiles.filter((pile) => isOffBoard(pile, cardSize));

  // First pass: try to gently place fallen piles
  for (const fallenPile of fallenPiles) {
    const space = findIdealAvailableSpace(fallenPile, securedPiles, cardSize);

    if (space) {
      const [id,,, flipped, ...cards] = fallenPile;
      const newPile: CardPileDef = [id, space.x, space.y, flipped, ...cards];
      securedPiles.push(newPile);
    } else {
      return false;
    }
  }

  return securedPiles;
}

/**
 * Gather fallen piles and return them in a new array.
 * If the piles can't be gathered, return the default formatter.
 */
export const gatherFallenPiles = (cardPiles: CardPileDef[], cardSize: CardSize): CardPileDef[] => {
  const gatheredPiles = gentlyGatherFallenPiles(cardPiles, cardSize);
  if (gatheredPiles) {
    return gatheredPiles;
  }

  return aggressivelyGatherFallenPiles(cardPiles, cardSize) || PrettyFormatter(cardSize);
};

export const pickupFallenPiles = (cardPiles: CardPileDef[], cardSize: CardSize): CardPileDef[] => {
  if (!hasFallenPiles(cardPiles, cardSize)) return cardPiles;
  return gatherFallenPiles(cardPiles, cardSize);
};

export const hasFallenPiles = (cardPiles: CardPileDef[], cardSize: CardSize): boolean => {
  return cardPiles.some((pile) => {
    return isOffBoard(pile, cardSize);
  });
};
