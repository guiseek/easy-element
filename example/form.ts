import { EasyElement, tmpl } from '../src/render'
import { EasyState } from '../src/state'
import { Easy } from '../src/easy'
import { wait } from '../src/wait'

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
  name: 'easy-form',
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

      <button type="button" on-click={{handler}}>Salvar</button>
    </form>
  </fieldset>
  `,
})
export class MyEasyFormElement extends EasyElement {
  state = new MyEasyState()

  connectedCallback() {
    // Legend
    const title = 'Usuário'

    // Prop value
    const value = { key: 'value' }

    // Query selector
    const form = this.query('form')

    // On click
    const handler = (event: PointerEvent) => {
      if (form) {
        console.log(event)
        console.log(this.getFormValue(form))
      }
    }

    // Bind Template
    this.bind({ title, value, handler })

    // Query selector with props
    const p = this.queryProps('p')
    if (p) console.log(p.props)

    // State select
    this.state.name$.subscribe((name) => {
      this.swap('name', name)
    })
    
    // State select
    this.state.email$.subscribe((email) => {
      this.swap('email', email)
    })
    
    // Wait in seconds
    wait(2)(() => {
      // State set
      this.state.setName('Guilherme')
      
      wait(2)(() => {
        // State set
        this.state.setEmail('guiseek@email.com')
      })
    })
  }
}
