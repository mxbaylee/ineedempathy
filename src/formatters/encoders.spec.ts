import { decodeCardPileSegment, decodeStringToNumbers, encodeCardPileSegment, encodeNumbersToString, urlDecode, urlEncode } from "./encoders";
import { CardPileDef } from "./types";

describe('encodeNumbersToString', () => {
  it('encodes increasing sequences of 3+ as a range', () => {
    expect(encodeNumbersToString([1, 2, 3])).toBe('1:3');
    expect(encodeNumbersToString([1, 2, 3, 4, 5])).toBe('1:5');
  });

  it('does not encode increasing sequences of <3', () => {
    expect(encodeNumbersToString([1, 2])).toBe('1;2');
    expect(encodeNumbersToString([1])).toBe('1');
  });

  it('encodes decreasing sequences of 3+ as a range', () => {
    expect(encodeNumbersToString([9, 8, 7])).toBe('9:7');
    expect(encodeNumbersToString([10, 9, 8, 7, 6])).toBe('10:6');
  });

  it('does not encode decreasing sequences of <3', () => {
    expect(encodeNumbersToString([4, 3])).toBe('4;3');
  });

  it('preserves mixed patterns with both ranges and singles', () => {
    expect(encodeNumbersToString([1, 2, 3, 5, 6, 8])).toBe('1:3;5;6;8');
    expect(encodeNumbersToString([10, 9, 8, 6, 5, 3])).toBe('10:8;6;5;3');
  });

  it('returns empty string for empty array', () => {
    expect(encodeNumbersToString([])).toBe('');
  });
});

describe('decodeStringToNumbers', () => {
  it('decodes a simple increasing range', () => {
    expect(decodeStringToNumbers('1:5')).toEqual([1, 2, 3, 4, 5]);
  });

  it('decodes a simple decreasing range', () => {
    expect(decodeStringToNumbers('5:1')).toEqual([5, 4, 3, 2, 1]);
  });

  it('decodes single values', () => {
    expect(decodeStringToNumbers('7')).toEqual([7]);
    expect(decodeStringToNumbers('1;3;5')).toEqual([1, 3, 5]);
  });

  it('decodes mixed string with ranges and singles', () => {
    expect(decodeStringToNumbers('1:3;5;6;8')).toEqual([1, 2, 3, 5, 6, 8]);
    expect(decodeStringToNumbers('10:8;6;5;3')).toEqual([10, 9, 8, 6, 5, 3]);
  });

  it('returns empty array for empty string', () => {
    expect(decodeStringToNumbers('')).toEqual([]);
    expect(decodeStringToNumbers('   ')).toEqual([]);
  });
});

describe('Card Pile Encoding/Decoding', () => {
  describe('urlDecode - historical decoding', () => {
    it('decodes older JSON Format (Timeline: May 2023 - October 2023)', () => {
      const url = "#[[1,2,3],[4,5,6]]";
      expect(urlDecode(url)).toEqual([[1,2,3],[4,5,6]]);
    });

    it('decodes older JSON Format (Timeline: October 2023 - May 2025)', () => {
      const url = "#" + encodeURIComponent("[[1,2,3],[4,5,6]]");
      expect(urlDecode(url)).toEqual([[1,2,3],[4,5,6]]);
    });
  });

  describe('encodeCardPileSegment and decodeCardPileSegment', () => {
    it('should encode and decode card piles correctly', () => {
      const cardPile: CardPileDef[] = [
        [1, 2, 3, 0, 1],
        [5, 6, 7, 0, 2],
        [9, 0, 0, 0, 3],
      ];

      const encoded = encodeCardPileSegment(cardPile);
      const decoded = decodeCardPileSegment(encoded);

      expect(decoded).toEqual(cardPile);
    });

    it('should handle empty card piles', () => {
      const cardPile: CardPileDef[] = [];
      const encoded = encodeCardPileSegment(cardPile);
      const decoded = decodeCardPileSegment(encoded);

      expect(decoded).toEqual(false);
    });

    it('should return false for invalid input', () => {
      // expect(decodeCardPileSegment('invalid')).toBe(false);
      expect(decodeCardPileSegment('IwdgL')).toBe(false);
    });
  });

  describe('urlEncode and urlDecode', () => {
    it('should encode and decode card piles for URL', () => {
      const cardPile: CardPileDef[] = [
        [1, 2, 3, 0, 1],
        [5, 6, 7, 0, 2],
        [9, 0, 0, 0, 3],
      ];

      const encoded = urlEncode(cardPile);
      const decoded = urlDecode('#' + encoded);

      expect(decoded).toEqual(cardPile);
    });

    it('should return false for invalid input', () => {
      expect(urlDecode('#invalid')).toBe(false);
    });
  });
});
