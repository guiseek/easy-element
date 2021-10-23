(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorate = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // src/core/render.ts
  function tmpl(strings, ...values) {
    const template = document.createElement("template");
    template.innerHTML = strings.join("");
    return template;
  }
  var EasyRenderElement = class extends HTMLElement {
  };

  // src/core/template/bindings.ts
  function isBoundEventHandlerNode(node) {
    return node.hasOwnProperty("eventName");
  }
  function isBoundPropertyNode(node) {
    return node.hasOwnProperty("propName");
  }
  var TemplateBindings = class {
    constructor(bindingsMap) {
      this._map = bindingsMap;
    }
    setData(data) {
      Object.keys(data).forEach((key) => this.set(key, data[key]));
    }
    set(name, value) {
      const boundNodes = this._map.get(name);
      if (boundNodes) {
        for (let boundNode of boundNodes) {
          const {node} = boundNode;
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = value.toString();
          } else if (isBoundEventHandlerNode(boundNode)) {
            const {eventHandler, eventName} = boundNode;
            node.removeEventListener(eventName, eventHandler);
            node.addEventListener(eventName, value);
            boundNode.eventHandler = value;
          } else if (isBoundPropertyNode(boundNode)) {
            ;
            node.props[boundNode.propName] = value;
          } else {
            const {values, originalValue} = boundNode;
            values.set(name, value.toString());
            let attrValue = originalValue;
            if (values) {
              values.forEach((value2, name2) => {
                attrValue = attrValue.replace(`{{${name2}}}`, value2);
              });
            }
            ;
            node.value = attrValue;
          }
        }
      }
    }
  };

  // src/core/template/factory.ts
  var TemplateBindingsFactory = class {
    constructor() {
      this._textBindings = [
        {
          name: "",
          path: []
        }
      ];
      this._attributeBindings = [];
      this._textBindings = [];
      this._attributeBindings = [];
    }
    addTextBinding(name, path) {
      this._textBindings.push({name, path: path.slice()});
    }
    addAttributeBinding(names, attrName, path) {
      const eventName = (attrName.startsWith("on-") ? attrName.substr(3) : "").replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const isProperty = attrName.endsWith("$");
      this._attributeBindings.push({
        names,
        attrName,
        eventName,
        isProperty,
        path: path.slice()
      });
    }
    applyTo(node) {
      const bindingsMap = new Map([]);
      for (let {name = "", path = []} of this._textBindings) {
        const nodeToBind = this.findNodeFromPath(node, path);
        nodeToBind.textContent = "";
        if (!bindingsMap.has(name)) {
          bindingsMap.set(name, []);
        }
        bindingsMap.get(name)?.push({
          node: nodeToBind
        });
      }
      for (let binding of this._attributeBindings) {
        const {names, attrName, path, eventName, isProperty} = binding;
        const nodeToBind = this.findNodeFromPath(node, path);
        const attrNode = nodeToBind.getAttributeNode(attrName);
        if (eventName && attrNode) {
          const ownerElement = attrNode.ownerElement;
          const binding2 = {
            node: ownerElement,
            eventName,
            eventHandler: null
          };
          ownerElement.removeAttribute(attrNode.name);
          if (!bindingsMap.has(names[0])) {
            bindingsMap.set(names[0], []);
          }
          bindingsMap.get(names[0])?.push(binding2);
        } else if (isProperty) {
          const ownerElement = attrNode.ownerElement;
          const propName = attrNode.name.slice(0, -1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          const binding2 = {
            node: ownerElement,
            propName
          };
          ownerElement.props = ownerElement.props || {};
          ownerElement.props[propName] = null;
          ownerElement.removeAttribute(attrNode.name);
          if (!bindingsMap.has(names[0])) {
            bindingsMap.set(names[0], []);
          }
          bindingsMap.get(names[0])?.push(binding2);
        } else {
          const binding2 = {
            node: attrNode,
            originalValue: attrNode.value,
            values: new Map()
          };
          for (let name of names) {
            if (!bindingsMap.has(name)) {
              bindingsMap.set(name, []);
            }
            binding2.values.set(name, "");
            bindingsMap.get(name)?.push(binding2);
          }
          let attrValue = binding2.originalValue;
          binding2.values.forEach((value, name) => {
            attrValue = attrValue.replace(`{{${name}}}`, value);
          });
          attrNode.value = attrValue;
        }
      }
      return new TemplateBindings(bindingsMap);
    }
    findNodeFromPath(node, path) {
      let result = node;
      for (let pathSegment of path) {
        result = result.childNodes[pathSegment];
      }
      return result;
    }
  };

  // src/core/template/parser.ts
  var TemplateBindingsParser = class {
    static parse(template) {
      const bindings = new TemplateBindingsFactory();
      this.parseNodes(bindings, template.content.childNodes, []);
      return bindings;
    }
    static parseNodes(bindings, nodes, path) {
      for (let i = 0; i < nodes.length; i++) {
        path.push(i);
        this.parseNode(bindings, nodes[i], path);
        path.pop();
      }
    }
    static parseNode(bindings, node, path) {
      if (node.nodeType === Node.TEXT_NODE) {
        return this.parseTextBindings(bindings, node, path);
      }
      if (node instanceof Element) {
        if (node.hasAttributes()) {
          this.parseAttributes(bindings, node.attributes, path);
        }
        if (node.hasChildNodes()) {
          this.parseNodes(bindings, node.childNodes, path);
        }
      }
    }
    static parseAttributes(bindings, attributes, path) {
      for (let i = 0; i < attributes.length; i++) {
        this.parseAttribute(bindings, attributes[i], path);
      }
    }
    static parseAttribute(bindings, attribute, path) {
      const regex = new RegExp(this.BINDING_REGEX.source, "g");
      const names = [];
      let match = regex.exec(attribute.value);
      while (match) {
        names.push(match[1]);
        match = regex.exec(attribute.value);
      }
      if (names.length) {
        bindings.addAttributeBinding(names, attribute.name, path);
      }
    }
    static parseTextBindings(bindings, node, path) {
      const regex = new RegExp(this.BINDING_REGEX.source, "g");
      const match = regex.exec(`${node.textContent}`);
      if (match) {
        if (match.index) {
          node.splitText(match.index);
          return;
        }
        if (node.length > match[0].length) {
          node.splitText(match[0].length);
        }
        const name = match[1];
        bindings.addTextBinding(name, path);
      }
    }
  };
  TemplateBindingsParser.BINDING_REGEX = /{{([a-zA-z0-9]*)}}/;

  // src/core/template/bound.ts
  var BoundTemplate = class {
    constructor(template) {
      this._bindingsFactory = null;
      this._template = template;
    }
    create(data) {
      if (!this._bindingsFactory) {
        this._bindingsFactory = TemplateBindingsParser.parse(this._template);
      }
      const instance = this._template.content.cloneNode(true);
      const bindings = this._bindingsFactory.applyTo(instance);
      if (data) {
        bindings.setData(data);
      }
      return [instance, bindings];
    }
  };
  var bound_default = BoundTemplate;

  // src/core/noop.ts
  var noop = () => null;

  // src/core/easy.ts
  function Easy(options) {
    const {name, tmpl: tmpl2, style, mode} = options;
    return function(target) {
      const connected = target.prototype.connectedCallback ?? noop;
      target.prototype.connectedCallback = function() {
        const shadow = this.attachShadow({mode});
        if (style)
          shadow.appendChild(style);
        if (tmpl2) {
          const bound = new bound_default(tmpl2);
          const [instance, bindings] = bound.create(this);
          target.prototype.bind = (data) => {
            bindings.setData(data);
          };
          target.prototype.swap = (name2, value) => {
            bindings.set(name2, value);
          };
          shadow.appendChild(instance);
        }
        connected.call(this);
      };
      customElements.define(name, target);
    };
  }

  // src/main.ts
  var MyEasyElement = class extends EasyRenderElement {
    constructor() {
      super(...arguments);
      this.text = "123";
    }
    connectedCallback() {
      setTimeout(() => {
        this.swap("text", "456");
      }, 2e3);
    }
  };
  MyEasyElement = __decorate([
    Easy({
      mode: "open",
      name: "easy-element",
      tmpl: tmpl`
    <h1>Text {{text}}</h1>
  `
    })
  ], MyEasyElement);
  var easyElement = document.querySelector("easy-element");
})();
//# sourceMappingURL=main.js.map
