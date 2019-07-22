import et from 'et-improve'
import domify from 'domify'
import classes from 'classes'

const tmpl = `
<div>
  <div class="wx-action-sheet-mask"></div>
  <div class="wx-action-sheet wx-action-sheet-show">
    <div class="wx-action-sheet-menu">
      {{each _.itemList as item, index}}
      <div class="wx-action-sheet-item" data-index="{{= index}}" style="color: {{= _.itemColor}};">{{= item}}</div>
      {{/}}
      <div class="wx-action-sheet-item-cancel">
      <div class="wx-action-sheet-middle"></div>
      <div class="wx-action-sheet-cancel" style="color: rgb(0, 0, 0);">取消</div>
      </div>
    </div>
  </div>
</div>
`
const fn = et.compile(tmpl)

let el = null

export default function ({ itemList, itemColor = '#000000' }) {
  if (el && el.parentNode) el.parentNode.removeChild(el)

  el = domify(fn({ itemList, itemColor }))
  let called = false
  return new Promise((resolve,reject) => {
    el.addEventListener(
      'click',
      e => {
        e.preventDefault();
        e.stopPropagation();
        if (called) return
        if (classes(e.target).has('wx-action-sheet-mask')) {
          called = true
          reject({ cancel:true, errMsg:"showActionSheet:fail cancel" })
        } else if (classes(e.target).has('wx-action-sheet-item')) {
          called = true
          resolve({
            cancel: false,
            tapIndex: Number(e.target.getAttribute('data-index'))
          })
        } else if (classes(e.target).has('wx-action-sheet-cancel')) {
          called = true
          reject({ cancel:true, errMsg:"showActionSheet:fail cancel" })
        }
        if (called && el && el.parentNode) el.parentNode.removeChild(el)
      },
      false
    )
    // 解决遮罩弹框事件穿透的问题
    setTimeout(function () {
      // 必须延迟一些，要不然会立即触发click
      document.body.appendChild(el)
    }, 100)
  })
}
