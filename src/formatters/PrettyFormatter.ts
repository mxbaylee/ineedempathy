import { CardType, CardPropsBase } from '../components/Card';
import { CardDefinitions } from '../CardDefinitions';
import type { CardPileDef } from './types';
import { CardSize } from '../hooks/useSettings';
import { getCardDimensions } from '../utils';
import { doCardsOverlap, gatherFallenPiles, isOffBoard, newCardPile } from './utils';

export const pickupUnorderedPiles = (cardPiles: CardPileDef[], cardSize: CardSize): CardPileDef[] => {
  if (!detectUnorderedPiles(cardPiles, cardSize)) return cardPiles;
  return gatherFallenPiles(cardPiles, cardSize);
};

export const detectUnorderedPiles = (cardPiles: CardPileDef[], cardSize: CardSize): boolean => {
  return cardPiles.some((pile) => {
    return isOffBoard(pile, cardSize) || cardPiles.some((otherPile) => {
      if (otherPile === pile) return false;
      return doCardsOverlap(cardSize, pile, otherPile);
    });
  });
};

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
