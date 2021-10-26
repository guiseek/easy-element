import { takeUntil } from 'rxjs'
import { EasyState, Easy, tmpl, wait, css } from '../src'

import './style.css'

interface User {
  name: string | null
  email: string | null
}

@Easy({
  mode: 'open',
  name: 'easy-form',
  html: tmpl`
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
  style: css`
    :host {
      display: block;
    }

    fieldset {
      display: inline-flex;
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
      border-radius: 6px;
    }

    legend {
      opacity: 0.6;
    }

    label {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
      gap: 10px;
    }

    button {
      float: right;
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
    }

    input {
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
      width: 140px;
    }
  `,
})
export class MyEasyFormElement extends EasyState<User> {
  user$ = this.select((user) => user ?? {})

  constructor() {
    super({ name: '', email: '' })
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
    this.user$
      .pipe(takeUntil(this.destroy))
      .subscribe(({ name = '', email = '' }) => {
        this.bind({ name, email })
      })

    // Wait in seconds
    wait(2)(() => {
      this.swap('name', 'Guilherme')

      wait(2)(() => {
        this.swap('email', 'guiseek@email.com')
      })
    })
  }

  disconnectedCallback() {
    this.destroy.next()
    this.destroy.complete()
  }
}
