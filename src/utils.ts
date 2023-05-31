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
