import { EasyRenderElement, tmpl } from './core/render'
import { Easy } from './core/easy'

import './style.css'

@Easy({
  mode: 'open',
  name: 'easy-element',
  tmpl: tmpl`
    <h1>Text {{text}}</h1>

    <input type="week" value="{{value}}" />
  `,
})
export class MyEasyElement extends EasyRenderElement {
  connectedCallback() {
    this.bind({ text: '123' })

    setTimeout(() => {
      const value = '2021-W40'

      this.swap('text', value)
      this.swap('value', value)
    }, 2000)

    const week = this.shadowRoot?.querySelector('input')
    if (week) {
      week.onchange = ({ target }) => {
        const { value } = target as HTMLInputElement
        console.log(value)
      }
    }
  }
}

const easyElement = document.querySelector('easy-element')
