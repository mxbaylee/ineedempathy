import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { CardPileDef } from "./types";

const CARD_ITEM_SEPARATOR = ';';
const CARD_RANGE_SEPARATOR = ':';
const CARD_PILE_SEPARATOR = ',';

/**
 * Encodes an array of numbers into a compact string representation.
 * Detects consecutive number sequences (runs) and represents them as ranges.
 * For example: [1,2,3,5,7,8,9] becomes "1-3,5,7-9"
 *
 * Note: This function assumes all numbers are non-negative.
 * @param nums Array of numbers to encode
 * @returns A string representation where consecutive sequences are represented as ranges
 */
export const encodeNumbersToString = (nums: number[]): string => {
  if (nums.length === 0) return "";

  const result: string[] = [];
  let i = 0;

  while (i < nums.length) {
    let start = i;
    let direction = 0;

    // Try to detect a run
    if (i + 1 < nums.length) {
      const diff = nums[i + 1] - nums[i];
      if (diff === 1 || diff === -1) {
        direction = diff;
        let j = i + 1;
        while (
          j < nums.length &&
          nums[j] - nums[j - 1] === direction
        ) {
          j++;
        }

        const length = j - start;
        if (length >= 3) {
          result.push(`${nums[start]}${CARD_RANGE_SEPARATOR}${nums[j - 1]}`);
          i = j;
          continue;
        }
      }
    }

    result.push(`${nums[i]}`);
    i++;
  }

  return result.join(CARD_ITEM_SEPARATOR);
}

/**
 * Decodes a string representation back into an array of numbers.
 * Handles both individual numbers and ranges (e.g., "1-3" becomes [1,2,3]).
 * For example: "1-3,5,7-9" becomes [1,2,3,5,7,8,9]
 *
 * Note: This function assumes all numbers are non-negative.
 * @param s String to decode, can contain individual numbers and ranges
 * @returns Array of numbers reconstructed from the string representation
 */
export const decodeStringToNumbers = (s: string): number[] => {
  if (!s.trim()) return [];

  const result: number[] = [];

  for (const part of s.split(CARD_ITEM_SEPARATOR)) {
    if (part.includes(CARD_RANGE_SEPARATOR)) {
      const [startStr, endStr] = part.split(CARD_RANGE_SEPARATOR);
      const start = Number(startStr);
      const end = Number(endStr);
      const step = start < end ? 1 : -1;

      for (let n = start; n !== end + step; n += step) {
        result.push(n);
      }
    } else {
      result.push(Number(part));
    }
  }

  return result;
};

/**
 * This function decodes a card pile from a URL hash.
 *
 * @param cardPileSegment: string The URL hash containing the card pile data.
 * @returns CardPile[]|false A list of CardPile arrays, or `false` if the hash could not be decoded.
 **/
export const decodeCardPileSegment = (cardPileSegment: string): CardPileDef[]|false => {
  try {
    const decompressed = decompressFromEncodedURIComponent(cardPileSegment).split(CARD_PILE_SEPARATOR);
    return decompressed.map((cardPile: string): CardPileDef => {
      return decodeStringToNumbers(cardPile);
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * This function encodes a card pile to a URL hash.
 *
 * @param cardPile CardPile[] The list of CardPile arrays to encode.
 * @returns string The URL hash containing the card pile data.
 **/
export const encodeCardPileSegment = (cardPile: CardPileDef[]): string => {
  return compressToEncodedURIComponent(cardPile.reduce((cardPileHash: string, cardPile: CardPileDef): string => {
    return cardPileHash + (cardPileHash ? CARD_PILE_SEPARATOR : '') + encodeNumbersToString(cardPile);
  }, ''));
};

/**
 * This function decodes a card pile from a URL hash.
 *
 * @param cardPileSegment: string The URL hash containing the card pile data.
 * @returns CardPile[]|false A list of CardPile arrays, or `false` if the hash could not be decoded.
 **/
export const urlDecode = (cardPileSegment: string): CardPileDef[]|false => {
  try {
    const cardPileHash: string = cardPileSegment.slice(1); // Trim the '#'
    const isJson = cardPileHash.startsWith('[');
    const isEncodedJson = cardPileHash.startsWith('%5B');
    if (isEncodedJson) {
      // Format Timeline: October 2023 - May 2025
      return JSON.parse(decodeURIComponent(cardPileHash));
    } else if (isJson) {
      // Format Timeline: May 2023 - October 2023
      return JSON.parse(cardPileHash);
    } else {
      // Format Timeline: May 2025 - Present
      return decodeCardPileSegment(cardPileHash);
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * This function encodes a card pile to a URL hash.
 *
 * @param cardPile CardPile[] The list of CardPile arrays to encode.
 * @returns string The URL hash containing the card pile data.
 **/
export const urlEncode = (cardPile: CardPileDef[]): string => {
  return encodeCardPileSegment(cardPile);
};
