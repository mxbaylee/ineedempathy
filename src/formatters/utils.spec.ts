import { CardSize } from '../hooks/useSettings';
import type { CardPileDef, Point } from './types';
import * as Utils from '../utils';
import { combineLargestTwoPiles, findAvailableSpots, findClosestSpace, gatherFallenPiles, isOffBoard } from './utils';

jest.mock('../utils');

describe('formatters/utils', () => {
  const cardSize = CardSize.MEDIUM;
  const mockWindow = {
    innerWidth: 1000,
    innerHeight: 800
  };
  const cardWidth = 100;
  const cardHeight = 100;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: mockWindow.innerWidth });
    Object.defineProperty(window, 'innerHeight', { value: mockWindow.innerHeight });
    jest.spyOn(Utils, 'getCardDimensions').mockImplementation((size: CardSize) => {
      return { cardWidth, cardHeight };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isOffBoard', () => {
    it('should return true if the pile is off board', () => {
      const pile: CardPileDef = [1, -100, -100, 0, 1];
      expect(isOffBoard(pile, cardSize)).toBe(true);
    });
    it('should return false if the pile is on board', () => {
      const pile: CardPileDef = [1, 0, 0, 0, 1];
      expect(isOffBoard(pile, cardSize)).toBe(false);
    });
  });

  describe('findClosestSpace', () => {
    it('returns null when spaces array is empty', () => {
      const pile: CardPileDef = [1, 100, 100, 0];
      const result = findClosestSpace(pile, []);
      expect(result).toBeNull();
    });

    it('returns the only space when one is available', () => {
      const pile: CardPileDef = [1, 100, 100, 0];
      const space: Point = { x: 50, y: 50 };
      const result = findClosestSpace(pile, [space]);
      expect(result).toEqual(space);
    });

    it('returns the closest space among several', () => {
      const pile: CardPileDef = [1, 100, 100, 0];
      const spaces: Point[] = [
        { x: 200, y: 200 },
        { x: 90, y: 90 },    // closest (distance ~14.1)
        { x: 400, y: 100 },
      ];
      const result = findClosestSpace(pile, spaces);
      expect(result).toEqual({ x: 90, y: 90 });
    });

    it('breaks ties by returning the first closest match', () => {
      const pile: CardPileDef = [1, 100, 100, 0];
      const spaces: Point[] = [
        { x: 90, y: 90 },
        { x: 110, y: 110 }, // same distance (~14.1)
      ];
      const result = findClosestSpace(pile, spaces);
      expect(result).toEqual(spaces[0]); // First one wins in a tie
    });
  });

  describe('findAvailableSpots', () => {
    it('should fit 9 cards perfectly in a 3x3 grid with margin 1.05', () => {
      Object.defineProperty(window, 'innerWidth', { value: 330 });
      Object.defineProperty(window, 'innerHeight', { value: 330 });
      const margin = 1.05;
      const spots = findAvailableSpots(cardSize, margin);
      expect(spots).toHaveLength(9);
    });

    it('should reduce number of cards if they don’t fit with larger margin', () => {
      Object.defineProperty(window, 'innerWidth', { value: 330 });
      Object.defineProperty(window, 'innerHeight', { value: 330 });
      const margin = 1.2;
      const spots = findAvailableSpots(cardSize, margin);
      expect(spots.length).toBe(4); // Should only fit 2x2
    });

    it('should fit a single card when board is tight', () => {
      Object.defineProperty(window, 'innerWidth', { value: 110 });
      Object.defineProperty(window, 'innerHeight', { value: 110 });
      const margin = 1.05;
      const spots = findAvailableSpots(cardSize, margin);
      expect(spots).toHaveLength(1);
      expect(spots[0]).toEqual({ x: 5, y: 5 });
    });

    it('should return 0x0 array when board is too small for even one card', () => {
      Object.defineProperty(window, 'innerWidth', { value: 80 });
      Object.defineProperty(window, 'innerHeight', { value: 80 });
      const margin = 1.1;
      const spots = findAvailableSpots(cardSize, margin);
      expect(spots).toHaveLength(1);
      expect(spots[0]).toEqual({ x: 0, y: 0 });
    });
  });

  describe('combineLargestTwoPiles', () => {
    it('returns original if 0 or 1 pile', () => {
      expect(combineLargestTwoPiles([])).toEqual([]);

      const solo: CardPileDef[] = [[1, 0, 0, 0, 100]];
      expect(combineLargestTwoPiles(solo)).toEqual(solo);
    });

    it('combines two largest non-flipped piles', () => {
      const input: CardPileDef[] = [
        [1, 0, 0, 0, 10],                    // len 1
        [2, 0, 0, 0, 20, 21],                // len 2
        [3, 0, 0, 0, 30, 31, 32],            // len 3
      ];

      const result = combineLargestTwoPiles(input);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([1, 0, 0, 0, 10]);
      expect(result[1]).toEqual([3, 0, 0, 0, 30, 31, 32, 20, 21]);
    });

    it('combines two largest flipped piles if no non-flipped ones exist', () => {
      const input: CardPileDef[] = [
        [1, 0, 0, 1, 10],
        [2, 0, 0, 1, 20, 21],
        [3, 0, 0, 1, 30, 31, 32],
      ];

      const result = combineLargestTwoPiles(input);
      expect(result).toHaveLength(2);

      // Order preserved, no top card stripping
      expect(result[0]).toEqual([1, 0, 0, 1, 10]);
      expect(result[1]).toEqual([3, 0, 0, 1, 30, 31, 32, 20, 21]);
    });

    it('combines only flipped with largest non-flipped pile', () => {
      const input: CardPileDef[] = [
        [1, 0, 0, 0, 10],         // non-flipped card should not be touched
        [2, 0, 0, 0, 20, 21],     // non-flipped card should be preserved
        [3, 0, 0, 1, 30, 31, 32], // should merge with 2
      ];

      const result = combineLargestTwoPiles(input);
      expect(result).toHaveLength(2);

      // Order preserved, no top card stripping
      expect(result[0]).toEqual([1, 0, 0, 0, 10]);
      expect(result[1]).toEqual([3, 0, 0, 0, 30, 31, 32, 20, 21]);
    });
  });

  describe('gatherFallenPiles', () => {
    it('keeps well-placed piles where they are', () => {
      const piles: CardPileDef[] = [
        [1, 100, 100, 0, 101],
        [2, 300, 300, 1, 102],
      ];

      const result = gatherFallenPiles(piles, cardSize);

      expect(result).toHaveLength(2);
    });

    it('moves offscreen piles to nearest available spots', () => {
      const piles: CardPileDef[] = [
        [1, -500, 100, 0, 201],
        [2, 5000, 100, 0, 202],
        [3, 300, 300, 0, 203],
      ];

      const result = gatherFallenPiles(piles, cardSize);

      expect(result).toHaveLength(3);
      for (const [_, x, y] of result) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(mockWindow.innerWidth);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(mockWindow.innerHeight);
      }
    });

    it('combines piles if there are too many to fit', () => {
      const piles: CardPileDef[] = Array.from({ length: 200 }, (_, i) => [
        i, 0, 0, 0, 300 + i,
      ]);

      const result = gatherFallenPiles(piles, cardSize);

      // There should be fewer piles than input, since some were combined
      expect(result.length).toBeLessThan(piles.length);
    });

    it('uses tighter spacing if wider spacing is insufficient', () => {
      Object.defineProperty(window, 'innerWidth', { value: cardWidth * 3 });
      Object.defineProperty(window, 'innerHeight', { value: cardHeight * 3 });

      const piles: CardPileDef[] = Array.from({ length: 9 }, (_, i) => [
        i, -1000, -1000, 0, 400 + i,
      ]);

      const result = gatherFallenPiles(piles, cardSize);

      // 9 piles, so the looser margin won't work; tighter spacing should kick in
      expect(result).toHaveLength(9);
      expect(result[0][1]).toEqual(0); // first pile should be on the left
      expect(result[0][2]).toEqual(0); // first pile should be on the top
    });
  });
});
