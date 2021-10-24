import { TemplateBindingsFactory } from './factory'

/**
 * Responsável por analisar um HTMLTemplateElement e
 * transformá-lo em uma instância TemplateBindingsFactory
 * que pode então produzir TemplateBindings
 * para instâncias individuais do template.
 */
export class TemplateBindingsParser {
  static BINDING_REGEX = /{{([a-zA-z0-9]*)}}/

  static parse(template: HTMLTemplateElement) {
    const bindings = new TemplateBindingsFactory()

    this.parseNodes(bindings, template.content.childNodes, [])

    return bindings
  }

  /**
   * Percorre os elementos procurando
   * template bindings
   */
  static parseNodes(
    bindings: TemplateBindingsFactory,
    nodes: NodeList,
    path: number[]
  ) {
    /**
     * Fazemos uma travessia em profundidade
     * dos nós com visita de prefixo para
     * realmente analisar ligações
     */
    for (let i = 0; i < nodes.length; i++) {
      path.push(i)
      this.parseNode(bindings, nodes[i], path)
      path.pop()
    }
  }

  // Verifica template bindings de 1 node
  static parseNode(
    bindings: TemplateBindingsFactory,
    node: Node,
    path: number[]
  ) {
    if (node.nodeType === Node.TEXT_NODE) {
      return this.parseTextBindings(bindings, node as Text, path)
    }

    if (node instanceof Element) {
      if (node.hasAttributes()) {
        this.parseAttributes(bindings, node.attributes, path)
      }

      if (node.hasChildNodes()) {
        this.parseNodes(bindings, node.childNodes, path)
      }
    }
  }

  // Analisa os atributos de um nó para ver
  // se eles têm alguma vinculação de modelo
  static parseAttributes(
    bindings: TemplateBindingsFactory,
    attributes: NamedNodeMap,
    path: number[]
  ) {
    for (let i = 0; i < attributes.length; i++) {
      this.parseAttribute(bindings, attributes[i], path)
    }
  }

  // Analisa um único nó de atributo
  // para ligações de modelo
  static parseAttribute(
    bindings: TemplateBindingsFactory,
    attribute: Attr,
    path: number[]
  ) {
    const regex = new RegExp(this.BINDING_REGEX.source, 'g')
    const names: string[] = []
    let match = regex.exec(attribute.value)
    while (match) {
      names.push(match[1])
      match = regex.exec(attribute.value)
    }

    if (names.length) {
      bindings.addAttributeBinding(names, attribute.name, path)
    }
  }

  // Analisa um único nó de texto
  // para ligações de modelo
  static parseTextBindings(
    bindings: TemplateBindingsFactory,
    node: Text,
    path: number[]
  ) {
    const regex = new RegExp(this.BINDING_REGEX.source, 'g')
    const match = regex.exec(`${node.textContent}`)
    if (match) {
      if (match.index) {
        node.splitText(match.index)
        return
      }

      if (node.length > match[0].length) {
        node.splitText(match[0].length)
      }

      const name = match[1]
      bindings.addTextBinding(name, path)
    }
  }
}
