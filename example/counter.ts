import { EasyElement, tmpl } from '../src/render'
import { Subject, takeUntil } from 'rxjs'
import { EasyState } from '../src/state'
import { Easy } from '../src/easy'

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
  step$ = this.select(({ step }) => step)
  min$ = this.select(({ min }) => min)
  max$ = this.select(({ max }) => max)

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
    
    const dec = () => this.dec()
    const inc = () => this.inc()

    // Bind Template
    this.bind({ title, dec, inc })

    // State select
    this.min$.pipe(
      takeUntil(this._destroy)
    ).subscribe((min) => {
      console.log('min', min)
      this.swap('min', min)
    })
    
    // State select
    this.max$.pipe(
      takeUntil(this._destroy)
    ).subscribe((max) => {
      console.log('max', max)
      this.swap('max', max)
    })
    
    // State select
    this.step$.pipe(
      takeUntil(this._destroy)
    ).subscribe((step) => {
      console.log('step', step)
      this.swap('step', step)
    })
    
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