import { EasyState, Easy, tmpl, css } from '../src'
import { Subject, takeUntil } from 'rxjs'

interface Counter {
  current: number
  step: number
  min: number
  max: number
}

@Easy({
  mode: 'open',
  name: 'easy-counter',
  html: tmpl`
    <fieldset>
      <legend> {{title}} </legend>
      
      <form>
        <button type="button" on-click={{dec}}> - </button>
        <input
          type="text"
          min="{{min}}"
          max="{{max}}"
          step="{{step}}"
          value="{{current}}"
          readonly
        />
        <button type="button" on-click={{inc}}> + </button>
      </form>
    </fieldset>
  `,
  style: css`
    legend {
      opacity: .6;
    }

    button {
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
    }
    
    input {
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
      text-align: center;
      width: 40px;
    }

    fieldset {
      display: inline-flex;
      border-width: 1px;
      border-color: #ccc;
      border-style: solid;
      border-radius: 6px;
    }
  `,
})
export class MyEasyCounterElement extends EasyState<Counter> {
  current$ = this.select(({ current }) => current)

  constructor() {
    super({
      min: 0,
      step: 10,
      max: 100,
      current: 0,
    })
  }

  inc(value?: number) {
    const inc = value ?? this.state.step
    const val = this.state.current + inc
    if (val <= this.state.max) {
      this.setState({ current: val })
    }
  }

  dec(value?: number) {
    const dec = value ?? this.state.step
    const val = this.state.current - dec
    if (val >= this.state.min) {
      this.setState({ current: val })
    }
  }

  connectedCallback() {
    // Legend
    const title = 'Contador'

    // Handlers
    const dec = () => this.dec()
    const inc = () => this.inc()

    // Bind Template
    this.bind({ title, dec, inc })

    // State select
    this.current$.pipe(takeUntil(this.destroy)).subscribe((current) => {
      console.log('current', current)
      this.swap('current', current)
    })
  }

  disconnectedCallback() {
    this.destroy.next()
    this.destroy.complete()
  }
}
