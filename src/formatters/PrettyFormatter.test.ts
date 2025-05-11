import { CardSize } from '../hooks/useSettings';
import { CardPileDef } from './types';
import {
  gentlyGatherFallenPiles,
  aggressivelyGatherFallenPiles,
  gatherFallenPiles,
  isOffBoard,
  pilesCollide,
  newId,
  hasFallenPiles
} from './PrettyFormatter';
import { getCardDimensions } from '../utils';

describe.only('PrettyFormatter', () => {
  const mockWindow = {
    innerWidth: 1000,
    innerHeight: 800
  };

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: mockWindow.innerWidth });
    Object.defineProperty(window, 'innerHeight', { value: mockWindow.innerHeight });
  });

  describe('gentlyGatherFallenPiles', () => {
    const cardSize = CardSize.MEDIUM;
    const { cardWidth, cardHeight } = getCardDimensions(cardSize);
    const paddingX = cardWidth / 2;
    const paddingY = cardHeight / 2;

    const cardCountX = 3;
    const cardCountY = 2;

    const boardWidth = paddingX + (cardWidth + paddingX) * (cardCountX - 1) + cardWidth;
    const boardHeight = paddingY + (cardHeight + paddingY) * (cardCountY - 1) + cardHeight;

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: boardWidth });
      Object.defineProperty(window, 'innerHeight', { value: boardHeight });
    });

    it('should find a space for a single pile', () => {
      const piles: CardPileDef[] = [
        [newId(), boardWidth * 2, boardHeight * 2, 0, 1]
      ];

      const result = gentlyGatherFallenPiles(piles, CardSize.MEDIUM);
      expect(result).toHaveLength(1);
    });

    it('should return false when fallen piles cannot be placed due to inefficient packing', () => {
      // Create a scenario where piles are arranged in a way that blocks all empty spaces
      const securePiles: CardPileDef[] = [];

      let cardId = 0;
      for (let y = paddingY; y <= boardHeight - cardHeight; y += cardHeight + paddingY) {
        for (let x = paddingX; x <= boardWidth - cardWidth; x += cardWidth + paddingX) {
          securePiles.push([newId(), x, y, 0, ++cardId]);
        }
      }

      const fallenPiles: CardPileDef[] = [
        [newId(), boardWidth * 2, boardHeight * 2, 0, ++cardId],
      ];

      const result = gentlyGatherFallenPiles([...securePiles, ...fallenPiles], CardSize.LARGE);
      expect(result).toBe(false);
    });
  });

  describe('aggressivelyGatherFallenPiles', () => {
    it('should combine piles when there are too many to fit', () => {
      // Create more piles than can fit on the board
      const piles: CardPileDef[] = Array.from({ length: 20 }, (_, i) => [
        i + 1,
        Math.random() * mockWindow.innerWidth,
        Math.random() * mockWindow.innerHeight,
        0,
        i + 1
      ]);

      const result = aggressivelyGatherFallenPiles(piles, CardSize.MEDIUM);
      expect(result).not.toBe(false);
      const gatheredPiles = result as CardPileDef[];
      expect(gatheredPiles.length).toBeLessThan(piles.length);
      expect(gatheredPiles.every((pile: CardPileDef) => !isOffBoard(pile, CardSize.MEDIUM))).toBe(true);
    });
  });

  describe('gatherFallenPiles', () => {
    it('should try gentle approach first, then aggressive, then default formatter', () => {
      // Create a scenario that will fail gentle but succeed with aggressive
      const piles: CardPileDef[] = [
        [1, 100, 100, 0, 1],
        [2, 300, 100, 0, 2],
        [3, 100, 300, 0, 3],
        [4, 300, 300, 0, 4],
        [5, -50, 200, 0, 5], // Fallen pile that can't fit in gentle approach
      ];

      const result = gatherFallenPiles(piles, CardSize.MEDIUM);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((pile: CardPileDef) => !isOffBoard(pile, CardSize.MEDIUM))).toBe(true);
    });

    it('should handle edge case of all piles being off board', () => {
      const piles: CardPileDef[] = [
        [1, -100, -100, 0, 1],
        [2, mockWindow.innerWidth + 100, -100, 0, 2],
        [3, -100, mockWindow.innerHeight + 100, 0, 3],
      ];

      const result = gatherFallenPiles(piles, CardSize.MEDIUM);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((pile: CardPileDef) => !isOffBoard(pile, CardSize.MEDIUM))).toBe(true);
    });
  });

  describe('hasFallenPiles', () => {
    it('should return true if there are fallen piles', () => {
      const piles: CardPileDef[] = [
        [1, -100, -100, 0, 1],
        [2, mockWindow.innerWidth + 100, -100, 0, 2],
        [3, -100, mockWindow.innerHeight + 100, 0, 3],
      ];
      expect(hasFallenPiles(piles, CardSize.MEDIUM)).toBe(true);
    });

    it('should return false if there are no fallen piles', () => {
      const piles: CardPileDef[] = [
        [1, 100, 100, 0, 1],
      ];
      expect(hasFallenPiles(piles, CardSize.MEDIUM)).toBe(false);
    });
  });

  describe('isOffBoard', () => {
    it('should return true if the pile is off board', () => {
      const pile: CardPileDef = [1, -100, -100, 0, 1];
      expect(isOffBoard(pile, CardSize.MEDIUM)).toBe(true);
    });
    it('should return false if the pile is on board', () => {
      const pile: CardPileDef = [1, 0, 0, 0, 1];
      expect(isOffBoard(pile, CardSize.MEDIUM)).toBe(false);
    });
  });

  describe('pilesCollide', () => {
    it('should detect collisions between piles', () => {
      const { cardHeight } = getCardDimensions(CardSize.MEDIUM);
      const pile1: CardPileDef = [1, 100, 100, 0, 1];
      const pile2: CardPileDef = [2, 150, 150, 0, 2]; // Overlapping with pile1
      const pile3: CardPileDef = [3, 100 + cardHeight, 300, 0, 3]; // Not overlapping

      expect(pilesCollide(pile1, pile2, CardSize.MEDIUM)).toBe(true);
      expect(pilesCollide(pile1, pile3, CardSize.MEDIUM)).toBe(false);
    });

    it('should handle edge cases of pile positions', () => {
      const pile1: CardPileDef = [1, 0, 0, 0, 1];
      const pile2: CardPileDef = [2, -50, -50, 0, 2]; // Partially off board
      const pile3: CardPileDef = [3, mockWindow.innerWidth - 50, mockWindow.innerHeight - 50, 0, 3]; // At edge

      expect(pilesCollide(pile1, pile2, CardSize.MEDIUM)).toBe(true);
      expect(pilesCollide(pile1, pile3, CardSize.MEDIUM)).toBe(false);
    });
  });
});
