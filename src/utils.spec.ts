import { CardPileDef } from "./formatters/types";
import { CardSize } from "./hooks/useSettings";
import { getCardDimensions, sortTopRightToBottomLeftWrapper } from "./utils";

describe('sortTopRightToBottomLeftWrapper', () => {
  const cardSize = CardSize.MEDIUM;
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  const sorter = sortTopRightToBottomLeftWrapper(cardSize);
  const CARD_ONE = 50;
  const CARD_TWO = 55;

  it('should sort a card above another earlier (lower in array)', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const above: CardPileDef = [1, 100, 100 - cardHeight, 0, CARD_TWO];

    const result = [above, center].sort(sorter);
    expect(result[0]).toBe(above);
    expect(result[1]).toBe(center);
  });

  it('should sort a card below another later (higher in array)', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const below: CardPileDef = [1, 100, 100 + cardHeight, 0, CARD_TWO];

    const result = [below, center].sort(sorter);
    expect(result[0]).toBe(center);
    expect(result[1]).toBe(below);
  });

  it('should sort a card to the right earlier (lower in array)', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const right: CardPileDef = [1, 100 + cardWidth, 100, 0, CARD_TWO];

    const result = [right, center].sort(sorter);
    expect(result[0]).toBe(right);
    expect(result[1]).toBe(center);
  });

  it('should sort a card to the left later (higher in array)', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const left: CardPileDef = [1, 100 - cardWidth, 100, 0, CARD_TWO];

    const result = [left, center].sort(sorter);
    expect(result[0]).toBe(center);
    expect(result[1]).toBe(left);
  });

  it('should fallback to distance-based sort when overlapping top-left', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const overlapping: CardPileDef = [
      1,
      100 - cardWidth / 2,
      100 - cardHeight / 2,
      0,
      CARD_TWO
    ];

    const result = [overlapping, center].sort(sorter);
    expect(result[0]).toBe(center);       // under
    expect(result[1]).toBe(overlapping);  // on top
  });

  it('should fallback to distance-based sort when overlapping top-right', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const overlapping: CardPileDef = [
      1,
      100 + cardWidth / 2,
      100 - cardHeight / 2,
      0,
      CARD_TWO
    ];

    const result = [overlapping, center].sort(sorter);
    expect(result[0]).toBe(center);
    expect(result[1]).toBe(overlapping);
  });

  it('should fallback to distance-based sort when overlapping bottom-right', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const overlapping: CardPileDef = [
      1,
      100 + cardWidth / 2,
      100 + cardHeight / 2,
      0,
      CARD_TWO
    ];

    const result = [center, overlapping].sort(sorter); // reversed input to check fallback
    expect(result[0]).toBe(overlapping);   // under
    expect(result[1]).toBe(center);        // on top
  });

  it('should fallback to distance-based sort when overlapping bottom-left', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const overlapping: CardPileDef = [
      1,
      100 - cardWidth / 2,
      100 + cardHeight / 2,
      0,
      CARD_TWO
    ];

    const result = [center, overlapping].sort(sorter);
    expect(result[0]).toBe(overlapping);   // under
    expect(result[1]).toBe(center);        // on top
  });

  it('should leave identical positions unchanged (stable)', () => {
    const center: CardPileDef = [0, 100, 100, 0, CARD_ONE];
    const dupe: CardPileDef = [1, 100, 100, 0, CARD_TWO];

    const result = [dupe, center].sort(sorter);
    expect(result).toEqual([dupe, center]);
  });
});
