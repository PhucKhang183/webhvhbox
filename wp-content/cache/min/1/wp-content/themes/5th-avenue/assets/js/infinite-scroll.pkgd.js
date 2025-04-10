/*!
 * Infinite Scroll PACKAGED v3.0.4
 * Automatically add next page
 *
 * Licensed GPLv3 for open source use
 * or Infinite Scroll Commercial License for commercial use
 *
 * https://infinite-scroll.com
 * Copyright 2018 Metafizzy
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
  var arraySlice = Array.prototype.slice;
  utils.makeArray = function (obj) {
    if (Array.isArray(obj)) {
      return obj;
    }
    if (obj === null || obj === undefined) {
      return [];
    }
    var isArrayLike = typeof obj == "object" && typeof obj.length == "number";
    if (isArrayLike) {
      return arraySlice.call(obj);
    }
    return [obj];
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
    threshold = threshold || 100;
    var method = _class.prototype[methodName];
    var timeoutName = methodName + "Timeout";
    _class.prototype[methodName] = function () {
      var timeout = this[timeoutName];
      clearTimeout(timeout);
      var args = arguments;
      var _this = this;
      this[timeoutName] = setTimeout(function () {
        method.apply(_this, args);
        delete _this[timeoutName];
      }, threshold);
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
    define("infinite-scroll/js/core", [
      "ev-emitter/ev-emitter",
      "fizzy-ui-utils/utils",
    ], function (EvEmitter, utils) {
      return factory(window, EvEmitter, utils);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("ev-emitter"),
      require("fizzy-ui-utils")
    );
  } else {
    window.InfiniteScroll = factory(
      window,
      window.EvEmitter,
      window.fizzyUIUtils
    );
  }
})(window, function factory(window, EvEmitter, utils) {
  var jQuery = window.jQuery;
  var instances = {};
  function InfiniteScroll(element, options) {
    var queryElem = utils.getQueryElement(element);
    if (!queryElem) {
      console.error(
        "Bad element for InfiniteScroll: " + (queryElem || element)
      );
      return;
    }
    element = queryElem;
    if (element.infiniteScrollGUID) {
      var instance = instances[element.infiniteScrollGUID];
      instance.option(options);
      return instance;
    }
    this.element = element;
    this.options = utils.extend({}, InfiniteScroll.defaults);
    this.option(options);
    if (jQuery) {
      this.$element = jQuery(this.element);
    }
    this.create();
  }
  InfiniteScroll.defaults = {};
  InfiniteScroll.create = {};
  InfiniteScroll.destroy = {};
  var proto = InfiniteScroll.prototype;
  utils.extend(proto, EvEmitter.prototype);
  var GUID = 0;
  proto.create = function () {
    var id = (this.guid = ++GUID);
    this.element.infiniteScrollGUID = id;
    instances[id] = this;
    this.pageIndex = 1;
    this.loadCount = 0;
    this.updateGetPath();
    var hasPath = this.getPath && this.getPath();
    if (!hasPath) {
      console.error("Disabling InfiniteScroll");
      return;
    }
    this.updateGetAbsolutePath();
    this.log("initialized", [this.element.className]);
    this.callOnInit();
    for (var method in InfiniteScroll.create) {
      InfiniteScroll.create[method].call(this);
    }
  };
  proto.option = function (opts) {
    utils.extend(this.options, opts);
  };
  proto.callOnInit = function () {
    var onInit = this.options.onInit;
    if (onInit) {
      onInit.call(this, this);
    }
  };
  proto.dispatchEvent = function (type, event, args) {
    this.log(type, args);
    var emitArgs = event ? [event].concat(args) : args;
    this.emitEvent(type, emitArgs);
    if (!jQuery || !this.$element) {
      return;
    }
    type += ".infiniteScroll";
    var $event = type;
    if (event) {
      var jQEvent = jQuery.Event(event);
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger($event, args);
  };
  var loggers = {
    initialized: function (className) {
      return "on " + className;
    },
    request: function (path) {
      return "URL: " + path;
    },
    load: function (response, path) {
      return (response.title || "") + ". URL: " + path;
    },
    error: function (error, path) {
      return error + ". URL: " + path;
    },
    append: function (response, path, items) {
      return items.length + " items. URL: " + path;
    },
    last: function (response, path) {
      return "URL: " + path;
    },
    history: function (title, path) {
      return "URL: " + path;
    },
    pageIndex: function (index, origin) {
      return "current page determined to be: " + index + " from " + origin;
    },
  };
  proto.log = function (type, args) {
    if (!this.options.debug) {
      return;
    }
    var message = "[InfiniteScroll] " + type;
    var logger = loggers[type];
    if (logger) {
      message += ". " + logger.apply(this, args);
    }
    console.log(message);
  };
  proto.updateMeasurements = function () {
    this.windowHeight = window.innerHeight;
    var rect = this.element.getBoundingClientRect();
    this.top = rect.top + window.pageYOffset;
  };
  proto.updateScroller = function () {
    var elementScroll = this.options.elementScroll;
    if (!elementScroll) {
      this.scroller = window;
      return;
    }
    this.scroller =
      elementScroll === !0
        ? this.element
        : utils.getQueryElement(elementScroll);
    if (!this.scroller) {
      throw "Unable to find elementScroll: " + elementScroll;
    }
  };
  proto.updateGetPath = function () {
    var optPath = this.options.path;
    if (!optPath) {
      console.error("InfiniteScroll path option required. Set as: " + optPath);
      return;
    }
    var type = typeof optPath;
    if (type == "function") {
      this.getPath = optPath;
      return;
    }
    var templateMatch = type == "string" && optPath.match("{{#}}");
    if (templateMatch) {
      this.updateGetPathTemplate(optPath);
      return;
    }
    this.updateGetPathSelector(optPath);
  };
  proto.updateGetPathTemplate = function (optPath) {
    this.getPath = function () {
      var nextIndex = this.pageIndex + 1;
      return optPath.replace("{{#}}", nextIndex);
    }.bind(this);
    var regexString = optPath.replace("{{#}}", "(\\d\\d?\\d?)");
    var templateRe = new RegExp(regexString);
    var match = location.href.match(templateRe);
    if (match) {
      this.pageIndex = parseInt(match[1], 10);
      this.log("pageIndex", [this.pageIndex, "template string"]);
    }
  };
  var pathRegexes = [
    /^(.*?\/?page\/?)(\d\d?\d?)(.*?$)/,
    /^(.*?\/?\?page=)(\d\d?\d?)(.*?$)/,
    /(.*?)(\d\d?\d?)(?!.*\d)(.*?$)/,
  ];
  proto.updateGetPathSelector = function (optPath) {
    var hrefElem = document.querySelector(optPath);
    if (!hrefElem) {
      console.error(
        "Bad InfiniteScroll path option. Next link not found: " + optPath
      );
      return;
    }
    var href = hrefElem.getAttribute("href");
    var pathParts, regex;
    for (var i = 0; href && i < pathRegexes.length; i++) {
      regex = pathRegexes[i];
      var match = href.match(regex);
      if (match) {
        pathParts = match.slice(1);
        break;
      }
    }
    if (!pathParts) {
      console.error("InfiniteScroll unable to parse next link href: " + href);
      return;
    }
    this.isPathSelector = !0;
    this.getPath = function () {
      var nextIndex = this.pageIndex + 1;
      return pathParts[0] + nextIndex + pathParts[2];
    }.bind(this);
    this.pageIndex = parseInt(pathParts[1], 10) - 1;
    this.log("pageIndex", [this.pageIndex, "next link"]);
  };
  proto.updateGetAbsolutePath = function () {
    var path = this.getPath();
    var isAbsolute = path.match(/^http/) || path.match(/^\//);
    if (isAbsolute) {
      this.getAbsolutePath = this.getPath;
      return;
    }
    var pathname = location.pathname;
    var directory = pathname.substring(0, pathname.lastIndexOf("/"));
    this.getAbsolutePath = function () {
      return directory + "/" + this.getPath();
    };
  };
  InfiniteScroll.create.hideNav = function () {
    var nav = utils.getQueryElement(this.options.hideNav);
    if (!nav) {
      return;
    }
    nav.style.display = "none";
    this.nav = nav;
  };
  InfiniteScroll.destroy.hideNav = function () {
    if (this.nav) {
      this.nav.style.display = "";
    }
  };
  proto.destroy = function () {
    this.allOff();
    for (var method in InfiniteScroll.destroy) {
      InfiniteScroll.destroy[method].call(this);
    }
    delete this.element.infiniteScrollGUID;
    delete instances[this.guid];
  };
  InfiniteScroll.throttle = function (fn, threshold) {
    threshold = threshold || 200;
    var last, timeout;
    return function () {
      var now = +new Date();
      var args = arguments;
      var trigger = function () {
        last = now;
        fn.apply(this, args);
      }.bind(this);
      if (last && now < last + threshold) {
        clearTimeout(timeout);
        timeout = setTimeout(trigger, threshold);
      } else {
        trigger();
      }
    };
  };
  InfiniteScroll.data = function (elem) {
    elem = utils.getQueryElement(elem);
    var id = elem && elem.infiniteScrollGUID;
    return id && instances[id];
  };
  InfiniteScroll.setJQuery = function ($) {
    jQuery = $;
  };
  utils.htmlInit(InfiniteScroll, "infinite-scroll");
  if (jQuery && jQuery.bridget) {
    jQuery.bridget("infiniteScroll", InfiniteScroll);
  }
  return InfiniteScroll;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("infinite-scroll/js/page-load", ["./core"], function (
      InfiniteScroll
    ) {
      return factory(window, InfiniteScroll);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(window, require("./core"));
  } else {
    factory(window, window.InfiniteScroll);
  }
})(window, function factory(window, InfiniteScroll) {
  var proto = InfiniteScroll.prototype;
  InfiniteScroll.defaults.loadOnScroll = !0;
  InfiniteScroll.defaults.checkLastPage = !0;
  InfiniteScroll.defaults.responseType = "document";
  InfiniteScroll.create.pageLoad = function () {
    this.canLoad = !0;
    this.on("scrollThreshold", this.onScrollThresholdLoad);
    this.on("load", this.checkLastPage);
    if (this.options.outlayer) {
      this.on("append", this.onAppendOutlayer);
    }
  };
  proto.onScrollThresholdLoad = function () {
    if (this.options.loadOnScroll) {
      this.loadNextPage();
    }
  };
  proto.loadNextPage = function () {
    if (this.isLoading || !this.canLoad) {
      return;
    }
    var path = this.getAbsolutePath();
    this.isLoading = !0;
    var onLoad = function (response) {
      this.onPageLoad(response, path);
    }.bind(this);
    var onError = function (error) {
      this.onPageError(error, path);
    }.bind(this);
    request(path, this.options.responseType, onLoad, onError);
    this.dispatchEvent("request", null, [path]);
  };
  proto.onPageLoad = function (response, path) {
    if (!this.options.append) {
      this.isLoading = !1;
    }
    this.pageIndex++;
    this.loadCount++;
    this.dispatchEvent("load", null, [response, path]);
    this.appendNextPage(response, path);
    return response;
  };
  proto.appendNextPage = function (response, path) {
    var optAppend = this.options.append;
    var isDocument = this.options.responseType == "document";
    if (!isDocument || !optAppend) {
      return;
    }
    var items = response.querySelectorAll(optAppend);
    var fragment = getItemsFragment(items);
    var appendReady = function () {
      this.appendItems(items, fragment);
      this.isLoading = !1;
      this.dispatchEvent("append", null, [response, path, items]);
    }.bind(this);
    if (this.options.outlayer) {
      this.appendOutlayerItems(fragment, appendReady);
    } else {
      appendReady();
    }
  };
  proto.appendItems = function (items, fragment) {
    if (!items || !items.length) {
      return;
    }
    fragment = fragment || getItemsFragment(items);
    refreshScripts(fragment);
    this.element.appendChild(fragment);
  };
  function getItemsFragment(items) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; items && i < items.length; i++) {
      fragment.appendChild(items[i]);
    }
    return fragment;
  }
  function refreshScripts(fragment) {
    var scripts = fragment.querySelectorAll("script");
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var freshScript = document.createElement("script");
      copyAttributes(script, freshScript);
      freshScript.innerHTML = script.innerHTML;
      script.parentNode.replaceChild(freshScript, script);
    }
  }
  function copyAttributes(fromNode, toNode) {
    var attrs = fromNode.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      toNode.setAttribute(attr.name, attr.value);
    }
  }
  proto.appendOutlayerItems = function (fragment, appendReady) {
    var imagesLoaded = InfiniteScroll.imagesLoaded || window.imagesLoaded;
    if (!imagesLoaded) {
      console.error(
        "[InfiniteScroll] imagesLoaded required for outlayer option"
      );
      this.isLoading = !1;
      return;
    }
    imagesLoaded(fragment, appendReady);
  };
  proto.onAppendOutlayer = function (response, path, items) {
    this.options.outlayer.appended(items);
  };
  proto.checkLastPage = function (response, path) {
    var checkLastPage = this.options.checkLastPage;
    if (!checkLastPage) {
      return;
    }
    var pathOpt = this.options.path;
    if (typeof pathOpt == "function") {
      var nextPath = this.getPath();
      if (!nextPath) {
        this.lastPageReached(response, path);
        return;
      }
    }
    var selector;
    if (typeof checkLastPage == "string") {
      selector = checkLastPage;
    } else if (this.isPathSelector) {
      selector = pathOpt;
    }
    if (!selector || !response.querySelector) {
      return;
    }
    var nextElem = response.querySelector(selector);
    if (!nextElem) {
      this.lastPageReached(response, path);
    }
  };
  proto.lastPageReached = function (response, path) {
    this.canLoad = !1;
    this.dispatchEvent("last", null, [response, path]);
  };
  proto.onPageError = function (error, path) {
    this.isLoading = !1;
    this.canLoad = !1;
    this.dispatchEvent("error", null, [error, path]);
    return error;
  };
  InfiniteScroll.create.prefill = function () {
    if (!this.options.prefill) {
      return;
    }
    var append = this.options.append;
    if (!append) {
      console.error("append option required for prefill. Set as :" + append);
      return;
    }
    this.updateMeasurements();
    this.updateScroller();
    this.isPrefilling = !0;
    this.on("append", this.prefill);
    this.once("error", this.stopPrefill);
    this.once("last", this.stopPrefill);
    this.prefill();
  };
  proto.prefill = function () {
    var distance = this.getPrefillDistance();
    this.isPrefilling = distance >= 0;
    if (this.isPrefilling) {
      this.log("prefill");
      this.loadNextPage();
    } else {
      this.stopPrefill();
    }
  };
  proto.getPrefillDistance = function () {
    if (this.options.elementScroll) {
      return this.scroller.clientHeight - this.scroller.scrollHeight;
    }
    return this.windowHeight - this.element.clientHeight;
  };
  proto.stopPrefill = function () {
    this.log("stopPrefill");
    this.off("append", this.prefill);
  };
  function request(url, responseType, onLoad, onError) {
    var req = new XMLHttpRequest();
    req.open("GET", url, !0);
    req.responseType = responseType || "";
    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    req.onload = function () {
      if (req.status == 200) {
        onLoad(req.response);
      } else {
        var error = new Error(req.statusText);
        onError(error);
      }
    };
    req.onerror = function () {
      var error = new Error("Network error requesting " + url);
      onError(error);
    };
    req.send();
  }
  return InfiniteScroll;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("infinite-scroll/js/scroll-watch", [
      "./core",
      "fizzy-ui-utils/utils",
    ], function (InfiniteScroll, utils) {
      return factory(window, InfiniteScroll, utils);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("./core"),
      require("fizzy-ui-utils")
    );
  } else {
    factory(window, window.InfiniteScroll, window.fizzyUIUtils);
  }
})(window, function factory(window, InfiniteScroll, utils) {
  var proto = InfiniteScroll.prototype;
  InfiniteScroll.defaults.scrollThreshold = 400;
  InfiniteScroll.create.scrollWatch = function () {
    this.pageScrollHandler = this.onPageScroll.bind(this);
    this.resizeHandler = this.onResize.bind(this);
    var scrollThreshold = this.options.scrollThreshold;
    var isEnable = scrollThreshold || scrollThreshold === 0;
    if (isEnable) {
      this.enableScrollWatch();
    }
  };
  InfiniteScroll.destroy.scrollWatch = function () {
    this.disableScrollWatch();
  };
  proto.enableScrollWatch = function () {
    if (this.isScrollWatching) {
      return;
    }
    this.isScrollWatching = !0;
    this.updateMeasurements();
    this.updateScroller();
    this.on("last", this.disableScrollWatch);
    this.bindScrollWatchEvents(!0);
  };
  proto.disableScrollWatch = function () {
    if (!this.isScrollWatching) {
      return;
    }
    this.bindScrollWatchEvents(!1);
    delete this.isScrollWatching;
  };
  proto.bindScrollWatchEvents = function (isBind) {
    var addRemove = isBind ? "addEventListener" : "removeEventListener";
    this.scroller[addRemove]("scroll", this.pageScrollHandler);
    window[addRemove]("resize", this.resizeHandler);
  };
  proto.onPageScroll = InfiniteScroll.throttle(function () {
    var distance = this.getBottomDistance();
    if (distance <= this.options.scrollThreshold) {
      this.dispatchEvent("scrollThreshold");
    }
  });
  proto.getBottomDistance = function () {
    if (this.options.elementScroll) {
      return this.getElementBottomDistance();
    } else {
      return this.getWindowBottomDistance();
    }
  };
  proto.getWindowBottomDistance = function () {
    var bottom = this.top + this.element.clientHeight;
    var scrollY = window.pageYOffset + this.windowHeight;
    return bottom - scrollY;
  };
  proto.getElementBottomDistance = function () {
    var bottom = this.scroller.scrollHeight;
    var scrollY = this.scroller.scrollTop + this.scroller.clientHeight;
    return bottom - scrollY;
  };
  proto.onResize = function () {
    this.updateMeasurements();
  };
  utils.debounceMethod(InfiniteScroll, "onResize", 150);
  return InfiniteScroll;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("infinite-scroll/js/history", [
      "./core",
      "fizzy-ui-utils/utils",
    ], function (InfiniteScroll, utils) {
      return factory(window, InfiniteScroll, utils);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("./core"),
      require("fizzy-ui-utils")
    );
  } else {
    factory(window, window.InfiniteScroll, window.fizzyUIUtils);
  }
})(window, function factory(window, InfiniteScroll, utils) {
  var proto = InfiniteScroll.prototype;
  InfiniteScroll.defaults.history = "replace";
  var link = document.createElement("a");
  InfiniteScroll.create.history = function () {
    if (!this.options.history) {
      return;
    }
    link.href = this.getAbsolutePath();
    var linkOrigin = link.origin || link.protocol + "//" + link.host;
    var isSameOrigin = linkOrigin == location.origin;
    if (!isSameOrigin) {
      console.error(
        "[InfiniteScroll] cannot set history with different origin: " +
          link.origin +
          " on " +
          location.origin +
          " . History behavior disabled."
      );
      return;
    }
    if (this.options.append) {
      this.createHistoryAppend();
    } else {
      this.createHistoryPageLoad();
    }
  };
  proto.createHistoryAppend = function () {
    this.updateMeasurements();
    this.updateScroller();
    this.scrollPages = [{ top: 0, path: location.href, title: document.title }];
    this.scrollPageIndex = 0;
    this.scrollHistoryHandler = this.onScrollHistory.bind(this);
    this.unloadHandler = this.onUnload.bind(this);
    this.scroller.addEventListener("scroll", this.scrollHistoryHandler);
    this.on("append", this.onAppendHistory);
    this.bindHistoryAppendEvents(!0);
  };
  proto.bindHistoryAppendEvents = function (isBind) {
    var addRemove = isBind ? "addEventListener" : "removeEventListener";
    this.scroller[addRemove]("scroll", this.scrollHistoryHandler);
    window[addRemove]("unload", this.unloadHandler);
  };
  proto.createHistoryPageLoad = function () {
    this.on("load", this.onPageLoadHistory);
  };
  InfiniteScroll.destroy.history = proto.destroyHistory = function () {
    var isHistoryAppend = this.options.history && this.options.append;
    if (isHistoryAppend) {
      this.bindHistoryAppendEvents(!1);
    }
  };
  proto.onAppendHistory = function (response, path, items) {
    if (!items || !items.length) {
      return;
    }
    var firstItem = items[0];
    var elemScrollY = this.getElementScrollY(firstItem);
    link.href = path;
    this.scrollPages.push({
      top: elemScrollY,
      path: link.href,
      title: response.title,
    });
  };
  proto.getElementScrollY = function (elem) {
    if (this.options.elementScroll) {
      return this.getElementElementScrollY(elem);
    } else {
      return this.getElementWindowScrollY(elem);
    }
  };
  proto.getElementWindowScrollY = function (elem) {
    var rect = elem.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  };
  proto.getElementElementScrollY = function (elem) {
    return elem.offsetTop - this.top;
  };
  proto.onScrollHistory = function () {
    var scrollViewY = this.getScrollViewY();
    var pageIndex, page;
    for (var i = 0; i < this.scrollPages.length; i++) {
      var scrollPage = this.scrollPages[i];
      if (scrollPage.top >= scrollViewY) {
        break;
      }
      pageIndex = i;
      page = scrollPage;
    }
    if (pageIndex != this.scrollPageIndex) {
      this.scrollPageIndex = pageIndex;
      this.setHistory(page.title, page.path);
    }
  };
  utils.debounceMethod(InfiniteScroll, "onScrollHistory", 150);
  proto.getScrollViewY = function () {
    if (this.options.elementScroll) {
      return this.scroller.scrollTop + this.scroller.clientHeight / 2;
    } else {
      return window.pageYOffset + this.windowHeight / 2;
    }
  };
  proto.setHistory = function (title, path) {
    var optHistory = this.options.history;
    var historyMethod = optHistory && history[optHistory + "State"];
    if (!historyMethod) {
      return;
    }
    history[optHistory + "State"](null, title, path);
    if (this.options.historyTitle) {
      document.title = title;
    }
    this.dispatchEvent("history", null, [title, path]);
  };
  proto.onUnload = function () {
    var pageIndex = this.scrollPageIndex;
    if (pageIndex === 0) {
      return;
    }
    var scrollPage = this.scrollPages[pageIndex];
    var scrollY = window.pageYOffset - scrollPage.top + this.top;
    this.destroyHistory();
    scrollTo(0, scrollY);
  };
  proto.onPageLoadHistory = function (response, path) {
    this.setHistory(response.title, path);
  };
  return InfiniteScroll;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("infinite-scroll/js/button", [
      "./core",
      "fizzy-ui-utils/utils",
    ], function (InfiniteScroll, utils) {
      return factory(window, InfiniteScroll, utils);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("./core"),
      require("fizzy-ui-utils")
    );
  } else {
    factory(window, window.InfiniteScroll, window.fizzyUIUtils);
  }
})(window, function factory(window, InfiniteScroll, utils) {
  InfiniteScroll.create.button = function () {
    var buttonElem = utils.getQueryElement(this.options.button);
    if (buttonElem) {
      this.button = new InfiniteScrollButton(buttonElem, this);
      return;
    }
  };
  InfiniteScroll.destroy.button = function () {
    if (this.button) {
      this.button.destroy();
    }
  };
  function InfiniteScrollButton(element, infScroll) {
    this.element = element;
    this.infScroll = infScroll;
    this.clickHandler = this.onClick.bind(this);
    this.element.addEventListener("click", this.clickHandler);
    infScroll.on("request", this.disable.bind(this));
    infScroll.on("load", this.enable.bind(this));
    infScroll.on("error", this.hide.bind(this));
    infScroll.on("last", this.hide.bind(this));
  }
  InfiniteScrollButton.prototype.onClick = function (event) {
    event.preventDefault();
    this.infScroll.loadNextPage();
  };
  InfiniteScrollButton.prototype.enable = function () {
    this.element.removeAttribute("disabled");
  };
  InfiniteScrollButton.prototype.disable = function () {
    this.element.disabled = "disabled";
  };
  InfiniteScrollButton.prototype.hide = function () {
    this.element.style.display = "none";
  };
  InfiniteScrollButton.prototype.destroy = function () {
    this.element.removeEventListener("click", this.clickHandler);
  };
  InfiniteScroll.Button = InfiniteScrollButton;
  return InfiniteScroll;
});
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define("infinite-scroll/js/status", [
      "./core",
      "fizzy-ui-utils/utils",
    ], function (InfiniteScroll, utils) {
      return factory(window, InfiniteScroll, utils);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      window,
      require("./core"),
      require("fizzy-ui-utils")
    );
  } else {
    factory(window, window.InfiniteScroll, window.fizzyUIUtils);
  }
})(window, function factory(window, InfiniteScroll, utils) {
  var proto = InfiniteScroll.prototype;
  InfiniteScroll.create.status = function () {
    var statusElem = utils.getQueryElement(this.options.status);
    if (!statusElem) {
      return;
    }
    this.statusElement = statusElem;
    this.statusEventElements = {
      request: statusElem.querySelector(".infinite-scroll-request"),
      error: statusElem.querySelector(".infinite-scroll-error"),
      last: statusElem.querySelector(".infinite-scroll-last"),
    };
    this.on("request", this.showRequestStatus);
    this.on("error", this.showErrorStatus);
    this.on("last", this.showLastStatus);
    this.bindHideStatus("on");
  };
  proto.bindHideStatus = function (bindMethod) {
    var hideEvent = this.options.append ? "append" : "load";
    this[bindMethod](hideEvent, this.hideAllStatus);
  };
  proto.showRequestStatus = function () {
    this.showStatus("request");
  };
  proto.showErrorStatus = function () {
    this.showStatus("error");
  };
  proto.showLastStatus = function () {
    this.showStatus("last");
    this.bindHideStatus("off");
  };
  proto.showStatus = function (eventName) {
    show(this.statusElement);
    this.hideStatusEventElements();
    var eventElem = this.statusEventElements[eventName];
    show(eventElem);
  };
  proto.hideAllStatus = function () {
    hide(this.statusElement);
    this.hideStatusEventElements();
  };
  proto.hideStatusEventElements = function () {
    for (var type in this.statusEventElements) {
      var eventElem = this.statusEventElements[type];
      hide(eventElem);
    }
  };
  function hide(elem) {
    setDisplay(elem, "none");
  }
  function show(elem) {
    setDisplay(elem, "block");
  }
  function setDisplay(elem, value) {
    if (elem) {
      elem.style.display = value;
    }
  }
  return InfiniteScroll;
});
/*!
 * Infinite Scroll v3.0.4
 * Automatically add next page
 *
 * Licensed GPLv3 for open source use
 * or Infinite Scroll Commercial License for commercial use
 *
 * https://infinite-scroll.com
 * Copyright 2018 Metafizzy
 */
(function (window, factory) {
  if (typeof define == "function" && define.amd) {
    define([
      "infinite-scroll/js/core",
      "infinite-scroll/js/page-load",
      "infinite-scroll/js/scroll-watch",
      "infinite-scroll/js/history",
      "infinite-scroll/js/button",
      "infinite-scroll/js/status",
    ], factory);
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(
      require("./core"),
      require("./page-load"),
      require("./scroll-watch"),
      require("./history"),
      require("./button"),
      require("./status")
    );
  }
})(window, function factory(InfiniteScroll) {
  return InfiniteScroll;
});
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function (window, factory) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("imagesloaded/imagesloaded", ["ev-emitter/ev-emitter"], function (
      EvEmitter
    ) {
      return factory(window, EvEmitter);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = factory(window, require("ev-emitter"));
  } else {
    window.imagesLoaded = factory(window, window.EvEmitter);
  }
})(
  typeof window !== "undefined" ? window : this,
  function factory(window, EvEmitter) {
    var $ = window.jQuery;
    var console = window.console;
    function extend(a, b) {
      for (var prop in b) {
        a[prop] = b[prop];
      }
      return a;
    }
    var arraySlice = Array.prototype.slice;
    function makeArray(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }
      var isArrayLike = typeof obj == "object" && typeof obj.length == "number";
      if (isArrayLike) {
        return arraySlice.call(obj);
      }
      return [obj];
    }
    function ImagesLoaded(elem, options, onAlways) {
      if (!(this instanceof ImagesLoaded)) {
        return new ImagesLoaded(elem, options, onAlways);
      }
      var queryElem = elem;
      if (typeof elem == "string") {
        queryElem = document.querySelectorAll(elem);
      }
      if (!queryElem) {
        console.error("Bad element for imagesLoaded " + (queryElem || elem));
        return;
      }
      this.elements = makeArray(queryElem);
      this.options = extend({}, this.options);
      if (typeof options == "function") {
        onAlways = options;
      } else {
        extend(this.options, options);
      }
      if (onAlways) {
        this.on("always", onAlways);
      }
      this.getImages();
      if ($) {
        this.jqDeferred = new $.Deferred();
      }
      setTimeout(this.check.bind(this));
    }
    ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
    ImagesLoaded.prototype.options = {};
    ImagesLoaded.prototype.getImages = function () {
      this.images = [];
      this.elements.forEach(this.addElementImages, this);
    };
    ImagesLoaded.prototype.addElementImages = function (elem) {
      if (elem.nodeName == "IMG") {
        this.addImage(elem);
      }
      if (this.options.background === !0) {
        this.addElementBackgroundImages(elem);
      }
      var nodeType = elem.nodeType;
      if (!nodeType || !elementNodeTypes[nodeType]) {
        return;
      }
      var childImgs = elem.querySelectorAll("img");
      for (var i = 0; i < childImgs.length; i++) {
        var img = childImgs[i];
        this.addImage(img);
      }
      if (typeof this.options.background == "string") {
        var children = elem.querySelectorAll(this.options.background);
        for (i = 0; i < children.length; i++) {
          var child = children[i];
          this.addElementBackgroundImages(child);
        }
      }
    };
    var elementNodeTypes = { 1: !0, 9: !0, 11: !0 };
    ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
      var style = getComputedStyle(elem);
      if (!style) {
        return;
      }
      var reURL = /url\((['"])?(.*?)\1\)/gi;
      var matches = reURL.exec(style.backgroundImage);
      while (matches !== null) {
        var url = matches && matches[2];
        if (url) {
          this.addBackground(url, elem);
        }
        matches = reURL.exec(style.backgroundImage);
      }
    };
    ImagesLoaded.prototype.addImage = function (img) {
      var loadingImage = new LoadingImage(img);
      this.images.push(loadingImage);
    };
    ImagesLoaded.prototype.addBackground = function (url, elem) {
      var background = new Background(url, elem);
      this.images.push(background);
    };
    ImagesLoaded.prototype.check = function () {
      var _this = this;
      this.progressedCount = 0;
      this.hasAnyBroken = !1;
      if (!this.images.length) {
        this.complete();
        return;
      }
      function onProgress(image, elem, message) {
        setTimeout(function () {
          _this.progress(image, elem, message);
        });
      }
      this.images.forEach(function (loadingImage) {
        loadingImage.once("progress", onProgress);
        loadingImage.check();
      });
    };
    ImagesLoaded.prototype.progress = function (image, elem, message) {
      this.progressedCount++;
      this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
      this.emitEvent("progress", [this, image, elem]);
      if (this.jqDeferred && this.jqDeferred.notify) {
        this.jqDeferred.notify(this, image);
      }
      if (this.progressedCount == this.images.length) {
        this.complete();
      }
      if (this.options.debug && console) {
        console.log("progress: " + message, image, elem);
      }
    };
    ImagesLoaded.prototype.complete = function () {
      var eventName = this.hasAnyBroken ? "fail" : "done";
      this.isComplete = !0;
      this.emitEvent(eventName, [this]);
      this.emitEvent("always", [this]);
      if (this.jqDeferred) {
        var jqMethod = this.hasAnyBroken ? "reject" : "resolve";
        this.jqDeferred[jqMethod](this);
      }
    };
    function LoadingImage(img) {
      this.img = img;
    }
    LoadingImage.prototype = Object.create(EvEmitter.prototype);
    LoadingImage.prototype.check = function () {
      var isComplete = this.getIsImageComplete();
      if (isComplete) {
        this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
        return;
      }
      this.proxyImage = new Image();
      this.proxyImage.addEventListener("load", this);
      this.proxyImage.addEventListener("error", this);
      this.img.addEventListener("load", this);
      this.img.addEventListener("error", this);
      this.proxyImage.src = this.img.src;
    };
    LoadingImage.prototype.getIsImageComplete = function () {
      return this.img.complete && this.img.naturalWidth;
    };
    LoadingImage.prototype.confirm = function (isLoaded, message) {
      this.isLoaded = isLoaded;
      this.emitEvent("progress", [this, this.img, message]);
    };
    LoadingImage.prototype.handleEvent = function (event) {
      var method = "on" + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    LoadingImage.prototype.onload = function () {
      this.confirm(!0, "onload");
      this.unbindEvents();
    };
    LoadingImage.prototype.onerror = function () {
      this.confirm(!1, "onerror");
      this.unbindEvents();
    };
    LoadingImage.prototype.unbindEvents = function () {
      this.proxyImage.removeEventListener("load", this);
      this.proxyImage.removeEventListener("error", this);
      this.img.removeEventListener("load", this);
      this.img.removeEventListener("error", this);
    };
    function Background(url, element) {
      this.url = url;
      this.element = element;
      this.img = new Image();
    }
    Background.prototype = Object.create(LoadingImage.prototype);
    Background.prototype.check = function () {
      this.img.addEventListener("load", this);
      this.img.addEventListener("error", this);
      this.img.src = this.url;
      var isComplete = this.getIsImageComplete();
      if (isComplete) {
        this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
        this.unbindEvents();
      }
    };
    Background.prototype.unbindEvents = function () {
      this.img.removeEventListener("load", this);
      this.img.removeEventListener("error", this);
    };
    Background.prototype.confirm = function (isLoaded, message) {
      this.isLoaded = isLoaded;
      this.emitEvent("progress", [this, this.element, message]);
    };
    ImagesLoaded.makeJQueryPlugin = function (jQuery) {
      jQuery = jQuery || window.jQuery;
      if (!jQuery) {
        return;
      }
      $ = jQuery;
      $.fn.imagesLoaded = function (options, callback) {
        var instance = new ImagesLoaded(this, options, callback);
        return instance.jqDeferred.promise($(this));
      };
    };
    ImagesLoaded.makeJQueryPlugin();
    return ImagesLoaded;
  }
);
