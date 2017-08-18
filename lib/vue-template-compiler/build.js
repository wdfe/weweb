'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deindent = _interopDefault(require('de-indent'));
var acorn = require('acorn');
var he = _interopDefault(require('he'));

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining








/**
 * Check if value is primitive
 */


/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}



/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */


/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */


/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */


/**
 * Hyphenate a camelCase string.
 */


/**
 * Simple bind, faster than native
 */


/**
 * Convert an Array-like object to a real Array.
 */


/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */


/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */




/**
 * Ensure a function is called only once.
 */

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr,import'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var splitRE = /\r?\n/g;
var replaceRE = /./g;
var isSpecialTag = makeMap('script,style,template', true);



/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent (
  content,
  options
 ) {
  if ( options === void 0 ) options = {};

  var sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  var depth = 0;
  var currentBlock = null;

  function start (
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce(function (cumulated, ref) {
          var name = ref.name;
          var value = ref.value;

          cumulated[name] = value || true;
          return cumulated
        }, Object.create(null))
      };
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else {
          sfc[tag] = currentBlock;
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs (block, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }

  function end (tag, start, end) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      var text = deindent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }

  function padContent (block, pad) {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      var offset = content.slice(0, block.start).split(splitRE).length;
      var padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n';
      return Array(offset).join(padChar)
    }
  }

  parseHTML(content, {
    start: start,
    end: end
  });

  return sfc
}

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */


/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools


/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

Dep.target = null;

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */


/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */


/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */

/*  */



/**
 * Get the default value of a prop.
 */

/*  */

/*  */

var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

/*  */

/*  */



var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    // return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

/*  */

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

var bracketInBracketTagRE = /\{\{((['"][^'"]+['"]|[^{}]+)+)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  // const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  var tagRE = delimiters ? buildRegex(delimiters) : bracketInBracketTagRE;
  if (!tagRE.test(text)) {
    return ("[3, " + (JSON.stringify(text)) + "]")
  }
  var tokens = [];
  var lastIndex = (tagRE.lastIndex = 0);
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(("[3, " + (JSON.stringify(text.slice(lastIndex, index))) + "]"));
    }
    // tag token
    var exp = parseExp(match[1].trim()) || '';
    tokens.push(exp);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(("[3, " + (JSON.stringify(text.slice(lastIndex))) + "]"));
  }

  if (tokens.length > 1) {
    return ("[a, " + (tokens.join(',')) + "]")
  } else {
    return tokens.join('')
  }
}

function walk (node, inMember) {
  var res = 'Unknown Type';
  if (node) {
    switch (node.type) {
      case 'LogicalExpression':
        if (node.operator && node.left) {
          res = "[[2, \"" + (node.operator) + "\"]," + (walk(node.left)) + "," + (walk(node.right)) + "]";
        }
        break
      case 'BinaryExpression':
        if (node.operator) {
          res = "[[2, \"" + (node.operator) + "\"], " + (walk(node.left)) + ", " + (walk(node.right)) + "]";
        }
        break
      case 'Identifier':
        if (node.name) {
          if (inMember) {
            res = "[3, \"" + (node.name) + "\"]";
          } else {
            res = "[[7],[3, \"" + (node.name) + "\"]]";
          }
        }
        break
      case 'UnaryExpression':
        if (node.operator) {
          res = "[[2, \"" + (node.operator) + "\"], " + (walk(node.argument)) + "]";
        }
        break
      case 'Literal':
        if (node.raw) { res = "[1, " + (node.raw) + "]"; }
        break
      case 'ArrayExpression':
        if (node.elements) {
          res = "[[4], " + (node.elements.reduce(function (p, c) { return ("[[5], " + p + " " + (p && ',') + " " + (walk(c)) + "]"); }, '')) + "]";
        }
        break
      case 'ConditionalExpression':
        res = "[[2,'?:']," + (walk(node.test)) + "," + (walk(node.consequent)) + "," + (walk(node.alternate)) + "]";
        break
      case 'MemberExpression':
        res = "[[6]," + (walk(node.object)) + "," + (walk(node.property, true)) + "]";
        break
      case 'ObjectExpression':
        if (node.properties) {
          res = "[[9], " + (node.properties.map(function (prop) { return walk(prop); }).join(',')) + "]";
        }
        break
      case 'Property':
        if (node.key) {
          res = "[[8], \"" + (node.key.name || 'no name error') + "\", " + (walk(node.value)) + "]";
        }
        break
      default:
        console.log((res + ": " + (node.type)));
    }
  }
  return res
}

function walkExp (ast, type) {
  if (type === 0) {
    return walk(ast.body[0].expression)
  } else if (type === 1) {
    return walk(ast.body[0].expression.right)
  }

  return JSON.stringify(ast)
}

function parseExp (text) {
  var ast;
  try {
    // normal exporession
    ast = acorn.parse(text);
    return walkExp(ast, 0)
  } catch (e) {
    try {
      // object expression
      ast = acorn.parse(("x={" + text + "}"));
      return walkExp(ast, 1)
    } catch (e) {
      throw new Error((text + " contains syntax errs"))
    }
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

var generateId = (function () {
  var id = 0;
  var ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';
  var len = ALPHABET.length;
  return function() {
    var res = 'o';
    id ++;
    var curr = id;
    while(curr)  {
      res += ALPHABET[parseInt(curr%len)];
      curr= parseInt(curr/len);
    }
    return res
  }
})();

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode


/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var modules = [
  klass,
  style
];

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (modelRs.exp) + ", " + (modelRs.idx) + ", " + assignment + ")")
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index)
}

function eof () {
  return index >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules,
  directives: directives,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules)
};

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;

// https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html
// ({{object name|array|expression}})|string
var tplBracket = /(?:{{\s*(.+)\s*}}|(.+))/;




var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;
var propStore;
/**
 * Convert HTML string to AST.
 */
function parse$1 (
  template,
  globStore,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;
  propStore = globStore;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;

  var root = {
    type: 1,
    tag: 'Program',
    attrsList: [],
    attrsMap: makeAttrsMap([]),
    parent: void 0,
    children: []
  };

  var currRoot = root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns =
        (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' &&
          warn$2(
            'Templates should only be responsible for mapping the state to the ' +
              'UI. Avoid placing tags with side-effects in your templates, such as ' +
              "<" + tag + ">" +
              ', as they will not be parsed.'
          );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processInclude(element);
        processImport(element);
        processComponent(element);
        debugger
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          // transforms[i](element, options)
        }
        processAttrs(element);
      }

      if (!root.children.length) {
        root.children.push(element);
        currRoot = element;
        // checkRootConstraints(element)
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (currRoot.if && (element.elseif || element.else)) {
          // checkRootConstraints(element)
          addIfCondition(currRoot, {
            exp: element.elseif,
            block: element
          });
        } else {
          root.children.push(element);
          currRoot = element;
        }
        // if (process.env.NODE_ENV !== 'production') {
        //   warnOnce(
        //     `Component template should contain exactly one root element. ` +
        //     `If you are using v-if on multiple elements, ` +
        //     `use v-else-if to chain them instead.`
        //   )
        // }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) {
          // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[
            name
          ] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(("text \"" + text + "\" outside root element will be ignored."));
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (
        isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        : // only preserve whitespace if its not right after a starting tag
          preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (
          !inVPre &&
          text !== ' ' &&
          (expression = parseText(text, delimiters))
        ) {
          pushProp(text);

          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (
          text !== ' ' ||
          !children.length ||
          children[children.length - 1].text !== ' '
        ) {
          // pushProp(text)
          // children.push({
          //   type: 3,
          //   text
          // })
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = (el.attrs = new Array(l));
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn$2(
        "<template> cannot be keyed. Place the key on real elements instead."
      );
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  if(el.tag === 'import') {
    getAndRemoveAttr(el, 'wx:for');
    return
  }
  var exp;
  if ((exp = getAndRemoveAttr(el, 'wx:for'))) {
    var inMatch = exp.match(tplBracket);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' &&
        warn$2(("Invalid wx:for expression: " + exp));
      return
    }

    el.for = exp;
    pushProp(exp);
    if ((exp = getAndRemoveAttr(el, 'wx:for-item'))) {
      el.alias = exp;
      pushProp(exp);
    } else {
      el.alias = 'item';
    }
    if ((exp = getAndRemoveAttr(el, 'wx:for-index'))) {
      el.iterator1 = exp;
      pushProp(exp);
    } else {
      el.iterator1 = 'index';
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'wx:if');
  if (exp) {
    var inMatch = exp.match(tplBracket);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' &&
        warn$2(("Invalid wx:if expression: " + exp));
      return
    }

    var ifExp = inMatch[1].trim();
    el.if = ifExp;
    pushProp(ifExp, inMatch[0]);

    addIfCondition(el, {
      exp: ifExp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'wx:else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'wx:elif');
    if (elseif) {
      var inMatch$1 = elseif.match(tplBracket);
      if (!inMatch$1) {
        process.env.NODE_ENV !== 'production' &&
          warn$2(("Invalid wx:if expression: " + elseif));
        return
      }
      var elifExp = inMatch$1[1].trim();
      el.elseif = elifExp;
      pushProp(elifExp, inMatch$1[0]);
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn$2(
      "v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " +
        "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
            "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
          "and can possibly expand into multiple elements. " +
          "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processInclude (el) {
  if (el.tag == 'include') {
    var src = getAndRemoveAttr(el, 'src');
    if (src) {
      el.include = src;
    } else {
      throw new Error('must have src attribute in include tag')
    }
  }
}

function processImport (el) {
  if (el.tag == 'import') {
    var src = getAndRemoveAttr(el, 'src');
    if (src) {
      el.import = src;
    } else {
      throw new Error('must have src attribute in include tag')
    }
  }
}

function processComponent (el) {
  var binding, data;
  if (el.tag === 'template'&&(binding = getAndRemoveAttr(el, 'is'))) {
    el.component = binding;
    pushProp(binding);
  }
  if (data = getAndRemoveAttr(el, 'data')) {
    el.data = data;
    pushProp(data);
  }
}

function processAttrs (el) {
  var list = el.attrsList.sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
  var i, l, name, rawName, value, modifiers, isProp;
  for ((i = 0), (l = list.length); i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) {
        // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (
          isProp ||
          (!el.component && platformMustUseProp(el.tag, el.attrsMap.type, name))
        ) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) {
        // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else {
        // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      // if (process.env.NODE_ENV !== 'production') {

      var expression = parseText(value, delimiters);
      pushProp(value);

      // if (expression) {
      //   warn(
      //     `${name}="${value}": ` +
      //       'Interpolation inside attributes has been removed. ' +
      //       'Use v-bind or the colon shorthand instead. For example, ' +
      //       'instead of <div id="{{ val }}">, use <div :id="val">.'
      //   )
      // }
      // }
      addAttr(el, name, value);
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) {
      ret[m.slice(1)] = true;
    });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] &&
      !isIE &&
      !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' &&
      (!el.attrsMap.type || el.attrsMap.type === 'text/javascript'))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
          "You are binding v-model directly to a v-for iteration alias. " +
          "This will not be able to modify the v-for source array because " +
          "writing to the alias is like modifying a function local variable. " +
          "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

function pushProp (exp, optExp) {
  if (propStore.map[exp] == null) {
    propStore.map[exp] = propStore.props.length;
    propStore.props.push(parseText(optExp || exp));
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function on (el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



var propStore$1;

function generate (
  ast,
  gstore,
  options
) {
  propStore$1 = gstore;
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_m("div")';
  return {
    render: code,
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  debugger
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genTemplate(el, state)
  } else if (el.tag === 'block') {
    return genChildren(el, state) || 'GenChild Error'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else if (el.tag === 'include') {
    return genInclude(el, state)
  } else if (el.tag === 'import') {
    return genImport(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);
      if (el.tag == 'Program') {
        el.nodeFuncName = 'r';
        var importFuncName = (el.importFuncName = generateId());
        var tmplInfo = getTmplInfo();
        var tmplIc = tmplInfo.ic;
        var tmplTi = tmplInfo.ti;
        var oldIcLen = tmplIc.length;
        var oldTiLen = tmplTi.length;
        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        var newIcLen = tmplIc.length;
        var newTiLen = tmplTi.length;

        var icTop = '';
        var icBottom = '';
        if (newIcLen > oldIcLen) {
          var icName = generateId();
          icTop = "var " + icName + " = e_[\"" + (tmplInfo.path) + "\"].j;";
          for (var icIdx = newIcLen - 1; icIdx >= oldIcLen; icIdx--) {
            icBottom += icName + ".pop();";
          }
        }

        if (newTiLen > oldTiLen) {
          icTop = "var " + importFuncName + " = e_[\"" + (tmplInfo.path) + "\"].i;" + icTop;
          for (var icIdx = newTiLen - 1; icIdx >= oldTiLen; icIdx--) {
            icBottom += importFuncName + ".pop();";
          }
        }
        code = "" + icTop + (children ? ("" + children) : '') + icBottom;
      } else {
        var children$1 = el.inlineTemplate ? null : genChildren(el, state, true);
        var dataLen = el.attrsList.length;
        if (dataLen == 0) {
          code = "var " + (el.nodeFuncName || 'nodeFuncName error') + " = _n(\"" + (el.tag) + "\");" + (children$1 ? ("" + children$1) : '');
        } else if (dataLen == 1) {
          var attr = el.attrsList[0];
          code = "var " + (el.nodeFuncName || 'nodeFuncName error2') + " = _n(\"" + (el.tag) + "\");\n          _r( " + (el.nodeFuncName || 'nodeFuncName error3') + ", '" + (attr.name) + "', " + (propStore$1.map[attr.value]) + ", e, s, gg)" + (children$1 ? ("" + children$1) : '');
        } else {
          code = "var " + (el.nodeFuncName || 'nodeFuncName error4') + " = _m( \"" + (el.tag) + "\", " + (data || 'data error') + ", e, s, gg);" + (children$1 ? ("" + children$1) : '');
        }
      }
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' &&
        state.warn("v-once can only be used inside v-for that is keyed. ");
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(
    el.ifConditions.slice(),
    state,
    altGen,
    altEmpty,
    el.nodeFuncName,
    el.env,
    el.scope
  )
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty,
  nodeFuncName,
  env,
  scope,
  vkey
) {
  if (!conditions.length) {
    return altEmpty || ' '
  }

  var condition = conditions.shift();
  var childnodeFuncName = generateId();
  condition.block.nodeFuncName = childnodeFuncName;
  condition.block.blockFuncName = isOneOf(condition.block.tag, [
    'include',
    'block'
  ])
    ? nodeFuncName
    : childnodeFuncName;
  env = env || 'e';
  scope = scope || 's';

  var pushChildTmpl = isOneOf(condition.block.tag, [
    'block',
    'include',
    'import'
  ])
    ? ''
    : ("_(" + (nodeFuncName || '') + ", " + childnodeFuncName + ");");

  var importFuncName = condition.block.importFuncName = generateId();
  var tmplInfo = getTmplInfo();
  var tmplIc = tmplInfo.ic;
  var tmplTi = tmplInfo.ti;
  var oldIcLen = tmplIc.length;
  var oldTiLen = tmplTi.length;
  var childTmpl = genTernaryExp(condition.block);
  var newIcLen = tmplIc.length;
  var newTiLen = tmplTi.length;

  if (newIcLen > oldIcLen) {
    var icName = generateId();
    childTmpl = "var " + icName + " = e_[\"" + (tmplInfo.path) + "\"].j;" + childTmpl + ";";
    for (var icIdx = newIcLen - 1; icIdx >= oldIcLen; icIdx--) {
      childTmpl += icName + ".pop();";
      tmplIc.pop();
    }
  }

  if (newTiLen > oldTiLen) {
    childTmpl = "var " + importFuncName + " = e_[\"" + (tmplInfo.path) + "\"].i;" + childTmpl + ";";
    for (var icIdx = newTiLen - 1; icIdx >= oldTiLen; icIdx--) {
      childTmpl += importFuncName + ".pop();";
      tmplTi.pop();
    }
  }

  if (condition.block.if) {
    return ("var " + (nodeFuncName || '') + " = _v();\n      if (_o(" + (propStore$1.map[condition.exp]) + ", " + env + ", " + scope + ", gg)) {\n        " + (nodeFuncName || '') + ".wxVkey = " + ((vkey = 1)) + ";" + childTmpl + pushChildTmpl + "\n      }" + (genIfConditions(conditions, state, altGen, altEmpty, nodeFuncName, env, scope, vkey + 1)))
  } else if (condition.block.elseif) {
    return ("else if (_o(" + (propStore$1.map[condition.exp]) + ", " + env + ", " + scope + ", gg)) {\n        " + (nodeFuncName || '') + ".wxVkey = " + (vkey || 2) + ";" + childTmpl + pushChildTmpl + "\n      }" + (genIfConditions(conditions, state, altGen, altEmpty, nodeFuncName, env, scope, vkey + 1)))
  } else {
    return ("else {\n        " + (nodeFuncName || '') + ".wxVkey = " + (vkey || 2) + ";" + childTmpl + pushChildTmpl + "\n      }")
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once ? genOnce(el, state) : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (
    process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " vx:for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }
  // console.log(666, el)
  el.forProcessed = true; // avoid recursion
  var parentnodeFuncName = el.nodeFuncName;
  var forFuncId = generateId();
  var childnodeFuncName = generateId();
  var returnNodeName = generateId();
  el.nodeFuncName = childnodeFuncName;
  el.blockFuncName = el.tag == 'block' || el.tag == 'include'
    ? returnNodeName
    : childnodeFuncName;

  var oldScope = el.scope || 's';
  var newScope = (el.scope = generateId());
  var oldEnv = el.env || 'e';
  var newEnv = (el.env = generateId());

  var importFuncName = (el.importFuncName = generateId());

  var tmplInfo = getTmplInfo();
  var tmplIc = tmplInfo.ic;
  var tmplTi = tmplInfo.ti;
  var oldIcLen = tmplIc.length;
  var oldTiLen = tmplTi.length;
  var children = "" + ((altGen || genElement)(el, state));
  var newIcLen = tmplIc.length;
  var newTiLen = tmplTi.length;

  var icTop = '';
  var icBottom = '';
  if (newIcLen > oldIcLen) {
    var icName = generateId();
    icTop = "var " + icName + " = e_[\"" + (tmplInfo.path) + "\"].j;";
    for (var icIdx = newIcLen - 1; icIdx >= oldIcLen; icIdx--) {
      icBottom += icName + ".pop();";
      tmplIc.pop();
    }
  }
  if (newTiLen > oldTiLen) {
    icTop = "var " + importFuncName + " = e_[\"" + (tmplInfo.path) + "\"].i;" + icTop;
    for (var tiIdx = newTiLen - 1; tiIdx >= oldTiLen; tiIdx--) {
      icBottom += importFuncName + ".pop();";
      tmplTi.pop();
    }
  }

  var cantainEle = isOneOf(el.tag, ['block', 'include'])
    ? ''
    : ("_(" + returnNodeName + ", " + childnodeFuncName + ");");

  var code = "var " + parentnodeFuncName + " = _v();\n  var " + forFuncId + " = function (" + newEnv + "," + newScope + "," + returnNodeName + ",gg) {\n    " + icTop + children + icBottom + cantainEle + "\n    return " + returnNodeName + ";\n  };\n  _2(" + (propStore$1.map[exp]) + ", " + forFuncId + ", " + oldEnv + ", " + oldScope + ", gg, " + parentnodeFuncName + ", \"" + (el.alias) + "\", \"" + (el.iterator1) + "\", '');";
  console.log(666, el);
  return code
}

function genData$2 (el, state) {
  var data = '';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    // data += `tag:"${el.tag}",`
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += (genProps(el.attrs)) + ",";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for ((i = 0), (l = dirs.length); i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genTemplate (el, state) {
  console.log(el);
  var container = el.nodeFuncName || 'name err';
  var isFunc = generateId();
  var tmplName = getTmplInfo().path;
  var dataFunc = generateId();
  var compFunc = generateId();
  var env = el.env || 'e';
  var scope = el.scope || 's';
  var isProp = propStore$1.map[el.component];
  var dataProp = propStore$1.map[el.data];
  return ("var " + container + " = _v();\n       var " + isFunc + " = _o(" + isProp + ", " + env + ", " + scope + ", gg);\n       var " + compFunc + " = _gd('" + tmplName + "', " + isFunc + ", e_, d_);\n       if (" + compFunc + ") {\n         var " + dataFunc + " = _1(" + dataProp + "," + env + "," + scope + ",gg);\n         " + compFunc + "(" + dataFunc + "," + dataFunc + "," + container + ", gg);\n       } else _w(" + isFunc + ", '" + tmplName + "', 0, 0);")
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if (
    process.env.NODE_ENV !== 'production' &&
    (el.children.length > 1 || ast.type !== 1)
  ) {
    state.warn(
      'Inline-template components must have exactly one child element.'
    );
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, propStore$1, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns
      .map(function (code) { return ("function(){" + code + "}"); })
      .join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots)
    .map(function (key) {
      return genScopedSlot(key, slots[key], state)
    })
    .join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  return (
    "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template' ? genChildren(el, state) || 'void 0' : genElement(el, state)) + "}}"
  )
}

function genForScopedSlot (key, el, state) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return (
    "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
    "return " + (genScopedSlot(key, el, state)) +
    '})'
  )
}

function genChildren (
  parent,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = parent.children;

  if (children.length) {
    var firstEl = children[0];
    // optimize single v-for
    if (
      children.length === 1 &&
      firstEl.for &&
      firstEl.tag !== 'template' &&
      firstEl.tag !== 'slot'
    ) {
      // return (altGenElement || genElement)(firstEl, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;

    var res = children
      .map(function (child) {
        var nodeFuncName = generateId();
        if (
          (child.tag === 'include' && !child.if && !child.for) ||
          (child.tag === 'import' && !child.if)
        ) {
          console.log(11);
          return ("" + (gen(child, state, nodeFuncName, parent.env, parent.scope, parent.nodeFuncName, parent.importFuncName)))
        } else if (parent.tag === 'block') {
          console.log(22);
          return ((gen(child, state, nodeFuncName, parent.env, parent.scope, parent.nodeFuncName, parent.importFuncName)) + ";_(" + (parent.blockFuncName || 'error') + "," + (nodeFuncName || 'error') + ");")
        } else {
          console.log(33);
          return ((gen(child, state, nodeFuncName, parent.env, parent.scope, parent.nodeFuncName, parent.importFuncName)) + ";_(" + (parent.nodeFuncName || 'error') + "," + nodeFuncName + ");")
        }
      })
      .join('');

    // return `[${children.map(c => gen(c, state)).join(',')}]${
    //   normalizationType ? `,${normalizationType}` : ''
    // }`
    return res
  }
}

function genNode (
  node,
  state,
  parentName,
  env,
  scope,
  blockFuncName,
  importFuncName
) {
  if (node.type === 1) {
    node.nodeFuncName = parentName;
    node.env = env;
    node.scope = scope;
    node.blockFuncName = blockFuncName;
    node.importFuncName = importFuncName;
    return genElement(node, state)
  }
  if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node, parentName, env, scope)
  }
}
// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (
      needsNormalization(el) ||
      (el.ifConditions &&
        el.ifConditions.some(function (c) { return needsNormalization(c.block); }))
    ) {
      res = 2;
      break
    }
    if (
      maybeComponent(el) ||
      (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))
    ) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genText (
  text,
  parentName,
  env,
  scope
) {
  var nodeFuncName = generateId();
  return ("var " + (parentName || 'error') + " = _o(" + (propStore$1.map[text.text || 'error']) + ", " + (env || 'e') + ", " + (scope || 's') + ", gg);")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs =
    el.attrs &&
    ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

function genInclude (el, state) {
  var tmplInfo = getTmplInfo();
  if (el.include) {
    tmplInfo.ic.push(el.include);
  }
  return ("\n  _ic(\"" + (el.include || 'src error') + "\",e_, \"" + (tmplInfo.path) + "\"," + (el.env || 'e') + "," + (el.scope || 's') + "," + (el.blockFuncName || 'r') + ",gg);")
}

function genImport (el, state) {
  var tmplInfo = getTmplInfo();
  if (el.import) {
    tmplInfo.ti.push(el.import);
  }
  console.log(el);
  return ("_ai(" + (el.importFuncName || 'import name err') + ", '" + (el.import || 'src error') + "', e_, '" + (tmplInfo.path) + "', 0, 0);")
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_m(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '[';
  var initIdx;
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    if (!initIdx) {
      initIdx = propStore$1.map[prop.value];
      res += "\"" + (prop.name) + "\", " + initIdx + ",";
    } else {
      res += "\"" + (prop.name) + "\", " + (propStore$1.map[prop.value] - initIdx) + ",";
    }
  }
  return res.slice(0, -1) + ']'
}

function getTmplInfo () {
  return propStore$1.tmplMap.slice(-1)[0]
}

function isOneOf (obj, targets) {
  return targets.indexOf(obj) != -1
}

function genTemplate$1(slot) {
  return (
    "/*v0.6vv_201702jjjunjie14_fbi*/\nwindow.__wcc_version__='v0.6vv_20170214_fbi'\nvar $gwxc\nvar $gaic={}\n$gwx=function(path,global){\nfunction _(a,b){b&&a.children.push(b);}\nfunction _v(k){if(typeof(k)!='undefined')return {tag:'virtual','wxKey':k,children:[]};return {tag:'virtual',children:[]};}\nfunction _n(tag){$gwxc++;if($gwxc>=16000){throw 'Dom limit exceeded, please check if there\\'s any mistake you\\'ve made.'};return {tag:tag.substr(0,3)=='wx-'?tag:'wx-'+tag,attr:{},children:[],n:[]}}\nfunction _p(a,b){b&&a.properities.push(b);}\nfunction _s(scope,env,key){return typeof(scope[key])!='undefined'?scope[key]:env[key]}" +
    "function _wl(tname,prefix){console.warn('WXMLRT:'+prefix+':-1:-1:-1: Template `' + tname + '` is being called recursively, will be stop.')}" +
    "$gwn=console.warn;\n$gwl=console.log;\nfunction $gwh()\n{\nfunction x()\n{\n}\nx.prototype =\n{\nhn: function( obj )\n{\nif( typeof(obj) == 'object' )\n{\nvar cnt=0;\nvar any=false;\nfor(var x in obj)\n{\nany|=x==='__value__';\ncnt++;\nif(cnt>2)break;\n}\nreturn cnt == 2 && any && obj.hasOwnProperty('__wxspec__') ? \"h\" : \"n\";\n}\nreturn \"n\";\n},\nnh: function( obj, special )\n{\nreturn { __value__: obj, __wxspec__: special ? special : true }\n},\nrv: function( obj )\n{\nreturn this.hn(obj)==='n'?obj:this.rv(obj.__value__);\n}\n}\nreturn new x;\n}\nwh=$gwh();\nfunction $gwrt( should_pass_type_info )\n{\nfunction ArithmeticEv( ops, e, s, g, o )\n{\nvar rop = ops[0][1];\nvar _a,_b,_c,_d, _aa, _bb;\nswitch( rop )\n{\ncase '?:':\n_a = rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && ( wh.hn(_a) === 'h' );\n_d = wh.rv( _a ) ? rev( ops[2], e, s, g, o ) : rev( ops[3], e, s, g, o );\n_d = _c && wh.hn( _d ) === 'n' ? wh.nh( _d, 'c' ) : _d;\nreturn _d;\nbreak;\ncase '&&':\n_a = rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && ( wh.hn(_a) === 'h' );\n_d = wh.rv( _a ) ? rev( ops[2], e, s, g, o ) : wh.rv( _a );\n_d = _c && wh.hn( _d ) === 'n' ? wh.nh( _d, 'c' ) : _d;\nreturn _d;\nbreak;\ncase '||':\n_a = rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && ( wh.hn(_a) === 'h' );\n_d = wh.rv( _a ) ? wh.rv(_a) : rev( ops[2], e, s, g, o );\n_d = _c && wh.hn( _d ) === 'n' ? wh.nh( _d, 'c' ) : _d;\nreturn _d;\nbreak;\ncase '+':\ncase '*':\ncase '/':\ncase '%':\ncase '|':\ncase '^':\ncase '&':\ncase '===':\ncase '==':\ncase '!=':\ncase '!==':\ncase '>=':\ncase '<=':\ncase '>':\ncase '<':\ncase '<<':\ncase '>>':\n_a = rev( ops[1], e, s, g, o );\n_b = rev( ops[2], e, s, g, o );\n_c = should_pass_type_info && (wh.hn( _a ) === 'h' || wh.hn( _b ) === 'h');\nswitch( rop )\n{\ncase '+':\n_d = wh.rv( _a ) + wh.rv( _b );\nbreak;\ncase '*':\n_d = wh.rv( _a ) * wh.rv( _b );\nbreak;\ncase '/':\n_d = wh.rv( _a ) / wh.rv( _b );\nbreak;\ncase '%':\n_d = wh.rv( _a ) % wh.rv( _b );\nbreak;\ncase '|':\n_d = wh.rv( _a ) | wh.rv( _b );\nbreak;\ncase '^':\n_d = wh.rv( _a ) ^ wh.rv( _b );\nbreak;\ncase '&':\n_d = wh.rv( _a ) & wh.rv( _b );\nbreak;\ncase '===':\n_d = wh.rv( _a ) === wh.rv( _b );\nbreak;\ncase '==':\n_d = wh.rv( _a ) == wh.rv( _b );\nbreak;\ncase '!=':\n_d = wh.rv( _a ) != wh.rv( _b );\nbreak;\ncase '!==':\n_d = wh.rv( _a ) !== wh.rv( _b );\nbreak;\ncase '>=':\n_d = wh.rv( _a ) >= wh.rv( _b );\nbreak;\ncase '<=':\n_d = wh.rv( _a ) <= wh.rv( _b );\nbreak;\ncase '>':\n_d = wh.rv( _a ) > wh.rv( _b );\nbreak;\ncase '<':\n_d = wh.rv( _a ) < wh.rv( _b );\nbreak;\ncase '<<':\n_d = wh.rv( _a ) << wh.rv( _b );\nbreak;\ncase '>>':\n_d = wh.rv( _a ) >> wh.rv( _b );\nbreak;\ndefault:\nbreak;\n}\nreturn _c ? wh.nh( _d, \"c\" ) : _d;\nbreak;\ncase '-':\n_a = ops.length === 3 ? rev( ops[1], e, s, g, o ) : 0;\n_b = ops.length === 3 ? rev( ops[2], e, s, g, o ) : rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && (wh.hn( _a ) === 'h' || wh.hn( _b ) === 'h');\n_d = _c ? wh.rv( _a ) - wh.rv( _b ) : _a - _b;\nreturn _c ? wh.nh( _d, \"c\" ) : _d;\nbreak;\ncase '!':\n_a = rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && (wh.hn( _a ) == 'h');\n_d = !wh.rv(_a);\nreturn _c ? wh.nh( _d, \"c\" ) : _d;\ncase '~':\n_a = rev( ops[1], e, s, g, o );\n_c = should_pass_type_info && (wh.hn( _a ) == 'h');\n_d = ~wh.rv(_a);\nreturn _c ? wh.nh( _d, \"c\" ) : _d;\ndefault:\n$gwn('unrecognized op' + rop );\n}\n}\nfunction rev( ops, e, s, g, o )\n{\nvar op = ops[0];\nif( typeof(op)==='object' )\n{\nvar vop=op[0];\nvar _a, _aa, _b, _bb, _c, _d, _s, _e, _ta, _tb, _td;\nswitch(vop)\n{\ncase 2:\nreturn ArithmeticEv(ops,e,s,g,o);\nbreak;\ncase 4:\nreturn rev( ops[1], e, s, g, o );\nbreak;\ncase 5:\nswitch( ops.length )\n{\ncase 2:\nreturn should_pass_type_info ?\n[rev(ops[1],e,s,g,o)] :\n[wh.rv(rev(ops[1],e,s,g,o))];\nbreak;\ncase 1:\nreturn [];\nbreak;\ndefault:\n_a = rev( ops[1],e,s,g,o );\n_a.push(\nshould_pass_type_info ?\nrev( ops[2],e,s,g,o ) :\nwh.rv( rev(ops[2],e,s,g,o) )\n);\nreturn _a;\nbreak;\n}\nbreak;\ncase 6:\n_a = rev(ops[1],e,s,g,o);\n_ta = wh.hn(_a)==='h';\n_aa = _ta ? wh.rv(_a) : _a;\no.is_affected |= _ta;\nif( should_pass_type_info )\n{\nif( _aa===null || typeof(_aa) === 'undefined' )\n{\nreturn _ta ? wh.nh(undefined, 'e') : undefined;\n}\n_b = rev(ops[2],e,s,g,o);\n_tb = wh.hn(_b) === 'h';\n_bb = _tb ? wh.rv(_b) : _b;\no.is_affected |= _tb;\nif( _bb===null || typeof(_bb) === 'undefined' )\n{\nreturn (_ta || _tb) ? wh.nh(undefined, 'e') : undefined;\n}\n_d = _aa[_bb];\n_td = wh.hn(_d)==='h';\no.is_affected |= _td;\nreturn (_ta || _tb) ? (_td ? _d : wh.nh(_d, 'e')) : _d;\n}\nelse\n{\nif( _aa===null || typeof(_aa) === 'undefined' )\n{\nreturn undefined;\n}\n_b = rev(ops[2],e,s,g,o);\n_tb = wh.hn(_b) === 'h';\n_bb = _tb ? wh.rv(_b) : _b;\no.is_affected |= _tb;\nif( _bb===null || typeof(_bb) === 'undefined' )\n{\nreturn undefined;\n}\n_d = _aa[_bb];\n_td = wh.hn(_d)==='h';\no.is_affected |= _td;\nreturn _td ? wh.rv(_d) : _d;\n}\ncase 7:\nswitch(ops[1][0])\n{\ncase 11:\no.is_affected |= wh.hn(g)==='h';\nreturn g;\ncase 3:\n_s = wh.rv( s );\n_e = wh.rv( e );\n_b = ops[1][1];\n_a = _s && _s.hasOwnProperty(_b) ?\ns : _e && ( _e.hasOwnProperty(_b) ? e : undefined );\nif( should_pass_type_info )\n{\nif( _a )\n{\n_ta = wh.hn(_a) === 'h';\n_aa = _ta ? wh.rv( _a ) : _a;\n_d = _aa[_b];\n_td = wh.hn(_d) === 'h';\no.is_affected |= _ta || _td;\n_d = _ta && !_td ? wh.nh(_d,'e') : _d;\nreturn _d;\n}\n}\nelse\n{\nif( _a )\n{\n_ta = wh.hn(_a) === 'h';\n_aa = _ta ? wh.rv( _a ) : _a;\n_d = _aa[_b];\n_td = wh.hn(_d) === 'h';\no.is_affected |= _ta || _td;\nreturn wh.rv(_d);\n}\n}\nreturn undefined;\n}\nbreak;\ncase 8:\n_a = {};\n_a[ops[1]] = rev(ops[2],e,s,g,o);\nreturn _a;\nbreak;\ncase 9:\n_a = rev(ops[1],e,s,g,o);\n_b = rev(ops[2],e,s,g,o);\nfunction merge( _a, _b, _ow )\n{\n_ta = wh.hn(_a)==='h';\n_tb = wh.hn(_b)==='h';\n_aa = wh.rv(_a);\n_bb = wh.rv(_b);\nif( should_pass_type_info )\n{\nif( _tb )\n{\nfor(var k in _bb)\n{\nif ( _ow || !_aa.hasOwnProperty(k) )\n_aa[k]=wh.nh(_bb[k],'e');\n}\n}\nelse\n{\nfor(var k in _bb)\n{\nif ( _ow || !_aa.hasOwnProperty(k) )\n_aa[k]=_bb[k];\n}\n}\n}\nelse\n{\nfor(var k in _bb)\n{\nif ( _ow || _aa.hasOwnProperty(k) )\n_aa[k]=wh.rv(_bb[k]);\n}\n}\nreturn _a;\n}\nvar _c = _a\nvar _ow = true\nif ( typeof(ops[1][0]) === \"object\" && ops[1][0][0] === 10 ) {\n_a = _b\n_b = _c\n_ow = false\n}\nif ( typeof(ops[1][0]) === \"object\" && ops[1][0][0] === 10 ) {\nvar _r = {}\nreturn merge( merge( _r, _a, _ow ), _b, _ow );\n}\nelse\nreturn merge( _a, _b, _ow );\nbreak;\ncase 10:\nreturn should_pass_type_info ? rev(ops[1],e,s,g,o) : wh.rv(rev(ops[1],e,s,g,o));\n}\n}\nelse\n{\nif( op === 3 || op === 1 ) return ops[1];\nelse if( op === 11 )\n{\nvar _a='';\nfor( var i = 1 ; i < ops.length ; i++ )\n{\nvar xp = wh.rv(rev(ops[i],e,s,g,o));\n_a += typeof(xp) === 'undefined' ? '' : xp;\n}\nreturn _a;\n}\n}\n}\nreturn rev;\n}\ngra=$gwrt(true);\ngrb=$gwrt(false);\nfunction TestTest( expr, ops, e,s,g, expect_a, expect_b, expect_affected )\n{\n{\nvar o = {is_affected:false};\nvar a = gra( ops, e,s,g, o );\nif( JSON.stringify(a) != JSON.stringify( expect_a )\n|| o.is_affected != expect_affected )\n{\nconsole.warn( \"A. \" + expr + \" get result \" + JSON.stringify(a) + \", \" + o.is_affected + \", but \" + JSON.stringify( expect_a ) + \", \" + expect_affected + \" is expected\" );\n}\n}\n{\nvar o = {is_affected:false};\nvar a = grb( ops, e,s,g, o );\nif( JSON.stringify(a) != JSON.stringify( expect_b )\n|| o.is_affected != expect_affected )\n{\nconsole.warn( \"B. \" + expr + \" get result \" + JSON.stringify(a) + \", \" + o.is_affected + \", but \" + JSON.stringify( expect_b ) + \", \" + expect_affected + \" is expected\" );\n}\n}\n}\n\nfunction wfor( to_iter, func, env, _s, global, father, itemname, indexname, keyname )\n{\nvar _n = wh.hn( to_iter ) === 'n';\nvar scope = wh.rv( _s );\nvar has_old_item = scope.hasOwnProperty(itemname);\nvar has_old_index = scope.hasOwnProperty(indexname);\nvar old_item = scope[itemname];\nvar old_index = scope[indexname];\nvar full = Object.prototype.toString.call(wh.rv(to_iter));\nvar type = full[8];\nif( type === 'N' && full[10] === 'l' ) type = 'X';\nvar _y;\nif( _n )\n{\nif( type === 'A' )\n{\nfor( var i = 0 ; i < to_iter.length ; i++ )\n{\nscope[itemname] = to_iter[i];\nscope[indexname] = wh.nh(i, 'h');\n_y = keyname ? (keyname===\"*this\" ? _v(wh.rv(to_iter[i])) : _v(wh.rv(wh.rv(to_iter[i])[keyname]))) : _v();\n_(father,_y);\nfunc( env, scope, _y, global );\n}\n}\nelse if( type === 'O' )\n{\nfor( var k in to_iter )\n{\nscope[itemname] = to_iter[k];\nscope[indexname] = wh.nh(k, 'h');\n_y = keyname ? (keyname===\"*this\" ? _v(wh.rv(to_iter[k])) : _v(wh.rv(wh.rv(to_iter[k])[keyname]))) : _v();\n_(father,_y);\nfunc( env,scope,_y,global );\n}\n}\nelse if( type === 'S' )\n{\nfor( var i = 0 ; i < to_iter.length ; i++ )\n{\nscope[itemname] = to_iter[i];\nscope[indexname] = wh.nh(i, 'h');\n_y = _v( to_iter[i] + i );\n_(father,_y);\nfunc( env, scope, _y, global );\n}\n}\nelse if( type === 'N' )\n{\nfor( var i = 0 ; i < to_iter ; i++ )\n{\nscope[itemname] = i;\nscope[indexname] = wh.nh(i, 'h');\n_y = _v( i );\n_(father,_y);\nfunc(env,scope,_y,global);\n}\n}\nelse\n{\n}\n}\nelse\n{\nvar r_to_iter = wh.rv(to_iter);\nvar r_iter_item, iter_item;\nif( type === 'A' )\n{\nfor( var i = 0 ; i < r_to_iter.length ; i++ )\n{\niter_item = r_to_iter[i];\niter_item = wh.hn(iter_item)==='n' ? wh.nh(iter_item,'h') : iter_item;\nr_iter_item = wh.rv( iter_item );\nscope[itemname] = iter_item\nscope[indexname] = wh.nh(i, 'h');\n_y = keyname ? (keyname===\"*this\" ? _v(r_iter_item) : _v(wh.rv(r_iter_item[keyname]))) : _v();\n_(father,_y);\nfunc( env, scope, _y, global );\n}\n}\nelse if( type === 'O' )\n{\nfor( var k in r_to_iter )\n{\niter_item = r_to_iter[k];\niter_item = wh.hn(iter_item)==='n'? wh.nh(iter_item,'h') : iter_item;\nr_iter_item = wh.rv( iter_item );\nscope[itemname] = iter_item;\nscope[indexname] = wh.nh(k, 'h');\n_y = keyname ? (keyname===\"*this\" ? _v(r_iter_item) : _v(wh.rv(r_iter_item[keyname]))) : _v();\n_(father,_y);\nfunc( env, scope, _y, global );\n}\n}\nelse if( type === 'S' )\n{\nfor( var i = 0 ; i < r_to_iter.length ; i++ )\n{\nscope[itemname] = wh.nh(r_to_iter[i],'h');\nscope[indexname] = wh.nh(i, 'h');\n_y = _v( to_iter[i] + i );\n_(father,_y);\nfunc( env, scope, _y, global );\n}\n}\nelse if( type === 'N' )\n{\nfor( var i = 0 ; i < r_to_iter ; i++ )\n{\nscope[itemname] = wh.nh(i,'h');\nscope[indexname]= wh.nh(i,'h');\n_y = _v( i );\n_(father,_y);\nfunc(env,scope,_y,global);\n}\n}\nelse\n{\n}\n}\nif(has_old_item)\n{\nscope[itemname]=old_item;\n}\nelse\n{\ndelete scope[itemname];\n}\nif(has_old_index)\n{\nscope[indexname]=old_index;\n}\nelse\n{\ndelete scope[indexname];\n}\n}\n\n\nfunction _r( node, attrname, opindex, env, scope, global )\n{\nvar o = {};\nvar a = grb( z[opindex], env, scope, global, o );\nnode.attr[attrname] = a;\nif( o.is_affected ) node.n.push( attrname );\n}\nfunction _o( opindex, env, scope, global )\n{\nvar nothing = {};\nreturn grb( z[opindex], env, scope, global, nothing );\n}\nfunction _1( opindex, env, scope, global )\n{\nvar nothing = {};\nreturn gra( z[opindex], env, scope, global, nothing );\n}\nfunction _2( opindex, func, env, scope, global, father, itemname, indexname, keyname )\n{\nvar to_iter = _1( opindex, env, scope, global, father, itemname, indexname, keyname );\nwfor( to_iter, func, env, scope, global, father, itemname, indexname, keyname );\n}\nfunction _gv( )\n{\nif( typeof(window.__webview_engine_version__) == 'undefined' ) return 0.0;\nreturn window.__webview_engine_version__;\n}\n\n\nfunction _m(tag,attrs,env,scope,global)\n{\nvar tmp=_n(tag);\nvar base=0;\nfor(var i = 0 ; i < attrs.length ; i+=2 )\n{\nif(attrs[i+1]<0)\n{\ntmp.attr[attrs[i]]=true;\n}\nelse\n{\n_r(tmp,attrs[i],base+attrs[i+1],env,scope,global);\nif(base===0)base=attrs[i+1];\n}\n}\nreturn tmp;\n}\n\n" +

    "function _ai(i,p,e,me,r,c){var x=_grp(p,e,me);if(x)i.push(x);else{i.push('');console.warn('WXMLRT:'+me+':import:'+r+':'+c+': Path `'+p+'` not found from `'+me+'`.')}}" +
    "function _grp(p,e,me){if(p[0]!='/'){var mepart=me.split('/');mepart.pop();var ppart=p.split('/');for(var i=0;i<ppart.length;i++){if( ppart[i]=='..')mepart.pop();else if(!ppart[i])continue;else mepart.push(ppart[i]);}p=mepart.join('/');}if(me[0]=='.'&&p[0]=='/')p='.'+p;if(e[p])return p;if(e[p+'.wxml'])return p+'.wxml';}\nfunction _gd(p,c,e,d){if(!c)return;if(d[p][c])return d[p][c];for(var x=e[p].i.length-1;x>=0;x--){if(e[p].i[x]&&d[e[p].i[x]][c])return d[e[p].i[x]][c]};for(var x=e[p].ti.length-1;x>=0;x--){var q=_grp(e[p].ti[x],e,p);if(q&&d[q][c])return d[q][c]}\nvar ii=_gapi(e,p);for(var x=0;x<ii.length;x++){if(ii[x]&&d[ii[x]][c])return d[ii[x]][c]}for(var k=e[p].j.length-1;k>=0;k--)if(e[p].j[k]){for(var q=e[e[p].j[k]].ti.length-1;q>=0;q--){var pp=_grp(e[e[p].j[k]].ti[q],e,p);if(pp&&d[pp][c]){return d[pp][c]}}}}\nfunction _gapi(e,p){if(!p)return [];if($gaic[p]){return $gaic[p]};var ret=[],q=[],h=0,t=0,put={},visited={};q.push(p);visited[p]=true;t++;while(h<t){var a=q[h++];for(var i=0;i<e[a].ic.length;i++){var nd=e[a].ic[i];var np=_grp(nd,e,a);if(np&&!visited[np]){visited[np]=true;q.push(np);t++;}}for(var i=0;a!=p&&i<e[a].ti.length;i++){var ni=e[a].ti[i];var nm=_grp(ni,e,a);if(nm&&!put[nm]){put[nm]=true;ret.push(nm);}}}$gaic[p]=ret;return ret;}" +
    "var $ixc={};function _ic(p,ent,me,e,s,r,gg){var x=_grp(p,ent,me);ent[me].j.push(x);if(x){if($ixc[x]){console.warn('WXMLRT:-1:include:-1:-1: `'+p+'` is being included in a loop, will be stop.');return;}$ixc[x]=true;try{ent[x].f(e,s,r,gg)}catch(e){}$ixc[x]=false;}else{console.warn('WXMLRT:'+me+':include:-1:-1: Included path `'+p+'` not found from `'+me+'`.')}}" +
    "function _w(tn,f,line,c){console.warn('WXMLRT:'+f+':template:'+line+':'+c+': Template `'+tn+'` not found.');}function _ev(dom){var changed=false;delete dom.properities;delete dom.n;if(dom.children){do{changed=false;var newch = [];for(var i=0;i<dom.children.length;i++){var ch=dom.children[i];if( ch.tag=='virtual'){changed=true;for(var j=0;ch.children&&j<ch.children.length;j++){newch.push(ch.children[j]);}}else { newch.push(ch); } } dom.children = newch; }while(changed);for(var i=0;i<dom.children.length;i++){_ev(dom.children[i]);}} return dom; }var e_={}\n" +
    "if(global&&typeof(global.entrys)=='object')e_=global.entrys\nvar d_={}\nif(global&&typeof(global.defines)=='object')d_=global.defines\nvar p_={}\n" + slot + "\nif(path&&e_[path]){\nwindow.__wxml_comp_version__=0.02\nreturn function(env,dd,global){$gwxc=0;var root={\"tag\":\"wx-page\"};root.children=[]\nvar main=e_[path].f\nif(typeof(window.__webview_engine_version__)!='undefined'&&window.__webview_engine_version__+1e-6>=0.02+1e-6&&window.__mergeData__)\n{\nenv=window.__mergeData__(env,dd);\n}\ntry{\nmain(env,{},root,global);\nif(typeof(window.__webview_engine_version__)=='undefined'||window.__webview_engine_version__+1e-6<0.01+1e-6){return _ev(root);}\n}catch(err){\nconsole.log(err)\n}\nreturn root;\n}\n}\n}"
  )
}

/*  */

var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

var createCompiler = createCompilerCreator(function baseCompile (
  templates,
  options
) {
  var initStore = {
    map: Object.create(null),
    tmplMap: [],
    props: []
  };

  var program = templates.reduce(
    function (p, c) {
      p.store.tmplMap.push({
        path: c.path,
        ti: [],
        ic: []
      });
      var ast = parse$1(c.template, p.store, options);
      return {
        asts: p.asts.concat({
          ast: ast,
          path: c.path
        }),
        store: p.store
      }
    },
    {
      store: initStore,
      asts: []
    }
  );

  var propsCode = "var z = [];\n  (function(z){\n    var a = 11;\n    function Z(ops){z.push(ops)};\n    " + (program.store.props.map(function (prop) { return ("Z(" + prop + ");"); }).join('')) + "\n  })(z);";

  program.asts.map(function (ast) { return optimize(ast.ast, options); });

  var code = program.asts
    .map(
      function (ast, idx) { return ("d_[\"" + (ast.path) + "\"] = {};\n      var m" + idx + "=function(e,s,r,gg){\n        " + (generate(ast.ast, program.store, options).render) + "\n        return r;\n      };\n      e_[\"" + (ast.path) + "\"]={f:m" + idx + ",j:[],i:[],ti:[" + (program.store.tmplMap[idx].ti
          .map(function (ti) { return ("\"" + ti + "\""); })
          .join(
            ','
          )) + "],ic:[" + (program.store.tmplMap[idx].ic
          .map(function (ic) { return ("\"" + ic + "\""); })
          .join(',')) + "]};"); }
    )
    .join('');

  return {
    program: program,
    render: genTemplate$1(propsCode + code)
    // staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref = createCompiler(baseOptions);
var compile = ref.compile;
var compileToFunctions = ref.compileToFunctions;

/*  */

var fs = require('fs');
var resolve = require('path').resolve;

function wxmlCompile (fileList) {
  var srcFiles = fileList.reverse();
  var files = srcFiles.map(function (path) { return ({
    path: path,
    template: fs.readFileSync(path, 'utf-8')
  }); });
  return compile(files)
}

// export { ssrCompile, ssrCompileToFunctions } from './server/compiler'

exports.wxmlCompile = wxmlCompile;
exports.parseComponent = parseComponent;
exports.compile = compile;
exports.compileToFunctions = compileToFunctions;
