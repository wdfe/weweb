let textParser = (function () {
  var parserCreator = (function () {
    var creator = function () {}
    creator.prototype = Object.create(Object.prototype, {
      constructor: { value: creator, writable: !0, configurable: !0 }
    })
    var getErrorLocation = function (start, curr) {
      var n = curr - 30 + 1
      n < 0 && (n = 0)
      return (
        'L' +
        ((start.slice(0, curr).match(/(\r|\n|\r\n)/g) || []).length + 1) +
        ': ' +
        start.slice(n, curr + 1)
      )
    }
    creator.create = function (stateDicts, cbs) {
      var self = Object.create(creator.prototype)
      self._cbs = cbs
      let stateTable = (self._stateTable = {})
      let stateRecTable = (self._stateRecTable = {})
      let a = {}
      let s = {}
      let extendDict = function (state, currDict, currSymbol, stateRec, cache) {
        if (Object.prototype.hasOwnProperty.call(stateDicts, currSymbol)) {
          if (cache[currSymbol]) {
            if (!cache[currSymbol].overwrite) {
              throw new Error(
                'State "' +
                  state +
                  '" has multiple possible rules on symbol "' +
                  currSymbol +
                  '".'
              )
            }
          } else cache[currSymbol] = currDict
        } else if (
          currSymbol !== 'ALL' &&
          currSymbol !== 'NULL' &&
          currSymbol.length > 1
        ) {
          if (stateRec[currSymbol]) {
            if (!stateRec[currSymbol].overwrite) {
              throw new Error(
                'State "' +
                  state +
                  '" has multiple possible rules on symbol "' +
                  currSymbol +
                  '".'
              )
            }
          } else {
            for (var chIdx = 0; chIdx < currSymbol.length; chIdx++) {
              if (currSymbol[chIdx + 1] === '-' && currSymbol[chIdx + 2]) {
                for (
                  var endCharCode = currSymbol.charCodeAt(chIdx + 2),
                    startCharCode = currSymbol.charCodeAt(chIdx);
                  startCharCode <= endCharCode;
                  startCharCode++
                ) {
                  stateRec[String.fromCharCode(startCharCode)] = currDict
                }
                chIdx += 2
              } else {
                stateRec[currSymbol[chIdx]] = currDict
              }
            }
          }
        } else if (stateRec[currSymbol]) {
          if (!stateRec[currSymbol].overwrite) {
            throw new Error(
              'State "' +
                state +
                '" has multiple possible rules on symbol "' +
                currSymbol +
                '".'
            )
          }
        } else {
          stateRec[currSymbol] = currDict
        }
      }
      let currState = ''
      for (currState in stateDicts) {
        var currStateDict = stateDicts[currState]
        let state = (stateTable[currState] = {})
        let stateRec = (stateRecTable[currState] = {})
        let p = (a[currState] = {})
        let f = (s[currState] = {})

        for (
          let stateDictIdx = 0;
          stateDictIdx < currStateDict.length;
          stateDictIdx++
        ) {
          var currDict = currStateDict[stateDictIdx]
          let posibleSymbol = currDict.states[0]
          if (posibleSymbol === currState) {
            posibleSymbol = currDict.states[1]
            console.log(currDict.states)
            extendDict(currState, currDict, posibleSymbol, stateRec, f)
          } else {
            extendDict(currState, currDict, posibleSymbol, state, p)
          }
        }
      }
      let v = null
      let w = function e (state, n, i) {
        if (v[state] !== 2) {
          if (v[state] === 1) {
            throw new Error(
              'State "' + state + '" has illegal recursive rule definition.'
            )
          }
          v[state] = 1
          var r = n[state]
          var a = i[state]
          for (var s in r) {
            e(s, n, i)
            var l = stateTable[s]
            for (var currSymbol in l) {
              if (a[currSymbol]) {
                if (!a[currSymbol].overwrite) {
                  throw new Error(
                    'State "' +
                      state +
                      '" has multiple possible rules on symbol "' +
                      currSymbol +
                      '".'
                  )
                }
              } else a[currSymbol] = r[s]
            }
          }
          v[state] = 2
        }
      }
      v = {}
      for (currState in a) {
        w(currState, a, stateTable)
      }
      v = {}
      for (currState in s) {
        w(currState, s, stateRecTable)
      }
      return self
    }
    creator.prototype.parse = function (stateName, str, pos) {
      let posInfo = { str: str, pos: 0 }
      let tokens = genTokens(
        this._stateTable,
        this._stateRecTable,
        stateName,
        posInfo,
        this._cbs,
        pos
      )
      if (posInfo.str.length > posInfo.pos) {
        throw new Error(
          'Unexpected character "' +
            posInfo.str[posInfo.pos] +
            '" in position ' +
            getErrorLocation(posInfo.str, posInfo.pos) +
            posInfo.pos +
            ', near '
        )
      }
      return tokens
    }
    var genTokens = function genTokens (
      stateTable,
      stateRecTable,
      stateName,
      posInfo,
      cbs,
      pos
    ) {
      let currState = stateTable[stateName]
      let currIdStateDict = null
      posInfo.str.length > posInfo.pos &&
        (currIdStateDict = currState[posInfo.str[posInfo.pos]])
      if (
        !currIdStateDict &&
        (posInfo.str.length > posInfo.pos && (currIdStateDict = currState.ALL),
          !currIdStateDict)
      ) {
        if (!(currIdStateDict = currState.NULL)) {
          throw new Error(
            'Unexpected character "' +
              posInfo.str[posInfo.pos] +
              '" in position ' +
              posInfo.pos +
              ' (in state "' +
              stateName +
              '"), near ' +
              getErrorLocation(posInfo.str, posInfo.pos)
          )
        }
        if (currIdStateDict.states[0] === 'NULL') {
          return cbs[currIdStateDict.id]
            ? cbs[currIdStateDict.id]([], pos)
            : { r: currIdStateDict.id, c: [] }
        }
      }
      var d = function (idStateDict, willPush, d) {
        var states = idStateDict.states
        var retTokens = []
        willPush && retTokens.push(d)
        for (
          var statePushIdx = willPush ? 1 : 0;
          statePushIdx < states.length;
          statePushIdx++
        ) {
          var expectedCh = states[statePushIdx]
          if (Object.prototype.hasOwnProperty.call(stateTable, expectedCh)) {
            retTokens.push(
              genTokens(
                stateTable,
                stateRecTable,
                expectedCh,
                posInfo,
                cbs,
                pos
              )
            )
          } else if (expectedCh === 'ALL') {
            retTokens.push(posInfo.str[posInfo.pos])
            posInfo.pos++
          } else {
            // check if the char is ecpected
            for (
              var ch = posInfo.str[posInfo.pos],
                chCode = posInfo.str.charCodeAt(posInfo.pos),
                expectedChIdx = 0;
              expectedChIdx < expectedCh.length;
              expectedChIdx++
            ) {
              if (
                expectedCh[expectedChIdx + 1] === '-' &&
                expectedCh[expectedChIdx + 2]
              ) {
                var currExpectedChCode = expectedCh.charCodeAt(expectedChIdx)
                var nextExpectedChCode = expectedCh.charCodeAt(
                  expectedChIdx + 2
                )
                if (
                  currExpectedChCode <= chCode &&
                  chCode <= nextExpectedChCode
                ) {
                  break
                }
                expectedChIdx += 2
              } else if (ch === expectedCh[expectedChIdx]) break
            }
            if (expectedChIdx === expectedCh.length) {
              throw new Error(
                'Unexpected character "' +
                  ch +
                  '" in position ' +
                  posInfo.pos +
                  ' (expect "' +
                  expectedCh +
                  '" in state "' +
                  stateName +
                  '"), near ' +
                  getErrorLocation(posInfo.str, posInfo.pos)
              )
            }
            retTokens.push(ch)
            posInfo.pos++
          }
        }
        return cbs[idStateDict.id]
          ? cbs[idStateDict.id](retTokens, pos)
          : { r: idStateDict.id, c: retTokens }
      }
      let tokens = d(currIdStateDict)

      for (
        ;
        posInfo.str.length > posInfo.pos &&
        ((currIdStateDict =
          stateRecTable[stateName][posInfo.str[posInfo.pos]]) ||
          (currIdStateDict = stateRecTable[stateName].ALL));

      ) {
        tokens = d(currIdStateDict, !0, tokens)
      }
      return tokens
    }
    return creator
  })()
  const tagType = { TAG_START: 1, TAG_END: -1, TEXT: 3, COMMENT: 8 }
  const entities = {
    amp: '&',
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
    apos: "'"
  }
  const decodeEntities = function (text) {
    return text.replace(/&([a-zA-Z]*?);/g, function (entity, entityCode) {
      if (entities.hasOwnProperty(entityCode) && entities[entityCode]) {
        return entities[entityCode]
      }
      if (/^#[0-9]{1,4}$/.test(entityCode)) {
        return String.fromCharCode(entityCode.slice(1))
      }
      if (/^#x[0-9a-f]{1,4}$/i.test(entityCode)) {
        return String.fromCharCode('0' + entityCode.slice(1))
      }
      throw new Error('HTML Entity "' + entity + '" is not supported.')
    })
  }
  const isSelfCloseTag = function (tagName) {
    switch (tagName) {
      case 'area':
      case 'base':
      case 'basefont':
      case 'br':
      case 'col':
      case 'frame':
      case 'hr':
      case 'img':
      case 'input':
      case 'keygen':
      case 'link':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
        return !0
      default:
        return !1
    }
  }
  let parser = null
  const init = function () {
    const stateDict = {
      TEXT: [
        { id: 'tag', states: ['TEXT', 'TAG'] },
        { id: 'text', states: ['TEXT', 'ALL'] },
        { id: 'tag1', states: ['TAG'] },
        { id: 'text1', states: ['ALL'] },
        { id: '_null', states: ['NULL'], overwrite: !0 }
      ],
      TAG: [{ id: '_blank', states: ['<', 'TAG_START'] }],
      TAG_END: [
        { id: '_concat', states: ['/', '>'] },
        { id: '_jump', states: ['>'] }
      ],
      TAG_START: [
        { id: 'comment', states: ['!', '-', '-', 'COMMENT_CONTENT'] },
        { id: 'endTag', states: ['/', 'TAG_NAME', '>'] },
        { id: 'startTag', states: ['TAG_NAME', 'ATTRS', 'TAG_END'] }
      ],
      TAG_NAME: [
        { id: '_concat', states: ['TAG_NAME', '-_a-zA-Z0-9.:'] },
        { id: '_jump', states: ['a-zA-Z'] }
      ],
      ATTRS: [
        { id: '_blank', states: [' \n\r\t\f', 'ATTRS'] },
        { id: '_jump', states: ['ATTRS', ' \n\r\t\f'] },
        { id: 'attrs', states: ['ATTR', 'ATTRS'] },
        { id: '_null', states: ['NULL'], overwrite: !0 }
      ],
      ATTR: [{ id: 'attr', states: ['ATTR_NAME', 'ATTR_NAME_AFTER'] }],
      ATTR_NAME: [
        { id: '_concat', states: ['ATTR_NAME', '-_a-zA-Z0-9.:$&'] },
        { id: '_jump', states: ['-_a-zA-Z0-9.:$&'] }
      ],
      ATTR_NAME_AFTER: [
        { id: '_blank', states: ['=', 'ATTR_VALUE'] },
        { id: '_empty', states: ['NULL'] }
      ],
      ATTR_VALUE: [
        { id: '_blank', states: ['"', 'ATTR_VALUE_INNER_1'] },
        { id: '_blank', states: ["'", 'ATTR_VALUE_INNER_2'] }
      ],
      ATTR_VALUE_INNER_1: [
        { id: '_empty', states: ['"'] },
        { id: '_concat', states: ['ALL', 'ATTR_VALUE_INNER_1'] }
      ],
      ATTR_VALUE_INNER_2: [
        { id: '_empty', states: ["'"] },
        { id: '_concat', states: ['ALL', 'ATTR_VALUE_INNER_2'] }
      ],
      COMMENT_CONTENT: [
        { id: '_concat', states: ['ALL', 'COMMENT_CONTENT'] },
        { id: '_concat', states: ['-', 'COMMENT_CONTENT_DASH_1'] }
      ],
      COMMENT_CONTENT_DASH_1: [
        { id: '_concat', states: ['ALL', 'COMMENT_CONTENT'] },
        { id: '_concat', states: ['-', 'COMMENT_CONTENT_DASH_2'] }
      ],
      COMMENT_CONTENT_DASH_2: [
        { id: '_concat', states: ['ALL', 'COMMENT_CONTENT'] },
        { id: '_concat', states: ['-', 'COMMENT_CONTENT_DASH_2'] },
        { id: '_jump', states: ['>'] }
      ]
    }
    const visitors = {
      _null: function () {},
      _empty: function () {
        return ''
      },
      _jump: function (e) {
        return e[0]
      },
      _concat: function (e) {
        return e[0] + e[1]
      },
      _blank: function (e) {
        return e[1]
      },
      attr: function (e) {
        return { n: e[0], v: e[1] }
      },
      attrs: function (e) {
        var t = e[1] || {}
        t[e[0].n] = e[0].v
        return t
      },
      startTag: function (e) {
        var n = e[0].toLowerCase()
        return {
          t: tagType.TAG_START,
          n: n,
          a: e[1] || {},
          selfClose: e[2] === '/>' || isSelfCloseTag(n)
        }
      },
      endTag: function (e) {
        return { t: tagType.TAG_END, n: e[1].toLowerCase() }
      },
      comment: function (e) {
        return { t: tagType.COMMENT, c: e[3].slice(0, -3) }
      },
      tag1: function (e) {
        return [e[0]]
      },
      text1: function (e) {
        return [{ t: tagType.TEXT, c: e[0] }]
      },
      tag: function (e) {
        e[0].push(e[1])
        return e[0]
      },
      text: function (e) {
        var n = e[0]
        n[n.length - 1].t === tagType.TEXT
          ? (n[n.length - 1].c += e[1])
          : n.push({ t: tagType.TEXT, c: e[1] })
        return n
      }
    }
    parser = parserCreator.create(stateDict, visitors)
  }

  /**
   * 将输入的 tokens 转换为 Dom 树
   * token的内容：c = text, t = type, n = name, a = attribute
   * @param {any} tokens
   * @returns
   */
  const transformer = function (tokens) {
    let rootNode = { children: [] }
    let currRoot = rootNode
    let nodeStack = []
    let node = null
    for (let idx = 0; idx < tokens.length; idx++) {
      var token = tokens[idx]
      node = { name: token.n, attrs: token.a, children: [] }
      currRoot.children.push(node)
      if (token.t === tagType.TAG_START) {
        if (!token.selfClose) {
          nodeStack.push(currRoot)
          currRoot = node
        }
      } else if (token.t === tagType.TAG_END) {
        for (; token.n !== currRoot.name;) {
          if (!(currRoot = nodeStack.pop())) {
            throw new Error(
              'No matching start tag found for "</' + token.n + '>"'
            )
          }
        }
        currRoot = nodeStack.pop()
      } else {
        token.t === tagType.TEXT &&
          token.c &&
          currRoot.children.push({ type: 'text', text: token.c })
      }
    }
    return rootNode
  }
  return {
    parse: function (txt) {
      parser || init()
      var tokens = parser.parse('TEXT', txt) || []
      return transformer(tokens).children
    },
    decodeEntities: decodeEntities
  }
})()

console.log(
  JSON.stringify(
    textParser.parse(
      `
<h1>My First Heading</h1>

<p>My first paragraph.</p>
`
    ),
    2
  )
)
