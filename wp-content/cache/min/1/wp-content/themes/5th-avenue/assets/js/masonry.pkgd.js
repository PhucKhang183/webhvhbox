/*!
 * Masonry PACKAGED v4.2.1
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("jquery-bridget/jquery-bridget", ["jquery"], function (jQuery) {
      return factory(window, jQuery);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(window, require("jquery"));
  } else {
    window.jQueryBridget = factory(window, window.jQuery);
  }
})(window, function factory(window, jQuery) {
  "use strict";
  var arraySlice = Array.prototype.slice;
  var console = window.console;
  var logError =
    typeof console == "undefined"
      ? function () {}
      : function (message) {
          console.error(message);
        };
  function jQueryBridget(namespace, PluginClass, $) {
    $ = $ || jQuery || window.jQuery;
    if (!$) {
      return;
    }
    if (!PluginClass.prototype.option) {
      PluginClass.prototype.option = function (opts) {
        if (!$.isPlainObject(opts)) {
          return;
        }
        this.options = $.extend(!0, this.options, opts);
      };
    }
    $.fn[namespace] = function (arg0) {
      if (typeof arg0 == "string") {
        var args = arraySlice.call(arguments, 1);
        return methodCall(this, arg0, args);
      }
      plainCall(this, arg0);
      return this;
    };
    function methodCall($elems, methodName, args) {
      var returnValue;
      var pluginMethodStr = "$()." + namespace + '("' + methodName + '")';
      $elems.each(function (i, elem) {
        var instance = $.data(elem, namespace);
        if (!instance) {
          logError(
            namespace +
              " not initialized. Cannot call methods, i.e. " +
              pluginMethodStr
          );
          return;
        }
        var method = instance[methodName];
        if (!method || methodName.charAt(0) == "_") {
          logError(pluginMethodStr + " is not a valid method");
          return;
        }
        var value = method.apply(instance, args);
        returnValue = returnValue === undefined ? value : returnValue;
      });
      return returnValue !== undefined ? returnValue : $elems;
    }
    function plainCall($elems, options) {
      $elems.each(function (i, elem) {
        var instance = $.data(elem, namespace);
        if (instance) {
          instance.option(options);
          instance._init();
        } else {
          instance = new PluginClass(elem, options);
          $.data(elem, namespace, instance);
        }
      });
    }
    updateJQuery($);
  }
  function updateJQuery($) {
    if (!$ || ($ && $.bridget)) {
      return;
    }
    $.bridget = jQueryBridget;
  }
  updateJQuery(jQuery || window.jQuery);
  return jQueryBridget;
});
(function (global, factory) {
  if (typeof define == "function" && define.amd) {
    define("ev-emitter/ev-emitter", factory);
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory();
  } else {
    global.EvEmitter = factory();
  }
})(typeof window != "undefined" ? window : this, function () {
  function EvEmitter() {}
  var proto = EvEmitter.prototype;
  proto.on = function (eventName, listener) {
    if (!eventName || !listener) {
      return;
    }
    var events = (this._events = this._events || {});
    var listeners = (events[eventName] = events[eventName] || []);
    if (listeners.indexOf(listener) == -1) {
      listeners.push(listener);
    }
    return this;
  };
  proto.once = function (eventName, listener) {
    if (!eventName || !listener) {
      return;
    }
    this.on(eventName, listener);
    var onceEvents = (this._onceEvents = this._onceEvents || {});
    var onceListeners = (onceEvents[eventName] = onceEvents[eventName] || {});
    onceListeners[listener] = !0;
    return this;
  };
  proto.off = function (eventName, listener) {
    var listeners = this._events && this._events[eventName];
    if (!listeners || !listeners.length) {
      return;
    }
    var index = listeners.indexOf(listener);
    if (index != -1) {
      listeners.splice(index, 1);
    }
    return this;
  };
  proto.emitEvent = function (eventName, args) {
    var listeners = this._events && this._events[eventName];
    if (!listeners || !listeners.length) {
      return;
    }
    listeners = listeners.slice(0);
    args = args || [];
    var onceListeners = this._onceEvents && this._onceEvents[eventName];
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      var isOnce = onceListeners && onceListeners[listener];
      if (isOnce) {
        this.off(eventName, listener);
        delete onceListeners[listener];
      }
      listener.apply(this, args);
    }
    return this;
  };
  proto.allOff = function () {
    delete this._events;
    delete this._onceEvents;
  };
  return EvEmitter;
});
/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */
(function (window, factory) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("get-size/get-size", [], function () {
      return factory();
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory();
  } else {
    window.getSize = factory();
  }
})(window, function factory() {
  "use strict";
  function getStyleSize(value) {
    var num = parseFloat(value);
    var isValid = value.indexOf("%") == -1 && !isNaN(num);
    return isValid && num;
  }
  function noop() {}
  var logError =
    typeof console == "undefined"
      ? noop
      : function (message) {
          console.error(message);
        };
  var measurements = [
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginBottom",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    "borderBottomWidth",
  ];
  var measurementsLength = measurements.length;
  function getZeroSize() {
    var size = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0,
    };
    for (var i = 0; i < measurementsLength; i++) {
      var measurement = measurements[i];
      size[measurement] = 0;
    }
    return size;
  }
  function getStyle(elem) {
    var style = getComputedStyle(elem);
    if (!style) {
      logError(
        "Style returned " +
          style +
          ". Are you running this code in a hidden iframe on Firefox? " +
          "See http://bit.ly/getsizebug1"
      );
    }
    return style;
  }
  var isSetup = !1;
  var isBoxSizeOuter;
  function setup() {
    if (isSetup) {
      return;
    }
    isSetup = !0;
    var div = document.createElement("div");
    div.style.width = "200px";
    div.style.padding = "1px 2px 3px 4px";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1px 2px 3px 4px";
    div.style.boxSizing = "border-box";
    var body = document.body || document.documentElement;
    body.appendChild(div);
    var style = getStyle(div);
    getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200;
    body.removeChild(div);
  }
  function getSize(elem) {
    setup();
    if (typeof elem == "string") {
      elem = document.querySelector(elem);
    }
    if (!elem || typeof elem != "object" || !elem.nodeType) {
      return;
    }
    var style = getStyle(elem);
    if (style.display == "none") {
      return getZeroSize();
    }
    var size = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;
    var isBorderBox = (size.isBorderBox = style.boxSizing == "border-box");
    for (var i = 0; i < measurementsLength; i++) {
      var measurement = measurements[i];
      var value = style[measurement];
      var num = parseFloat(value);
      size[measurement] = !isNaN(num) ? num : 0;
    }
    var paddingWidth = size.paddingLeft + size.paddingRight;
    var paddingHeight = size.paddingTop + size.paddingBottom;
    var marginWidth = size.marginLeft + size.marginRight;
    var marginHeight = size.marginTop + size.marginBottom;
    var borderWidth = size.borderLeftWidth + size.borderRightWidth;
    var borderHeight = size.borderTopWidth + size.borderBottomWidth;
    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
    var styleWidth = getStyleSize(style.width);
    if (styleWidth !== !1) {
      size.width =
        styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
    }
    var styleHeight = getStyleSize(style.height);
    if (styleHeight !== !1) {
      size.height =
        styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
    }
    size.innerWidth = size.width - (paddingWidth + borderWidth);
    size.innerHeight = size.height - (paddingHeight + borderHeight);
    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;
    return size;
  }
  return getSize;
});
(function (window, factory) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("desandro-matches-selector/matches-selector", factory);
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory();
  } else {
    window.matchesSelector = factory();
  }
})(window, function factory() {
  "use strict";
  var matchesMethod = (function () {
    var ElemProto = window.Element.prototype;
    if (ElemProto.matches) {
      return "matches";
    }
    if (ElemProto.matchesSelector) {
      return "matchesSelector";
    }
    var prefixes = ["webkit", "moz", "ms", "o"];
    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var method = prefix + "MatchesSelector";
      if (ElemProto[method]) {
        return method;
      }
    }
  })();
  return function matchesSelector(elem, selector) {
    return elem[matchesMethod](selector);
  };
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("fizzy-ui-utils/utils", [
      "desandro-matches-selector/matches-selector",
    ], function (matchesSelector) {
      return factory(window, matchesSelector);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(window, require("desandro-matches-selector"));
  } else {
    window.fizzyUIUtils = factory(window, window.matchesSelector);
  }
})(window, function factory(window, matchesSelector) {
  var utils = {};
  utils.extend = function (a, b) {
    for (var prop in b) {
      a[prop] = b[prop];
    }
    return a;
  };
  utils.modulo = function (num, div) {
    return ((num % div) + div) % div;
  };
  utils.makeArray = function (obj) {
    var ary = [];
    if (Array.isArray(obj)) {
      ary = obj;
    } else if (obj && typeof obj == "object" && typeof obj.length == "number") {
      for (var i = 0; i < obj.length; i++) {
        ary.push(obj[i]);
      }
    } else {
      ary.push(obj);
    }
    return ary;
  };
  utils.removeFrom = function (ary, obj) {
    var index = ary.indexOf(obj);
    if (index != -1) {
      ary.splice(index, 1);
    }
  };
  utils.getParent = function (elem, selector) {
    while (elem.parentNode && elem != document.body) {
      elem = elem.parentNode;
      if (matchesSelector(elem, selector)) {
        return elem;
      }
    }
  };
  utils.getQueryElement = function (elem) {
    if (typeof elem == "string") {
      return document.querySelector(elem);
    }
    return elem;
  };
  utils.handleEvent = function (event) {
    var method = "on" + event.type;
    if (this[method]) {
      this[method](event);
    }
  };
  utils.filterFindElements = function (elems, selector) {
    elems = utils.makeArray(elems);
    var ffElems = [];
    elems.forEach(function (elem) {
      if (!(elem instanceof HTMLElement)) {
        return;
      }
      if (!selector) {
        ffElems.push(elem);
        return;
      }
      if (matchesSelector(elem, selector)) {
        ffElems.push(elem);
      }
      var childElems = elem.querySelectorAll(selector);
      for (var i = 0; i < childElems.length; i++) {
        ffElems.push(childElems[i]);
      }
    });
    return ffElems;
  };
  utils.debounceMethod = function (_class, methodName, threshold) {
    var method = _class.prototype[methodName];
    var timeoutName = methodName + "Timeout";
    _class.prototype[methodName] = function () {
      var timeout = this[timeoutName];
      if (timeout) {
        clearTimeout(timeout);
      }
      var args = arguments;
      var _this = this;
      this[timeoutName] = setTimeout(function () {
        method.apply(_this, args);
        delete _this[timeoutName];
      }, threshold || 100);
    };
  };
  utils.docReady = function (callback) {
    var readyState = document.readyState;
    if (readyState == "complete" || readyState == "interactive") {
      setTimeout(callback);
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  };
  utils.toDashed = function (str) {
    return str
      .replace(/(.)([A-Z])/g, function (match, $1, $2) {
        return $1 + "-" + $2;
      })
      .toLowerCase();
  };
  var console = window.console;
  utils.htmlInit = function (WidgetClass, namespace) {
    utils.docReady(function () {
      var dashedNamespace = utils.toDashed(namespace);
      var dataAttr = "data-" + dashedNamespace;
      var dataAttrElems = document.querySelectorAll("[" + dataAttr + "]");
      var jsDashElems = document.querySelectorAll(".js-" + dashedNamespace);
      var elems = utils
        .makeArray(dataAttrElems)
        .concat(utils.makeArray(jsDashElems));
      var dataOptionsAttr = dataAttr + "-options";
      var jQuery = window.jQuery;
      elems.forEach(function (elem) {
        var attr =
          elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
        var options;
        try {
          options = attr && JSON.parse(attr);
        } catch (error) {
          if (console) {
            console.error(
              "Error parsing " +
                dataAttr +
                " on " +
                elem.className +
                ": " +
                error
            );
          }
          return;
        }
        var instance = new WidgetClass(elem, options);
        if (jQuery) {
          jQuery.data(elem, namespace, instance);
        }
      });
    });
  };
  return utils;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("outlayer/item", [
      "ev-emitter/ev-emitter",
      "get-size/get-size",
    ], factory);
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(require("ev-emitter"), require("get-size"));
  } else {
    window.Outlayer = {};
    window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
  }
})(window, function factory(EvEmitter, getSize) {
  "use strict";
  function isEmptyObj(obj) {
    for (var prop in obj) {
      return !1;
    }
    prop = null;
    return !0;
  }
  var docElemStyle = document.documentElement.style;
  var transitionProperty =
    typeof docElemStyle.transition == "string"
      ? "transition"
      : "WebkitTransition";
  var transformProperty =
    typeof docElemStyle.transform == "string" ? "transform" : "WebkitTransform";
  var transitionEndEvent = {
    WebkitTransition: "webkitTransitionEnd",
    transition: "transitionend",
  }[transitionProperty];
  var vendorProperties = {
    transform: transformProperty,
    transition: transitionProperty,
    transitionDuration: transitionProperty + "Duration",
    transitionProperty: transitionProperty + "Property",
    transitionDelay: transitionProperty + "Delay",
  };
  function Item(element, layout) {
    if (!element) {
      return;
    }
    this.element = element;
    this.layout = layout;
    this.position = { x: 0, y: 0 };
    this._create();
  }
  var proto = (Item.prototype = Object.create(EvEmitter.prototype));
  proto.constructor = Item;
  proto._create = function () {
    this._transn = { ingProperties: {}, clean: {}, onEnd: {} };
    this.css({ position: "absolute" });
  };
  proto.handleEvent = function (event) {
    var method = "on" + event.type;
    if (this[method]) {
      this[method](event);
    }
  };
  proto.getSize = function () {
    this.size = getSize(this.element);
  };
  proto.css = function (style) {
    var elemStyle = this.element.style;
    for (var prop in style) {
      var supportedProp = vendorProperties[prop] || prop;
      elemStyle[supportedProp] = style[prop];
    }
  };
  proto.getPosition = function () {
    var style = getComputedStyle(this.element);
    var isOriginLeft = this.layout._getOption("originLeft");
    var isOriginTop = this.layout._getOption("originTop");
    var xValue = style[isOriginLeft ? "left" : "right"];
    var yValue = style[isOriginTop ? "top" : "bottom"];
    var layoutSize = this.layout.size;
    var x =
      xValue.indexOf("%") != -1
        ? (parseFloat(xValue) / 100) * layoutSize.width
        : parseInt(xValue, 10);
    var y =
      yValue.indexOf("%") != -1
        ? (parseFloat(yValue) / 100) * layoutSize.height
        : parseInt(yValue, 10);
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
    y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
    this.position.x = x;
    this.position.y = y;
  };
  proto.layoutPosition = function () {
    var layoutSize = this.layout.size;
    var style = {};
    var isOriginLeft = this.layout._getOption("originLeft");
    var isOriginTop = this.layout._getOption("originTop");
    var xPadding = isOriginLeft ? "paddingLeft" : "paddingRight";
    var xProperty = isOriginLeft ? "left" : "right";
    var xResetProperty = isOriginLeft ? "right" : "left";
    var x = this.position.x + layoutSize[xPadding];
    style[xProperty] = this.getXValue(x);
    style[xResetProperty] = "";
    var yPadding = isOriginTop ? "paddingTop" : "paddingBottom";
    var yProperty = isOriginTop ? "top" : "bottom";
    var yResetProperty = isOriginTop ? "bottom" : "top";
    var y = this.position.y + layoutSize[yPadding];
    style[yProperty] = this.getYValue(y);
    style[yResetProperty] = "";
    this.css(style);
    this.emitEvent("layout", [this]);
  };
  proto.getXValue = function (x) {
    var isHorizontal = this.layout._getOption("horizontal");
    return this.layout.options.percentPosition && !isHorizontal
      ? (x / this.layout.size.width) * 100 + "%"
      : x + "px";
  };
  proto.getYValue = function (y) {
    var isHorizontal = this.layout._getOption("horizontal");
    return this.layout.options.percentPosition && isHorizontal
      ? (y / this.layout.size.height) * 100 + "%"
      : y + "px";
  };
  proto._transitionTo = function (x, y) {
    this.getPosition();
    var curX = this.position.x;
    var curY = this.position.y;
    var compareX = parseInt(x, 10);
    var compareY = parseInt(y, 10);
    var didNotMove =
      compareX === this.position.x && compareY === this.position.y;
    this.setPosition(x, y);
    if (didNotMove && !this.isTransitioning) {
      this.layoutPosition();
      return;
    }
    var transX = x - curX;
    var transY = y - curY;
    var transitionStyle = {};
    transitionStyle.transform = this.getTranslate(transX, transY);
    this.transition({
      to: transitionStyle,
      onTransitionEnd: { transform: this.layoutPosition },
      isCleaning: !0,
    });
  };
  proto.getTranslate = function (x, y) {
    var isOriginLeft = this.layout._getOption("originLeft");
    var isOriginTop = this.layout._getOption("originTop");
    x = isOriginLeft ? x : -x;
    y = isOriginTop ? y : -y;
    return "translate3d(" + x + "px, " + y + "px, 0)";
  };
  proto.goTo = function (x, y) {
    this.setPosition(x, y);
    this.layoutPosition();
  };
  proto.moveTo = proto._transitionTo;
  proto.setPosition = function (x, y) {
    this.position.x = parseInt(x, 10);
    this.position.y = parseInt(y, 10);
  };
  proto._nonTransition = function (args) {
    this.css(args.to);
    if (args.isCleaning) {
      this._removeStyles(args.to);
    }
    for (var prop in args.onTransitionEnd) {
      args.onTransitionEnd[prop].call(this);
    }
  };
  proto.transition = function (args) {
    if (!parseFloat(this.layout.options.transitionDuration)) {
      this._nonTransition(args);
      return;
    }
    var _transition = this._transn;
    for (var prop in args.onTransitionEnd) {
      _transition.onEnd[prop] = args.onTransitionEnd[prop];
    }
    for (prop in args.to) {
      _transition.ingProperties[prop] = !0;
      if (args.isCleaning) {
        _transition.clean[prop] = !0;
      }
    }
    if (args.from) {
      this.css(args.from);
      var h = this.element.offsetHeight;
      h = null;
    }
    this.enableTransition(args.to);
    this.css(args.to);
    this.isTransitioning = !0;
  };
  function toDashedAll(str) {
    return str.replace(/([A-Z])/g, function ($1) {
      return "-" + $1.toLowerCase();
    });
  }
  var transitionProps = "opacity," + toDashedAll(transformProperty);
  proto.enableTransition = function () {
    if (this.isTransitioning) {
      return;
    }
    var duration = this.layout.options.transitionDuration;
    duration = typeof duration == "number" ? duration + "ms" : duration;
    this.css({
      transitionProperty: transitionProps,
      transitionDuration: duration,
      transitionDelay: this.staggerDelay || 0,
    });
    this.element.addEventListener(transitionEndEvent, this, !1);
  };
  proto.onwebkitTransitionEnd = function (event) {
    this.ontransitionend(event);
  };
  proto.onotransitionend = function (event) {
    this.ontransitionend(event);
  };
  var dashedVendorProperties = { "-webkit-transform": "transform" };
  proto.ontransitionend = function (event) {
    if (event.target !== this.element) {
      return;
    }
    var _transition = this._transn;
    var propertyName =
      dashedVendorProperties[event.propertyName] || event.propertyName;
    delete _transition.ingProperties[propertyName];
    if (isEmptyObj(_transition.ingProperties)) {
      this.disableTransition();
    }
    if (propertyName in _transition.clean) {
      this.element.style[event.propertyName] = "";
      delete _transition.clean[propertyName];
    }
    if (propertyName in _transition.onEnd) {
      var onTransitionEnd = _transition.onEnd[propertyName];
      onTransitionEnd.call(this);
      delete _transition.onEnd[propertyName];
    }
    this.emitEvent("transitionEnd", [this]);
  };
  proto.disableTransition = function () {
    this.removeTransitionStyles();
    this.element.removeEventListener(transitionEndEvent, this, !1);
    this.isTransitioning = !1;
  };
  proto._removeStyles = function (style) {
    var cleanStyle = {};
    for (var prop in style) {
      cleanStyle[prop] = "";
    }
    this.css(cleanStyle);
  };
  var cleanTransitionStyle = {
    transitionProperty: "",
    transitionDuration: "",
    transitionDelay: "",
  };
  proto.removeTransitionStyles = function () {
    this.css(cleanTransitionStyle);
  };
  proto.stagger = function (delay) {
    delay = isNaN(delay) ? 0 : delay;
    this.staggerDelay = delay + "ms";
  };
  proto.removeElem = function () {
    this.element.parentNode.removeChild(this.element);
    this.css({ display: "" });
    this.emitEvent("remove", [this]);
  };
  proto.remove = function () {
    if (
      !transitionProperty ||
      !parseFloat(this.layout.options.transitionDuration)
    ) {
      this.removeElem();
      return;
    }
    this.once("transitionEnd", function () {
      this.removeElem();
    });
    this.hide();
  };
  proto.reveal = function () {
    delete this.isHidden;
    this.css({ display: "" });
    var options = this.layout.options;
    var onTransitionEnd = {};
    var transitionEndProperty =
      this.getHideRevealTransitionEndProperty("visibleStyle");
    onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
    this.transition({
      from: options.hiddenStyle,
      to: options.visibleStyle,
      isCleaning: !0,
      onTransitionEnd: onTransitionEnd,
    });
  };
  proto.onRevealTransitionEnd = function () {
    if (!this.isHidden) {
      this.emitEvent("reveal");
    }
  };
  proto.getHideRevealTransitionEndProperty = function (styleProperty) {
    var optionStyle = this.layout.options[styleProperty];
    if (optionStyle.opacity) {
      return "opacity";
    }
    for (var prop in optionStyle) {
      return prop;
    }
  };
  proto.hide = function () {
    this.isHidden = !0;
    this.css({ display: "" });
    var options = this.layout.options;
    var onTransitionEnd = {};
    var transitionEndProperty =
      this.getHideRevealTransitionEndProperty("hiddenStyle");
    onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
    this.transition({
      from: options.visibleStyle,
      to: options.hiddenStyle,
      isCleaning: !0,
      onTransitionEnd: onTransitionEnd,
    });
  };
  proto.onHideTransitionEnd = function () {
    if (this.isHidden) {
      this.css({ display: "none" });
      this.emitEvent("hide");
    }
  };
  proto.destroy = function () {
    this.css({
      position: "",
      left: "",
      right: "",
      top: "",
      bottom: "",
      transition: "",
      transform: "",
    });
  };
  return Item;
});
/*!
 * Outlayer v2.1.0
 * the brains and guts of a layout library
 * MIT license
 */
(function (window, factory) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("outlayer/outlayer", [
      "ev-emitter/ev-emitter",
      "get-size/get-size",
      "fizzy-ui-utils/utils",
      "./item",
    ], function (EvEmitter, getSize, utils, Item) {
      return factory(window, EvEmitter, getSize, utils, Item);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("ev-emitter"),
      require("get-size"),
      require("fizzy-ui-utils"),
      require("./item")
    );
  } else {
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }
})(window, function factory(window, EvEmitter, getSize, utils, Item) {
  "use strict";
  var console = window.console;
  var jQuery = window.jQuery;
  var noop = function () {};
  var GUID = 0;
  var instances = {};
  function Outlayer(element, options) {
    var queryElement = utils.getQueryElement(element);
    if (!queryElement) {
      if (console) {
        console.error(
          "Bad element for " +
            this.constructor.namespace +
            ": " +
            (queryElement || element)
        );
      }
      return;
    }
    this.element = queryElement;
    if (jQuery) {
      this.$element = jQuery(this.element);
    }
    this.options = utils.extend({}, this.constructor.defaults);
    this.option(options);
    var id = ++GUID;
    this.element.outlayerGUID = id;
    instances[id] = this;
    this._create();
    var isInitLayout = this._getOption("initLayout");
    if (isInitLayout) {
      this.layout();
    }
  }
  Outlayer.namespace = "outlayer";
  Outlayer.Item = Item;
  Outlayer.defaults = {
    containerStyle: { position: "relative" },
    initLayout: !0,
    originLeft: !0,
    originTop: !0,
    resize: !0,
    resizeContainer: !0,
    transitionDuration: "0.4s",
    hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
    visibleStyle: { opacity: 1, transform: "scale(1)" },
  };
  var proto = Outlayer.prototype;
  utils.extend(proto, EvEmitter.prototype);
  proto.option = function (opts) {
    utils.extend(this.options, opts);
  };
  proto._getOption = function (option) {
    var oldOption = this.constructor.compatOptions[option];
    return oldOption && this.options[oldOption] !== undefined
      ? this.options[oldOption]
      : this.options[option];
  };
  Outlayer.compatOptions = {
    initLayout: "isInitLayout",
    horizontal: "isHorizontal",
    layoutInstant: "isLayoutInstant",
    originLeft: "isOriginLeft",
    originTop: "isOriginTop",
    resize: "isResizeBound",
    resizeContainer: "isResizingContainer",
  };
  proto._create = function () {
    this.reloadItems();
    this.stamps = [];
    this.stamp(this.options.stamp);
    utils.extend(this.element.style, this.options.containerStyle);
    var canBindResize = this._getOption("resize");
    if (canBindResize) {
      this.bindResize();
    }
  };
  proto.reloadItems = function () {
    this.items = this._itemize(this.element.children);
  };
  proto._itemize = function (elems) {
    var itemElems = this._filterFindItemElements(elems);
    var Item = this.constructor.Item;
    var items = [];
    for (var i = 0; i < itemElems.length; i++) {
      var elem = itemElems[i];
      var item = new Item(elem, this);
      items.push(item);
    }
    return items;
  };
  proto._filterFindItemElements = function (elems) {
    return utils.filterFindElements(elems, this.options.itemSelector);
  };
  proto.getItemElements = function () {
    return this.items.map(function (item) {
      return item.element;
    });
  };
  proto.layout = function () {
    this._resetLayout();
    this._manageStamps();
    var layoutInstant = this._getOption("layoutInstant");
    var isInstant =
      layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
    this.layoutItems(this.items, isInstant);
    this._isLayoutInited = !0;
  };
  proto._init = proto.layout;
  proto._resetLayout = function () {
    this.getSize();
  };
  proto.getSize = function () {
    this.size = getSize(this.element);
  };
  proto._getMeasurement = function (measurement, size) {
    var option = this.options[measurement];
    var elem;
    if (!option) {
      this[measurement] = 0;
    } else {
      if (typeof option == "string") {
        elem = this.element.querySelector(option);
      } else if (option instanceof HTMLElement) {
        elem = option;
      }
      this[measurement] = elem ? getSize(elem)[size] : option;
    }
  };
  proto.layoutItems = function (items, isInstant) {
    items = this._getItemsForLayout(items);
    this._layoutItems(items, isInstant);
    this._postLayout();
  };
  proto._getItemsForLayout = function (items) {
    return items.filter(function (item) {
      return !item.isIgnored;
    });
  };
  proto._layoutItems = function (items, isInstant) {
    this._emitCompleteOnItems("layout", items);
    if (!items || !items.length) {
      return;
    }
    var queue = [];
    items.forEach(function (item) {
      var position = this._getItemLayoutPosition(item);
      position.item = item;
      position.isInstant = isInstant || item.isLayoutInstant;
      queue.push(position);
    }, this);
    this._processLayoutQueue(queue);
  };
  proto._getItemLayoutPosition = function () {
    return { x: 0, y: 0 };
  };
  proto._processLayoutQueue = function (queue) {
    this.updateStagger();
    queue.forEach(function (obj, i) {
      this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
    }, this);
  };
  proto.updateStagger = function () {
    var stagger = this.options.stagger;
    if (stagger === null || stagger === undefined) {
      this.stagger = 0;
      return;
    }
    this.stagger = getMilliseconds(stagger);
    return this.stagger;
  };
  proto._positionItem = function (item, x, y, isInstant, i) {
    if (isInstant) {
      item.goTo(x, y);
    } else {
      item.stagger(i * this.stagger);
      item.moveTo(x, y);
    }
  };
  proto._postLayout = function () {
    this.resizeContainer();
  };
  proto.resizeContainer = function () {
    var isResizingContainer = this._getOption("resizeContainer");
    if (!isResizingContainer) {
      return;
    }
    var size = this._getContainerSize();
    if (size) {
      this._setContainerMeasure(size.width, !0);
      this._setContainerMeasure(size.height, !1);
    }
  };
  proto._getContainerSize = noop;
  proto._setContainerMeasure = function (measure, isWidth) {
    if (measure === undefined) {
      return;
    }
    var elemSize = this.size;
    if (elemSize.isBorderBox) {
      measure += isWidth
        ? elemSize.paddingLeft +
          elemSize.paddingRight +
          elemSize.borderLeftWidth +
          elemSize.borderRightWidth
        : elemSize.paddingBottom +
          elemSize.paddingTop +
          elemSize.borderTopWidth +
          elemSize.borderBottomWidth;
    }
    measure = Math.max(measure, 0);
    this.element.style[isWidth ? "width" : "height"] = measure + "px";
  };
  proto._emitCompleteOnItems = function (eventName, items) {
    var _this = this;
    function onComplete() {
      _this.dispatchEvent(eventName + "Complete", null, [items]);
    }
    var count = items.length;
    if (!items || !count) {
      onComplete();
      return;
    }
    var doneCount = 0;
    function tick() {
      doneCount++;
      if (doneCount == count) {
        onComplete();
      }
    }
    items.forEach(function (item) {
      item.once(eventName, tick);
    });
  };
  proto.dispatchEvent = function (type, event, args) {
    var emitArgs = event ? [event].concat(args) : args;
    this.emitEvent(type, emitArgs);
    if (jQuery) {
      this.$element = this.$element || jQuery(this.element);
      if (event) {
        var $event = jQuery.Event(event);
        $event.type = type;
        this.$element.trigger($event, args);
      } else {
        this.$element.trigger(type, args);
      }
    }
  };
  proto.ignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      item.isIgnored = !0;
    }
  };
  proto.unignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      delete item.isIgnored;
    }
  };
  proto.stamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }
    this.stamps = this.stamps.concat(elems);
    elems.forEach(this.ignore, this);
  };
  proto.unstamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }
    elems.forEach(function (elem) {
      utils.removeFrom(this.stamps, elem);
      this.unignore(elem);
    }, this);
  };
  proto._find = function (elems) {
    if (!elems) {
      return;
    }
    if (typeof elems == "string") {
      elems = this.element.querySelectorAll(elems);
    }
    elems = utils.makeArray(elems);
    return elems;
  };
  proto._manageStamps = function () {
    if (!this.stamps || !this.stamps.length) {
      return;
    }
    this._getBoundingRect();
    this.stamps.forEach(this._manageStamp, this);
  };
  proto._getBoundingRect = function () {
    var boundingRect = this.element.getBoundingClientRect();
    var size = this.size;
    this._boundingRect = {
      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
      top: boundingRect.top + size.paddingTop + size.borderTopWidth,
      right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
      bottom:
        boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth),
    };
  };
  proto._manageStamp = noop;
  proto._getElementOffset = function (elem) {
    var boundingRect = elem.getBoundingClientRect();
    var thisRect = this._boundingRect;
    var size = getSize(elem);
    var offset = {
      left: boundingRect.left - thisRect.left - size.marginLeft,
      top: boundingRect.top - thisRect.top - size.marginTop,
      right: thisRect.right - boundingRect.right - size.marginRight,
      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom,
    };
    return offset;
  };
  proto.handleEvent = utils.handleEvent;
  proto.bindResize = function () {
    window.addEventListener("resize", this);
    this.isResizeBound = !0;
  };
  proto.unbindResize = function () {
    window.removeEventListener("resize", this);
    this.isResizeBound = !1;
  };
  proto.onresize = function () {
    this.resize();
  };
  utils.debounceMethod(Outlayer, "onresize", 100);
  proto.resize = function () {
    if (!this.isResizeBound || !this.needsResizeLayout()) {
      return;
    }
    this.layout();
  };
  proto.needsResizeLayout = function () {
    var size = getSize(this.element);
    var hasSizes = this.size && size;
    return hasSizes && size.innerWidth !== this.size.innerWidth;
  };
  proto.addItems = function (elems) {
    var items = this._itemize(elems);
    if (items.length) {
      this.items = this.items.concat(items);
    }
    return items;
  };
  proto.appended = function (elems) {
    var items = this.addItems(elems);
    if (!items.length) {
      return;
    }
    this.layoutItems(items, !0);
    this.reveal(items);
  };
  proto.prepended = function (elems) {
    var items = this._itemize(elems);
    if (!items.length) {
      return;
    }
    var previousItems = this.items.slice(0);
    this.items = items.concat(previousItems);
    this._resetLayout();
    this._manageStamps();
    this.layoutItems(items, !0);
    this.reveal(items);
    this.layoutItems(previousItems);
  };
  proto.reveal = function (items) {
    this._emitCompleteOnItems("reveal", items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.reveal();
    });
  };
  proto.hide = function (items) {
    this._emitCompleteOnItems("hide", items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.hide();
    });
  };
  proto.revealItemElements = function (elems) {
    var items = this.getItems(elems);
    this.reveal(items);
  };
  proto.hideItemElements = function (elems) {
    var items = this.getItems(elems);
    this.hide(items);
  };
  proto.getItem = function (elem) {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.element == elem) {
        return item;
      }
    }
  };
  proto.getItems = function (elems) {
    elems = utils.makeArray(elems);
    var items = [];
    elems.forEach(function (elem) {
      var item = this.getItem(elem);
      if (item) {
        items.push(item);
      }
    }, this);
    return items;
  };
  proto.remove = function (elems) {
    var removeItems = this.getItems(elems);
    this._emitCompleteOnItems("remove", removeItems);
    if (!removeItems || !removeItems.length) {
      return;
    }
    removeItems.forEach(function (item) {
      item.remove();
      utils.removeFrom(this.items, item);
    }, this);
  };
  proto.destroy = function () {
    var style = this.element.style;
    style.height = "";
    style.position = "";
    style.width = "";
    this.items.forEach(function (item) {
      item.destroy();
    });
    this.unbindResize();
    var id = this.element.outlayerGUID;
    delete instances[id];
    delete this.element.outlayerGUID;
    if (jQuery) {
      jQuery.removeData(this.element, this.constructor.namespace);
    }
  };
  Outlayer.data = function (elem) {
    elem = utils.getQueryElement(elem);
    var id = elem && elem.outlayerGUID;
    return id && instances[id];
  };
  Outlayer.create = function (namespace, options) {
    var Layout = subclass(Outlayer);
    Layout.defaults = utils.extend({}, Outlayer.defaults);
    utils.extend(Layout.defaults, options);
    Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
    Layout.namespace = namespace;
    Layout.data = Outlayer.data;
    Layout.Item = subclass(Item);
    utils.htmlInit(Layout, namespace);
    if (jQuery && jQuery.bridget) {
      jQuery.bridget(namespace, Layout);
    }
    return Layout;
  };
  function subclass(Parent) {
    function SubClass() {
      Parent.apply(this, arguments);
    }
    SubClass.prototype = Object.create(Parent.prototype);
    SubClass.prototype.constructor = SubClass;
    return SubClass;
  }
  var msUnits = { ms: 1, s: 1000 };
  function getMilliseconds(time) {
    if (typeof time == "number") {
      return time;
    }
    var matches = time.match(/(^\d*\.?\d*)(\w*)/);
    var num = matches && matches[1];
    var unit = matches && matches[2];
    if (!num.length) {
      return 0;
    }
    num = parseFloat(num);
    var mult = msUnits[unit] || 1;
    return num * mult;
  }
  Outlayer.Item = Item;
  return Outlayer;
});
/*!
 * Masonry v4.2.1
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define(["outlayer/outlayer", "get-size/get-size"], factory);
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(require("outlayer"), require("get-size"));
  } else {
    window.Masonry = factory(window.Outlayer, window.getSize);
  }
})(window, function factory(Outlayer, getSize) {
  var Masonry = Outlayer.create("masonry");
  Masonry.compatOptions.fitWidth = "isFitWidth";
  var proto = Masonry.prototype;
  proto._resetLayout = function () {
    this.getSize();
    this._getMeasurement("columnWidth", "outerWidth");
    this._getMeasurement("gutter", "outerWidth");
    this.measureColumns();
    this.colYs = [];
    for (var i = 0; i < this.cols; i++) {
      this.colYs.push(0);
    }
    this.maxY = 0;
    this.horizontalColIndex = 0;
  };
  proto.measureColumns = function () {
    this.getContainerWidth();
    if (!this.columnWidth) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      this.columnWidth =
        (firstItemElem && getSize(firstItemElem).outerWidth) ||
        this.containerWidth;
    }
    var columnWidth = (this.columnWidth += this.gutter);
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    var excess = columnWidth - (containerWidth % columnWidth);
    var mathMethod = excess && excess < 1 ? "round" : "floor";
    cols = Math[mathMethod](cols);
    this.cols = Math.max(cols, 1);
  };
  proto.getContainerWidth = function () {
    var isFitWidth = this._getOption("fitWidth");
    var container = isFitWidth ? this.element.parentNode : this.element;
    var size = getSize(container);
    this.containerWidth = size && size.innerWidth;
  };
  proto._getItemLayoutPosition = function (item) {
    item.getSize();
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? "round" : "ceil";
    var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
    colSpan = Math.min(colSpan, this.cols);
    var colPosMethod = this.options.horizontalOrder
      ? "_getHorizontalColPosition"
      : "_getTopColPosition";
    var colPosition = this[colPosMethod](colSpan, item);
    var position = { x: this.columnWidth * colPosition.col, y: colPosition.y };
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for (var i = colPosition.col; i < setMax; i++) {
      this.colYs[i] = setHeight;
    }
    return position;
  };
  proto._getTopColPosition = function (colSpan) {
    var colGroup = this._getTopColGroup(colSpan);
    var minimumY = Math.min.apply(Math, colGroup);
    return { col: colGroup.indexOf(minimumY), y: minimumY };
  };
  proto._getTopColGroup = function (colSpan) {
    if (colSpan < 2) {
      return this.colYs;
    }
    var colGroup = [];
    var groupCount = this.cols + 1 - colSpan;
    for (var i = 0; i < groupCount; i++) {
      colGroup[i] = this._getColGroupY(i, colSpan);
    }
    return colGroup;
  };
  proto._getColGroupY = function (col, colSpan) {
    if (colSpan < 2) {
      return this.colYs[col];
    }
    var groupColYs = this.colYs.slice(col, col + colSpan);
    return Math.max.apply(Math, groupColYs);
  };
  proto._getHorizontalColPosition = function (colSpan, item) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    col = isOver ? 0 : col;
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;
    return { col: col, y: this._getColGroupY(col, colSpan) };
  };
  proto._manageStamp = function (stamp) {
    var stampSize = getSize(stamp);
    var offset = this._getElementOffset(stamp);
    var isOriginLeft = this._getOption("originLeft");
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor(firstX / this.columnWidth);
    firstCol = Math.max(0, firstCol);
    var lastCol = Math.floor(lastX / this.columnWidth);
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min(this.cols - 1, lastCol);
    var isOriginTop = this._getOption("originTop");
    var stampMaxY =
      (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
    for (var i = firstCol; i <= lastCol; i++) {
      this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
    }
  };
  proto._getContainerSize = function () {
    this.maxY = Math.max.apply(Math, this.colYs);
    var size = { height: this.maxY };
    if (this._getOption("fitWidth")) {
      size.width = this._getContainerFitWidth();
    }
    return size;
  };
  proto._getContainerFitWidth = function () {
    var unusedCols = 0;
    var i = this.cols;
    while (--i) {
      if (this.colYs[i] !== 0) {
        break;
      }
      unusedCols++;
    }
    return (this.cols - unusedCols) * this.columnWidth - this.gutter;
  };
  proto.needsResizeLayout = function () {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };
  return Masonry;
});
