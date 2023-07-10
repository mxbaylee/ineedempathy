import { useCallback } from 'react'
import { Howl } from 'howler';

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

export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const xDiff = x2 - x1
  const yDiff = y2 - y1
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

export const useSound = (volume: number): [() => void] => {
  const sound = new Howl({
    volume: (volume || 4) / 10,
    src: ['/ineedempathy/assets/audio/toggle-card.mp3'],
  });
  return [throttle(() => { sound.play() })]
}

export const useSecondaryClick = (handleSecondaryClick: () => void): [(event: any) => void, (event: any) => void]=> {
  const handleMouseDown = (event: any) => {
    if (event.button === 2) {
      const preventRightClickMenu = (event: any) => {
        event.preventDefault();
      }
      document.addEventListener('contextmenu', preventRightClickMenu);
      setTimeout(() => {
        // setTimeout(fn, 0) will execute after the current
        // synchronous block
        document.removeEventListener("contextmenu", preventRightClickMenu);
      }, 0)
      handleSecondaryClick()
    }
  }
  const handleDoubleTouch = (event: any) => {
    console.log('Double touch not yet implemented')
    console.log(event)
    debugger
  }
  return [
    handleMouseDown,
    handleDoubleTouch
  ]
}
