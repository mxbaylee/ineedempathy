import { CardSize } from '../hooks/useSettings';
import type { CardPileDef } from './types';
import * as Utils from '../utils';
import { detectUnorderedPiles } from './PrettyFormatter';

jest.mock('../utils');

describe('formatters/PrettyFormatter', () => {
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

  describe('detectUnorderedPiles', () => {
    it('should return true if there are fallen piles', () => {
      const piles: CardPileDef[] = [
        [1, -100, -100, 0, 1],
        [2, mockWindow.innerWidth + 100, -100, 0, 2],
        [3, -100, mockWindow.innerHeight + 100, 0, 3],
      ];
      expect(detectUnorderedPiles(piles, cardSize)).toBe(true);
    });

    it('should return false if all piles are within bounds and not overlapping', () => {
      const piles: CardPileDef[] = [
        [1, 100, 100, 0, 1],
        [2, 100 + cardWidth + 10, 100, 0, 2], // far enough to not overlap
      ];
      expect(detectUnorderedPiles(piles, cardSize)).toBe(false);
    });

    it('should return true if piles overlap', () => {
      const piles: CardPileDef[] = [
        [1, 100, 100, 0, 1],
        [2, 100 + cardWidth / 2, 100 + cardHeight / 2, 0, 2], // partially overlapping
      ];
      expect(detectUnorderedPiles(piles, cardSize)).toBe(true);
    });

    it('should return false for a single pile even if close to edge but inside', () => {
      const piles: CardPileDef[] = [
        [1, window.innerWidth - cardWidth, window.innerHeight - cardHeight, 0, 1],
      ];
      expect(detectUnorderedPiles(piles, cardSize)).toBe(false);
    });
  });
});
