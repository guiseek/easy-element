/**
 * @param time tempo de espera para execução, em segundos
 */
export const wait = (time: number) => {
  /**
   * @param fn função a ser executada
   */
  return (fn: () => void) => {
    setTimeout(fn, time * 1000)
  }
}