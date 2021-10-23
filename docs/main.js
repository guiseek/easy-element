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

  // src/core/values.ts
  function concatValues(strings, ...values) {
    return strings.map((str, i) => str + (values[i] ?? "")).join("");
  }

  // src/core/render.ts
  function html(strings, ...values) {
    const template = document.createElement("template");
    template.innerHTML = concatValues(strings, values);
    return template;
  }
  var EasyRenderElement = class extends HTMLElement {
    render(params) {
    }
  };

  // src/core/noop.ts
  var noop = () => null;

  // src/core/easy.ts
  function Easy(options) {
    const {name, html: html2, style, mode} = options;
    return function(target) {
      const connected = target.prototype.connectedCallback ?? noop;
      target.prototype.connectedCallback = function() {
        const shadow = this.attachShadow({mode});
        if (style)
          shadow.appendChild(style);
        target.prototype.render = (params) => {
          if (html2) {
            shadow.innerHTML = "";
            const {content} = html2(params);
            const template = content.cloneNode(true);
            shadow.appendChild(template);
          }
        };
        if (html2) {
          const {content} = html2(this);
          const template = content.cloneNode(true);
          shadow.appendChild(template);
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
      this.name = "Um";
    }
    connectedCallback() {
      this.name = "Dois";
      setTimeout(() => this.render(this), 2e3);
    }
  };
  MyEasyElement = __decorate([
    Easy({
      mode: "open",
      name: "easy-element",
      html: ({name}) => html`
    <h1>${name}</h1>
  `
    })
  ], MyEasyElement);
  var easyElement = document.querySelector("easy-element");
})();
//# sourceMappingURL=main.js.map
