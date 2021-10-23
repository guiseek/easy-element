import { TemplateBindingsFactory } from './factory'
import { TemplateBindingsParser } from './parser'
import { TemplateBindings } from './bindings'

/**
 * Esta classe transforma um TemplateHTMLElement padrão para
 * uma factory que cria instâncias de clones de templates
 * com bindings nomeados que atualizam dinamicamente o DOM.
 */
export default class BoundTemplate {
  _bindingsFactory: null | TemplateBindingsFactory
  _template: HTMLTemplateElement

  constructor(template: HTMLTemplateElement) {
    this._bindingsFactory = null
    this._template = template
  }

  /**
   * Cria um clone do template e objeto de bindings associado.
   * Se esta for a primeira instância criada, também é
   * executado a análise inicial do template.
   */
  create(data?: object): [Node, TemplateBindings] {
    if (!this._bindingsFactory) {
      this._bindingsFactory = TemplateBindingsParser.parse(this._template)
    }

    const instance = this._template.content.cloneNode(true)
    const bindings = this._bindingsFactory.applyTo(instance)

    if (data) {
      bindings.setData(data)
    }

    return [instance, bindings]
  }
}
