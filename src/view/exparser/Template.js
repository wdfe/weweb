import BoundProps from './BoundProps'
import TextParser from './TemplateExparser'
import element from './Element'
import initialize from './SlotNode'
import VirtualNode from './VirtualNode'
import TextNode from './TextNode'

const dollarSign = String.fromCharCode(36)

function dashToCamel (txt) {
  return txt.replace(/-([a-z])/g, function (match, p1) {
    return p1.toUpperCase()
  })
}

const Instance = function () {}
Instance.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Instance,
    writable: true,
    configurable: true
  }
})

function getAttributes (attributes) {
  let tempObj = Object.create(null)
  let idx = 0
  for (; idx < attributes.length; idx++) {
    tempObj[attributes[idx].name] = attributes[idx].value
  }
  return tempObj
}

const setObjAttr = function (obj, key, value) {
  obj[key] = value
}

function renderTemplateWithRealDom (nodes, shadowRoot, idMap, slots, binding) {
  // 把nodes追加到shadowRoot下
  let newNode = null

  let attrIdx = 0

  let attr = null

  let rootIdx = 0
  for (; rootIdx < nodes.length; rootIdx++) {
    let node = nodes[rootIdx]
    if (node.name === undefined) {
      newNode = TextNode.create(node.text)
      node.exp &&
        binding.add(node.exp, newNode.__domElement, 'textContent', setObjAttr)
      element.appendChild(shadowRoot, newNode)
    } else {
      let attributes = node.attrs
      if (node.name === 'virtual') {
        newNode = VirtualNode.create(node.virtual)
      } else if (node.custom) {
        newNode = componentSystem.create(node.name)
        attrIdx = 0
        for (; attrIdx < attributes.length; attrIdx++) {
          attr = attributes[attrIdx]
          if (attr.updater) {
            attr.updater(newNode, attr.name, attr.value)
          } else {
            if (newNode.__behavior.properties[attr.name].type === Boolean) {
              newNode[attr.name] = !0
            } else {
              newNode[attr.name] = attr.value
            }
          }
          attr.exp && binding.add(attr.exp, newNode, attr.name, attr.updater)
        }
      } else {
        newNode = initialize.wrap(document.importNode(node.prerendered, !1)) // 以real dom创建Vnode
        attrIdx = 0
        for (; attrIdx < attributes.length; attrIdx++) {
          attr = attributes[attrIdx]
          binding.add(attr.exp, newNode.__domElement, attr.name, attr.updater)
        }
      }
      element.appendChild(shadowRoot, newNode)
      node.id && (idMap[node.id] = newNode)
      node.slot !== undefined && (slots[node.slot] = newNode)
      renderTemplateWithRealDom(node.children, newNode, idMap, slots, binding)
    }
  }
}

function nativeRendering (nodes, shadowRoot, idMap, slots, binding) {
  let tempNode = null

  let attrIdx = 0

  let attr = null

  let idx = 0
  for (; idx < nodes.length; idx++) {
    let nodeItem = nodes[idx]
    if (void 0 === nodeItem.name) {
      tempNode = document.createTextNode(nodeItem.text)
      nodeItem.exp &&
        binding.add(nodeItem.exp, tempNode, 'textContent', setObjAttr)
      shadowRoot.appendChild(tempNode)
    } else {
      let attributes = nodeItem.attrs
      tempNode = document.importNode(nodeItem.prerendered, false)
      attrIdx = 0
      for (; attrIdx < attributes.length; attrIdx++) {
        attr = attributes[attrIdx]
        binding.add(attr.exp, tempNode, attr.name, attr.updater)
      }
      shadowRoot.appendChild(tempNode)
      nodeItem.id && (idMap[nodeItem.id] = tempNode)
      undefined !== nodeItem.slot && (slots[nodeItem.slot] = tempNode)
      nativeRendering(nodeItem.children, tempNode, idMap, slots, binding)
    }
  }
}

const Template = function () {}
Template.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Template,
    writable: true,
    configurable: true
  }
})

let componentSystem = null
Template._setCompnentSystem = function (obj) {
  componentSystem = obj
}

let globalOptions = function () {
  return {
    renderingMode: 'native',
    keepWhiteSpace: false,
    parseTextContent: false
  }
}
Template._setGlobalOptionsGetter = function (opt) {
  globalOptions = opt
}

const toggleDomClassAttr = function (ele, classname, force) {
  ele.__domElement.classList.toggle(classname, !!force)
}

const setDomStyle = function (ele, attr, value) {
  ele.__domElement.style[attr] = value
}

const setAttr = function (ele, attr, value) {
  if (value === !0) {
    ele.setAttribute(attr, '')
  } else {
    if (value === false || undefined === value || value === null) {
      ele.removeAttribute(attr)
    } else {
      ele.setAttribute(attr, value)
    }
  }
}

const toggleClassAttr = function (ele, classname, force) {
  ele.classList.toggle(classname, !!force)
}

const setStyle = function (ele, attr, value) {
  ele.style[attr] = value
}

let slot = {
  name: 'virtual',
  virtual: 'slot',
  slot: '',
  attrs: [],
  children: []
}
let virtual = {
  name: 'virtual',
  slot: '',
  attrs: [],
  prerendered: document.createElement('virtual'),
  children: []
}

// create(insElement, defaultValuesJSON, componentBehavior.methods, opts)
Template.create = function (ele, data, behaviorMethods, opts) {
  // opts:Element.options ele：dom
  let globOpt = globalOptions()
  let renderingMode = opts.renderingMode || globOpt.renderingMode
  let slotRef = slot
  if (renderingMode === 'native') {
    slotRef = virtual
  }
  // 确定配置项
  let eleAttributes = getAttributes(ele.attributes)
  let textParseOpt = {
    parseTextContent:
      undefined !== eleAttributes['parse-text-content'] ||
      opts.parseTextContent ||
      globOpt.parseTextContent,
    keepWhiteSpace:
      undefined !== eleAttributes['keep-white-space'] ||
      opts.keepWhiteSpace ||
      globOpt.keepWhiteSpace
  }

  let content = ele.content
  if (ele.tagName !== 'TEMPLATE') {
    content = document.createDocumentFragment()
    for (; ele.childNodes.length;) {
      content.appendChild(ele.childNodes[0])
    }
  }

  let isSlotPushed = false

  const parse = function (nodeList, contentChildNodes, tempArr, parseOpt) {
    let exp

    let nodeIdx = 0
    for (; nodeIdx < contentChildNodes.length; nodeIdx++) {
      let node = contentChildNodes[nodeIdx]
      let treeLengthList = tempArr.concat(nodeList.length)
      if (node.nodeType !== 8) {
        // if not Node.COMMENT_NODE
        if (node.nodeType !== 3) {
          // if not Node.TEXT_NODE
          if (node.tagName !== 'WX-CONTENT' && node.tagName !== 'SLOT') {
            // 不是占位标签
            let isCustomEle =
              node.tagName.indexOf('-') >= 0 && renderingMode !== 'native'
            let prerendered = null
            isCustomEle || (prerendered = document.createElement(node.tagName))
            let id = ''
            let nodeAttributes = node.attributes
            let attrs = []
            if (nodeAttributes) {
              let pareOpts = {}

              let attrIdx = 0
              for (; attrIdx < nodeAttributes.length; attrIdx++) {
                let nodeAttr = nodeAttributes[attrIdx]
                if (nodeAttr.name === 'id') {
                  id = nodeAttr.value
                } else if (nodeAttr.name === 'parse-text-content') {
                  pareOpts.parseTextContent = true
                } else if (nodeAttr.name === 'keep-white-space') {
                  pareOpts.keepWhiteSpace = true
                } else {
                  exp = undefined
                  let attrSetter
                  let attrName = nodeAttr.name

                  if (nodeAttr.name.slice(-1) === dollarSign) {
                    // 属性名末尾是$
                    if (isCustomEle) {
                      attrSetter = setObjAttr
                      attrName = dashToCamel(nodeAttr.name.slice(0, -1))
                    } else {
                      // dom
                      attrSetter = setAttr
                      attrName = nodeAttr.name.slice(0, -1)
                    }
                  } else {
                    if (nodeAttr.name.slice(-1) === ':') {
                      attrSetter = setObjAttr // 整理后isCustomEle ? setAttr : setObjAttr 这是有误的
                      attrName = dashToCamel(nodeAttr.name.slice(0, -1))
                    } else {
                      if (nodeAttr.name.slice(0, 6) === 'class.') {
                        attrSetter = isCustomEle
                          ? toggleDomClassAttr
                          : toggleClassAttr
                        attrName = nodeAttr.name.slice(6)
                      } else {
                        if (nodeAttr.name.slice(0, 6) === 'style.') {
                          attrSetter = isCustomEle ? setDomStyle : setStyle
                          attrName = nodeAttr.name.slice(6)
                        }
                      }
                    }
                  }
                  attrSetter &&
                    (exp = TextParser.parse(nodeAttr.value, behaviorMethods))
                  let value = exp ? exp.calculate(null, data) : nodeAttr.value
                  isCustomEle ||
                    (attrSetter || setAttr)(prerendered, attrName, value)
                  ;(isCustomEle || exp) &&
                    attrs.push({
                      // isCustomEle 为后面设置属性用
                      name: attrName,
                      value: value,
                      updater: attrSetter,
                      exp: exp
                    })
                }
              }

              let elementNode = {
                name: node.tagName.toLowerCase(),
                id: id,
                custom: isCustomEle,
                attrs: attrs,
                prerendered: prerendered,
                children: []
              }
              nodeList.push(elementNode)
              node.tagName === 'VIRTUAL' && (elementNode.virtual = 'virtual')
              node.childNodes &&
                parse(
                  elementNode.children,
                  node.childNodes,
                  treeLengthList,
                  pareOpts
                )
              if (
                elementNode.children.length === 1 &&
                elementNode.children[0] === slotRef
              ) {
                elementNode.children.pop()
                elementNode.slot = ''
              }
            }
          } else {
            isSlotPushed = true
            nodeList.push(slotRef)
          }
        } else {
          // if Node.TEXT_NODE
          let text = node.textContent
          if (!parseOpt.keepWhiteSpace) {
            text = text.trim()
            if (text === '') continue
            node.textContent = text
          }
          exp = undefined
          parseOpt.parseTextContent &&
            (exp = TextParser.parse(text, behaviorMethods))
          nodeList.push({
            exp: exp,
            text: exp ? exp.calculate(null, data) : text
          })
        }
      }
    }
  }

  let nodeList = []
  parse(nodeList, content.childNodes, [], textParseOpt)
  isSlotPushed || nodeList.push(slotRef)
  nodeList.length === 1 && nodeList[0] === slotRef && nodeList.pop()
  let tempTemplate = Object.create(Template.prototype)
  tempTemplate._tagTreeRoot = nodeList
  tempTemplate._renderingMode = renderingMode
  return tempTemplate
}

Template.prototype.createInstance = function () {
  let ins = Object.create(Instance.prototype)
  let idMap = Object.create(null)
  let slots = Object.create(null)
  let _binding = BoundProps.create()
  let shadowRoot = document.createDocumentFragment()

  if (this._renderingMode === 'native') {
    // console.log(this._tagTreeRoot, shadowRoot, idMap, slots, _binding)
    nativeRendering(this._tagTreeRoot, shadowRoot, idMap, slots, _binding)
  } else {
    shadowRoot = VirtualNode.create('shadow-root')
    renderTemplateWithRealDom(
      this._tagTreeRoot,
      shadowRoot,
      idMap,
      slots,
      _binding
    )
  }

  ins.shadowRoot = shadowRoot
  ins.idMap = idMap
  ins.slots = slots
  ins._binding = _binding
  return ins
}

Instance.prototype.updateValues = function (ele, propData, propKey) {
  propKey && this._binding.update(ele, propData, propKey)
}

export default Template
