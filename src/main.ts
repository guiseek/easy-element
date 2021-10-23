import { EasyRenderElement, tmpl } from './core/render'
import { Easy } from './core/easy'
import { wait } from './core/wait'

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
    
    wait(2)(() => {
      const value = '2021-W40'

      this.swap('text', value)
      this.swap('value', value)
    })
  }
}
