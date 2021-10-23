import { EasyRenderElement, html } from './core/render'
import { Easy } from './core/easy'

import './style.css'

@Easy<MyEasyElement>({
  mode: 'open',
  name: 'easy-element',
  html: ({ name }) => html`
    <h1>${ name }</h1>
  `,
})
export class MyEasyElement extends EasyRenderElement {
  name = 'Um'
  connectedCallback() {
    this.name = 'Dois'
    setTimeout(() => this.render(this), 2000)
  }
}

const easyElement = document.querySelector('easy-element')
