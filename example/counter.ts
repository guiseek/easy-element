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

export class MyEasyState extends EasyState<Counter> {
  current$ = this.select(({ current }) => current)
  step$ = this.select(({ step }) => step)
  min$ = this.select(({ min }) => min)
  max$ = this.select(({ max }) => max)
  
  constructor(initial: Counter) {
    super(initial)
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
export class MyEasyCounterElement extends EasyElement {
  private _destroy = new  Subject<void>()

  state!: MyEasyState

  connectedCallback() {
    // Legend
    const title = 'Contador'
    
    const min = 0
    const step = 10
    const max = 100
    const current = 0

    this.state = new MyEasyState({ min, step, max, current })

    const dec = () => this.state.dec()
    const inc = () => this.state.inc()

    // Bind Template
    this.bind({ title, min, step, max, current, dec, inc })

    // State select
    this.state.min$.pipe(
      takeUntil(this._destroy)
    ).subscribe((min) => {
      this.swap('min', min)
    })
    
    // State select
    this.state.max$.pipe(
      takeUntil(this._destroy)
    ).subscribe((max) => {
      this.swap('max', max)
    })
    
    // State select
    this.state.step$.pipe(
      takeUntil(this._destroy)
    ).subscribe((step) => {
      this.swap('step', step)
    })
    
    // State select
    this.state.current$.pipe(
      takeUntil(this._destroy)
    ).subscribe((current) => {
      this.swap('current', current)
    })
  }

  disconnectedCallback() {
    this._destroy.next()
    this._destroy.complete()
  }
}
