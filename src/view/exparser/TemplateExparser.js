import Events from './Events'

const TemplateExparser = function () {}
TemplateExparser.prototype = Object.create(Object.prototype, {
  constructor: {
    value: TemplateExparser,
    writable: true,
    configurable: true
  }
})

TemplateExparser.parse = function (value, methods) {
  let tempObj = Object.create(TemplateExparser.prototype)
  let slices = value.split(/\{\{(.*?)\}\}/g)
  let boundPropList = []
  for (let idx = 0; idx < slices.length; idx++) {
    if (idx % 2) {
      let methodSlices = slices[idx].match(/^(!?)([-_a-zA-Z0-9]+)(?:\((([-_a-zA-Z0-9]+)(,[-_a-zA-Z0-9]+)*)\))?$/) || [!1, '']
      let args = null
      if (methodSlices[3]) {
        args = methodSlices[3].split(',')
        for (let argIdx = 0; argIdx < args.length; argIdx++) {
          boundPropList.indexOf(args[argIdx]) < 0 && boundPropList.push(args[argIdx])
        }
      } else { // single arg
        boundPropList.indexOf(methodSlices[2]) < 0 && boundPropList.push(methodSlices[2])
      }
      slices[idx] = {
        not: !!methodSlices[1],
        prop: methodSlices[2],
        callee: args
      }
    }
  }

  tempObj.bindedProps = boundPropList
  tempObj.isSingleletiable = slices.length === 3 && slices[0] === '' && slices[2] === ''
  tempObj._slices = slices
  tempObj._methods = methods
  return tempObj
}

const propCalculate = function (ele, defaultValues, methods, opt) {
  let res = ''
  if (opt.callee) {
    let args = [], idx = 0
    for (; idx < opt.callee.length; idx++) {
      args[idx] = defaultValues[opt.callee[idx]]
    }
    res = Events.safeCallback('TemplateExparser Method', methods[opt.prop], ele, args)
    undefined !== res && res !== null || (res = '')
  } else {
    res = defaultValues[opt.prop]
  }
  if (opt.not) {
    return !res
  } else {
    return res
  }
}

TemplateExparser.prototype.calculate = function (ele, defaultValues) {
  let slices = this._slices
  let opt = null
  let value = ''
  if (this.isSingleletiable) {
    opt = slices[1]
    value = propCalculate(ele, defaultValues, this._methods, opt)
  } else {
    for (let idx = 0; idx < slices.length; idx++) {
      opt = slices[idx]
      if (idx % 2) {
        value += propCalculate(ele, defaultValues, this._methods, opt)
      } else {
        value += opt
      }
    }
  }
  return value
}

export default TemplateExparser
