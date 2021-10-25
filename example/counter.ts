import { EasyState, Easy, tmpl } from '../src'
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
  tmpl: tmpl`
  <fieldset>
    <legend> {{title}} </legend>
    
    <form>
      <button type="button" on-click={{dec}}> - </button>
      <input
        type="number"
        min="{{min}}"
        max="{{max}}"
        step="{{step}}"
        value="{{current}}"
      />
      <button type="button" on-click={{inc}}> + </button>
    </form>
  </fieldset>
  `,
})
export class MyEasyCounterElement extends EasyState<Counter> {
  private _destroy = new  Subject<void>()

  current$ = this.select(({ current }) => current)

  constructor() {
    super({
      min: 0,
      step: 10,
      max: 100,
      current: 0
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
    this.current$.pipe(
      takeUntil(this._destroy)
    ).subscribe((current) => {
      console.log('current', current)
      this.swap('current', current)
    })
  }

  disconnectedCallback() {
    this._destroy.next()
    this._destroy.complete()
  }
}