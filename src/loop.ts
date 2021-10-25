/**
 * @param time tempo de espera para execução, em segundos
 */
export const loop = (time: number) => {
  /**
   * @param fn função a ser executada
   */
  return (fn: () => void) => {
    setInterval(fn, time * 1000)
  }
}