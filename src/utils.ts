import { useRef } from 'react'
import { Howl } from 'howler';
import { CardSize, getCardSizeScale } from './hooks/useSettings';

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

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 200
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
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

export const doCardsOverlap = (
  cardSize: CardSize,
  [leftOne, topOne]: [number, number],
  [leftTwo, topTwo]: [number, number]
): boolean => {
  const { cardWidth, cardHeight } = getCardDimensions(cardSize)
  return (
    leftOne < leftTwo + cardWidth &&
    leftOne + cardWidth > leftTwo &&
    topOne < topTwo + cardHeight &&
    topOne + cardHeight > topTwo
  )
}

export const getCardDimensions = (cardSize: CardSize): { cardWidth: number; cardHeight: number } => {
  return {
    cardWidth: defaultCardWidth * getCardSizeScale(cardSize),
    cardHeight: defaultCardHeight * getCardSizeScale(cardSize)
  };
};
