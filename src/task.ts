export const task = (fn: () => void) => {
  queueMicrotask(fn)
}