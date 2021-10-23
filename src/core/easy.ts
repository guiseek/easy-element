import { noop } from './noop'

export type EasyOptions<T> = {
  name: string
  html?: (params: T) => HTMLTemplateElement
  style?: HTMLStyleElement
} & ShadowRootInit

export function Easy<T>(options: EasyOptions<T>) {
  const { name, html, style, mode } = options
  return function <T extends CustomElementConstructor>(target: T) {
    const connected = target.prototype.connectedCallback ?? noop

    target.prototype.connectedCallback = function () {
      const shadow: ShadowRoot = this.attachShadow({ mode })
      if (style) shadow.appendChild(style)

      target.prototype.render = (params: any) => {
        if (html) {
          shadow.innerHTML = ''
          const { content } = html(params)
          const template = content.cloneNode(true)
          shadow.appendChild(template)
        }
      }

      if (html) {
        const { content } = html(this)
        const template = content.cloneNode(true)
        shadow.appendChild(template)
      }

      connected.call(this)
    }

    customElements.define(name, target)
  }
}
