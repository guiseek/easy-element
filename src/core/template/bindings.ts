import {
  BoundNode,
  BoundAttributeNode,
  BoundEventHandlerNode,
  BoundPropertyNode,
} from './interfaces'
import { ElementProps } from './types'

function isBoundEventHandlerNode(
  node: BoundNode
): node is BoundEventHandlerNode {
  return node.hasOwnProperty('eventName')
}

function isBoundPropertyNode(node: BoundNode): node is BoundPropertyNode {
  return node.hasOwnProperty('propName')
}

/**
 * Fornece uma interface simples para
 * inserção de dados em um template
 */
export class TemplateBindings {
  _map: Map<string, BoundNode[]>

  constructor(bindingsMap: Map<string, BoundNode[]>) {
    this._map = bindingsMap
  }

  setData(data: Record<string, any>) {
    Object.keys(data).forEach((key) => this.set(key, data[key]))
  }

  set(name: string, value: any) {
    const boundNodes = this._map.get(name)
    if (boundNodes) {
      for (let boundNode of boundNodes) {
        const { node } = boundNode
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = value.toString()
        } else if (isBoundEventHandlerNode(boundNode)) {
          const { eventHandler, eventName } = boundNode
          node.removeEventListener(eventName, eventHandler)
          node.addEventListener(eventName, value)
          boundNode.eventHandler = value
        } else if (isBoundPropertyNode(boundNode)) {
          ;(node as ElementProps).props[boundNode.propName] = value
        } else {
          const { values, originalValue } = boundNode as BoundAttributeNode
          values.set(name, value.toString())

          let attrValue = originalValue

          if (values) {
            values.forEach((value, name) => {
              attrValue = attrValue.replace(`{{${name}}}`, value)
            })
          }

          ;(node as Attr).value = attrValue
        }
      }
    }
  }
}
