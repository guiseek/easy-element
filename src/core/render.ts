import { TemplateBindings } from './template/bindings'
import { concatValues } from './values'

export function css(strings: TemplateStringsArray, ...values: unknown[]) {
  const style = document.createElement('style')
  style.textContent = concatValues(strings, values)
  return style
}

export function html(strings: TemplateStringsArray, ...values: unknown[]) {
  const template = document.createElement('template')
  template.innerHTML = concatValues(strings, values)
  return template
}

export function tmpl(strings: TemplateStringsArray, ...values: unknown[]) {
  const template = document.createElement('template')
  template.innerHTML = strings.join('')
  return template
}

export abstract class EasyElement extends HTMLElement {
  bind!: <T extends Record<string, any>>(data: T) => void
  swap!: (name: string, value: any) => void
}
