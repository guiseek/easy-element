import { Easy, tmpl, loop, EasyElement } from '../src'

@Easy({
  mode: 'open',
  name: 'easy-clock',
  tmpl: tmpl`
    <h3>{{date}} - {{time}}</h3>
  `,
})
export class MyEasyClockElement extends EasyElement {
  connectedCallback() {
    this.swapDateTime()
    
    loop(1)(() => this.swapDateTime())
  }

  swapDateTime() {
    const date = new Date()
    this.swap('date', date.toLocaleDateString())
    this.swap('time', date.toLocaleTimeString())
  }
}