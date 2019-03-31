(function(z) {
  var a = 11;
  function Z(ops) {
      z.push(ops)
  }
  ;Z([3, '这里是插入到组件slot中的内容 - 定义于 index.json']);
  Z([3, '这里是插入到组件slot中的内容 - 定义于 app.json']);
}
)(z);
d_["./index/index.wxml"] = {};
var m0 = function(e, s, r, gg) {
  var oC = _n("view");
  var oD = _n("my-component");
  var oE = _n("view");
  var oF = _o(0, e, s, gg);
  _(oE, oF);
  _(oD, oE);
  _(oC, oD);
  var oG = _n("my-component-global");
  var oH = _n("view");
  var oI = _o(1, e, s, gg);
  _(oH, oI);
  _(oG, oH);
  _(oC, oG);
  _(r, oC);
  return r;
};
e_["./index/index.wxml"] = {
  f: m0,
  j: [],
  i: [],
  ti: [],
  ic: []
};