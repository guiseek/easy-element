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

export abstract class EasyRenderElement extends HTMLElement {
  render(params: any) { }
}
