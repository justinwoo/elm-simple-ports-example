/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	var Rx = __webpack_require__(/*! rx */ 1);
	
	// bring in our Elm application through webpack!
	var Elm = __webpack_require__(/*! ../elm/App.elm */ 4);
	
	// basically an event bus, but is an Observable we can subscribe to and whatnot
	var filesData$ = new Rx.Subject();
	
	// default files listing
	var files = [
	  'file1',
	  'file2',
	  'file3',
	  'file4',
	  'file5'
	];
	
	function loadFilesData() {
	  console.log('pretending to fetch data...');
	  // every time we "fetch" data, let's say it updated.
	  files.push('file' + files.length);
	  // fire off the files data stream with the new files
	  filesData$.onNext(files);
	}
	
	function init() {
	  var appContainer = document.getElementById('app');
	  console.log('embedding our Elm application!');
	  /**
	   * embed our elm app in our container.
	   * you might remember that this is what i was talking about in our Elm code,
	   * where you need to provide an initial value for these Signals.
	   * this is the one we control from the JS side, so we need to provide it from
	   * this side to make it work correctly.
	   *
	   * we also get the App instance returned when we call this, so
	   * we need to use to access our ports.
	   */
	  var elmApp = Elm.embed(Elm.App, appContainer, {
	    newFiles: [] // need to provide initial values to our listening port!
	  });
	
	  filesData$.subscribe(function (files) {
	    console.log('new data came down in our stream!');
	    console.log('sending data down our newFiles port...');
	    // so let's send the new files down the port
	    // in elm we had `port newFiles`, so this way we access this
	    // from JS is to do the following:
	    elmApp.ports.newFiles.send(files);
	  });
	
	  // just like above, we access the output port from JS similarly,
	  // but we will subscribe to the output from this.
	  // all we really care about is the event instead of the value,
	  // so we'll just kick of loadFilesData as a result.
	  elmApp.ports.updateRequests.subscribe(function (value) {
	    console.log('update request came from our updateRequests port!');
	    loadFilesData();
	  });
	
	  loadFilesData();
	}
	
	init();


/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./~/rx/dist/rx.all.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.
	
	;(function (undefined) {
	
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  var
	    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
	    freeSelf = objectTypes[typeof self] && self.Object && self,
	    freeWindow = objectTypes[typeof window] && window && window.Object && window,
	    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
	    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
	    freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
	
	  var root = root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;
	
	  var Rx = {
	    internals: {},
	    config: {
	      Promise: root.Promise
	    },
	    helpers: { }
	  };
	
	  // Defaults
	  var noop = Rx.helpers.noop = function () { },
	    identity = Rx.helpers.identity = function (x) { return x; },
	    defaultNow = Rx.helpers.defaultNow = Date.now,
	    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
	    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
	    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
	    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
	    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
	    isFunction = Rx.helpers.isFunction = (function () {
	
	      var isFn = function (value) {
	        return typeof value == 'function' || false;
	      }
	
	      // fallback for older versions of Chrome and Safari
	      if (isFn(/x/)) {
	        isFn = function(value) {
	          return typeof value == 'function' && toString.call(value) == '[object Function]';
	        };
	      }
	
	      return isFn;
	    }());
	
	  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}
	
	  var errorObj = {e: {}};
	  function tryCatcherGen(tryCatchTarget) {
	    return function tryCatcher() {
	      try {
	        return tryCatchTarget.apply(this, arguments);
	      } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	      }
	    }
	  }
	  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    return tryCatcherGen(fn);
	  }
	  function thrower(e) {
	    throw e;
	  }
	
	  Rx.config.longStackSupport = false;
	  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
	  hasStacks = !!stacks.e && !!stacks.e.stack;
	
	  // All code after this point will be filtered from stack traces reported by RxJS
	  var rStartingLine = captureLine(), rFileName;
	
	  var STACK_JUMP_SEPARATOR = 'From previous event:';
	
	  function makeStackTraceLong(error, observable) {
	    // If possible, transform the error stack trace by removing Node and RxJS
	    // cruft, then concatenating with the stack trace of `observable`.
	    if (hasStacks &&
	        observable.stack &&
	        typeof error === 'object' &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	      var stacks = [];
	      for (var o = observable; !!o; o = o.source) {
	        if (o.stack) {
	          stacks.unshift(o.stack);
	        }
	      }
	      stacks.unshift(error.stack);
	
	      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
	      error.stack = filterStackString(concatedStacks);
	    }
	  }
	
	  function filterStackString(stackString) {
	    var lines = stackString.split('\n'), desiredLines = [];
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var line = lines[i];
	
	      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	        desiredLines.push(line);
	      }
	    }
	    return desiredLines.join('\n');
	  }
	
	  function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	    if (!fileNameAndLineNumber) {
	      return false;
	    }
	    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];
	
	    return fileName === rFileName &&
	      lineNumber >= rStartingLine &&
	      lineNumber <= rEndingLine;
	  }
	
	  function isNodeFrame(stackLine) {
	    return stackLine.indexOf('(module.js:') !== -1 ||
	      stackLine.indexOf('(node.js:') !== -1;
	  }
	
	  function captureLine() {
	    if (!hasStacks) { return; }
	
	    try {
	      throw new Error();
	    } catch (e) {
	      var lines = e.stack.split('\n');
	      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
	      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	      if (!fileNameAndLineNumber) { return; }
	
	      rFileName = fileNameAndLineNumber[0];
	      return fileNameAndLineNumber[1];
	    }
	  }
	
	  function getFileNameAndLineNumber(stackLine) {
	    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }
	
	    // Anonymous functions: 'at filename:lineNumber:columnNumber'
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }
	
	    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
	  }
	
	  var EmptyError = Rx.EmptyError = function() {
	    this.message = 'Sequence contains no elements.';
	    this.name = 'EmptyError';
	    Error.call(this);
	  };
	  EmptyError.prototype = Object.create(Error.prototype);
	
	  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
	    this.message = 'Object has been disposed';
	    this.name = 'ObjectDisposedError';
	    Error.call(this);
	  };
	  ObjectDisposedError.prototype = Object.create(Error.prototype);
	
	  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
	    this.message = 'Argument out of range';
	    this.name = 'ArgumentOutOfRangeError';
	    Error.call(this);
	  };
	  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
	
	  var NotSupportedError = Rx.NotSupportedError = function (message) {
	    this.message = message || 'This operation is not supported';
	    this.name = 'NotSupportedError';
	    Error.call(this);
	  };
	  NotSupportedError.prototype = Object.create(Error.prototype);
	
	  var NotImplementedError = Rx.NotImplementedError = function (message) {
	    this.message = message || 'This operation is not implemented';
	    this.name = 'NotImplementedError';
	    Error.call(this);
	  };
	  NotImplementedError.prototype = Object.create(Error.prototype);
	
	  var notImplemented = Rx.helpers.notImplemented = function () {
	    throw new NotImplementedError();
	  };
	
	  var notSupported = Rx.helpers.notSupported = function () {
	    throw new NotSupportedError();
	  };
	
	  // Shim in iterator support
	  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
	    '_es6shim_iterator_';
	  // Bug for mozilla version
	  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
	    $iterator$ = '@@iterator';
	  }
	
	  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };
	
	  var isIterable = Rx.helpers.isIterable = function (o) {
	    return o[$iterator$] !== undefined;
	  }
	
	  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
	    return o && o.length !== undefined;
	  }
	
	  Rx.helpers.iterator = $iterator$;
	
	  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
	    if (typeof thisArg === 'undefined') { return func; }
	    switch(argCount) {
	      case 0:
	        return function() {
	          return func.call(thisArg)
	        };
	      case 1:
	        return function(arg) {
	          return func.call(thisArg, arg);
	        }
	      case 2:
	        return function(value, index) {
	          return func.call(thisArg, value, index);
	        };
	      case 3:
	        return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	    }
	
	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  };
	
	  /** Used to determine if values are of the language type Object */
	  var dontEnums = ['toString',
	    'toLocaleString',
	    'valueOf',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'constructor'],
	  dontEnumsLength = dontEnums.length;
	
	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	    arrayClass = '[object Array]',
	    boolClass = '[object Boolean]',
	    dateClass = '[object Date]',
	    errorClass = '[object Error]',
	    funcClass = '[object Function]',
	    numberClass = '[object Number]',
	    objectClass = '[object Object]',
	    regexpClass = '[object RegExp]',
	    stringClass = '[object String]';
	
	  var toString = Object.prototype.toString,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
	    supportNodeClass,
	    errorProto = Error.prototype,
	    objectProto = Object.prototype,
	    stringProto = String.prototype,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	  try {
	    supportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	  } catch (e) {
	    supportNodeClass = true;
	  }
	
	  var nonEnumProps = {};
	  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	  nonEnumProps[objectClass] = { 'constructor': true };
	
	  var support = {};
	  (function () {
	    var ctor = function() { this.x = 1; },
	      props = [];
	
	    ctor.prototype = { 'valueOf': 1, 'y': 1 };
	    for (var key in new ctor) { props.push(key); }
	    for (key in arguments) { }
	
	    // Detect if `name` or `message` properties of `Error.prototype` are enumerable by default.
	    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');
	
	    // Detect if `prototype` properties are enumerable by default.
	    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');
	
	    // Detect if `arguments` object indexes are non-enumerable
	    support.nonEnumArgs = key != 0;
	
	    // Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	    support.nonEnumShadows = !/valueOf/.test(props);
	  }(1));
	
	  var isObject = Rx.internals.isObject = function(value) {
	    var type = typeof value;
	    return value && (type == 'function' || type == 'object') || false;
	  };
	
	  function keysIn(object) {
	    var result = [];
	    if (!isObject(object)) {
	      return result;
	    }
	    if (support.nonEnumArgs && object.length && isArguments(object)) {
	      object = slice.call(object);
	    }
	    var skipProto = support.enumPrototypes && typeof object == 'function',
	        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);
	
	    for (var key in object) {
	      if (!(skipProto && key == 'prototype') &&
	          !(skipErrorProps && (key == 'message' || key == 'name'))) {
	        result.push(key);
	      }
	    }
	
	    if (support.nonEnumShadows && object !== objectProto) {
	      var ctor = object.constructor,
	          index = -1,
	          length = dontEnumsLength;
	
	      if (object === (ctor && ctor.prototype)) {
	        var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object),
	            nonEnum = nonEnumProps[className];
	      }
	      while (++index < length) {
	        key = dontEnums[index];
	        if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
	          result.push(key);
	        }
	      }
	    }
	    return result;
	  }
	
	  function internalFor(object, callback, keysFunc) {
	    var index = -1,
	      props = keysFunc(object),
	      length = props.length;
	
	    while (++index < length) {
	      var key = props[index];
	      if (callback(object[key], key, object) === false) {
	        break;
	      }
	    }
	    return object;
	  }
	
	  function internalForIn(object, callback) {
	    return internalFor(object, callback, keysIn);
	  }
	
	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }
	
	  var isArguments = function(value) {
	    return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
	  }
	
	  // fallback for browsers that can't detect `arguments` objects by [[Class]]
	  if (!supportsArgsClass) {
	    isArguments = function(value) {
	      return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
	    };
	  }
	
	  var isEqual = Rx.internals.isEqual = function (x, y) {
	    return deepEquals(x, y, [], []);
	  };
	
	  /** @private
	   * Used for deep comparison
	   **/
	  function deepEquals(a, b, stackA, stackB) {
	    // exit early for identical values
	    if (a === b) {
	      // treat `+0` vs. `-0` as not equal
	      return a !== 0 || (1 / a == 1 / b);
	    }
	
	    var type = typeof a,
	        otherType = typeof b;
	
	    // exit early for unlike primitive values
	    if (a === a && (a == null || b == null ||
	        (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
	      return false;
	    }
	
	    // compare [[Class]] names
	    var className = toString.call(a),
	        otherClass = toString.call(b);
	
	    if (className == argsClass) {
	      className = objectClass;
	    }
	    if (otherClass == argsClass) {
	      otherClass = objectClass;
	    }
	    if (className != otherClass) {
	      return false;
	    }
	    switch (className) {
	      case boolClass:
	      case dateClass:
	        // coerce dates and booleans to numbers, dates to milliseconds and booleans
	        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	        return +a == +b;
	
	      case numberClass:
	        // treat `NaN` vs. `NaN` as equal
	        return (a != +a) ?
	          b != +b :
	          // but treat `-0` vs. `+0` as not equal
	          (a == 0 ? (1 / a == 1 / b) : a == +b);
	
	      case regexpClass:
	      case stringClass:
	        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	        // treat string primitives and their corresponding object instances as equal
	        return a == String(b);
	    }
	    var isArr = className == arrayClass;
	    if (!isArr) {
	
	      // exit for functions and DOM nodes
	      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	        return false;
	      }
	      // in older versions of Opera, `arguments` objects have `Array` constructors
	      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;
	
	      // non `Object` object instances with different constructors are not equal
	      if (ctorA != ctorB &&
	            !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
	            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	            ('constructor' in a && 'constructor' in b)
	          ) {
	        return false;
	      }
	    }
	    // assume cyclic structures are equal
	    // the algorithm for detecting cyclic structures is adapted from ES 5.1
	    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	    var initedStack = !stackA;
	    stackA || (stackA = []);
	    stackB || (stackB = []);
	
	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == a) {
	        return stackB[length] == b;
	      }
	    }
	    var size = 0;
	    var result = true;
	
	    // add `a` and `b` to the stack of traversed objects
	    stackA.push(a);
	    stackB.push(b);
	
	    // recursively compare objects and arrays (susceptible to call stack limits)
	    if (isArr) {
	      // compare lengths to determine if a deep comparison is necessary
	      length = a.length;
	      size = b.length;
	      result = size == length;
	
	      if (result) {
	        // deep compare the contents, ignoring non-numeric properties
	        while (size--) {
	          var index = length,
	              value = b[size];
	
	          if (!(result = deepEquals(a[size], value, stackA, stackB))) {
	            break;
	          }
	        }
	      }
	    }
	    else {
	      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	      // which, in this case, is more costly
	      internalForIn(b, function(value, key, b) {
	        if (hasOwnProperty.call(b, key)) {
	          // count the number of properties.
	          size++;
	          // deep compare each property value.
	          return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB));
	        }
	      });
	
	      if (result) {
	        // ensure both objects have the same number of properties
	        internalForIn(a, function(value, key, a) {
	          if (hasOwnProperty.call(a, key)) {
	            // `size` will be `-1` if `a` has more properties than `b`
	            return (result = --size > -1);
	          }
	        });
	      }
	    }
	    stackA.pop();
	    stackB.pop();
	
	    return result;
	  }
	
	  var hasProp = {}.hasOwnProperty,
	      slice = Array.prototype.slice;
	
	  var inherits = Rx.internals.inherits = function (child, parent) {
	    function __() { this.constructor = child; }
	    __.prototype = parent.prototype;
	    child.prototype = new __();
	  };
	
	  var addProperties = Rx.internals.addProperties = function (obj) {
	    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	      var source = sources[idx];
	      for (var prop in source) {
	        obj[prop] = source[prop];
	      }
	    }
	  };
	
	  // Rx Utils
	  var addRef = Rx.internals.addRef = function (xs, r) {
	    return new AnonymousObservable(function (observer) {
	      return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
	    });
	  };
	
	  function arrayInitialize(count, factory) {
	    var a = new Array(count);
	    for (var i = 0; i < count; i++) {
	      a[i] = factory();
	    }
	    return a;
	  }
	
	  // Collections
	  function IndexedItem(id, value) {
	    this.id = id;
	    this.value = value;
	  }
	
	  IndexedItem.prototype.compareTo = function (other) {
	    var c = this.value.compareTo(other.value);
	    c === 0 && (c = this.id - other.id);
	    return c;
	  };
	
	  // Priority Queue for Scheduling
	  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
	    this.items = new Array(capacity);
	    this.length = 0;
	  };
	
	  var priorityProto = PriorityQueue.prototype;
	  priorityProto.isHigherPriority = function (left, right) {
	    return this.items[left].compareTo(this.items[right]) < 0;
	  };
	
	  priorityProto.percolate = function (index) {
	    if (index >= this.length || index < 0) { return; }
	    var parent = index - 1 >> 1;
	    if (parent < 0 || parent === index) { return; }
	    if (this.isHigherPriority(index, parent)) {
	      var temp = this.items[index];
	      this.items[index] = this.items[parent];
	      this.items[parent] = temp;
	      this.percolate(parent);
	    }
	  };
	
	  priorityProto.heapify = function (index) {
	    +index || (index = 0);
	    if (index >= this.length || index < 0) { return; }
	    var left = 2 * index + 1,
	        right = 2 * index + 2,
	        first = index;
	    if (left < this.length && this.isHigherPriority(left, first)) {
	      first = left;
	    }
	    if (right < this.length && this.isHigherPriority(right, first)) {
	      first = right;
	    }
	    if (first !== index) {
	      var temp = this.items[index];
	      this.items[index] = this.items[first];
	      this.items[first] = temp;
	      this.heapify(first);
	    }
	  };
	
	  priorityProto.peek = function () { return this.items[0].value; };
	
	  priorityProto.removeAt = function (index) {
	    this.items[index] = this.items[--this.length];
	    this.items[this.length] = undefined;
	    this.heapify();
	  };
	
	  priorityProto.dequeue = function () {
	    var result = this.peek();
	    this.removeAt(0);
	    return result;
	  };
	
	  priorityProto.enqueue = function (item) {
	    var index = this.length++;
	    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	    this.percolate(index);
	  };
	
	  priorityProto.remove = function (item) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.items[i].value === item) {
	        this.removeAt(i);
	        return true;
	      }
	    }
	    return false;
	  };
	  PriorityQueue.count = 0;
	
	  /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */
	  var CompositeDisposable = Rx.CompositeDisposable = function () {
	    var args = [], i, len;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	      len = args.length;
	    } else {
	      len = arguments.length;
	      args = new Array(len);
	      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    for(i = 0; i < len; i++) {
	      if (!isDisposable(args[i])) { throw new TypeError('Not a disposable'); }
	    }
	    this.disposables = args;
	    this.isDisposed = false;
	    this.length = args.length;
	  };
	
	  var CompositeDisposablePrototype = CompositeDisposable.prototype;
	
	  /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */
	  CompositeDisposablePrototype.add = function (item) {
	    if (this.isDisposed) {
	      item.dispose();
	    } else {
	      this.disposables.push(item);
	      this.length++;
	    }
	  };
	
	  /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */
	  CompositeDisposablePrototype.remove = function (item) {
	    var shouldDispose = false;
	    if (!this.isDisposed) {
	      var idx = this.disposables.indexOf(item);
	      if (idx !== -1) {
	        shouldDispose = true;
	        this.disposables.splice(idx, 1);
	        this.length--;
	        item.dispose();
	      }
	    }
	    return shouldDispose;
	  };
	
	  /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */
	  CompositeDisposablePrototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var len = this.disposables.length, currentDisposables = new Array(len);
	      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
	      this.disposables = [];
	      this.length = 0;
	
	      for (i = 0; i < len; i++) {
	        currentDisposables[i].dispose();
	      }
	    }
	  };
	
	  /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */
	  var Disposable = Rx.Disposable = function (action) {
	    this.isDisposed = false;
	    this.action = action || noop;
	  };
	
	  /** Performs the task of cleaning up resources. */
	  Disposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.action();
	      this.isDisposed = true;
	    }
	  };
	
	  /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */
	  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };
	
	  /**
	   * Gets the disposable that does nothing when disposed.
	   */
	  var disposableEmpty = Disposable.empty = { dispose: noop };
	
	  /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */
	  var isDisposable = Disposable.isDisposable = function (d) {
	    return d && isFunction(d.dispose);
	  };
	
	  var checkDisposed = Disposable.checkDisposed = function (disposable) {
	    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
	  };
	
	  // Single assignment
	  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SingleAssignmentDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	    if (this.current) { throw new Error('Disposable has already been assigned'); }
	    var shouldDispose = this.isDisposed;
	    !shouldDispose && (this.current = value);
	    shouldDispose && value && value.dispose();
	  };
	  SingleAssignmentDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };
	
	  // Multiple assignment disposable
	  var SerialDisposable = Rx.SerialDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SerialDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SerialDisposable.prototype.setDisposable = function (value) {
	    var shouldDispose = this.isDisposed;
	    if (!shouldDispose) {
	      var old = this.current;
	      this.current = value;
	    }
	    old && old.dispose();
	    shouldDispose && value && value.dispose();
	  };
	  SerialDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };
	
	  /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */
	  var RefCountDisposable = Rx.RefCountDisposable = (function () {
	
	    function InnerDisposable(disposable) {
	      this.disposable = disposable;
	      this.disposable.count++;
	      this.isInnerDisposed = false;
	    }
	
	    InnerDisposable.prototype.dispose = function () {
	      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	        this.isInnerDisposed = true;
	        this.disposable.count--;
	        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	          this.disposable.isDisposed = true;
	          this.disposable.underlyingDisposable.dispose();
	        }
	      }
	    };
	
	    /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */
	    function RefCountDisposable(disposable) {
	      this.underlyingDisposable = disposable;
	      this.isDisposed = false;
	      this.isPrimaryDisposed = false;
	      this.count = 0;
	    }
	
	    /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */
	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed && !this.isPrimaryDisposed) {
	        this.isPrimaryDisposed = true;
	        if (this.count === 0) {
	          this.isDisposed = true;
	          this.underlyingDisposable.dispose();
	        }
	      }
	    };
	
	    /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */
	    RefCountDisposable.prototype.getDisposable = function () {
	      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
	    };
	
	    return RefCountDisposable;
	  })();
	
	  function ScheduledDisposable(scheduler, disposable) {
	    this.scheduler = scheduler;
	    this.disposable = disposable;
	    this.isDisposed = false;
	  }
	
	  function scheduleItem(s, self) {
	    if (!self.isDisposed) {
	      self.isDisposed = true;
	      self.disposable.dispose();
	    }
	  }
	
	  ScheduledDisposable.prototype.dispose = function () {
	    this.scheduler.scheduleWithState(this, scheduleItem);
	  };
	
	  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
	    this.scheduler = scheduler;
	    this.state = state;
	    this.action = action;
	    this.dueTime = dueTime;
	    this.comparer = comparer || defaultSubComparer;
	    this.disposable = new SingleAssignmentDisposable();
	  }
	
	  ScheduledItem.prototype.invoke = function () {
	    this.disposable.setDisposable(this.invokeCore());
	  };
	
	  ScheduledItem.prototype.compareTo = function (other) {
	    return this.comparer(this.dueTime, other.dueTime);
	  };
	
	  ScheduledItem.prototype.isCancelled = function () {
	    return this.disposable.isDisposed;
	  };
	
	  ScheduledItem.prototype.invokeCore = function () {
	    return this.action(this.scheduler, this.state);
	  };
	
	  /** Provides a set of static properties to access commonly used schedulers. */
	  var Scheduler = Rx.Scheduler = (function () {
	
	    function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
	      this.now = now;
	      this._schedule = schedule;
	      this._scheduleRelative = scheduleRelative;
	      this._scheduleAbsolute = scheduleAbsolute;
	    }
	
	    /** Determines whether the given object is a scheduler */
	    Scheduler.isScheduler = function (s) {
	      return s instanceof Scheduler;
	    }
	
	    function invokeAction(scheduler, action) {
	      action();
	      return disposableEmpty;
	    }
	
	    var schedulerProto = Scheduler.prototype;
	
	    /**
	     * Schedules an action to be executed.
	     * @param {Function} action Action to execute.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.schedule = function (action) {
	      return this._schedule(action, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed.
	     * @param state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithState = function (state, action) {
	      return this._schedule(state, action);
	    };
	
	    /**
	     * Schedules an action to be executed after the specified relative due time.
	     * @param {Function} action Action to execute.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithRelative = function (dueTime, action) {
	      return this._scheduleRelative(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
	      return this._scheduleRelative(state, dueTime, action);
	    };
	
	    /**
	     * Schedules an action to be executed at the specified absolute due time.
	     * @param {Function} action Action to execute.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	      */
	    schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
	      return this._scheduleAbsolute(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @param {Number}dueTime Absolute time at which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
	      return this._scheduleAbsolute(state, dueTime, action);
	    };
	
	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.now = defaultNow;
	
	    /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */
	    Scheduler.normalize = function (timeSpan) {
	      timeSpan < 0 && (timeSpan = 0);
	      return timeSpan;
	    };
	
	    return Scheduler;
	  }());
	
	  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;
	
	  (function (schedulerProto) {
	
	    function invokeRecImmediate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;
	
	      function innerAction(state2) {
	        var isAdded = false, isDone = false;
	
	        var d = scheduler.scheduleWithState(state2, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }
	
	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }
	
	    function invokeRecDate(scheduler, pair, method) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;
	
	      function innerAction(state2, dueTime1) {
	        var isAdded = false, isDone = false;
	
	        var d = scheduler[method](state2, dueTime1, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }
	
	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }
	
	    function invokeRecDateRelative(s, p) {
	      return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
	    }
	
	    function invokeRecDateAbsolute(s, p) {
	      return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
	    }
	
	    function scheduleInnerRecursive(action, self) {
	      action(function(dt) { self(action, dt); });
	    }
	
	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursive = function (action) {
	      return this.scheduleRecursiveWithState(action, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithState = function (state, action) {
	      return this.scheduleWithState([state, action], invokeRecImmediate);
	    };
	
	    /**
	     * Schedules an action to be executed recursively after a specified relative due time.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.
	     * @param {Number}dueTime Relative time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
	      return this.scheduleRecursiveWithRelativeAndState(action, dueTime, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively after a specified relative due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number}dueTime Relative time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
	      return this._scheduleRelative([state, action], dueTime, invokeRecDateRelative);
	    };
	
	    /**
	     * Schedules an action to be executed recursively at a specified absolute due time.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.
	     * @param {Number}dueTime Absolute time at which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
	      return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively at a specified absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number}dueTime Absolute time at which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
	      return this._scheduleAbsolute([state, action], dueTime, invokeRecDateAbsolute);
	    };
	  }(Scheduler.prototype));
	
	  (function (schedulerProto) {
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    Scheduler.prototype.schedulePeriodic = function (period, action) {
	      return this.schedulePeriodicWithState(null, period, action);
	    };
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    Scheduler.prototype.schedulePeriodicWithState = function(state, period, action) {
	      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
	      period = normalizeTime(period);
	      var s = state, id = root.setInterval(function () { s = action(s); }, period);
	      return disposableCreate(function () { root.clearInterval(id); });
	    };
	
	  }(Scheduler.prototype));
	
	  (function (schedulerProto) {
	    /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */
	    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
	      return new CatchScheduler(this, handler);
	    };
	  }(Scheduler.prototype));
	
	  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
	    function tick(command, recurse) {
	      recurse(0, this._period);
	      try {
	        this._state = this._action(this._state);
	      } catch (e) {
	        this._cancel.dispose();
	        throw e;
	      }
	    }
	
	    function SchedulePeriodicRecursive(scheduler, state, period, action) {
	      this._scheduler = scheduler;
	      this._state = state;
	      this._period = period;
	      this._action = action;
	    }
	
	    SchedulePeriodicRecursive.prototype.start = function () {
	      var d = new SingleAssignmentDisposable();
	      this._cancel = d;
	      d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));
	
	      return d;
	    };
	
	    return SchedulePeriodicRecursive;
	  }());
	
	  /** Gets a scheduler that schedules work immediately on the current thread. */
	  var immediateScheduler = Scheduler.immediate = (function () {
	    function scheduleNow(state, action) { return action(this, state); }
	    return new Scheduler(defaultNow, scheduleNow, notSupported, notSupported);
	  }());
	
	  /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */
	  var currentThreadScheduler = Scheduler.currentThread = (function () {
	    var queue;
	
	    function runTrampoline () {
	      while (queue.length > 0) {
	        var item = queue.shift();
	        !item.isCancelled() && item.invoke();
	      }
	    }
	
	    function scheduleNow(state, action) {
	      var si = new ScheduledItem(this, state, action, this.now());
	
	      if (!queue) {
	        queue = [si];
	
	        var result = tryCatch(runTrampoline)();
	        queue = null;
	        if (result === errorObj) { return thrower(result.e); }
	      } else {
	        queue.push(si);
	      }
	      return si.disposable;
	    }
	
	    var currentScheduler = new Scheduler(defaultNow, scheduleNow, notSupported, notSupported);
	    currentScheduler.scheduleRequired = function () { return !queue; };
	
	    return currentScheduler;
	  }());
	
	  var scheduleMethod, clearMethod;
	
	  var localTimer = (function () {
	    var localSetTimeout, localClearTimeout = noop;
	    if (!!root.setTimeout) {
	      localSetTimeout = root.setTimeout;
	      localClearTimeout = root.clearTimeout;
	    } else if (!!root.WScript) {
	      localSetTimeout = function (fn, time) {
	        root.WScript.Sleep(time);
	        fn();
	      };
	    } else {
	      throw new NotSupportedError();
	    }
	
	    return {
	      setTimeout: localSetTimeout,
	      clearTimeout: localClearTimeout
	    };
	  }());
	  var localSetTimeout = localTimer.setTimeout,
	    localClearTimeout = localTimer.clearTimeout;
	
	  (function () {
	
	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;
	
	    clearMethod = function (handle) {
	      delete tasksByHandle[handle];
	    };
	
	    function runTask(handle) {
	      if (currentlyRunning) {
	        localSetTimeout(function () { runTask(handle) }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          var result = tryCatch(task)();
	          clearMethod(handle);
	          currentlyRunning = false;
	          if (result === errorObj) { return thrower(result.e); }
	        }
	      }
	    }
	
	    var reNative = RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );
	
	    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
	      !reNative.test(setImmediate) && setImmediate;
	
	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;
	
	      return isAsync;
	    }
	
	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    if (isFunction(setImmediate)) {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        setImmediate(function () { runTask(id); });
	
	        return id;
	      };
	    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        process.nextTick(function () { runTask(id); });
	
	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();
	
	      function onGlobalPostMessage(event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      }
	
	      if (root.addEventListener) {
	        root.addEventListener('message', onGlobalPostMessage, false);
	      } else if (root.attachEvent) {
	        root.attachEvent('onmessage', onGlobalPostMessage);
	      } else {
	        root.onmessage = onGlobalPostMessage;
	      }
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + currentId, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();
	
	      channel.port1.onmessage = function (e) { runTask(e.data); };
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
	
	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	
	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	        return id;
	      };
	
	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        localSetTimeout(function () {
	          runTask(id);
	        }, 0);
	
	        return id;
	      };
	    }
	  }());
	
	  /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */
	  var timeoutScheduler = Scheduler.timeout = Scheduler['default'] = (function () {
	
	    function scheduleNow(state, action) {
	      var scheduler = this, disposable = new SingleAssignmentDisposable();
	      var id = scheduleMethod(function () {
	        !disposable.isDisposed && disposable.setDisposable(action(scheduler, state));
	      });
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        clearMethod(id);
	      }));
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      var scheduler = this, dt = Scheduler.normalize(dueTime), disposable = new SingleAssignmentDisposable();
	      if (dt === 0) { return scheduler.scheduleWithState(state, action); }
	      var id = localSetTimeout(function () {
	        !disposable.isDisposed && disposable.setDisposable(action(scheduler, state));
	      }, dt);
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        localClearTimeout(id);
	      }));
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
	    }
	
	    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
	  })();
	
	  var CatchScheduler = (function (__super__) {
	
	    function scheduleNow(state, action) {
	      return this._scheduler.scheduleWithState(state, this._wrap(action));
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      return this._scheduler.scheduleWithRelativeAndState(state, dueTime, this._wrap(action));
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this._scheduler.scheduleWithAbsoluteAndState(state, dueTime, this._wrap(action));
	    }
	
	    inherits(CatchScheduler, __super__);
	
	    function CatchScheduler(scheduler, handler) {
	      this._scheduler = scheduler;
	      this._handler = handler;
	      this._recursiveOriginal = null;
	      this._recursiveWrapper = null;
	      __super__.call(this, this._scheduler.now.bind(this._scheduler), scheduleNow, scheduleRelative, scheduleAbsolute);
	    }
	
	    CatchScheduler.prototype._clone = function (scheduler) {
	        return new CatchScheduler(scheduler, this._handler);
	    };
	
	    CatchScheduler.prototype._wrap = function (action) {
	      var parent = this;
	      return function (self, state) {
	        try {
	          return action(parent._getRecursiveWrapper(self), state);
	        } catch (e) {
	          if (!parent._handler(e)) { throw e; }
	          return disposableEmpty;
	        }
	      };
	    };
	
	    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	      if (this._recursiveOriginal !== scheduler) {
	        this._recursiveOriginal = scheduler;
	        var wrapper = this._clone(scheduler);
	        wrapper._recursiveOriginal = scheduler;
	        wrapper._recursiveWrapper = wrapper;
	        this._recursiveWrapper = wrapper;
	      }
	      return this._recursiveWrapper;
	    };
	
	    CatchScheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
	      var self = this, failed = false, d = new SingleAssignmentDisposable();
	
	      d.setDisposable(this._scheduler.schedulePeriodicWithState(state, period, function (state1) {
	        if (failed) { return null; }
	        try {
	          return action(state1);
	        } catch (e) {
	          failed = true;
	          if (!self._handler(e)) { throw e; }
	          d.dispose();
	          return null;
	        }
	      }));
	
	      return d;
	    };
	
	    return CatchScheduler;
	  }(Scheduler));
	
	  /**
	   *  Represents a notification to an observer.
	   */
	  var Notification = Rx.Notification = (function () {
	    function Notification(kind, value, exception, accept, acceptObservable, toString) {
	      this.kind = kind;
	      this.value = value;
	      this.exception = exception;
	      this._accept = accept;
	      this._acceptObservable = acceptObservable;
	      this.toString = toString;
	    }
	
	    /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     *
	     * @memberOf Notification
	     * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Delegate to invoke for an OnError notification.
	     * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */
	    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
	        this._acceptObservable(observerOrOnNext) :
	        this._accept(observerOrOnNext, onError, onCompleted);
	    };
	
	    /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */
	    Notification.prototype.toObservable = function (scheduler) {
	      var self = this;
	      isScheduler(scheduler) || (scheduler = immediateScheduler);
	      return new AnonymousObservable(function (observer) {
	        return scheduler.scheduleWithState(self, function (_, notification) {
	          notification._acceptObservable(observer);
	          notification.kind === 'N' && observer.onCompleted();
	        });
	      });
	    };
	
	    return Notification;
	  })();
	
	  /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */
	  var notificationCreateOnNext = Notification.createOnNext = (function () {
	      function _accept(onNext) { return onNext(this.value); }
	      function _acceptObservable(observer) { return observer.onNext(this.value); }
	      function toString() { return 'OnNext(' + this.value + ')'; }
	
	      return function (value) {
	        return new Notification('N', value, null, _accept, _acceptObservable, toString);
	      };
	  }());
	
	  /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */
	  var notificationCreateOnError = Notification.createOnError = (function () {
	    function _accept (onNext, onError) { return onError(this.exception); }
	    function _acceptObservable(observer) { return observer.onError(this.exception); }
	    function toString () { return 'OnError(' + this.exception + ')'; }
	
	    return function (e) {
	      return new Notification('E', null, e, _accept, _acceptObservable, toString);
	    };
	  }());
	
	  /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */
	  var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {
	    function _accept (onNext, onError, onCompleted) { return onCompleted(); }
	    function _acceptObservable(observer) { return observer.onCompleted(); }
	    function toString () { return 'OnCompleted()'; }
	
	    return function () {
	      return new Notification('C', null, null, _accept, _acceptObservable, toString);
	    };
	  }());
	
	  /**
	   * Supports push-style iteration over an observable sequence.
	   */
	  var Observer = Rx.Observer = function () { };
	
	  /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */
	  Observer.prototype.toNotifier = function () {
	    var observer = this;
	    return function (n) { return n.accept(observer); };
	  };
	
	  /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */
	  Observer.prototype.asObserver = function () {
	    var self = this;
	    return new AnonymousObserver(
	      function (x) { self.onNext(x); },
	      function (err) { self.onError(err); },
	      function () { self.onCompleted(); });
	  };
	
	  /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */
	  Observer.prototype.checked = function () { return new CheckedObserver(this); };
	
	  /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */
	  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	    onNext || (onNext = noop);
	    onError || (onError = defaultError);
	    onCompleted || (onCompleted = noop);
	    return new AnonymousObserver(onNext, onError, onCompleted);
	  };
	
	  /**
	   *  Creates an observer from a notification callback.
	   *
	   * @static
	   * @memberOf Observer
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */
	  Observer.fromNotifier = function (handler, thisArg) {
	    var cb = bindCallback(handler, thisArg, 1);
	    return new AnonymousObserver(function (x) {
	      return cb(notificationCreateOnNext(x));
	    }, function (e) {
	      return cb(notificationCreateOnError(e));
	    }, function () {
	      return cb(notificationCreateOnCompleted());
	    });
	  };
	
	  /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */
	  Observer.prototype.notifyOn = function (scheduler) {
	    return new ObserveOnObserver(scheduler, this);
	  };
	
	  Observer.prototype.makeSafe = function(disposable) {
	    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
	  };
	
	  /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */
	  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
	    inherits(AbstractObserver, __super__);
	
	    /**
	     * Creates a new observer in a non-stopped state.
	     */
	    function AbstractObserver() {
	      this.isStopped = false;
	    }
	
	    // Must be implemented by other observers
	    AbstractObserver.prototype.next = notImplemented;
	    AbstractObserver.prototype.error = notImplemented;
	    AbstractObserver.prototype.completed = notImplemented;
	
	    /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */
	    AbstractObserver.prototype.onNext = function (value) {
	      !this.isStopped && this.next(value);
	    };
	
	    /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */
	    AbstractObserver.prototype.onError = function (error) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(error);
	      }
	    };
	
	    /**
	     * Notifies the observer of the end of the sequence.
	     */
	    AbstractObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.completed();
	      }
	    };
	
	    /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */
	    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };
	
	    AbstractObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return AbstractObserver;
	  }(Observer));
	
	  /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */
	  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
	    inherits(AnonymousObserver, __super__);
	
	    /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */
	    function AnonymousObserver(onNext, onError, onCompleted) {
	      __super__.call(this);
	      this._onNext = onNext;
	      this._onError = onError;
	      this._onCompleted = onCompleted;
	    }
	
	    /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */
	    AnonymousObserver.prototype.next = function (value) {
	      this._onNext(value);
	    };
	
	    /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */
	    AnonymousObserver.prototype.error = function (error) {
	      this._onError(error);
	    };
	
	    /**
	     *  Calls the onCompleted action.
	     */
	    AnonymousObserver.prototype.completed = function () {
	      this._onCompleted();
	    };
	
	    return AnonymousObserver;
	  }(AbstractObserver));
	
	  var CheckedObserver = (function (__super__) {
	    inherits(CheckedObserver, __super__);
	
	    function CheckedObserver(observer) {
	      __super__.call(this);
	      this._observer = observer;
	      this._state = 0; // 0 - idle, 1 - busy, 2 - done
	    }
	
	    var CheckedObserverPrototype = CheckedObserver.prototype;
	
	    CheckedObserverPrototype.onNext = function (value) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onNext).call(this._observer, value);
	      this._state = 0;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.onError = function (err) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onError).call(this._observer, err);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.onCompleted = function () {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onCompleted).call(this._observer);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.checkAccess = function () {
	      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
	      if (this._state === 2) { throw new Error('Observer completed'); }
	      if (this._state === 0) { this._state = 1; }
	    };
	
	    return CheckedObserver;
	  }(Observer));
	
	  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
	    inherits(ScheduledObserver, __super__);
	
	    function ScheduledObserver(scheduler, observer) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.observer = observer;
	      this.isAcquired = false;
	      this.hasFaulted = false;
	      this.queue = [];
	      this.disposable = new SerialDisposable();
	    }
	
	    ScheduledObserver.prototype.next = function (value) {
	      var self = this;
	      this.queue.push(function () { self.observer.onNext(value); });
	    };
	
	    ScheduledObserver.prototype.error = function (e) {
	      var self = this;
	      this.queue.push(function () { self.observer.onError(e); });
	    };
	
	    ScheduledObserver.prototype.completed = function () {
	      var self = this;
	      this.queue.push(function () { self.observer.onCompleted(); });
	    };
	
	    ScheduledObserver.prototype.ensureActive = function () {
	      var isOwner = false;
	      if (!this.hasFaulted && this.queue.length > 0) {
	        isOwner = !this.isAcquired;
	        this.isAcquired = true;
	      }
	      if (isOwner) {
	        this.disposable.setDisposable(this.scheduler.scheduleRecursiveWithState(this, function (parent, self) {
	          var work;
	          if (parent.queue.length > 0) {
	            work = parent.queue.shift();
	          } else {
	            parent.isAcquired = false;
	            return;
	          }
	          var res = tryCatch(work)();
	          if (res === errorObj) {
	            parent.queue = [];
	            parent.hasFaulted = true;
	            return thrower(res.e);
	          }
	          self(parent);
	        }));
	      }
	    };
	
	    ScheduledObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.disposable.dispose();
	    };
	
	    return ScheduledObserver;
	  }(AbstractObserver));
	
	  var ObserveOnObserver = (function (__super__) {
	    inherits(ObserveOnObserver, __super__);
	
	    function ObserveOnObserver(scheduler, observer, cancel) {
	      __super__.call(this, scheduler, observer);
	      this._cancel = cancel;
	    }
	
	    ObserveOnObserver.prototype.next = function (value) {
	      __super__.prototype.next.call(this, value);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.error = function (e) {
	      __super__.prototype.error.call(this, e);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.completed = function () {
	      __super__.prototype.completed.call(this);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this._cancel && this._cancel.dispose();
	      this._cancel = null;
	    };
	
	    return ObserveOnObserver;
	  })(ScheduledObserver);
	
	  var observableProto;
	
	  /**
	   * Represents a push-style collection.
	   */
	  var Observable = Rx.Observable = (function () {
	
	    function makeSubscribe(self, subscribe) {
	      return function (o) {
	        var oldOnError = o.onError;
	        o.onError = function (e) {
	          makeStackTraceLong(e, self);
	          oldOnError.call(o, e);
	        };
	
	        return subscribe.call(self, o);
	      };
	    }
	
	    function Observable(subscribe) {
	      if (Rx.config.longStackSupport && hasStacks) {
	        var e = tryCatch(thrower)(new Error()).e;
	        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
	        this._subscribe = makeSubscribe(this, subscribe);
	      } else {
	        this._subscribe = subscribe;
	      }
	    }
	
	    observableProto = Observable.prototype;
	
	    /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */
	    Observable.isObservable = function (o) {
	      return o && isFunction(o.subscribe);
	    }
	
	    /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
	      return this._subscribe(typeof oOrOnNext === 'object' ?
	        oOrOnNext :
	        observerCreate(oOrOnNext, onError, onCompleted));
	    };
	
	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnNext = function (onNext, thisArg) {
	      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
	    };
	
	    /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnError = function (onError, thisArg) {
	      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
	    };
	
	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
	      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
	    };
	
	    return Observable;
	  })();
	
	  var ObservableBase = Rx.ObservableBase = (function (__super__) {
	    inherits(ObservableBase, __super__);
	
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }
	
	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.subscribeCore).call(self, ado);
	
	      if (sub === errorObj) {
	        if(!ado.fail(errorObj.e)) { return thrower(errorObj.e); }
	      }
	      ado.setDisposable(fixSubscriber(sub));
	    }
	
	    function subscribe(observer) {
	      var ado = new AutoDetachObserver(observer), state = [ado, this];
	
	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.scheduleWithState(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    }
	
	    function ObservableBase() {
	      __super__.call(this, subscribe);
	    }
	
	    ObservableBase.prototype.subscribeCore = notImplemented;
	
	    return ObservableBase;
	  }(Observable));
	
	var FlatMapObservable = (function(__super__){
	
	    inherits(FlatMapObservable, __super__);
	
	    function FlatMapObservable(source, selector, resultSelector, thisArg) {
	        this.resultSelector = Rx.helpers.isFunction(resultSelector) ?
	            resultSelector : null;
	
	        this.selector = Rx.internals.bindCallback(Rx.helpers.isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
	        this.source = source;
	
	        __super__.call(this);
	
	    }
	
	    FlatMapObservable.prototype.subscribeCore = function(o) {
	        return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
	    };
	
	    function InnerObserver(observer, selector, resultSelector, source) {
	        this.i = 0;
	        this.selector = selector;
	        this.resultSelector = resultSelector;
	        this.source = source;
	        this.isStopped = false;
	        this.o = observer;
	    }
	
	    InnerObserver.prototype._wrapResult = function(result, x, i) {
	        return this.resultSelector ?
	            result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
	            result;
	    };
	
	    InnerObserver.prototype.onNext = function(x) {
	
	        if (this.isStopped) return;
	
	        var i = this.i++;
	        var result = tryCatch(this.selector)(x, i, this.source);
	
	        if (result === errorObj) {
	            return this.o.onError(result.e);
	        }
	
	        Rx.helpers.isPromise(result) && (result = Rx.Observable.fromPromise(result));
	        (Rx.helpers.isArrayLike(result) || Rx.helpers.isIterable(result)) && (result = Rx.Observable.from(result));
	
	        this.o.onNext(this._wrapResult(result, x, i));
	
	    };
	
	    InnerObserver.prototype.onError = function(e) {
	        if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	
	    InnerObserver.prototype.onCompleted = function() {
	        if (!this.isStopped) {this.isStopped = true; this.o.onCompleted(); }
	    };
	
	    return FlatMapObservable;
	
	}(ObservableBase));
	
	  var Enumerable = Rx.internals.Enumerable = function () { };
	
	  var ConcatEnumerableObservable = (function(__super__) {
	    inherits(ConcatEnumerableObservable, __super__);
	    function ConcatEnumerableObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	    
	    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
	      var isDisposed, subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(this.sources[$iterator$](), function (e, self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          return o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(new InnerObserver(o, self, e)));
	      });
	
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	    
	    function InnerObserver(o, s, e) {
	      this.o = o;
	      this.s = s;
	      this.e = e;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.o.onNext(x); } };
	    InnerObserver.prototype.onError = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.s(this.e);
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	        return true;
	      }
	      return false;
	    };
	    
	    return ConcatEnumerableObservable;
	  }(ObservableBase));
	
	  Enumerable.prototype.concat = function () {
	    return new ConcatEnumerableObservable(this);
	  };
	  
	  var CatchErrorObservable = (function(__super__) {
	    inherits(CatchErrorObservable, __super__);
	    function CatchErrorObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	    
	    CatchErrorObservable.prototype.subscribeCore = function (o) {
	      var e = this.sources[$iterator$]();
	
	      var isDisposed, subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(null, function (lastException, self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          return lastException !== null ? o.onError(lastException) : o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          self,
	          function() { o.onCompleted(); }));
	      });
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	    
	    return CatchErrorObservable;
	  }(ObservableBase));
	
	  Enumerable.prototype.catchError = function () {
	    return new CatchErrorObservable(this);
	  };
	
	  Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var exceptions = new Subject(),
	        notifier = new Subject(),
	        handled = notificationHandler(exceptions),
	        notificationDisposable = handled.subscribe(notifier);
	
	      var e = sources[$iterator$]();
	
	      var isDisposed,
	        lastException,
	        subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursive(function (self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          if (lastException) {
	            o.onError(lastException);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new CompositeDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) {
	            inner.setDisposable(notifier.subscribe(self, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));
	
	            exceptions.onNext(exn);
	          },
	          function() { o.onCompleted(); }));
	      });
	
	      return new CompositeDisposable(notificationDisposable, subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    });
	  };
	  
	  var RepeatEnumerable = (function (__super__) {
	    inherits(RepeatEnumerable, __super__);
	    
	    function RepeatEnumerable(v, c) {
	      this.v = v;
	      this.c = c == null ? -1 : c;
	    }
	    RepeatEnumerable.prototype[$iterator$] = function () {
	      return new RepeatEnumerator(this); 
	    };
	    
	    function RepeatEnumerator(p) {
	      this.v = p.v;
	      this.l = p.c;
	    }
	    RepeatEnumerator.prototype.next = function () {
	      if (this.l === 0) { return doneEnumerator; }
	      if (this.l > 0) { this.l--; }
	      return { done: false, value: this.v }; 
	    };
	    
	    return RepeatEnumerable;
	  }(Enumerable));
	
	  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
	    return new RepeatEnumerable(value, repeatCount);
	  };
	  
	  var OfEnumerable = (function(__super__) {
	    inherits(OfEnumerable, __super__);
	    function OfEnumerable(s, fn, thisArg) {
	      this.s = s;
	      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
	    }
	    OfEnumerable.prototype[$iterator$] = function () {
	      return new OfEnumerator(this);
	    };
	    
	    function OfEnumerator(p) {
	      this.i = -1;
	      this.s = p.s;
	      this.l = this.s.length;
	      this.fn = p.fn;
	    }
	    OfEnumerator.prototype.next = function () {
	     return ++this.i < this.l ?
	       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
	       doneEnumerator; 
	    };
	    
	    return OfEnumerable;
	  }(Enumerable));
	
	  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
	    return new OfEnumerable(source, selector, thisArg);
	  };
	
	   /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */
	  observableProto.observeOn = function (scheduler) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      return source.subscribe(new ObserveOnObserver(scheduler, observer));
	    }, source);
	  };
	
	   /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.
	
	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.
	
	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */
	  observableProto.subscribeOn = function (scheduler) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
	      d.setDisposable(m);
	      m.setDisposable(scheduler.schedule(function () {
	        d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)));
	      }));
	      return d;
	    }, source);
	  };
	
	  var FromPromiseObservable = (function(__super__) {
	    inherits(FromPromiseObservable, __super__);
	    function FromPromiseObservable(p) {
	      this.p = p;
	      __super__.call(this);
	    }
	
	    FromPromiseObservable.prototype.subscribeCore = function(o) {
	      this.p.then(function (data) {
	        o.onNext(data);
	        o.onCompleted();
	      }, function (err) { o.onError(err); });
	      return disposableEmpty;
	    };
	
	    return FromPromiseObservable;
	  }(ObservableBase));
	
	  /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */
	  var observableFromPromise = Observable.fromPromise = function (promise) {
	    return new FromPromiseObservable(promise);
	  };
	  /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */
	  observableProto.toPromise = function (promiseCtor) {
	    promiseCtor || (promiseCtor = Rx.config.Promise);
	    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
	    var source = this;
	    return new promiseCtor(function (resolve, reject) {
	      // No cancellation can be done
	      var value, hasValue = false;
	      source.subscribe(function (v) {
	        value = v;
	        hasValue = true;
	      }, reject, function () {
	        hasValue && resolve(value);
	      });
	    });
	  };
	
	  var ToArrayObservable = (function(__super__) {
	    inherits(ToArrayObservable, __super__);
	    function ToArrayObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    ToArrayObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.a = [];
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.a.push(x); } };
	    InnerObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onNext(this.a);
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; }
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	 
	      return false;
	    };
	
	    return ToArrayObservable;
	  }(ObservableBase));
	
	  /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */
	  observableProto.toArray = function () {
	    return new ToArrayObservable(this);
	  };
	
	  /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */
	  Observable.create = function (subscribe, parent) {
	    return new AnonymousObservable(subscribe, parent);
	  };
	
	  /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */
	  var observableDefer = Observable.defer = function (observableFactory) {
	    return new AnonymousObservable(function (observer) {
	      var result;
	      try {
	        result = observableFactory();
	      } catch (e) {
	        return observableThrow(e).subscribe(observer);
	      }
	      isPromise(result) && (result = observableFromPromise(result));
	      return result.subscribe(observer);
	    });
	  };
	
	  var EmptyObservable = (function(__super__) {
	    inherits(EmptyObservable, __super__);
	    function EmptyObservable(scheduler) {
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    EmptyObservable.prototype.subscribeCore = function (observer) {
	      var sink = new EmptySink(observer, this.scheduler);
	      return sink.run();
	    };
	
	    function EmptySink(observer, scheduler) {
	      this.observer = observer;
	      this.scheduler = scheduler;
	    }
	
	    function scheduleItem(s, state) {
	      state.onCompleted();
	      return disposableEmpty;
	    }
	
	    EmptySink.prototype.run = function () {
	      return this.scheduler.scheduleWithState(this.observer, scheduleItem);
	    };
	
	    return EmptyObservable;
	  }(ObservableBase));
	
	  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);
	
	  /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */
	  var observableEmpty = Observable.empty = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	  };
	
	  var FromObservable = (function(__super__) {
	    inherits(FromObservable, __super__);
	    function FromObservable(iterable, mapper, scheduler) {
	      this.iterable = iterable;
	      this.mapper = mapper;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    FromObservable.prototype.subscribeCore = function (o) {
	      var sink = new FromSink(o, this);
	      return sink.run();
	    };
	
	    return FromObservable;
	  }(ObservableBase));
	
	  var FromSink = (function () {
	    function FromSink(o, parent) {
	      this.o = o;
	      this.parent = parent;
	    }
	
	    FromSink.prototype.run = function () {
	      var list = Object(this.parent.iterable),
	          it = getIterable(list),
	          o = this.o,
	          mapper = this.parent.mapper;
	
	      function loopRecursive(i, recurse) {
	        var next = tryCatch(it.next).call(it);
	        if (next === errorObj) { return o.onError(next.e); }
	        if (next.done) { return o.onCompleted(); }
	
	        var result = next.value;
	
	        if (isFunction(mapper)) {
	          result = tryCatch(mapper)(result, i);
	          if (result === errorObj) { return o.onError(result.e); }
	        }
	
	        o.onNext(result);
	        recurse(i + 1);
	      }
	
	      return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	    };
	
	    return FromSink;
	  }());
	
	  var maxSafeInteger = Math.pow(2, 53) - 1;
	
	  function StringIterable(s) {
	    this._s = s;
	  }
	
	  StringIterable.prototype[$iterator$] = function () {
	    return new StringIterator(this._s);
	  };
	
	  function StringIterator(s) {
	    this._s = s;
	    this._l = s.length;
	    this._i = 0;
	  }
	
	  StringIterator.prototype[$iterator$] = function () {
	    return this;
	  };
	
	  StringIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	  };
	
	  function ArrayIterable(a) {
	    this._a = a;
	  }
	
	  ArrayIterable.prototype[$iterator$] = function () {
	    return new ArrayIterator(this._a);
	  };
	
	  function ArrayIterator(a) {
	    this._a = a;
	    this._l = toLength(a);
	    this._i = 0;
	  }
	
	  ArrayIterator.prototype[$iterator$] = function () {
	    return this;
	  };
	
	  ArrayIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	  };
	
	  function numberIsFinite(value) {
	    return typeof value === 'number' && root.isFinite(value);
	  }
	
	  function isNan(n) {
	    return n !== n;
	  }
	
	  function getIterable(o) {
	    var i = o[$iterator$], it;
	    if (!i && typeof o === 'string') {
	      it = new StringIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i && o.length !== undefined) {
	      it = new ArrayIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i) { throw new TypeError('Object is not iterable'); }
	    return o[$iterator$]();
	  }
	
	  function sign(value) {
	    var number = +value;
	    if (number === 0) { return number; }
	    if (isNaN(number)) { return number; }
	    return number < 0 ? -1 : 1;
	  }
	
	  function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) { return 0; }
	    if (len === 0 || !numberIsFinite(len)) { return len; }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) { return 0; }
	    if (len > maxSafeInteger) { return maxSafeInteger; }
	    return len;
	  }
	
	  /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */
	  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
	    if (iterable == null) {
	      throw new Error('iterable cannot be null.')
	    }
	    if (mapFn && !isFunction(mapFn)) {
	      throw new Error('mapFn when provided must be a function');
	    }
	    if (mapFn) {
	      var mapper = bindCallback(mapFn, thisArg, 2);
	    }
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromObservable(iterable, mapper, scheduler);
	  }
	
	  var FromArrayObservable = (function(__super__) {
	    inherits(FromArrayObservable, __super__);
	    function FromArrayObservable(args, scheduler) {
	      this.args = args;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    FromArrayObservable.prototype.subscribeCore = function (observer) {
	      var sink = new FromArraySink(observer, this);
	      return sink.run();
	    };
	
	    return FromArrayObservable;
	  }(ObservableBase));
	
	  function FromArraySink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  FromArraySink.prototype.run = function () {
	    var observer = this.observer, args = this.parent.args, len = args.length;
	    function loopRecursive(i, recurse) {
	      if (i < len) {
	        observer.onNext(args[i]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	  };
	
	  /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */
	  var observableFromArray = Observable.fromArray = function (array, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler)
	  };
	
	  /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new AnonymousObservable(function (o) {
	      var first = true;
	      return scheduler.scheduleRecursiveWithState(initialState, function (state, self) {
	        var hasResult, result;
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          hasResult && (result = resultSelector(state));
	        } catch (e) {
	          return o.onError(e);
	        }
	        if (hasResult) {
	          o.onNext(result);
	          self(state);
	        } else {
	          o.onCompleted();
	        }
	      });
	    });
	  };
	
	  function observableOf (scheduler, array) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler);
	  }
	
	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.of = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return new FromArrayObservable(args, currentThreadScheduler);
	  };
	
	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.ofWithScheduler = function (scheduler) {
	    var len = arguments.length, args = new Array(len - 1);
	    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
	    return new FromArrayObservable(args, scheduler);
	  };
	
	  /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */
	  Observable.ofArrayChanges = function(array) {
	    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
	    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	      
	      Array.observe(array, observerFn);
	
	      return function () {
	        Array.unobserve(array, observerFn);
	      };
	    });
	  };
	
	  /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */
	  Observable.ofObjectChanges = function(obj) {
	    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
	    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	
	      Object.observe(obj, observerFn);
	
	      return function () {
	        Object.unobserve(obj, observerFn);
	      };
	    });
	  };
	
	  var NeverObservable = (function(__super__) {
	    inherits(NeverObservable, __super__);
	    function NeverObservable() {
	      __super__.call(this);
	    }
	
	    NeverObservable.prototype.subscribeCore = function (observer) {
	      return disposableEmpty;
	    };
	
	    return NeverObservable;
	  }(ObservableBase));
	
	  var NEVER_OBSERVABLE = new NeverObservable();
	
	  /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */
	  var observableNever = Observable.never = function () {
	    return NEVER_OBSERVABLE;
	  };
	
	  var PairsObservable = (function(__super__) {
	    inherits(PairsObservable, __super__);
	    function PairsObservable(obj, scheduler) {
	      this.obj = obj;
	      this.keys = Object.keys(obj);
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    PairsObservable.prototype.subscribeCore = function (observer) {
	      var sink = new PairsSink(observer, this);
	      return sink.run();
	    };
	
	    return PairsObservable;
	  }(ObservableBase));
	
	  function PairsSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  PairsSink.prototype.run = function () {
	    var observer = this.observer, obj = this.parent.obj, keys = this.parent.keys, len = keys.length;
	    function loopRecursive(i, recurse) {
	      if (i < len) {
	        var key = keys[i];
	        observer.onNext([key, obj[key]]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	  };
	
	  /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */
	  Observable.pairs = function (obj, scheduler) {
	    scheduler || (scheduler = currentThreadScheduler);
	    return new PairsObservable(obj, scheduler);
	  };
	
	    var RangeObservable = (function(__super__) {
	    inherits(RangeObservable, __super__);
	    function RangeObservable(start, count, scheduler) {
	      this.start = start;
	      this.rangeCount = count;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    RangeObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RangeSink(observer, this);
	      return sink.run();
	    };
	
	    return RangeObservable;
	  }(ObservableBase));
	
	  var RangeSink = (function () {
	    function RangeSink(observer, parent) {
	      this.observer = observer;
	      this.parent = parent;
	    }
	
	    RangeSink.prototype.run = function () {
	      var start = this.parent.start, count = this.parent.rangeCount, observer = this.observer;
	      function loopRecursive(i, recurse) {
	        if (i < count) {
	          observer.onNext(start + i);
	          recurse(i + 1);
	        } else {
	          observer.onCompleted();
	        }
	      }
	
	      return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	    };
	
	    return RangeSink;
	  }());
	
	  /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */
	  Observable.range = function (start, count, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RangeObservable(start, count, scheduler);
	  };
	
	  var RepeatObservable = (function(__super__) {
	    inherits(RepeatObservable, __super__);
	    function RepeatObservable(value, repeatCount, scheduler) {
	      this.value = value;
	      this.repeatCount = repeatCount == null ? -1 : repeatCount;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    RepeatObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RepeatSink(observer, this);
	      return sink.run();
	    };
	
	    return RepeatObservable;
	  }(ObservableBase));
	
	  function RepeatSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  RepeatSink.prototype.run = function () {
	    var observer = this.observer, value = this.parent.value;
	    function loopRecursive(i, recurse) {
	      if (i === -1 || i > 0) {
	        observer.onNext(value);
	        i > 0 && i--;
	      }
	      if (i === 0) { return observer.onCompleted(); }
	      recurse(i);
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(this.parent.repeatCount, loopRecursive);
	  };
	
	  /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */
	  Observable.repeat = function (value, repeatCount, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RepeatObservable(value, repeatCount, scheduler);
	  };
	
	  var JustObservable = (function(__super__) {
	    inherits(JustObservable, __super__);
	    function JustObservable(value, scheduler) {
	      this.value = value;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    JustObservable.prototype.subscribeCore = function (observer) {
	      var sink = new JustSink(observer, this.value, this.scheduler);
	      return sink.run();
	    };
	
	    function JustSink(observer, value, scheduler) {
	      this.observer = observer;
	      this.value = value;
	      this.scheduler = scheduler;
	    }
	
	    function scheduleItem(s, state) {
	      var value = state[0], observer = state[1];
	      observer.onNext(value);
	      observer.onCompleted();
	      return disposableEmpty;
	    }
	
	    JustSink.prototype.run = function () {
	      var state = [this.value, this.observer];
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.scheduleWithState(state, scheduleItem);
	    };
	
	    return JustObservable;
	  }(ObservableBase));
	
	  /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */
	  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new JustObservable(value, scheduler);
	  };
	
	  var ThrowObservable = (function(__super__) {
	    inherits(ThrowObservable, __super__);
	    function ThrowObservable(error, scheduler) {
	      this.error = error;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    ThrowObservable.prototype.subscribeCore = function (o) {
	      var sink = new ThrowSink(o, this);
	      return sink.run();
	    };
	
	    function ThrowSink(o, p) {
	      this.o = o;
	      this.p = p;
	    }
	
	    function scheduleItem(s, state) {
	      var e = state[0], o = state[1];
	      o.onError(e);
	    }
	
	    ThrowSink.prototype.run = function () {
	      return this.p.scheduler.scheduleWithState([this.p.error, this.o], scheduleItem);
	    };
	
	    return ThrowObservable;
	  }(ObservableBase));
	
	  /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */
	  var observableThrow = Observable['throw'] = function (error, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new ThrowObservable(error, scheduler);
	  };
	
	  /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */
	  Observable.using = function (resourceFactory, observableFactory) {
	    return new AnonymousObservable(function (o) {
	      var disposable = disposableEmpty;
	      var resource = tryCatch(resourceFactory)();
	      if (resource === errorObj) {
	        return new CompositeDisposable(observableThrow(resource.e).subscribe(o), disposable);
	      }
	      resource && (disposable = resource);
	      var source = tryCatch(observableFactory)(resource);
	      if (source === errorObj) {
	        return new CompositeDisposable(observableThrow(source.e).subscribe(o), disposable);
	      }
	      return new CompositeDisposable(source.subscribe(o), disposable);
	    });
	  };
	
	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */
	  observableProto.amb = function (rightSource) {
	    var leftSource = this;
	    return new AnonymousObservable(function (observer) {
	      var choice,
	        leftChoice = 'L', rightChoice = 'R',
	        leftSubscription = new SingleAssignmentDisposable(),
	        rightSubscription = new SingleAssignmentDisposable();
	
	      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));
	
	      function choiceL() {
	        if (!choice) {
	          choice = leftChoice;
	          rightSubscription.dispose();
	        }
	      }
	
	      function choiceR() {
	        if (!choice) {
	          choice = rightChoice;
	          leftSubscription.dispose();
	        }
	      }
	
	      var leftSubscribe = observerCreate(
	        function (left) {
	          choiceL();
	          choice === leftChoice && observer.onNext(left);
	        },
	        function (e) {
	          choiceL();
	          choice === leftChoice && observer.onError(e);
	        },
	        function () {
	          choiceL();
	          choice === leftChoice && observer.onCompleted();
	        }
	      );
	      var rightSubscribe = observerCreate(
	        function (right) {
	          choiceR();
	          choice === rightChoice && observer.onNext(right);
	        },
	        function (e) {
	          choiceR();
	          choice === rightChoice && observer.onError(e);
	        },
	        function () {
	          choiceR();
	          choice === rightChoice && observer.onCompleted();
	        }
	      );
	
	      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
	      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));
	
	      return new CompositeDisposable(leftSubscription, rightSubscription);
	    });
	  };
	
	  function amb(p, c) { return p.amb(c); }
	
	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */
	  Observable.amb = function () {
	    var acc = observableNever(), items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(items);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    for (var i = 0, len = items.length; i < len; i++) {
	      acc = amb(acc, items[i]);
	    }
	    return acc;
	  };
	
	  var CatchObserver = (function(__super__) {
	    inherits(CatchObserver, __super__);
	    function CatchObserver(o, s, fn) {
	      this._o = o;
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }
	
	    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
	    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
	    CatchObserver.prototype.error = function (e) {
	      var result = tryCatch(this._fn)(e);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      isPromise(result) && (result = observableFromPromise(result));
	
	      var d = new SingleAssignmentDisposable();
	      this._s.setDisposable(d);
	      d.setDisposable(result.subscribe(this._o));
	    };
	
	    return CatchObserver;
	  }(AbstractObserver));
	
	  function observableCatchHandler(source, handler) {
	    return new AnonymousObservable(function (o) {
	      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
	      subscription.setDisposable(d1);
	      d1.setDisposable(source.subscribe(new CatchObserver(o, subscription, handler)));
	      return subscription;
	    }, source);
	  }
	
	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */
	  observableProto['catch'] = function (handlerOrSecond) {
	    return isFunction(handlerOrSecond) ? observableCatchHandler(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
	  };
	
	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */
	  var observableCatch = Observable['catch'] = function () {
	    var items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(len);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    return enumerableOf(items).catchError();
	  };
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return combineLatest.apply(this, args);
	  };
	
	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   *
	   * @example
	   * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  var combineLatest = Observable.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    return new AnonymousObservable(function (o) {
	      var n = args.length,
	        hasValue = arrayInitialize(n, falseFactory),
	        hasValueAll = false,
	        isDone = arrayInitialize(n, falseFactory),
	        values = new Array(n);
	
	      function next(i) {
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          try {
	            var res = resultSelector.apply(null, values);
	          } catch (e) {
	            return o.onError(e);
	          }
	          o.onNext(res);
	        } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	          o.onCompleted();
	        }
	      }
	
	      function done (i) {
	        isDone[i] = true;
	        isDone.every(identity) && o.onCompleted();
	      }
	
	      var subscriptions = new Array(n);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var source = args[i], sad = new SingleAssignmentDisposable();
	          isPromise(source) && (source = observableFromPromise(source));
	          sad.setDisposable(source.subscribe(function (x) {
	              values[i] = x;
	              next(i);
	            },
	            function(e) { o.onError(e); },
	            function () { done(i); }
	          ));
	          subscriptions[i] = sad;
	        }(idx));
	      }
	
	      return new CompositeDisposable(subscriptions);
	    }, this);
	  };
	
	  /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  observableProto.concat = function () {
	    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    args.unshift(this);
	    return observableConcat.apply(null, args);
	  };
	
	  var ConcatObservable = (function(__super__) {
	    inherits(ConcatObservable, __super__);
	    function ConcatObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	
	    ConcatObservable.prototype.subscribeCore = function(o) {
	      var sink = new ConcatSink(this.sources, o);
	      return sink.run();
	    };
	
	    function ConcatSink(sources, o) {
	      this.sources = sources;
	      this.o = o;
	    }
	    ConcatSink.prototype.run = function () {
	      var isDisposed, subscription = new SerialDisposable(), sources = this.sources, length = sources.length, o = this.o;
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(0, function (i, self) {
	        if (isDisposed) { return; }
	        if (i === length) {
	          return o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = sources[i];
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(
	          function (x) { o.onNext(x); },
	          function (e) { o.onError(e); },
	          function () { self(i + 1); }
	        ));
	      });
	
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	
	
	    return ConcatObservable;
	  }(ObservableBase));
	
	  /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  var observableConcat = Observable.concat = function () {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      args = new Array(arguments.length);
	      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
	    }
	    return new ConcatObservable(args);
	  };
	
	  /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */
	  observableProto.concatAll = function () {
	    return this.merge(1);
	  };
	
	  var MergeObservable = (function (__super__) {
	    inherits(MergeObservable, __super__);
	
	    function MergeObservable(source, maxConcurrent) {
	      this.source = source;
	      this.maxConcurrent = maxConcurrent;
	      __super__.call(this);
	    }
	
	    MergeObservable.prototype.subscribeCore = function(observer) {
	      var g = new CompositeDisposable();
	      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
	      return g;
	    };
	
	    return MergeObservable;
	
	  }(ObservableBase));
	
	  var MergeObserver = (function () {
	    function MergeObserver(o, max, g) {
	      this.o = o;
	      this.max = max;
	      this.g = g;
	      this.done = false;
	      this.q = [];
	      this.activeCount = 0;
	      this.isStopped = false;
	    }
	    MergeObserver.prototype.handleSubscribe = function (xs) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(xs) && (xs = observableFromPromise(xs));
	      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeObserver.prototype.onNext = function (innerSource) {
	      if (this.isStopped) { return; }
	        if(this.activeCount < this.max) {
	          this.activeCount++;
	          this.handleSubscribe(innerSource);
	        } else {
	          this.q.push(innerSource);
	        }
	      };
	      MergeObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	        }
	      };
	      MergeObserver.prototype.onCompleted = function () {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.done = true;
	          this.activeCount === 0 && this.o.onCompleted();
	        }
	      };
	      MergeObserver.prototype.dispose = function() { this.isStopped = true; };
	      MergeObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	          return true;
	        }
	
	        return false;
	      };
	
	      function InnerObserver(parent, sad) {
	        this.parent = parent;
	        this.sad = sad;
	        this.isStopped = false;
	      }
	      InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.parent.o.onNext(x); } };
	      InnerObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	        }
	      };
	      InnerObserver.prototype.onCompleted = function () {
	        if(!this.isStopped) {
	          this.isStopped = true;
	          var parent = this.parent;
	          parent.g.remove(this.sad);
	          if (parent.q.length > 0) {
	            parent.handleSubscribe(parent.q.shift());
	          } else {
	            parent.activeCount--;
	            parent.done && parent.activeCount === 0 && parent.o.onCompleted();
	          }
	        }
	      };
	      InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	      InnerObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	          return true;
	        }
	
	        return false;
	      };
	
	      return MergeObserver;
	  }());
	
	
	
	
	
	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  *
	  * @example
	  * 1 - merged = sources.merge(1);
	  * 2 - merged = source.merge(otherSource);
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.merge = function (maxConcurrentOrOther) {
	    return typeof maxConcurrentOrOther !== 'number' ?
	      observableMerge(this, maxConcurrentOrOther) :
	      new MergeObservable(this, maxConcurrentOrOther);
	  };
	
	  /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */
	  var observableMerge = Observable.merge = function () {
	    var scheduler, sources = [], i, len = arguments.length;
	    if (!arguments[0]) {
	      scheduler = immediateScheduler;
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else if (isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else {
	      scheduler = immediateScheduler;
	      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
	    }
	    if (Array.isArray(sources[0])) {
	      sources = sources[0];
	    }
	    return observableOf(scheduler, sources).mergeAll();
	  };
	
	  var MergeAllObservable = (function (__super__) {
	    inherits(MergeAllObservable, __super__);
	
	    function MergeAllObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    MergeAllObservable.prototype.subscribeCore = function (observer) {
	      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
	      g.add(m);
	      m.setDisposable(this.source.subscribe(new MergeAllObserver(observer, g)));
	      return g;
	    };
	
	    function MergeAllObserver(o, g) {
	      this.o = o;
	      this.g = g;
	      this.isStopped = false;
	      this.done = false;
	    }
	    MergeAllObserver.prototype.onNext = function(innerSource) {
	      if(this.isStopped) { return; }
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeAllObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    MergeAllObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.done = true;
	        this.g.length === 1 && this.o.onCompleted();
	      }
	    };
	    MergeAllObserver.prototype.dispose = function() { this.isStopped = true; };
	    MergeAllObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if (!this.isStopped) { this.parent.o.onNext(x); } };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        var parent = this.parent;
	        this.isStopped = true;
	        parent.g.remove(this.sad);
	        parent.done && parent.g.length === 1 && parent.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return MergeAllObservable;
	  }(ObservableBase));
	
	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.mergeAll = function () {
	    return new MergeAllObservable(this);
	  };
	
	  var CompositeError = Rx.CompositeError = function(errors) {
	    this.name = "NotImplementedError";
	    this.innerErrors = errors;
	    this.message = 'This contains multiple errors. Check the innerErrors';
	    Error.call(this);
	  }
	  CompositeError.prototype = Error.prototype;
	
	  /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */
	  Observable.mergeDelayError = function() {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      var len = arguments.length;
	      args = new Array(len);
	      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    var source = observableOf(null, args);
	
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable(),
	        m = new SingleAssignmentDisposable(),
	        isStopped = false,
	        errors = [];
	
	      function setCompletion() {
	        if (errors.length === 0) {
	          o.onCompleted();
	        } else if (errors.length === 1) {
	          o.onError(errors[0]);
	        } else {
	          o.onError(new CompositeError(errors));
	        }
	      }
	
	      group.add(m);
	
	      m.setDisposable(source.subscribe(
	        function (innerSource) {
	          var innerSubscription = new SingleAssignmentDisposable();
	          group.add(innerSubscription);
	
	          // Check for promises support
	          isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	          innerSubscription.setDisposable(innerSource.subscribe(
	            function (x) { o.onNext(x); },
	            function (e) {
	              errors.push(e);
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	            },
	            function () {
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	          }));
	        },
	        function (e) {
	          errors.push(e);
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        },
	        function () {
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        }));
	      return group;
	    });
	  };
	
	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */
	  observableProto.onErrorResumeNext = function (second) {
	    if (!second) { throw new Error('Second observable is required'); }
	    return onErrorResumeNext([this, second]);
	  };
	
	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   *
	   * @example
	   * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
	   * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */
	  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
	    var sources = [];
	    if (Array.isArray(arguments[0])) {
	      sources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (observer) {
	      var pos = 0, subscription = new SerialDisposable(),
	      cancelable = immediateScheduler.scheduleRecursive(function (self) {
	        var current, d;
	        if (pos < sources.length) {
	          current = sources[pos++];
	          isPromise(current) && (current = observableFromPromise(current));
	          d = new SingleAssignmentDisposable();
	          subscription.setDisposable(d);
	          d.setDisposable(current.subscribe(observer.onNext.bind(observer), self, self));
	        } else {
	          observer.onCompleted();
	        }
	      });
	      return new CompositeDisposable(subscription, cancelable);
	    });
	  };
	
	  /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */
	  observableProto.skipUntil = function (other) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var isOpen = false;
	      var disposables = new CompositeDisposable(source.subscribe(function (left) {
	        isOpen && o.onNext(left);
	      }, function (e) { o.onError(e); }, function () {
	        isOpen && o.onCompleted();
	      }));
	
	      isPromise(other) && (other = observableFromPromise(other));
	
	      var rightSubscription = new SingleAssignmentDisposable();
	      disposables.add(rightSubscription);
	      rightSubscription.setDisposable(other.subscribe(function () {
	        isOpen = true;
	        rightSubscription.dispose();
	      }, function (e) { o.onError(e); }, function () {
	        rightSubscription.dispose();
	      }));
	
	      return disposables;
	    }, source);
	  };
	
	  var SwitchObservable = (function(__super__) {
	    inherits(SwitchObservable, __super__);
	    function SwitchObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    SwitchObservable.prototype.subscribeCore = function (o) {
	      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
	      return new CompositeDisposable(s, inner);
	    };
	
	    function SwitchObserver(o, inner) {
	      this.o = o;
	      this.inner = inner;
	      this.stopped = false;
	      this.latest = 0;
	      this.hasLatest = false;
	      this.isStopped = false;
	    }
	    SwitchObserver.prototype.onNext = function (innerSource) {
	      if (this.isStopped) { return; }
	      var d = new SingleAssignmentDisposable(), id = ++this.latest;
	      this.hasLatest = true;
	      this.inner.setDisposable(d);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	    };
	    SwitchObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    SwitchObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.stopped = true;
	        !this.hasLatest && this.o.onCompleted();
	      }
	    };
	    SwitchObserver.prototype.dispose = function () { this.isStopped = true; };
	    SwitchObserver.prototype.fail = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    function InnerObserver(parent, id) {
	      this.parent = parent;
	      this.id = id;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      this.parent.latest === this.id && this.parent.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.parent.latest === this.id && this.parent.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        if (this.parent.latest === this.id) {
	          this.parent.hasLatest = false;
	          this.parent.isStopped && this.parent.o.onCompleted();
	        }
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; }
	    InnerObserver.prototype.fail = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return SwitchObservable;
	  }(ObservableBase));
	
	  /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */
	  observableProto['switch'] = observableProto.switchLatest = function () {
	    return new SwitchObservable(this);
	  };
	
	  var TakeUntilObservable = (function(__super__) {
	    inherits(TakeUntilObservable, __super__);
	
	    function TakeUntilObservable(source, other) {
	      this.source = source;
	      this.other = isPromise(other) ? observableFromPromise(other) : other;
	      __super__.call(this);
	    }
	
	    TakeUntilObservable.prototype.subscribeCore = function(o) {
	      return new CompositeDisposable(
	        this.source.subscribe(o),
	        this.other.subscribe(new InnerObserver(o))
	      );
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      this.o.onCompleted();
	    };
	    InnerObserver.prototype.onError = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      !this.isStopped && (this.isStopped = true);
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return TakeUntilObservable;
	  }(ObservableBase));
	
	  /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */
	  observableProto.takeUntil = function (other) {
	    return new TakeUntilObservable(this, other);
	  };
	
	  function falseFactory() { return false; }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.withLatestFrom = function () {
	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = args.pop(), source = this;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    return new AnonymousObservable(function (observer) {
	      var n = args.length,
	        hasValue = arrayInitialize(n, falseFactory),
	        hasValueAll = false,
	        values = new Array(n);
	
	      var subscriptions = new Array(n + 1);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var other = args[i], sad = new SingleAssignmentDisposable();
	          isPromise(other) && (other = observableFromPromise(other));
	          sad.setDisposable(other.subscribe(function (x) {
	            values[i] = x;
	            hasValue[i] = true;
	            hasValueAll = hasValue.every(identity);
	          }, function (e) { observer.onError(e); }, noop));
	          subscriptions[i] = sad;
	        }(idx));
	      }
	
	      var sad = new SingleAssignmentDisposable();
	      sad.setDisposable(source.subscribe(function (x) {
	        var allValues = [x].concat(values);
	        if (!hasValueAll) { return; }
	        var res = tryCatch(resultSelector).apply(null, allValues);
	        if (res === errorObj) { return observer.onError(res.e); }
	        observer.onNext(res);
	      }, function (e) { observer.onError(e); }, function () {
	        observer.onCompleted();
	      }));
	      subscriptions[n] = sad;
	
	      return new CompositeDisposable(subscriptions);
	    }, this);
	  };
	
	  function falseFactory() { return false; }
	  function emptyArrayFactory() { return []; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */
	  observableProto.zip = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }
	
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    var parent = this;
	    args.unshift(parent);
	    return new AnonymousObservable(function (o) {
	      var n = args.length,
	        queues = arrayInitialize(n, emptyArrayFactory),
	        isDone = arrayInitialize(n, falseFactory);
	
	      var subscriptions = new Array(n);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var source = args[i], sad = new SingleAssignmentDisposable();
	
	          isPromise(source) && (source = observableFromPromise(source));
	
	          sad.setDisposable(source.subscribe(function (x) {
	            queues[i].push(x);
	            if (queues.every(function (x) { return x.length > 0; })) {
	              var queuedValues = queues.map(function (x) { return x.shift(); }),
	                  res = tryCatch(resultSelector).apply(parent, queuedValues);
	              if (res === errorObj) { return o.onError(res.e); }
	              o.onNext(res);
	            } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	              o.onCompleted();
	            }
	          }, function (e) { o.onError(e); }, function () {
	            isDone[i] = true;
	            isDone.every(identity) && o.onCompleted();
	          }));
	          subscriptions[i] = sad;
	        })(idx);
	      }
	
	      return new CompositeDisposable(subscriptions);
	    }, parent);
	  };
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  Observable.zip = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
	    }
	    var first = args.shift();
	    return first.zip.apply(first, args);
	  };
	
	function falseFactory() { return false; }
	function emptyArrayFactory() { return []; }
	function argumentsToArray() {
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  return args;
	}
	
	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	observableProto.zipIterable = function () {
	  if (arguments.length === 0) { throw new Error('invalid arguments'); }
	
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	
	  var parent = this;
	  args.unshift(parent);
	  return new AnonymousObservable(function (o) {
	    var n = args.length,
	      queues = arrayInitialize(n, emptyArrayFactory),
	      isDone = arrayInitialize(n, falseFactory);
	
	    var subscriptions = new Array(n);
	    for (var idx = 0; idx < n; idx++) {
	      (function (i) {
	        var source = args[i], sad = new SingleAssignmentDisposable();
	
	        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));
	
	        sad.setDisposable(source.subscribe(function (x) {
	          queues[i].push(x);
	          if (queues.every(function (x) { return x.length > 0; })) {
	            var queuedValues = queues.map(function (x) { return x.shift(); }),
	                res = tryCatch(resultSelector).apply(parent, queuedValues);
	            if (res === errorObj) { return o.onError(res.e); }
	            o.onNext(res);
	          } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	            o.onCompleted();
	          }
	        }, function (e) { o.onError(e); }, function () {
	          isDone[i] = true;
	          isDone.every(identity) && o.onCompleted();
	        }));
	        subscriptions[i] = sad;
	      })(idx);
	    }
	
	    return new CompositeDisposable(subscriptions);
	  }, parent);
	};
	
	  function asObservable(source) {
	    return function subscribe(o) { return source.subscribe(o); };
	  }
	
	  /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */
	  observableProto.asObservable = function () {
	    return new AnonymousObservable(asObservable(this), this);
	  };
	
	  function toArray(x) { return x.toArray(); }
	  function notEmpty(x) { return x.length > 0; }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithCount = function (count, skip) {
	    typeof skip !== 'number' && (skip = count);
	    return this.windowWithCount(count, skip)
	      .flatMap(toArray)
	      .filter(notEmpty);
	  };
	
	  /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */
	  observableProto.dematerialize = function () {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(function (x) { return x.accept(o); }, function(e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, this);
	  };
	
	  var DistinctUntilChangedObservable = (function(__super__) {
	    inherits(DistinctUntilChangedObservable, __super__);
	    function DistinctUntilChangedObservable(source, keyFn, comparer) {
	      this.source = source;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      __super__.call(this);
	    }
	
	    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
	    };
	
	    return DistinctUntilChangedObservable;
	  }(ObservableBase));
	
	  var DistinctUntilChangedObserver = (function(__super__) {
	    inherits(DistinctUntilChangedObserver, __super__);
	    function DistinctUntilChangedObserver(o, keyFn, comparer) {
	      this.o = o;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      this.hasCurrentKey = false;
	      this.currentKey = null;
	      __super__.call(this);
	    }
	
	    DistinctUntilChangedObserver.prototype.next = function (x) {
	      var key = x, comparerEquals;
	      if (isFunction(this.keyFn)) {
	        key = tryCatch(this.keyFn)(x);
	        if (key === errorObj) { return this.o.onError(key.e); }
	      }
	      if (this.hasCurrentKey) {
	        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
	        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
	      }
	      if (!this.hasCurrentKey || !comparerEquals) {
	        this.hasCurrentKey = true;
	        this.currentKey = key;
	        this.o.onNext(x);
	      }
	    };
	    DistinctUntilChangedObserver.prototype.error = function(e) {
	      this.o.onError(e);
	    };
	    DistinctUntilChangedObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };
	
	    return DistinctUntilChangedObserver;
	  }(AbstractObserver));
	
	  /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */
	  observableProto.distinctUntilChanged = function (keyFn, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctUntilChangedObservable(this, keyFn, comparer);
	  };
	
	  var TapObservable = (function(__super__) {
	    inherits(TapObservable,__super__);
	    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	      this.source = source;
	      this._oN = observerOrOnNext;
	      this._oE = onError;
	      this._oC = onCompleted;
	      __super__.call(this);
	    }
	
	    TapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this));
	    };
	
	    function InnerObserver(o, p) {
	      this.o = o;
	      this.t = !p._oN || isFunction(p._oN) ?
	        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
	        p._oN;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var res = tryCatch(this.t.onNext).call(this.t, x);
	      if (res === errorObj) { this.o.onError(res.e); }
	      this.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function(err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        var res = tryCatch(this.t.onError).call(this.t, err);
	        if (res === errorObj) { return this.o.onError(res.e); }
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function() {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        var res = tryCatch(this.t.onCompleted).call(this.t);
	        if (res === errorObj) { return this.o.onError(res.e); }
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return TapObservable;
	  }(ObservableBase));
	
	  /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
	    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
	  };
	
	  /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
	    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
	  };
	
	  /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
	    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
	  };
	
	  /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
	    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
	  };
	
	  /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */
	  observableProto['finally'] = function (action) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var subscription = tryCatch(source.subscribe).call(source, observer);
	      if (subscription === errorObj) {
	        action();
	        return thrower(subscription.e);
	      }
	      return disposableCreate(function () {
	        var r = tryCatch(subscription.dispose).call(subscription);
	        action();
	        r === errorObj && thrower(r.e);
	      });
	    }, this);
	  };
	
	  var IgnoreElementsObservable = (function(__super__) {
	    inherits(IgnoreElementsObservable, __super__);
	
	    function IgnoreElementsObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = noop;
	    InnerObserver.prototype.onError = function (err) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.observer.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return IgnoreElementsObservable;
	  }(ObservableBase));
	
	  /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */
	  observableProto.ignoreElements = function () {
	    return new IgnoreElementsObservable(this);
	  };
	
	  /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */
	  observableProto.materialize = function () {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      return source.subscribe(function (value) {
	        observer.onNext(notificationCreateOnNext(value));
	      }, function (e) {
	        observer.onNext(notificationCreateOnError(e));
	        observer.onCompleted();
	      }, function () {
	        observer.onNext(notificationCreateOnCompleted());
	        observer.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */
	  observableProto.repeat = function (repeatCount) {
	    return enumerableRepeat(this, repeatCount).concat();
	  };
	
	  /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retry = function (retryCount) {
	    return enumerableRepeat(this, retryCount).catchError();
	  };
	
	  /**
	   *  Repeats the source observable sequence upon error each time the notifier emits or until it successfully terminates. 
	   *  if the notifier completes, the observable sequence completes.
	   *
	   * @example
	   *  var timer = Observable.timer(500);
	   *  var source = observable.retryWhen(timer);
	   * @param {Observable} [notifier] An observable that triggers the retries or completes the observable with onNext or onCompleted respectively.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retryWhen = function (notifier) {
	    return enumerableRepeat(this).catchErrorWhen(notifier);
	  };
	  var ScanObservable = (function(__super__) {
	    inherits(ScanObservable, __super__);
	    function ScanObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }
	
	    ScanObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o,this));
	    };
	
	    return ScanObservable;
	  }(ObservableBase));
	
	  function InnerObserver(o, parent) {
	    this.o = o;
	    this.accumulator = parent.accumulator;
	    this.hasSeed = parent.hasSeed;
	    this.seed = parent.seed;
	    this.hasAccumulation = false;
	    this.accumulation = null;
	    this.hasValue = false;
	    this.isStopped = false;
	  }
	  InnerObserver.prototype = {
	    onNext: function (x) {
	      if (this.isStopped) { return; }
	      !this.hasValue && (this.hasValue = true);
	      if (this.hasAccumulation) {
	        this.accumulation = tryCatch(this.accumulator)(this.accumulation, x);
	      } else {
	        this.accumulation = this.hasSeed ? tryCatch(this.accumulator)(this.seed, x) : x;
	        this.hasAccumulation = true;
	      }
	      if (this.accumulation === errorObj) { return this.o.onError(this.accumulation.e); }
	      this.o.onNext(this.accumulation);
	    },
	    onError: function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    },
	    onCompleted: function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        !this.hasValue && this.hasSeed && this.o.onNext(this.seed);
	        this.o.onCompleted();
	      }
	    },
	    dispose: function() { this.isStopped = true; },
	    fail: function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    }
	  };
	
	  /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */
	  observableProto.scan = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ScanObservable(this, accumulator, hasSeed, seed);
	  };
	
	  /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */
	  observableProto.skipLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && o.onNext(q.shift());
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */
	  observableProto.startWith = function () {
	    var values, scheduler, start = 0;
	    if (!!arguments.length && isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      start = 1;
	    } else {
	      scheduler = immediateScheduler;
	    }
	    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    return enumerableOf([observableFromArray(args, scheduler), this]).concat();
	  };
	
	  /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && q.shift();
	      }, function (e) { o.onError(e); }, function () {
	        while (q.length > 0) { o.onNext(q.shift()); }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLastBuffer = function (count) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && q.shift();
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(q);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   *
	   *  var res = xs.windowWithCount(10);
	   *  var res = xs.windowWithCount(10, 1);
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithCount = function (count, skip) {
	    var source = this;
	    +count || (count = 0);
	    Math.abs(count) === Infinity && (count = 0);
	    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
	    skip == null && (skip = count);
	    +skip || (skip = 0);
	    Math.abs(skip) === Infinity && (skip = 0);
	
	    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(),
	        refCountDisposable = new RefCountDisposable(m),
	        n = 0,
	        q = [];
	
	      function createWindow () {
	        var s = new Subject();
	        q.push(s);
	        observer.onNext(addRef(s, refCountDisposable));
	      }
	
	      createWindow();
	
	      m.setDisposable(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	          var c = n - count + 1;
	          c >= 0 && c % skip === 0 && q.shift().onCompleted();
	          ++n % skip === 0 && createWindow();
	        },
	        function (e) {
	          while (q.length > 0) { q.shift().onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          while (q.length > 0) { q.shift().onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  function concatMap(source, selector, thisArg) {
	    var selectorFunc = bindCallback(selector, thisArg, 3);
	    return source.map(function (x, i) {
	      var result = selectorFunc(x, i, source);
	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	      return result;
	    }).concatAll();
	  }
	
	  /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */
	  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
	    if (isFunction(selector) && isFunction(resultSelector)) {
	      return this.concatMap(function (x, i) {
	        var selectorResult = selector(x, i);
	        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
	        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
	
	        return selectorResult.map(function (y, i2) {
	          return resultSelector(x, y, i, i2);
	        });
	      });
	    }
	    return isFunction(selector) ?
	      concatMap(this, selector, thisArg) :
	      concatMap(this, function () { return selector; });
	  };
	
	  /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
	    var source = this,
	        onNextFunc = bindCallback(onNext, thisArg, 2),
	        onErrorFunc = bindCallback(onError, thisArg, 1),
	        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNextFunc(x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onErrorFunc(err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompletedFunc();
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, this).concatAll();
	  };
	
	    /**
	     *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	     *
	     *  var res = obs = xs.defaultIfEmpty();
	     *  2 - obs = xs.defaultIfEmpty(false);
	     *
	     * @memberOf Observable#
	     * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	     * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	     */
	    observableProto.defaultIfEmpty = function (defaultValue) {
	      var source = this;
	      defaultValue === undefined && (defaultValue = null);
	      return new AnonymousObservable(function (observer) {
	        var found = false;
	        return source.subscribe(function (x) {
	          found = true;
	          observer.onNext(x);
	        },
	        function (e) { observer.onError(e); }, 
	        function () {
	          !found && observer.onNext(defaultValue);
	          observer.onCompleted();
	        });
	      }, source);
	    };
	
	  // Swap out for Array.findIndex
	  function arrayIndexOfComparer(array, item, comparer) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (comparer(array[i], item)) { return i; }
	    }
	    return -1;
	  }
	
	  function HashSet(comparer) {
	    this.comparer = comparer;
	    this.set = [];
	  }
	  HashSet.prototype.push = function(value) {
	    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
	    retValue && this.set.push(value);
	    return retValue;
	  };
	
	  /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */
	  observableProto.distinct = function (keySelector, comparer) {
	    var source = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var hashSet = new HashSet(comparer);
	      return source.subscribe(function (x) {
	        var key = x;
	
	        if (keySelector) {
	          try {
	            key = keySelector(x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	        }
	        hashSet.push(key) && o.onNext(x);
	      },
	      function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, this);
	  };
	
	  /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */
	  observableProto.groupBy = function (keySelector, elementSelector) {
	    return this.groupByUntil(keySelector, elementSelector, observableNever);
	  };
	
	    /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */
	    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
	      var source = this;
	      return new AnonymousObservable(function (o) {
	        var map = new Map(),
	          groupDisposable = new CompositeDisposable(),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          handleError = function (e) { return function (item) { item.onError(e); }; };
	
	        groupDisposable.add(
	          source.subscribe(function (x) {
	            var key = tryCatch(keySelector)(x);
	            if (key === errorObj) {
	              map.forEach(handleError(key.e));
	              return o.onError(key.e);
	            }
	
	            var fireNewMapEntry = false, writer = map.get(key);
	            if (writer === undefined) {
	              writer = new Subject();
	              map.set(key, writer);
	              fireNewMapEntry = true;
	            }
	
	            if (fireNewMapEntry) {
	              var group = new GroupedObservable(key, writer, refCountDisposable),
	                durationGroup = new GroupedObservable(key, writer);
	              var duration = tryCatch(durationSelector)(durationGroup);
	              if (duration === errorObj) {
	                map.forEach(handleError(duration.e));
	                return o.onError(duration.e);
	              }
	
	              o.onNext(group);
	
	              var md = new SingleAssignmentDisposable();
	              groupDisposable.add(md);
	
	              md.setDisposable(duration.take(1).subscribe(
	                noop,
	                function (e) {
	                  map.forEach(handleError(e));
	                  o.onError(e);
	                },
	                function () {
	                  if (map['delete'](key)) { writer.onCompleted(); }
	                  groupDisposable.remove(md);
	                }));
	            }
	
	            var element = x;
	            if (isFunction(elementSelector)) {
	              element = tryCatch(elementSelector)(x);
	              if (element === errorObj) {
	                map.forEach(handleError(element.e));
	                return o.onError(element.e);
	              }
	            }
	
	            writer.onNext(element);
	        }, function (e) {
	          map.forEach(handleError(e));
	          o.onError(e);
	        }, function () {
	          map.forEach(function (item) { item.onCompleted(); });
	          o.onCompleted();
	        }));
	
	      return refCountDisposable;
	    }, source);
	  };
	
	  var MapObservable = (function (__super__) {
	    inherits(MapObservable, __super__);
	
	    function MapObservable(source, selector, thisArg) {
	      this.source = source;
	      this.selector = bindCallback(selector, thisArg, 3);
	      __super__.call(this);
	    }
	
	    function innerMap(selector, self) {
	      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); }
	    }
	
	    MapObservable.prototype.internalMap = function (selector, thisArg) {
	      return new MapObservable(this.source, innerMap(selector, this), thisArg);
	    };
	
	    MapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this));
	    };
	
	    function InnerObserver(o, selector, source) {
	      this.o = o;
	      this.selector = selector;
	      this.source = source;
	      this.i = 0;
	      this.isStopped = false;
	    }
	
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var result = tryCatch(this.selector)(x, this.i++, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }
	      this.o.onNext(result);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return MapObservable;
	
	  }(ObservableBase));
	
	  /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */
	  observableProto.map = observableProto.select = function (selector, thisArg) {
	    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
	    return this instanceof MapObservable ?
	      this.internalMap(selectorFn, thisArg) :
	      new MapObservable(this, selectorFn, thisArg);
	  };
	
	  function plucker(args, len) {
	    return function mapper(x) {
	      var currentProp = x;
	      for (var i = 0; i < len; i++) {
	        var p = currentProp[args[i]];
	        if (typeof p !== 'undefined') {
	          currentProp = p;
	        } else {
	          return undefined;
	        }
	      }
	      return currentProp;
	    }
	  }
	
	  /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */
	  observableProto.pluck = function () {
	    var len = arguments.length, args = new Array(len);
	    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return this.map(plucker(args, len));
	  };
	
	observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
	};
	
	
	//
	//Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	//    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	//};
	//
	
	  /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNext.call(thisArg, x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onError.call(thisArg, err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompleted.call(thisArg);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, source).mergeAll();
	  };
	
	Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
	};
	  var SkipObservable = (function(__super__) {
	    inherits(SkipObservable, __super__);
	    function SkipObservable(source, count) {
	      this.source = source;
	      this.skipCount = count;
	      __super__.call(this);
	    }
	    
	    SkipObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.skipCount));
	    };
	    
	    function InnerObserver(o, c) {
	      this.c = c;
	      this.r = c;
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      if (this.r <= 0) { 
	        this.o.onNext(x);
	      } else {
	        this.r--;
	      }
	    };
	    InnerObserver.prototype.onError = function(e) {
	      if (!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function() {
	      if (!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function(e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	    
	    return SkipObservable;
	  }(ObservableBase));  
	  
	  /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */
	  observableProto.skip = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipObservable(this, count);
	  };
	  /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */
	  observableProto.skipWhile = function (predicate, thisArg) {
	    var source = this,
	        callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0, running = false;
	      return source.subscribe(function (x) {
	        if (!running) {
	          try {
	            running = !callback(x, i++, source);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	        }
	        running && o.onNext(x);
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   *
	   *  var res = source.take(5);
	   *  var res = source.take(0, Rx.Scheduler.timeout);
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */
	  observableProto.take = function (count, scheduler) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    if (count === 0) { return observableEmpty(scheduler); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var remaining = count;
	      return source.subscribe(function (x) {
	        if (remaining-- > 0) {
	          o.onNext(x);
	          remaining <= 0 && o.onCompleted();
	        }
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */
	  observableProto.takeWhile = function (predicate, thisArg) {
	    var source = this,
	        callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0, running = true;
	      return source.subscribe(function (x) {
	        if (running) {
	          try {
	            running = callback(x, i++, source);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	          if (running) {
	            o.onNext(x);
	          } else {
	            o.onCompleted();
	          }
	        }
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  var FilterObservable = (function (__super__) {
	    inherits(FilterObservable, __super__);
	
	    function FilterObservable(source, predicate, thisArg) {
	      this.source = source;
	      this.predicate = bindCallback(predicate, thisArg, 3);
	      __super__.call(this);
	    }
	
	    FilterObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
	    };
	    
	    function innerPredicate(predicate, self) {
	      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
	    }
	
	    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
	      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
	    };
	    
	    function InnerObserver(o, predicate, source) {
	      this.o = o;
	      this.predicate = predicate;
	      this.source = source;
	      this.i = 0;
	      this.isStopped = false;
	    }
	  
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
	      if (shouldYield === errorObj) {
	        return this.o.onError(shouldYield.e);
	      }
	      shouldYield && this.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return FilterObservable;
	
	  }(ObservableBase));
	
	  /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */
	  observableProto.filter = observableProto.where = function (predicate, thisArg) {
	    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
	      new FilterObservable(this, predicate, thisArg);
	  };
	
	  function extremaBy(source, keySelector, comparer) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = false, lastKey = null, list = [];
	      return source.subscribe(function (x) {
	        var comparison, key;
	        try {
	          key = keySelector(x);
	        } catch (ex) {
	          o.onError(ex);
	          return;
	        }
	        comparison = 0;
	        if (!hasValue) {
	          hasValue = true;
	          lastKey = key;
	        } else {
	          try {
	            comparison = comparer(key, lastKey);
	          } catch (ex1) {
	            o.onError(ex1);
	            return;
	          }
	        }
	        if (comparison > 0) {
	          lastKey = key;
	          list = [];
	        }
	        if (comparison >= 0) { list.push(x); }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(list);
	        o.onCompleted();
	      });
	    }, source);
	  }
	
	  function firstOnly(x) {
	    if (x.length === 0) { throw new EmptyError(); }
	    return x[0];
	  }
	
	  var ReduceObservable = (function(__super__) {
	    inherits(ReduceObservable, __super__);
	    function ReduceObservable(source, acc, hasSeed, seed) {
	      this.source = source;
	      this.acc = acc;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }
	
	    ReduceObservable.prototype.subscribeCore = function(observer) {
	      return this.source.subscribe(new InnerObserver(observer,this));
	    };
	
	    function InnerObserver(o, parent) {
	      this.o = o;
	      this.acc = parent.acc;
	      this.hasSeed = parent.hasSeed;
	      this.seed = parent.seed;
	      this.hasAccumulation = false;
	      this.result = null;
	      this.hasValue = false;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      !this.hasValue && (this.hasValue = true);
	      if (this.hasAccumulation) {
	        this.result = tryCatch(this.acc)(this.result, x);
	      } else {
	        this.result = this.hasSeed ? tryCatch(this.acc)(this.seed, x) : x;
	        this.hasAccumulation = true;
	      }
	      if (this.result === errorObj) { this.o.onError(this.result.e); }
	    };
	    InnerObserver.prototype.onError = function (e) { 
	      if (!this.isStopped) { this.isStopped = true; this.o.onError(e); } 
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.hasValue && this.o.onNext(this.result);
	        !this.hasValue && this.hasSeed && this.o.onNext(this.seed);
	        !this.hasValue && !this.hasSeed && this.o.onError(new EmptyError());
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; };
	    InnerObserver.prototype.fail = function(e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return ReduceObservable;
	  }(ObservableBase));
	
	  /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */
	  observableProto.reduce = function (accumulator) {
	    var hasSeed = false;
	    if (arguments.length === 2) {
	      hasSeed = true;
	      var seed = arguments[1];
	    }
	    return new ReduceObservable(this, accumulator, hasSeed, seed);
	  };
	
	  var SomeObserver = (function (__super__) {
	    inherits(SomeObserver, __super__);
	
	    function SomeObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    SomeObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (Boolean(result)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SomeObserver.prototype.completed = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	
	    return SomeObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */
	  observableProto.some = function (predicate, thisArg) {
	    var source = this, fn = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new SomeObserver(o, fn, source));
	    });
	  };
	
	  var IsEmptyObserver = (function(__super__) {
	    inherits(IsEmptyObserver, __super__);
	    function IsEmptyObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }
	
	    IsEmptyObserver.prototype.next = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
	    IsEmptyObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };
	
	    return IsEmptyObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */
	  observableProto.isEmpty = function () {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new IsEmptyObserver(o));
	    }, source);
	  };
	
	  var EveryObserver = (function (__super__) {
	    inherits(EveryObserver, __super__);
	
	    function EveryObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    EveryObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (!Boolean(result)) {
	        this._o.onNext(false);
	        this._o.onCompleted();
	      }
	    };
	    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
	    EveryObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };
	
	    return EveryObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */
	  observableProto.every = function (predicate, thisArg) {
	    var source = this, fn = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new EveryObserver(o, fn, source));
	    }, this);
	  };
	
	  /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */
	  observableProto.includes = function (searchElement, fromIndex) {
	    var source = this;
	    function comparer(a, b) {
	      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
	    }
	    return new AnonymousObservable(function (o) {
	      var i = 0, n = +fromIndex || 0;
	      Math.abs(n) === Infinity && (n = 0);
	      if (n < 0) {
	        o.onNext(false);
	        o.onCompleted();
	        return disposableEmpty;
	      }
	      return source.subscribe(
	        function (x) {
	          if (i++ >= n && comparer(x, searchElement)) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(false);
	          o.onCompleted();
	        });
	    }, this);
	  };
	
	  /**
	   * @deprecated use #includes instead.
	   */
	  observableProto.contains = function (searchElement, fromIndex) {
	    //deprecate('contains', 'includes');
	    observableProto.includes(searchElement, fromIndex);
	  };
	
	  /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */
	  observableProto.count = function (predicate, thisArg) {
	    return predicate ?
	      this.filter(predicate, thisArg).count() :
	      this.reduce(function (count) { return count + 1; }, 0);
	  };
	
	  /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.indexOf = function(searchElement, fromIndex) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var i = 0, n = +fromIndex || 0;
	      Math.abs(n) === Infinity && (n = 0);
	      if (n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }
	      return source.subscribe(
	        function (x) {
	          if (i >= n && x === searchElement) {
	            o.onNext(i);
	            o.onCompleted();
	          }
	          i++;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(-1);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */
	  observableProto.sum = function (keySelector, thisArg) {
	    return keySelector && isFunction(keySelector) ?
	      this.map(keySelector, thisArg).sum() :
	      this.reduce(function (prev, curr) { return prev + curr; }, 0);
	  };
	
	  /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */
	  observableProto.minBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return extremaBy(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
	  };
	
	  /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */
	  observableProto.min = function (comparer) {
	    return this.minBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };
	
	  /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */
	  observableProto.maxBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return extremaBy(this, keySelector, comparer);
	  };
	
	  /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */
	  observableProto.max = function (comparer) {
	    return this.maxBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };
	
	  var AverageObserver = (function(__super__) {
	    inherits(AverageObserver, __super__);
	    function AverageObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._c = 0;
	      this._t = 0;
	      __super__.call(this);
	    }
	
	    AverageObserver.prototype.next = function (x) {
	      if(this._fn) {
	        var r = tryCatch(this._fn)(x, this._c++, this._s);
	        if (r === errorObj) { return this._o.onError(r.e); }
	        this._t += r;
	      } else {
	        this._c++;
	        this._t += x;
	      }
	    };
	    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
	    AverageObserver.prototype.completed = function () {
	      if (this._c === 0) { return this._o.onError(new EmptyError()); }
	      this._o.onNext(this._t / this._c);
	      this._o.onCompleted();
	    };
	
	    return AverageObserver;
	  }(AbstractObserver));
	
	  /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */
	  observableProto.average = function (keySelector, thisArg) {
	    var source = this, fn;
	    if (isFunction(keySelector)) {
	      fn = bindCallback(keySelector, thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new AverageObserver(o, fn, source));
	    }, source);
	  };
	
	  /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */
	  observableProto.sequenceEqual = function (second, comparer) {
	    var first = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var donel = false, doner = false, ql = [], qr = [];
	      var subscription1 = first.subscribe(function (x) {
	        var equal, v;
	        if (qr.length > 0) {
	          v = qr.shift();
	          try {
	            equal = comparer(v, x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (doner) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          ql.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        donel = true;
	        if (ql.length === 0) {
	          if (qr.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (doner) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	
	      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
	      isPromise(second) && (second = observableFromPromise(second));
	      var subscription2 = second.subscribe(function (x) {
	        var equal;
	        if (ql.length > 0) {
	          var v = ql.shift();
	          try {
	            equal = comparer(v, x);
	          } catch (exception) {
	            o.onError(exception);
	            return;
	          }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (donel) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          qr.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        doner = true;
	        if (qr.length === 0) {
	          if (ql.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (donel) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	      return new CompositeDisposable(subscription1, subscription2);
	    }, first);
	  };
	
	  /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */
	  observableProto.elementAt =  function (index, defaultValue) {
	    if (index < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var i = index;
	      return source.subscribe(
	        function (x) {
	          if (i-- === 0) {
	            o.onNext(x);
	            o.onCompleted();
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          if (defaultValue === undefined) {
	            o.onError(new ArgumentOutOfRangeError());
	          } else {
	            o.onNext(defaultValue);
	            o.onCompleted();
	          }
	      });
	    }, source);
	  };
	
	  /**
	   * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	   * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.single = function (predicate, thisArg) {
	    if (isFunction(predicate)) { return this.filter(predicate, thisArg).single(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var value, seenValue = false;
	      return source.subscribe(function (x) {
	        if (seenValue) {
	          o.onError(new Error('Sequence contains more than one element'));
	        } else {
	          value = x;
	          seenValue = true;
	        }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(value);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  var FirstObserver = (function(__super__) {
	    inherits(FirstObserver, __super__);
	    function FirstObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    FirstObserver.prototype.next = function (x) {
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        if (Boolean(res)) {
	          this._o.onNext(x);
	          this._o.onCompleted();
	        }
	      } else if (!this._obj.predicate) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
	    FirstObserver.prototype.completed = function () {
	      if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };
	
	    return FirstObserver;
	  }(AbstractObserver));
	
	  /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */
	  observableProto.first = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new FirstObserver(o, obj, source));
	    }, source);
	  };
	
	  /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.last = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      var value, seenValue = false, i = 0;
	      return source.subscribe(
	        function (x) {
	          if (obj.predicate) {
	            var res = tryCatch(obj.predicate)(x, i++, source);
	            if (res === errorObj) { return o.onError(res.e); }
	            if (res) {
	              seenValue = true;
	              value = x;
	            }
	          } else if (!obj.predicate) {
	            seenValue = true;
	            value = x;
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          if (seenValue) {
	            o.onNext(value);
	            o.onCompleted();
	          }
	          else if (obj.defaultValue === undefined) {
	            o.onError(new EmptyError());
	          } else {
	            o.onNext(obj.defaultValue);
	            o.onCompleted();
	          }
	        });
	    }, source);
	  };
	
	  function findValue (source, predicate, thisArg, yieldIndex) {
	    var callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0;
	      return source.subscribe(function (x) {
	        var shouldRun;
	        try {
	          shouldRun = callback(x, i, source);
	        } catch (e) {
	          o.onError(e);
	          return;
	        }
	        if (shouldRun) {
	          o.onNext(yieldIndex ? i : x);
	          o.onCompleted();
	        } else {
	          i++;
	        }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(yieldIndex ? -1 : undefined);
	        o.onCompleted();
	      });
	    }, source);
	  }
	
	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */
	  observableProto.find = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, false);
	  };
	
	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */
	  observableProto.findIndex = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, true);
	  };
	
	  /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */
	  observableProto.toSet = function () {
	    if (typeof root.Set === 'undefined') { throw new TypeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var s = new root.Set();
	      return source.subscribe(
	        function (x) { s.add(x); },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(s);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */
	  observableProto.toMap = function (keySelector, elementSelector) {
	    if (typeof root.Map === 'undefined') { throw new TypeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var m = new root.Map();
	      return source.subscribe(
	        function (x) {
	          var key;
	          try {
	            key = keySelector(x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	
	          var element = x;
	          if (elementSelector) {
	            try {
	              element = elementSelector(x);
	            } catch (e) {
	              o.onError(e);
	              return;
	            }
	          }
	
	          m.set(key, element);
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(m);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  Observable.wrap = function (fn) {
	    createObservable.__generatorFunction__ = fn;
	    return createObservable;
	
	    function createObservable() {
	      return Observable.spawn.call(this, fn.apply(this, arguments));
	    }
	  };
	
	  var spawn = Observable.spawn = function () {
	    var gen = arguments[0], self = this, args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	
	    return new AnonymousObservable(function (o) {
	      var g = new CompositeDisposable();
	
	      if (isFunction(gen)) { gen = gen.apply(self, args); }
	      if (!gen || !isFunction(gen.next)) {
	        o.onNext(gen);
	        return o.onCompleted();
	      }
	
	      processGenerator();
	
	      function processGenerator(res) {
	        var ret = tryCatch(gen.next).call(gen, res);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }
	
	      function onError(err) {
	        var ret = tryCatch(gen.next).call(gen, err);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }
	
	      function next(ret) {
	        if (ret.done) {
	          o.onNext(ret.value);
	          o.onCompleted();
	          return;
	        }
	        var value = toObservable.call(self, ret.value);
	        if (Observable.isObservable(value)) {
	          g.add(value.subscribe(processGenerator, onError));
	        } else {
	          onError(new TypeError('type not supported'));
	        }
	      }
	
	      return g;
	    });
	  }
	
	function toObservable(obj) {
	  if (!obj) { return obj; }
	  if (Observable.isObservable(obj)) { return obj; }
	  if (isPromise(obj)) { return Observable.fromPromise(obj); }
	  if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
	  if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
	  if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
	  if (isObject(obj)) {return objectToObservable.call(this, obj);}
	  return obj;
	}
	
	function arrayToObservable (obj) {
	  return Observable.from(obj)
	      .flatMap(toObservable)
	      .toArray();
	}
	
	function objectToObservable (obj) {
	  var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
	  for (var i = 0, len = keys.length; i < len; i++) {
	    var key = keys[i];
	    var observable = toObservable.call(this, obj[key]);
	
	    if(observable && Observable.isObservable(observable)) {
	      defer(observable, key);
	    } else {
	      results[key] = obj[key];
	    }
	  }
	
	  return Observable.forkJoin.apply(Observable, observables).map(function() {
	    return results;
	  });
	
	
	  function defer (observable, key) {
	    results[key] = undefined;
	    observables.push(observable.map(function (next) {
	      results[key] = next;
	    }));
	  }
	}
	
	function thunkToObservable(fn) {
	  var self = this;
	  return new AnonymousObservable(function (o) {
	    fn.call(self, function () {
	      var err = arguments[0], res = arguments[1];
	      if (err) { return o.onError(err); }
	      if (arguments.length > 2) {
	        var args = [];
	        for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	        res = args;
	      }
	      o.onNext(res);
	      o.onCompleted();
	    });
	  });
	}
	
	function isGenerator(obj) {
	  return isFunction (obj.next) && isFunction (obj.throw);
	}
	
	function isGeneratorFunction(obj) {
	  var ctor = obj.constructor;
	  if (!ctor) { return false; }
	  if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
	  return isGenerator(ctor.prototype);
	}
	
	  /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */
	  Observable.start = function (func, context, scheduler) {
	    return observableToAsync(func, context, scheduler)();
	  };
	
	  /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */
	  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return function () {
	      var args = arguments,
	        subject = new AsyncSubject();
	
	      scheduler.schedule(function () {
	        var result;
	        try {
	          result = func.apply(context, args);
	        } catch (e) {
	          subject.onError(e);
	          return;
	        }
	        subject.onNext(result);
	        subject.onCompleted();
	      });
	      return subject.asObservable();
	    };
	  };
	
	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();
	
	  args.push(createCbHandler(o, ctx, selector));
	  fn.apply(ctx, args);
	
	  return o.asObservable();
	}
	
	function createCbHandler(o, ctx, selector) {
	  return function handler () {
	    var len = arguments.length, results = new Array(len);
	    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }
	
	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }
	
	    o.onCompleted();
	  };
	}
	
	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	Observable.fromCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	
	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};
	
	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();
	
	  args.push(createNodeHandler(o, ctx, selector));
	  fn.apply(ctx, args);
	
	  return o.asObservable();
	}
	
	function createNodeHandler(o, ctx, selector) {
	  return function handler () {
	    var err = arguments[0];
	    if (err) { return o.onError(err); }
	
	    var len = arguments.length, results = [];
	    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }
	
	    if (isFunction(selector)) {
	      var results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }
	
	    o.onCompleted();
	  };
	}
	
	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	Observable.fromNodeCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};
	
	  function ListenDisposable(e, n, fn) {
	    this._e = e;
	    this._n = n;
	    this._fn = fn;
	    this._e.addEventListener(this._n, this._fn, false);
	    this.isDisposed = false;
	  }
	  ListenDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this._e.removeEventListener(this._n, this._fn, false);
	      this.isDisposed = true;
	    }
	  };
	
	  function createEventListener (el, eventName, handler) {
	    var disposables = new CompositeDisposable();
	
	    // Asume NodeList or HTMLCollection
	    var elemToString = Object.prototype.toString.call(el);
	    if (elemToString === '[object NodeList]' || elemToString === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler));
	      }
	    } else if (el) {
	      disposables.add(new ListenDisposable(el, eventName, handler));
	    }
	
	    return disposables;
	  }
	
	  /**
	   * Configuration option to determine whether to use native events only
	   */
	  Rx.config.useNativeEvents = false;
	
	  function eventHandler(o, selector) {
	    return function handler () {
	      var results = arguments[0];
	      if (isFunction(selector)) {
	        results = tryCatch(selector).apply(null, arguments);
	        if (results === errorObj) { return o.onError(results.e); }
	      }
	      o.onNext(results);
	    };
	  }
	
	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  Observable.fromEvent = function (element, eventName, selector) {
	    // Node.js specific
	    if (element.addListener) {
	      return fromEventPattern(
	        function (h) { element.addListener(eventName, h); },
	        function (h) { element.removeListener(eventName, h); },
	        selector);
	    }
	
	    // Use only if non-native events are allowed
	    if (!Rx.config.useNativeEvents) {
	      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	      if (typeof element.on === 'function' && typeof element.off === 'function') {
	        return fromEventPattern(
	          function (h) { element.on(eventName, h); },
	          function (h) { element.off(eventName, h); },
	          selector);
	      }
	    }
	
	    return new AnonymousObservable(function (o) {
	      return createEventListener(
	        element,
	        eventName,
	        eventHandler(o, selector));
	    }).publish().refCount();
	  };
	
	  /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @param {Scheduler} [scheduler] A scheduler used to schedule the remove handler.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */
	  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new AnonymousObservable(function (o) {
	      function innerHandler () {
	        var result = arguments[0];
	        if (isFunction(selector)) {
	          result = tryCatch(selector).apply(null, arguments);
	          if (result === errorObj) { return o.onError(result.e); }
	        }
	        o.onNext(result);
	      }
	
	      var returnValue = addHandler(innerHandler);
	      return disposableCreate(function () {
	        isFunction(removeHandler) && removeHandler(innerHandler, returnValue);
	      });
	    }).publish().refCount();
	  };
	
	  /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */
	  Observable.startAsync = function (functionAsync) {
	    var promise;
	    try {
	      promise = functionAsync();
	    } catch (e) {
	      return observableThrow(e);
	    }
	    return observableFromPromise(promise);
	  }
	
	  var PausableObservable = (function (__super__) {
	
	    inherits(PausableObservable, __super__);
	
	    function subscribe(observer) {
	      var conn = this.source.publish(),
	        subscription = conn.subscribe(observer),
	        connection = disposableEmpty;
	
	      var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
	        if (b) {
	          connection = conn.connect();
	        } else {
	          connection.dispose();
	          connection = disposableEmpty;
	        }
	      });
	
	      return new CompositeDisposable(subscription, connection, pausable);
	    }
	
	    function PausableObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	
	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }
	
	      __super__.call(this, subscribe, source);
	    }
	
	    PausableObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };
	
	    PausableObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };
	
	    return PausableObservable;
	
	  }(Observable));
	
	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausable = function (pauser) {
	    return new PausableObservable(this, pauser);
	  };
	
	  function combineLatestSource(source, subject, resultSelector) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = [false, false],
	        hasValueAll = false,
	        isDone = false,
	        values = new Array(2),
	        err;
	
	      function next(x, i) {
	        values[i] = x;
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          if (err) { return o.onError(err); }
	          var res = tryCatch(resultSelector).apply(null, values);
	          if (res === errorObj) { return o.onError(res.e); }
	          o.onNext(res);
	        }
	        isDone && values[1] && o.onCompleted();
	      }
	
	      return new CompositeDisposable(
	        source.subscribe(
	          function (x) {
	            next(x, 0);
	          },
	          function (e) {
	            if (values[1]) {
	              o.onError(e);
	            } else {
	              err = e;
	            }
	          },
	          function () {
	            isDone = true;
	            values[1] && o.onCompleted();
	          }),
	        subject.subscribe(
	          function (x) {
	            next(x, 1);
	          },
	          function (e) { o.onError(e); },
	          function () {
	            isDone = true;
	            next(true, 1);
	          })
	        );
	    }, source);
	  }
	
	  var PausableBufferedObservable = (function (__super__) {
	
	    inherits(PausableBufferedObservable, __super__);
	
	    function subscribe(o) {
	      var q = [], previousShouldFire;
	
	      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }
	
	      var subscription =
	        combineLatestSource(
	          this.source,
	          this.pauser.startWith(false).distinctUntilChanged(),
	          function (data, shouldFire) {
	            return { data: data, shouldFire: shouldFire };
	          })
	          .subscribe(
	            function (results) {
	              if (previousShouldFire !== undefined && results.shouldFire != previousShouldFire) {
	                previousShouldFire = results.shouldFire;
	                // change in shouldFire
	                if (results.shouldFire) { drainQueue(); }
	              } else {
	                previousShouldFire = results.shouldFire;
	                // new data
	                if (results.shouldFire) {
	                  o.onNext(results.data);
	                } else {
	                  q.push(results.data);
	                }
	              }
	            },
	            function (err) {
	              drainQueue();
	              o.onError(err);
	            },
	            function () {
	              drainQueue();
	              o.onCompleted();
	            }
	          );
	      return subscription;
	    }
	
	    function PausableBufferedObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	
	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }
	
	      __super__.call(this, subscribe, source);
	    }
	
	    PausableBufferedObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };
	
	    PausableBufferedObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };
	
	    return PausableBufferedObservable;
	
	  }(Observable));
	
	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausableBuffered = function (subject) {
	    return new PausableBufferedObservable(this, subject);
	  };
	
	var ControlledObservable = (function (__super__) {
	
	  inherits(ControlledObservable, __super__);
	
	  function subscribe (observer) {
	    return this.source.subscribe(observer);
	  }
	
	  function ControlledObservable (source, enableQueue, scheduler) {
	    __super__.call(this, subscribe, source);
	    this.subject = new ControlledSubject(enableQueue, scheduler);
	    this.source = source.multicast(this.subject).refCount();
	  }
	
	  ControlledObservable.prototype.request = function (numberOfItems) {
	    return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
	  };
	
	  return ControlledObservable;
	
	}(Observable));
	
	var ControlledSubject = (function (__super__) {
	
	  function subscribe (observer) {
	    return this.subject.subscribe(observer);
	  }
	
	  inherits(ControlledSubject, __super__);
	
	  function ControlledSubject(enableQueue, scheduler) {
	    enableQueue == null && (enableQueue = true);
	
	    __super__.call(this, subscribe);
	    this.subject = new Subject();
	    this.enableQueue = enableQueue;
	    this.queue = enableQueue ? [] : null;
	    this.requestedCount = 0;
	    this.requestedDisposable = null;
	    this.error = null;
	    this.hasFailed = false;
	    this.hasCompleted = false;
	    this.scheduler = scheduler || currentThreadScheduler;
	  }
	
	  addProperties(ControlledSubject.prototype, Observer, {
	    onCompleted: function () {
	      this.hasCompleted = true;
	      if (!this.enableQueue || this.queue.length === 0) {
	        this.subject.onCompleted();
	        this.disposeCurrentRequest()
	      } else {
	        this.queue.push(Notification.createOnCompleted());
	      }
	    },
	    onError: function (error) {
	      this.hasFailed = true;
	      this.error = error;
	      if (!this.enableQueue || this.queue.length === 0) {
	        this.subject.onError(error);
	        this.disposeCurrentRequest()
	      } else {
	        this.queue.push(Notification.createOnError(error));
	      }
	    },
	    onNext: function (value) {
	      if (this.requestedCount <= 0) {
	        this.enableQueue && this.queue.push(Notification.createOnNext(value));
	      } else {
	        (this.requestedCount-- === 0) && this.disposeCurrentRequest();
	        this.subject.onNext(value);
	      }
	    },
	    _processRequest: function (numberOfItems) {
	      if (this.enableQueue) {
	        while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
	          var first = this.queue.shift();
	          first.accept(this.subject);
	          if (first.kind === 'N') {
	            numberOfItems--;
	          } else {
	            this.disposeCurrentRequest();
	            this.queue = [];
	          }
	        }
	      }
	
	      return numberOfItems;
	    },
	    request: function (number) {
	      this.disposeCurrentRequest();
	      var self = this;
	
	      this.requestedDisposable = this.scheduler.scheduleWithState(number,
	      function(s, i) {
	        var remaining = self._processRequest(i);
	        var stopped = self.hasCompleted || self.hasFailed
	        if (!stopped && remaining > 0) {
	          self.requestedCount = remaining;
	
	          return disposableCreate(function () {
	            self.requestedCount = 0;
	          });
	            // Scheduled item is still in progress. Return a new
	            // disposable to allow the request to be interrupted
	            // via dispose.
	        }
	      });
	
	      return this.requestedDisposable;
	    },
	    disposeCurrentRequest: function () {
	      if (this.requestedDisposable) {
	        this.requestedDisposable.dispose();
	        this.requestedDisposable = null;
	      }
	    }
	  });
	
	  return ControlledSubject;
	}(Observable));
	
	/**
	 * Attaches a controller to the observable sequence with the ability to queue.
	 * @example
	 * var source = Rx.Observable.interval(100).controlled();
	 * source.request(3); // Reads 3 values
	 * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	 * @param {Scheduler} scheduler determines how the requests will be scheduled
	 * @returns {Observable} The observable sequence which only propagates values on request.
	 */
	observableProto.controlled = function (enableQueue, scheduler) {
	
	  if (enableQueue && isScheduler(enableQueue)) {
	      scheduler = enableQueue;
	      enableQueue = true;
	  }
	
	  if (enableQueue == null) {  enableQueue = true; }
	  return new ControlledObservable(this, enableQueue, scheduler);
	};
	
	  var StopAndWaitObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      this.subscription = this.source.subscribe(new StopAndWaitObserver(observer, this, this.subscription));
	
	      var self = this;
	      timeoutScheduler.schedule(function () { self.source.request(1); });
	
	      return this.subscription;
	    }
	
	    inherits(StopAndWaitObservable, __super__);
	
	    function StopAndWaitObservable (source) {
	      __super__.call(this, subscribe, source);
	      this.source = source;
	    }
	
	    var StopAndWaitObserver = (function (__sub__) {
	
	      inherits(StopAndWaitObserver, __sub__);
	
	      function StopAndWaitObserver (observer, observable, cancel) {
	        __sub__.call(this);
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	      }
	
	      var stopAndWaitObserverProto = StopAndWaitObserver.prototype;
	
	      stopAndWaitObserverProto.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };
	
	      stopAndWaitObserverProto.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      }
	
	      stopAndWaitObserverProto.next = function (value) {
	        this.observer.onNext(value);
	
	        var self = this;
	        timeoutScheduler.schedule(function () {
	          self.observable.source.request(1);
	        });
	      };
	
	      stopAndWaitObserverProto.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };
	
	      return StopAndWaitObserver;
	    }(AbstractObserver));
	
	    return StopAndWaitObservable;
	  }(Observable));
	
	
	  /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */
	  ControlledObservable.prototype.stopAndWait = function () {
	    return new StopAndWaitObservable(this);
	  };
	
	  var WindowedObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      this.subscription = this.source.subscribe(new WindowedObserver(observer, this, this.subscription));
	
	      var self = this;
	      timeoutScheduler.schedule(function () {
	        self.source.request(self.windowSize);
	      });
	
	      return this.subscription;
	    }
	
	    inherits(WindowedObservable, __super__);
	
	    function WindowedObservable(source, windowSize) {
	      __super__.call(this, subscribe, source);
	      this.source = source;
	      this.windowSize = windowSize;
	    }
	
	    var WindowedObserver = (function (__sub__) {
	
	      inherits(WindowedObserver, __sub__);
	
	      function WindowedObserver(observer, observable, cancel) {
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.received = 0;
	      }
	
	      var windowedObserverPrototype = WindowedObserver.prototype;
	
	      windowedObserverPrototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };
	
	      windowedObserverPrototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };
	
	      windowedObserverPrototype.next = function (value) {
	        this.observer.onNext(value);
	
	        this.received = ++this.received % this.observable.windowSize;
	        if (this.received === 0) {
	          var self = this;
	          timeoutScheduler.schedule(function () {
	            self.observable.source.request(self.observable.windowSize);
	          });
	        }
	      };
	
	      windowedObserverPrototype.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };
	
	      return WindowedObserver;
	    }(AbstractObserver));
	
	    return WindowedObservable;
	  }(Observable));
	
	  /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */
	  ControlledObservable.prototype.windowed = function (windowSize) {
	    return new WindowedObservable(this, windowSize);
	  };
	
	  /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */
	  observableProto.pipe = function (dest) {
	    var source = this.pausableBuffered();
	
	    function onDrain() {
	      source.resume();
	    }
	
	    dest.addListener('drain', onDrain);
	
	    source.subscribe(
	      function (x) {
	        !dest.write(String(x)) && source.pause();
	      },
	      function (err) {
	        dest.emit('error', err);
	      },
	      function () {
	        // Hack check because STDIO is not closable
	        !dest._isStdio && dest.end();
	        dest.removeListener('drain', onDrain);
	      });
	
	    source.resume();
	
	    return dest;
	  };
	
	  /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
	    var source = this;
	    return typeof subjectOrSubjectSelector === 'function' ?
	      new AnonymousObservable(function (observer) {
	        var connectable = source.multicast(subjectOrSubjectSelector());
	        return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
	      }, source) :
	      new ConnectableObservable(source, subjectOrSubjectSelector);
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publish = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new Subject(); }, selector) :
	      this.multicast(new Subject());
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.share = function () {
	    return this.publish().refCount();
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishLast = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new AsyncSubject(); }, selector) :
	      this.multicast(new AsyncSubject());
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
	    return arguments.length === 2 ?
	      this.multicast(function () {
	        return new BehaviorSubject(initialValue);
	      }, initialValueOrSelector) :
	      this.multicast(new BehaviorSubject(initialValueOrSelector));
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareValue = function (initialValue) {
	    return this.publishValue(initialValue).refCount();
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
	      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *
	
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
	    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
	  };
	
	  var InnerSubscription = function (subject, observer) {
	    this.subject = subject;
	    this.observer = observer;
	  };
	
	  InnerSubscription.prototype.dispose = function () {
	    if (!this.subject.isDisposed && this.observer !== null) {
	      var idx = this.subject.observers.indexOf(this.observer);
	      this.subject.observers.splice(idx, 1);
	      this.observer = null;
	    }
	  };
	
	  /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */
	  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
	    function subscribe(observer) {
	      checkDisposed(this);
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        observer.onNext(this.value);
	        return new InnerSubscription(this, observer);
	      }
	      if (this.hasError) {
	        observer.onError(this.error);
	      } else {
	        observer.onCompleted();
	      }
	      return disposableEmpty;
	    }
	
	    inherits(BehaviorSubject, __super__);
	
	    /**
	     *  Initializes a new instance of the BehaviorSubject class which creates a subject that caches its last value and starts with the specified value.
	     *  @param {Mixed} value Initial value sent to observers when no other value has been received by the subject yet.
	     */
	    function BehaviorSubject(value) {
	      __super__.call(this, subscribe);
	      this.value = value,
	      this.observers = [],
	      this.isDisposed = false,
	      this.isStopped = false,
	      this.hasError = false;
	    }
	
	    addProperties(BehaviorSubject.prototype, Observer, {
	      /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */
	      getValue: function () {
	          checkDisposed(this);
	          if (this.hasError) {
	              throw this.error;
	          }
	          return this.value;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onCompleted();
	        }
	
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.hasError = true;
	        this.error = error;
	
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onError(error);
	        }
	
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onNext(value);
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.value = null;
	        this.exception = null;
	      }
	    });
	
	    return BehaviorSubject;
	  }(Observable));
	
	  /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */
	  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {
	
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	
	    function createRemovableDisposable(subject, observer) {
	      return disposableCreate(function () {
	        observer.dispose();
	        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	      });
	    }
	
	    function subscribe(observer) {
	      var so = new ScheduledObserver(this.scheduler, observer),
	        subscription = createRemovableDisposable(this, so);
	      checkDisposed(this);
	      this._trim(this.scheduler.now());
	      this.observers.push(so);
	
	      for (var i = 0, len = this.q.length; i < len; i++) {
	        so.onNext(this.q[i].value);
	      }
	
	      if (this.hasError) {
	        so.onError(this.error);
	      } else if (this.isStopped) {
	        so.onCompleted();
	      }
	
	      so.ensureActive();
	      return subscription;
	    }
	
	    inherits(ReplaySubject, __super__);
	
	    /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */
	    function ReplaySubject(bufferSize, windowSize, scheduler) {
	      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
	      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
	      this.scheduler = scheduler || currentThreadScheduler;
	      this.q = [];
	      this.observers = [];
	      this.isStopped = false;
	      this.isDisposed = false;
	      this.hasError = false;
	      this.error = null;
	      __super__.call(this, subscribe);
	    }
	
	    addProperties(ReplaySubject.prototype, Observer.prototype, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        return this.observers.length > 0;
	      },
	      _trim: function (now) {
	        while (this.q.length > this.bufferSize) {
	          this.q.shift();
	        }
	        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
	          this.q.shift();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        var now = this.scheduler.now();
	        this.q.push({ interval: now, value: value });
	        this._trim(now);
	
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onNext(value);
	          observer.ensureActive();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.error = error;
	        this.hasError = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onError(error);
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onCompleted();
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });
	
	    return ReplaySubject;
	  }(Observable));
	
	  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
	    inherits(ConnectableObservable, __super__);
	
	    function ConnectableObservable(source, subject) {
	      var hasSubscription = false,
	        subscription,
	        sourceObservable = source.asObservable();
	
	      this.connect = function () {
	        if (!hasSubscription) {
	          hasSubscription = true;
	          subscription = new CompositeDisposable(sourceObservable.subscribe(subject), disposableCreate(function () {
	            hasSubscription = false;
	          }));
	        }
	        return subscription;
	      };
	
	      __super__.call(this, function (o) { return subject.subscribe(o); });
	    }
	
	    ConnectableObservable.prototype.refCount = function () {
	      var connectableSubscription, count = 0, source = this;
	      return new AnonymousObservable(function (observer) {
	          var shouldConnect = ++count === 1,
	            subscription = source.subscribe(observer);
	          shouldConnect && (connectableSubscription = source.connect());
	          return function () {
	            subscription.dispose();
	            --count === 0 && connectableSubscription.dispose();
	          };
	      });
	    };
	
	    return ConnectableObservable;
	  }(Observable));
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */
	  observableProto.singleInstance = function() {
	    var source = this, hasObservable = false, observable;
	
	    function getObservable() {
	      if (!hasObservable) {
	        hasObservable = true;
	        observable = source.finally(function() { hasObservable = false; }).publish().refCount();
	      }
	      return observable;
	    };
	
	    return new AnonymousObservable(function(o) {
	      return getObservable().subscribe(o);
	    });
	  };
	
	  /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var leftDone = false, rightDone = false;
	      var leftId = 0, rightId = 0;
	      var leftMap = new Map(), rightMap = new Map();
	      var handleError = function (e) { o.onError(e); };
	
	      group.add(left.subscribe(
	        function (value) {
	          var id = leftId++, md = new SingleAssignmentDisposable();
	
	          leftMap.set(id, value);
	          group.add(md);
	
	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	              group.remove(md);
	            }));
	
	          rightMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(value, v);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          leftDone = true;
	          (rightDone || leftMap.size === 0) && o.onCompleted();
	        })
	      );
	
	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++, md = new SingleAssignmentDisposable();
	
	          rightMap.set(id, value);
	          group.add(md);
	
	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	              group.remove(md);
	            }));
	
	          leftMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(v, value);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          rightDone = true;
	          (leftDone || rightMap.size === 0) && o.onCompleted();
	        })
	      );
	      return group;
	    }, left);
	  };
	
	  /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var r = new RefCountDisposable(group);
	      var leftMap = new Map(), rightMap = new Map();
	      var leftId = 0, rightId = 0;
	      var handleError = function (e) { return function (v) { v.onError(e); }; };
	
	      function handleError(e) { };
	
	      group.add(left.subscribe(
	        function (value) {
	          var s = new Subject();
	          var id = leftId++;
	          leftMap.set(id, s);
	
	          var result = tryCatch(resultSelector)(value, addRef(s, r));
	          if (result === errorObj) {
	            leftMap.forEach(handleError(result.e));
	            return o.onError(result.e);
	          }
	          o.onNext(result);
	
	          rightMap.forEach(function (v) { s.onNext(v); });
	
	          var md = new SingleAssignmentDisposable();
	          group.add(md);
	
	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              leftMap['delete'](id) && s.onCompleted();
	              group.remove(md);
	            }));
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        },
	        function () { o.onCompleted(); })
	      );
	
	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++;
	          rightMap.set(id, value);
	
	          var md = new SingleAssignmentDisposable();
	          group.add(md);
	
	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              rightMap['delete'](id);
	              group.remove(md);
	            }));
	
	          leftMap.forEach(function (v) { v.onNext(value); });
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        })
	      );
	
	      return r;
	    }, left);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.buffer = function () {
	    return this.window.apply(this, arguments)
	      .flatMap(toArray);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
	    }
	    return typeof windowOpeningsOrClosingSelector === 'function' ?
	      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
	      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
	  };
	
	  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
	    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
	      return win;
	    });
	  }
	
	  function observableWindowWithBoundaries(windowBoundaries) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);
	
	      observer.onNext(addRef(win, r));
	
	      d.add(source.subscribe(function (x) {
	        win.onNext(x);
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));
	
	      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));
	
	      d.add(windowBoundaries.subscribe(function (w) {
	        win.onCompleted();
	        win = new Subject();
	        observer.onNext(addRef(win, r));
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));
	
	      return r;
	    }, source);
	  }
	
	  function observableWindowWithClosingSelector(windowClosingSelector) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	      observer.onNext(addRef(win, r));
	      d.add(source.subscribe(function (x) {
	          win.onNext(x);
	      }, function (err) {
	          win.onError(err);
	          observer.onError(err);
	      }, function () {
	          win.onCompleted();
	          observer.onCompleted();
	      }));
	
	      function createWindowClose () {
	        var windowClose;
	        try {
	          windowClose = windowClosingSelector();
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	
	        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));
	
	        var m1 = new SingleAssignmentDisposable();
	        m.setDisposable(m1);
	        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
	          win.onError(err);
	          observer.onError(err);
	        }, function () {
	          win.onCompleted();
	          win = new Subject();
	          observer.onNext(addRef(win, r));
	          createWindowClose();
	        }));
	      }
	
	      createWindowClose();
	      return r;
	    }, source);
	  }
	
	  /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */
	  observableProto.pairwise = function () {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var previous, hasPrevious = false;
	      return source.subscribe(
	        function (x) {
	          if (hasPrevious) {
	            observer.onNext([previous, x]);
	          } else {
	            hasPrevious = true;
	          }
	          previous = x;
	        },
	        observer.onError.bind(observer),
	        observer.onCompleted.bind(observer));
	    }, source);
	  };
	
	  /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */
	  observableProto.partition = function(predicate, thisArg) {
	    return [
	      this.filter(predicate, thisArg),
	      this.filter(function (x, i, o) { return !predicate.call(thisArg, x, i, o); })
	    ];
	  };
	
	  var WhileEnumerable = (function(__super__) {
	    inherits(WhileEnumerable, __super__);
	    function WhileEnumerable(c, s) {
	      this.c = c;
	      this.s = s;
	    }
	    WhileEnumerable.prototype[$iterator$] = function () {
	      var self = this;
	      return {
	        next: function () {
	          return self.c() ?
	           { done: false, value: self.s } :
	           { done: true, value: void 0 };
	        }
	      };
	    };
	    return WhileEnumerable;
	  }(Enumerable));
	  
	  function enumerableWhile(condition, source) {
	    return new WhileEnumerable(condition, source);
	  }  
	
	   /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.letBind = observableProto['let'] = function (func) {
	    return func(this);
	  };
	
	   /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */
	  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
	    return observableDefer(function () {
	      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());
	
	      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
	      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));
	
	      // Assume a scheduler for empty only
	      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
	      return condition() ? thenSource : elseSourceOrScheduler;
	    });
	  };
	
	   /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */
	  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
	    return enumerableOf(sources, resultSelector, thisArg).concat();
	  };
	
	   /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
	    isPromise(source) && (source = observableFromPromise(source));
	    return enumerableWhile(condition, source).concat();
	  };
	
	   /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  observableProto.doWhile = function (condition) {
	    return observableConcat([this, observableWhileDo(condition, this)]);
	  };
	
	   /**
	   *  Uses selector to determine which source in sources to use.
	
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */
	  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
	    return observableDefer(function () {
	      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
	      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());
	
	      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));
	
	      var result = sources[selector()];
	      isPromise(result) && (result = observableFromPromise(result));
	
	      return result || defaultSourceOrScheduler;
	    });
	  };
	
	   /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */
	  observableProto.expand = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var q = [],
	        m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        activeCount = 0,
	        isAcquired = false;
	
	      var ensureActive = function () {
	        var isOwner = false;
	        if (q.length > 0) {
	          isOwner = !isAcquired;
	          isAcquired = true;
	        }
	        if (isOwner) {
	          m.setDisposable(scheduler.scheduleRecursive(function (self) {
	            var work;
	            if (q.length > 0) {
	              work = q.shift();
	            } else {
	              isAcquired = false;
	              return;
	            }
	            var m1 = new SingleAssignmentDisposable();
	            d.add(m1);
	            m1.setDisposable(work.subscribe(function (x) {
	              observer.onNext(x);
	              var result = null;
	              try {
	                result = selector(x);
	              } catch (e) {
	                observer.onError(e);
	              }
	              q.push(result);
	              activeCount++;
	              ensureActive();
	            }, observer.onError.bind(observer), function () {
	              d.remove(m1);
	              activeCount--;
	              if (activeCount === 0) {
	                observer.onCompleted();
	              }
	            }));
	            self();
	          }));
	        }
	      };
	
	      q.push(source);
	      activeCount++;
	      ensureActive();
	      return d;
	    }, this);
	  };
	
	   /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */
	  Observable.forkJoin = function () {
	    var allSources = [];
	    if (Array.isArray(arguments[0])) {
	      allSources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { allSources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (subscriber) {
	      var count = allSources.length;
	      if (count === 0) {
	        subscriber.onCompleted();
	        return disposableEmpty;
	      }
	      var group = new CompositeDisposable(),
	        finished = false,
	        hasResults = new Array(count),
	        hasCompleted = new Array(count),
	        results = new Array(count);
	
	      for (var idx = 0; idx < count; idx++) {
	        (function (i) {
	          var source = allSources[i];
	          isPromise(source) && (source = observableFromPromise(source));
	          group.add(
	            source.subscribe(
	              function (value) {
	              if (!finished) {
	                hasResults[i] = true;
	                results[i] = value;
	              }
	            },
	            function (e) {
	              finished = true;
	              subscriber.onError(e);
	              group.dispose();
	            },
	            function () {
	              if (!finished) {
	                if (!hasResults[i]) {
	                    subscriber.onCompleted();
	                    return;
	                }
	                hasCompleted[i] = true;
	                for (var ix = 0; ix < count; ix++) {
	                  if (!hasCompleted[ix]) { return; }
	                }
	                finished = true;
	                subscriber.onNext(results);
	                subscriber.onCompleted();
	              }
	            }));
	        })(idx);
	      }
	
	      return group;
	    });
	  };
	
	   /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   *
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */
	  observableProto.forkJoin = function (second, resultSelector) {
	    var first = this;
	    return new AnonymousObservable(function (observer) {
	      var leftStopped = false, rightStopped = false,
	        hasLeft = false, hasRight = false,
	        lastLeft, lastRight,
	        leftSubscription = new SingleAssignmentDisposable(), rightSubscription = new SingleAssignmentDisposable();
	
	      isPromise(second) && (second = observableFromPromise(second));
	
	      leftSubscription.setDisposable(
	          first.subscribe(function (left) {
	            hasLeft = true;
	            lastLeft = left;
	          }, function (err) {
	            rightSubscription.dispose();
	            observer.onError(err);
	          }, function () {
	            leftStopped = true;
	            if (rightStopped) {
	              if (!hasLeft) {
	                  observer.onCompleted();
	              } else if (!hasRight) {
	                  observer.onCompleted();
	              } else {
	                var result;
	                try {
	                  result = resultSelector(lastLeft, lastRight);
	                } catch (e) {
	                  observer.onError(e);
	                  return;
	                }
	                observer.onNext(result);
	                observer.onCompleted();
	              }
	            }
	          })
	      );
	
	      rightSubscription.setDisposable(
	        second.subscribe(function (right) {
	          hasRight = true;
	          lastRight = right;
	        }, function (err) {
	          leftSubscription.dispose();
	          observer.onError(err);
	        }, function () {
	          rightStopped = true;
	          if (leftStopped) {
	            if (!hasLeft) {
	              observer.onCompleted();
	            } else if (!hasRight) {
	              observer.onCompleted();
	            } else {
	              var result;
	              try {
	                result = resultSelector(lastLeft, lastRight);
	              } catch (e) {
	                observer.onError(e);
	                return;
	              }
	              observer.onNext(result);
	              observer.onCompleted();
	            }
	          }
	        })
	      );
	
	      return new CompositeDisposable(leftSubscription, rightSubscription);
	    }, first);
	  };
	
	  /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */
	  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return observableDefer(function () {
	      var chain;
	
	      return source
	        .map(function (x) {
	          var curr = new ChainObservable(x);
	
	          chain && chain.onNext(x);
	          chain = curr;
	
	          return curr;
	        })
	        .tap(
	          noop,
	          function (e) { chain && chain.onError(e); },
	          function () { chain && chain.onCompleted(); }
	        )
	        .observeOn(scheduler)
	        .map(selector);
	    }, source);
	  };
	
	  var ChainObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      var self = this, g = new CompositeDisposable();
	      g.add(currentThreadScheduler.schedule(function () {
	        observer.onNext(self.head);
	        g.add(self.tail.mergeAll().subscribe(observer));
	      }));
	
	      return g;
	    }
	
	    inherits(ChainObservable, __super__);
	
	    function ChainObservable(head) {
	      __super__.call(this, subscribe);
	      this.head = head;
	      this.tail = new AsyncSubject();
	    }
	
	    addProperties(ChainObservable.prototype, Observer, {
	      onCompleted: function () {
	        this.onNext(Observable.empty());
	      },
	      onError: function (e) {
	        this.onNext(Observable['throw'](e));
	      },
	      onNext: function (v) {
	        this.tail.onNext(v);
	        this.tail.onCompleted();
	      }
	    });
	
	    return ChainObservable;
	
	  }(Observable));
	
	  var Map = root.Map || (function () {
	    function Map() {
	      this.size = 0;
	      this._values = [];
	      this._keys = [];
	    }
	
	    Map.prototype['delete'] = function (key) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) { return false }
	      this._values.splice(i, 1);
	      this._keys.splice(i, 1);
	      this.size--;
	      return true;
	    };
	
	    Map.prototype.get = function (key) {
	      var i = this._keys.indexOf(key);
	      return i === -1 ? undefined : this._values[i];
	    };
	
	    Map.prototype.set = function (key, value) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) {
	        this._keys.push(key);
	        this._values.push(value);
	        this.size++;
	      } else {
	        this._values[i] = value;
	      }
	      return this;
	    };
	
	    Map.prototype.forEach = function (cb, thisArg) {
	      for (var i = 0; i < this.size; i++) {
	        cb.call(thisArg, this._values[i], this._keys[i]);
	      }
	    };
	
	    return Map;
	  }());
	
	  /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */
	  function Pattern(patterns) {
	    this.patterns = patterns;
	  }
	
	  /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */
	  Pattern.prototype.and = function (other) {
	    return new Pattern(this.patterns.concat(other));
	  };
	
	  /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  Pattern.prototype.thenDo = function (selector) {
	    return new Plan(this, selector);
	  };
	
	  function Plan(expression, selector) {
	      this.expression = expression;
	      this.selector = selector;
	  }
	
	  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	    var self = this;
	    var joinObservers = [];
	    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
	      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], observer.onError.bind(observer)));
	    }
	    var activePlan = new ActivePlan(joinObservers, function () {
	      var result;
	      try {
	        result = self.selector.apply(self, arguments);
	      } catch (e) {
	        observer.onError(e);
	        return;
	      }
	      observer.onNext(result);
	    }, function () {
	      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	        joinObservers[j].removeActivePlan(activePlan);
	      }
	      deactivate(activePlan);
	    });
	    for (i = 0, len = joinObservers.length; i < len; i++) {
	      joinObservers[i].addActivePlan(activePlan);
	    }
	    return activePlan;
	  };
	
	  function planCreateObserver(externalSubscriptions, observable, onError) {
	    var entry = externalSubscriptions.get(observable);
	    if (!entry) {
	      var observer = new JoinObserver(observable, onError);
	      externalSubscriptions.set(observable, observer);
	      return observer;
	    }
	    return entry;
	  }
	
	  function ActivePlan(joinObserverArray, onNext, onCompleted) {
	    this.joinObserverArray = joinObserverArray;
	    this.onNext = onNext;
	    this.onCompleted = onCompleted;
	    this.joinObservers = new Map();
	    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      var joinObserver = this.joinObserverArray[i];
	      this.joinObservers.set(joinObserver, joinObserver);
	    }
	  }
	
	  ActivePlan.prototype.dequeue = function () {
	    this.joinObservers.forEach(function (v) { v.queue.shift(); });
	  };
	
	  ActivePlan.prototype.match = function () {
	    var i, len, hasValues = true;
	    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      if (this.joinObserverArray[i].queue.length === 0) {
	        hasValues = false;
	        break;
	      }
	    }
	    if (hasValues) {
	      var firstValues = [],
	          isCompleted = false;
	      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	        firstValues.push(this.joinObserverArray[i].queue[0]);
	        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
	      }
	      if (isCompleted) {
	        this.onCompleted();
	      } else {
	        this.dequeue();
	        var values = [];
	        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	          values.push(firstValues[i].value);
	        }
	        this.onNext.apply(this, values);
	      }
	    }
	  };
	
	  var JoinObserver = (function (__super__) {
	    inherits(JoinObserver, __super__);
	
	    function JoinObserver(source, onError) {
	      __super__.call(this);
	      this.source = source;
	      this.onError = onError;
	      this.queue = [];
	      this.activePlans = [];
	      this.subscription = new SingleAssignmentDisposable();
	      this.isDisposed = false;
	    }
	
	    var JoinObserverPrototype = JoinObserver.prototype;
	
	    JoinObserverPrototype.next = function (notification) {
	      if (!this.isDisposed) {
	        if (notification.kind === 'E') {
	          return this.onError(notification.exception);
	        }
	        this.queue.push(notification);
	        var activePlans = this.activePlans.slice(0);
	        for (var i = 0, len = activePlans.length; i < len; i++) {
	          activePlans[i].match();
	        }
	      }
	    };
	
	    JoinObserverPrototype.error = noop;
	    JoinObserverPrototype.completed = noop;
	
	    JoinObserverPrototype.addActivePlan = function (activePlan) {
	      this.activePlans.push(activePlan);
	    };
	
	    JoinObserverPrototype.subscribe = function () {
	      this.subscription.setDisposable(this.source.materialize().subscribe(this));
	    };
	
	    JoinObserverPrototype.removeActivePlan = function (activePlan) {
	      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
	      this.activePlans.length === 0 && this.dispose();
	    };
	
	    JoinObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this.subscription.dispose();
	      }
	    };
	
	    return JoinObserver;
	  } (AbstractObserver));
	
	  /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */
	  observableProto.and = function (right) {
	    return new Pattern([this, right]);
	  };
	
	  /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  observableProto.thenDo = function (selector) {
	    return new Pattern([this]).thenDo(selector);
	  };
	
	  /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */
	  Observable.when = function () {
	    var len = arguments.length, plans;
	    if (Array.isArray(arguments[0])) {
	      plans = arguments[0];
	    } else {
	      plans = new Array(len);
	      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
	    }
	    return new AnonymousObservable(function (o) {
	      var activePlans = [],
	          externalSubscriptions = new Map();
	      var outObserver = observerCreate(
	        function (x) { o.onNext(x); },
	        function (err) {
	          externalSubscriptions.forEach(function (v) { v.onError(err); });
	          o.onError(err);
	        },
	        function (x) { o.onCompleted(); }
	      );
	      try {
	        for (var i = 0, len = plans.length; i < len; i++) {
	          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	            var idx = activePlans.indexOf(activePlan);
	            activePlans.splice(idx, 1);
	            activePlans.length === 0 && o.onCompleted();
	          }));
	        }
	      } catch (e) {
	        observableThrow(e).subscribe(o);
	      }
	      var group = new CompositeDisposable();
	      externalSubscriptions.forEach(function (joinObserver) {
	        joinObserver.subscribe();
	        group.add(joinObserver);
	      });
	
	      return group;
	    });
	  };
	
	  function observableTimerDate(dueTime, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      return scheduler.scheduleWithAbsolute(dueTime, function () {
	        observer.onNext(0);
	        observer.onCompleted();
	      });
	    });
	  }
	
	  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var d = dueTime, p = normalizeTime(period);
	      return scheduler.scheduleRecursiveWithAbsoluteAndState(0, d, function (count, self) {
	        if (p > 0) {
	          var now = scheduler.now();
	          d = d + p;
	          d <= now && (d = now + p);
	        }
	        observer.onNext(count);
	        self(count + 1, d);
	      });
	    });
	  }
	
	  function observableTimerTimeSpan(dueTime, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      return scheduler.scheduleWithRelative(normalizeTime(dueTime), function () {
	        observer.onNext(0);
	        observer.onCompleted();
	      });
	    });
	  }
	
	  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
	    return dueTime === period ?
	      new AnonymousObservable(function (observer) {
	        return scheduler.schedulePeriodicWithState(0, period, function (count) {
	          observer.onNext(count);
	          return count + 1;
	        });
	      }) :
	      observableDefer(function () {
	        return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
	      });
	  }
	
	  /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */
	  var observableinterval = Observable.interval = function (period, scheduler) {
	    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : timeoutScheduler);
	  };
	
	  /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */
	  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
	    var period;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	      period = periodOrScheduler;
	    } else if (isScheduler(periodOrScheduler)) {
	      scheduler = periodOrScheduler;
	    }
	    if (dueTime instanceof Date && period === undefined) {
	      return observableTimerDate(dueTime.getTime(), scheduler);
	    }
	    if (dueTime instanceof Date && period !== undefined) {
	      return observableTimerDateAndPeriod(dueTime.getTime(), periodOrScheduler, scheduler);
	    }
	    return period === undefined ?
	      observableTimerTimeSpan(dueTime, scheduler) :
	      observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
	  };
	
	  function observableDelayRelative(source, dueTime, scheduler) {
	    return new AnonymousObservable(function (o) {
	      var active = false,
	        cancelable = new SerialDisposable(),
	        exception = null,
	        q = [],
	        running = false,
	        subscription;
	      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
	        var d, shouldRun;
	        if (notification.value.kind === 'E') {
	          q = [];
	          q.push(notification);
	          exception = notification.value.exception;
	          shouldRun = !running;
	        } else {
	          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
	          shouldRun = !active;
	          active = true;
	        }
	        if (shouldRun) {
	          if (exception !== null) {
	            o.onError(exception);
	          } else {
	            d = new SingleAssignmentDisposable();
	            cancelable.setDisposable(d);
	            d.setDisposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
	              var e, recurseDueTime, result, shouldRecurse;
	              if (exception !== null) {
	                return;
	              }
	              running = true;
	              do {
	                result = null;
	                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
	                  result = q.shift().value;
	                }
	                if (result !== null) {
	                  result.accept(o);
	                }
	              } while (result !== null);
	              shouldRecurse = false;
	              recurseDueTime = 0;
	              if (q.length > 0) {
	                shouldRecurse = true;
	                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
	              } else {
	                active = false;
	              }
	              e = exception;
	              running = false;
	              if (e !== null) {
	                o.onError(e);
	              } else if (shouldRecurse) {
	                self(recurseDueTime);
	              }
	            }));
	          }
	        }
	      });
	      return new CompositeDisposable(subscription, cancelable);
	    }, source);
	  }
	
	  function observableDelayAbsolute(source, dueTime, scheduler) {
	    return observableDefer(function () {
	      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
	    });
	  }
	
	  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
	    var subDelay, selector;
	    if (isFunction(subscriptionDelay)) {
	      selector = subscriptionDelay;
	    } else {
	      subDelay = subscriptionDelay;
	      selector = delayDurationSelector;
	    }
	    return new AnonymousObservable(function (o) {
	      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();
	
	      function start() {
	        subscription.setDisposable(source.subscribe(
	          function (x) {
	            var delay = tryCatch(selector)(x);
	            if (delay === errorObj) { return o.onError(delay.e); }
	            var d = new SingleAssignmentDisposable();
	            delays.add(d);
	            d.setDisposable(delay.subscribe(
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              },
	              function (e) { o.onError(e); },
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              }
	            ));
	          },
	          function (e) { o.onError(e); },
	          function () {
	            atEnd = true;
	            subscription.dispose();
	            done();
	          }
	        ));
	      }
	
	      function done () {
	        atEnd && delays.length === 0 && o.onCompleted();
	      }
	
	      if (!subDelay) {
	        start();
	      } else {
	        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
	      }
	
	      return new CompositeDisposable(subscription, delays);
	    }, this);
	  }
	
	  /**
	   *  Time shifts the observable sequence by dueTime.
	   *  The relative time intervals between the values are preserved.
	   *
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delay = function () {
	    if (typeof arguments[0] === 'number' || arguments[0] instanceof Date) {
	      var dueTime = arguments[0], scheduler = arguments[1];
	      isScheduler(scheduler) || (scheduler = timeoutScheduler);
	      return dueTime instanceof Date ?
	        observableDelayAbsolute(this, dueTime, scheduler) :
	        observableDelayRelative(this, dueTime, scheduler);
	    } else if (isFunction(arguments[0])) {
	      return delayWithSelector(this, arguments[0], arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };
	
	  function debounce(source, dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var cancelable = new SerialDisposable(), hasvalue = false, value, id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          hasvalue = true;
	          value = x;
	          id++;
	          var currentId = id,
	            d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(scheduler.scheduleWithRelative(dueTime, function () {
	            hasvalue && id === currentId && observer.onNext(value);
	            hasvalue = false;
	          }));
	        },
	        function (e) {
	          cancelable.dispose();
	          observer.onError(e);
	          hasvalue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasvalue && observer.onNext(value);
	          observer.onCompleted();
	          hasvalue = false;
	          id++;
	        });
	      return new CompositeDisposable(subscription, cancelable);
	    }, this);
	  }
	
	  function debounceWithSelector(source, durationSelector) {
	    return new AnonymousObservable(function (o) {
	      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          var throttle = tryCatch(durationSelector)(x);
	          if (throttle === errorObj) { return o.onError(throttle.e); }
	
	          isPromise(throttle) && (throttle = observableFromPromise(throttle));
	
	          hasValue = true;
	          value = x;
	          id++;
	          var currentid = id, d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(throttle.subscribe(
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            },
	            function (e) { o.onError(e); },
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            }
	          ));
	        },
	        function (e) {
	          cancelable.dispose();
	          o.onError(e);
	          hasValue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasValue && o.onNext(value);
	          o.onCompleted();
	          hasValue = false;
	          id++;
	        }
	      );
	      return new CompositeDisposable(subscription, cancelable);
	    }, source);
	  }
	
	  observableProto.debounce = function () {
	    if (isFunction (arguments[0])) {
	      return debounceWithSelector(this, arguments[0]);
	    } else if (typeof arguments[0] === 'number') {
	      return debounce(this, arguments[0], arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    var source = this, timeShift;
	    timeShiftOrScheduler == null && (timeShift = timeSpan);
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    if (typeof timeShiftOrScheduler === 'number') {
	      timeShift = timeShiftOrScheduler;
	    } else if (isScheduler(timeShiftOrScheduler)) {
	      timeShift = timeSpan;
	      scheduler = timeShiftOrScheduler;
	    }
	    return new AnonymousObservable(function (observer) {
	      var groupDisposable,
	        nextShift = timeShift,
	        nextSpan = timeSpan,
	        q = [],
	        refCountDisposable,
	        timerD = new SerialDisposable(),
	        totalTime = 0;
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable);
	
	       function createTimer () {
	        var m = new SingleAssignmentDisposable(),
	          isSpan = false,
	          isShift = false;
	        timerD.setDisposable(m);
	        if (nextSpan === nextShift) {
	          isSpan = true;
	          isShift = true;
	        } else if (nextSpan < nextShift) {
	            isSpan = true;
	        } else {
	          isShift = true;
	        }
	        var newTotalTime = isSpan ? nextSpan : nextShift,
	          ts = newTotalTime - totalTime;
	        totalTime = newTotalTime;
	        if (isSpan) {
	          nextSpan += timeShift;
	        }
	        if (isShift) {
	          nextShift += timeShift;
	        }
	        m.setDisposable(scheduler.scheduleWithRelative(ts, function () {
	          if (isShift) {
	            var s = new Subject();
	            q.push(s);
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          isSpan && q.shift().onCompleted();
	          createTimer();
	        }));
	      };
	      q.push(new Subject());
	      observer.onNext(addRef(q[0], refCountDisposable));
	      createTimer();
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	        },
	        function (e) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var timerD = new SerialDisposable(),
	          groupDisposable = new CompositeDisposable(timerD),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          n = 0,
	          windowId = 0,
	          s = new Subject();
	
	      function createTimer(id) {
	        var m = new SingleAssignmentDisposable();
	        timerD.setDisposable(m);
	        m.setDisposable(scheduler.scheduleWithRelative(timeSpan, function () {
	          if (id !== windowId) { return; }
	          n = 0;
	          var newId = ++windowId;
	          s.onCompleted();
	          s = new Subject();
	          observer.onNext(addRef(s, refCountDisposable));
	          createTimer(newId);
	        }));
	      }
	
	      observer.onNext(addRef(s, refCountDisposable));
	      createTimer(0);
	
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          var newId = 0, newWindow = false;
	          s.onNext(x);
	          if (++n === count) {
	            newWindow = true;
	            n = 0;
	            newId = ++windowId;
	            s.onCompleted();
	            s = new Subject();
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          newWindow && createTimer(newId);
	        },
	        function (e) {
	          s.onError(e);
	          observer.onError(e);
	        }, function () {
	          s.onCompleted();
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
	    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
	  };
	
	  /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */
	  observableProto.timeInterval = function (scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return observableDefer(function () {
	      var last = scheduler.now();
	      return source.map(function (x) {
	        var now = scheduler.now(), span = now - last;
	        last = now;
	        return { value: x, interval: span };
	      });
	    });
	  };
	
	  /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */
	  observableProto.timestamp = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return this.map(function (x) {
	      return { value: x, timestamp: scheduler.now() };
	    });
	  };
	
	  function sampleObservable(source, sampler) {
	    return new AnonymousObservable(function (o) {
	      var atEnd = false, value, hasValue = false;
	
	      function sampleSubscribe() {
	        if (hasValue) {
	          hasValue = false;
	          o.onNext(value);
	        }
	        atEnd && o.onCompleted();
	      }
	
	      var sourceSubscription = new SingleAssignmentDisposable();
	      sourceSubscription.setDisposable(source.subscribe(
	        function (newValue) {
	          hasValue = true;
	          value = newValue;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          atEnd = true;
	          sourceSubscription.dispose(); 
	        }
	      ));
	
	      return new CompositeDisposable(
	        sourceSubscription,
	        sampler.subscribe(sampleSubscribe, function (e) { o.onError(e); }, sampleSubscribe)
	      );
	    }, source);
	  }
	
	  /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */
	  observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return typeof intervalOrSampler === 'number' ?
	      sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
	      sampleObservable(this, intervalOrSampler);
	  };
	
	  var TimeoutError = Rx.TimeoutError = function(message) {
	    this.message = message || 'Timeout has occurred';
	    this.name = 'TimeoutError';
	    Error.call(this);
	  };
	  TimeoutError.prototype = Object.create(Error.prototype);
	
	  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
	    if (isFunction(firstTimeout)) {
	      other = timeoutDurationSelector;
	      timeoutDurationSelector = firstTimeout;
	      firstTimeout = observableNever();
	    }
	    other || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var subscription = new SerialDisposable(), timer = new SerialDisposable(), original = new SingleAssignmentDisposable();
	
	      subscription.setDisposable(original);
	
	      var id = 0, switched = false;
	
	      function setTimer(timeout) {
	        var myId = id, d = new SingleAssignmentDisposable();
	        timer.setDisposable(d);
	        d.setDisposable(timeout.subscribe(function () {
	          id === myId && subscription.setDisposable(other.subscribe(o));
	          d.dispose();
	        }, function (e) {
	          id === myId && o.onError(e);
	        }, function () {
	          id === myId && subscription.setDisposable(other.subscribe(o));
	        }));
	      };
	
	      setTimer(firstTimeout);
	
	      function oWins() {
	        var res = !switched;
	        if (res) { id++; }
	        return res;
	      }
	
	      original.setDisposable(source.subscribe(function (x) {
	        if (oWins()) {
	          o.onNext(x);
	          var timeout = tryCatch(timeoutDurationSelector)(x);
	          if (timeout === errorObj) { return o.onError(timeout.e); }
	          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
	        }
	      }, function (e) {
	        oWins() && o.onError(e);
	      }, function () {
	        oWins() && o.onCompleted();
	      }));
	      return new CompositeDisposable(subscription, timer);
	    }, source);
	  }
	
	  function timeout(source, dueTime, other, scheduler) {
	    if (other == null) { throw new Error('other or scheduler must be specified'); }
	    if (isScheduler(other)) {
	      scheduler = other;
	      other = observableThrow(new TimeoutError());
	    }
	    if (other instanceof Error) { other = observableThrow(other); }
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	
	    var schedulerMethod = dueTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	
	    return new AnonymousObservable(function (o) {
	      var id = 0,
	        original = new SingleAssignmentDisposable(),
	        subscription = new SerialDisposable(),
	        switched = false,
	        timer = new SerialDisposable();
	
	      subscription.setDisposable(original);
	
	      function createTimer() {
	        var myId = id;
	        timer.setDisposable(scheduler[schedulerMethod](dueTime, function () {
	          if (id === myId) {
	            isPromise(other) && (other = observableFromPromise(other));
	            subscription.setDisposable(other.subscribe(o));
	          }
	        }));
	      }
	
	      createTimer();
	
	      original.setDisposable(source.subscribe(function (x) {
	        if (!switched) {
	          id++;
	          o.onNext(x);
	          createTimer();
	        }
	      }, function (e) {
	        if (!switched) {
	          id++;
	          o.onError(e);
	        }
	      }, function () {
	        if (!switched) {
	          id++;
	          o.onCompleted();
	        }
	      }));
	      return new CompositeDisposable(subscription, timer);
	    }, source);
	  }
	
	  observableProto.timeout = function () {
	    var firstArg = arguments[0];
	    if (firstArg instanceof Date || typeof firstArg === 'number') {
	      return timeout(this, firstArg, arguments[1], arguments[2]);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };
	
	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var first = true,
	        hasResult = false;
	      return scheduler.scheduleRecursiveWithAbsoluteAndState(initialState, scheduler.now(), function (state, self) {
	        hasResult && observer.onNext(state);
	
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          if (hasResult) {
	            var result = resultSelector(state);
	            var time = timeSelector(state);
	          }
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	        if (hasResult) {
	          self(result, time);
	        } else {
	          observer.onCompleted();
	        }
	      });
	    });
	  };
	
	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var first = true,
	        hasResult = false;
	      return scheduler.scheduleRecursiveWithRelativeAndState(initialState, 0, function (state, self) {
	        hasResult && observer.onNext(state);
	
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          if (hasResult) {
	            var result = resultSelector(state);
	            var time = timeSelector(state);
	          }
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	        if (hasResult) {
	          self(result, time);
	        } else {
	          observer.onCompleted();
	        }
	      });
	    });
	  };
	
	  /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delaySubscription = function (dueTime, scheduler) {
	    var scheduleMethod = dueTime instanceof Date ? 'scheduleWithAbsolute' : 'scheduleWithRelative';
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var d = new SerialDisposable();
	
	      d.setDisposable(scheduler[scheduleMethod](dueTime, function() {
	        d.setDisposable(source.subscribe(o));
	      }));
	
	      return d;
	    }, this);
	  };
	
	  /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   *
	   *  1 - res = source.skipLastWithTime(5000);
	   *  2 - res = source.skipLastWithTime(5000, scheduler);
	   *
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */
	  observableProto.skipLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          o.onNext(q.shift().value);
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now();
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          o.onNext(q.shift().value);
	        }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now();
	        while (q.length > 0) {
	          var next = q.shift();
	          if (now - next.interval <= duration) { o.onNext(next.value); }
	        }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now(), res = [];
	        while (q.length > 0) {
	          var next = q.shift();
	          now - next.interval <= duration && res.push(next.value);
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */
	  observableProto.takeWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      return new CompositeDisposable(scheduler.scheduleWithRelative(duration, function () { o.onCompleted(); }), source.subscribe(o));
	    }, source);
	  };
	
	  /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.skipWithTime(5000, [optional scheduler]);
	   *
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */
	  observableProto.skipWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var open = false;
	      return new CompositeDisposable(
	        scheduler.scheduleWithRelative(duration, function () { open = true; }),
	        source.subscribe(function (x) { open && observer.onNext(x); }, observer.onError.bind(observer), observer.onCompleted.bind(observer)));
	    }, source);
	  };
	
	  /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */
	  observableProto.skipUntilWithTime = function (startTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this, schedulerMethod = startTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	    return new AnonymousObservable(function (o) {
	      var open = false;
	
	      return new CompositeDisposable(
	        scheduler[schedulerMethod](startTime, function () { open = true; }),
	        source.subscribe(
	          function (x) { open && o.onNext(x); },
	          function (e) { o.onError(e); }, function () { o.onCompleted(); }));
	    }, source);
	  };
	
	  /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */
	  observableProto.takeUntilWithTime = function (endTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this, schedulerMethod = endTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	    return new AnonymousObservable(function (o) {
	      return new CompositeDisposable(
	        scheduler[schedulerMethod](endTime, function () { o.onCompleted(); }),
	        source.subscribe(o));
	    }, source);
	  };
	
	  /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */
	  observableProto.throttle = function (windowDuration, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var duration = +windowDuration || 0;
	    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var lastOnNext = 0;
	      return source.subscribe(
	        function (x) {
	          var now = scheduler.now();
	          if (lastOnNext === 0 || now - lastOnNext >= duration) {
	            lastOnNext = now;
	            o.onNext(x);
	          }
	        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
	      );
	    }, source);
	  };
	
	  /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */
	  observableProto.transduce = function(transducer) {
	    var source = this;
	
	    function transformForObserver(o) {
	      return {
	        '@@transducer/init': function() {
	          return o;
	        },
	        '@@transducer/step': function(obs, input) {
	          return obs.onNext(input);
	        },
	        '@@transducer/result': function(obs) {
	          return obs.onCompleted();
	        }
	      };
	    }
	
	    return new AnonymousObservable(function(o) {
	      var xform = transducer(transformForObserver(o));
	      return source.subscribe(
	        function(v) {
	          var res = tryCatch(xform['@@transducer/step']).call(xform, o, v);
	          if (res === errorObj) { o.onError(res.e); }
	        },
	        function (e) { o.onError(e); },
	        function() { xform['@@transducer/result'](o); }
	      );
	    }, source);
	  };
	
	  /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */
	  observableProto.switchFirst = function () {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var hasCurrent = false,
	        isStopped = false,
	        m = new SingleAssignmentDisposable(),
	        g = new CompositeDisposable();
	
	      g.add(m);
	
	      m.setDisposable(sources.subscribe(
	        function (innerSource) {
	          if (!hasCurrent) {
	            hasCurrent = true;
	
	            isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	            var innerSubscription = new SingleAssignmentDisposable();
	            g.add(innerSubscription);
	
	            innerSubscription.setDisposable(innerSource.subscribe(
	              function (x) { o.onNext(x); },
	              function (e) { o.onError(e); },
	              function () {
	                g.remove(innerSubscription);
	                hasCurrent = false;
	                isStopped && g.length === 1 && o.onCompleted();
	            }));
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          isStopped = true;
	          !hasCurrent && g.length === 1 && o.onCompleted();
	        }));
	
	      return g;
	    }, this);
	  };
	
	observableProto.flatMapFirst = observableProto.selectManyFirst = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
	};
	
	Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	};
	  /** Provides a set of extension methods for virtual time scheduling. */
	  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
	
	    function localNow() {
	      return this.toDateTimeOffset(this.clock);
	    }
	
	    function scheduleNow(state, action) {
	      return this.scheduleAbsoluteWithState(state, this.clock, action);
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      return this.scheduleRelativeWithState(state, this.toRelative(dueTime), action);
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleRelativeWithState(state, this.toRelative(dueTime - this.now()), action);
	    }
	
	    function invokeAction(scheduler, action) {
	      action();
	      return disposableEmpty;
	    }
	
	    inherits(VirtualTimeScheduler, __super__);
	
	    /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function VirtualTimeScheduler(initialClock, comparer) {
	      this.clock = initialClock;
	      this.comparer = comparer;
	      this.isEnabled = false;
	      this.queue = new PriorityQueue(1024);
	      __super__.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
	    }
	
	    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;
	
	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    VirtualTimeSchedulerPrototype.add = notImplemented;
	
	    /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */
	    VirtualTimeSchedulerPrototype.toDateTimeOffset = notImplemented;
	
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    VirtualTimeSchedulerPrototype.toRelative = notImplemented;
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.schedulePeriodicWithState = function (state, period, action) {
	      var s = new SchedulePeriodicRecursive(this, state, period, action);
	      return s.start();
	    };
	
	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelativeWithState = function (state, dueTime, action) {
	      var runAt = this.add(this.clock, dueTime);
	      return this.scheduleAbsoluteWithState(state, runAt, action);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelative = function (dueTime, action) {
	      return this.scheduleRelativeWithState(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Starts the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.start = function () {
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	      }
	    };
	
	    /**
	     * Stops the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.stop = function () {
	      this.isEnabled = false;
	    };
	
	    /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */
	    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
	      var dueToClock = this.comparer(this.clock, time);
	      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) { return; }
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	        this.clock = time;
	      }
	    };
	
	    /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
	      var dt = this.add(this.clock, time),
	          dueToClock = this.comparer(this.clock, dt);
	      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) {  return; }
	
	      this.advanceTo(dt);
	    };
	
	    /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.sleep = function (time) {
	      var dt = this.add(this.clock, time);
	      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }
	
	      this.clock = dt;
	    };
	
	    /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */
	    VirtualTimeSchedulerPrototype.getNext = function () {
	      while (this.queue.length > 0) {
	        var next = this.queue.peek();
	        if (next.isCancelled()) {
	          this.queue.dequeue();
	        } else {
	          return next;
	        }
	      }
	      return null;
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Scheduler} scheduler Scheduler to execute the action on.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (dueTime, action) {
	      return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
	      var self = this;
	
	      function run(scheduler, state1) {
	        self.queue.remove(si);
	        return action(scheduler, state1);
	      }
	
	      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
	      this.queue.enqueue(si);
	
	      return si.disposable;
	    };
	
	    return VirtualTimeScheduler;
	  }(Scheduler));
	
	  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
	  Rx.HistoricalScheduler = (function (__super__) {
	    inherits(HistoricalScheduler, __super__);
	
	    /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function HistoricalScheduler(initialClock, comparer) {
	      var clock = initialClock == null ? 0 : initialClock;
	      var cmp = comparer || defaultSubComparer;
	      __super__.call(this, clock, cmp);
	    }
	
	    var HistoricalSchedulerProto = HistoricalScheduler.prototype;
	
	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    HistoricalSchedulerProto.add = function (absolute, relative) {
	      return absolute + relative;
	    };
	
	    HistoricalSchedulerProto.toDateTimeOffset = function (absolute) {
	      return new Date(absolute).getTime();
	    };
	
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    HistoricalSchedulerProto.toRelative = function (timeSpan) {
	      return timeSpan;
	    };
	
	    return HistoricalScheduler;
	  }(Rx.VirtualTimeScheduler));
	
	  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
	    inherits(AnonymousObservable, __super__);
	
	    // Fix subscriber to check for undefined or function returned to decorate as Disposable
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }
	
	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.__subscribe).call(self, ado);
	
	      if (sub === errorObj) {
	        if(!ado.fail(errorObj.e)) { return thrower(errorObj.e); }
	      }
	      ado.setDisposable(fixSubscriber(sub));
	    }
	
	    function innerSubscribe(observer) {
	      var ado = new AutoDetachObserver(observer), state = [ado, this];
	
	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.scheduleWithState(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    }
	
	    function AnonymousObservable(subscribe, parent) {
	      this.source = parent;
	      this.__subscribe = subscribe;
	      __super__.call(this, innerSubscribe);
	    }
	
	    return AnonymousObservable;
	
	  }(Observable));
	
	  var AutoDetachObserver = (function (__super__) {
	    inherits(AutoDetachObserver, __super__);
	
	    function AutoDetachObserver(observer) {
	      __super__.call(this);
	      this.observer = observer;
	      this.m = new SingleAssignmentDisposable();
	    }
	
	    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;
	
	    AutoDetachObserverPrototype.next = function (value) {
	      var result = tryCatch(this.observer.onNext).call(this.observer, value);
	      if (result === errorObj) {
	        this.dispose();
	        thrower(result.e);
	      }
	    };
	
	    AutoDetachObserverPrototype.error = function (err) {
	      var result = tryCatch(this.observer.onError).call(this.observer, err);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };
	
	    AutoDetachObserverPrototype.completed = function () {
	      var result = tryCatch(this.observer.onCompleted).call(this.observer);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };
	
	    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
	    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };
	
	    AutoDetachObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.m.dispose();
	    };
	
	    return AutoDetachObserver;
	  }(AbstractObserver));
	
	  var GroupedObservable = (function (__super__) {
	    inherits(GroupedObservable, __super__);
	
	    function subscribe(observer) {
	      return this.underlyingObservable.subscribe(observer);
	    }
	
	    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
	      __super__.call(this, subscribe);
	      this.key = key;
	      this.underlyingObservable = !mergedDisposable ?
	        underlyingObservable :
	        new AnonymousObservable(function (observer) {
	          return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
	        });
	    }
	
	    return GroupedObservable;
	  }(Observable));
	
	  /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */
	  var Subject = Rx.Subject = (function (__super__) {
	    function subscribe(observer) {
	      checkDisposed(this);
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        return new InnerSubscription(this, observer);
	      }
	      if (this.hasError) {
	        observer.onError(this.error);
	        return disposableEmpty;
	      }
	      observer.onCompleted();
	      return disposableEmpty;
	    }
	
	    inherits(Subject, __super__);
	
	    /**
	     * Creates a subject.
	     */
	    function Subject() {
	      __super__.call(this, subscribe);
	      this.isDisposed = false,
	      this.isStopped = false,
	      this.observers = [];
	      this.hasError = false;
	    }
	
	    addProperties(Subject.prototype, Observer.prototype, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onCompleted();
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.error = error;
	          this.hasError = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onNext(value);
	          }
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });
	
	    /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */
	    Subject.create = function (observer, observable) {
	      return new AnonymousSubject(observer, observable);
	    };
	
	    return Subject;
	  }(Observable));
	
	  /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */
	  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
	
	    function subscribe(observer) {
	      checkDisposed(this);
	
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        return new InnerSubscription(this, observer);
	      }
	
	      if (this.hasError) {
	        observer.onError(this.error);
	      } else if (this.hasValue) {
	        observer.onNext(this.value);
	        observer.onCompleted();
	      } else {
	        observer.onCompleted();
	      }
	
	      return disposableEmpty;
	    }
	
	    inherits(AsyncSubject, __super__);
	
	    /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */
	    function AsyncSubject() {
	      __super__.call(this, subscribe);
	
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasValue = false;
	      this.observers = [];
	      this.hasError = false;
	    }
	
	    addProperties(AsyncSubject.prototype, Observer, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        checkDisposed(this);
	        return this.observers.length > 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */
	      onCompleted: function () {
	        var i, len;
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          var os = cloneArray(this.observers), len = os.length;
	
	          if (this.hasValue) {
	            for (i = 0; i < len; i++) {
	              var o = os[i];
	              o.onNext(this.value);
	              o.onCompleted();
	            }
	          } else {
	            for (i = 0; i < len; i++) {
	              os[i].onCompleted();
	            }
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.hasError = true;
	          this.error = error;
	
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        this.hasValue = true;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.exception = null;
	        this.value = null;
	      }
	    });
	
	    return AsyncSubject;
	  }(Observable));
	
	  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
	    inherits(AnonymousSubject, __super__);
	
	    function subscribe(observer) {
	      return this.observable.subscribe(observer);
	    }
	
	    function AnonymousSubject(observer, observable) {
	      this.observer = observer;
	      this.observable = observable;
	      __super__.call(this, subscribe);
	    }
	
	    addProperties(AnonymousSubject.prototype, Observer.prototype, {
	      onCompleted: function () {
	        this.observer.onCompleted();
	      },
	      onError: function (error) {
	        this.observer.onError(error);
	      },
	      onNext: function (value) {
	        this.observer.onNext(value);
	      }
	    });
	
	    return AnonymousSubject;
	  }(Observable));
	
	  /**
	  * Used to pause and resume streams.
	  */
	  Rx.Pauser = (function (__super__) {
	    inherits(Pauser, __super__);
	
	    function Pauser() {
	      __super__.call(this);
	    }
	
	    /**
	     * Pauses the underlying sequence.
	     */
	    Pauser.prototype.pause = function () { this.onNext(false); };
	
	    /**
	    * Resumes the underlying sequence.
	    */
	    Pauser.prototype.resume = function () { this.onNext(true); };
	
	    return Pauser;
	  }(Subject));
	
	  if (true) {
	    root.Rx = Rx;
	
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Rx;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = Rx).Rx = Rx;
	    } else {
	      freeExports.Rx = Rx;
	    }
	  } else {
	    // in a browser or Rhino
	    root.Rx = Rx;
	  }
	
	  // All code before this point will be filtered from stack traces.
	  var rEndingLine = captureLine();
	
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/module.js */ 2)(module), (function() { return this; }()), __webpack_require__(/*! ./~/process/browser.js */ 3)))

/***/ },
/* 2 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/*!******************************!*\
  !*** ./~/process/browser.js ***!
  \******************************/
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/*!*************************!*\
  !*** ./src/elm/App.elm ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	var require;var require;var Elm = Elm || { Native: {} };
	Elm.App = Elm.App || {};
	Elm.App.make = function (_elm) {
	   "use strict";
	   _elm.App = _elm.App || {};
	   if (_elm.App.values)
	   return _elm.App.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "App",
	   $Basics = Elm.Basics.make(_elm),
	   $Html = Elm.Html.make(_elm),
	   $Html$Events = Elm.Html.Events.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Result = Elm.Result.make(_elm),
	   $Signal = Elm.Signal.make(_elm);
	   var model = {_: {}
	               ,files: _L.fromArray([])
	               ,times: 0};
	   var fileView = function (file) {
	      return A2($Html.div,
	      _L.fromArray([]),
	      _L.fromArray([$Html.text(file)]));
	   };
	   var filesView = function (files) {
	      return A2($Html.div,
	      _L.fromArray([]),
	      A2($List.map,
	      function (n) {
	         return fileView(n);
	      },
	      files));
	   };
	   var update = F2(function (folder,
	   model) {
	      return folder(model);
	   });
	   var newFiles = Elm.Native.Port.make(_elm).inboundSignal("newFiles",
	   "App.Files",
	   function (v) {
	      return typeof v === "object" && v instanceof Array ? Elm.Native.List.make(_elm).fromArray(v.map(function (v) {
	         return typeof v === "string" || typeof v === "object" && v instanceof String ? v : _U.badPort("a string",
	         v);
	      })) : _U.badPort("an array",v);
	   });
	   var updateFiles = A2($Signal.map,
	   F2(function (files,model) {
	      return _U.replace([["files"
	                         ,files]
	                        ,["times",model.times + 1]],
	      model);
	   }),
	   newFiles);
	   var UpdateRequest = {ctor: "UpdateRequest"};
	   var NoOp = {ctor: "NoOp"};
	   var updateRequestMailbox = $Signal.mailbox(NoOp);
	   var updateRequests = Elm.Native.Port.make(_elm).outboundSignal("updateRequests",
	   function (v) {
	      return v;
	   },
	   A2($Signal.map,
	   function (_v0) {
	      return function () {
	         return "updateRequest";
	      }();
	   },
	   updateRequestMailbox.signal));
	   var updateRequestButton = A2($Html.button,
	   _L.fromArray([A2($Html$Events.onClick,
	   updateRequestMailbox.address,
	   UpdateRequest)]),
	   _L.fromArray([$Html.text("request update")]));
	   var view = function (model) {
	      return A2($Html.div,
	      _L.fromArray([]),
	      _L.fromArray([A2($Html.h3,
	                   _L.fromArray([]),
	                   _L.fromArray([$Html.text("Muh Filez:")]))
	                   ,updateRequestButton
	                   ,A2($Html.h4,
	                   _L.fromArray([]),
	                   _L.fromArray([$Html.text(A2($Basics._op["++"],
	                   "times updated: ",
	                   $Basics.toString(model.times)))]))
	                   ,filesView(model.files)]));
	   };
	   var main = $Signal.map(view)(A2($Signal.foldp,
	   update,
	   model)($Signal.mergeMany(_L.fromArray([updateFiles]))));
	   var Model = F2(function (a,b) {
	      return {_: {}
	             ,files: a
	             ,times: b};
	   });
	   _elm.App.values = {_op: _op
	                     ,Model: Model
	                     ,NoOp: NoOp
	                     ,UpdateRequest: UpdateRequest
	                     ,updateRequestMailbox: updateRequestMailbox
	                     ,updateFiles: updateFiles
	                     ,update: update
	                     ,updateRequestButton: updateRequestButton
	                     ,fileView: fileView
	                     ,filesView: filesView
	                     ,view: view
	                     ,model: model
	                     ,main: main};
	   return _elm.App.values;
	};
	Elm.Array = Elm.Array || {};
	Elm.Array.make = function (_elm) {
	   "use strict";
	   _elm.Array = _elm.Array || {};
	   if (_elm.Array.values)
	   return _elm.Array.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Array",
	   $Basics = Elm.Basics.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Array = Elm.Native.Array.make(_elm);
	   var append = $Native$Array.append;
	   var length = $Native$Array.length;
	   var isEmpty = function (array) {
	      return _U.eq(length(array),
	      0);
	   };
	   var slice = $Native$Array.slice;
	   var set = $Native$Array.set;
	   var get = F2(function (i,
	   array) {
	      return _U.cmp(0,
	      i) < 1 && _U.cmp(i,
	      $Native$Array.length(array)) < 0 ? $Maybe.Just(A2($Native$Array.get,
	      i,
	      array)) : $Maybe.Nothing;
	   });
	   var push = $Native$Array.push;
	   var empty = $Native$Array.empty;
	   var filter = F2(function (isOkay,
	   arr) {
	      return function () {
	         var update = F2(function (x,
	         xs) {
	            return isOkay(x) ? A2($Native$Array.push,
	            x,
	            xs) : xs;
	         });
	         return A3($Native$Array.foldl,
	         update,
	         $Native$Array.empty,
	         arr);
	      }();
	   });
	   var foldr = $Native$Array.foldr;
	   var foldl = $Native$Array.foldl;
	   var indexedMap = $Native$Array.indexedMap;
	   var map = $Native$Array.map;
	   var toIndexedList = function (array) {
	      return A3($List.map2,
	      F2(function (v0,v1) {
	         return {ctor: "_Tuple2"
	                ,_0: v0
	                ,_1: v1};
	      }),
	      _L.range(0,
	      $Native$Array.length(array) - 1),
	      $Native$Array.toList(array));
	   };
	   var toList = $Native$Array.toList;
	   var fromList = $Native$Array.fromList;
	   var initialize = $Native$Array.initialize;
	   var repeat = F2(function (n,e) {
	      return A2(initialize,
	      n,
	      $Basics.always(e));
	   });
	   var Array = {ctor: "Array"};
	   _elm.Array.values = {_op: _op
	                       ,empty: empty
	                       ,repeat: repeat
	                       ,initialize: initialize
	                       ,fromList: fromList
	                       ,isEmpty: isEmpty
	                       ,length: length
	                       ,push: push
	                       ,append: append
	                       ,get: get
	                       ,set: set
	                       ,slice: slice
	                       ,toList: toList
	                       ,toIndexedList: toIndexedList
	                       ,map: map
	                       ,indexedMap: indexedMap
	                       ,filter: filter
	                       ,foldl: foldl
	                       ,foldr: foldr};
	   return _elm.Array.values;
	};
	Elm.Basics = Elm.Basics || {};
	Elm.Basics.make = function (_elm) {
	   "use strict";
	   _elm.Basics = _elm.Basics || {};
	   if (_elm.Basics.values)
	   return _elm.Basics.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Basics",
	   $Native$Basics = Elm.Native.Basics.make(_elm),
	   $Native$Show = Elm.Native.Show.make(_elm),
	   $Native$Utils = Elm.Native.Utils.make(_elm);
	   var uncurry = F2(function (f,
	   _v0) {
	      return function () {
	         switch (_v0.ctor)
	         {case "_Tuple2": return A2(f,
	              _v0._0,
	              _v0._1);}
	         _U.badCase($moduleName,
	         "on line 595, column 3 to 8");
	      }();
	   });
	   var curry = F3(function (f,
	   a,
	   b) {
	      return f({ctor: "_Tuple2"
	               ,_0: a
	               ,_1: b});
	   });
	   var flip = F3(function (f,b,a) {
	      return A2(f,a,b);
	   });
	   var snd = function (_v4) {
	      return function () {
	         switch (_v4.ctor)
	         {case "_Tuple2": return _v4._1;}
	         _U.badCase($moduleName,
	         "on line 573, column 3 to 4");
	      }();
	   };
	   var fst = function (_v8) {
	      return function () {
	         switch (_v8.ctor)
	         {case "_Tuple2": return _v8._0;}
	         _U.badCase($moduleName,
	         "on line 567, column 3 to 4");
	      }();
	   };
	   var always = F2(function (a,
	   _v12) {
	      return function () {
	         return a;
	      }();
	   });
	   var identity = function (x) {
	      return x;
	   };
	   _op["<|"] = F2(function (f,x) {
	      return f(x);
	   });
	   _op["|>"] = F2(function (x,f) {
	      return f(x);
	   });
	   _op[">>"] = F3(function (f,
	   g,
	   x) {
	      return g(f(x));
	   });
	   _op["<<"] = F3(function (g,
	   f,
	   x) {
	      return g(f(x));
	   });
	   _op["++"] = $Native$Utils.append;
	   var toString = $Native$Show.toString;
	   var isInfinite = $Native$Basics.isInfinite;
	   var isNaN = $Native$Basics.isNaN;
	   var toFloat = $Native$Basics.toFloat;
	   var ceiling = $Native$Basics.ceiling;
	   var floor = $Native$Basics.floor;
	   var truncate = $Native$Basics.truncate;
	   var round = $Native$Basics.round;
	   var otherwise = true;
	   var not = $Native$Basics.not;
	   var xor = $Native$Basics.xor;
	   _op["||"] = $Native$Basics.or;
	   _op["&&"] = $Native$Basics.and;
	   var max = $Native$Basics.max;
	   var min = $Native$Basics.min;
	   var GT = {ctor: "GT"};
	   var EQ = {ctor: "EQ"};
	   var LT = {ctor: "LT"};
	   var compare = $Native$Basics.compare;
	   _op[">="] = $Native$Basics.ge;
	   _op["<="] = $Native$Basics.le;
	   _op[">"] = $Native$Basics.gt;
	   _op["<"] = $Native$Basics.lt;
	   _op["/="] = $Native$Basics.neq;
	   _op["=="] = $Native$Basics.eq;
	   var e = $Native$Basics.e;
	   var pi = $Native$Basics.pi;
	   var clamp = $Native$Basics.clamp;
	   var logBase = $Native$Basics.logBase;
	   var abs = $Native$Basics.abs;
	   var negate = $Native$Basics.negate;
	   var sqrt = $Native$Basics.sqrt;
	   var atan2 = $Native$Basics.atan2;
	   var atan = $Native$Basics.atan;
	   var asin = $Native$Basics.asin;
	   var acos = $Native$Basics.acos;
	   var tan = $Native$Basics.tan;
	   var sin = $Native$Basics.sin;
	   var cos = $Native$Basics.cos;
	   _op["^"] = $Native$Basics.exp;
	   _op["%"] = $Native$Basics.mod;
	   var rem = $Native$Basics.rem;
	   _op["//"] = $Native$Basics.div;
	   _op["/"] = $Native$Basics.floatDiv;
	   _op["*"] = $Native$Basics.mul;
	   _op["-"] = $Native$Basics.sub;
	   _op["+"] = $Native$Basics.add;
	   var toPolar = $Native$Basics.toPolar;
	   var fromPolar = $Native$Basics.fromPolar;
	   var turns = $Native$Basics.turns;
	   var degrees = $Native$Basics.degrees;
	   var radians = function (t) {
	      return t;
	   };
	   _elm.Basics.values = {_op: _op
	                        ,max: max
	                        ,min: min
	                        ,compare: compare
	                        ,not: not
	                        ,xor: xor
	                        ,otherwise: otherwise
	                        ,rem: rem
	                        ,negate: negate
	                        ,abs: abs
	                        ,sqrt: sqrt
	                        ,clamp: clamp
	                        ,logBase: logBase
	                        ,e: e
	                        ,pi: pi
	                        ,cos: cos
	                        ,sin: sin
	                        ,tan: tan
	                        ,acos: acos
	                        ,asin: asin
	                        ,atan: atan
	                        ,atan2: atan2
	                        ,round: round
	                        ,floor: floor
	                        ,ceiling: ceiling
	                        ,truncate: truncate
	                        ,toFloat: toFloat
	                        ,degrees: degrees
	                        ,radians: radians
	                        ,turns: turns
	                        ,toPolar: toPolar
	                        ,fromPolar: fromPolar
	                        ,isNaN: isNaN
	                        ,isInfinite: isInfinite
	                        ,toString: toString
	                        ,fst: fst
	                        ,snd: snd
	                        ,identity: identity
	                        ,always: always
	                        ,flip: flip
	                        ,curry: curry
	                        ,uncurry: uncurry
	                        ,LT: LT
	                        ,EQ: EQ
	                        ,GT: GT};
	   return _elm.Basics.values;
	};
	Elm.Char = Elm.Char || {};
	Elm.Char.make = function (_elm) {
	   "use strict";
	   _elm.Char = _elm.Char || {};
	   if (_elm.Char.values)
	   return _elm.Char.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Char",
	   $Basics = Elm.Basics.make(_elm),
	   $Native$Char = Elm.Native.Char.make(_elm);
	   var fromCode = $Native$Char.fromCode;
	   var toCode = $Native$Char.toCode;
	   var toLocaleLower = $Native$Char.toLocaleLower;
	   var toLocaleUpper = $Native$Char.toLocaleUpper;
	   var toLower = $Native$Char.toLower;
	   var toUpper = $Native$Char.toUpper;
	   var isBetween = F3(function (low,
	   high,
	   $char) {
	      return function () {
	         var code = toCode($char);
	         return _U.cmp(code,
	         toCode(low)) > -1 && _U.cmp(code,
	         toCode(high)) < 1;
	      }();
	   });
	   var isUpper = A2(isBetween,
	   _U.chr("A"),
	   _U.chr("Z"));
	   var isLower = A2(isBetween,
	   _U.chr("a"),
	   _U.chr("z"));
	   var isDigit = A2(isBetween,
	   _U.chr("0"),
	   _U.chr("9"));
	   var isOctDigit = A2(isBetween,
	   _U.chr("0"),
	   _U.chr("7"));
	   var isHexDigit = function ($char) {
	      return isDigit($char) || (A3(isBetween,
	      _U.chr("a"),
	      _U.chr("f"),
	      $char) || A3(isBetween,
	      _U.chr("A"),
	      _U.chr("F"),
	      $char));
	   };
	   _elm.Char.values = {_op: _op
	                      ,isUpper: isUpper
	                      ,isLower: isLower
	                      ,isDigit: isDigit
	                      ,isOctDigit: isOctDigit
	                      ,isHexDigit: isHexDigit
	                      ,toUpper: toUpper
	                      ,toLower: toLower
	                      ,toLocaleUpper: toLocaleUpper
	                      ,toLocaleLower: toLocaleLower
	                      ,toCode: toCode
	                      ,fromCode: fromCode};
	   return _elm.Char.values;
	};
	Elm.Color = Elm.Color || {};
	Elm.Color.make = function (_elm) {
	   "use strict";
	   _elm.Color = _elm.Color || {};
	   if (_elm.Color.values)
	   return _elm.Color.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Color",
	   $Basics = Elm.Basics.make(_elm);
	   var Radial = F5(function (a,
	   b,
	   c,
	   d,
	   e) {
	      return {ctor: "Radial"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d
	             ,_4: e};
	   });
	   var radial = Radial;
	   var Linear = F3(function (a,
	   b,
	   c) {
	      return {ctor: "Linear"
	             ,_0: a
	             ,_1: b
	             ,_2: c};
	   });
	   var linear = Linear;
	   var fmod = F2(function (f,n) {
	      return function () {
	         var integer = $Basics.floor(f);
	         return $Basics.toFloat(A2($Basics._op["%"],
	         integer,
	         n)) + f - $Basics.toFloat(integer);
	      }();
	   });
	   var rgbToHsl = F3(function (red,
	   green,
	   blue) {
	      return function () {
	         var b = $Basics.toFloat(blue) / 255;
	         var g = $Basics.toFloat(green) / 255;
	         var r = $Basics.toFloat(red) / 255;
	         var cMax = A2($Basics.max,
	         A2($Basics.max,r,g),
	         b);
	         var cMin = A2($Basics.min,
	         A2($Basics.min,r,g),
	         b);
	         var c = cMax - cMin;
	         var lightness = (cMax + cMin) / 2;
	         var saturation = _U.eq(lightness,
	         0) ? 0 : c / (1 - $Basics.abs(2 * lightness - 1));
	         var hue = $Basics.degrees(60) * (_U.eq(cMax,
	         r) ? A2(fmod,
	         (g - b) / c,
	         6) : _U.eq(cMax,
	         g) ? (b - r) / c + 2 : _U.eq(cMax,
	         b) ? (r - g) / c + 4 : _U.badIf($moduleName,
	         "between lines 150 and 152"));
	         return {ctor: "_Tuple3"
	                ,_0: hue
	                ,_1: saturation
	                ,_2: lightness};
	      }();
	   });
	   var hslToRgb = F3(function (hue,
	   saturation,
	   lightness) {
	      return function () {
	         var hue$ = hue / $Basics.degrees(60);
	         var chroma = (1 - $Basics.abs(2 * lightness - 1)) * saturation;
	         var x = chroma * (1 - $Basics.abs(A2(fmod,
	         hue$,
	         2) - 1));
	         var $ = _U.cmp(hue$,
	         0) < 0 ? {ctor: "_Tuple3"
	                  ,_0: 0
	                  ,_1: 0
	                  ,_2: 0} : _U.cmp(hue$,
	         1) < 0 ? {ctor: "_Tuple3"
	                  ,_0: chroma
	                  ,_1: x
	                  ,_2: 0} : _U.cmp(hue$,
	         2) < 0 ? {ctor: "_Tuple3"
	                  ,_0: x
	                  ,_1: chroma
	                  ,_2: 0} : _U.cmp(hue$,
	         3) < 0 ? {ctor: "_Tuple3"
	                  ,_0: 0
	                  ,_1: chroma
	                  ,_2: x} : _U.cmp(hue$,
	         4) < 0 ? {ctor: "_Tuple3"
	                  ,_0: 0
	                  ,_1: x
	                  ,_2: chroma} : _U.cmp(hue$,
	         5) < 0 ? {ctor: "_Tuple3"
	                  ,_0: x
	                  ,_1: 0
	                  ,_2: chroma} : _U.cmp(hue$,
	         6) < 0 ? {ctor: "_Tuple3"
	                  ,_0: chroma
	                  ,_1: 0
	                  ,_2: x} : {ctor: "_Tuple3"
	                            ,_0: 0
	                            ,_1: 0
	                            ,_2: 0},
	         r = $._0,
	         g = $._1,
	         b = $._2;
	         var m = lightness - chroma / 2;
	         return {ctor: "_Tuple3"
	                ,_0: r + m
	                ,_1: g + m
	                ,_2: b + m};
	      }();
	   });
	   var toRgb = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "HSLA":
	            return function () {
	                 var $ = A3(hslToRgb,
	                 color._0,
	                 color._1,
	                 color._2),
	                 r = $._0,
	                 g = $._1,
	                 b = $._2;
	                 return {_: {}
	                        ,alpha: color._3
	                        ,blue: $Basics.round(255 * b)
	                        ,green: $Basics.round(255 * g)
	                        ,red: $Basics.round(255 * r)};
	              }();
	            case "RGBA": return {_: {}
	                                ,alpha: color._3
	                                ,blue: color._2
	                                ,green: color._1
	                                ,red: color._0};}
	         _U.badCase($moduleName,
	         "between lines 124 and 132");
	      }();
	   };
	   var toHsl = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "HSLA": return {_: {}
	                              ,alpha: color._3
	                              ,hue: color._0
	                              ,lightness: color._2
	                              ,saturation: color._1};
	            case "RGBA":
	            return function () {
	                 var $ = A3(rgbToHsl,
	                 color._0,
	                 color._1,
	                 color._2),
	                 h = $._0,
	                 s = $._1,
	                 l = $._2;
	                 return {_: {}
	                        ,alpha: color._3
	                        ,hue: h
	                        ,lightness: l
	                        ,saturation: s};
	              }();}
	         _U.badCase($moduleName,
	         "between lines 114 and 118");
	      }();
	   };
	   var HSLA = F4(function (a,
	   b,
	   c,
	   d) {
	      return {ctor: "HSLA"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d};
	   });
	   var hsla = F4(function (hue,
	   saturation,
	   lightness,
	   alpha) {
	      return A4(HSLA,
	      hue - $Basics.turns($Basics.toFloat($Basics.floor(hue / (2 * $Basics.pi)))),
	      saturation,
	      lightness,
	      alpha);
	   });
	   var hsl = F3(function (hue,
	   saturation,
	   lightness) {
	      return A4(hsla,
	      hue,
	      saturation,
	      lightness,
	      1);
	   });
	   var complement = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "HSLA": return A4(hsla,
	              color._0 + $Basics.degrees(180),
	              color._1,
	              color._2,
	              color._3);
	            case "RGBA":
	            return function () {
	                 var $ = A3(rgbToHsl,
	                 color._0,
	                 color._1,
	                 color._2),
	                 h = $._0,
	                 s = $._1,
	                 l = $._2;
	                 return A4(hsla,
	                 h + $Basics.degrees(180),
	                 s,
	                 l,
	                 color._3);
	              }();}
	         _U.badCase($moduleName,
	         "between lines 105 and 108");
	      }();
	   };
	   var grayscale = function (p) {
	      return A4(HSLA,0,0,1 - p,1);
	   };
	   var greyscale = function (p) {
	      return A4(HSLA,0,0,1 - p,1);
	   };
	   var RGBA = F4(function (a,
	   b,
	   c,
	   d) {
	      return {ctor: "RGBA"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d};
	   });
	   var rgba = RGBA;
	   var rgb = F3(function (r,g,b) {
	      return A4(RGBA,r,g,b,1);
	   });
	   var lightRed = A4(RGBA,
	   239,
	   41,
	   41,
	   1);
	   var red = A4(RGBA,204,0,0,1);
	   var darkRed = A4(RGBA,
	   164,
	   0,
	   0,
	   1);
	   var lightOrange = A4(RGBA,
	   252,
	   175,
	   62,
	   1);
	   var orange = A4(RGBA,
	   245,
	   121,
	   0,
	   1);
	   var darkOrange = A4(RGBA,
	   206,
	   92,
	   0,
	   1);
	   var lightYellow = A4(RGBA,
	   255,
	   233,
	   79,
	   1);
	   var yellow = A4(RGBA,
	   237,
	   212,
	   0,
	   1);
	   var darkYellow = A4(RGBA,
	   196,
	   160,
	   0,
	   1);
	   var lightGreen = A4(RGBA,
	   138,
	   226,
	   52,
	   1);
	   var green = A4(RGBA,
	   115,
	   210,
	   22,
	   1);
	   var darkGreen = A4(RGBA,
	   78,
	   154,
	   6,
	   1);
	   var lightBlue = A4(RGBA,
	   114,
	   159,
	   207,
	   1);
	   var blue = A4(RGBA,
	   52,
	   101,
	   164,
	   1);
	   var darkBlue = A4(RGBA,
	   32,
	   74,
	   135,
	   1);
	   var lightPurple = A4(RGBA,
	   173,
	   127,
	   168,
	   1);
	   var purple = A4(RGBA,
	   117,
	   80,
	   123,
	   1);
	   var darkPurple = A4(RGBA,
	   92,
	   53,
	   102,
	   1);
	   var lightBrown = A4(RGBA,
	   233,
	   185,
	   110,
	   1);
	   var brown = A4(RGBA,
	   193,
	   125,
	   17,
	   1);
	   var darkBrown = A4(RGBA,
	   143,
	   89,
	   2,
	   1);
	   var black = A4(RGBA,0,0,0,1);
	   var white = A4(RGBA,
	   255,
	   255,
	   255,
	   1);
	   var lightGrey = A4(RGBA,
	   238,
	   238,
	   236,
	   1);
	   var grey = A4(RGBA,
	   211,
	   215,
	   207,
	   1);
	   var darkGrey = A4(RGBA,
	   186,
	   189,
	   182,
	   1);
	   var lightGray = A4(RGBA,
	   238,
	   238,
	   236,
	   1);
	   var gray = A4(RGBA,
	   211,
	   215,
	   207,
	   1);
	   var darkGray = A4(RGBA,
	   186,
	   189,
	   182,
	   1);
	   var lightCharcoal = A4(RGBA,
	   136,
	   138,
	   133,
	   1);
	   var charcoal = A4(RGBA,
	   85,
	   87,
	   83,
	   1);
	   var darkCharcoal = A4(RGBA,
	   46,
	   52,
	   54,
	   1);
	   _elm.Color.values = {_op: _op
	                       ,rgb: rgb
	                       ,rgba: rgba
	                       ,hsl: hsl
	                       ,hsla: hsla
	                       ,greyscale: greyscale
	                       ,grayscale: grayscale
	                       ,complement: complement
	                       ,linear: linear
	                       ,radial: radial
	                       ,toRgb: toRgb
	                       ,toHsl: toHsl
	                       ,red: red
	                       ,orange: orange
	                       ,yellow: yellow
	                       ,green: green
	                       ,blue: blue
	                       ,purple: purple
	                       ,brown: brown
	                       ,lightRed: lightRed
	                       ,lightOrange: lightOrange
	                       ,lightYellow: lightYellow
	                       ,lightGreen: lightGreen
	                       ,lightBlue: lightBlue
	                       ,lightPurple: lightPurple
	                       ,lightBrown: lightBrown
	                       ,darkRed: darkRed
	                       ,darkOrange: darkOrange
	                       ,darkYellow: darkYellow
	                       ,darkGreen: darkGreen
	                       ,darkBlue: darkBlue
	                       ,darkPurple: darkPurple
	                       ,darkBrown: darkBrown
	                       ,white: white
	                       ,lightGrey: lightGrey
	                       ,grey: grey
	                       ,darkGrey: darkGrey
	                       ,lightCharcoal: lightCharcoal
	                       ,charcoal: charcoal
	                       ,darkCharcoal: darkCharcoal
	                       ,black: black
	                       ,lightGray: lightGray
	                       ,gray: gray
	                       ,darkGray: darkGray};
	   return _elm.Color.values;
	};
	Elm.Debug = Elm.Debug || {};
	Elm.Debug.make = function (_elm) {
	   "use strict";
	   _elm.Debug = _elm.Debug || {};
	   if (_elm.Debug.values)
	   return _elm.Debug.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Debug",
	   $Graphics$Collage = Elm.Graphics.Collage.make(_elm),
	   $Native$Debug = Elm.Native.Debug.make(_elm);
	   var trace = $Native$Debug.tracePath;
	   var watchSummary = $Native$Debug.watchSummary;
	   var watch = $Native$Debug.watch;
	   var crash = $Native$Debug.crash;
	   var log = $Native$Debug.log;
	   _elm.Debug.values = {_op: _op
	                       ,log: log
	                       ,crash: crash
	                       ,watch: watch
	                       ,watchSummary: watchSummary
	                       ,trace: trace};
	   return _elm.Debug.values;
	};
	Elm.Dict = Elm.Dict || {};
	Elm.Dict.make = function (_elm) {
	   "use strict";
	   _elm.Dict = _elm.Dict || {};
	   if (_elm.Dict.values)
	   return _elm.Dict.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Dict",
	   $Basics = Elm.Basics.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Debug = Elm.Native.Debug.make(_elm),
	   $String = Elm.String.make(_elm);
	   var foldr = F3(function (f,
	   acc,
	   t) {
	      return function () {
	         switch (t.ctor)
	         {case "RBEmpty":
	            switch (t._0.ctor)
	              {case "LBlack": return acc;}
	              break;
	            case "RBNode": return A3(foldr,
	              f,
	              A3(f,
	              t._1,
	              t._2,
	              A3(foldr,f,acc,t._4)),
	              t._3);}
	         _U.badCase($moduleName,
	         "between lines 417 and 421");
	      }();
	   });
	   var keys = function (dict) {
	      return A3(foldr,
	      F3(function (key,
	      value,
	      keyList) {
	         return A2($List._op["::"],
	         key,
	         keyList);
	      }),
	      _L.fromArray([]),
	      dict);
	   };
	   var values = function (dict) {
	      return A3(foldr,
	      F3(function (key,
	      value,
	      valueList) {
	         return A2($List._op["::"],
	         value,
	         valueList);
	      }),
	      _L.fromArray([]),
	      dict);
	   };
	   var toList = function (dict) {
	      return A3(foldr,
	      F3(function (key,value,list) {
	         return A2($List._op["::"],
	         {ctor: "_Tuple2"
	         ,_0: key
	         ,_1: value},
	         list);
	      }),
	      _L.fromArray([]),
	      dict);
	   };
	   var foldl = F3(function (f,
	   acc,
	   dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBlack": return acc;}
	              break;
	            case "RBNode": return A3(foldl,
	              f,
	              A3(f,
	              dict._1,
	              dict._2,
	              A3(foldl,f,acc,dict._3)),
	              dict._4);}
	         _U.badCase($moduleName,
	         "between lines 406 and 410");
	      }();
	   });
	   var isBBlack = function (dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBBlack": return true;}
	              break;
	            case "RBNode":
	            switch (dict._0.ctor)
	              {case "BBlack": return true;}
	              break;}
	         return false;
	      }();
	   };
	   var showFlag = function (f) {
	      return function () {
	         switch (f.ctor)
	         {case "Insert": return "Insert";
	            case "Remove": return "Remove";
	            case "Same": return "Same";}
	         _U.badCase($moduleName,
	         "between lines 182 and 185");
	      }();
	   };
	   var Same = {ctor: "Same"};
	   var Remove = {ctor: "Remove"};
	   var Insert = {ctor: "Insert"};
	   var get = F2(function (targetKey,
	   dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBlack":
	                 return $Maybe.Nothing;}
	              break;
	            case "RBNode":
	            return function () {
	                 var _v29 = A2($Basics.compare,
	                 targetKey,
	                 dict._1);
	                 switch (_v29.ctor)
	                 {case "EQ":
	                    return $Maybe.Just(dict._2);
	                    case "GT": return A2(get,
	                      targetKey,
	                      dict._4);
	                    case "LT": return A2(get,
	                      targetKey,
	                      dict._3);}
	                 _U.badCase($moduleName,
	                 "between lines 129 and 132");
	              }();}
	         _U.badCase($moduleName,
	         "between lines 124 and 132");
	      }();
	   });
	   var member = F2(function (key,
	   dict) {
	      return function () {
	         var _v30 = A2(get,key,dict);
	         switch (_v30.ctor)
	         {case "Just": return true;
	            case "Nothing": return false;}
	         _U.badCase($moduleName,
	         "between lines 138 and 140");
	      }();
	   });
	   var max = function (dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            return $Native$Debug.crash("(max Empty) is not defined");
	            case "RBNode":
	            switch (dict._4.ctor)
	              {case "RBEmpty":
	                 return {ctor: "_Tuple2"
	                        ,_0: dict._1
	                        ,_1: dict._2};}
	              return max(dict._4);}
	         _U.badCase($moduleName,
	         "between lines 100 and 108");
	      }();
	   };
	   var min = function (dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBlack":
	                 return $Native$Debug.crash("(min Empty) is not defined");}
	              break;
	            case "RBNode":
	            switch (dict._3.ctor)
	              {case "RBEmpty":
	                 switch (dict._3._0.ctor)
	                   {case "LBlack":
	                      return {ctor: "_Tuple2"
	                             ,_0: dict._1
	                             ,_1: dict._2};}
	                   break;}
	              return min(dict._3);}
	         _U.badCase($moduleName,
	         "between lines 87 and 95");
	      }();
	   };
	   var RBEmpty = function (a) {
	      return {ctor: "RBEmpty"
	             ,_0: a};
	   };
	   var RBNode = F5(function (a,
	   b,
	   c,
	   d,
	   e) {
	      return {ctor: "RBNode"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d
	             ,_4: e};
	   });
	   var showLColor = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "LBBlack":
	            return "LBBlack";
	            case "LBlack": return "LBlack";}
	         _U.badCase($moduleName,
	         "between lines 70 and 72");
	      }();
	   };
	   var LBBlack = {ctor: "LBBlack"};
	   var LBlack = {ctor: "LBlack"};
	   var empty = RBEmpty(LBlack);
	   var isEmpty = function (dict) {
	      return _U.eq(dict,empty);
	   };
	   var map = F2(function (f,dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBlack":
	                 return RBEmpty(LBlack);}
	              break;
	            case "RBNode": return A5(RBNode,
	              dict._0,
	              dict._1,
	              A2(f,dict._1,dict._2),
	              A2(map,f,dict._3),
	              A2(map,f,dict._4));}
	         _U.badCase($moduleName,
	         "between lines 394 and 399");
	      }();
	   });
	   var showNColor = function (c) {
	      return function () {
	         switch (c.ctor)
	         {case "BBlack": return "BBlack";
	            case "Black": return "Black";
	            case "NBlack": return "NBlack";
	            case "Red": return "Red";}
	         _U.badCase($moduleName,
	         "between lines 56 and 60");
	      }();
	   };
	   var reportRemBug = F4(function (msg,
	   c,
	   lgot,
	   rgot) {
	      return $Native$Debug.crash($String.concat(_L.fromArray(["Internal red-black tree invariant violated, expected "
	                                                             ,msg
	                                                             ," and got "
	                                                             ,showNColor(c)
	                                                             ,"/"
	                                                             ,lgot
	                                                             ,"/"
	                                                             ,rgot
	                                                             ,"\nPlease report this bug to <https://github.com/elm-lang/Elm/issues>"])));
	   });
	   var NBlack = {ctor: "NBlack"};
	   var BBlack = {ctor: "BBlack"};
	   var Black = {ctor: "Black"};
	   var ensureBlackRoot = function (dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBlack": return dict;}
	              break;
	            case "RBNode":
	            switch (dict._0.ctor)
	              {case "Black": return dict;
	                 case "Red": return A5(RBNode,
	                   Black,
	                   dict._1,
	                   dict._2,
	                   dict._3,
	                   dict._4);}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 154 and 162");
	      }();
	   };
	   var blackish = function (t) {
	      return function () {
	         switch (t.ctor)
	         {case "RBEmpty": return true;
	            case "RBNode":
	            return _U.eq(t._0,
	              Black) || _U.eq(t._0,BBlack);}
	         _U.badCase($moduleName,
	         "between lines 339 and 341");
	      }();
	   };
	   var blacken = function (t) {
	      return function () {
	         switch (t.ctor)
	         {case "RBEmpty":
	            return RBEmpty(LBlack);
	            case "RBNode": return A5(RBNode,
	              Black,
	              t._1,
	              t._2,
	              t._3,
	              t._4);}
	         _U.badCase($moduleName,
	         "between lines 378 and 380");
	      }();
	   };
	   var Red = {ctor: "Red"};
	   var moreBlack = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "BBlack":
	            return $Native$Debug.crash("Can\'t make a double black node more black!");
	            case "Black": return BBlack;
	            case "NBlack": return Red;
	            case "Red": return Black;}
	         _U.badCase($moduleName,
	         "between lines 244 and 248");
	      }();
	   };
	   var lessBlack = function (color) {
	      return function () {
	         switch (color.ctor)
	         {case "BBlack": return Black;
	            case "Black": return Red;
	            case "NBlack":
	            return $Native$Debug.crash("Can\'t make a negative black node less black!");
	            case "Red": return NBlack;}
	         _U.badCase($moduleName,
	         "between lines 253 and 257");
	      }();
	   };
	   var lessBlackTree = function (dict) {
	      return function () {
	         switch (dict.ctor)
	         {case "RBEmpty":
	            switch (dict._0.ctor)
	              {case "LBBlack":
	                 return RBEmpty(LBlack);}
	              break;
	            case "RBNode": return A5(RBNode,
	              lessBlack(dict._0),
	              dict._1,
	              dict._2,
	              dict._3,
	              dict._4);}
	         _U.badCase($moduleName,
	         "between lines 262 and 264");
	      }();
	   };
	   var redden = function (t) {
	      return function () {
	         switch (t.ctor)
	         {case "RBEmpty":
	            return $Native$Debug.crash("can\'t make a Leaf red");
	            case "RBNode": return A5(RBNode,
	              Red,
	              t._1,
	              t._2,
	              t._3,
	              t._4);}
	         _U.badCase($moduleName,
	         "between lines 386 and 388");
	      }();
	   };
	   var balance_node = function (t) {
	      return function () {
	         var assemble = function (col) {
	            return function (xk) {
	               return function (xv) {
	                  return function (yk) {
	                     return function (yv) {
	                        return function (zk) {
	                           return function (zv) {
	                              return function (a) {
	                                 return function (b) {
	                                    return function (c) {
	                                       return function (d) {
	                                          return A5(RBNode,
	                                          lessBlack(col),
	                                          yk,
	                                          yv,
	                                          A5(RBNode,Black,xk,xv,a,b),
	                                          A5(RBNode,Black,zk,zv,c,d));
	                                       };
	                                    };
	                                 };
	                              };
	                           };
	                        };
	                     };
	                  };
	               };
	            };
	         };
	         return blackish(t) ? function () {
	            switch (t.ctor)
	            {case "RBNode":
	               switch (t._3.ctor)
	                 {case "RBNode":
	                    switch (t._3._0.ctor)
	                      {case "Red":
	                         switch (t._3._3.ctor)
	                           {case "RBNode":
	                              switch (t._3._3._0.ctor)
	                                {case "Red":
	                                   return assemble(t._0)(t._3._3._1)(t._3._3._2)(t._3._1)(t._3._2)(t._1)(t._2)(t._3._3._3)(t._3._3._4)(t._3._4)(t._4);}
	                                break;}
	                           switch (t._3._4.ctor)
	                           {case "RBNode":
	                              switch (t._3._4._0.ctor)
	                                {case "Red":
	                                   return assemble(t._0)(t._3._1)(t._3._2)(t._3._4._1)(t._3._4._2)(t._1)(t._2)(t._3._3)(t._3._4._3)(t._3._4._4)(t._4);}
	                                break;}
	                           break;}
	                      break;}
	                 switch (t._4.ctor)
	                 {case "RBNode":
	                    switch (t._4._0.ctor)
	                      {case "Red":
	                         switch (t._4._3.ctor)
	                           {case "RBNode":
	                              switch (t._4._3._0.ctor)
	                                {case "Red":
	                                   return assemble(t._0)(t._1)(t._2)(t._4._3._1)(t._4._3._2)(t._4._1)(t._4._2)(t._3)(t._4._3._3)(t._4._3._4)(t._4._4);}
	                                break;}
	                           switch (t._4._4.ctor)
	                           {case "RBNode":
	                              switch (t._4._4._0.ctor)
	                                {case "Red":
	                                   return assemble(t._0)(t._1)(t._2)(t._4._1)(t._4._2)(t._4._4._1)(t._4._4._2)(t._3)(t._4._3)(t._4._4._3)(t._4._4._4);}
	                                break;}
	                           break;}
	                      break;}
	                 switch (t._0.ctor)
	                 {case "BBlack":
	                    switch (t._4.ctor)
	                      {case "RBNode":
	                         switch (t._4._0.ctor)
	                           {case "NBlack":
	                              switch (t._4._3.ctor)
	                                {case "RBNode":
	                                   switch (t._4._3._0.ctor)
	                                     {case "Black":
	                                        return function () {
	                                             switch (t._4._4.ctor)
	                                             {case "RBNode":
	                                                switch (t._4._4._0.ctor)
	                                                  {case "Black":
	                                                     return A5(RBNode,
	                                                       Black,
	                                                       t._4._3._1,
	                                                       t._4._3._2,
	                                                       A5(RBNode,
	                                                       Black,
	                                                       t._1,
	                                                       t._2,
	                                                       t._3,
	                                                       t._4._3._3),
	                                                       A5(balance,
	                                                       Black,
	                                                       t._4._1,
	                                                       t._4._2,
	                                                       t._4._3._4,
	                                                       redden(t._4._4)));}
	                                                  break;}
	                                             return t;
	                                          }();}
	                                     break;}
	                                break;}
	                           break;}
	                      switch (t._3.ctor)
	                      {case "RBNode":
	                         switch (t._3._0.ctor)
	                           {case "NBlack":
	                              switch (t._3._4.ctor)
	                                {case "RBNode":
	                                   switch (t._3._4._0.ctor)
	                                     {case "Black":
	                                        return function () {
	                                             switch (t._3._3.ctor)
	                                             {case "RBNode":
	                                                switch (t._3._3._0.ctor)
	                                                  {case "Black":
	                                                     return A5(RBNode,
	                                                       Black,
	                                                       t._3._4._1,
	                                                       t._3._4._2,
	                                                       A5(balance,
	                                                       Black,
	                                                       t._3._1,
	                                                       t._3._2,
	                                                       redden(t._3._3),
	                                                       t._3._4._3),
	                                                       A5(RBNode,
	                                                       Black,
	                                                       t._1,
	                                                       t._2,
	                                                       t._3._4._4,
	                                                       t._4));}
	                                                  break;}
	                                             return t;
	                                          }();}
	                                     break;}
	                                break;}
	                           break;}
	                      break;}
	                 break;}
	            return t;
	         }() : t;
	      }();
	   };
	   var balance = F5(function (c,
	   k,
	   v,
	   l,
	   r) {
	      return balance_node(A5(RBNode,
	      c,
	      k,
	      v,
	      l,
	      r));
	   });
	   var bubble = F5(function (c,
	   k,
	   v,
	   l,
	   r) {
	      return isBBlack(l) || isBBlack(r) ? A5(balance,
	      moreBlack(c),
	      k,
	      v,
	      lessBlackTree(l),
	      lessBlackTree(r)) : A5(RBNode,
	      c,
	      k,
	      v,
	      l,
	      r);
	   });
	   var remove_max = F5(function (c,
	   k,
	   v,
	   l,
	   r) {
	      return function () {
	         switch (r.ctor)
	         {case "RBEmpty": return A3(rem,
	              c,
	              l,
	              r);
	            case "RBNode": return A5(bubble,
	              c,
	              k,
	              v,
	              l,
	              A5(remove_max,
	              r._0,
	              r._1,
	              r._2,
	              r._3,
	              r._4));}
	         _U.badCase($moduleName,
	         "between lines 323 and 328");
	      }();
	   });
	   var rem = F3(function (c,l,r) {
	      return function () {
	         var _v169 = {ctor: "_Tuple2"
	                     ,_0: l
	                     ,_1: r};
	         switch (_v169.ctor)
	         {case "_Tuple2":
	            switch (_v169._0.ctor)
	              {case "RBEmpty":
	                 switch (_v169._1.ctor)
	                   {case "RBEmpty":
	                      return function () {
	                           switch (c.ctor)
	                           {case "Black":
	                              return RBEmpty(LBBlack);
	                              case "Red":
	                              return RBEmpty(LBlack);}
	                           _U.badCase($moduleName,
	                           "between lines 282 and 286");
	                        }();
	                      case "RBNode":
	                      return function () {
	                           var _v191 = {ctor: "_Tuple3"
	                                       ,_0: c
	                                       ,_1: _v169._0._0
	                                       ,_2: _v169._1._0};
	                           switch (_v191.ctor)
	                           {case "_Tuple3":
	                              switch (_v191._0.ctor)
	                                {case "Black":
	                                   switch (_v191._1.ctor)
	                                     {case "LBlack":
	                                        switch (_v191._2.ctor)
	                                          {case "Red": return A5(RBNode,
	                                               Black,
	                                               _v169._1._1,
	                                               _v169._1._2,
	                                               _v169._1._3,
	                                               _v169._1._4);}
	                                          break;}
	                                     break;}
	                                break;}
	                           return A4(reportRemBug,
	                           "Black/LBlack/Red",
	                           c,
	                           showLColor(_v169._0._0),
	                           showNColor(_v169._1._0));
	                        }();}
	                   break;
	                 case "RBNode":
	                 switch (_v169._1.ctor)
	                   {case "RBEmpty":
	                      return function () {
	                           var _v195 = {ctor: "_Tuple3"
	                                       ,_0: c
	                                       ,_1: _v169._0._0
	                                       ,_2: _v169._1._0};
	                           switch (_v195.ctor)
	                           {case "_Tuple3":
	                              switch (_v195._0.ctor)
	                                {case "Black":
	                                   switch (_v195._1.ctor)
	                                     {case "Red":
	                                        switch (_v195._2.ctor)
	                                          {case "LBlack":
	                                             return A5(RBNode,
	                                               Black,
	                                               _v169._0._1,
	                                               _v169._0._2,
	                                               _v169._0._3,
	                                               _v169._0._4);}
	                                          break;}
	                                     break;}
	                                break;}
	                           return A4(reportRemBug,
	                           "Black/Red/LBlack",
	                           c,
	                           showNColor(_v169._0._0),
	                           showLColor(_v169._1._0));
	                        }();
	                      case "RBNode":
	                      return function () {
	                           var l$ = A5(remove_max,
	                           _v169._0._0,
	                           _v169._0._1,
	                           _v169._0._2,
	                           _v169._0._3,
	                           _v169._0._4);
	                           var r = A5(RBNode,
	                           _v169._1._0,
	                           _v169._1._1,
	                           _v169._1._2,
	                           _v169._1._3,
	                           _v169._1._4);
	                           var l = A5(RBNode,
	                           _v169._0._0,
	                           _v169._0._1,
	                           _v169._0._2,
	                           _v169._0._3,
	                           _v169._0._4);
	                           var $ = max(l),
	                           k = $._0,
	                           v = $._1;
	                           return A5(bubble,c,k,v,l$,r);
	                        }();}
	                   break;}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 280 and 309");
	      }();
	   });
	   var update = F3(function (k,
	   alter,
	   dict) {
	      return function () {
	         var up = function (dict) {
	            return function () {
	               switch (dict.ctor)
	               {case "RBEmpty":
	                  switch (dict._0.ctor)
	                    {case "LBlack":
	                       return function () {
	                            var _v206 = alter($Maybe.Nothing);
	                            switch (_v206.ctor)
	                            {case "Just":
	                               return {ctor: "_Tuple2"
	                                      ,_0: Insert
	                                      ,_1: A5(RBNode,
	                                      Red,
	                                      k,
	                                      _v206._0,
	                                      empty,
	                                      empty)};
	                               case "Nothing":
	                               return {ctor: "_Tuple2"
	                                      ,_0: Same
	                                      ,_1: empty};}
	                            _U.badCase($moduleName,
	                            "between lines 194 and 198");
	                         }();}
	                    break;
	                  case "RBNode":
	                  return function () {
	                       var _v208 = A2($Basics.compare,
	                       k,
	                       dict._1);
	                       switch (_v208.ctor)
	                       {case "EQ": return function () {
	                               var _v209 = alter($Maybe.Just(dict._2));
	                               switch (_v209.ctor)
	                               {case "Just":
	                                  return {ctor: "_Tuple2"
	                                         ,_0: Same
	                                         ,_1: A5(RBNode,
	                                         dict._0,
	                                         dict._1,
	                                         _v209._0,
	                                         dict._3,
	                                         dict._4)};
	                                  case "Nothing":
	                                  return {ctor: "_Tuple2"
	                                         ,_0: Remove
	                                         ,_1: A3(rem,
	                                         dict._0,
	                                         dict._3,
	                                         dict._4)};}
	                               _U.badCase($moduleName,
	                               "between lines 201 and 206");
	                            }();
	                          case "GT": return function () {
	                               var $ = up(dict._4),
	                               flag = $._0,
	                               newRight = $._1;
	                               return function () {
	                                  switch (flag.ctor)
	                                  {case "Insert":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Insert
	                                            ,_1: A5(balance,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            dict._3,
	                                            newRight)};
	                                     case "Remove":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Remove
	                                            ,_1: A5(bubble,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            dict._3,
	                                            newRight)};
	                                     case "Same":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Same
	                                            ,_1: A5(RBNode,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            dict._3,
	                                            newRight)};}
	                                  _U.badCase($moduleName,
	                                  "between lines 215 and 220");
	                               }();
	                            }();
	                          case "LT": return function () {
	                               var $ = up(dict._3),
	                               flag = $._0,
	                               newLeft = $._1;
	                               return function () {
	                                  switch (flag.ctor)
	                                  {case "Insert":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Insert
	                                            ,_1: A5(balance,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            newLeft,
	                                            dict._4)};
	                                     case "Remove":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Remove
	                                            ,_1: A5(bubble,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            newLeft,
	                                            dict._4)};
	                                     case "Same":
	                                     return {ctor: "_Tuple2"
	                                            ,_0: Same
	                                            ,_1: A5(RBNode,
	                                            dict._0,
	                                            dict._1,
	                                            dict._2,
	                                            newLeft,
	                                            dict._4)};}
	                                  _U.badCase($moduleName,
	                                  "between lines 208 and 213");
	                               }();
	                            }();}
	                       _U.badCase($moduleName,
	                       "between lines 199 and 220");
	                    }();}
	               _U.badCase($moduleName,
	               "between lines 192 and 220");
	            }();
	         };
	         var $ = up(dict),
	         flag = $._0,
	         updatedDict = $._1;
	         return function () {
	            switch (flag.ctor)
	            {case "Insert":
	               return ensureBlackRoot(updatedDict);
	               case "Remove":
	               return blacken(updatedDict);
	               case "Same":
	               return updatedDict;}
	            _U.badCase($moduleName,
	            "between lines 222 and 225");
	         }();
	      }();
	   });
	   var insert = F3(function (key,
	   value,
	   dict) {
	      return A3(update,
	      key,
	      $Basics.always($Maybe.Just(value)),
	      dict);
	   });
	   var singleton = F2(function (key,
	   value) {
	      return A3(insert,
	      key,
	      value,
	      empty);
	   });
	   var union = F2(function (t1,
	   t2) {
	      return A3(foldl,
	      insert,
	      t2,
	      t1);
	   });
	   var fromList = function (assocs) {
	      return A3($List.foldl,
	      F2(function (_v214,dict) {
	         return function () {
	            switch (_v214.ctor)
	            {case "_Tuple2":
	               return A3(insert,
	                 _v214._0,
	                 _v214._1,
	                 dict);}
	            _U.badCase($moduleName,
	            "on line 466, column 38 to 59");
	         }();
	      }),
	      empty,
	      assocs);
	   };
	   var filter = F2(function (predicate,
	   dictionary) {
	      return function () {
	         var add = F3(function (key,
	         value,
	         dict) {
	            return A2(predicate,
	            key,
	            value) ? A3(insert,
	            key,
	            value,
	            dict) : dict;
	         });
	         return A3(foldl,
	         add,
	         empty,
	         dictionary);
	      }();
	   });
	   var intersect = F2(function (t1,
	   t2) {
	      return A2(filter,
	      F2(function (k,_v218) {
	         return function () {
	            return A2(member,k,t2);
	         }();
	      }),
	      t1);
	   });
	   var partition = F2(function (predicate,
	   dict) {
	      return function () {
	         var add = F3(function (key,
	         value,
	         _v220) {
	            return function () {
	               switch (_v220.ctor)
	               {case "_Tuple2":
	                  return A2(predicate,
	                    key,
	                    value) ? {ctor: "_Tuple2"
	                             ,_0: A3(insert,
	                             key,
	                             value,
	                             _v220._0)
	                             ,_1: _v220._1} : {ctor: "_Tuple2"
	                                              ,_0: _v220._0
	                                              ,_1: A3(insert,
	                                              key,
	                                              value,
	                                              _v220._1)};}
	               _U.badCase($moduleName,
	               "between lines 487 and 489");
	            }();
	         });
	         return A3(foldl,
	         add,
	         {ctor: "_Tuple2"
	         ,_0: empty
	         ,_1: empty},
	         dict);
	      }();
	   });
	   var remove = F2(function (key,
	   dict) {
	      return A3(update,
	      key,
	      $Basics.always($Maybe.Nothing),
	      dict);
	   });
	   var diff = F2(function (t1,t2) {
	      return A3(foldl,
	      F3(function (k,v,t) {
	         return A2(remove,k,t);
	      }),
	      t1,
	      t2);
	   });
	   _elm.Dict.values = {_op: _op
	                      ,empty: empty
	                      ,singleton: singleton
	                      ,insert: insert
	                      ,update: update
	                      ,isEmpty: isEmpty
	                      ,get: get
	                      ,remove: remove
	                      ,member: member
	                      ,filter: filter
	                      ,partition: partition
	                      ,foldl: foldl
	                      ,foldr: foldr
	                      ,map: map
	                      ,union: union
	                      ,intersect: intersect
	                      ,diff: diff
	                      ,keys: keys
	                      ,values: values
	                      ,toList: toList
	                      ,fromList: fromList};
	   return _elm.Dict.values;
	};
	Elm.Graphics = Elm.Graphics || {};
	Elm.Graphics.Collage = Elm.Graphics.Collage || {};
	Elm.Graphics.Collage.make = function (_elm) {
	   "use strict";
	   _elm.Graphics = _elm.Graphics || {};
	   _elm.Graphics.Collage = _elm.Graphics.Collage || {};
	   if (_elm.Graphics.Collage.values)
	   return _elm.Graphics.Collage.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Graphics.Collage",
	   $Basics = Elm.Basics.make(_elm),
	   $Color = Elm.Color.make(_elm),
	   $Graphics$Element = Elm.Graphics.Element.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Native$Graphics$Collage = Elm.Native.Graphics.Collage.make(_elm),
	   $Text = Elm.Text.make(_elm),
	   $Transform2D = Elm.Transform2D.make(_elm);
	   var ngon = F2(function (n,r) {
	      return function () {
	         var m = $Basics.toFloat(n);
	         var t = 2 * $Basics.pi / m;
	         var f = function (i) {
	            return {ctor: "_Tuple2"
	                   ,_0: r * $Basics.cos(t * i)
	                   ,_1: r * $Basics.sin(t * i)};
	         };
	         return A2($List.map,
	         f,
	         _L.range(0,m - 1));
	      }();
	   });
	   var oval = F2(function (w,h) {
	      return function () {
	         var hh = h / 2;
	         var hw = w / 2;
	         var n = 50;
	         var t = 2 * $Basics.pi / n;
	         var f = function (i) {
	            return {ctor: "_Tuple2"
	                   ,_0: hw * $Basics.cos(t * i)
	                   ,_1: hh * $Basics.sin(t * i)};
	         };
	         return A2($List.map,
	         f,
	         _L.range(0,n - 1));
	      }();
	   });
	   var circle = function (r) {
	      return A2(oval,2 * r,2 * r);
	   };
	   var rect = F2(function (w,h) {
	      return function () {
	         var hh = h / 2;
	         var hw = w / 2;
	         return _L.fromArray([{ctor: "_Tuple2"
	                              ,_0: 0 - hw
	                              ,_1: 0 - hh}
	                             ,{ctor: "_Tuple2"
	                              ,_0: 0 - hw
	                              ,_1: hh}
	                             ,{ctor: "_Tuple2",_0: hw,_1: hh}
	                             ,{ctor: "_Tuple2"
	                              ,_0: hw
	                              ,_1: 0 - hh}]);
	      }();
	   });
	   var square = function (n) {
	      return A2(rect,n,n);
	   };
	   var polygon = function (points) {
	      return points;
	   };
	   var segment = F2(function (p1,
	   p2) {
	      return _L.fromArray([p1,p2]);
	   });
	   var path = function (ps) {
	      return ps;
	   };
	   var collage = $Native$Graphics$Collage.collage;
	   var alpha = F2(function (a,f) {
	      return _U.replace([["alpha"
	                         ,a]],
	      f);
	   });
	   var rotate = F2(function (t,f) {
	      return _U.replace([["theta"
	                         ,f.theta + t]],
	      f);
	   });
	   var scale = F2(function (s,f) {
	      return _U.replace([["scale"
	                         ,f.scale * s]],
	      f);
	   });
	   var moveY = F2(function (y,f) {
	      return _U.replace([["y"
	                         ,f.y + y]],
	      f);
	   });
	   var moveX = F2(function (x,f) {
	      return _U.replace([["x"
	                         ,f.x + x]],
	      f);
	   });
	   var move = F2(function (_v0,f) {
	      return function () {
	         switch (_v0.ctor)
	         {case "_Tuple2":
	            return _U.replace([["x"
	                               ,f.x + _v0._0]
	                              ,["y",f.y + _v0._1]],
	              f);}
	         _U.badCase($moduleName,
	         "on line 226, column 3 to 37");
	      }();
	   });
	   var form = function (f) {
	      return {_: {}
	             ,alpha: 1
	             ,form: f
	             ,scale: 1
	             ,theta: 0
	             ,x: 0
	             ,y: 0};
	   };
	   var Fill = function (a) {
	      return {ctor: "Fill",_0: a};
	   };
	   var Line = function (a) {
	      return {ctor: "Line",_0: a};
	   };
	   var FGroup = F2(function (a,b) {
	      return {ctor: "FGroup"
	             ,_0: a
	             ,_1: b};
	   });
	   var group = function (fs) {
	      return form(A2(FGroup,
	      $Transform2D.identity,
	      fs));
	   };
	   var groupTransform = F2(function (matrix,
	   fs) {
	      return form(A2(FGroup,
	      matrix,
	      fs));
	   });
	   var FElement = function (a) {
	      return {ctor: "FElement"
	             ,_0: a};
	   };
	   var toForm = function (e) {
	      return form(FElement(e));
	   };
	   var FImage = F4(function (a,
	   b,
	   c,
	   d) {
	      return {ctor: "FImage"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d};
	   });
	   var sprite = F4(function (w,
	   h,
	   pos,
	   src) {
	      return form(A4(FImage,
	      w,
	      h,
	      pos,
	      src));
	   });
	   var FText = function (a) {
	      return {ctor: "FText",_0: a};
	   };
	   var text = function (t) {
	      return form(FText(t));
	   };
	   var FOutlinedText = F2(function (a,
	   b) {
	      return {ctor: "FOutlinedText"
	             ,_0: a
	             ,_1: b};
	   });
	   var outlinedText = F2(function (ls,
	   t) {
	      return form(A2(FOutlinedText,
	      ls,
	      t));
	   });
	   var FShape = F2(function (a,b) {
	      return {ctor: "FShape"
	             ,_0: a
	             ,_1: b};
	   });
	   var fill = F2(function (style,
	   shape) {
	      return form(A2(FShape,
	      Fill(style),
	      shape));
	   });
	   var outlined = F2(function (style,
	   shape) {
	      return form(A2(FShape,
	      Line(style),
	      shape));
	   });
	   var FPath = F2(function (a,b) {
	      return {ctor: "FPath"
	             ,_0: a
	             ,_1: b};
	   });
	   var traced = F2(function (style,
	   path) {
	      return form(A2(FPath,
	      style,
	      path));
	   });
	   var LineStyle = F6(function (a,
	   b,
	   c,
	   d,
	   e,
	   f) {
	      return {_: {}
	             ,cap: c
	             ,color: a
	             ,dashOffset: f
	             ,dashing: e
	             ,join: d
	             ,width: b};
	   });
	   var Clipped = {ctor: "Clipped"};
	   var Sharp = function (a) {
	      return {ctor: "Sharp",_0: a};
	   };
	   var Smooth = {ctor: "Smooth"};
	   var Padded = {ctor: "Padded"};
	   var Round = {ctor: "Round"};
	   var Flat = {ctor: "Flat"};
	   var defaultLine = {_: {}
	                     ,cap: Flat
	                     ,color: $Color.black
	                     ,dashOffset: 0
	                     ,dashing: _L.fromArray([])
	                     ,join: Sharp(10)
	                     ,width: 1};
	   var solid = function (clr) {
	      return _U.replace([["color"
	                         ,clr]],
	      defaultLine);
	   };
	   var dashed = function (clr) {
	      return _U.replace([["color"
	                         ,clr]
	                        ,["dashing"
	                         ,_L.fromArray([8,4])]],
	      defaultLine);
	   };
	   var dotted = function (clr) {
	      return _U.replace([["color"
	                         ,clr]
	                        ,["dashing"
	                         ,_L.fromArray([3,3])]],
	      defaultLine);
	   };
	   var Grad = function (a) {
	      return {ctor: "Grad",_0: a};
	   };
	   var gradient = F2(function (grad,
	   shape) {
	      return A2(fill,
	      Grad(grad),
	      shape);
	   });
	   var Texture = function (a) {
	      return {ctor: "Texture"
	             ,_0: a};
	   };
	   var textured = F2(function (src,
	   shape) {
	      return A2(fill,
	      Texture(src),
	      shape);
	   });
	   var Solid = function (a) {
	      return {ctor: "Solid",_0: a};
	   };
	   var filled = F2(function (color,
	   shape) {
	      return A2(fill,
	      Solid(color),
	      shape);
	   });
	   var Form = F6(function (a,
	   b,
	   c,
	   d,
	   e,
	   f) {
	      return {_: {}
	             ,alpha: e
	             ,form: f
	             ,scale: b
	             ,theta: a
	             ,x: c
	             ,y: d};
	   });
	   _elm.Graphics.Collage.values = {_op: _op
	                                  ,collage: collage
	                                  ,toForm: toForm
	                                  ,filled: filled
	                                  ,textured: textured
	                                  ,gradient: gradient
	                                  ,outlined: outlined
	                                  ,traced: traced
	                                  ,text: text
	                                  ,outlinedText: outlinedText
	                                  ,move: move
	                                  ,moveX: moveX
	                                  ,moveY: moveY
	                                  ,scale: scale
	                                  ,rotate: rotate
	                                  ,alpha: alpha
	                                  ,group: group
	                                  ,groupTransform: groupTransform
	                                  ,rect: rect
	                                  ,oval: oval
	                                  ,square: square
	                                  ,circle: circle
	                                  ,ngon: ngon
	                                  ,polygon: polygon
	                                  ,segment: segment
	                                  ,path: path
	                                  ,solid: solid
	                                  ,dashed: dashed
	                                  ,dotted: dotted
	                                  ,defaultLine: defaultLine
	                                  ,Form: Form
	                                  ,LineStyle: LineStyle
	                                  ,Flat: Flat
	                                  ,Round: Round
	                                  ,Padded: Padded
	                                  ,Smooth: Smooth
	                                  ,Sharp: Sharp
	                                  ,Clipped: Clipped};
	   return _elm.Graphics.Collage.values;
	};
	Elm.Graphics = Elm.Graphics || {};
	Elm.Graphics.Element = Elm.Graphics.Element || {};
	Elm.Graphics.Element.make = function (_elm) {
	   "use strict";
	   _elm.Graphics = _elm.Graphics || {};
	   _elm.Graphics.Element = _elm.Graphics.Element || {};
	   if (_elm.Graphics.Element.values)
	   return _elm.Graphics.Element.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Graphics.Element",
	   $Basics = Elm.Basics.make(_elm),
	   $Color = Elm.Color.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Graphics$Element = Elm.Native.Graphics.Element.make(_elm),
	   $Text = Elm.Text.make(_elm);
	   var DOut = {ctor: "DOut"};
	   var outward = DOut;
	   var DIn = {ctor: "DIn"};
	   var inward = DIn;
	   var DRight = {ctor: "DRight"};
	   var right = DRight;
	   var DLeft = {ctor: "DLeft"};
	   var left = DLeft;
	   var DDown = {ctor: "DDown"};
	   var down = DDown;
	   var DUp = {ctor: "DUp"};
	   var up = DUp;
	   var Position = F4(function (a,
	   b,
	   c,
	   d) {
	      return {_: {}
	             ,horizontal: a
	             ,vertical: b
	             ,x: c
	             ,y: d};
	   });
	   var Relative = function (a) {
	      return {ctor: "Relative"
	             ,_0: a};
	   };
	   var relative = Relative;
	   var Absolute = function (a) {
	      return {ctor: "Absolute"
	             ,_0: a};
	   };
	   var absolute = Absolute;
	   var N = {ctor: "N"};
	   var bottomLeftAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: N
	             ,vertical: N
	             ,x: x
	             ,y: y};
	   });
	   var Z = {ctor: "Z"};
	   var middle = {_: {}
	                ,horizontal: Z
	                ,vertical: Z
	                ,x: Relative(0.5)
	                ,y: Relative(0.5)};
	   var midLeft = _U.replace([["horizontal"
	                             ,N]
	                            ,["x",Absolute(0)]],
	   middle);
	   var middleAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: Z
	             ,vertical: Z
	             ,x: x
	             ,y: y};
	   });
	   var midLeftAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: N
	             ,vertical: Z
	             ,x: x
	             ,y: y};
	   });
	   var midBottomAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: Z
	             ,vertical: N
	             ,x: x
	             ,y: y};
	   });
	   var P = {ctor: "P"};
	   var topLeft = {_: {}
	                 ,horizontal: N
	                 ,vertical: P
	                 ,x: Absolute(0)
	                 ,y: Absolute(0)};
	   var bottomLeft = _U.replace([["vertical"
	                                ,N]],
	   topLeft);
	   var topRight = _U.replace([["horizontal"
	                              ,P]],
	   topLeft);
	   var bottomRight = _U.replace([["horizontal"
	                                 ,P]],
	   bottomLeft);
	   var midRight = _U.replace([["horizontal"
	                              ,P]],
	   midLeft);
	   var midTop = _U.replace([["vertical"
	                            ,P]
	                           ,["y",Absolute(0)]],
	   middle);
	   var midBottom = _U.replace([["vertical"
	                               ,N]],
	   midTop);
	   var topLeftAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: N
	             ,vertical: P
	             ,x: x
	             ,y: y};
	   });
	   var topRightAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: P
	             ,vertical: P
	             ,x: x
	             ,y: y};
	   });
	   var bottomRightAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: P
	             ,vertical: N
	             ,x: x
	             ,y: y};
	   });
	   var midRightAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: P
	             ,vertical: Z
	             ,x: x
	             ,y: y};
	   });
	   var midTopAt = F2(function (x,
	   y) {
	      return {_: {}
	             ,horizontal: Z
	             ,vertical: P
	             ,x: x
	             ,y: y};
	   });
	   var justified = $Native$Graphics$Element.block("justify");
	   var centered = $Native$Graphics$Element.block("center");
	   var rightAligned = $Native$Graphics$Element.block("right");
	   var leftAligned = $Native$Graphics$Element.block("left");
	   var show = function (value) {
	      return leftAligned($Text.monospace($Text.fromString($Basics.toString(value))));
	   };
	   var Tiled = {ctor: "Tiled"};
	   var Cropped = function (a) {
	      return {ctor: "Cropped"
	             ,_0: a};
	   };
	   var Fitted = {ctor: "Fitted"};
	   var Plain = {ctor: "Plain"};
	   var Custom = {ctor: "Custom"};
	   var RawHtml = {ctor: "RawHtml"};
	   var Spacer = {ctor: "Spacer"};
	   var Flow = F2(function (a,b) {
	      return {ctor: "Flow"
	             ,_0: a
	             ,_1: b};
	   });
	   var Container = F2(function (a,
	   b) {
	      return {ctor: "Container"
	             ,_0: a
	             ,_1: b};
	   });
	   var Image = F4(function (a,
	   b,
	   c,
	   d) {
	      return {ctor: "Image"
	             ,_0: a
	             ,_1: b
	             ,_2: c
	             ,_3: d};
	   });
	   var newElement = $Native$Graphics$Element.newElement;
	   var image = F3(function (w,
	   h,
	   src) {
	      return A3(newElement,
	      w,
	      h,
	      A4(Image,Plain,w,h,src));
	   });
	   var fittedImage = F3(function (w,
	   h,
	   src) {
	      return A3(newElement,
	      w,
	      h,
	      A4(Image,Fitted,w,h,src));
	   });
	   var croppedImage = F4(function (pos,
	   w,
	   h,
	   src) {
	      return A3(newElement,
	      w,
	      h,
	      A4(Image,Cropped(pos),w,h,src));
	   });
	   var tiledImage = F3(function (w,
	   h,
	   src) {
	      return A3(newElement,
	      w,
	      h,
	      A4(Image,Tiled,w,h,src));
	   });
	   var container = F4(function (w,
	   h,
	   pos,
	   e) {
	      return A3(newElement,
	      w,
	      h,
	      A2(Container,pos,e));
	   });
	   var spacer = F2(function (w,h) {
	      return A3(newElement,
	      w,
	      h,
	      Spacer);
	   });
	   var link = F2(function (href,
	   e) {
	      return function () {
	         var p = e.props;
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["href"
	                                    ,href]],
	                p)};
	      }();
	   });
	   var tag = F2(function (name,e) {
	      return function () {
	         var p = e.props;
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["tag"
	                                    ,name]],
	                p)};
	      }();
	   });
	   var color = F2(function (c,e) {
	      return function () {
	         var p = e.props;
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["color"
	                                    ,$Maybe.Just(c)]],
	                p)};
	      }();
	   });
	   var opacity = F2(function (o,
	   e) {
	      return function () {
	         var p = e.props;
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["opacity"
	                                    ,o]],
	                p)};
	      }();
	   });
	   var height = F2(function (nh,
	   e) {
	      return function () {
	         var p = e.props;
	         var props = function () {
	            var _v0 = e.element;
	            switch (_v0.ctor)
	            {case "Image":
	               return _U.replace([["width"
	                                  ,$Basics.round($Basics.toFloat(_v0._1) / $Basics.toFloat(_v0._2) * $Basics.toFloat(nh))]],
	                 p);}
	            return p;
	         }();
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["height"
	                                    ,nh]],
	                p)};
	      }();
	   });
	   var width = F2(function (nw,e) {
	      return function () {
	         var p = e.props;
	         var props = function () {
	            var _v5 = e.element;
	            switch (_v5.ctor)
	            {case "Image":
	               return _U.replace([["height"
	                                  ,$Basics.round($Basics.toFloat(_v5._2) / $Basics.toFloat(_v5._1) * $Basics.toFloat(nw))]],
	                 p);
	               case "RawHtml":
	               return _U.replace([["height"
	                                  ,$Basics.snd(A2($Native$Graphics$Element.htmlHeight,
	                                  nw,
	                                  e.element))]],
	                 p);}
	            return p;
	         }();
	         return {_: {}
	                ,element: e.element
	                ,props: _U.replace([["width"
	                                    ,nw]],
	                props)};
	      }();
	   });
	   var size = F3(function (w,h,e) {
	      return A2(height,
	      h,
	      A2(width,w,e));
	   });
	   var sizeOf = function (e) {
	      return {ctor: "_Tuple2"
	             ,_0: e.props.width
	             ,_1: e.props.height};
	   };
	   var heightOf = function (e) {
	      return e.props.height;
	   };
	   var widthOf = function (e) {
	      return e.props.width;
	   };
	   var above = F2(function (hi,
	   lo) {
	      return A3(newElement,
	      A2($Basics.max,
	      widthOf(hi),
	      widthOf(lo)),
	      heightOf(hi) + heightOf(lo),
	      A2(Flow,
	      DDown,
	      _L.fromArray([hi,lo])));
	   });
	   var below = F2(function (lo,
	   hi) {
	      return A3(newElement,
	      A2($Basics.max,
	      widthOf(hi),
	      widthOf(lo)),
	      heightOf(hi) + heightOf(lo),
	      A2(Flow,
	      DDown,
	      _L.fromArray([hi,lo])));
	   });
	   var beside = F2(function (lft,
	   rht) {
	      return A3(newElement,
	      widthOf(lft) + widthOf(rht),
	      A2($Basics.max,
	      heightOf(lft),
	      heightOf(rht)),
	      A2(Flow,
	      right,
	      _L.fromArray([lft,rht])));
	   });
	   var layers = function (es) {
	      return function () {
	         var hs = A2($List.map,
	         heightOf,
	         es);
	         var ws = A2($List.map,
	         widthOf,
	         es);
	         return A3(newElement,
	         A2($Maybe.withDefault,
	         0,
	         $List.maximum(ws)),
	         A2($Maybe.withDefault,
	         0,
	         $List.maximum(hs)),
	         A2(Flow,DOut,es));
	      }();
	   };
	   var empty = A2(spacer,0,0);
	   var flow = F2(function (dir,
	   es) {
	      return function () {
	         var newFlow = F2(function (w,
	         h) {
	            return A3(newElement,
	            w,
	            h,
	            A2(Flow,dir,es));
	         });
	         var maxOrZero = function (list) {
	            return A2($Maybe.withDefault,
	            0,
	            $List.maximum(list));
	         };
	         var hs = A2($List.map,
	         heightOf,
	         es);
	         var ws = A2($List.map,
	         widthOf,
	         es);
	         return _U.eq(es,
	         _L.fromArray([])) ? empty : function () {
	            switch (dir.ctor)
	            {case "DDown":
	               return A2(newFlow,
	                 maxOrZero(ws),
	                 $List.sum(hs));
	               case "DIn": return A2(newFlow,
	                 maxOrZero(ws),
	                 maxOrZero(hs));
	               case "DLeft": return A2(newFlow,
	                 $List.sum(ws),
	                 maxOrZero(hs));
	               case "DOut": return A2(newFlow,
	                 maxOrZero(ws),
	                 maxOrZero(hs));
	               case "DRight":
	               return A2(newFlow,
	                 $List.sum(ws),
	                 maxOrZero(hs));
	               case "DUp": return A2(newFlow,
	                 maxOrZero(ws),
	                 $List.sum(hs));}
	            _U.badCase($moduleName,
	            "between lines 362 and 368");
	         }();
	      }();
	   });
	   var Properties = F9(function (a,
	   b,
	   c,
	   d,
	   e,
	   f,
	   g,
	   h,
	   i) {
	      return {_: {}
	             ,click: i
	             ,color: e
	             ,height: c
	             ,hover: h
	             ,href: f
	             ,id: a
	             ,opacity: d
	             ,tag: g
	             ,width: b};
	   });
	   var Element = F2(function (a,
	   b) {
	      return {_: {}
	             ,element: b
	             ,props: a};
	   });
	   _elm.Graphics.Element.values = {_op: _op
	                                  ,image: image
	                                  ,fittedImage: fittedImage
	                                  ,croppedImage: croppedImage
	                                  ,tiledImage: tiledImage
	                                  ,leftAligned: leftAligned
	                                  ,rightAligned: rightAligned
	                                  ,centered: centered
	                                  ,justified: justified
	                                  ,show: show
	                                  ,width: width
	                                  ,height: height
	                                  ,size: size
	                                  ,color: color
	                                  ,opacity: opacity
	                                  ,link: link
	                                  ,tag: tag
	                                  ,widthOf: widthOf
	                                  ,heightOf: heightOf
	                                  ,sizeOf: sizeOf
	                                  ,flow: flow
	                                  ,up: up
	                                  ,down: down
	                                  ,left: left
	                                  ,right: right
	                                  ,inward: inward
	                                  ,outward: outward
	                                  ,layers: layers
	                                  ,above: above
	                                  ,below: below
	                                  ,beside: beside
	                                  ,empty: empty
	                                  ,spacer: spacer
	                                  ,container: container
	                                  ,middle: middle
	                                  ,midTop: midTop
	                                  ,midBottom: midBottom
	                                  ,midLeft: midLeft
	                                  ,midRight: midRight
	                                  ,topLeft: topLeft
	                                  ,topRight: topRight
	                                  ,bottomLeft: bottomLeft
	                                  ,bottomRight: bottomRight
	                                  ,absolute: absolute
	                                  ,relative: relative
	                                  ,middleAt: middleAt
	                                  ,midTopAt: midTopAt
	                                  ,midBottomAt: midBottomAt
	                                  ,midLeftAt: midLeftAt
	                                  ,midRightAt: midRightAt
	                                  ,topLeftAt: topLeftAt
	                                  ,topRightAt: topRightAt
	                                  ,bottomLeftAt: bottomLeftAt
	                                  ,bottomRightAt: bottomRightAt
	                                  ,Element: Element
	                                  ,Position: Position};
	   return _elm.Graphics.Element.values;
	};
	Elm.Html = Elm.Html || {};
	Elm.Html.make = function (_elm) {
	   "use strict";
	   _elm.Html = _elm.Html || {};
	   if (_elm.Html.values)
	   return _elm.Html.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Html",
	   $Basics = Elm.Basics.make(_elm),
	   $Graphics$Element = Elm.Graphics.Element.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Result = Elm.Result.make(_elm),
	   $Signal = Elm.Signal.make(_elm),
	   $VirtualDom = Elm.VirtualDom.make(_elm);
	   var fromElement = $VirtualDom.fromElement;
	   var toElement = $VirtualDom.toElement;
	   var text = $VirtualDom.text;
	   var node = $VirtualDom.node;
	   var body = node("body");
	   var section = node("section");
	   var nav = node("nav");
	   var article = node("article");
	   var aside = node("aside");
	   var h1 = node("h1");
	   var h2 = node("h2");
	   var h3 = node("h3");
	   var h4 = node("h4");
	   var h5 = node("h5");
	   var h6 = node("h6");
	   var header = node("header");
	   var footer = node("footer");
	   var address = node("address");
	   var main$ = node("main");
	   var p = node("p");
	   var hr = node("hr");
	   var pre = node("pre");
	   var blockquote = node("blockquote");
	   var ol = node("ol");
	   var ul = node("ul");
	   var li = node("li");
	   var dl = node("dl");
	   var dt = node("dt");
	   var dd = node("dd");
	   var figure = node("figure");
	   var figcaption = node("figcaption");
	   var div = node("div");
	   var a = node("a");
	   var em = node("em");
	   var strong = node("strong");
	   var small = node("small");
	   var s = node("s");
	   var cite = node("cite");
	   var q = node("q");
	   var dfn = node("dfn");
	   var abbr = node("abbr");
	   var time = node("time");
	   var code = node("code");
	   var $var = node("var");
	   var samp = node("samp");
	   var kbd = node("kbd");
	   var sub = node("sub");
	   var sup = node("sup");
	   var i = node("i");
	   var b = node("b");
	   var u = node("u");
	   var mark = node("mark");
	   var ruby = node("ruby");
	   var rt = node("rt");
	   var rp = node("rp");
	   var bdi = node("bdi");
	   var bdo = node("bdo");
	   var span = node("span");
	   var br = node("br");
	   var wbr = node("wbr");
	   var ins = node("ins");
	   var del = node("del");
	   var img = node("img");
	   var iframe = node("iframe");
	   var embed = node("embed");
	   var object = node("object");
	   var param = node("param");
	   var video = node("video");
	   var audio = node("audio");
	   var source = node("source");
	   var track = node("track");
	   var canvas = node("canvas");
	   var svg = node("svg");
	   var math = node("math");
	   var table = node("table");
	   var caption = node("caption");
	   var colgroup = node("colgroup");
	   var col = node("col");
	   var tbody = node("tbody");
	   var thead = node("thead");
	   var tfoot = node("tfoot");
	   var tr = node("tr");
	   var td = node("td");
	   var th = node("th");
	   var form = node("form");
	   var fieldset = node("fieldset");
	   var legend = node("legend");
	   var label = node("label");
	   var input = node("input");
	   var button = node("button");
	   var select = node("select");
	   var datalist = node("datalist");
	   var optgroup = node("optgroup");
	   var option = node("option");
	   var textarea = node("textarea");
	   var keygen = node("keygen");
	   var output = node("output");
	   var progress = node("progress");
	   var meter = node("meter");
	   var details = node("details");
	   var summary = node("summary");
	   var menuitem = node("menuitem");
	   var menu = node("menu");
	   _elm.Html.values = {_op: _op
	                      ,node: node
	                      ,text: text
	                      ,toElement: toElement
	                      ,fromElement: fromElement
	                      ,body: body
	                      ,section: section
	                      ,nav: nav
	                      ,article: article
	                      ,aside: aside
	                      ,h1: h1
	                      ,h2: h2
	                      ,h3: h3
	                      ,h4: h4
	                      ,h5: h5
	                      ,h6: h6
	                      ,header: header
	                      ,footer: footer
	                      ,address: address
	                      ,main$: main$
	                      ,p: p
	                      ,hr: hr
	                      ,pre: pre
	                      ,blockquote: blockquote
	                      ,ol: ol
	                      ,ul: ul
	                      ,li: li
	                      ,dl: dl
	                      ,dt: dt
	                      ,dd: dd
	                      ,figure: figure
	                      ,figcaption: figcaption
	                      ,div: div
	                      ,a: a
	                      ,em: em
	                      ,strong: strong
	                      ,small: small
	                      ,s: s
	                      ,cite: cite
	                      ,q: q
	                      ,dfn: dfn
	                      ,abbr: abbr
	                      ,time: time
	                      ,code: code
	                      ,$var: $var
	                      ,samp: samp
	                      ,kbd: kbd
	                      ,sub: sub
	                      ,sup: sup
	                      ,i: i
	                      ,b: b
	                      ,u: u
	                      ,mark: mark
	                      ,ruby: ruby
	                      ,rt: rt
	                      ,rp: rp
	                      ,bdi: bdi
	                      ,bdo: bdo
	                      ,span: span
	                      ,br: br
	                      ,wbr: wbr
	                      ,ins: ins
	                      ,del: del
	                      ,img: img
	                      ,iframe: iframe
	                      ,embed: embed
	                      ,object: object
	                      ,param: param
	                      ,video: video
	                      ,audio: audio
	                      ,source: source
	                      ,track: track
	                      ,canvas: canvas
	                      ,svg: svg
	                      ,math: math
	                      ,table: table
	                      ,caption: caption
	                      ,colgroup: colgroup
	                      ,col: col
	                      ,tbody: tbody
	                      ,thead: thead
	                      ,tfoot: tfoot
	                      ,tr: tr
	                      ,td: td
	                      ,th: th
	                      ,form: form
	                      ,fieldset: fieldset
	                      ,legend: legend
	                      ,label: label
	                      ,input: input
	                      ,button: button
	                      ,select: select
	                      ,datalist: datalist
	                      ,optgroup: optgroup
	                      ,option: option
	                      ,textarea: textarea
	                      ,keygen: keygen
	                      ,output: output
	                      ,progress: progress
	                      ,meter: meter
	                      ,details: details
	                      ,summary: summary
	                      ,menuitem: menuitem
	                      ,menu: menu};
	   return _elm.Html.values;
	};
	Elm.Html = Elm.Html || {};
	Elm.Html.Events = Elm.Html.Events || {};
	Elm.Html.Events.make = function (_elm) {
	   "use strict";
	   _elm.Html = _elm.Html || {};
	   _elm.Html.Events = _elm.Html.Events || {};
	   if (_elm.Html.Events.values)
	   return _elm.Html.Events.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Html.Events",
	   $Basics = Elm.Basics.make(_elm),
	   $Html = Elm.Html.make(_elm),
	   $Json$Decode = Elm.Json.Decode.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Result = Elm.Result.make(_elm),
	   $Signal = Elm.Signal.make(_elm),
	   $VirtualDom = Elm.VirtualDom.make(_elm);
	   var keyCode = A2($Json$Decode._op[":="],
	   "keyCode",
	   $Json$Decode.$int);
	   var targetChecked = A2($Json$Decode.at,
	   _L.fromArray(["target"
	                ,"checked"]),
	   $Json$Decode.bool);
	   var targetValue = A2($Json$Decode.at,
	   _L.fromArray(["target"
	                ,"value"]),
	   $Json$Decode.string);
	   var defaultOptions = $VirtualDom.defaultOptions;
	   var Options = F2(function (a,
	   b) {
	      return {_: {}
	             ,preventDefault: b
	             ,stopPropagation: a};
	   });
	   var onWithOptions = $VirtualDom.onWithOptions;
	   var on = $VirtualDom.on;
	   var messageOn = F3(function (name,
	   addr,
	   msg) {
	      return A3(on,
	      name,
	      $Json$Decode.value,
	      function (_v0) {
	         return function () {
	            return A2($Signal.message,
	            addr,
	            msg);
	         }();
	      });
	   });
	   var onClick = messageOn("click");
	   var onDoubleClick = messageOn("dblclick");
	   var onMouseMove = messageOn("mousemove");
	   var onMouseDown = messageOn("mousedown");
	   var onMouseUp = messageOn("mouseup");
	   var onMouseEnter = messageOn("mouseenter");
	   var onMouseLeave = messageOn("mouseleave");
	   var onMouseOver = messageOn("mouseover");
	   var onMouseOut = messageOn("mouseout");
	   var onBlur = messageOn("blur");
	   var onFocus = messageOn("focus");
	   var onSubmit = messageOn("submit");
	   var onKey = F3(function (name,
	   addr,
	   handler) {
	      return A3(on,
	      name,
	      keyCode,
	      function (code) {
	         return A2($Signal.message,
	         addr,
	         handler(code));
	      });
	   });
	   var onKeyUp = onKey("keyup");
	   var onKeyDown = onKey("keydown");
	   var onKeyPress = onKey("keypress");
	   _elm.Html.Events.values = {_op: _op
	                             ,onBlur: onBlur
	                             ,onFocus: onFocus
	                             ,onSubmit: onSubmit
	                             ,onKeyUp: onKeyUp
	                             ,onKeyDown: onKeyDown
	                             ,onKeyPress: onKeyPress
	                             ,onClick: onClick
	                             ,onDoubleClick: onDoubleClick
	                             ,onMouseMove: onMouseMove
	                             ,onMouseDown: onMouseDown
	                             ,onMouseUp: onMouseUp
	                             ,onMouseEnter: onMouseEnter
	                             ,onMouseLeave: onMouseLeave
	                             ,onMouseOver: onMouseOver
	                             ,onMouseOut: onMouseOut
	                             ,on: on
	                             ,onWithOptions: onWithOptions
	                             ,defaultOptions: defaultOptions
	                             ,targetValue: targetValue
	                             ,targetChecked: targetChecked
	                             ,keyCode: keyCode
	                             ,Options: Options};
	   return _elm.Html.Events.values;
	};
	Elm.Json = Elm.Json || {};
	Elm.Json.Decode = Elm.Json.Decode || {};
	Elm.Json.Decode.make = function (_elm) {
	   "use strict";
	   _elm.Json = _elm.Json || {};
	   _elm.Json.Decode = _elm.Json.Decode || {};
	   if (_elm.Json.Decode.values)
	   return _elm.Json.Decode.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Json.Decode",
	   $Array = Elm.Array.make(_elm),
	   $Dict = Elm.Dict.make(_elm),
	   $Json$Encode = Elm.Json.Encode.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Json = Elm.Native.Json.make(_elm),
	   $Result = Elm.Result.make(_elm);
	   var tuple8 = $Native$Json.decodeTuple8;
	   var tuple7 = $Native$Json.decodeTuple7;
	   var tuple6 = $Native$Json.decodeTuple6;
	   var tuple5 = $Native$Json.decodeTuple5;
	   var tuple4 = $Native$Json.decodeTuple4;
	   var tuple3 = $Native$Json.decodeTuple3;
	   var tuple2 = $Native$Json.decodeTuple2;
	   var tuple1 = $Native$Json.decodeTuple1;
	   var succeed = $Native$Json.succeed;
	   var fail = $Native$Json.fail;
	   var andThen = $Native$Json.andThen;
	   var customDecoder = $Native$Json.customDecoder;
	   var decodeValue = $Native$Json.runDecoderValue;
	   var value = $Native$Json.decodeValue;
	   var maybe = $Native$Json.decodeMaybe;
	   var $null = $Native$Json.decodeNull;
	   var array = $Native$Json.decodeArray;
	   var list = $Native$Json.decodeList;
	   var bool = $Native$Json.decodeBool;
	   var $int = $Native$Json.decodeInt;
	   var $float = $Native$Json.decodeFloat;
	   var string = $Native$Json.decodeString;
	   var oneOf = $Native$Json.oneOf;
	   var keyValuePairs = $Native$Json.decodeKeyValuePairs;
	   var object8 = $Native$Json.decodeObject8;
	   var object7 = $Native$Json.decodeObject7;
	   var object6 = $Native$Json.decodeObject6;
	   var object5 = $Native$Json.decodeObject5;
	   var object4 = $Native$Json.decodeObject4;
	   var object3 = $Native$Json.decodeObject3;
	   var object2 = $Native$Json.decodeObject2;
	   var object1 = $Native$Json.decodeObject1;
	   _op[":="] = $Native$Json.decodeField;
	   var at = F2(function (fields,
	   decoder) {
	      return A3($List.foldr,
	      F2(function (x,y) {
	         return A2(_op[":="],x,y);
	      }),
	      decoder,
	      fields);
	   });
	   var decodeString = $Native$Json.runDecoderString;
	   var map = $Native$Json.decodeObject1;
	   var dict = function (decoder) {
	      return A2(map,
	      $Dict.fromList,
	      keyValuePairs(decoder));
	   };
	   var Decoder = {ctor: "Decoder"};
	   _elm.Json.Decode.values = {_op: _op
	                             ,decodeString: decodeString
	                             ,decodeValue: decodeValue
	                             ,string: string
	                             ,$int: $int
	                             ,$float: $float
	                             ,bool: bool
	                             ,$null: $null
	                             ,list: list
	                             ,array: array
	                             ,tuple1: tuple1
	                             ,tuple2: tuple2
	                             ,tuple3: tuple3
	                             ,tuple4: tuple4
	                             ,tuple5: tuple5
	                             ,tuple6: tuple6
	                             ,tuple7: tuple7
	                             ,tuple8: tuple8
	                             ,at: at
	                             ,object1: object1
	                             ,object2: object2
	                             ,object3: object3
	                             ,object4: object4
	                             ,object5: object5
	                             ,object6: object6
	                             ,object7: object7
	                             ,object8: object8
	                             ,keyValuePairs: keyValuePairs
	                             ,dict: dict
	                             ,maybe: maybe
	                             ,oneOf: oneOf
	                             ,map: map
	                             ,fail: fail
	                             ,succeed: succeed
	                             ,andThen: andThen
	                             ,value: value
	                             ,customDecoder: customDecoder
	                             ,Decoder: Decoder};
	   return _elm.Json.Decode.values;
	};
	Elm.Json = Elm.Json || {};
	Elm.Json.Encode = Elm.Json.Encode || {};
	Elm.Json.Encode.make = function (_elm) {
	   "use strict";
	   _elm.Json = _elm.Json || {};
	   _elm.Json.Encode = _elm.Json.Encode || {};
	   if (_elm.Json.Encode.values)
	   return _elm.Json.Encode.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Json.Encode",
	   $Array = Elm.Array.make(_elm),
	   $Native$Json = Elm.Native.Json.make(_elm);
	   var list = $Native$Json.encodeList;
	   var array = $Native$Json.encodeArray;
	   var object = $Native$Json.encodeObject;
	   var $null = $Native$Json.encodeNull;
	   var bool = $Native$Json.identity;
	   var $float = $Native$Json.identity;
	   var $int = $Native$Json.identity;
	   var string = $Native$Json.identity;
	   var encode = $Native$Json.encode;
	   var Value = {ctor: "Value"};
	   _elm.Json.Encode.values = {_op: _op
	                             ,encode: encode
	                             ,string: string
	                             ,$int: $int
	                             ,$float: $float
	                             ,bool: bool
	                             ,$null: $null
	                             ,list: list
	                             ,array: array
	                             ,object: object
	                             ,Value: Value};
	   return _elm.Json.Encode.values;
	};
	Elm.List = Elm.List || {};
	Elm.List.make = function (_elm) {
	   "use strict";
	   _elm.List = _elm.List || {};
	   if (_elm.List.values)
	   return _elm.List.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "List",
	   $Basics = Elm.Basics.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$List = Elm.Native.List.make(_elm);
	   var sortWith = $Native$List.sortWith;
	   var sortBy = $Native$List.sortBy;
	   var sort = function (xs) {
	      return A2(sortBy,
	      $Basics.identity,
	      xs);
	   };
	   var repeat = $Native$List.repeat;
	   var drop = $Native$List.drop;
	   var take = $Native$List.take;
	   var map5 = $Native$List.map5;
	   var map4 = $Native$List.map4;
	   var map3 = $Native$List.map3;
	   var map2 = $Native$List.map2;
	   var any = $Native$List.any;
	   var all = F2(function (pred,
	   xs) {
	      return $Basics.not(A2(any,
	      function ($) {
	         return $Basics.not(pred($));
	      },
	      xs));
	   });
	   var foldr = $Native$List.foldr;
	   var foldl = $Native$List.foldl;
	   var length = function (xs) {
	      return A3(foldl,
	      F2(function (_v0,i) {
	         return function () {
	            return i + 1;
	         }();
	      }),
	      0,
	      xs);
	   };
	   var sum = function (numbers) {
	      return A3(foldl,
	      F2(function (x,y) {
	         return x + y;
	      }),
	      0,
	      numbers);
	   };
	   var product = function (numbers) {
	      return A3(foldl,
	      F2(function (x,y) {
	         return x * y;
	      }),
	      1,
	      numbers);
	   };
	   var maximum = function (list) {
	      return function () {
	         switch (list.ctor)
	         {case "::":
	            return $Maybe.Just(A3(foldl,
	              $Basics.max,
	              list._0,
	              list._1));}
	         return $Maybe.Nothing;
	      }();
	   };
	   var minimum = function (list) {
	      return function () {
	         switch (list.ctor)
	         {case "::":
	            return $Maybe.Just(A3(foldl,
	              $Basics.min,
	              list._0,
	              list._1));}
	         return $Maybe.Nothing;
	      }();
	   };
	   var indexedMap = F2(function (f,
	   xs) {
	      return A3(map2,
	      f,
	      _L.range(0,length(xs) - 1),
	      xs);
	   });
	   var member = F2(function (x,
	   xs) {
	      return A2(any,
	      function (a) {
	         return _U.eq(a,x);
	      },
	      xs);
	   });
	   var isEmpty = function (xs) {
	      return function () {
	         switch (xs.ctor)
	         {case "[]": return true;}
	         return false;
	      }();
	   };
	   var tail = function (list) {
	      return function () {
	         switch (list.ctor)
	         {case "::":
	            return $Maybe.Just(list._1);
	            case "[]":
	            return $Maybe.Nothing;}
	         _U.badCase($moduleName,
	         "between lines 87 and 89");
	      }();
	   };
	   var head = function (list) {
	      return function () {
	         switch (list.ctor)
	         {case "::":
	            return $Maybe.Just(list._0);
	            case "[]":
	            return $Maybe.Nothing;}
	         _U.badCase($moduleName,
	         "between lines 75 and 77");
	      }();
	   };
	   _op["::"] = $Native$List.cons;
	   var map = F2(function (f,xs) {
	      return A3(foldr,
	      F2(function (x,acc) {
	         return A2(_op["::"],
	         f(x),
	         acc);
	      }),
	      _L.fromArray([]),
	      xs);
	   });
	   var filter = F2(function (pred,
	   xs) {
	      return function () {
	         var conditionalCons = F2(function (x,
	         xs$) {
	            return pred(x) ? A2(_op["::"],
	            x,
	            xs$) : xs$;
	         });
	         return A3(foldr,
	         conditionalCons,
	         _L.fromArray([]),
	         xs);
	      }();
	   });
	   var maybeCons = F3(function (f,
	   mx,
	   xs) {
	      return function () {
	         var _v15 = f(mx);
	         switch (_v15.ctor)
	         {case "Just":
	            return A2(_op["::"],_v15._0,xs);
	            case "Nothing": return xs;}
	         _U.badCase($moduleName,
	         "between lines 179 and 181");
	      }();
	   });
	   var filterMap = F2(function (f,
	   xs) {
	      return A3(foldr,
	      maybeCons(f),
	      _L.fromArray([]),
	      xs);
	   });
	   var reverse = function (list) {
	      return A3(foldl,
	      F2(function (x,y) {
	         return A2(_op["::"],x,y);
	      }),
	      _L.fromArray([]),
	      list);
	   };
	   var scanl = F3(function (f,
	   b,
	   xs) {
	      return function () {
	         var scan1 = F2(function (x,
	         accAcc) {
	            return function () {
	               switch (accAcc.ctor)
	               {case "::": return A2(_op["::"],
	                    A2(f,x,accAcc._0),
	                    accAcc);
	                  case "[]":
	                  return _L.fromArray([]);}
	               _U.badCase($moduleName,
	               "between lines 148 and 151");
	            }();
	         });
	         return reverse(A3(foldl,
	         scan1,
	         _L.fromArray([b]),
	         xs));
	      }();
	   });
	   var append = F2(function (xs,
	   ys) {
	      return function () {
	         switch (ys.ctor)
	         {case "[]": return xs;}
	         return A3(foldr,
	         F2(function (x,y) {
	            return A2(_op["::"],x,y);
	         }),
	         ys,
	         xs);
	      }();
	   });
	   var concat = function (lists) {
	      return A3(foldr,
	      append,
	      _L.fromArray([]),
	      lists);
	   };
	   var concatMap = F2(function (f,
	   list) {
	      return concat(A2(map,
	      f,
	      list));
	   });
	   var partition = F2(function (pred,
	   list) {
	      return function () {
	         var step = F2(function (x,
	         _v21) {
	            return function () {
	               switch (_v21.ctor)
	               {case "_Tuple2":
	                  return pred(x) ? {ctor: "_Tuple2"
	                                   ,_0: A2(_op["::"],x,_v21._0)
	                                   ,_1: _v21._1} : {ctor: "_Tuple2"
	                                                   ,_0: _v21._0
	                                                   ,_1: A2(_op["::"],
	                                                   x,
	                                                   _v21._1)};}
	               _U.badCase($moduleName,
	               "between lines 301 and 303");
	            }();
	         });
	         return A3(foldr,
	         step,
	         {ctor: "_Tuple2"
	         ,_0: _L.fromArray([])
	         ,_1: _L.fromArray([])},
	         list);
	      }();
	   });
	   var unzip = function (pairs) {
	      return function () {
	         var step = F2(function (_v25,
	         _v26) {
	            return function () {
	               switch (_v26.ctor)
	               {case "_Tuple2":
	                  return function () {
	                       switch (_v25.ctor)
	                       {case "_Tuple2":
	                          return {ctor: "_Tuple2"
	                                 ,_0: A2(_op["::"],
	                                 _v25._0,
	                                 _v26._0)
	                                 ,_1: A2(_op["::"],
	                                 _v25._1,
	                                 _v26._1)};}
	                       _U.badCase($moduleName,
	                       "on line 339, column 12 to 28");
	                    }();}
	               _U.badCase($moduleName,
	               "on line 339, column 12 to 28");
	            }();
	         });
	         return A3(foldr,
	         step,
	         {ctor: "_Tuple2"
	         ,_0: _L.fromArray([])
	         ,_1: _L.fromArray([])},
	         pairs);
	      }();
	   };
	   var intersperse = F2(function (sep,
	   xs) {
	      return function () {
	         switch (xs.ctor)
	         {case "::": return function () {
	                 var step = F2(function (x,
	                 rest) {
	                    return A2(_op["::"],
	                    sep,
	                    A2(_op["::"],x,rest));
	                 });
	                 var spersed = A3(foldr,
	                 step,
	                 _L.fromArray([]),
	                 xs._1);
	                 return A2(_op["::"],
	                 xs._0,
	                 spersed);
	              }();
	            case "[]":
	            return _L.fromArray([]);}
	         _U.badCase($moduleName,
	         "between lines 350 and 356");
	      }();
	   });
	   _elm.List.values = {_op: _op
	                      ,isEmpty: isEmpty
	                      ,length: length
	                      ,reverse: reverse
	                      ,member: member
	                      ,head: head
	                      ,tail: tail
	                      ,filter: filter
	                      ,take: take
	                      ,drop: drop
	                      ,repeat: repeat
	                      ,append: append
	                      ,concat: concat
	                      ,intersperse: intersperse
	                      ,partition: partition
	                      ,unzip: unzip
	                      ,map: map
	                      ,map2: map2
	                      ,map3: map3
	                      ,map4: map4
	                      ,map5: map5
	                      ,filterMap: filterMap
	                      ,concatMap: concatMap
	                      ,indexedMap: indexedMap
	                      ,foldr: foldr
	                      ,foldl: foldl
	                      ,sum: sum
	                      ,product: product
	                      ,maximum: maximum
	                      ,minimum: minimum
	                      ,all: all
	                      ,any: any
	                      ,scanl: scanl
	                      ,sort: sort
	                      ,sortBy: sortBy
	                      ,sortWith: sortWith};
	   return _elm.List.values;
	};
	Elm.Maybe = Elm.Maybe || {};
	Elm.Maybe.make = function (_elm) {
	   "use strict";
	   _elm.Maybe = _elm.Maybe || {};
	   if (_elm.Maybe.values)
	   return _elm.Maybe.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Maybe";
	   var withDefault = F2(function ($default,
	   maybe) {
	      return function () {
	         switch (maybe.ctor)
	         {case "Just": return maybe._0;
	            case "Nothing":
	            return $default;}
	         _U.badCase($moduleName,
	         "between lines 45 and 47");
	      }();
	   });
	   var Nothing = {ctor: "Nothing"};
	   var oneOf = function (maybes) {
	      return function () {
	         switch (maybes.ctor)
	         {case "::": return function () {
	                 switch (maybes._0.ctor)
	                 {case "Just": return maybes._0;
	                    case "Nothing":
	                    return oneOf(maybes._1);}
	                 _U.badCase($moduleName,
	                 "between lines 64 and 66");
	              }();
	            case "[]": return Nothing;}
	         _U.badCase($moduleName,
	         "between lines 59 and 66");
	      }();
	   };
	   var andThen = F2(function (maybeValue,
	   callback) {
	      return function () {
	         switch (maybeValue.ctor)
	         {case "Just":
	            return callback(maybeValue._0);
	            case "Nothing": return Nothing;}
	         _U.badCase($moduleName,
	         "between lines 110 and 112");
	      }();
	   });
	   var Just = function (a) {
	      return {ctor: "Just",_0: a};
	   };
	   var map = F2(function (f,
	   maybe) {
	      return function () {
	         switch (maybe.ctor)
	         {case "Just":
	            return Just(f(maybe._0));
	            case "Nothing": return Nothing;}
	         _U.badCase($moduleName,
	         "between lines 76 and 78");
	      }();
	   });
	   _elm.Maybe.values = {_op: _op
	                       ,andThen: andThen
	                       ,map: map
	                       ,withDefault: withDefault
	                       ,oneOf: oneOf
	                       ,Just: Just
	                       ,Nothing: Nothing};
	   return _elm.Maybe.values;
	};
	Elm.Native.Array = {};
	Elm.Native.Array.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Array = localRuntime.Native.Array || {};
		if (localRuntime.Native.Array.values)
		{
			return localRuntime.Native.Array.values;
		}
		if ('values' in Elm.Native.Array)
		{
			return localRuntime.Native.Array.values = Elm.Native.Array.values;
		}
	
		var List = Elm.Native.List.make(localRuntime);
	
		// A RRB-Tree has two distinct data types.
		// Leaf -> "height"  is always 0
		//         "table"   is an array of elements
		// Node -> "height"  is always greater than 0
		//         "table"   is an array of child nodes
		//         "lengths" is an array of accumulated lengths of the child nodes
	
		// M is the maximal table size. 32 seems fast. E is the allowed increase
		// of search steps when concatting to find an index. Lower values will
		// decrease balancing, but will increase search steps.
		var M = 32;
		var E = 2;
	
		// An empty array.
		var empty = {
			ctor: "_Array",
			height: 0,
			table: new Array()
		};
	
	
		function get(i, array)
		{
			if (i < 0 || i >= length(array))
			{
				throw new Error(
					"Index " + i + " is out of range. Check the length of " +
					"your array first or use getMaybe or getWithDefault.");
			}
			return unsafeGet(i, array);
		}
	
	
		function unsafeGet(i, array)
		{
			for (var x = array.height; x > 0; x--)
			{
				var slot = i >> (x * 5);
				while (array.lengths[slot] <= i)
				{
					slot++;
				}
				if (slot > 0)
				{
					i -= array.lengths[slot - 1];
				}
				array = array.table[slot];
			}
			return array.table[i];
		}
	
	
		// Sets the value at the index i. Only the nodes leading to i will get
		// copied and updated.
		function set(i, item, array)
		{
			if (i < 0 || length(array) <= i)
			{
				return array;
			}
			return unsafeSet(i, item, array);
		}
	
	
		function unsafeSet(i, item, array)
		{
			array = nodeCopy(array);
	
			if (array.height == 0)
			{
				array.table[i] = item;
			}
			else
			{
				var slot = getSlot(i, array);
				if (slot > 0)
				{
					i -= array.lengths[slot - 1];
				}
				array.table[slot] = unsafeSet(i, item, array.table[slot]);
			}
			return array;
		}
	
	
		function initialize(len, f)
		{
			if (len == 0)
			{
				return empty;
			}
			var h = Math.floor( Math.log(len) / Math.log(M) );
			return initialize_(f, h, 0, len);
		}
	
		function initialize_(f, h, from, to)
		{
			if (h == 0)
			{
				var table = new Array((to - from) % (M + 1));
				for (var i = 0; i < table.length; i++)
				{
				  table[i] = f(from + i);
				}
				return {
					ctor: "_Array",
					height: 0,
					table: table
				};
			}
	
			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++)
			{
				table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
			}
			return {
				ctor: "_Array",
				height: h,
				table: table,
				lengths: lengths
			};
		}
	
		function fromList(list)
		{
			if (list == List.Nil)
			{
				return empty;
			}
	
			// Allocate M sized blocks (table) and write list elements to it.
			var table = new Array(M);
			var nodes = new Array();
			var i = 0;
	
			while (list.ctor !== '[]')
			{
				table[i] = list._0;
				list = list._1;
				i++;
	
				// table is full, so we can push a leaf containing it into the
				// next node.
				if (i == M)
				{
					var leaf = {
						ctor: "_Array",
						height: 0,
						table: table
					};
					fromListPush(leaf, nodes);
					table = new Array(M);
					i = 0;
				}
			}
	
			// Maybe there is something left on the table.
			if (i > 0)
			{
				var leaf = {
					ctor: "_Array",
					height: 0,
					table: table.splice(0,i)
				};
				fromListPush(leaf, nodes);
			}
	
			// Go through all of the nodes and eventually push them into higher nodes.
			for (var h = 0; h < nodes.length - 1; h++)
			{
				if (nodes[h].table.length > 0)
				{
					fromListPush(nodes[h], nodes);
				}
			}
	
			var head = nodes[nodes.length - 1];
			if (head.height > 0 && head.table.length == 1)
			{
				return head.table[0];
			}
			else
			{
				return head;
			}
		}
	
		// Push a node into a higher node as a child.
		function fromListPush(toPush, nodes)
		{
			var h = toPush.height;
	
			// Maybe the node on this height does not exist.
			if (nodes.length == h)
			{
				var node = {
					ctor: "_Array",
					height: h + 1,
					table: new Array(),
					lengths: new Array()
				};
				nodes.push(node);
			}
	
			nodes[h].table.push(toPush);
			var len = length(toPush);
			if (nodes[h].lengths.length > 0)
			{
				len += nodes[h].lengths[nodes[h].lengths.length - 1];
			}
			nodes[h].lengths.push(len);
	
			if (nodes[h].table.length == M)
			{
				fromListPush(nodes[h], nodes);
				nodes[h] = {
					ctor: "_Array",
					height: h + 1,
					table: new Array(),
					lengths: new Array()
				};
			}
		}
	
		// Pushes an item via push_ to the bottom right of a tree.
		function push(item, a)
		{
			var pushed = push_(item, a);
			if (pushed !== null)
			{
				return pushed;
			}
	
			var newTree = create(item, a.height);
			return siblise(a, newTree);
		}
	
		// Recursively tries to push an item to the bottom-right most
		// tree possible. If there is no space left for the item,
		// null will be returned.
		function push_(item, a)
		{
			// Handle resursion stop at leaf level.
			if (a.height == 0)
			{
				if (a.table.length < M)
				{
					var newA = {
						ctor: "_Array",
						height: 0,
						table: a.table.slice()
					};
					newA.table.push(item);
					return newA;
				}
				else
				{
				  return null;
				}
			}
	
			// Recursively push
			var pushed = push_(item, botRight(a));
	
			// There was space in the bottom right tree, so the slot will
			// be updated.
			if (pushed != null)
			{
				var newA = nodeCopy(a);
				newA.table[newA.table.length - 1] = pushed;
				newA.lengths[newA.lengths.length - 1]++;
				return newA;
			}
	
			// When there was no space left, check if there is space left
			// for a new slot with a tree which contains only the item
			// at the bottom.
			if (a.table.length < M)
			{
				var newSlot = create(item, a.height - 1);
				var newA = nodeCopy(a);
				newA.table.push(newSlot);
				newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
				return newA;
			}
			else
			{
				return null;
			}
		}
	
		// Converts an array into a list of elements.
		function toList(a)
		{
			return toList_(List.Nil, a);
		}
	
		function toList_(list, a)
		{
			for (var i = a.table.length - 1; i >= 0; i--)
			{
				list =
					a.height == 0
						? List.Cons(a.table[i], list)
						: toList_(list, a.table[i]);
			}
			return list;
		}
	
		// Maps a function over the elements of an array.
		function map(f, a)
		{
			var newA = {
				ctor: "_Array",
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0)
			{
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++)
			{
				newA.table[i] =
					a.height == 0
						? f(a.table[i])
						: map(f, a.table[i]);
			}
			return newA;
		}
	
		// Maps a function over the elements with their index as first argument.
		function indexedMap(f, a)
		{
			return indexedMap_(f, a, 0);
		}
	
		function indexedMap_(f, a, from)
		{
			var newA = {
				ctor: "_Array",
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0)
			{
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++)
			{
				newA.table[i] =
					a.height == 0
						? A2(f, from + i, a.table[i])
						: indexedMap_(f, a.table[i], i == 0 ? 0 : a.lengths[i - 1]);
			}
			return newA;
		}
	
		function foldl(f, b, a)
		{
			if (a.height == 0)
			{
				for (var i = 0; i < a.table.length; i++)
				{
					b = A2(f, a.table[i], b);
				}
			}
			else
			{
				for (var i = 0; i < a.table.length; i++)
				{
					b = foldl(f, b, a.table[i]);
				}
			}
			return b;
		}
	
		function foldr(f, b, a)
		{
			if (a.height == 0)
			{
				for (var i = a.table.length; i--; )
				{
					b = A2(f, a.table[i], b);
				}
			}
			else
			{
				for (var i = a.table.length; i--; )
				{
					b = foldr(f, b, a.table[i]);
				}
			}
			return b;
		}
	
		// TODO: currently, it slices the right, then the left. This can be
		// optimized.
		function slice(from, to, a)
		{
			if (from < 0)
			{
				from += length(a);
			}
			if (to < 0)
			{
				to += length(a);
			}
			return sliceLeft(from, sliceRight(to, a));
		}
	
		function sliceRight(to, a)
		{
			if (to == length(a))
			{
				return a;
			}
	
			// Handle leaf level.
			if (a.height == 0)
			{
				var newA = { ctor:"_Array", height:0 };
				newA.table = a.table.slice(0, to);
				return newA;
			}
	
			// Slice the right recursively.
			var right = getSlot(to, a);
			var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);
	
			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (right == 0)
			{
				return sliced;
			}
	
			// Create new node.
			var newA = {
				ctor: "_Array",
				height: a.height,
				table: a.table.slice(0, right),
				lengths: a.lengths.slice(0, right)
			};
			if (sliced.table.length > 0)
			{
				newA.table[right] = sliced;
				newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
			}
			return newA;
		}
	
		function sliceLeft(from, a)
		{
			if (from == 0)
			{
				return a;
			}
	
			// Handle leaf level.
			if (a.height == 0)
			{
				var newA = { ctor:"_Array", height:0 };
				newA.table = a.table.slice(from, a.table.length + 1);
				return newA;
			}
	
			// Slice the left recursively.
			var left = getSlot(from, a);
			var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);
	
			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (left == a.table.length - 1)
			{
				return sliced;
			}
	
			// Create new node.
			var newA = {
				ctor: "_Array",
				height: a.height,
				table: a.table.slice(left, a.table.length + 1),
				lengths: new Array(a.table.length - left)
			};
			newA.table[0] = sliced;
			var len = 0;
			for (var i = 0; i < newA.table.length; i++)
			{
				len += length(newA.table[i]);
				newA.lengths[i] = len;
			}
	
			return newA;
		}
	
		// Appends two trees.
		function append(a,b)
		{
			if (a.table.length === 0)
			{
				return b;
			}
			if (b.table.length === 0)
			{
				return a;
			}
	
			var c = append_(a, b);
	
			// Check if both nodes can be crunshed together.
			if (c[0].table.length + c[1].table.length <= M)
			{
				if (c[0].table.length === 0)
				{
					return c[1];
				}
				if (c[1].table.length === 0)
				{
					return c[0];
				}
	
				// Adjust .table and .lengths
				c[0].table = c[0].table.concat(c[1].table);
				if (c[0].height > 0)
				{
					var len = length(c[0]);
					for (var i = 0; i < c[1].lengths.length; i++)
					{
						c[1].lengths[i] += len;
					}
					c[0].lengths = c[0].lengths.concat(c[1].lengths);
				}
	
				return c[0];
			}
	
			if (c[0].height > 0)
			{
				var toRemove = calcToRemove(a, b);
				if (toRemove > E)
				{
					c = shuffle(c[0], c[1], toRemove);
				}
			}
	
			return siblise(c[0], c[1]);
		}
	
		// Returns an array of two nodes; right and left. One node _may_ be empty.
		function append_(a, b)
		{
			if (a.height === 0 && b.height === 0)
			{
				return [a, b];
			}
	
			if (a.height !== 1 || b.height !== 1)
			{
				if (a.height === b.height)
				{
					a = nodeCopy(a);
					b = nodeCopy(b);
					var appended = append_(botRight(a), botLeft(b));
	
					insertRight(a, appended[1]);
					insertLeft(b, appended[0]);
				}
				else if (a.height > b.height)
				{
					a = nodeCopy(a);
					var appended = append_(botRight(a), b);
	
					insertRight(a, appended[0]);
					b = parentise(appended[1], appended[1].height + 1);
				}
				else
				{
					b = nodeCopy(b);
					var appended = append_(a, botLeft(b));
	
					var left = appended[0].table.length === 0 ? 0 : 1;
					var right = left === 0 ? 1 : 0;
					insertLeft(b, appended[left]);
					a = parentise(appended[right], appended[right].height + 1);
				}
			}
	
			// Check if balancing is needed and return based on that.
			if (a.table.length === 0 || b.table.length === 0)
			{
				return [a,b];
			}
	
			var toRemove = calcToRemove(a, b);
			if (toRemove <= E)
			{
				return [a,b];
			}
			return shuffle(a, b, toRemove);
		}
	
		// Helperfunctions for append_. Replaces a child node at the side of the parent.
		function insertRight(parent, node)
		{
			var index = parent.table.length - 1;
			parent.table[index] = node;
			parent.lengths[index] = length(node)
			parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
		}
	
		function insertLeft(parent, node)
		{
			if (node.table.length > 0)
			{
				parent.table[0] = node;
				parent.lengths[0] = length(node);
	
				var len = length(parent.table[0]);
				for (var i = 1; i < parent.lengths.length; i++)
				{
					len += length(parent.table[i]);
					parent.lengths[i] = len;
				}
			}
			else
			{
				parent.table.shift();
				for (var i = 1; i < parent.lengths.length; i++)
				{
					parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
				}
				parent.lengths.shift();
			}
		}
	
		// Returns the extra search steps for E. Refer to the paper.
		function calcToRemove(a, b)
		{
			var subLengths = 0;
			for (var i = 0; i < a.table.length; i++)
			{
				subLengths += a.table[i].table.length;
			}
			for (var i = 0; i < b.table.length; i++)
			{
				subLengths += b.table[i].table.length;
			}
	
			var toRemove = a.table.length + b.table.length
			return toRemove - (Math.floor((subLengths - 1) / M) + 1);
		}
	
		// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
		function get2(a, b, index)
		{
			return index < a.length
				? a[index]
				: b[index - a.length];
		}
	
		function set2(a, b, index, value)
		{
			if (index < a.length)
			{
				a[index] = value;
			}
			else
			{
				b[index - a.length] = value;
			}
		}
	
		function saveSlot(a, b, index, slot)
		{
			set2(a.table, b.table, index, slot);
	
			var l = (index == 0 || index == a.lengths.length)
				? 0
				: get2(a.lengths, a.lengths, index - 1);
	
			set2(a.lengths, b.lengths, index, l + length(slot));
		}
	
		// Creates a node or leaf with a given length at their arrays for perfomance.
		// Is only used by shuffle.
		function createNode(h, length)
		{
			if (length < 0)
			{
				length = 0;
			}
			var a = {
				ctor: "_Array",
				height: h,
				table: new Array(length)
			};
			if (h > 0)
			{
				a.lengths = new Array(length);
			}
			return a;
		}
	
		// Returns an array of two balanced nodes.
		function shuffle(a, b, toRemove)
		{
			var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
			var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));
	
			// Skip the slots with size M. More precise: copy the slot references
			// to the new node
			var read = 0;
			while (get2(a.table, b.table, read).table.length % M == 0)
			{
				set2(newA.table, newB.table, read, get2(a.table, b.table, read));
				set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
				read++;
			}
	
			// Pulling items from left to right, caching in a slot before writing
			// it into the new nodes.
			var write = read;
			var slot = new createNode(a.height - 1, 0);
			var from = 0;
	
			// If the current slot is still containing data, then there will be at
			// least one more write, so we do not break this loop yet.
			while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
			{
				// Find out the max possible items for copying.
				var source = get2(a.table, b.table, read);
				var to = Math.min(M - slot.table.length, source.table.length)
	
				// Copy and adjust size table.
				slot.table = slot.table.concat(source.table.slice(from, to));
				if (slot.height > 0)
				{
					var len = slot.lengths.length;
					for (var i = len; i < len + to - from; i++)
					{
						slot.lengths[i] = length(slot.table[i]);
						slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
					}
				}
	
				from += to;
	
				// Only proceed to next slots[i] if the current one was
				// fully copied.
				if (source.table.length <= to)
				{
					read++; from = 0;
				}
	
				// Only create a new slot if the current one is filled up.
				if (slot.table.length == M)
				{
					saveSlot(newA, newB, write, slot);
					slot = createNode(a.height - 1,0);
					write++;
				}
			}
	
			// Cleanup after the loop. Copy the last slot into the new nodes.
			if (slot.table.length > 0)
			{
				saveSlot(newA, newB, write, slot);
				write++;
			}
	
			// Shift the untouched slots to the left
			while (read < a.table.length + b.table.length )
			{
				saveSlot(newA, newB, write, get2(a.table, b.table, read));
				read++;
				write++;
			}
	
			return [newA, newB];
		}
	
		// Navigation functions
		function botRight(a)
		{
			return a.table[a.table.length - 1];
		}
		function botLeft(a)
		{
			return a.table[0];
		}
	
		// Copies a node for updating. Note that you should not use this if
		// only updating only one of "table" or "lengths" for performance reasons.
		function nodeCopy(a)
		{
			var newA = {
				ctor: "_Array",
				height: a.height,
				table: a.table.slice()
			};
			if (a.height > 0)
			{
				newA.lengths = a.lengths.slice();
			}
			return newA;
		}
	
		// Returns how many items are in the tree.
		function length(array)
		{
			if (array.height == 0)
			{
				return array.table.length;
			}
			else
			{
				return array.lengths[array.lengths.length - 1];
			}
		}
	
		// Calculates in which slot of "table" the item probably is, then
		// find the exact slot via forward searching in  "lengths". Returns the index.
		function getSlot(i, a)
		{
			var slot = i >> (5 * a.height);
			while (a.lengths[slot] <= i)
			{
				slot++;
			}
			return slot;
		}
	
		// Recursively creates a tree with a given height containing
		// only the given item.
		function create(item, h)
		{
			if (h == 0)
			{
				return {
					ctor: "_Array",
					height: 0,
					table: [item]
				};
			}
			return {
				ctor: "_Array",
				height: h,
				table: [create(item, h - 1)],
				lengths: [1]
			};
		}
	
		// Recursively creates a tree that contains the given tree.
		function parentise(tree, h)
		{
			if (h == tree.height)
			{
				return tree;
			}
	
			return {
				ctor: "_Array",
				height: h,
				table: [parentise(tree, h - 1)],
				lengths: [length(tree)]
			};
		}
	
		// Emphasizes blood brotherhood beneath two trees.
		function siblise(a, b)
		{
			return {
				ctor: "_Array",
				height: a.height + 1,
				table: [a, b],
				lengths: [length(a), length(a) + length(b)]
			};
		}
	
		function toJSArray(a)
		{
			var jsArray = new Array(length(a));
			toJSArray_(jsArray, 0, a);
			return jsArray;
		}
	
		function toJSArray_(jsArray, i, a)
		{
			for (var t = 0; t < a.table.length; t++)
			{
				if (a.height == 0)
				{
					jsArray[i + t] = a.table[t];
				}
				else
				{
					var inc = t == 0 ? 0 : a.lengths[t - 1];
					toJSArray_(jsArray, i + inc, a.table[t]);
				}
			}
		}
	
		function fromJSArray(jsArray)
		{
			if (jsArray.length == 0)
			{
				return empty;
			}
			var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
			return fromJSArray_(jsArray, h, 0, jsArray.length);
		}
	
		function fromJSArray_(jsArray, h, from, to)
		{
			if (h == 0)
			{
				return {
					ctor: "_Array",
					height: 0,
					table: jsArray.slice(from, to)
				};
			}
	
			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++)
			{
				table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
			}
			return {
				ctor: "_Array",
				height: h,
				table: table,
				lengths: lengths
			};
		}
	
		Elm.Native.Array.values = {
			empty: empty,
			fromList: fromList,
			toList: toList,
			initialize: F2(initialize),
			append: F2(append),
			push: F2(push),
			slice: F3(slice),
			get: F2(get),
			set: F3(set),
			map: F2(map),
			indexedMap: F2(indexedMap),
			foldl: F3(foldl),
			foldr: F3(foldr),
			length: length,
	
			toJSArray:toJSArray,
			fromJSArray:fromJSArray
		};
	
		return localRuntime.Native.Array.values = Elm.Native.Array.values;
	
	}
	
	Elm.Native.Basics = {};
	Elm.Native.Basics.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Basics = localRuntime.Native.Basics || {};
		if (localRuntime.Native.Basics.values)
		{
			return localRuntime.Native.Basics.values;
		}
	
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		function div(a, b)
		{
			return (a/b)|0;
		}
		function rem(a, b)
		{
			return a % b;
		}
		function mod(a, b)
		{
			if (b === 0)
			{
				throw new Error("Cannot perform mod 0. Division by zero error.");
			}
			var r = a % b;
			var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r+b) : -mod(-a,-b));
	
			return m === b ? 0 : m;
		}
		function logBase(base, n)
		{
			return Math.log(n) / Math.log(base);
		}
		function negate(n)
		{
			return -n;
		}
		function abs(n)
		{
			return n < 0 ? -n : n;
		}
	
		function min(a, b)
		{
			return Utils.cmp(a,b) < 0 ? a : b;
		}
		function max(a, b)
		{
			return Utils.cmp(a,b) > 0 ? a : b;
		}
		function clamp(lo, hi, n)
		{
			return Utils.cmp(n,lo) < 0 ? lo : Utils.cmp(n,hi) > 0 ? hi : n;
		}
	
		function xor(a, b)
		{
			return a !== b;
		}
		function not(b)
		{
			return !b;
		}
		function isInfinite(n)
		{
			return n === Infinity || n === -Infinity
		}
	
		function truncate(n)
		{
			return n|0;
		}
	
		function degrees(d)
		{
			return d * Math.PI / 180;
		}
		function turns(t)
		{
			return 2 * Math.PI * t;
		}
		function fromPolar(point)
		{
			var r = point._0;
			var t = point._1;
			return Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
		}
		function toPolar(point)
		{
			var x = point._0;
			var y = point._1;
			return Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y,x));
		}
	
		return localRuntime.Native.Basics.values = {
			div: F2(div),
			rem: F2(rem),
			mod: F2(mod),
	
			pi: Math.PI,
			e: Math.E,
			cos: Math.cos,
			sin: Math.sin,
			tan: Math.tan,
			acos: Math.acos,
			asin: Math.asin,
			atan: Math.atan,
			atan2: F2(Math.atan2),
	
			degrees:  degrees,
			turns:  turns,
			fromPolar:  fromPolar,
			toPolar:  toPolar,
	
			sqrt: Math.sqrt,
			logBase: F2(logBase),
			negate: negate,
			abs: abs,
			min: F2(min),
			max: F2(max),
			clamp: F3(clamp),
			compare: Utils.compare,
	
			xor: F2(xor),
			not: not,
	
			truncate: truncate,
			ceiling: Math.ceil,
			floor: Math.floor,
			round: Math.round,
			toFloat: function(x) { return x; },
			isNaN: isNaN,
			isInfinite: isInfinite
		};
	};
	
	Elm.Native.Char = {};
	Elm.Native.Char.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Char = localRuntime.Native.Char || {};
		if (localRuntime.Native.Char.values)
		{
			return localRuntime.Native.Char.values;
		}
	
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		return localRuntime.Native.Char.values = {
			fromCode : function(c) { return Utils.chr(String.fromCharCode(c)); },
			toCode   : function(c) { return c.charCodeAt(0); },
			toUpper  : function(c) { return Utils.chr(c.toUpperCase()); },
			toLower  : function(c) { return Utils.chr(c.toLowerCase()); },
			toLocaleUpper : function(c) { return Utils.chr(c.toLocaleUpperCase()); },
			toLocaleLower : function(c) { return Utils.chr(c.toLocaleLowerCase()); },
		};
	};
	
	Elm.Native.Color = {};
	Elm.Native.Color.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Color = localRuntime.Native.Color || {};
		if (localRuntime.Native.Color.values)
		{
			return localRuntime.Native.Color.values;
		}
	
		function toCss(c)
		{
			var format = '';
			var colors = '';
			if (c.ctor === 'RGBA')
			{
				format = 'rgb';
				colors = c._0 + ', ' + c._1 + ', ' + c._2;
			}
			else
			{
				format = 'hsl';
				colors = (c._0 * 180 / Math.PI) + ', ' +
						 (c._1 * 100) + '%, ' +
						 (c._2 * 100) + '%';
			}
			if (c._3 === 1)
			{
				return format + '(' + colors + ')';
			}
			else
			{
				return format + 'a(' + colors + ', ' + c._3 + ')';
			}
		}
	
		return localRuntime.Native.Color.values = {
			toCss: toCss
		};
	
	};
	
	Elm.Native.Debug = {};
	Elm.Native.Debug.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Debug = localRuntime.Native.Debug || {};
		if (localRuntime.Native.Debug.values)
		{
			return localRuntime.Native.Debug.values;
		}
	
		var toString = Elm.Native.Show.make(localRuntime).toString;
	
		function log(tag, value)
		{
			var msg = tag + ': ' + toString(value);
			var process = process || {};
			if (process.stdout)
			{
				process.stdout.write(msg);
			}
			else
			{
				console.log(msg);
			}
			return value;
		}
	
		function crash(message)
		{
			throw new Error(message);
		}
	
		function tracePath(tag, form)
		{
			if (localRuntime.debug)
			{
				return localRuntime.debug.trace(tag, form);
			}
			return form;
		}
	
		function watch(tag, value)
		{
			if (localRuntime.debug)
			{
				localRuntime.debug.watch(tag, value);
			}
			return value;
		}
	
		function watchSummary(tag, summarize, value)
		{
			if (localRuntime.debug)
			{
				localRuntime.debug.watch(tag, summarize(value));
			}
			return value;
		}
	
		return localRuntime.Native.Debug.values = {
			crash: crash,
			tracePath: F2(tracePath),
			log: F2(log),
			watch: F2(watch),
			watchSummary:F3(watchSummary),
		};
	};
	
	
	// setup
	Elm.Native = Elm.Native || {};
	Elm.Native.Graphics = Elm.Native.Graphics || {};
	Elm.Native.Graphics.Collage = Elm.Native.Graphics.Collage || {};
	
	// definition
	Elm.Native.Graphics.Collage.make = function(localRuntime) {
		'use strict';
	
		// attempt to short-circuit
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Graphics = localRuntime.Native.Graphics || {};
		localRuntime.Native.Graphics.Collage = localRuntime.Native.Graphics.Collage || {};
		if ('values' in localRuntime.Native.Graphics.Collage)
		{
			return localRuntime.Native.Graphics.Collage.values;
		}
	
		// okay, we cannot short-ciruit, so now we define everything
		var Color = Elm.Native.Color.make(localRuntime);
		var List = Elm.Native.List.make(localRuntime);
		var NativeElement = Elm.Native.Graphics.Element.make(localRuntime);
		var Transform = Elm.Transform2D.make(localRuntime);
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		function setStrokeStyle(ctx, style)
		{
			ctx.lineWidth = style.width;
	
			var cap = style.cap.ctor;
			ctx.lineCap = cap === 'Flat'
				? 'butt'
				: cap === 'Round'
					? 'round'
					: 'square';
	
			var join = style.join.ctor;
			ctx.lineJoin = join === 'Smooth'
				? 'round'
				: join === 'Sharp'
					? 'miter'
					: 'bevel';
	
			ctx.miterLimit = style.join._0 || 10;
			ctx.strokeStyle = Color.toCss(style.color);
		}
	
		function setFillStyle(ctx, style)
		{
			var sty = style.ctor;
			ctx.fillStyle = sty === 'Solid'
				? Color.toCss(style._0)
				: sty === 'Texture'
					? texture(redo, ctx, style._0)
					: gradient(ctx, style._0);
		}
	
		function trace(ctx, path)
		{
			var points = List.toArray(path);
			var i = points.length - 1;
			if (i <= 0)
			{
				return;
			}
			ctx.moveTo(points[i]._0, points[i]._1);
			while (i--)
			{
				ctx.lineTo(points[i]._0, points[i]._1);
			}
			if (path.closed)
			{
				i = points.length - 1;
				ctx.lineTo(points[i]._0, points[i]._1);
			}
		}
	
		function line(ctx,style,path)
		{
			(style.dashing.ctor === '[]')
				? trace(ctx, path)
				: customLineHelp(ctx, style, path);
			ctx.scale(1,-1);
			ctx.stroke();
		}
	
		function customLineHelp(ctx, style, path)
		{
			var points = List.toArray(path);
			if (path.closed)
			{
				points.push(points[0]);
			}
			var pattern = List.toArray(style.dashing);
			var i = points.length - 1;
			if (i <= 0)
			{
				return;
			}
			var x0 = points[i]._0, y0 = points[i]._1;
			var x1=0, y1=0, dx=0, dy=0, remaining=0, nx=0, ny=0;
			var pindex = 0, plen = pattern.length;
			var draw = true, segmentLength = pattern[0];
			ctx.moveTo(x0,y0);
			while (i--)
			{
				x1 = points[i]._0;
				y1 = points[i]._1;
				dx = x1 - x0;
				dy = y1 - y0;
				remaining = Math.sqrt(dx * dx + dy * dy);
				while (segmentLength <= remaining)
				{
					x0 += dx * segmentLength / remaining;
					y0 += dy * segmentLength / remaining;
					ctx[draw ? 'lineTo' : 'moveTo'](x0, y0);
					// update starting position
					dx = x1 - x0;
					dy = y1 - y0;
					remaining = Math.sqrt(dx * dx + dy * dy);
					// update pattern
					draw = !draw;
					pindex = (pindex + 1) % plen;
					segmentLength = pattern[pindex];
				}
				if (remaining > 0)
				{
					ctx[draw ? 'lineTo' : 'moveTo'](x1, y1);
					segmentLength -= remaining;
				}
				x0 = x1;
				y0 = y1;
			}
		}
	
		function drawLine(ctx, style, path)
		{
			setStrokeStyle(ctx, style);
			return line(ctx, style, path);
		}
	
		function texture(redo, ctx, src)
		{
			var img = new Image();
			img.src = src;
			img.onload = redo;
			return ctx.createPattern(img, 'repeat');
		}
	
		function gradient(ctx, grad)
		{
			var g;
			var stops = [];
			if (grad.ctor === 'Linear')
			{
				var p0 = grad._0, p1 = grad._1;
				g = ctx.createLinearGradient(p0._0, -p0._1, p1._0, -p1._1);
				stops = List.toArray(grad._2);
			}
			else
			{
				var p0 = grad._0, p2 = grad._2;
				g = ctx.createRadialGradient(p0._0, -p0._1, grad._1, p2._0, -p2._1, grad._3);
				stops = List.toArray(grad._4);
			}
			var len = stops.length;
			for (var i = 0; i < len; ++i)
			{
				var stop = stops[i];
				g.addColorStop(stop._0, Color.toCss(stop._1));
			}
			return g;
		}
	
		function drawShape(redo, ctx, style, path)
		{
			trace(ctx, path);
			setFillStyle(ctx, style);
			ctx.scale(1,-1);
			ctx.fill();
		}
	
	
		// TEXT RENDERING
	
		function fillText(redo, ctx, text)
		{
			drawText(ctx, text, ctx.fillText);
		}
	
		function strokeText(redo, ctx, style, text)
		{
			setStrokeStyle(ctx, style);
			// Use native canvas API for dashes only for text for now
			// Degrades to non-dashed on IE 9 + 10
			if (style.dashing.ctor !== '[]' && ctx.setLineDash)
			{
				var pattern = List.toArray(style.dashing);
				ctx.setLineDash(pattern);
			}
			drawText(ctx, text, ctx.strokeText);
		}
	
		function drawText(ctx, text, canvasDrawFn)
		{
			var textChunks = chunkText(defaultContext, text);
	
			var totalWidth = 0;
			var maxHeight = 0;
			var numChunks = textChunks.length;
	
			ctx.scale(1,-1);
	
			for (var i = numChunks; i--; )
			{
				var chunk = textChunks[i];
				ctx.font = chunk.font;
				var metrics = ctx.measureText(chunk.text);
				chunk.width = metrics.width;
				totalWidth += chunk.width;
				if (chunk.height > maxHeight)
				{
					maxHeight = chunk.height;
				}
			}
	
			var x = -totalWidth / 2.0;
			for (var i = 0; i < numChunks; ++i)
			{
				var chunk = textChunks[i];
				ctx.font = chunk.font;
				ctx.fillStyle = chunk.color;
				canvasDrawFn.call(ctx, chunk.text, x, maxHeight / 2);
				x += chunk.width;
			}
		}
	
		function toFont(props)
		{
			return [
				props['font-style'],
				props['font-variant'],
				props['font-weight'],
				props['font-size'],
				props['font-family']
			].join(' ');
		}
	
	
		// Convert the object returned by the text module
		// into something we can use for styling canvas text
		function chunkText(context, text)
		{
			var tag = text.ctor;
			if (tag === 'Text:Append')
			{
				var leftChunks = chunkText(context, text._0);
				var rightChunks = chunkText(context, text._1);
				return leftChunks.concat(rightChunks);
			}
			if (tag === 'Text:Text')
			{
				return [{
					text: text._0,
					color: context.color,
					height: context['font-size'].slice(0,-2) | 0,
					font: toFont(context)
				}];
			}
			if (tag === 'Text:Meta')
			{
				var newContext = freshContext(text._0, context);
				return chunkText(newContext, text._1);
			}
		}
	
		function freshContext(props, ctx)
		{
			return {
				'font-style': props['font-style'] || ctx['font-style'],
				'font-variant': props['font-variant'] || ctx['font-variant'],
				'font-weight': props['font-weight'] || ctx['font-weight'],
				'font-size': props['font-size'] || ctx['font-size'],
				'font-family': props['font-family'] || ctx['font-family'],
				'color': props['color'] || ctx['color']
			};
		}
	
		var defaultContext = {
			'font-style': 'normal',
			'font-variant': 'normal',
			'font-weight': 'normal',
			'font-size': '12px',
			'font-family': 'sans-serif',
			'color': 'black'
		};
	
	
		// IMAGES
	
		function drawImage(redo, ctx, form)
		{
			var img = new Image();
			img.onload = redo;
			img.src = form._3;
			var w = form._0,
				h = form._1,
				pos = form._2,
				srcX = pos._0,
				srcY = pos._1,
				srcW = w,
				srcH = h,
				destX = -w/2,
				destY = -h/2,
				destW = w,
				destH = h;
	
			ctx.scale(1,-1);
			ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
		}
	
		function renderForm(redo, ctx, form)
		{
			ctx.save();
	
			var x = form.x,
				y = form.y,
				theta = form.theta,
				scale = form.scale;
	
			if (x !== 0 || y !== 0)
			{
				ctx.translate(x, y);
			}
			if (theta !== 0)
			{
				ctx.rotate(theta);
			}
			if (scale !== 1)
			{
				ctx.scale(scale,scale);
			}
			if (form.alpha !== 1)
			{
				ctx.globalAlpha = ctx.globalAlpha * form.alpha;
			}
	
			ctx.beginPath();
			var f = form.form;
			switch (f.ctor)
			{
				case 'FPath':
					drawLine(ctx, f._0, f._1);
					break;
	
				case 'FImage':
					drawImage(redo, ctx, f);
					break;
	
				case 'FShape':
					if (f._0.ctor === 'Line')
					{
						f._1.closed = true;
						drawLine(ctx, f._0._0, f._1);
					}
					else
					{
						drawShape(redo, ctx, f._0._0, f._1);
					}
					break;
	
				case 'FText':
					fillText(redo, ctx, f._0);
					break;
	
				case 'FOutlinedText':
					strokeText(redo, ctx, f._0, f._1);
					break;
			}
			ctx.restore();
		}
	
		function formToMatrix(form)
		{
		   var scale = form.scale;
		   var matrix = A6( Transform.matrix, scale, 0, 0, scale, form.x, form.y );
	
		   var theta = form.theta
		   if (theta !== 0)
		   {
			   matrix = A2( Transform.multiply, matrix, Transform.rotation(theta) );
		   }
	
		   return matrix;
		}
	
		function str(n)
		{
			if (n < 0.00001 && n > -0.00001)
			{
				return 0;
			}
			return n;
		}
	
		function makeTransform(w, h, form, matrices)
		{
			var props = form.form._0.props;
			var m = A6( Transform.matrix, 1, 0, 0, -1,
						(w - props.width ) / 2,
						(h - props.height) / 2 );
			var len = matrices.length;
			for (var i = 0; i < len; ++i)
			{
				m = A2( Transform.multiply, m, matrices[i] );
			}
			m = A2( Transform.multiply, m, formToMatrix(form) );
	
			return 'matrix(' +
				str( m[0]) + ', ' + str( m[3]) + ', ' +
				str(-m[1]) + ', ' + str(-m[4]) + ', ' +
				str( m[2]) + ', ' + str( m[5]) + ')';
		}
	
		function stepperHelp(list)
		{
			var arr = List.toArray(list);
			var i = 0;
			function peekNext()
			{
				return i < arr.length ? arr[i].form.ctor : '';
			}
			// assumes that there is a next element
			function next()
			{
				var out = arr[i];
				++i;
				return out;
			}
			return {
				peekNext: peekNext,
				next: next
			};
		}
	
		function formStepper(forms)
		{
			var ps = [stepperHelp(forms)];
			var matrices = [];
			var alphas = [];
			function peekNext()
			{
				var len = ps.length;
				var formType = '';
				for (var i = 0; i < len; ++i )
				{
					if (formType = ps[i].peekNext()) return formType;
				}
				return '';
			}
			// assumes that there is a next element
			function next(ctx)
			{
				while (!ps[0].peekNext())
				{
					ps.shift();
					matrices.pop();
					alphas.shift();
					if (ctx)
					{
						ctx.restore();
					}
				}
				var out = ps[0].next();
				var f = out.form;
				if (f.ctor === 'FGroup')
				{
					ps.unshift(stepperHelp(f._1));
					var m = A2(Transform.multiply, f._0, formToMatrix(out));
					ctx.save();
					ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
					matrices.push(m);
	
					var alpha = (alphas[0] || 1) * out.alpha;
					alphas.unshift(alpha);
					ctx.globalAlpha = alpha;
				}
				return out;
			}
			function transforms()
			{
				return matrices;
			}
			function alpha()
			{
				return alphas[0] || 1;
			}
			return {
				peekNext: peekNext,
				next: next,
				transforms: transforms,
				alpha: alpha
			};
		}
	
		function makeCanvas(w,h)
		{
			var canvas = NativeElement.createNode('canvas');
			canvas.style.width  = w + 'px';
			canvas.style.height = h + 'px';
			canvas.style.display = "block";
			canvas.style.position = "absolute";
			var ratio = window.devicePixelRatio || 1;
			canvas.width  = w * ratio;
			canvas.height = h * ratio;
			return canvas;
		}
	
		function render(model)
		{
			var div = NativeElement.createNode('div');
			div.style.overflow = 'hidden';
			div.style.position = 'relative';
			update(div, model, model);
			return div;
		}
	
		function nodeStepper(w,h,div)
		{
			var kids = div.childNodes;
			var i = 0;
			var ratio = window.devicePixelRatio || 1;
	
			function transform(transforms, ctx)
			{
				ctx.translate( w / 2 * ratio, h / 2 * ratio );
				ctx.scale( ratio, -ratio );
				var len = transforms.length;
				for (var i = 0; i < len; ++i)
				{
					var m = transforms[i];
					ctx.save();
					ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
				}
				return ctx;
			}
			function nextContext(transforms)
			{
				while (i < kids.length)
				{
					var node = kids[i];
					if (node.getContext)
					{
						node.width = w * ratio;
						node.height = h * ratio;
						node.style.width = w + 'px';
						node.style.height = h + 'px';
						++i;
						return transform(transforms, node.getContext('2d'));
					}
					div.removeChild(node);
				}
				var canvas = makeCanvas(w,h);
				div.appendChild(canvas);
				// we have added a new node, so we must step our position
				++i;
				return transform(transforms, canvas.getContext('2d'));
			}
			function addElement(matrices, alpha, form)
			{
				var kid = kids[i];
				var elem = form.form._0;
	
				var node = (!kid || kid.getContext)
					? NativeElement.render(elem)
					: NativeElement.update(kid, kid.oldElement, elem);
	
				node.style.position = 'absolute';
				node.style.opacity = alpha * form.alpha * elem.props.opacity;
				NativeElement.addTransform(node.style, makeTransform(w, h, form, matrices));
				node.oldElement = elem;
				++i;
				if (!kid)
				{
					div.appendChild(node);
				}
				else
				{
					div.insertBefore(node, kid);
				}
			}
			function clearRest()
			{
				while (i < kids.length)
				{
					div.removeChild(kids[i]);
				}
			}
			return {
				nextContext: nextContext,
				addElement: addElement,
				clearRest: clearRest
			};
		}
	
	
		function update(div, _, model)
		{
			var w = model.w;
			var h = model.h;
	
			var forms = formStepper(model.forms);
			var nodes = nodeStepper(w,h,div);
			var ctx = null;
			var formType = '';
	
			while (formType = forms.peekNext())
			{
				// make sure we have context if we need it
				if (ctx === null && formType !== 'FElement')
				{
					ctx = nodes.nextContext(forms.transforms());
					ctx.globalAlpha = forms.alpha();
				}
	
				var form = forms.next(ctx);
				// if it is FGroup, all updates are made within formStepper when next is called.
				if (formType === 'FElement')
				{
					// update or insert an element, get a new context
					nodes.addElement(forms.transforms(), forms.alpha(), form);
					ctx = null;
				}
				else if (formType !== 'FGroup')
				{
					renderForm(function() { update(div, model, model); }, ctx, form);
				}
			}
			nodes.clearRest();
			return div;
		}
	
	
		function collage(w,h,forms)
		{
			return A3(NativeElement.newElement, w, h, {
				ctor: 'Custom',
				type: 'Collage',
				render: render,
				update: update,
				model: {w:w, h:h, forms:forms}
			});
		}
	
		return localRuntime.Native.Graphics.Collage.values = {
			collage: F3(collage)
		};
	
	};
	
	
	// setup
	Elm.Native = Elm.Native || {};
	Elm.Native.Graphics = Elm.Native.Graphics || {};
	Elm.Native.Graphics.Element = Elm.Native.Graphics.Element || {};
	
	// definition
	Elm.Native.Graphics.Element.make = function(localRuntime) {
		'use strict';
	
		// attempt to short-circuit
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Graphics = localRuntime.Native.Graphics || {};
		localRuntime.Native.Graphics.Element = localRuntime.Native.Graphics.Element || {};
		if ('values' in localRuntime.Native.Graphics.Element)
		{
			return localRuntime.Native.Graphics.Element.values;
		}
	
		var Color = Elm.Native.Color.make(localRuntime);
		var List = Elm.Native.List.make(localRuntime);
		var Maybe = Elm.Maybe.make(localRuntime);
		var Text = Elm.Native.Text.make(localRuntime);
		var Utils = Elm.Native.Utils.make(localRuntime);
	
	
		// CREATION
	
		function createNode(elementType)
		{
			var node = document.createElement(elementType);
			node.style.padding = "0";
			node.style.margin = "0";
			return node;
		}
	
	
		function newElement(width, height, elementPrim)
		{
			return {
				_: {},
				element: elementPrim,
				props: {
					_: {},
					id: Utils.guid(),
					width: width,
					height: height,
					opacity: 1,
					color: Maybe.Nothing,
					href: "",
					tag: "",
					hover: Utils.Tuple0,
					click: Utils.Tuple0
				}
			};
		}
	
	
		// PROPERTIES
	
		function setProps(elem, node)
		{
			var props = elem.props;
	
			var element = elem.element;
			var width = props.width - (element.adjustWidth || 0);
			var height = props.height - (element.adjustHeight || 0);
			node.style.width  = (width |0) + 'px';
			node.style.height = (height|0) + 'px';
	
			if (props.opacity !== 1)
			{
				node.style.opacity = props.opacity;
			}
	
			if (props.color.ctor === 'Just')
			{
				node.style.backgroundColor = Color.toCss(props.color._0);
			}
	
			if (props.tag !== '')
			{
				node.id = props.tag;
			}
	
			if (props.hover.ctor !== '_Tuple0')
			{
				addHover(node, props.hover);
			}
	
			if (props.click.ctor !== '_Tuple0')
			{
				addClick(node, props.click);
			}
	
			if (props.href !== '')
			{
				var anchor = createNode('a');
				anchor.href = props.href;
				anchor.style.display = 'block';
				anchor.style.pointerEvents = 'auto';
				anchor.appendChild(node);
				node = anchor;
			}
	
			return node;
		}
	
		function addClick(e, handler)
		{
			e.style.pointerEvents = 'auto';
			e.elm_click_handler = handler;
			function trigger(ev)
			{
				e.elm_click_handler(Utils.Tuple0);
				ev.stopPropagation();
			}
			e.elm_click_trigger = trigger;
			e.addEventListener('click', trigger);
		}
	
		function removeClick(e, handler)
		{
			if (e.elm_click_trigger)
			{
				e.removeEventListener('click', e.elm_click_trigger);
				e.elm_click_trigger = null;
				e.elm_click_handler = null;
			}
		}
	
		function addHover(e, handler)
		{
			e.style.pointerEvents = 'auto';
			e.elm_hover_handler = handler;
			e.elm_hover_count = 0;
	
			function over(evt)
			{
				if (e.elm_hover_count++ > 0) return;
				e.elm_hover_handler(true);
				evt.stopPropagation();
			}
			function out(evt)
			{
				if (e.contains(evt.toElement || evt.relatedTarget)) return;
				e.elm_hover_count = 0;
				e.elm_hover_handler(false);
				evt.stopPropagation();
			}
			e.elm_hover_over = over;
			e.elm_hover_out = out;
			e.addEventListener('mouseover', over);
			e.addEventListener('mouseout', out);
		}
	
		function removeHover(e)
		{
			e.elm_hover_handler = null;
			if (e.elm_hover_over)
			{
				e.removeEventListener('mouseover', e.elm_hover_over);
				e.elm_hover_over = null;
			}
			if (e.elm_hover_out)
			{
				e.removeEventListener('mouseout', e.elm_hover_out);
				e.elm_hover_out = null;
			}
		}
	
	
		// IMAGES
	
		function image(props, img)
		{
			switch (img._0.ctor)
			{
				case 'Plain':
					return plainImage(img._3);
	
				case 'Fitted':
					return fittedImage(props.width, props.height, img._3);
	
				case 'Cropped':
					return croppedImage(img,props.width,props.height,img._3);
	
				case 'Tiled':
					return tiledImage(img._3);
			}
		}
	
		function plainImage(src)
		{
			var img = createNode('img');
			img.src = src;
			img.name = src;
			img.style.display = "block";
			return img;
		}
	
		function tiledImage(src)
		{
			var div = createNode('div');
			div.style.backgroundImage = 'url(' + src + ')';
			return div;
		}
	
		function fittedImage(w, h, src)
		{
			var div = createNode('div');
			div.style.background = 'url(' + src + ') no-repeat center';
			div.style.webkitBackgroundSize = 'cover';
			div.style.MozBackgroundSize = 'cover';
			div.style.OBackgroundSize = 'cover';
			div.style.backgroundSize = 'cover';
			return div;
		}
	
		function croppedImage(elem, w, h, src)
		{
			var pos = elem._0._0;
			var e = createNode('div');
			e.style.overflow = "hidden";
	
			var img = createNode('img');
			img.onload = function() {
				var sw = w / elem._1, sh = h / elem._2;
				img.style.width = ((this.width * sw)|0) + 'px';
				img.style.height = ((this.height * sh)|0) + 'px';
				img.style.marginLeft = ((- pos._0 * sw)|0) + 'px';
				img.style.marginTop = ((- pos._1 * sh)|0) + 'px';
			};
			img.src = src;
			img.name = src;
			e.appendChild(img);
			return e;
		}
	
	
		// FLOW
	
		function goOut(node)
		{
			node.style.position = 'absolute';
			return node;
		}
		function goDown(node)
		{
			return node;
		}
		function goRight(node)
		{
			node.style.styleFloat = 'left';
			node.style.cssFloat = 'left';
			return node;
		}
	
		var directionTable = {
			DUp    : goDown,
			DDown  : goDown,
			DLeft  : goRight,
			DRight : goRight,
			DIn    : goOut,
			DOut   : goOut
		};
		function needsReversal(dir)
		{
			return dir == 'DUp' || dir == 'DLeft' || dir == 'DIn';
		}
	
		function flow(dir,elist)
		{
			var array = List.toArray(elist);
			var container = createNode('div');
			var goDir = directionTable[dir];
			if (goDir == goOut)
			{
				container.style.pointerEvents = 'none';
			}
			if (needsReversal(dir))
			{
				array.reverse();
			}
			var len = array.length;
			for (var i = 0; i < len; ++i)
			{
				container.appendChild(goDir(render(array[i])));
			}
			return container;
		}
	
	
		// CONTAINER
	
		function toPos(pos)
		{
			return pos.ctor === "Absolute"
				? pos._0 + "px"
				: (pos._0 * 100) + "%";
		}
	
		// must clear right, left, top, bottom, and transform
		// before calling this function
		function setPos(pos,elem,e)
		{
			var element = elem.element;
			var props = elem.props;
			var w = props.width + (element.adjustWidth ? element.adjustWidth : 0);
			var h = props.height + (element.adjustHeight ? element.adjustHeight : 0);
	
			e.style.position = 'absolute';
			e.style.margin = 'auto';
			var transform = '';
	
			switch (pos.horizontal.ctor)
			{
				case 'P':
					e.style.right = toPos(pos.x);
					e.style.removeProperty('left');
					break;
	
				case 'Z':
					transform = 'translateX(' + ((-w/2)|0) + 'px) ';
	
				case 'N':
					e.style.left = toPos(pos.x);
					e.style.removeProperty('right');
					break;
			}
			switch (pos.vertical.ctor)
			{
				case 'N':
					e.style.bottom = toPos(pos.y);
					e.style.removeProperty('top');
					break;
	
				case 'Z':
					transform += 'translateY(' + ((-h/2)|0) + 'px)';
	
				case 'P':
					e.style.top = toPos(pos.y);
					e.style.removeProperty('bottom');
					break;
			}
			if (transform !== '')
			{
				addTransform(e.style, transform);
			}
			return e;
		}
	
		function addTransform(style, transform)
		{
			style.transform       = transform;
			style.msTransform     = transform;
			style.MozTransform    = transform;
			style.webkitTransform = transform;
			style.OTransform      = transform;
		}
	
		function container(pos,elem)
		{
			var e = render(elem);
			setPos(pos, elem, e);
			var div = createNode('div');
			div.style.position = 'relative';
			div.style.overflow = 'hidden';
			div.appendChild(e);
			return div;
		}
	
	
		function rawHtml(elem)
		{
			var html = elem.html;
			var guid = elem.guid;
			var align = elem.align;
	
			var div = createNode('div');
			div.innerHTML = html;
			div.style.visibility = "hidden";
			if (align)
			{
				div.style.textAlign = align;
			}
			div.style.visibility = 'visible';
			div.style.pointerEvents = 'auto';
			return div;
		}
	
	
		// RENDER
	
		function render(elem)
		{
			return setProps(elem, makeElement(elem));
		}
		function makeElement(e)
		{
			var elem = e.element;
			switch(elem.ctor)
			{
				case 'Image':
					return image(e.props, elem);
	
				case 'Flow':
					return flow(elem._0.ctor, elem._1);
	
				case 'Container':
					return container(elem._0, elem._1);
	
				case 'Spacer':
					return createNode('div');
	
				case 'RawHtml':
					return rawHtml(elem);
	
				case 'Custom':
					return elem.render(elem.model);
			}
		}
	
		function updateAndReplace(node, curr, next)
		{
			var newNode = update(node, curr, next);
			if (newNode !== node)
			{
				node.parentNode.replaceChild(newNode, node);
			}
			return newNode;
		}
	
	
		// UPDATE
	
		function update(node, curr, next)
		{
			var rootNode = node;
			if (node.tagName === 'A')
			{
				node = node.firstChild;
			}
			if (curr.props.id === next.props.id)
			{
				updateProps(node, curr, next);
				return rootNode;
			}
			if (curr.element.ctor !== next.element.ctor)
			{
				return render(next);
			}
			var nextE = next.element;
			var currE = curr.element;
			switch(nextE.ctor)
			{
				case "Spacer":
					updateProps(node, curr, next);
					return rootNode;
	
				case "RawHtml":
					if(currE.html.valueOf() !== nextE.html.valueOf())
					{
						node.innerHTML = nextE.html;
					}
					updateProps(node, curr, next);
					return rootNode;
	
				case "Image":
					if (nextE._0.ctor === 'Plain')
					{
						if (nextE._3 !== currE._3)
						{
							node.src = nextE._3;
						}
					}
					else if (!Utils.eq(nextE,currE)
						|| next.props.width !== curr.props.width
						|| next.props.height !== curr.props.height)
					{
						return render(next);
					}
					updateProps(node, curr, next);
					return rootNode;
	
				case "Flow":
					var arr = List.toArray(nextE._1);
					for (var i = arr.length; i--; )
					{
						arr[i] = arr[i].element.ctor;
					}
					if (nextE._0.ctor !== currE._0.ctor)
					{
						return render(next);
					}
					var nexts = List.toArray(nextE._1);
					var kids = node.childNodes;
					if (nexts.length !== kids.length)
					{
						return render(next);
					}
					var currs = List.toArray(currE._1);
					var dir = nextE._0.ctor;
					var goDir = directionTable[dir];
					var toReverse = needsReversal(dir);
					var len = kids.length;
					for (var i = len; i-- ;)
					{
						var subNode = kids[toReverse ? len - i - 1 : i];
						goDir(updateAndReplace(subNode, currs[i], nexts[i]));
					}
					updateProps(node, curr, next);
					return rootNode;
	
				case "Container":
					var subNode = node.firstChild;
					var newSubNode = updateAndReplace(subNode, currE._1, nextE._1);
					setPos(nextE._0, nextE._1, newSubNode);
					updateProps(node, curr, next);
					return rootNode;
	
				case "Custom":
					if (currE.type === nextE.type)
					{
						var updatedNode = nextE.update(node, currE.model, nextE.model);
						updateProps(updatedNode, curr, next);
						return updatedNode;
					}
					return render(next);
			}
		}
	
		function updateProps(node, curr, next)
		{
			var nextProps = next.props;
			var currProps = curr.props;
	
			var element = next.element;
			var width = nextProps.width - (element.adjustWidth || 0);
			var height = nextProps.height - (element.adjustHeight || 0);
			if (width !== currProps.width)
			{
				node.style.width = (width|0) + 'px';
			}
			if (height !== currProps.height)
			{
				node.style.height = (height|0) + 'px';
			}
	
			if (nextProps.opacity !== currProps.opacity)
			{
				node.style.opacity = nextProps.opacity;
			}
	
			var nextColor = nextProps.color.ctor === 'Just'
				? Color.toCss(nextProps.color._0)
				: '';
			if (node.style.backgroundColor !== nextColor)
			{
				node.style.backgroundColor = nextColor;
			}
	
			if (nextProps.tag !== currProps.tag)
			{
				node.id = nextProps.tag;
			}
	
			if (nextProps.href !== currProps.href)
			{
				if (currProps.href === '')
				{
					// add a surrounding href
					var anchor = createNode('a');
					anchor.href = nextProps.href;
					anchor.style.display = 'block';
					anchor.style.pointerEvents = 'auto';
	
					node.parentNode.replaceChild(anchor, node);
					anchor.appendChild(node);
				}
				else if (nextProps.href === '')
				{
					// remove the surrounding href
					var anchor = node.parentNode;
					anchor.parentNode.replaceChild(node, anchor);
				}
				else
				{
					// just update the link
					node.parentNode.href = nextProps.href;
				}
			}
	
			// update click and hover handlers
			var removed = false;
	
			// update hover handlers
			if (currProps.hover.ctor === '_Tuple0')
			{
				if (nextProps.hover.ctor !== '_Tuple0')
				{
					addHover(node, nextProps.hover);
				}
			}
			else
			{
				if (nextProps.hover.ctor === '_Tuple0')
				{
					removed = true;
					removeHover(node);
				}
				else
				{
					node.elm_hover_handler = nextProps.hover;
				}
			}
	
			// update click handlers
			if (currProps.click.ctor === '_Tuple0')
			{
				if (nextProps.click.ctor !== '_Tuple0')
				{
					addClick(node, nextProps.click);
				}
			}
			else
			{
				if (nextProps.click.ctor === '_Tuple0')
				{
					removed = true;
					removeClick(node);
				}
				else
				{
					node.elm_click_handler = nextProps.click;
				}
			}
	
			// stop capturing clicks if
			if (removed
				&& nextProps.hover.ctor === '_Tuple0'
				&& nextProps.click.ctor === '_Tuple0')
			{
				node.style.pointerEvents = 'none';
			}
		}
	
	
		// TEXT
	
		function block(align)
		{
			return function(text)
			{
				var raw = {
					ctor :'RawHtml',
					html : Text.renderHtml(text),
					align: align
				};
				var pos = htmlHeight(0, raw);
				return newElement(pos._0, pos._1, raw);
			}
		}
	
		function markdown(text)
		{
			var raw = {
				ctor:'RawHtml',
				html: text,
				align: null
			};
			var pos = htmlHeight(0, raw);
			return newElement(pos._0, pos._1, raw);
		}
	
		function htmlHeight(width, rawHtml)
		{
			// create dummy node
			var temp = document.createElement('div');
			temp.innerHTML = rawHtml.html;
			if (width > 0)
			{
				temp.style.width = width + "px";
			}
			temp.style.visibility = "hidden";
			temp.style.styleFloat = "left";
			temp.style.cssFloat   = "left";
	
			document.body.appendChild(temp);
	
			// get dimensions
			var style = window.getComputedStyle(temp, null);
			var w = Math.ceil(style.getPropertyValue("width").slice(0,-2) - 0);
			var h = Math.ceil(style.getPropertyValue("height").slice(0,-2) - 0);
			document.body.removeChild(temp);
			return Utils.Tuple2(w,h);
		}
	
	
		return localRuntime.Native.Graphics.Element.values = {
			render: render,
			update: update,
			updateAndReplace: updateAndReplace,
	
			createNode: createNode,
			newElement: F3(newElement),
			addTransform: addTransform,
			htmlHeight: F2(htmlHeight),
			guid: Utils.guid,
	
			block: block,
			markdown: markdown
		};
	
	};
	
	Elm.Native.Json = {};
	Elm.Native.Json.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Json = localRuntime.Native.Json || {};
		if (localRuntime.Native.Json.values) {
			return localRuntime.Native.Json.values;
		}
	
		var ElmArray = Elm.Native.Array.make(localRuntime);
		var List = Elm.Native.List.make(localRuntime);
		var Maybe = Elm.Maybe.make(localRuntime);
		var Result = Elm.Result.make(localRuntime);
		var Utils = Elm.Native.Utils.make(localRuntime);
	
	
		function crash(expected, actual) {
			throw new Error(
				'expecting ' + expected + ' but got ' + JSON.stringify(actual)
			);
		}
	
	
		// PRIMITIVE VALUES
	
		function decodeNull(successValue) {
			return function(value) {
				if (value === null) {
					return successValue;
				}
				crash('null', value);
			};
		}
	
	
		function decodeString(value) {
			if (typeof value === 'string' || value instanceof String) {
				return value;
			}
			crash('a String', value);
		}
	
	
		function decodeFloat(value) {
			if (typeof value === 'number') {
				return value;
			}
			crash('a Float', value);
		}
	
	
		function decodeInt(value) {
			if (typeof value === 'number' && (value|0) === value) {
				return value;
			}
			crash('an Int', value);
		}
	
	
		function decodeBool(value) {
			if (typeof value === 'boolean') {
				return value;
			}
			crash('a Bool', value);
		}
	
	
		// ARRAY
	
		function decodeArray(decoder) {
			return function(value) {
				if (value instanceof Array) {
					var len = value.length;
					var array = new Array(len);
					for (var i = len; i-- ; ) {
						array[i] = decoder(value[i]);
					}
					return ElmArray.fromJSArray(array);
				}
				crash('an Array', value);
			};
		}
	
	
		// LIST
	
		function decodeList(decoder) {
			return function(value) {
				if (value instanceof Array) {
					var len = value.length;
					var list = List.Nil;
					for (var i = len; i-- ; ) {
						list = List.Cons( decoder(value[i]), list );
					}
					return list;
				}
				crash('a List', value);
			};
		}
	
	
		// MAYBE
	
		function decodeMaybe(decoder) {
			return function(value) {
				try {
					return Maybe.Just(decoder(value));
				} catch(e) {
					return Maybe.Nothing;
				}
			};
		}
	
	
		// FIELDS
	
		function decodeField(field, decoder) {
			return function(value) {
				var subValue = value[field];
				if (subValue !== undefined) {
					return decoder(subValue);
				}
				crash("an object with field '" + field + "'", value);
			};
		}
	
	
		// OBJECTS
	
		function decodeKeyValuePairs(decoder) {
			return function(value) {
				var isObject =
					typeof value === 'object'
						&& value !== null
						&& !(value instanceof Array);
	
				if (isObject) {
					var keyValuePairs = List.Nil;
					for (var key in value) {
						var elmValue = decoder(value[key]);
						var pair = Utils.Tuple2(key, elmValue);
						keyValuePairs = List.Cons(pair, keyValuePairs);
					}
					return keyValuePairs;
				}
	
				crash("an object", value);
			};
		}
	
		function decodeObject1(f, d1) {
			return function(value) {
				return f(d1(value));
			};
		}
	
		function decodeObject2(f, d1, d2) {
			return function(value) {
				return A2( f, d1(value), d2(value) );
			};
		}
	
		function decodeObject3(f, d1, d2, d3) {
			return function(value) {
				return A3( f, d1(value), d2(value), d3(value) );
			};
		}
	
		function decodeObject4(f, d1, d2, d3, d4) {
			return function(value) {
				return A4( f, d1(value), d2(value), d3(value), d4(value) );
			};
		}
	
		function decodeObject5(f, d1, d2, d3, d4, d5) {
			return function(value) {
				return A5( f, d1(value), d2(value), d3(value), d4(value), d5(value) );
			};
		}
	
		function decodeObject6(f, d1, d2, d3, d4, d5, d6) {
			return function(value) {
				return A6( f,
					d1(value),
					d2(value),
					d3(value),
					d4(value),
					d5(value),
					d6(value)
				);
			};
		}
	
		function decodeObject7(f, d1, d2, d3, d4, d5, d6, d7) {
			return function(value) {
				return A7( f,
					d1(value),
					d2(value),
					d3(value),
					d4(value),
					d5(value),
					d6(value),
					d7(value)
				);
			};
		}
	
		function decodeObject8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
			return function(value) {
				return A8( f,
					d1(value),
					d2(value),
					d3(value),
					d4(value),
					d5(value),
					d6(value),
					d7(value),
					d8(value)
				);
			};
		}
	
	
		// TUPLES
	
		function decodeTuple1(f, d1) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 1 ) {
					crash('a Tuple of length 1', value);
				}
				return f( d1(value[0]) );
			};
		}
	
		function decodeTuple2(f, d1, d2) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 2 ) {
					crash('a Tuple of length 2', value);
				}
				return A2( f, d1(value[0]), d2(value[1]) );
			};
		}
	
		function decodeTuple3(f, d1, d2, d3) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 3 ) {
					crash('a Tuple of length 3', value);
				}
				return A3( f, d1(value[0]), d2(value[1]), d3(value[2]) );
			};
		}
	
	
		function decodeTuple4(f, d1, d2, d3, d4) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 4 ) {
					crash('a Tuple of length 4', value);
				}
				return A4( f, d1(value[0]), d2(value[1]), d3(value[2]), d4(value[3]) );
			};
		}
	
	
		function decodeTuple5(f, d1, d2, d3, d4, d5) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 5 ) {
					crash('a Tuple of length 5', value);
				}
				return A5( f,
					d1(value[0]),
					d2(value[1]),
					d3(value[2]),
					d4(value[3]),
					d5(value[4])
				);
			};
		}
	
	
		function decodeTuple6(f, d1, d2, d3, d4, d5, d6) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 6 ) {
					crash('a Tuple of length 6', value);
				}
				return A6( f,
					d1(value[0]),
					d2(value[1]),
					d3(value[2]),
					d4(value[3]),
					d5(value[4]),
					d6(value[5])
				);
			};
		}
	
		function decodeTuple7(f, d1, d2, d3, d4, d5, d6, d7) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 7 ) {
					crash('a Tuple of length 7', value);
				}
				return A7( f,
					d1(value[0]),
					d2(value[1]),
					d3(value[2]),
					d4(value[3]),
					d5(value[4]),
					d6(value[5]),
					d7(value[6])
				);
			};
		}
	
	
		function decodeTuple8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
			return function(value) {
				if ( !(value instanceof Array) || value.length !== 8 ) {
					crash('a Tuple of length 8', value);
				}
				return A8( f,
					d1(value[0]),
					d2(value[1]),
					d3(value[2]),
					d4(value[3]),
					d5(value[4]),
					d6(value[5]),
					d7(value[6]),
					d8(value[7])
				);
			};
		}
	
	
		// CUSTOM DECODERS
	
		function decodeValue(value) {
			return value;
		}
	
		function runDecoderValue(decoder, value) {
			try {
				return Result.Ok(decoder(value));
			} catch(e) {
				return Result.Err(e.message);
			}
		}
	
		function customDecoder(decoder, callback) {
			return function(value) {
				var result = callback(decoder(value));
				if (result.ctor === 'Err') {
					throw new Error('custom decoder failed: ' + result._0);
				}
				return result._0;
			}
		}
	
		function andThen(decode, callback) {
			return function(value) {
				var result = decode(value);
				return callback(result)(value);
			}
		}
	
		function fail(msg) {
			return function(value) {
				throw new Error(msg);
			}
		}
	
		function succeed(successValue) {
			return function(value) {
				return successValue;
			}
		}
	
	
		// ONE OF MANY
	
		function oneOf(decoders) {
			return function(value) {
				var errors = [];
				var temp = decoders;
				while (temp.ctor !== '[]') {
					try {
						return temp._0(value);
					} catch(e) {
						errors.push(e.message);
					}
					temp = temp._1;
				}
				throw new Error('expecting one of the following:\n    ' + errors.join('\n    '));
			}
		}
	
		function get(decoder, value) {
			try {
				return Result.Ok(decoder(value));
			} catch(e) {
				return Result.Err(e.message);
			}
		}
	
	
		// ENCODE / DECODE
	
		function runDecoderString(decoder, string) {
			try {
				return Result.Ok(decoder(JSON.parse(string)));
			} catch(e) {
				return Result.Err(e.message);
			}
		}
	
		function encode(indentLevel, value) {
			return JSON.stringify(value, null, indentLevel);
		}
	
		function identity(value) {
			return value;
		}
	
		function encodeObject(keyValuePairs) {
			var obj = {};
			while (keyValuePairs.ctor !== '[]') {
				var pair = keyValuePairs._0;
				obj[pair._0] = pair._1;
				keyValuePairs = keyValuePairs._1;
			}
			return obj;
		}
	
		return localRuntime.Native.Json.values = {
			encode: F2(encode),
			runDecoderString: F2(runDecoderString),
			runDecoderValue: F2(runDecoderValue),
	
			get: F2(get),
			oneOf: oneOf,
	
			decodeNull: decodeNull,
			decodeInt: decodeInt,
			decodeFloat: decodeFloat,
			decodeString: decodeString,
			decodeBool: decodeBool,
	
			decodeMaybe: decodeMaybe,
	
			decodeList: decodeList,
			decodeArray: decodeArray,
	
			decodeField: F2(decodeField),
	
			decodeObject1: F2(decodeObject1),
			decodeObject2: F3(decodeObject2),
			decodeObject3: F4(decodeObject3),
			decodeObject4: F5(decodeObject4),
			decodeObject5: F6(decodeObject5),
			decodeObject6: F7(decodeObject6),
			decodeObject7: F8(decodeObject7),
			decodeObject8: F9(decodeObject8),
			decodeKeyValuePairs: decodeKeyValuePairs,
	
			decodeTuple1: F2(decodeTuple1),
			decodeTuple2: F3(decodeTuple2),
			decodeTuple3: F4(decodeTuple3),
			decodeTuple4: F5(decodeTuple4),
			decodeTuple5: F6(decodeTuple5),
			decodeTuple6: F7(decodeTuple6),
			decodeTuple7: F8(decodeTuple7),
			decodeTuple8: F9(decodeTuple8),
	
			andThen: F2(andThen),
			decodeValue: decodeValue,
			customDecoder: F2(customDecoder),
			fail: fail,
			succeed: succeed,
	
			identity: identity,
			encodeNull: null,
			encodeArray: ElmArray.toJSArray,
			encodeList: List.toArray,
			encodeObject: encodeObject
	
		};
	
	};
	
	Elm.Native.List = {};
	Elm.Native.List.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.List = localRuntime.Native.List || {};
		if (localRuntime.Native.List.values)
		{
			return localRuntime.Native.List.values;
		}
		if ('values' in Elm.Native.List)
		{
			return localRuntime.Native.List.values = Elm.Native.List.values;
		}
	
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		var Nil = Utils.Nil;
		var Cons = Utils.Cons;
	
		function toArray(xs)
		{
			var out = [];
			while (xs.ctor !== '[]')
			{
				out.push(xs._0);
				xs = xs._1;
			}
			return out;
		}
	
		function fromArray(arr)
		{
			var out = Nil;
			for (var i = arr.length; i--; )
			{
				out = Cons(arr[i], out);
			}
			return out;
		}
	
		function range(lo,hi)
		{
			var lst = Nil;
			if (lo <= hi)
			{
				do { lst = Cons(hi,lst) } while (hi-->lo);
			}
			return lst
		}
	
		// f defined similarly for both foldl and foldr (NB: different from Haskell)
		// ie, foldl : (a -> b -> b) -> b -> [a] -> b
		function foldl(f, b, xs)
		{
			var acc = b;
			while (xs.ctor !== '[]')
			{
				acc = A2(f, xs._0, acc);
				xs = xs._1;
			}
			return acc;
		}
	
		function foldr(f, b, xs)
		{
			var arr = toArray(xs);
			var acc = b;
			for (var i = arr.length; i--; )
			{
				acc = A2(f, arr[i], acc);
			}
			return acc;
		}
	
		function any(pred, xs)
		{
			while (xs.ctor !== '[]')
			{
				if (pred(xs._0))
				{
					return true;
				}
				xs = xs._1;
			}
			return false;
		}
	
		function map2(f, xs, ys)
		{
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]')
			{
				arr.push(A2(f, xs._0, ys._0));
				xs = xs._1;
				ys = ys._1;
			}
			return fromArray(arr);
		}
	
		function map3(f, xs, ys, zs)
		{
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
			{
				arr.push(A3(f, xs._0, ys._0, zs._0));
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}
	
		function map4(f, ws, xs, ys, zs)
		{
			var arr = [];
			while (   ws.ctor !== '[]'
				   && xs.ctor !== '[]'
				   && ys.ctor !== '[]'
				   && zs.ctor !== '[]')
			{
				arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}
	
		function map5(f, vs, ws, xs, ys, zs)
		{
			var arr = [];
			while (   vs.ctor !== '[]'
				   && ws.ctor !== '[]'
				   && xs.ctor !== '[]'
				   && ys.ctor !== '[]'
				   && zs.ctor !== '[]')
			{
				arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
				vs = vs._1;
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}
	
		function sortBy(f, xs)
		{
			return fromArray(toArray(xs).sort(function(a,b){
				return Utils.cmp(f(a), f(b));
			}));
		}
	
		function sortWith(f, xs)
		{
			return fromArray(toArray(xs).sort(function(a,b){
				var ord = f(a)(b).ctor;
				return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
			}));
		}
	
		function take(n, xs)
		{
			var arr = [];
			while (xs.ctor !== '[]' && n > 0)
			{
				arr.push(xs._0);
				xs = xs._1;
				--n;
			}
			return fromArray(arr);
		}
	
		function drop(n, xs)
		{
			while (xs.ctor !== '[]' && n > 0)
			{
				xs = xs._1;
				--n;
			}
			return xs;
		}
	
		function repeat(n, x)
		{
			var arr = [];
			var pattern = [x];
			while (n > 0)
			{
				if (n & 1)
				{
					arr = arr.concat(pattern);
				}
				n >>= 1, pattern = pattern.concat(pattern);
			}
			return fromArray(arr);
		}
	
	
		Elm.Native.List.values = {
			Nil:Nil,
			Cons:Cons,
			cons:F2(Cons),
			toArray:toArray,
			fromArray:fromArray,
			range:range,
	
			foldl:F3(foldl),
			foldr:F3(foldr),
	
			any:F2(any),
			map2:F3(map2),
			map3:F4(map3),
			map4:F5(map4),
			map5:F6(map5),
			sortBy:F2(sortBy),
			sortWith:F2(sortWith),
			take:F2(take),
			drop:F2(drop),
			repeat:F2(repeat)
		};
		return localRuntime.Native.List.values = Elm.Native.List.values;
	
	};
	
	Elm.Native.Port = {};
	Elm.Native.Port.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Port = localRuntime.Native.Port || {};
		if (localRuntime.Native.Port.values)
		{
			return localRuntime.Native.Port.values;
		}
	
		var NS;
		var Utils = Elm.Native.Utils.make(localRuntime);
	
	
		// INBOUND
	
		function inbound(name, type, converter)
		{
			if (!localRuntime.argsTracker[name])
			{
				throw new Error(
					"Port Error:\n" +
					"No argument was given for the port named '" + name + "' with type:\n\n" +
					"    " + type.split('\n').join('\n        ') + "\n\n" +
					"You need to provide an initial value!\n\n" +
					"Find out more about ports here <http://elm-lang.org/learn/Ports.elm>"
				);
			}
			var arg = localRuntime.argsTracker[name];
			arg.used = true;
	
			return jsToElm(name, type, converter, arg.value);
		}
	
	
		function inboundSignal(name, type, converter)
		{
			var initialValue = inbound(name, type, converter);
	
			if (!NS)
			{
				NS = Elm.Native.Signal.make(localRuntime);
			}
			var signal = NS.input('inbound-port-' + name, initialValue);
	
			function send(jsValue)
			{
				var elmValue = jsToElm(name, type, converter, jsValue);
				setTimeout(function() {
					localRuntime.notify(signal.id, elmValue);
				}, 0);
			}
	
			localRuntime.ports[name] = { send: send };
	
			return signal;
		}
	
	
		function jsToElm(name, type, converter, value)
		{
			try
			{
				return converter(value);
			}
			catch(e)
			{
				throw new Error(
					"Port Error:\n" +
					"Regarding the port named '" + name + "' with type:\n\n" +
					"    " + type.split('\n').join('\n        ') + "\n\n" +
					"You just sent the value:\n\n" +
					"    " + JSON.stringify(value) + "\n\n" +
					"but it cannot be converted to the necessary type.\n" +
					e.message
				);
			}
		}
	
	
		// OUTBOUND
	
		function outbound(name, converter, elmValue)
		{
			localRuntime.ports[name] = converter(elmValue);
		}
	
	
		function outboundSignal(name, converter, signal)
		{
			var subscribers = [];
	
			function subscribe(handler)
			{
				subscribers.push(handler);
			}
			function unsubscribe(handler)
			{
				subscribers.pop(subscribers.indexOf(handler));
			}
	
			function notify(elmValue)
			{
				var jsValue = converter(elmValue);
				var len = subscribers.length;
				for (var i = 0; i < len; ++i)
				{
					subscribers[i](jsValue);
				}
			}
	
			if (!NS)
			{
				NS = Elm.Native.Signal.make(localRuntime);
			}
			NS.output('outbound-port-' + name, notify, signal);
	
			localRuntime.ports[name] = {
				subscribe: subscribe,
				unsubscribe: unsubscribe
			};
	
			return signal;
		}
	
	
		return localRuntime.Native.Port.values = {
			inbound: inbound,
			outbound: outbound,
			inboundSignal: inboundSignal,
			outboundSignal: outboundSignal
		};
	};
	
	
	if (!Elm.fullscreen) {
	
		(function() {
			'use strict';
	
			var Display = {
				FULLSCREEN: 0,
				COMPONENT: 1,
				NONE: 2
			};
	
			Elm.fullscreen = function(module, args)
			{
				var container = document.createElement('div');
				document.body.appendChild(container);
				return init(Display.FULLSCREEN, container, module, args || {});
			};
	
			Elm.embed = function(module, container, args)
			{
				var tag = container.tagName;
				if (tag !== 'DIV')
				{
					throw new Error('Elm.node must be given a DIV, not a ' + tag + '.');
				}
				return init(Display.COMPONENT, container, module, args || {});
			};
	
			Elm.worker = function(module, args)
			{
				return init(Display.NONE, {}, module, args || {});
			};
	
			function init(display, container, module, args, moduleToReplace)
			{
				// defining state needed for an instance of the Elm RTS
				var inputs = [];
	
				/* OFFSET
				 * Elm's time traveling debugger lets you pause time. This means
				 * "now" may be shifted a bit into the past. By wrapping Date.now()
				 * we can manage this.
				 */
				var timer = {
					programStart: Date.now(),
					now: function()
					{
						return Date.now();
					}
				};
	
				var updateInProgress = false;
				function notify(id, v)
				{
					if (updateInProgress)
					{
						throw new Error(
							'The notify function has been called synchronously!\n' +
							'This can lead to frames being dropped.\n' +
							'Definitely report this to <https://github.com/elm-lang/Elm/issues>\n');
					}
					updateInProgress = true;
					var timestep = timer.now();
					for (var i = inputs.length; i--; )
					{
						inputs[i].notify(timestep, id, v);
					}
					updateInProgress = false;
				}
				function setTimeout(func, delay)
				{
					return window.setTimeout(func, delay);
				}
	
				var listeners = [];
				function addListener(relevantInputs, domNode, eventName, func)
				{
					domNode.addEventListener(eventName, func);
					var listener = {
						relevantInputs: relevantInputs,
						domNode: domNode,
						eventName: eventName,
						func: func
					};
					listeners.push(listener);
				}
	
				var argsTracker = {};
				for (var name in args)
				{
					argsTracker[name] = {
						value: args[name],
						used: false
					};
				}
	
				// create the actual RTS. Any impure modules will attach themselves to this
				// object. This permits many Elm programs to be embedded per document.
				var elm = {
					notify: notify,
					setTimeout: setTimeout,
					node: container,
					addListener: addListener,
					inputs: inputs,
					timer: timer,
					argsTracker: argsTracker,
					ports: {},
	
					isFullscreen: function() { return display === Display.FULLSCREEN; },
					isEmbed: function() { return display === Display.COMPONENT; },
					isWorker: function() { return display === Display.NONE; }
				};
	
				function swap(newModule)
				{
					removeListeners(listeners);
					var div = document.createElement('div');
					var newElm = init(display, div, newModule, args, elm);
					inputs = [];
					// elm.swap = newElm.swap;
					return newElm;
				}
	
				function dispose()
				{
					removeListeners(listeners);
					inputs = [];
				}
	
				var Module = {};
				try
				{
					Module = module.make(elm);
					checkInputs(elm);
				}
				catch (error)
				{
					if (typeof container.appendChild == 'undefined')
					{
						console.log(error.message);
					}
					else
					{
						container.appendChild(errorNode(error.message));
					}
					throw error;
				}
	
				if (display !== Display.NONE)
				{
					var graphicsNode = initGraphics(elm, Module);
				}
	
				var rootNode = { kids: inputs };
				trimDeadNodes(rootNode);
				inputs = rootNode.kids;
				filterListeners(inputs, listeners);
	
				addReceivers(elm.ports);
	
				if (typeof moduleToReplace !== 'undefined')
				{
					hotSwap(moduleToReplace, elm);
	
					// rerender scene if graphics are enabled.
					if (typeof graphicsNode !== 'undefined')
					{
						graphicsNode.notify(0, true, 0);
					}
				}
	
				return {
					swap: swap,
					ports: elm.ports,
					dispose: dispose
				};
			};
	
			function checkInputs(elm)
			{
				var argsTracker = elm.argsTracker;
				for (var name in argsTracker)
				{
					if (!argsTracker[name].used)
					{
						throw new Error(
							"Port Error:\nYou provided an argument named '" + name +
							"' but there is no corresponding port!\n\n" +
							"Maybe add a port '" + name + "' to your Elm module?\n" +
							"Maybe remove the '" + name + "' argument from your initialization code in JS?"
						);
					}
				}
			}
	
			function errorNode(message)
			{
				var code = document.createElement('code');
	
				var lines = message.split('\n');
				code.appendChild(document.createTextNode(lines[0]));
				code.appendChild(document.createElement('br'));
				code.appendChild(document.createElement('br'));
				for (var i = 1; i < lines.length; ++i)
				{
					code.appendChild(document.createTextNode('\u00A0 \u00A0 ' + lines[i].replace(/  /g, '\u00A0 ')));
					code.appendChild(document.createElement('br'));
				}
				code.appendChild(document.createElement('br'));
				code.appendChild(document.createTextNode("Open the developer console for more details."));
				return code;
			}
	
	
			//// FILTER SIGNALS ////
	
			// TODO: move this code into the signal module and create a function
			// Signal.initializeGraph that actually instantiates everything.
	
			function filterListeners(inputs, listeners)
			{
				loop:
				for (var i = listeners.length; i--; )
				{
					var listener = listeners[i];
					for (var j = inputs.length; j--; )
					{
						if (listener.relevantInputs.indexOf(inputs[j].id) >= 0)
						{
							continue loop;
						}
					}
					listener.domNode.removeEventListener(listener.eventName, listener.func);
				}
			}
	
			function removeListeners(listeners)
			{
				for (var i = listeners.length; i--; )
				{
					var listener = listeners[i];
					listener.domNode.removeEventListener(listener.eventName, listener.func);
				}
			}
	
			// add receivers for built-in ports if they are defined
			function addReceivers(ports)
			{
				if ('title' in ports)
				{
					if (typeof ports.title === 'string')
					{
						document.title = ports.title;
					}
					else
					{
						ports.title.subscribe(function(v) { document.title = v; });
					}
				}
				if ('redirect' in ports)
				{
					ports.redirect.subscribe(function(v) {
						if (v.length > 0)
						{
							window.location = v;
						}
					});
				}
			}
	
	
			// returns a boolean representing whether the node is alive or not.
			function trimDeadNodes(node)
			{
				if (node.isOutput)
				{
					return true;
				}
	
				var liveKids = [];
				for (var i = node.kids.length; i--; )
				{
					var kid = node.kids[i];
					if (trimDeadNodes(kid))
					{
						liveKids.push(kid);
					}
				}
				node.kids = liveKids;
	
				return liveKids.length > 0;
			}
	
	
			////  RENDERING  ////
	
			function initGraphics(elm, Module)
			{
				if (!('main' in Module))
				{
					throw new Error("'main' is missing! What do I display?!");
				}
	
				var signalGraph = Module.main;
	
				// make sure the signal graph is actually a signal & extract the visual model
				if (!('notify' in signalGraph))
				{
					signalGraph = Elm.Signal.make(elm).constant(signalGraph);
				}
				var initialScene = signalGraph.value;
	
				// Figure out what the render functions should be
				var render;
				var update;
				if (initialScene.props)
				{
					var Element = Elm.Native.Graphics.Element.make(elm);
					render = Element.render;
					update = Element.updateAndReplace;
				}
				else
				{
					var VirtualDom = Elm.Native.VirtualDom.make(elm);
					render = VirtualDom.render;
					update = VirtualDom.updateAndReplace;
				}
	
				// Add the initialScene to the DOM
				var container = elm.node;
				var node = render(initialScene);
				while (container.firstChild)
				{
					container.removeChild(container.firstChild);
				}
				container.appendChild(node);
	
				var _requestAnimationFrame =
					typeof requestAnimationFrame !== 'undefined'
						? requestAnimationFrame
						: function(cb) { setTimeout(cb, 1000/60); }
						;
	
				// domUpdate is called whenever the main Signal changes.
				//
				// domUpdate and drawCallback implement a small state machine in order
				// to schedule only 1 draw per animation frame. This enforces that
				// once draw has been called, it will not be called again until the
				// next frame.
				//
				// drawCallback is scheduled whenever
				// 1. The state transitions from PENDING_REQUEST to EXTRA_REQUEST, or
				// 2. The state transitions from NO_REQUEST to PENDING_REQUEST
				//
				// Invariants:
				// 1. In the NO_REQUEST state, there is never a scheduled drawCallback.
				// 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly 1
				//    scheduled drawCallback.
				var NO_REQUEST = 0;
				var PENDING_REQUEST = 1;
				var EXTRA_REQUEST = 2;
				var state = NO_REQUEST;
				var savedScene = initialScene;
				var scheduledScene = initialScene;
	
				function domUpdate(newScene)
				{
					scheduledScene = newScene;
	
					switch (state)
					{
						case NO_REQUEST:
							_requestAnimationFrame(drawCallback);
							state = PENDING_REQUEST;
							return;
						case PENDING_REQUEST:
							state = PENDING_REQUEST;
							return;
						case EXTRA_REQUEST:
							state = PENDING_REQUEST;
							return;
					}
				}
	
				function drawCallback()
				{
					switch (state)
					{
						case NO_REQUEST:
							// This state should not be possible. How can there be no
							// request, yet somehow we are actively fulfilling a
							// request?
							throw new Error(
								"Unexpected draw callback.\n" +
								"Please report this to <https://github.com/elm-lang/core/issues>."
							);
	
						case PENDING_REQUEST:
							// At this point, we do not *know* that another frame is
							// needed, but we make an extra request to rAF just in
							// case. It's possible to drop a frame if rAF is called
							// too late, so we just do it preemptively.
							_requestAnimationFrame(drawCallback);
							state = EXTRA_REQUEST;
	
							// There's also stuff we definitely need to draw.
							draw();
							return;
	
						case EXTRA_REQUEST:
							// Turns out the extra request was not needed, so we will
							// stop calling rAF. No reason to call it all the time if
							// no one needs it.
							state = NO_REQUEST;
							return;
					}
				}
	
				function draw()
				{
					update(elm.node.firstChild, savedScene, scheduledScene);
					if (elm.Native.Window)
					{
						elm.Native.Window.values.resizeIfNeeded();
					}
					savedScene = scheduledScene;
				}
	
				var renderer = Elm.Native.Signal.make(elm).output('main', domUpdate, signalGraph);
	
				// must check for resize after 'renderer' is created so
				// that changes show up.
				if (elm.Native.Window)
				{
					elm.Native.Window.values.resizeIfNeeded();
				}
	
				return renderer;
			}
	
			//// HOT SWAPPING ////
	
			// Returns boolean indicating if the swap was successful.
			// Requires that the two signal graphs have exactly the same
			// structure.
			function hotSwap(from, to)
			{
				function similar(nodeOld,nodeNew)
				{
					if (nodeOld.id !== nodeNew.id)
					{
						return false;
					}
					if (nodeOld.isOutput)
					{
						return nodeNew.isOutput;
					}
					return nodeOld.kids.length === nodeNew.kids.length;
				}
				function swap(nodeOld,nodeNew)
				{
					nodeNew.value = nodeOld.value;
					return true;
				}
				var canSwap = depthFirstTraversals(similar, from.inputs, to.inputs);
				if (canSwap)
				{
					depthFirstTraversals(swap, from.inputs, to.inputs);
				}
				from.node.parentNode.replaceChild(to.node, from.node);
	
				return canSwap;
			}
	
			// Returns false if the node operation f ever fails.
			function depthFirstTraversals(f, queueOld, queueNew)
			{
				if (queueOld.length !== queueNew.length)
				{
					return false;
				}
				queueOld = queueOld.slice(0);
				queueNew = queueNew.slice(0);
	
				var seen = [];
				while (queueOld.length > 0 && queueNew.length > 0)
				{
					var nodeOld = queueOld.pop();
					var nodeNew = queueNew.pop();
					if (seen.indexOf(nodeOld.id) < 0)
					{
						if (!f(nodeOld, nodeNew))
						{
							return false;
						}
						queueOld = queueOld.concat(nodeOld.kids || []);
						queueNew = queueNew.concat(nodeNew.kids || []);
						seen.push(nodeOld.id);
					}
				}
				return true;
			}
		}());
	
		function F2(fun)
		{
			function wrapper(a) { return function(b) { return fun(a,b) } }
			wrapper.arity = 2;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F3(fun)
		{
			function wrapper(a) {
				return function(b) { return function(c) { return fun(a,b,c) }}
			}
			wrapper.arity = 3;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F4(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return fun(a,b,c,d) }}}
			}
			wrapper.arity = 4;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F5(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return function(e) { return fun(a,b,c,d,e) }}}}
			}
			wrapper.arity = 5;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F6(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return function(e) { return function(f) {
				return fun(a,b,c,d,e,f) }}}}}
			}
			wrapper.arity = 6;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F7(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return function(e) { return function(f) {
				return function(g) { return fun(a,b,c,d,e,f,g) }}}}}}
			}
			wrapper.arity = 7;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F8(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return function(e) { return function(f) {
				return function(g) { return function(h) {
				return fun(a,b,c,d,e,f,g,h)}}}}}}}
			}
			wrapper.arity = 8;
			wrapper.func = fun;
			return wrapper;
		}
	
		function F9(fun)
		{
			function wrapper(a) { return function(b) { return function(c) {
				return function(d) { return function(e) { return function(f) {
				return function(g) { return function(h) { return function(i) {
				return fun(a,b,c,d,e,f,g,h,i) }}}}}}}}
			}
			wrapper.arity = 9;
			wrapper.func = fun;
			return wrapper;
		}
	
		function A2(fun,a,b)
		{
			return fun.arity === 2
				? fun.func(a,b)
				: fun(a)(b);
		}
		function A3(fun,a,b,c)
		{
			return fun.arity === 3
				? fun.func(a,b,c)
				: fun(a)(b)(c);
		}
		function A4(fun,a,b,c,d)
		{
			return fun.arity === 4
				? fun.func(a,b,c,d)
				: fun(a)(b)(c)(d);
		}
		function A5(fun,a,b,c,d,e)
		{
			return fun.arity === 5
				? fun.func(a,b,c,d,e)
				: fun(a)(b)(c)(d)(e);
		}
		function A6(fun,a,b,c,d,e,f)
		{
			return fun.arity === 6
				? fun.func(a,b,c,d,e,f)
				: fun(a)(b)(c)(d)(e)(f);
		}
		function A7(fun,a,b,c,d,e,f,g)
		{
			return fun.arity === 7
				? fun.func(a,b,c,d,e,f,g)
				: fun(a)(b)(c)(d)(e)(f)(g);
		}
		function A8(fun,a,b,c,d,e,f,g,h)
		{
			return fun.arity === 8
				? fun.func(a,b,c,d,e,f,g,h)
				: fun(a)(b)(c)(d)(e)(f)(g)(h);
		}
		function A9(fun,a,b,c,d,e,f,g,h,i)
		{
			return fun.arity === 9
				? fun.func(a,b,c,d,e,f,g,h,i)
				: fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
		}
	}
	
	Elm.Native.Show = {};
	Elm.Native.Show.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Show = localRuntime.Native.Show || {};
		if (localRuntime.Native.Show.values)
		{
			return localRuntime.Native.Show.values;
		}
	
		var _Array;
		var Dict;
		var List;
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		var toString = function(v)
		{
			var type = typeof v;
			if (type === "function")
			{
				var name = v.func ? v.func.name : v.name;
				return '<function' + (name === '' ? '' : ': ') + name + '>';
			}
			else if (type === "boolean")
			{
				return v ? "True" : "False";
			}
			else if (type === "number")
			{
				return v + "";
			}
			else if ((v instanceof String) && v.isChar)
			{
				return "'" + addSlashes(v, true) + "'";
			}
			else if (type === "string")
			{
				return '"' + addSlashes(v, false) + '"';
			}
			else if (type === "object" && '_' in v && probablyPublic(v))
			{
				var output = [];
				for (var k in v._)
				{
					for (var i = v._[k].length; i--; )
					{
						output.push(k + " = " + toString(v._[k][i]));
					}
				}
				for (var k in v)
				{
					if (k === '_') continue;
					output.push(k + " = " + toString(v[k]));
				}
				if (output.length === 0)
				{
					return "{}";
				}
				return "{ " + output.join(", ") + " }";
			}
			else if (type === "object" && 'ctor' in v)
			{
				if (v.ctor.substring(0,6) === "_Tuple")
				{
					var output = [];
					for (var k in v)
					{
						if (k === 'ctor') continue;
						output.push(toString(v[k]));
					}
					return "(" + output.join(",") + ")";
				}
				else if (v.ctor === "_Array")
				{
					if (!_Array)
					{
						_Array = Elm.Array.make(localRuntime);
					}
					var list = _Array.toList(v);
					return "Array.fromList " + toString(list);
				}
				else if (v.ctor === "::")
				{
					var output = '[' + toString(v._0);
					v = v._1;
					while (v.ctor === "::")
					{
						output += "," + toString(v._0);
						v = v._1;
					}
					return output + ']';
				}
				else if (v.ctor === "[]")
				{
					return "[]";
				}
				else if (v.ctor === "RBNode" || v.ctor === "RBEmpty")
				{
					if (!Dict)
					{
						Dict = Elm.Dict.make(localRuntime);
					}
					if (!List)
					{
						List = Elm.List.make(localRuntime);
					}
					var list = Dict.toList(v);
					var name = "Dict";
					if (list.ctor === "::" && list._0._1.ctor === "_Tuple0")
					{
						name = "Set";
						list = A2(List.map, function(x){return x._0}, list);
					}
					return name + ".fromList " + toString(list);
				}
				else if (v.ctor.slice(0,5) === "Text:")
				{
					return '<text>'
				}
				else
				{
					var output = "";
					for (var i in v)
					{
						if (i === 'ctor') continue;
						var str = toString(v[i]);
						var parenless = str[0] === '{' || str[0] === '<' || str.indexOf(' ') < 0;
						output += ' ' + (parenless ? str : '(' + str + ')');
					}
					return v.ctor + output;
				}
			}
			if (type === 'object' && 'notify' in v && 'id' in v)
			{
				return '<Signal>';
			}
			return "<internal structure>";
		};
	
		function addSlashes(str, isChar)
		{
			var s = str.replace(/\\/g, '\\\\')
					  .replace(/\n/g, '\\n')
					  .replace(/\t/g, '\\t')
					  .replace(/\r/g, '\\r')
					  .replace(/\v/g, '\\v')
					  .replace(/\0/g, '\\0');
			if (isChar)
			{
				return s.replace(/\'/g, "\\'")
			}
			else
			{
				return s.replace(/\"/g, '\\"');
			}
		}
	
		function probablyPublic(v)
		{
			var keys = Object.keys(v);
			var len = keys.length;
			if (len === 3
				&& 'props' in v
				&& 'element' in v)
			{
				return false;
			}
			else if (len === 5
				&& 'horizontal' in v
				&& 'vertical' in v
				&& 'x' in v
				&& 'y' in v)
			{
				return false;
			}
			else if (len === 7
				&& 'theta' in v
				&& 'scale' in v
				&& 'x' in v
				&& 'y' in v
				&& 'alpha' in v
				&& 'form' in v)
			{
				return false;
			}
			return true;
		}
	
		return localRuntime.Native.Show.values = {
			toString: toString
		};
	};
	
	Elm.Native.Signal = {};
	Elm.Native.Signal.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Signal = localRuntime.Native.Signal || {};
		if (localRuntime.Native.Signal.values)
		{
			return localRuntime.Native.Signal.values;
		}
	
	
		var Task = Elm.Native.Task.make(localRuntime);
		var Utils = Elm.Native.Utils.make(localRuntime);
	
	
		function broadcastToKids(node, timestamp, update)
		{
			var kids = node.kids;
			for (var i = kids.length; i--; )
			{
				kids[i].notify(timestamp, update, node.id);
			}
		}
	
	
		// INPUT
	
		function input(name, base)
		{
			var node = {
				id: Utils.guid(),
				name: 'input-' + name,
				value: base,
				parents: [],
				kids: []
			};
	
			node.notify = function(timestamp, targetId, value) {
				var update = targetId === node.id;
				if (update)
				{
					node.value = value;
				}
				broadcastToKids(node, timestamp, update);
				return update;
			};
	
			localRuntime.inputs.push(node);
	
			return node;
		}
	
		function constant(value)
		{
			return input('constant', value);
		}
	
	
		// MAILBOX
	
		function mailbox(base)
		{
			var signal = input('mailbox', base);
	
			function send(value) {
				return Task.asyncFunction(function(callback) {
					localRuntime.setTimeout(function() {
						localRuntime.notify(signal.id, value);
					}, 0);
					callback(Task.succeed(Utils.Tuple0));
				});
			}
	
			return {
				_: {},
				signal: signal,
				address: {
					ctor: 'Address',
					_0: send
				}
			};
		}
	
		function sendMessage(message)
		{
			Task.perform(message._0);
		}
	
	
		// OUTPUT
	
		function output(name, handler, parent)
		{
			var node = {
				id: Utils.guid(),
				name: 'output-' + name,
				parents: [parent],
				isOutput: true
			};
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				if (parentUpdate)
				{
					handler(parent.value);
				}
			};
	
			parent.kids.push(node);
	
			return node;
		}
	
	
		// MAP
	
		function mapMany(refreshValue, args)
		{
			var node = {
				id: Utils.guid(),
				name: 'map' + args.length,
				value: refreshValue(),
				parents: args,
				kids: []
			};
	
			var numberOfParents = args.length;
			var count = 0;
			var update = false;
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				++count;
	
				update = update || parentUpdate;
	
				if (count === numberOfParents)
				{
					if (update)
					{
						node.value = refreshValue();
					}
					broadcastToKids(node, timestamp, update);
					update = false;
					count = 0;
				}
			};
	
			for (var i = numberOfParents; i--; )
			{
				args[i].kids.push(node);
			}
	
			return node;
		}
	
	
		function map(func, a)
		{
			function refreshValue()
			{
				return func(a.value);
			}
			return mapMany(refreshValue, [a]);
		}
	
	
		function map2(func, a, b)
		{
			function refreshValue()
			{
				return A2( func, a.value, b.value );
			}
			return mapMany(refreshValue, [a,b]);
		}
	
	
		function map3(func, a, b, c)
		{
			function refreshValue()
			{
				return A3( func, a.value, b.value, c.value );
			}
			return mapMany(refreshValue, [a,b,c]);
		}
	
	
		function map4(func, a, b, c, d)
		{
			function refreshValue()
			{
				return A4( func, a.value, b.value, c.value, d.value );
			}
			return mapMany(refreshValue, [a,b,c,d]);
		}
	
	
		function map5(func, a, b, c, d, e)
		{
			function refreshValue()
			{
				return A5( func, a.value, b.value, c.value, d.value, e.value );
			}
			return mapMany(refreshValue, [a,b,c,d,e]);
		}
	
	
	
		// FOLD
	
		function foldp(update, state, signal)
		{
			var node = {
				id: Utils.guid(),
				name: 'foldp',
				parents: [signal],
				kids: [],
				value: state
			};
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				if (parentUpdate)
				{
					node.value = A2( update, signal.value, node.value );
				}
				broadcastToKids(node, timestamp, parentUpdate);
			};
	
			signal.kids.push(node);
	
			return node;
		}
	
	
		// TIME
	
		function timestamp(signal)
		{
			var node = {
				id: Utils.guid(),
				name: 'timestamp',
				value: Utils.Tuple2(localRuntime.timer.programStart, signal.value),
				parents: [signal],
				kids: []
			};
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				if (parentUpdate)
				{
					node.value = Utils.Tuple2(timestamp, signal.value);
				}
				broadcastToKids(node, timestamp, parentUpdate);
			};
	
			signal.kids.push(node);
	
			return node;
		}
	
	
		function delay(time, signal)
		{
			var delayed = input('delay-input-' + time, signal.value);
	
			function handler(value)
			{
				setTimeout(function() {
					localRuntime.notify(delayed.id, value);
				}, time);
			}
	
			output('delay-output-' + time, handler, signal);
	
			return delayed;
		}
	
	
		// MERGING
	
		function genericMerge(tieBreaker, leftStream, rightStream)
		{
			var node = {
				id: Utils.guid(),
				name: 'merge',
				value: A2(tieBreaker, leftStream.value, rightStream.value),
				parents: [leftStream, rightStream],
				kids: []
			};
	
			var left = { touched: false, update: false, value: null };
			var right = { touched: false, update: false, value: null };
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				if (parentID === leftStream.id)
				{
					left.touched = true;
					left.update = parentUpdate;
					left.value = leftStream.value;
				}
				if (parentID === rightStream.id)
				{
					right.touched = true;
					right.update = parentUpdate;
					right.value = rightStream.value;
				}
	
				if (left.touched && right.touched)
				{
					var update = false;
					if (left.update && right.update)
					{
						node.value = A2(tieBreaker, left.value, right.value);
						update = true;
					}
					else if (left.update)
					{
						node.value = left.value;
						update = true;
					}
					else if (right.update)
					{
						node.value = right.value;
						update = true;
					}
					left.touched = false;
					right.touched = false;
	
					broadcastToKids(node, timestamp, update);
				}
			};
	
			leftStream.kids.push(node);
			rightStream.kids.push(node);
	
			return node;
		}
	
	
		// FILTERING
	
		function filterMap(toMaybe, base, signal)
		{
			var maybe = toMaybe(signal.value);
			var node = {
				id: Utils.guid(),
				name: 'filterMap',
				value: maybe.ctor === 'Nothing' ? base : maybe._0,
				parents: [signal],
				kids: []
			};
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				var update = false;
				if (parentUpdate)
				{
					var maybe = toMaybe(signal.value);
					if (maybe.ctor === 'Just')
					{
						update = true;
						node.value = maybe._0;
					}
				}
				broadcastToKids(node, timestamp, update);
			};
	
			signal.kids.push(node);
	
			return node;
		}
	
	
		// SAMPLING
	
		function sampleOn(ticker, signal)
		{
			var node = {
				id: Utils.guid(),
				name: 'sampleOn',
				value: signal.value,
				parents: [ticker, signal],
				kids: []
			};
	
			var signalTouch = false;
			var tickerTouch = false;
			var tickerUpdate = false;
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				if (parentID === ticker.id)
				{
					tickerTouch = true;
					tickerUpdate = parentUpdate;
				}
				if (parentID === signal.id)
				{
					signalTouch = true;
				}
	
				if (tickerTouch && signalTouch)
				{
					if (tickerUpdate)
					{
						node.value = signal.value;
					}
					tickerTouch = false;
					signalTouch = false;
	
					broadcastToKids(node, timestamp, tickerUpdate);
				}
			};
	
			ticker.kids.push(node);
			signal.kids.push(node);
	
			return node;
		}
	
	
		// DROP REPEATS
	
		function dropRepeats(signal)
		{
			var node = {
				id: Utils.guid(),
				name: 'dropRepeats',
				value: signal.value,
				parents: [signal],
				kids: []
			};
	
			node.notify = function(timestamp, parentUpdate, parentID)
			{
				var update = false;
				if (parentUpdate && !Utils.eq(node.value, signal.value))
				{
					node.value = signal.value;
					update = true;
				}
				broadcastToKids(node, timestamp, update);
			};
	
			signal.kids.push(node);
	
			return node;
		}
	
	
		return localRuntime.Native.Signal.values = {
			input: input,
			constant: constant,
			mailbox: mailbox,
			sendMessage: sendMessage,
			output: output,
			map: F2(map),
			map2: F3(map2),
			map3: F4(map3),
			map4: F5(map4),
			map5: F6(map5),
			foldp: F3(foldp),
			genericMerge: F3(genericMerge),
			filterMap: F3(filterMap),
			sampleOn: F2(sampleOn),
			dropRepeats: dropRepeats,
			timestamp: timestamp,
			delay: F2(delay)
		};
	};
	
	Elm.Native.String = {};
	Elm.Native.String.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.String = localRuntime.Native.String || {};
		if (localRuntime.Native.String.values)
		{
			return localRuntime.Native.String.values;
		}
		if ('values' in Elm.Native.String)
		{
			return localRuntime.Native.String.values = Elm.Native.String.values;
		}
	
	
		var Char = Elm.Char.make(localRuntime);
		var List = Elm.Native.List.make(localRuntime);
		var Maybe = Elm.Maybe.make(localRuntime);
		var Result = Elm.Result.make(localRuntime);
		var Utils = Elm.Native.Utils.make(localRuntime);
	
		function isEmpty(str)
		{
			return str.length === 0;
		}
		function cons(chr,str)
		{
			return chr + str;
		}
		function uncons(str)
		{
			var hd;
			return (hd = str[0])
				? Maybe.Just(Utils.Tuple2(Utils.chr(hd), str.slice(1)))
				: Maybe.Nothing;
		}
		function append(a,b)
		{
			return a + b;
		}
		function concat(strs)
		{
			return List.toArray(strs).join('');
		}
		function length(str)
		{
			return str.length;
		}
		function map(f,str)
		{
			var out = str.split('');
			for (var i = out.length; i--; )
			{
				out[i] = f(Utils.chr(out[i]));
			}
			return out.join('');
		}
		function filter(pred,str)
		{
			return str.split('').map(Utils.chr).filter(pred).join('');
		}
		function reverse(str)
		{
			return str.split('').reverse().join('');
		}
		function foldl(f,b,str)
		{
			var len = str.length;
			for (var i = 0; i < len; ++i)
			{
				b = A2(f, Utils.chr(str[i]), b);
			}
			return b;
		}
		function foldr(f,b,str)
		{
			for (var i = str.length; i--; )
			{
				b = A2(f, Utils.chr(str[i]), b);
			}
			return b;
		}
	
		function split(sep, str)
		{
			return List.fromArray(str.split(sep));
		}
		function join(sep, strs)
		{
			return List.toArray(strs).join(sep);
		}
		function repeat(n, str)
		{
			var result = '';
			while (n > 0)
			{
				if (n & 1)
				{
					result += str;
				}
				n >>= 1, str += str;
			}
			return result;
		}
	
		function slice(start, end, str)
		{
			return str.slice(start,end);
		}
		function left(n, str)
		{
			return n < 1 ? "" : str.slice(0,n);
		}
		function right(n, str)
		{
			return n < 1 ? "" : str.slice(-n);
		}
		function dropLeft(n, str)
		{
			return n < 1 ? str : str.slice(n);
		}
		function dropRight(n, str)
		{
			return n < 1 ? str : str.slice(0,-n);
		}
	
		function pad(n,chr,str)
		{
			var half = (n - str.length) / 2;
			return repeat(Math.ceil(half),chr) + str + repeat(half|0,chr);
		}
		function padRight(n,chr,str)
		{
			return str + repeat(n - str.length, chr);
		}
		function padLeft(n,chr,str)
		{
			return repeat(n - str.length, chr) + str;
		}
	
		function trim(str)
		{
			return str.trim();
		}
		function trimLeft(str)
		{
			return str.trimLeft();
		}
		function trimRight(str)
		{
			return str.trimRight();
		}
	
		function words(str)
		{
			return List.fromArray(str.trim().split(/\s+/g));
		}
		function lines(str)
		{
			return List.fromArray(str.split(/\r\n|\r|\n/g));
		}
	
		function toUpper(str)
		{
			return str.toUpperCase();
		}
		function toLower(str)
		{
			return str.toLowerCase();
		}
	
		function any(pred, str)
		{
			for (var i = str.length; i--; )
			{
				if (pred(Utils.chr(str[i])))
				{
					return true;
				}
			}
			return false;
		}
		function all(pred, str)
		{
			for (var i = str.length; i--; )
			{
				if (!pred(Utils.chr(str[i])))
				{
					return false;
				}
			}
			return true;
		}
	
		function contains(sub, str)
		{
			return str.indexOf(sub) > -1;
		}
		function startsWith(sub, str)
		{
			return str.indexOf(sub) === 0;
		}
		function endsWith(sub, str)
		{
			return str.length >= sub.length &&
				str.lastIndexOf(sub) === str.length - sub.length;
		}
		function indexes(sub, str)
		{
			var subLen = sub.length;
			var i = 0;
			var is = [];
			while ((i = str.indexOf(sub, i)) > -1)
			{
				is.push(i);
				i = i + subLen;
			}
			return List.fromArray(is);
		}
	
		function toInt(s)
		{
			var len = s.length;
			if (len === 0)
			{
				return Result.Err("could not convert string '" + s + "' to an Int" );
			}
			var start = 0;
			if (s[0] == '-')
			{
				if (len === 1)
				{
					return Result.Err("could not convert string '" + s + "' to an Int" );
				}
				start = 1;
			}
			for (var i = start; i < len; ++i)
			{
				if (!Char.isDigit(s[i]))
				{
					return Result.Err("could not convert string '" + s + "' to an Int" );
				}
			}
			return Result.Ok(parseInt(s, 10));
		}
	
		function toFloat(s)
		{
			var len = s.length;
			if (len === 0)
			{
				return Result.Err("could not convert string '" + s + "' to a Float" );
			}
			var start = 0;
			if (s[0] == '-')
			{
				if (len === 1)
				{
					return Result.Err("could not convert string '" + s + "' to a Float" );
				}
				start = 1;
			}
			var dotCount = 0;
			for (var i = start; i < len; ++i)
			{
				if (Char.isDigit(s[i]))
				{
					continue;
				}
				if (s[i] === '.')
				{
					dotCount += 1;
					if (dotCount <= 1)
					{
						continue;
					}
				}
				return Result.Err("could not convert string '" + s + "' to a Float" );
			}
			return Result.Ok(parseFloat(s));
		}
	
		function toList(str)
		{
			return List.fromArray(str.split('').map(Utils.chr));
		}
		function fromList(chars)
		{
			return List.toArray(chars).join('');
		}
	
		return Elm.Native.String.values = {
			isEmpty: isEmpty,
			cons: F2(cons),
			uncons: uncons,
			append: F2(append),
			concat: concat,
			length: length,
			map: F2(map),
			filter: F2(filter),
			reverse: reverse,
			foldl: F3(foldl),
			foldr: F3(foldr),
	
			split: F2(split),
			join: F2(join),
			repeat: F2(repeat),
	
			slice: F3(slice),
			left: F2(left),
			right: F2(right),
			dropLeft: F2(dropLeft),
			dropRight: F2(dropRight),
	
			pad: F3(pad),
			padLeft: F3(padLeft),
			padRight: F3(padRight),
	
			trim: trim,
			trimLeft: trimLeft,
			trimRight: trimRight,
	
			words: words,
			lines: lines,
	
			toUpper: toUpper,
			toLower: toLower,
	
			any: F2(any),
			all: F2(all),
	
			contains: F2(contains),
			startsWith: F2(startsWith),
			endsWith: F2(endsWith),
			indexes: F2(indexes),
	
			toInt: toInt,
			toFloat: toFloat,
			toList: toList,
			fromList: fromList
		};
	};
	
	Elm.Native.Task = {};
	Elm.Native.Task.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Task = localRuntime.Native.Task || {};
		if (localRuntime.Native.Task.values)
		{
			return localRuntime.Native.Task.values;
		}
	
		var Result = Elm.Result.make(localRuntime);
		var Signal;
		var Utils = Elm.Native.Utils.make(localRuntime);
	
	
		// CONSTRUCTORS
	
		function succeed(value)
		{
			return {
				tag: 'Succeed',
				value: value
			};
		}
	
		function fail(error)
		{
			return {
				tag: 'Fail',
				value: error
			};
		}
	
		function asyncFunction(func)
		{
			return {
				tag: 'Async',
				asyncFunction: func
			};
		}
	
		function andThen(task, callback)
		{
			return {
				tag: 'AndThen',
				task: task,
				callback: callback
			};
		}
	
		function catch_(task, callback)
		{
			return {
				tag: 'Catch',
				task: task,
				callback: callback
			};
		}
	
	
		// RUNNER
	
		function perform(task) {
			runTask({ task: task }, function() {});
		}
	
		function performSignal(name, signal)
		{
			var workQueue = [];
	
			function onComplete()
			{
				workQueue.shift();
	
				setTimeout(function() {
					if (workQueue.length > 0)
					{
						runTask(workQueue[0], onComplete);
					}
				}, 0);
			}
	
			function register(task)
			{
				var root = { task: task };
				workQueue.push(root);
				if (workQueue.length === 1)
				{
					runTask(root, onComplete);
				}
			}
	
			if (!Signal)
			{
				Signal = Elm.Native.Signal.make(localRuntime);
			}
			Signal.output('perform-tasks-' + name, register, signal);
	
			register(signal.value);
	
			return signal;
		}
	
		function mark(status, task)
		{
			return { status: status, task: task };
		}
	
		function runTask(root, onComplete)
		{
			var result = mark('runnable', root.task);
			while (result.status === 'runnable')
			{
				result = stepTask(onComplete, root, result.task);
			}
	
			if (result.status === 'done')
			{
				root.task = result.task;
				onComplete();
			}
	
			if (result.status === 'blocked')
			{
				root.task = result.task;
			}
		}
	
		function stepTask(onComplete, root, task)
		{
			var tag = task.tag;
	
			if (tag === 'Succeed' || tag === 'Fail')
			{
				return mark('done', task);
			}
	
			if (tag === 'Async')
			{
				var placeHolder = {};
				var couldBeSync = true;
				var wasSync = false;
	
				task.asyncFunction(function(result) {
					placeHolder.tag = result.tag;
					placeHolder.value = result.value;
					if (couldBeSync)
					{
						wasSync = true;
					}
					else
					{
						runTask(root, onComplete);
					}
				});
				couldBeSync = false;
				return mark(wasSync ? 'done' : 'blocked', placeHolder);
			}
	
			if (tag === 'AndThen' || tag === 'Catch')
			{
				var result = mark('runnable', task.task);
				while (result.status === 'runnable')
				{
					result = stepTask(onComplete, root, result.task);
				}
	
				if (result.status === 'done')
				{
					var activeTask = result.task;
					var activeTag = activeTask.tag;
	
					var succeedChain = activeTag === 'Succeed' && tag === 'AndThen';
					var failChain = activeTag === 'Fail' && tag === 'Catch';
	
					return (succeedChain || failChain)
						? mark('runnable', task.callback(activeTask.value))
						: mark('runnable', activeTask);
				}
				if (result.status === 'blocked')
				{
					return mark('blocked', {
						tag: tag,
						task: result.task,
						callback: task.callback
					});
				}
			}
		}
	
	
		// THREADS
	
		function sleep(time) {
			return asyncFunction(function(callback) {
				setTimeout(function() {
					callback(succeed(Utils.Tuple0));
				}, time);
			});
		}
	
		function spawn(task) {
			return asyncFunction(function(callback) {
				var id = setTimeout(function() {
					perform(task);
				}, 0);
				callback(succeed(id));
			});
		}
	
	
		return localRuntime.Native.Task.values = {
			succeed: succeed,
			fail: fail,
			asyncFunction: asyncFunction,
			andThen: F2(andThen),
			catch_: F2(catch_),
			perform: perform,
			performSignal: performSignal,
			spawn: spawn,
			sleep: sleep
		};
	};
	
	Elm.Native.Text = {};
	Elm.Native.Text.make = function(localRuntime) {
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Text = localRuntime.Native.Text || {};
		if (localRuntime.Native.Text.values)
		{
			return localRuntime.Native.Text.values;
		}
	
		var toCss = Elm.Native.Color.make(localRuntime).toCss;
		var List = Elm.Native.List.make(localRuntime);
	
	
		// CONSTRUCTORS
	
		function fromString(str)
		{
			return {
				ctor: 'Text:Text',
				_0: str
			};
		}
	
		function append(a, b)
		{
			return {
				ctor: 'Text:Append',
				_0: a,
				_1: b
			};
		}
	
		function addMeta(field, value, text)
		{
			var newProps = {};
			var newText = {
				ctor: 'Text:Meta',
				_0: newProps,
				_1: text
			};
	
			if (text.ctor === 'Text:Meta')
			{
				newText._1 = text._1;
				var props = text._0;
				for (var i = metaKeys.length; i--; )
				{
					var key = metaKeys[i];
					var val = props[key];
					if (val)
					{
						newProps[key] = val;
					}
				}
			}
			newProps[field] = value;
			return newText;
		}
	
		var metaKeys = [
			'font-size',
			'font-family',
			'font-style',
			'font-weight',
			'href',
			'text-decoration',
			'color'
		];
	
	
		// conversions from Elm values to CSS
	
		function toTypefaces(list)
		{
			var typefaces = List.toArray(list);
			for (var i = typefaces.length; i--; )
			{
				var typeface = typefaces[i];
				if (typeface.indexOf(' ') > -1)
				{
					typefaces[i] = "'" + typeface + "'";
				}
			}
			return typefaces.join(',');
		}
	
		function toLine(line)
		{
			var ctor = line.ctor;
			return ctor === 'Under'
				? 'underline'
				: ctor === 'Over'
					? 'overline'
					: 'line-through';
		}
	
		// setting styles of Text
	
		function style(style, text)
		{
			var newText = addMeta('color', toCss(style.color), text);
			var props = newText._0;
	
			if (style.typeface.ctor !== '[]')
			{
				props['font-family'] = toTypefaces(style.typeface);
			}
			if (style.height.ctor !== "Nothing")
			{
				props['font-size'] = style.height._0 + 'px';
			}
			if (style.bold)
			{
				props['font-weight'] = 'bold';
			}
			if (style.italic)
			{
				props['font-style'] = 'italic';
			}
			if (style.line.ctor !== 'Nothing')
			{
				props['text-decoration'] = toLine(style.line._0);
			}
			return newText;
		}
	
		function height(px, text)
		{
			return addMeta('font-size', px + 'px', text);
		}
	
		function typeface(names, text)
		{
			return addMeta('font-family', toTypefaces(names), text);
		}
	
		function monospace(text)
		{
			return addMeta('font-family', 'monospace', text);
		}
	
		function italic(text)
		{
			return addMeta('font-style', 'italic', text);
		}
	
		function bold(text)
		{
			return addMeta('font-weight', 'bold', text);
		}
	
		function link(href, text)
		{
			return addMeta('href', href, text);
		}
	
		function line(line, text)
		{
			return addMeta('text-decoration', toLine(line), text);
		}
	
		function color(color, text)
		{
			return addMeta('color', toCss(color), text);;
		}
	
	
		// RENDER
	
		function renderHtml(text)
		{
			var tag = text.ctor;
			if (tag === 'Text:Append')
			{
				return renderHtml(text._0) + renderHtml(text._1);
			}
			if (tag === 'Text:Text')
			{
				return properEscape(text._0);
			}
			if (tag === 'Text:Meta')
			{
				return renderMeta(text._0, renderHtml(text._1));
			}
		}
	
		function renderMeta(metas, string)
		{
			var href = metas['href'];
			if (href)
			{
				string = '<a href="' + href + '">' + string + '</a>';
			}
			var styles = '';
			for (var key in metas)
			{
				if (key === 'href')
				{
					continue;
				}
				styles += key + ':' + metas[key] + ';';
			}
			if (styles)
			{
				string = '<span style="' + styles + '">' + string + '</span>';
			}
			return string;
		}
	
		function properEscape(str)
		{
			if (str.length == 0)
			{
				return str;
			}
			str = str //.replace(/&/g,  "&#38;")
				.replace(/"/g,  '&#34;')
				.replace(/'/g,  "&#39;")
				.replace(/</g,  "&#60;")
				.replace(/>/g,  "&#62;");
			var arr = str.split('\n');
			for (var i = arr.length; i--; )
			{
				arr[i] = makeSpaces(arr[i]);
			}
			return arr.join('<br/>');
		}
	
		function makeSpaces(s)
		{
			if (s.length == 0)
			{
				return s;
			}
			var arr = s.split('');
			if (arr[0] == ' ')
			{
				arr[0] = "&nbsp;"
			}
			for (var i = arr.length; --i; )
			{
				if (arr[i][0] == ' ' && arr[i-1] == ' ')
				{
					arr[i-1] = arr[i-1] + arr[i];
					arr[i] = '';
				}
			}
			for (var i = arr.length; i--; )
			{
				if (arr[i].length > 1 && arr[i][0] == ' ')
				{
					var spaces = arr[i].split('');
					for (var j = spaces.length - 2; j >= 0; j -= 2)
					{
						spaces[j] = '&nbsp;';
					}
					arr[i] = spaces.join('');
				}
			}
			arr = arr.join('');
			if (arr[arr.length-1] === " ")
			{
				return arr.slice(0,-1) + '&nbsp;';
			}
			return arr;
		}
	
	
		return localRuntime.Native.Text.values = {
			fromString: fromString,
			append: F2(append),
	
			height: F2(height),
			italic: italic,
			bold: bold,
			line: F2(line),
			monospace: monospace,
			typeface: F2(typeface),
			color: F2(color),
			link: F2(link),
			style: F2(style),
	
			toTypefaces: toTypefaces,
			toLine: toLine,
			renderHtml: renderHtml
		};
	};
	
	Elm.Native.Transform2D = {};
	Elm.Native.Transform2D.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Transform2D = localRuntime.Native.Transform2D || {};
		if (localRuntime.Native.Transform2D.values)
		{
			return localRuntime.Native.Transform2D.values;
		}
	
		var A;
		if (typeof Float32Array === 'undefined')
		{
			A = function(arr)
			{
				this.length = arr.length;
				this[0] = arr[0];
				this[1] = arr[1];
				this[2] = arr[2];
				this[3] = arr[3];
				this[4] = arr[4];
				this[5] = arr[5];
			};
		}
		else
		{
			A = Float32Array;
		}
	
		// layout of matrix in an array is
		//
		//   | m11 m12 dx |
		//   | m21 m22 dy |
		//   |  0   0   1 |
		//
		//  new A([ m11, m12, dx, m21, m22, dy ])
	
		var identity = new A([1,0,0,0,1,0]);
		function matrix(m11, m12, m21, m22, dx, dy)
		{
			return new A([m11, m12, dx, m21, m22, dy]);
		}
	
		function rotation(t)
		{
			var c = Math.cos(t);
			var s = Math.sin(t);
			return new A([c, -s, 0, s, c, 0]);
		}
	
		function rotate(t,m)
		{
			var c = Math.cos(t);
			var s = Math.sin(t);
			var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4];
			return new A([m11*c + m12*s, -m11*s + m12*c, m[2],
						  m21*c + m22*s, -m21*s + m22*c, m[5]]);
		}
		/*
		function move(xy,m) {
			var x = xy._0;
			var y = xy._1;
			var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4];
			return new A([m11, m12, m11*x + m12*y + m[2],
						  m21, m22, m21*x + m22*y + m[5]]);
		}
		function scale(s,m) { return new A([m[0]*s, m[1]*s, m[2], m[3]*s, m[4]*s, m[5]]); }
		function scaleX(x,m) { return new A([m[0]*x, m[1], m[2], m[3]*x, m[4], m[5]]); }
		function scaleY(y,m) { return new A([m[0], m[1]*y, m[2], m[3], m[4]*y, m[5]]); }
		function reflectX(m) { return new A([-m[0], m[1], m[2], -m[3], m[4], m[5]]); }
		function reflectY(m) { return new A([m[0], -m[1], m[2], m[3], -m[4], m[5]]); }
	
		function transform(m11, m21, m12, m22, mdx, mdy, n) {
			var n11 = n[0], n12 = n[1], n21 = n[3], n22 = n[4], ndx = n[2], ndy = n[5];
			return new A([m11*n11 + m12*n21,
						  m11*n12 + m12*n22,
						  m11*ndx + m12*ndy + mdx,
						  m21*n11 + m22*n21,
						  m21*n12 + m22*n22,
						  m21*ndx + m22*ndy + mdy]);
		}
		*/
		function multiply(m, n)
		{
			var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4], mdx = m[2], mdy = m[5];
			var n11 = n[0], n12 = n[1], n21 = n[3], n22 = n[4], ndx = n[2], ndy = n[5];
			return new A([m11*n11 + m12*n21,
						  m11*n12 + m12*n22,
						  m11*ndx + m12*ndy + mdx,
						  m21*n11 + m22*n21,
						  m21*n12 + m22*n22,
						  m21*ndx + m22*ndy + mdy]);
		}
	
		return localRuntime.Native.Transform2D.values = {
			identity:identity,
			matrix:F6(matrix),
			rotation:rotation,
			multiply:F2(multiply)
			/*
			transform:F7(transform),
			rotate:F2(rotate),
			move:F2(move),
			scale:F2(scale),
			scaleX:F2(scaleX),
			scaleY:F2(scaleY),
			reflectX:reflectX,
			reflectY:reflectY
			*/
		};
	
	};
	
	Elm.Native = Elm.Native || {};
	Elm.Native.Utils = {};
	Elm.Native.Utils.make = function(localRuntime) {
	
		localRuntime.Native = localRuntime.Native || {};
		localRuntime.Native.Utils = localRuntime.Native.Utils || {};
		if (localRuntime.Native.Utils.values)
		{
			return localRuntime.Native.Utils.values;
		}
	
		function eq(l,r)
		{
			var stack = [{'x': l, 'y': r}]
			while (stack.length > 0)
			{
				var front = stack.pop();
				var x = front.x;
				var y = front.y;
				if (x === y)
				{
					continue;
				}
				if (typeof x === "object")
				{
					var c = 0;
					for (var i in x)
					{
						++c;
						if (i in y)
						{
							if (i !== 'ctor')
							{
								stack.push({ 'x': x[i], 'y': y[i] });
							}
						}
						else
						{
							return false;
						}
					}
					if ('ctor' in x)
					{
						stack.push({'x': x.ctor, 'y': y.ctor});
					}
					if (c !== Object.keys(y).length)
					{
						return false;
					}
				}
				else if (typeof x === 'function')
				{
					throw new Error('Equality error: general function equality is ' +
									'undecidable, and therefore, unsupported');
				}
				else
				{
					return false;
				}
			}
			return true;
		}
	
		// code in Generate/JavaScript.hs depends on the particular
		// integer values assigned to LT, EQ, and GT
		var LT = -1, EQ = 0, GT = 1, ord = ['LT','EQ','GT'];
	
		function compare(x,y)
		{
			return {
				ctor: ord[cmp(x,y)+1]
			};
		}
	
		function cmp(x,y) {
			var ord;
			if (typeof x !== 'object')
			{
				return x === y ? EQ : x < y ? LT : GT;
			}
			else if (x.isChar)
			{
				var a = x.toString();
				var b = y.toString();
				return a === b
					? EQ
					: a < b
						? LT
						: GT;
			}
			else if (x.ctor === "::" || x.ctor === "[]")
			{
				while (true)
				{
					if (x.ctor === "[]" && y.ctor === "[]")
					{
						return EQ;
					}
					if (x.ctor !== y.ctor)
					{
						return x.ctor === '[]' ? LT : GT;
					}
					ord = cmp(x._0, y._0);
					if (ord !== EQ)
					{
						return ord;
					}
					x = x._1;
					y = y._1;
				}
			}
			else if (x.ctor.slice(0,6) === '_Tuple')
			{
				var n = x.ctor.slice(6) - 0;
				var err = 'cannot compare tuples with more than 6 elements.';
				if (n === 0) return EQ;
				if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
				if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
				if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
				if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
				if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
				if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
				if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
				return EQ;
			}
			else
			{
				throw new Error('Comparison error: comparison is only defined on ints, ' +
								'floats, times, chars, strings, lists of comparable values, ' +
								'and tuples of comparable values.');
			}
		}
	
	
		var Tuple0 = {
			ctor: "_Tuple0"
		};
	
		function Tuple2(x,y)
		{
			return {
				ctor: "_Tuple2",
				_0: x,
				_1: y
			};
		}
	
		function chr(c)
		{
			var x = new String(c);
			x.isChar = true;
			return x;
		}
	
		function txt(str)
		{
			var t = new String(str);
			t.text = true;
			return t;
		}
	
		var count = 0;
		function guid(_)
		{
			return count++
		}
	
		function copy(oldRecord)
		{
			var newRecord = {};
			for (var key in oldRecord)
			{
				var value = key === '_'
					? copy(oldRecord._)
					: oldRecord[key];
				newRecord[key] = value;
			}
			return newRecord;
		}
	
		function remove(key, oldRecord)
		{
			var record = copy(oldRecord);
			if (key in record._)
			{
				record[key] = record._[key][0];
				record._[key] = record._[key].slice(1);
				if (record._[key].length === 0)
				{
					delete record._[key];
				}
			}
			else
			{
				delete record[key];
			}
			return record;
		}
	
		function replace(keyValuePairs, oldRecord)
		{
			var record = copy(oldRecord);
			for (var i = keyValuePairs.length; i--; )
			{
				var pair = keyValuePairs[i];
				record[pair[0]] = pair[1];
			}
			return record;
		}
	
		function insert(key, value, oldRecord)
		{
			var newRecord = copy(oldRecord);
			if (key in newRecord)
			{
				var values = newRecord._[key];
				var copiedValues = values ? values.slice(0) : [];
				newRecord._[key] = [newRecord[key]].concat(copiedValues);
			}
			newRecord[key] = value;
			return newRecord;
		}
	
		function getXY(e)
		{
			var posx = 0;
			var posy = 0;
			if (e.pageX || e.pageY)
			{
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY)
			{
				posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
	
			if (localRuntime.isEmbed())
			{
				var rect = localRuntime.node.getBoundingClientRect();
				var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
				var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;
				// TODO: figure out if there is a way to avoid rounding here
				posx = posx - Math.round(relx) - localRuntime.node.clientLeft;
				posy = posy - Math.round(rely) - localRuntime.node.clientTop;
			}
			return Tuple2(posx, posy);
		}
	
	
		//// LIST STUFF ////
	
		var Nil = { ctor:'[]' };
	
		function Cons(hd,tl)
		{
			return {
				ctor: "::",
				_0: hd,
				_1: tl
			};
		}
	
		function append(xs,ys)
		{
			// append Strings
			if (typeof xs === "string")
			{
				return xs + ys;
			}
	
			// append Text
			if (xs.ctor.slice(0,5) === 'Text:')
			{
				return {
					ctor: 'Text:Append',
					_0: xs,
					_1: ys
				};
			}
	
	
	
			// append Lists
			if (xs.ctor === '[]')
			{
				return ys;
			}
			var root = Cons(xs._0, Nil);
			var curr = root;
			xs = xs._1;
			while (xs.ctor !== '[]')
			{
				curr._1 = Cons(xs._0, Nil);
				xs = xs._1;
				curr = curr._1;
			}
			curr._1 = ys;
			return root;
		}
	
		//// RUNTIME ERRORS ////
	
		function indent(lines)
		{
			return '\n' + lines.join('\n');
		}
	
		function badCase(moduleName, span)
		{
			var msg = indent([
				'Non-exhaustive pattern match in case-expression.',
				'Make sure your patterns cover every case!'
			]);
			throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
		}
	
		function badIf(moduleName, span)
		{
			var msg = indent([
				'Non-exhaustive pattern match in multi-way-if expression.',
				'It is best to use \'otherwise\' as the last branch of multi-way-if.'
			]);
			throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
		}
	
	
		function badPort(expected, received)
		{
			var msg = indent([
				'Expecting ' + expected + ' but was given ',
				JSON.stringify(received)
			]);
			throw new Error('Runtime error when sending values through a port.' + msg);
		}
	
	
		return localRuntime.Native.Utils.values = {
			eq: eq,
			cmp: cmp,
			compare: F2(compare),
			Tuple0: Tuple0,
			Tuple2: Tuple2,
			chr: chr,
			txt: txt,
			copy: copy,
			remove: remove,
			replace: replace,
			insert: insert,
			guid: guid,
			getXY: getXY,
	
			Nil: Nil,
			Cons: Cons,
			append: F2(append),
	
			badCase: badCase,
			badIf: badIf,
			badPort: badPort
		};
	};
	
	(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	var createElement = require("./vdom/create-element.js")
	
	module.exports = createElement
	
	},{"./vdom/create-element.js":6}],2:[function(require,module,exports){
	(function (global){
	var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = require('min-document');
	
	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];
	
	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }
	
	    module.exports = doccy;
	}
	
	}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	},{"min-document":24}],3:[function(require,module,exports){
	"use strict";
	
	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};
	
	},{}],4:[function(require,module,exports){
	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString
	
	module.exports = nativeIsArray || isArray
	
	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}
	
	},{}],5:[function(require,module,exports){
	var isObject = require("is-object")
	var isHook = require("../vnode/is-vhook.js")
	
	module.exports = applyProperties
	
	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]
	
	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous)
	            if (propValue.hook) {
	                propValue.hook(node,
	                    propName,
	                    previous ? previous[propName] : undefined)
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue
	            }
	        }
	    }
	}
	
	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName]
	
	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName)
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue)
	        }
	    }
	}
	
	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined
	
	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName]
	
	            if (attrValue === undefined) {
	                node.removeAttribute(attrName)
	            } else {
	                node.setAttribute(attrName, attrValue)
	            }
	        }
	
	        return
	    }
	
	    if(previousValue && isObject(previousValue) &&
	        getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue
	        return
	    }
	
	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }
	
	    var replacer = propName === "style" ? "" : undefined
	
	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}
	
	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}
	
	},{"../vnode/is-vhook.js":13,"is-object":3}],6:[function(require,module,exports){
	var document = require("global/document")
	
	var applyProperties = require("./apply-properties")
	
	var isVNode = require("../vnode/is-vnode.js")
	var isVText = require("../vnode/is-vtext.js")
	var isWidget = require("../vnode/is-widget.js")
	var handleThunk = require("../vnode/handle-thunk.js")
	
	module.exports = createElement
	
	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document
	    var warn = opts ? opts.warn : null
	
	    vnode = handleThunk(vnode).a
	
	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }
	
	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)
	
	    var props = vnode.properties
	    applyProperties(node, props)
	
	    var children = vnode.children
	
	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }
	
	    return node
	}
	
	},{"../vnode/handle-thunk.js":11,"../vnode/is-vnode.js":14,"../vnode/is-vtext.js":15,"../vnode/is-widget.js":16,"./apply-properties":5,"global/document":2}],7:[function(require,module,exports){
	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.
	
	var noChild = {}
	
	module.exports = domIndex
	
	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}
	
	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}
	
	
	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }
	
	        var vChildren = tree.children
	
	        if (vChildren) {
	
	            var childNodes = rootNode.childNodes
	
	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1
	
	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)
	
	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
	                }
	
	                rootIndex = nextIndex
	            }
	        }
	    }
	
	    return nodes
	}
	
	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }
	
	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem
	
	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]
	
	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }
	
	    return false;
	}
	
	function ascending(a, b) {
	    return a > b ? 1 : -1
	}
	
	},{}],8:[function(require,module,exports){
	var applyProperties = require("./apply-properties")
	
	var isWidget = require("../vnode/is-widget.js")
	var VPatch = require("../vnode/vpatch.js")
	
	var render = require("./create-element")
	var updateWidget = require("./update-widget")
	
	module.exports = applyPatch
	
	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch
	
	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}
	
	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode
	
	    if (parentNode) {
	        parentNode.removeChild(domNode)
	    }
	
	    destroyWidget(domNode, vNode);
	
	    return null
	}
	
	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = render(vNode, renderOptions)
	
	    if (parentNode) {
	        parentNode.appendChild(newNode)
	    }
	
	    return parentNode
	}
	
	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode
	
	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = render(vText, renderOptions)
	
	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }
	
	    return newNode
	}
	
	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget)
	    var newNode
	
	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode
	    } else {
	        newNode = render(widget, renderOptions)
	    }
	
	    var parentNode = domNode.parentNode
	
	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }
	
	    if (!updating) {
	        destroyWidget(domNode, leftVNode)
	    }
	
	    return newNode
	}
	
	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = render(vNode, renderOptions)
	
	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }
	
	    return newNode
	}
	
	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode)
	    }
	}
	
	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes
	    var keyMap = {}
	    var node
	    var remove
	    var insert
	
	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i]
	        node = childNodes[remove.from]
	        if (remove.key) {
	            keyMap[remove.key] = node
	        }
	        domNode.removeChild(node)
	    }
	
	    var length = childNodes.length
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j]
	        node = keyMap[insert.key]
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
	    }
	}
	
	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }
	
	    return newRoot;
	}
	
	},{"../vnode/is-widget.js":16,"../vnode/vpatch.js":19,"./apply-properties":5,"./create-element":6,"./update-widget":10}],9:[function(require,module,exports){
	var document = require("global/document")
	var isArray = require("x-is-array")
	
	var domIndex = require("./dom-index")
	var patchOp = require("./patch-op")
	module.exports = patch
	
	function patch(rootNode, patches) {
	    return patchRecursive(rootNode, patches)
	}
	
	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)
	
	    if (indices.length === 0) {
	        return rootNode
	    }
	
	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument
	
	    if (!renderOptions) {
	        renderOptions = { patch: patchRecursive }
	        if (ownerDocument !== document) {
	            renderOptions.document = ownerDocument
	        }
	    }
	
	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }
	
	    return rootNode
	}
	
	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }
	
	    var newNode
	
	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)
	
	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)
	
	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }
	
	    return rootNode
	}
	
	function patchIndices(patches) {
	    var indices = []
	
	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }
	
	    return indices
	}
	
	},{"./dom-index":7,"./patch-op":8,"global/document":2,"x-is-array":4}],10:[function(require,module,exports){
	var isWidget = require("../vnode/is-widget.js")
	
	module.exports = updateWidget
	
	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }
	
	    return false
	}
	
	},{"../vnode/is-widget.js":16}],11:[function(require,module,exports){
	var isVNode = require("./is-vnode")
	var isVText = require("./is-vtext")
	var isWidget = require("./is-widget")
	var isThunk = require("./is-thunk")
	
	module.exports = handleThunk
	
	function handleThunk(a, b) {
	    var renderedA = a
	    var renderedB = b
	
	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }
	
	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }
	
	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}
	
	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode
	
	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }
	
	    if (!(isVNode(renderedThunk) ||
	            isVText(renderedThunk) ||
	            isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }
	
	    return renderedThunk
	}
	
	},{"./is-thunk":12,"./is-vnode":14,"./is-vtext":15,"./is-widget":16}],12:[function(require,module,exports){
	module.exports = isThunk
	
	function isThunk(t) {
	    return t && t.type === "Thunk"
	}
	
	},{}],13:[function(require,module,exports){
	module.exports = isHook
	
	function isHook(hook) {
	    return hook &&
	      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
	       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
	}
	
	},{}],14:[function(require,module,exports){
	var version = require("./version")
	
	module.exports = isVirtualNode
	
	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}
	
	},{"./version":17}],15:[function(require,module,exports){
	var version = require("./version")
	
	module.exports = isVirtualText
	
	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version
	}
	
	},{"./version":17}],16:[function(require,module,exports){
	module.exports = isWidget
	
	function isWidget(w) {
	    return w && w.type === "Widget"
	}
	
	},{}],17:[function(require,module,exports){
	module.exports = "2"
	
	},{}],18:[function(require,module,exports){
	var version = require("./version")
	var isVNode = require("./is-vnode")
	var isWidget = require("./is-widget")
	var isThunk = require("./is-thunk")
	var isVHook = require("./is-vhook")
	
	module.exports = VirtualNode
	
	var noProperties = {}
	var noChildren = []
	
	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null
	
	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var hasThunks = false
	    var descendantHooks = false
	    var hooks
	
	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {}
	                }
	
	                hooks[propName] = property
	            }
	        }
	    }
	
	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode(child)) {
	            descendants += child.count || 0
	
	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }
	
	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true
	            }
	
	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }
	
	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hasThunks = hasThunks
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}
	
	VirtualNode.prototype.version = version
	VirtualNode.prototype.type = "VirtualNode"
	
	},{"./is-thunk":12,"./is-vhook":13,"./is-vnode":14,"./is-widget":16,"./version":17}],19:[function(require,module,exports){
	var version = require("./version")
	
	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8
	
	module.exports = VirtualPatch
	
	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}
	
	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"
	
	},{"./version":17}],20:[function(require,module,exports){
	var version = require("./version")
	
	module.exports = VirtualText
	
	function VirtualText(text) {
	    this.text = String(text)
	}
	
	VirtualText.prototype.version = version
	VirtualText.prototype.type = "VirtualText"
	
	},{"./version":17}],21:[function(require,module,exports){
	var isObject = require("is-object")
	var isHook = require("../vnode/is-vhook")
	
	module.exports = diffProps
	
	function diffProps(a, b) {
	    var diff
	
	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }
	
	        var aValue = a[aKey]
	        var bValue = b[aKey]
	
	        if (aValue === bValue) {
	            continue
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            } else if (isHook(bValue)) {
	                 diff = diff || {}
	                 diff[aKey] = bValue
	            } else {
	                var objectDiff = diffProps(aValue, bValue)
	                if (objectDiff) {
	                    diff = diff || {}
	                    diff[aKey] = objectDiff
	                }
	            }
	        } else {
	            diff = diff || {}
	            diff[aKey] = bValue
	        }
	    }
	
	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }
	
	    return diff
	}
	
	function getPrototype(value) {
	  if (Object.getPrototypeOf) {
	    return Object.getPrototypeOf(value)
	  } else if (value.__proto__) {
	    return value.__proto__
	  } else if (value.constructor) {
	    return value.constructor.prototype
	  }
	}
	
	},{"../vnode/is-vhook":13,"is-object":3}],22:[function(require,module,exports){
	var isArray = require("x-is-array")
	
	var VPatch = require("../vnode/vpatch")
	var isVNode = require("../vnode/is-vnode")
	var isVText = require("../vnode/is-vtext")
	var isWidget = require("../vnode/is-widget")
	var isThunk = require("../vnode/is-thunk")
	var handleThunk = require("../vnode/handle-thunk")
	
	var diffProps = require("./diff-props")
	
	module.exports = diff
	
	function diff(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}
	
	function walk(a, b, patch, index) {
	    if (a === b) {
	        return
	    }
	
	    var apply = patch[index]
	    var applyClear = false
	
	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index)
	    } else if (b == null) {
	
	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index)
	            apply = patch[index]
	        }
	
	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch(VPatch.PROPS, a, propsPatch))
	                }
	                apply = diffChildren(a, b, patch, apply, index)
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	                applyClear = true
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	            applyClear = true
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	            applyClear = true
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true
	        }
	
	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
	    }
	
	    if (apply) {
	        patch[index] = apply
	    }
	
	    if (applyClear) {
	        clearState(a, patch, index)
	    }
	}
	
	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var orderedSet = reorder(aChildren, b.children)
	    var bChildren = orderedSet.children
	
	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen
	
	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1
	
	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch(VPatch.INSERT, null, rightNode))
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }
	
	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }
	
	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(
	            VPatch.ORDER,
	            a,
	            orderedSet.moves
	        ))
	    }
	
	    return apply
	}
	
	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index)
	    destroyWidgets(vNode, patch, index)
	}
	
	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(VPatch.REMOVE, vNode, null)
	            )
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1
	
	            destroyWidgets(child, patch, index)
	
	            if (isVNode(child) && child.count) {
	                index += child.count
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}
	
	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b)
	    var thunkPatch = diff(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
	    }
	}
	
	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true
	        }
	    }
	
	    return false
	}
	
	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(
	                    VPatch.PROPS,
	                    vNode,
	                    undefinedKeys(vNode.hooks)
	                )
	            )
	        }
	
	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1
	
	                unhook(child, patch, index)
	
	                if (isVNode(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}
	
	function undefinedKeys(obj) {
	    var result = {}
	
	    for (var key in obj) {
	        result[key] = undefined
	    }
	
	    return result
	}
	
	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren)
	    var bKeys = bChildIndex.keys
	    var bFree = bChildIndex.free
	
	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }
	
	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren)
	    var aKeys = aChildIndex.keys
	    var aFree = aChildIndex.free
	
	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }
	
	    // O(MAX(N, M)) memory
	    var newChildren = []
	
	    var freeIndex = 0
	    var freeCount = bFree.length
	    var deletedItems = 0
	
	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0 ; i < aChildren.length; i++) {
	        var aItem = aChildren[i]
	        var itemIndex
	
	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key]
	                newChildren.push(bChildren[itemIndex])
	
	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++]
	                newChildren.push(bChildren[itemIndex])
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        }
	    }
	
	    var lastFreeIndex = freeIndex >= bFree.length ?
	        bChildren.length :
	        bFree[freeIndex]
	
	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j]
	
	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem)
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem)
	        }
	    }
	
	    var simulate = newChildren.slice()
	    var simulateIndex = 0
	    var removes = []
	    var inserts = []
	    var simulateItem
	
	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k]
	        simulateItem = simulate[simulateIndex]
	
	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null))
	            simulateItem = simulate[simulateIndex]
	        }
	
	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
	                        simulateItem = simulate[simulateIndex]
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({key: wantedItem.key, to: k})
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                            simulateIndex++
	                        }
	                    }
	                    else {
	                        inserts.push({key: wantedItem.key, to: k})
	                    }
	                }
	                else {
	                    inserts.push({key: wantedItem.key, to: k})
	                }
	                k++
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                removes.push(remove(simulate, simulateIndex, simulateItem.key))
	            }
	        }
	        else {
	            simulateIndex++
	            k++
	        }
	    }
	
	    // remove all the remaining nodes from simulate
	    while(simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex]
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	    }
	
	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        }
	    }
	
	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    }
	}
	
	function remove(arr, index, key) {
	    arr.splice(index, 1)
	
	    return {
	        from: index,
	        key: key
	    }
	}
	
	function keyIndex(children) {
	    var keys = {}
	    var free = []
	    var length = children.length
	
	    for (var i = 0; i < length; i++) {
	        var child = children[i]
	
	        if (child.key) {
	            keys[child.key] = i
	        } else {
	            free.push(i)
	        }
	    }
	
	    return {
	        keys: keys,     // A hash of key name to index
	        free: free,     // An array of unkeyed item indices
	    }
	}
	
	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }
	
	        return apply
	    } else {
	        return patch
	    }
	}
	
	},{"../vnode/handle-thunk":11,"../vnode/is-thunk":12,"../vnode/is-vnode":14,"../vnode/is-vtext":15,"../vnode/is-widget":16,"../vnode/vpatch":19,"./diff-props":21,"x-is-array":4}],23:[function(require,module,exports){
	var VNode = require('virtual-dom/vnode/vnode');
	var VText = require('virtual-dom/vnode/vtext');
	var diff = require('virtual-dom/vtree/diff');
	var patch = require('virtual-dom/vdom/patch');
	var createElement = require('virtual-dom/create-element');
	var isHook = require("virtual-dom/vnode/is-vhook");
	
	
	Elm.Native.VirtualDom = {};
	Elm.Native.VirtualDom.make = function(elm)
	{
		elm.Native = elm.Native || {};
		elm.Native.VirtualDom = elm.Native.VirtualDom || {};
		if (elm.Native.VirtualDom.values)
		{
			return elm.Native.VirtualDom.values;
		}
	
		var Element = Elm.Native.Graphics.Element.make(elm);
		var Json = Elm.Native.Json.make(elm);
		var List = Elm.Native.List.make(elm);
		var Signal = Elm.Native.Signal.make(elm);
		var Utils = Elm.Native.Utils.make(elm);
	
		var ATTRIBUTE_KEY = 'UniqueNameThatOthersAreVeryUnlikelyToUse';
	
		function listToProperties(list)
		{
			var object = {};
			while (list.ctor !== '[]')
			{
				var entry = list._0;
				if (entry.key === ATTRIBUTE_KEY)
				{
					object.attributes = object.attributes || {};
					object.attributes[entry.value.attrKey] = entry.value.attrValue;
				}
				else
				{
					object[entry.key] = entry.value;
				}
				list = list._1;
			}
			return object;
		}
	
		function node(name)
		{
			return F2(function(propertyList, contents) {
				return makeNode(name, propertyList, contents);
			});
		}
	
		function makeNode(name, propertyList, contents)
		{
			var props = listToProperties(propertyList);
	
			var key, namespace;
			// support keys
			if (props.key !== undefined)
			{
				key = props.key;
				props.key = undefined;
			}
	
			// support namespace
			if (props.namespace !== undefined)
			{
				namespace = props.namespace;
				props.namespace = undefined;
			}
	
			// ensure that setting text of an input does not move the cursor
			var useSoftSet =
				name === 'input'
				&& props.value !== undefined
				&& !isHook(props.value);
	
			if (useSoftSet)
			{
				props.value = SoftSetHook(props.value);
			}
	
			return new VNode(name, props, List.toArray(contents), key, namespace);
		}
	
		function property(key, value)
		{
			return {
				key: key,
				value: value
			};
		}
	
		function attribute(key, value)
		{
			return {
				key: ATTRIBUTE_KEY,
				value: {
					attrKey: key,
					attrValue: value
				}
			};
		}
	
		function on(name, options, decoder, createMessage)
		{
			function eventHandler(event)
			{
				var value = A2(Json.runDecoderValue, decoder, event);
				if (value.ctor === 'Ok')
				{
					if (options.stopPropagation)
					{
						event.stopPropagation();
					}
					if (options.preventDefault)
					{
						event.preventDefault();
					}
					Signal.sendMessage(createMessage(value._0));
				}
			}
			return property('on' + name, eventHandler);
		}
	
		function SoftSetHook(value)
		{
			if (!(this instanceof SoftSetHook))
			{
				return new SoftSetHook(value);
			}
	
			this.value = value;
		}
	
		SoftSetHook.prototype.hook = function (node, propertyName)
		{
			if (node[propertyName] !== this.value)
			{
				node[propertyName] = this.value;
			}
		};
	
		function text(string)
		{
			return new VText(string);
		}
	
		function ElementWidget(element)
		{
			this.element = element;
		}
	
		ElementWidget.prototype.type = "Widget";
	
		ElementWidget.prototype.init = function init()
		{
			return Element.render(this.element);
		};
	
		ElementWidget.prototype.update = function update(previous, node)
		{
			return Element.update(node, previous.element, this.element);
		};
	
		function fromElement(element)
		{
			return new ElementWidget(element);
		}
	
		function toElement(width, height, html)
		{
			return A3(Element.newElement, width, height, {
				ctor: 'Custom',
				type: 'evancz/elm-html',
				render: render,
				update: update,
				model: html
			});
		}
	
		function render(model)
		{
			var element = Element.createNode('div');
			element.appendChild(createElement(model));
			return element;
		}
	
		function update(node, oldModel, newModel)
		{
			updateAndReplace(node.firstChild, oldModel, newModel);
			return node;
		}
	
		function updateAndReplace(node, oldModel, newModel)
		{
			var patches = diff(oldModel, newModel);
			var newNode = patch(node, patches);
			return newNode;
		}
	
		function lazyRef(fn, a)
		{
			function thunk()
			{
				return fn(a);
			}
			return new Thunk(fn, [a], thunk);
		}
	
		function lazyRef2(fn, a, b)
		{
			function thunk()
			{
				return A2(fn, a, b);
			}
			return new Thunk(fn, [a,b], thunk);
		}
	
		function lazyRef3(fn, a, b, c)
		{
			function thunk()
			{
				return A3(fn, a, b, c);
			}
			return new Thunk(fn, [a,b,c], thunk);
		}
	
		function Thunk(fn, args, thunk)
		{
			this.fn = fn;
			this.args = args;
			this.vnode = null;
			this.key = undefined;
			this.thunk = thunk;
		}
	
		Thunk.prototype.type = "Thunk";
		Thunk.prototype.update = updateThunk;
		Thunk.prototype.render = renderThunk;
	
		function shouldUpdate(current, previous)
		{
			if (current.fn !== previous.fn)
			{
				return true;
			}
	
			// if it's the same function, we know the number of args must match
			var cargs = current.args;
			var pargs = previous.args;
	
			for (var i = cargs.length; i--; )
			{
				if (cargs[i] !== pargs[i])
				{
					return true;
				}
			}
	
			return false;
		}
	
		function updateThunk(previous, domNode)
		{
			if (!shouldUpdate(this, previous))
			{
				this.vnode = previous.vnode;
				return;
			}
	
			if (!this.vnode)
			{
				this.vnode = this.thunk();
			}
	
			var patches = diff(previous.vnode, this.vnode);
			patch(domNode, patches);
		}
	
		function renderThunk()
		{
			return this.thunk();
		}
	
		return Elm.Native.VirtualDom.values = {
			node: node,
			text: text,
			on: F4(on),
	
			property: F2(property),
			attribute: F2(attribute),
	
			lazy: F2(lazyRef),
			lazy2: F3(lazyRef2),
			lazy3: F4(lazyRef3),
	
			toElement: F3(toElement),
			fromElement: fromElement,
	
			render: createElement,
			updateAndReplace: updateAndReplace
		};
	};
	
	},{"virtual-dom/create-element":1,"virtual-dom/vdom/patch":9,"virtual-dom/vnode/is-vhook":13,"virtual-dom/vnode/vnode":18,"virtual-dom/vnode/vtext":20,"virtual-dom/vtree/diff":22}],24:[function(require,module,exports){
	
	},{}]},{},[23]);
	
	Elm.Result = Elm.Result || {};
	Elm.Result.make = function (_elm) {
	   "use strict";
	   _elm.Result = _elm.Result || {};
	   if (_elm.Result.values)
	   return _elm.Result.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Result",
	   $Maybe = Elm.Maybe.make(_elm);
	   var toMaybe = function (result) {
	      return function () {
	         switch (result.ctor)
	         {case "Err":
	            return $Maybe.Nothing;
	            case "Ok":
	            return $Maybe.Just(result._0);}
	         _U.badCase($moduleName,
	         "between lines 164 and 166");
	      }();
	   };
	   var Err = function (a) {
	      return {ctor: "Err",_0: a};
	   };
	   var andThen = F2(function (result,
	   callback) {
	      return function () {
	         switch (result.ctor)
	         {case "Err":
	            return Err(result._0);
	            case "Ok":
	            return callback(result._0);}
	         _U.badCase($moduleName,
	         "between lines 126 and 128");
	      }();
	   });
	   var Ok = function (a) {
	      return {ctor: "Ok",_0: a};
	   };
	   var map = F2(function (func,
	   ra) {
	      return function () {
	         switch (ra.ctor)
	         {case "Err": return Err(ra._0);
	            case "Ok":
	            return Ok(func(ra._0));}
	         _U.badCase($moduleName,
	         "between lines 41 and 43");
	      }();
	   });
	   var map2 = F3(function (func,
	   ra,
	   rb) {
	      return function () {
	         var _v9 = {ctor: "_Tuple2"
	                   ,_0: ra
	                   ,_1: rb};
	         switch (_v9.ctor)
	         {case "_Tuple2":
	            switch (_v9._0.ctor)
	              {case "Err":
	                 return Err(_v9._0._0);
	                 case "Ok": switch (_v9._1.ctor)
	                   {case "Ok": return Ok(A2(func,
	                        _v9._0._0,
	                        _v9._1._0));}
	                   break;}
	              switch (_v9._1.ctor)
	              {case "Err":
	                 return Err(_v9._1._0);}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 55 and 58");
	      }();
	   });
	   var map3 = F4(function (func,
	   ra,
	   rb,
	   rc) {
	      return function () {
	         var _v16 = {ctor: "_Tuple3"
	                    ,_0: ra
	                    ,_1: rb
	                    ,_2: rc};
	         switch (_v16.ctor)
	         {case "_Tuple3":
	            switch (_v16._0.ctor)
	              {case "Err":
	                 return Err(_v16._0._0);
	                 case "Ok": switch (_v16._1.ctor)
	                   {case "Ok":
	                      switch (_v16._2.ctor)
	                        {case "Ok": return Ok(A3(func,
	                             _v16._0._0,
	                             _v16._1._0,
	                             _v16._2._0));}
	                        break;}
	                   break;}
	              switch (_v16._1.ctor)
	              {case "Err":
	                 return Err(_v16._1._0);}
	              switch (_v16._2.ctor)
	              {case "Err":
	                 return Err(_v16._2._0);}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 63 and 67");
	      }();
	   });
	   var map4 = F5(function (func,
	   ra,
	   rb,
	   rc,
	   rd) {
	      return function () {
	         var _v26 = {ctor: "_Tuple4"
	                    ,_0: ra
	                    ,_1: rb
	                    ,_2: rc
	                    ,_3: rd};
	         switch (_v26.ctor)
	         {case "_Tuple4":
	            switch (_v26._0.ctor)
	              {case "Err":
	                 return Err(_v26._0._0);
	                 case "Ok": switch (_v26._1.ctor)
	                   {case "Ok":
	                      switch (_v26._2.ctor)
	                        {case "Ok":
	                           switch (_v26._3.ctor)
	                             {case "Ok": return Ok(A4(func,
	                                  _v26._0._0,
	                                  _v26._1._0,
	                                  _v26._2._0,
	                                  _v26._3._0));}
	                             break;}
	                        break;}
	                   break;}
	              switch (_v26._1.ctor)
	              {case "Err":
	                 return Err(_v26._1._0);}
	              switch (_v26._2.ctor)
	              {case "Err":
	                 return Err(_v26._2._0);}
	              switch (_v26._3.ctor)
	              {case "Err":
	                 return Err(_v26._3._0);}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 72 and 77");
	      }();
	   });
	   var map5 = F6(function (func,
	   ra,
	   rb,
	   rc,
	   rd,
	   re) {
	      return function () {
	         var _v39 = {ctor: "_Tuple5"
	                    ,_0: ra
	                    ,_1: rb
	                    ,_2: rc
	                    ,_3: rd
	                    ,_4: re};
	         switch (_v39.ctor)
	         {case "_Tuple5":
	            switch (_v39._0.ctor)
	              {case "Err":
	                 return Err(_v39._0._0);
	                 case "Ok": switch (_v39._1.ctor)
	                   {case "Ok":
	                      switch (_v39._2.ctor)
	                        {case "Ok":
	                           switch (_v39._3.ctor)
	                             {case "Ok":
	                                switch (_v39._4.ctor)
	                                  {case "Ok": return Ok(A5(func,
	                                       _v39._0._0,
	                                       _v39._1._0,
	                                       _v39._2._0,
	                                       _v39._3._0,
	                                       _v39._4._0));}
	                                  break;}
	                             break;}
	                        break;}
	                   break;}
	              switch (_v39._1.ctor)
	              {case "Err":
	                 return Err(_v39._1._0);}
	              switch (_v39._2.ctor)
	              {case "Err":
	                 return Err(_v39._2._0);}
	              switch (_v39._3.ctor)
	              {case "Err":
	                 return Err(_v39._3._0);}
	              switch (_v39._4.ctor)
	              {case "Err":
	                 return Err(_v39._4._0);}
	              break;}
	         _U.badCase($moduleName,
	         "between lines 82 and 88");
	      }();
	   });
	   var formatError = F2(function (f,
	   result) {
	      return function () {
	         switch (result.ctor)
	         {case "Err":
	            return Err(f(result._0));
	            case "Ok":
	            return Ok(result._0);}
	         _U.badCase($moduleName,
	         "between lines 148 and 150");
	      }();
	   });
	   var fromMaybe = F2(function (err,
	   maybe) {
	      return function () {
	         switch (maybe.ctor)
	         {case "Just":
	            return Ok(maybe._0);
	            case "Nothing":
	            return Err(err);}
	         _U.badCase($moduleName,
	         "between lines 180 and 182");
	      }();
	   });
	   _elm.Result.values = {_op: _op
	                        ,map: map
	                        ,map2: map2
	                        ,map3: map3
	                        ,map4: map4
	                        ,map5: map5
	                        ,andThen: andThen
	                        ,toMaybe: toMaybe
	                        ,fromMaybe: fromMaybe
	                        ,formatError: formatError
	                        ,Ok: Ok
	                        ,Err: Err};
	   return _elm.Result.values;
	};
	Elm.Signal = Elm.Signal || {};
	Elm.Signal.make = function (_elm) {
	   "use strict";
	   _elm.Signal = _elm.Signal || {};
	   if (_elm.Signal.values)
	   return _elm.Signal.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Signal",
	   $Basics = Elm.Basics.make(_elm),
	   $Debug = Elm.Debug.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Signal = Elm.Native.Signal.make(_elm),
	   $Task = Elm.Task.make(_elm);
	   var send = F2(function (_v0,
	   value) {
	      return function () {
	         switch (_v0.ctor)
	         {case "Address":
	            return A2($Task.onError,
	              _v0._0(value),
	              function (_v3) {
	                 return function () {
	                    return $Task.succeed({ctor: "_Tuple0"});
	                 }();
	              });}
	         _U.badCase($moduleName,
	         "between lines 370 and 371");
	      }();
	   });
	   var Message = function (a) {
	      return {ctor: "Message"
	             ,_0: a};
	   };
	   var message = F2(function (_v5,
	   value) {
	      return function () {
	         switch (_v5.ctor)
	         {case "Address":
	            return Message(_v5._0(value));}
	         _U.badCase($moduleName,
	         "on line 352, column 5 to 24");
	      }();
	   });
	   var mailbox = $Native$Signal.mailbox;
	   var Address = function (a) {
	      return {ctor: "Address"
	             ,_0: a};
	   };
	   var forwardTo = F2(function (_v8,
	   f) {
	      return function () {
	         switch (_v8.ctor)
	         {case "Address":
	            return Address(function (x) {
	                 return _v8._0(f(x));
	              });}
	         _U.badCase($moduleName,
	         "on line 339, column 5 to 29");
	      }();
	   });
	   var Mailbox = F2(function (a,
	   b) {
	      return {_: {}
	             ,address: a
	             ,signal: b};
	   });
	   var sampleOn = $Native$Signal.sampleOn;
	   var dropRepeats = $Native$Signal.dropRepeats;
	   var filterMap = $Native$Signal.filterMap;
	   var filter = F3(function (isOk,
	   base,
	   signal) {
	      return A3(filterMap,
	      function (value) {
	         return isOk(value) ? $Maybe.Just(value) : $Maybe.Nothing;
	      },
	      base,
	      signal);
	   });
	   var merge = F2(function (left,
	   right) {
	      return A3($Native$Signal.genericMerge,
	      $Basics.always,
	      left,
	      right);
	   });
	   var mergeMany = function (signalList) {
	      return function () {
	         var _v11 = $List.reverse(signalList);
	         switch (_v11.ctor)
	         {case "::":
	            return A3($List.foldl,
	              merge,
	              _v11._0,
	              _v11._1);
	            case "[]":
	            return $Debug.crash("mergeMany was given an empty list!");}
	         _U.badCase($moduleName,
	         "between lines 177 and 182");
	      }();
	   };
	   var foldp = $Native$Signal.foldp;
	   var map5 = $Native$Signal.map5;
	   var map4 = $Native$Signal.map4;
	   var map3 = $Native$Signal.map3;
	   var map2 = $Native$Signal.map2;
	   _op["~"] = F2(function (funcs,
	   args) {
	      return A3(map2,
	      F2(function (f,v) {
	         return f(v);
	      }),
	      funcs,
	      args);
	   });
	   var map = $Native$Signal.map;
	   _op["<~"] = map;
	   var constant = $Native$Signal.constant;
	   var Signal = {ctor: "Signal"};
	   _elm.Signal.values = {_op: _op
	                        ,merge: merge
	                        ,mergeMany: mergeMany
	                        ,map: map
	                        ,map2: map2
	                        ,map3: map3
	                        ,map4: map4
	                        ,map5: map5
	                        ,constant: constant
	                        ,dropRepeats: dropRepeats
	                        ,filter: filter
	                        ,filterMap: filterMap
	                        ,sampleOn: sampleOn
	                        ,foldp: foldp
	                        ,mailbox: mailbox
	                        ,send: send
	                        ,message: message
	                        ,forwardTo: forwardTo
	                        ,Mailbox: Mailbox};
	   return _elm.Signal.values;
	};
	Elm.String = Elm.String || {};
	Elm.String.make = function (_elm) {
	   "use strict";
	   _elm.String = _elm.String || {};
	   if (_elm.String.values)
	   return _elm.String.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "String",
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$String = Elm.Native.String.make(_elm),
	   $Result = Elm.Result.make(_elm);
	   var fromList = $Native$String.fromList;
	   var toList = $Native$String.toList;
	   var toFloat = $Native$String.toFloat;
	   var toInt = $Native$String.toInt;
	   var indices = $Native$String.indexes;
	   var indexes = $Native$String.indexes;
	   var endsWith = $Native$String.endsWith;
	   var startsWith = $Native$String.startsWith;
	   var contains = $Native$String.contains;
	   var all = $Native$String.all;
	   var any = $Native$String.any;
	   var toLower = $Native$String.toLower;
	   var toUpper = $Native$String.toUpper;
	   var lines = $Native$String.lines;
	   var words = $Native$String.words;
	   var trimRight = $Native$String.trimRight;
	   var trimLeft = $Native$String.trimLeft;
	   var trim = $Native$String.trim;
	   var padRight = $Native$String.padRight;
	   var padLeft = $Native$String.padLeft;
	   var pad = $Native$String.pad;
	   var dropRight = $Native$String.dropRight;
	   var dropLeft = $Native$String.dropLeft;
	   var right = $Native$String.right;
	   var left = $Native$String.left;
	   var slice = $Native$String.slice;
	   var repeat = $Native$String.repeat;
	   var join = $Native$String.join;
	   var split = $Native$String.split;
	   var foldr = $Native$String.foldr;
	   var foldl = $Native$String.foldl;
	   var reverse = $Native$String.reverse;
	   var filter = $Native$String.filter;
	   var map = $Native$String.map;
	   var length = $Native$String.length;
	   var concat = $Native$String.concat;
	   var append = $Native$String.append;
	   var uncons = $Native$String.uncons;
	   var cons = $Native$String.cons;
	   var fromChar = function ($char) {
	      return A2(cons,$char,"");
	   };
	   var isEmpty = $Native$String.isEmpty;
	   _elm.String.values = {_op: _op
	                        ,isEmpty: isEmpty
	                        ,length: length
	                        ,reverse: reverse
	                        ,repeat: repeat
	                        ,cons: cons
	                        ,uncons: uncons
	                        ,fromChar: fromChar
	                        ,append: append
	                        ,concat: concat
	                        ,split: split
	                        ,join: join
	                        ,words: words
	                        ,lines: lines
	                        ,slice: slice
	                        ,left: left
	                        ,right: right
	                        ,dropLeft: dropLeft
	                        ,dropRight: dropRight
	                        ,contains: contains
	                        ,startsWith: startsWith
	                        ,endsWith: endsWith
	                        ,indexes: indexes
	                        ,indices: indices
	                        ,toInt: toInt
	                        ,toFloat: toFloat
	                        ,toList: toList
	                        ,fromList: fromList
	                        ,toUpper: toUpper
	                        ,toLower: toLower
	                        ,pad: pad
	                        ,padLeft: padLeft
	                        ,padRight: padRight
	                        ,trim: trim
	                        ,trimLeft: trimLeft
	                        ,trimRight: trimRight
	                        ,map: map
	                        ,filter: filter
	                        ,foldl: foldl
	                        ,foldr: foldr
	                        ,any: any
	                        ,all: all};
	   return _elm.String.values;
	};
	Elm.Task = Elm.Task || {};
	Elm.Task.make = function (_elm) {
	   "use strict";
	   _elm.Task = _elm.Task || {};
	   if (_elm.Task.values)
	   return _elm.Task.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Task",
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Task = Elm.Native.Task.make(_elm),
	   $Result = Elm.Result.make(_elm);
	   var sleep = $Native$Task.sleep;
	   var spawn = $Native$Task.spawn;
	   var ThreadID = function (a) {
	      return {ctor: "ThreadID"
	             ,_0: a};
	   };
	   var onError = $Native$Task.catch_;
	   var andThen = $Native$Task.andThen;
	   var fail = $Native$Task.fail;
	   var mapError = F2(function (f,
	   promise) {
	      return A2(onError,
	      promise,
	      function (err) {
	         return fail(f(err));
	      });
	   });
	   var succeed = $Native$Task.succeed;
	   var map = F2(function (func,
	   promiseA) {
	      return A2(andThen,
	      promiseA,
	      function (a) {
	         return succeed(func(a));
	      });
	   });
	   var map2 = F3(function (func,
	   promiseA,
	   promiseB) {
	      return A2(andThen,
	      promiseA,
	      function (a) {
	         return A2(andThen,
	         promiseB,
	         function (b) {
	            return succeed(A2(func,a,b));
	         });
	      });
	   });
	   var map3 = F4(function (func,
	   promiseA,
	   promiseB,
	   promiseC) {
	      return A2(andThen,
	      promiseA,
	      function (a) {
	         return A2(andThen,
	         promiseB,
	         function (b) {
	            return A2(andThen,
	            promiseC,
	            function (c) {
	               return succeed(A3(func,
	               a,
	               b,
	               c));
	            });
	         });
	      });
	   });
	   var map4 = F5(function (func,
	   promiseA,
	   promiseB,
	   promiseC,
	   promiseD) {
	      return A2(andThen,
	      promiseA,
	      function (a) {
	         return A2(andThen,
	         promiseB,
	         function (b) {
	            return A2(andThen,
	            promiseC,
	            function (c) {
	               return A2(andThen,
	               promiseD,
	               function (d) {
	                  return succeed(A4(func,
	                  a,
	                  b,
	                  c,
	                  d));
	               });
	            });
	         });
	      });
	   });
	   var map5 = F6(function (func,
	   promiseA,
	   promiseB,
	   promiseC,
	   promiseD,
	   promiseE) {
	      return A2(andThen,
	      promiseA,
	      function (a) {
	         return A2(andThen,
	         promiseB,
	         function (b) {
	            return A2(andThen,
	            promiseC,
	            function (c) {
	               return A2(andThen,
	               promiseD,
	               function (d) {
	                  return A2(andThen,
	                  promiseE,
	                  function (e) {
	                     return succeed(A5(func,
	                     a,
	                     b,
	                     c,
	                     d,
	                     e));
	                  });
	               });
	            });
	         });
	      });
	   });
	   var andMap = F2(function (promiseFunc,
	   promiseValue) {
	      return A2(andThen,
	      promiseFunc,
	      function (func) {
	         return A2(andThen,
	         promiseValue,
	         function (value) {
	            return succeed(func(value));
	         });
	      });
	   });
	   var sequence = function (promises) {
	      return function () {
	         switch (promises.ctor)
	         {case "::": return A3(map2,
	              F2(function (x,y) {
	                 return A2($List._op["::"],
	                 x,
	                 y);
	              }),
	              promises._0,
	              sequence(promises._1));
	            case "[]":
	            return succeed(_L.fromArray([]));}
	         _U.badCase($moduleName,
	         "between lines 101 and 106");
	      }();
	   };
	   var toMaybe = function (task) {
	      return A2(onError,
	      A2(map,$Maybe.Just,task),
	      function (_v3) {
	         return function () {
	            return succeed($Maybe.Nothing);
	         }();
	      });
	   };
	   var fromMaybe = F2(function ($default,
	   maybe) {
	      return function () {
	         switch (maybe.ctor)
	         {case "Just":
	            return succeed(maybe._0);
	            case "Nothing":
	            return fail($default);}
	         _U.badCase($moduleName,
	         "between lines 139 and 141");
	      }();
	   });
	   var toResult = function (task) {
	      return A2(onError,
	      A2(map,$Result.Ok,task),
	      function (msg) {
	         return succeed($Result.Err(msg));
	      });
	   };
	   var fromResult = function (result) {
	      return function () {
	         switch (result.ctor)
	         {case "Err":
	            return fail(result._0);
	            case "Ok":
	            return succeed(result._0);}
	         _U.badCase($moduleName,
	         "between lines 151 and 153");
	      }();
	   };
	   var Task = {ctor: "Task"};
	   _elm.Task.values = {_op: _op
	                      ,succeed: succeed
	                      ,fail: fail
	                      ,map: map
	                      ,map2: map2
	                      ,map3: map3
	                      ,map4: map4
	                      ,map5: map5
	                      ,andMap: andMap
	                      ,sequence: sequence
	                      ,andThen: andThen
	                      ,onError: onError
	                      ,mapError: mapError
	                      ,toMaybe: toMaybe
	                      ,fromMaybe: fromMaybe
	                      ,toResult: toResult
	                      ,fromResult: fromResult
	                      ,spawn: spawn
	                      ,sleep: sleep};
	   return _elm.Task.values;
	};
	Elm.Text = Elm.Text || {};
	Elm.Text.make = function (_elm) {
	   "use strict";
	   _elm.Text = _elm.Text || {};
	   if (_elm.Text.values)
	   return _elm.Text.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Text",
	   $Color = Elm.Color.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$Text = Elm.Native.Text.make(_elm);
	   var line = $Native$Text.line;
	   var italic = $Native$Text.italic;
	   var bold = $Native$Text.bold;
	   var color = $Native$Text.color;
	   var height = $Native$Text.height;
	   var link = $Native$Text.link;
	   var monospace = $Native$Text.monospace;
	   var typeface = $Native$Text.typeface;
	   var style = $Native$Text.style;
	   var append = $Native$Text.append;
	   var fromString = $Native$Text.fromString;
	   var empty = fromString("");
	   var concat = function (texts) {
	      return A3($List.foldr,
	      append,
	      empty,
	      texts);
	   };
	   var join = F2(function (seperator,
	   texts) {
	      return concat(A2($List.intersperse,
	      seperator,
	      texts));
	   });
	   var defaultStyle = {_: {}
	                      ,bold: false
	                      ,color: $Color.black
	                      ,height: $Maybe.Nothing
	                      ,italic: false
	                      ,line: $Maybe.Nothing
	                      ,typeface: _L.fromArray([])};
	   var Style = F6(function (a,
	   b,
	   c,
	   d,
	   e,
	   f) {
	      return {_: {}
	             ,bold: d
	             ,color: c
	             ,height: b
	             ,italic: e
	             ,line: f
	             ,typeface: a};
	   });
	   var Through = {ctor: "Through"};
	   var Over = {ctor: "Over"};
	   var Under = {ctor: "Under"};
	   var Text = {ctor: "Text"};
	   _elm.Text.values = {_op: _op
	                      ,fromString: fromString
	                      ,empty: empty
	                      ,append: append
	                      ,concat: concat
	                      ,join: join
	                      ,link: link
	                      ,style: style
	                      ,defaultStyle: defaultStyle
	                      ,typeface: typeface
	                      ,monospace: monospace
	                      ,height: height
	                      ,color: color
	                      ,bold: bold
	                      ,italic: italic
	                      ,line: line
	                      ,Style: Style
	                      ,Under: Under
	                      ,Over: Over
	                      ,Through: Through};
	   return _elm.Text.values;
	};
	Elm.Transform2D = Elm.Transform2D || {};
	Elm.Transform2D.make = function (_elm) {
	   "use strict";
	   _elm.Transform2D = _elm.Transform2D || {};
	   if (_elm.Transform2D.values)
	   return _elm.Transform2D.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "Transform2D",
	   $Native$Transform2D = Elm.Native.Transform2D.make(_elm);
	   var multiply = $Native$Transform2D.multiply;
	   var rotation = $Native$Transform2D.rotation;
	   var matrix = $Native$Transform2D.matrix;
	   var translation = F2(function (x,
	   y) {
	      return A6(matrix,
	      1,
	      0,
	      0,
	      1,
	      x,
	      y);
	   });
	   var scale = function (s) {
	      return A6(matrix,
	      s,
	      0,
	      0,
	      s,
	      0,
	      0);
	   };
	   var scaleX = function (x) {
	      return A6(matrix,
	      x,
	      0,
	      0,
	      1,
	      0,
	      0);
	   };
	   var scaleY = function (y) {
	      return A6(matrix,
	      1,
	      0,
	      0,
	      y,
	      0,
	      0);
	   };
	   var identity = $Native$Transform2D.identity;
	   var Transform2D = {ctor: "Transform2D"};
	   _elm.Transform2D.values = {_op: _op
	                             ,identity: identity
	                             ,matrix: matrix
	                             ,multiply: multiply
	                             ,rotation: rotation
	                             ,translation: translation
	                             ,scale: scale
	                             ,scaleX: scaleX
	                             ,scaleY: scaleY};
	   return _elm.Transform2D.values;
	};
	Elm.VirtualDom = Elm.VirtualDom || {};
	Elm.VirtualDom.make = function (_elm) {
	   "use strict";
	   _elm.VirtualDom = _elm.VirtualDom || {};
	   if (_elm.VirtualDom.values)
	   return _elm.VirtualDom.values;
	   var _op = {},
	   _N = Elm.Native,
	   _U = _N.Utils.make(_elm),
	   _L = _N.List.make(_elm),
	   $moduleName = "VirtualDom",
	   $Basics = Elm.Basics.make(_elm),
	   $Graphics$Element = Elm.Graphics.Element.make(_elm),
	   $Json$Decode = Elm.Json.Decode.make(_elm),
	   $List = Elm.List.make(_elm),
	   $Maybe = Elm.Maybe.make(_elm),
	   $Native$VirtualDom = Elm.Native.VirtualDom.make(_elm),
	   $Result = Elm.Result.make(_elm),
	   $Signal = Elm.Signal.make(_elm);
	   var lazy3 = $Native$VirtualDom.lazy3;
	   var lazy2 = $Native$VirtualDom.lazy2;
	   var lazy = $Native$VirtualDom.lazy;
	   var defaultOptions = {_: {}
	                        ,preventDefault: false
	                        ,stopPropagation: false};
	   var Options = F2(function (a,
	   b) {
	      return {_: {}
	             ,preventDefault: b
	             ,stopPropagation: a};
	   });
	   var onWithOptions = $Native$VirtualDom.on;
	   var on = F3(function (eventName,
	   decoder,
	   toMessage) {
	      return A4($Native$VirtualDom.on,
	      eventName,
	      defaultOptions,
	      decoder,
	      toMessage);
	   });
	   var attribute = $Native$VirtualDom.attribute;
	   var property = $Native$VirtualDom.property;
	   var Property = {ctor: "Property"};
	   var fromElement = $Native$VirtualDom.fromElement;
	   var toElement = $Native$VirtualDom.toElement;
	   var text = $Native$VirtualDom.text;
	   var node = $Native$VirtualDom.node;
	   var Node = {ctor: "Node"};
	   _elm.VirtualDom.values = {_op: _op
	                            ,text: text
	                            ,node: node
	                            ,toElement: toElement
	                            ,fromElement: fromElement
	                            ,property: property
	                            ,attribute: attribute
	                            ,on: on
	                            ,onWithOptions: onWithOptions
	                            ,defaultOptions: defaultOptions
	                            ,lazy: lazy
	                            ,lazy2: lazy2
	                            ,lazy3: lazy3
	                            ,Options: Options};
	   return _elm.VirtualDom.values;
	};
	
	module.exports = Elm;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map