import BoundProps from './BoundProps'
import calculate from './TemplateExparser'
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

function childrenAppend (nodes, shadowRoot, idMap, slots, binding) {//把nodes追加到shadowRoot下
  let newNode = null, attrIdx = 0, attr = null, rootIdx = 0
  for (; rootIdx < nodes.length; rootIdx++) {
    let node = nodes[rootIdx]
    if (node.name === undefined) {
      newNode = TextNode.create(node.text)
      node.exp && binding.add(node.exp, newNode.__domElement, 'textContent', setObjAttr)
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
        newNode = initialize.wrap(document.importNode(node.prerendered, !1))
        attrIdx = 0
        for (; attrIdx < attributes.length; attrIdx++) {
          attr = attributes[attrIdx]
          binding.add(attr.exp, newNode.__domElement, attr.name, attr.updater)
        }
      }
      element.appendChild(shadowRoot, newNode)
      node.id && (idMap[node.id] = newNode)
      node.slot !== undefined && (slots[node.slot] = newNode)
      childrenAppend(node.children, newNode, idMap, slots, binding)
    }
  }
}

function child (nodes, shadowRoot, idMap, slots, binding) {
  let tempNode = null, attrIdx = 0, attr = null, tagRootIdx = 0
  for (; tagRootIdx < nodes.length; tagRootIdx++) {
    let treeRoot = nodes[tagRootIdx]
    if (void 0 === treeRoot.name) {
      tempNode = document.createTextNode(treeRoot.text)
      treeRoot.exp && binding.add(treeRoot.exp, tempNode, 'textContent', setObjAttr)
      shadowRoot.appendChild(tempNode)
    } else {
      let attributes = treeRoot.attrs
      tempNode = document.importNode(treeRoot.prerendered, false)
      attrIdx = 0
      for (; attrIdx < attributes.length; attrIdx++) {
        attr = attributes[attrIdx]
        binding.add(attr.exp, tempNode, attr.name, attr.updater)
      }
      shadowRoot.appendChild(tempNode)
      treeRoot.id && (idMap[treeRoot.id] = tempNode)
      undefined !== treeRoot.slot && (slots[treeRoot.slot] = tempNode)
      child(treeRoot.children, tempNode, idMap, slots, binding)
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

const toggleDomClassAttr = function (ele, attr, force) {
  ele.__domElement.classList.toggle(attr, !!force)
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

const toggleClassAttr = function (ele, attr, force) {
  ele.classList.toggle(attr, !!force)
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
Template.create = function (ele, defaultValuesJSON, behaviorMethods, opts) {
  let globOpt = globalOptions()
  let renderingMode = opts.renderingMode || globOpt.renderingMode
  let slotRef = slot
  if (renderingMode === 'native') {
    slotRef = virtual
  }
  let eleAttributes = getAttributes(ele.attributes)
  let textParseOpt = {
    parseTextContent: undefined !== eleAttributes['parse-text-content'] || opts.parseTextContent || globOpt.parseTextContent,
    keepWhiteSpace: undefined !== eleAttributes['keep-white-space'] || opts.keepWhiteSpace || globOpt.keepWhiteSpace
  }

  let content = ele.content
  if (ele.tagName !== 'TEMPLATE') {
    content = document.createDocumentFragment()
    for (; ele.childNodes.length;) {
      content.appendChild(ele.childNodes[0])
    }
  }

  let isSlotPused = false

  const childNodeFn = function (tagTree, contentChildNodes, tempArr, textParseOpt) {
    let exp, nodeIdx = 0
    for (; nodeIdx < contentChildNodes.length; nodeIdx++) {
      let childNode = contentChildNodes[nodeIdx]
      let treeLengthList = tempArr.concat(tagTree.length)
      if (childNode.nodeType !== 8) { // if not Node.COMMENT_NODE
        if (childNode.nodeType !== 3) { // if not Node.TEXT_NODE
          if (childNode.tagName !== 'WX-CONTENT' && childNode.tagName !== 'SLOT') {
            let isCustomEle = childNode.tagName.indexOf('-') >= 0 && renderingMode !== 'native'
            let prerendered = null
            isCustomEle || (prerendered = document.createElement(childNode.tagName))
            let id = ''
            let childNodeAttributes = childNode.attributes
            let attrs = []
            if (childNodeAttributes) {
              let pareOpts = {}, attrIdx = 0
              for (; attrIdx < childNodeAttributes.length; attrIdx++) {
                let childNodeAttr = childNodeAttributes[attrIdx]
                if (childNodeAttr.name === 'id') {
                  id = childNodeAttr.value
                } else if (childNodeAttr.name === 'parse-text-content') {
                  pareOpts.parseTextContent = true
                } else if (childNodeAttr.name === 'keep-white-space') {
                  pareOpts.keepWhiteSpace = true
                } else {
                  exp = undefined
                  let attrSetter
                  let attrName = childNodeAttr.name
                  if (childNodeAttr.name.slice(-1) === dollarSign) {
                    if (isCustomEle) {
                      attrSetter = setObjAttr
                      attrName = dashToCamel(childNodeAttr.name.slice(0, -1))
                    } else { // 需要计算的 class?
                      attrSetter = setAttr
                      attrName = childNodeAttr.name.slice(0, -1)
                    }
                  } else {
                    if (childNodeAttr.name.slice(-1) === ':') {
                      attrSetter = isCustomEle ? setAttr : setObjAttr
                      attrName = dashToCamel(childNodeAttr.name.slice(0, -1))
                    } else {
                      if (childNodeAttr.name.slice(0, 6) === 'class.') {
                        attrSetter = isCustomEle ? toggleDomClassAttr : toggleClassAttr
                        attrName = childNodeAttr.name.slice(6)
                      } else {
                        if (childNodeAttr.name.slice(0, 6) === 'style.') {
                          attrSetter = isCustomEle ? setDomStyle : setStyle
                          attrName = childNodeAttr.name.slice(6)
                        }
                      }
                    }
                  }
                  attrSetter && (exp = calculate.parse(childNodeAttr.value, behaviorMethods))
                  let value = exp ? exp.calculate(null, defaultValuesJSON) : childNodeAttr.value
                  isCustomEle || (attrSetter || setAttr)(prerendered, attrName, value);
                  (isCustomEle || exp) && attrs.push({
                    name: attrName,
                    value: value,
                    updater: attrSetter,
                    exp: exp
                  })
                }
              }

              let elementNode = {
                name: childNode.tagName.toLowerCase(),
                id: id,
                custom: isCustomEle,
                attrs: attrs,
                prerendered: prerendered,
                children: []
              }
              tagTree.push(elementNode)
              childNode.tagName === 'VIRTUAL' && (elementNode.virtual = 'virtual')
              childNode.childNodes && childNodeFn(elementNode.children, childNode.childNodes, treeLengthList, pareOpts)
              if (elementNode.children.length === 1 && elementNode.children[0] === slotRef) {
                elementNode.children.pop()
                elementNode.slot = ''
              }
            }
          } else {
            isSlotPused = true
            tagTree.push(slotRef)
          }
        } else {
          let text = childNode.textContent
          if (!textParseOpt.keepWhiteSpace) {
            text = text.trim()
            if (text === '') continue
            childNode.textContent = text
          }
          exp = undefined
          textParseOpt.parseTextContent && (exp = calculate.parse(text, behaviorMethods))
          tagTree.push({
            exp: exp,
            text: exp ? exp.calculate(null, defaultValuesJSON) : text
          })
        }
      }
    }
  }

  let tagTree = []
  childNodeFn(tagTree, content.childNodes, [], textParseOpt)
  isSlotPused || tagTree.push(slotRef)
  tagTree.length === 1 && tagTree[0] === slotRef && tagTree.pop()
  let tempTemplate = Object.create(Template.prototype)
  tempTemplate._tagTreeRoot = tagTree
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
    child(this._tagTreeRoot, shadowRoot, idMap, slots, _binding)
  } else {
    shadowRoot = VirtualNode.create('shadow-root')
    childrenAppend(this._tagTreeRoot, shadowRoot, idMap, slots, _binding)
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
