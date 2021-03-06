import { TemplateBindings } from './bindings'
import {
  BoundNode,
  BoundAttributeNode,
  BoundEventHandlerNode,
  BoundPropertyNode,
} from './interfaces'
import { ElementProps } from './types'

interface Binding {
  path: number[]
}

interface TextBinding extends Binding {
  name: string
}

interface AttributeBinding extends Binding {
  names: string[]
  attrName: string
  eventName: string
  isProperty: boolean
}

/**
 * Stores info about bindings for a parsed template. It can then apply the
 * binding info to a cloned instance of the template quickly and return a
 * TemplateBindings instance to interact with the data directly.
 */
export class TemplateBindingsFactory {
  private _textBindings: TextBinding[] = [
    {
      name: '',
      path: [],
    },
  ]
  private _attributeBindings: AttributeBinding[] = []

  constructor() {
    this._textBindings = []
    this._attributeBindings = []
  }

  addTextBinding(name: string, path: number[]) {
    this._textBindings.push({ name, path: path.slice() })
  }

  addAttributeBinding(names: string[], attrName: string, path: number[]) {
    const eventName = (
      attrName.startsWith('on-') ? attrName.substr(3) : ''
    ).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    const isProperty = attrName.endsWith('$')

    this._attributeBindings.push({
      names,
      attrName,
      eventName,
      isProperty,
      path: path.slice(),
    })
  }

  applyTo(node: Node) {
    const bindingsMap = new Map<string, BoundNode[]>([])

    for (let { name = '', path = [] } of this._textBindings) {
      const nodeToBind = this.findNodeFromPath(node, path)

      nodeToBind.textContent = ''

      if (!bindingsMap.has(name)) {
        bindingsMap.set(name, [])
      }

      bindingsMap.get(name)?.push({
        node: nodeToBind,
      })
    }

    for (let binding of this._attributeBindings) {
      const { names, attrName, path, eventName, isProperty } = binding

      const nodeToBind = this.findNodeFromPath(node, path)

      const attrNode = (nodeToBind as Element).getAttributeNode(
        attrName
      ) as Attr

      if (eventName && attrNode) {
        const ownerElement = attrNode.ownerElement as ElementProps
        const binding: BoundEventHandlerNode = {
          node: ownerElement,
          eventName,
          eventHandler: null,
        }

        ownerElement.removeAttribute(attrNode.name)
        if (!bindingsMap.has(names[0])) {
          bindingsMap.set(names[0], [])
        }

        bindingsMap.get(names[0])?.push(binding)
      } else if (isProperty) {
        const ownerElement = attrNode.ownerElement as ElementProps
        const propName = attrNode.name
          .slice(0, -1)
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase())

        const binding: BoundPropertyNode = {
          node: ownerElement,
          propName,
        }

        ownerElement.props = ownerElement.props || {}
        ownerElement.props[propName] = null
        ownerElement.removeAttribute(attrNode.name)
        if (!bindingsMap.has(names[0])) {
          bindingsMap.set(names[0], [])
        }

        bindingsMap.get(names[0])?.push(binding)
      } else {
        const binding: BoundAttributeNode = {
          node: attrNode,
          originalValue: attrNode.value,
          values: new Map<string, string>(),
        }

        for (let name of names) {
          if (!bindingsMap.has(name)) {
            bindingsMap.set(name, [])
          }

          binding.values.set(name, '')
          bindingsMap.get(name)?.push(binding)
        }

        let attrValue = binding.originalValue
        binding.values.forEach((value, name) => {
          attrValue = attrValue.replace(`{{${name}}}`, value)
        })
        // for (let [name, value] of binding.values) {
        //   attrValue = attrValue.replace(`{{${name}}}`, value)
        // }

        attrNode.value = attrValue
      }
    }
    return new TemplateBindings(bindingsMap)
  }

  findNodeFromPath(node: Node, path: number[]) {
    let result = node
    for (let pathSegment of path) {
      result = result.childNodes[pathSegment]
    }
    return result
  }
}
