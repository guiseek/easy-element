import { EasyState, Easy, tmpl, wait } from '../src'

import './style.css'

interface User {
  name: string | null
  email: string | null
}

@Easy({
  mode: 'open',
  name: 'easy-form',
  tmpl: tmpl`
  <fieldset>
    <legend> {{title}} </legend>
    
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
export class MyEasyFormElement extends EasyState<User> {
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

  connectedCallback() {
    // Legend
    const title = 'Usuário'

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
    this.bind({ title, handler })

    // State select
    this.name$.subscribe((name) => {
      this.swap('name', name)
    })
    
    // State select
    this.email$.subscribe((email) => {
      this.swap('email', email)
    })
    
    // Wait in seconds
    wait(2)(() => {
      // State set
      this.setName('Guilherme')
      
      wait(2)(() => {
        // State set
        this.setEmail('guiseek@email.com')
      })
    })
  }
}
