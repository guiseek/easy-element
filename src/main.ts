import { EasyRenderElement, tmpl } from './core/render'
import { Easy } from './core/easy'

import './style.css'

@Easy<MyEasyElement>({
  mode: 'open',
  name: 'easy-element',
  tmpl: tmpl`
    <h1>Text {{text}}</h1>
  `,
})
export class MyEasyElement extends EasyRenderElement {
  text = '123'
  
  connectedCallback() {
    setTimeout(() => {
      this.swap('text', '456')
    }, 2000)
  }
}

const easyElement = document.querySelector('easy-element')
