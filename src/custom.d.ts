import { MyEasyElement } from './main';

declare global {
  interface HTMLElementTagNameMap {
    'easy-element': MyEasyElement
  }
}
