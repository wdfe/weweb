import Element from './Element'

const VirtualNode = function () {}
VirtualNode.prototype = Object.create(Element.prototype, {
  constructor: {
    value: VirtualNode,
    writable: true,
    configurable: true
  }
})

// createVirtualNode
VirtualNode.create = function (is) {
  const insVirtualNode = Object.create(VirtualNode.prototype)
  insVirtualNode.__virtual = true
  insVirtualNode.is = is
  Element.initialize(insVirtualNode, null)
  return insVirtualNode
}

export default VirtualNode
