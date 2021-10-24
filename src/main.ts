import { ElementProps } from './core/template/types'
import { EasyElement, tmpl } from './core/render'
import { EasyState } from './core/state'
import { Easy } from './core/easy'
import { wait } from './core/wait'

import './style.css'

interface User {
  name: string | null
  email: string | null
}

export class MyEasyState extends EasyState<User> {
  name$ = this.select((user) => user.name ?? '')
  email$ = this.select((user) => user.email ?? '')

  constructor() {
    super({ name: null, email: null })
  }

  setName(name: string) {
    this.setState({ name })
  }

  setEmail(email: string) {
    this.setState({ email })
  }
}

@Easy({
  mode: 'open',
  name: 'easy-element',
  tmpl: tmpl`
  <fieldset>
    <legend> {{title}} </legend>
    
    <p easy-prop$="{{value}}"></p>
    
    <form>
      <label>
        <span>Nome</span>
        <input type="text" name="name" value="{{name}}" />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" value="{{email}}" />
      </label>
    </form>
  </fieldset>
  `,
})
export class MyEasyElement extends EasyElement {
  state = new MyEasyState()

  connectedCallback() {
    const value = { key: 'value' }
    this.bind({ title: 'Usuário', value })

    const p = this.query('p')
    if (p) console.log(p.props)

    this.state.name$.subscribe((name) => {
      this.swap('name', name)
    })

    this.state.email$.subscribe((email) => {
      this.swap('email', email)
    })

    wait(2)(() => {
      this.state.setName('Guilherme')

      wait(2)(() => {
        this.state.setEmail('guiseek@email.com')
      })
    })
  }
}
