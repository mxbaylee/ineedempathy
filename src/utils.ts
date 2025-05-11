import { useRef } from 'react'
import { Howl } from 'howler';
import { CardSize, getCardSizeScale } from './hooks/useSettings';
import { CardPileDef } from './formatters/types';

export const defaultCardWidth = 300
export const defaultCardHeight = 420

/**
 * Creates a throttled function that prevents execution when called too
 * frequently. The throttled function will only invoke the provided function
 * once within the specified delay period.
 *
 * @param {function} fn - The function to be throttled.
 * @param {number} [delay=200] - The minimum time interval between function invocations.
 * @returns {function} - The throttled function.
 */
export const throttle = (fn: () => void, delay: number = 200): () => void => {
  let prevent = false

  function throttled() {
    if (!prevent) {
      fn()
    }
    prevent = true
    setTimeout(() => {
      prevent = false
    }, delay)
  }

  return throttled
}

/**
 * Sorts card piles from top-right to bottom-left.
 * This sorting order is used because card stacks visually extend towards the top and right,
 * making this arrangement more intuitive for users to read and interact with.
 */
export const sortTopRightToBottomLeftWrapper = (cardSize: CardSize): (a: CardPileDef, b: CardPileDef) => number => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize);
  return (a: CardPileDef, b: CardPileDef): number => {
    const [, ax, ay] = a;
    const [, bx, by] = b;

    // If a is fully to the left of b, a should be last (comes after)
    if (ax + cardWidth <= bx) return 1;

    // If a is fully to the right of b, b should be last (a comes before)
    if (bx + cardWidth <= ax) return -1;

    // If a is fully above b, b should be last (a comes before)
    if (ay + cardHeight <= by) return -1;

    // If a is fully below b, a should be last (b comes before)
    if (by + cardHeight <= ay) return 1;

    // Overlapping or ambiguous: preserve order
    const aScore = ay * 10000 + ax;
    const bScore = by * 10000 + bx;
    return bScore - aScore;
  }
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const xDiff = x2 - x1
  const yDiff = y2 - y1
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

export const useSound = (volume: number): [() => void] => {
  const sound = new Howl({
    volume: volume / 10,
    src: ['/assets/audio/toggle-card.mp3'],
  });
  return [throttle(() => { sound.play() })]
}

const handleDisableContextMenu = () => {
  const preventRightClickMenu = (event: any) => {
    event.preventDefault();
  }
  document.addEventListener('contextmenu', preventRightClickMenu);
  setTimeout(() => {
    // setImmediate(fn) is only in node 😔
    // setTimeout(fn, 0) will execute after the current synchronous block
    document.removeEventListener("contextmenu", preventRightClickMenu);
  }, 500)
}

export const useSecondaryClick = (
  handleSecondaryClick: () => void
): Record<string,(event: any) => void> => {
  const timerRef = useRef<number>(0);

  const onMouseDown = (event: any) => {
    if (event.button === 2) {
      handleDisableContextMenu()
      handleSecondaryClick()
    }
  }
  const onTouchStart = (event: any) => {
    handleDisableContextMenu()
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      handleSecondaryClick()
    }, 500) as unknown as number
  }
  const onTouchEnd = (event: any) => {
    handleDisableContextMenu()
    clearTimeout(timerRef.current)
  }
  return {
    onMouseDown: onMouseDown,
    onTouchStart,
    onTouchEnd,
  }
}

/** @deprecated use formatters/utils.doCardsOverlap instead */
export const doCardsOverlap = (
  cardSize: CardSize,
  [cardOneX, cardOneY]: [number, number],
  [cardTwoX, cardTwoY]: [number, number]
): boolean => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize)
  return (
    cardOneX < cardTwoX + cardWidth &&
    cardOneX + cardWidth > cardTwoX &&
    cardOneY < cardTwoY + cardHeight &&
    cardOneY + cardHeight > cardTwoY
  )
}

export const getCardDimensions = (cardSize: CardSize): { cardWidth: number; cardHeight: number } => {
  return {
    cardWidth: defaultCardWidth * getCardSizeScale(cardSize),
    cardHeight: defaultCardHeight * getCardSizeScale(cardSize)
  };
};

/**
 * Generate a unique ID for a card, keeps track of all IDs in the set to avoid collisions.
 */
const idSet = new Set();
export const newId = (): number => {
  let id = new Date().valueOf();
  while (idSet.has(id)) {
    id += 1;
  }
  idSet.add(id);
  return id;
}
