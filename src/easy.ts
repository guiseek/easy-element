import BoundTemplate from './template/bound'
import { noop } from './noop'

export type EasyOptions<T> = {
  name: string
  html?: HTMLTemplateElement
  style?: HTMLStyleElement
} & ShadowRootInit

export function Easy<T>(options: EasyOptions<T>) {
  const { name, html, style, mode } = options
  return function <T extends CustomElementConstructor>(target: T) {
    const connected = target.prototype.connectedCallback ?? noop

    target.prototype.connectedCallback = function () {
      const shadow: ShadowRoot = this.attachShadow({ mode })
      if (style) shadow.appendChild(style)

      if (html) {
        const bound = new BoundTemplate(html)
        const [instance, bindings] = bound.create(this)

        target.prototype.bind = (data: T) => {
          bindings.setData(data)
        }
        target.prototype.swap = (name: string, value: any) => {
          bindings.set(name, value)
        }

        shadow.appendChild(instance)
      }

      connected.call(this)
    }

    customElements.define(name, target)
  }
}
