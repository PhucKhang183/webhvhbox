(jQuery.easing.jswing = jQuery.easing.swing),
  jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function (n, e, t, u, a) {
      return jQuery.easing[jQuery.easing.def](n, e, t, u, a);
    },
    easeInQuad: function (n, e, t, u, a) {
      return u * (e /= a) * e + t;
    },
    easeOutQuad: function (n, e, t, u, a) {
      return -u * (e /= a) * (e - 2) + t;
    },
    easeInOutQuad: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e + t
        : (-u / 2) * (--e * (e - 2) - 1) + t;
    },
    easeInCubic: function (n, e, t, u, a) {
      return u * (e /= a) * e * e + t;
    },
    easeOutCubic: function (n, e, t, u, a) {
      return u * ((e = e / a - 1) * e * e + 1) + t;
    },
    easeInOutCubic: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e + t
        : (u / 2) * ((e -= 2) * e * e + 2) + t;
    },
    easeInQuart: function (n, e, t, u, a) {
      return u * (e /= a) * e * e * e + t;
    },
    easeOutQuart: function (n, e, t, u, a) {
      return -u * ((e = e / a - 1) * e * e * e - 1) + t;
    },
    easeInOutQuart: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e * e + t
        : (-u / 2) * ((e -= 2) * e * e * e - 2) + t;
    },
    easeInQuint: function (n, e, t, u, a) {
      return u * (e /= a) * e * e * e * e + t;
    },
    easeOutQuint: function (n, e, t, u, a) {
      return u * ((e = e / a - 1) * e * e * e * e + 1) + t;
    },
    easeInOutQuint: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e * e * e + t
        : (u / 2) * ((e -= 2) * e * e * e * e + 2) + t;
    },
    easeInSine: function (n, e, t, u, a) {
      return -u * Math.cos((e / a) * (Math.PI / 2)) + u + t;
    },
    easeOutSine: function (n, e, t, u, a) {
      return u * Math.sin((e / a) * (Math.PI / 2)) + t;
    },
    easeInOutSine: function (n, e, t, u, a) {
      return (-u / 2) * (Math.cos((Math.PI * e) / a) - 1) + t;
    },
    easeInExpo: function (n, e, t, u, a) {
      return 0 == e ? t : u * Math.pow(2, 10 * (e / a - 1)) + t;
    },
    easeOutExpo: function (n, e, t, u, a) {
      return e == a ? t + u : u * (1 - Math.pow(2, (-10 * e) / a)) + t;
    },
    easeInOutExpo: function (n, e, t, u, a) {
      return 0 == e
        ? t
        : e == a
        ? t + u
        : (e /= a / 2) < 1
        ? (u / 2) * Math.pow(2, 10 * (e - 1)) + t
        : (u / 2) * (2 - Math.pow(2, -10 * --e)) + t;
    },
    easeInCirc: function (n, e, t, u, a) {
      return -u * (Math.sqrt(1 - (e /= a) * e) - 1) + t;
    },
    easeOutCirc: function (n, e, t, u, a) {
      return u * Math.sqrt(1 - (e = e / a - 1) * e) + t;
    },
    easeInOutCirc: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (-u / 2) * (Math.sqrt(1 - e * e) - 1) + t
        : (u / 2) * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
    },
    easeInElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (1 == (e /= a)) return t + u;
      if ((i || (i = 0.3 * a), s < Math.abs(u))) {
        s = u;
        r = i / 4;
      } else r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return (
        -s *
          Math.pow(2, 10 * (e -= 1)) *
          Math.sin(((e * a - r) * (2 * Math.PI)) / i) +
        t
      );
    },
    easeOutElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (1 == (e /= a)) return t + u;
      if ((i || (i = 0.3 * a), s < Math.abs(u))) {
        s = u;
        r = i / 4;
      } else r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return (
        s * Math.pow(2, -10 * e) * Math.sin(((e * a - r) * (2 * Math.PI)) / i) +
        u +
        t
      );
    },
    easeInOutElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (2 == (e /= a / 2)) return t + u;
      if ((i || (i = a * (0.3 * 1.5)), s < Math.abs(u))) {
        s = u;
        r = i / 4;
      } else r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return e < 1
        ? s *
            Math.pow(2, 10 * (e -= 1)) *
            Math.sin(((e * a - r) * (2 * Math.PI)) / i) *
            -0.5 +
            t
        : s *
            Math.pow(2, -10 * (e -= 1)) *
            Math.sin(((e * a - r) * (2 * Math.PI)) / i) *
            0.5 +
            u +
            t;
    },
    easeInBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158), u * (e /= a) * e * ((r + 1) * e - r) + t
      );
    },
    easeOutBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158),
        u * ((e = e / a - 1) * e * ((r + 1) * e + r) + 1) + t
      );
    },
    easeInOutBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158),
        (e /= a / 2) < 1
          ? (u / 2) * (e * e * ((1 + (r *= 1.525)) * e - r)) + t
          : (u / 2) * ((e -= 2) * e * ((1 + (r *= 1.525)) * e + r) + 2) + t
      );
    },
    easeInBounce: function (n, e, t, u, a) {
      return u - jQuery.easing.easeOutBounce(n, a - e, 0, u, a) + t;
    },
    easeOutBounce: function (n, e, t, u, a) {
      return (e /= a) < 1 / 2.75
        ? u * (7.5625 * e * e) + t
        : e < 2 / 2.75
        ? u * (7.5625 * (e -= 1.5 / 2.75) * e + 0.75) + t
        : e < 2.5 / 2.75
        ? u * (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375) + t
        : u * (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375) + t;
    },
    easeInOutBounce: function (n, e, t, u, a) {
      return e < a / 2
        ? 0.5 * jQuery.easing.easeInBounce(n, 2 * e, 0, u, a) + t
        : 0.5 * jQuery.easing.easeOutBounce(n, 2 * e - a, 0, u, a) +
            0.5 * u +
            t;
    },
  });
(function ($) {
  "use strict";
  $.fn.pointparallax = function (so) {
    var so = so || {},
      sd = {
        itemsSelector: ".point__item",
        items: {},
        position: null,
        autoheight: !1,
        autoheightClass: "pointparallax-autoheight",
        fixedClass: "pointparallax-fixed",
        afterdisplayed: !1,
        afterdisplayedClass: "pointparallax-after-displayed",
        point: "center",
        path: 100,
        easing: "linear",
        stoponpoint: !0,
        centeredposition: !1,
        css_calc: !0,
        vector: !0,
        step: 30,
      },
      s = $.extend(!0, {}, sd, so),
      parse_Float = function (value) {
        function check(value) {
          if ("number" === typeof value) return value;
          if ("string" === typeof value)
            try {
              value = value.replace(/[^0-9\.-]+/g, "");
              value = parseFloat(value);
              if (isNaN(value)) {
                return 0;
              }
              return value;
            } catch (err) {
              return 0;
            }
          return 0;
        }
        if ("object" === typeof value) {
          for (var i in value) value[i] = check(value[i]);
          return value;
        }
        return check(value);
      },
      parse_Position = function (position) {
        if ("string" !== typeof position) return position;
        var _position = position.split("-", 2).map(function (value) {
          switch (value) {
            case "left":
            case "top":
              return 0;
            case "middle":
            case "center":
              return 0.5;
            case "right":
            case "bottom":
              return 1;
          }
          return parse_Float(value) / 100;
        });
        _position[1] =
          "undefined" === typeof _position[1] ? _position[0] : _position[1];
        return _position;
      };
    return $(this).each(function () {
      var $this = $(this),
        $items = $this.children(s.itemsSelector);
      $this
        .off("autoheight.pointparallax")
        .on("autoheight.pointparallax", function (event, settings) {
          var settings = settings || s,
            max = 0;
          $this.children().each(function () {
            max = Math.max(
              max,
              $(this).outerHeight(!0) +
                (!$(this).data("position") ? $(this).position().top : 0)
            );
          });
          $this.height(max);
        })
        .off("minsize.pointparallax")
        .on("minsize.pointparallax", function (event, settings) {
          var settings = settings || s,
            max = [0, 0],
            $this = $(this),
            $this_padding = parse_Float(
              $this.css([
                "padding-top",
                "padding-right",
                "padding-bottom",
                "padding-left",
              ])
            ),
            $this_padding = [
              $this_padding["padding-right"] + $this_padding["padding-left"],
              $this_padding["padding-top"] + $this_padding["padding-bottom"],
            ];
          $items.each(function () {
            max[0] = Math.max(
              max[0],
              $(this).outerWidth(!0) + $this_padding[0]
            );
            max[1] = Math.max(
              max[1],
              $(this).outerHeight(!0) + $this_padding[1]
            );
          });
          $this.css({ "min-width": max[0], "min-height": max[1] });
        })
        .off("position.pointparallax")
        .on("position.pointparallax", function (event, settings) {
          var settings = settings || s,
            $this = $(this),
            $this_padding = parse_Float(
              $this.css([
                "padding-top",
                "padding-right",
                "padding-bottom",
                "padding-left",
              ])
            ),
            $this_size = [
              $this.width() +
                $this_padding["padding-right"] +
                $this_padding["padding-left"],
              $this.height() +
                $this_padding["padding-top"] +
                $this_padding["padding-bottom"],
            ];
          $items.each(function () {
            var $item = $(this),
              position = $item.data("position");
            if (!position) {
              position = [];
              var $item_position = parse_Float($item.css(["left", "top"])),
                $item_position = [$item_position.left, $item_position.top],
                $item_size = [$item.outerWidth(!0), $item.outerHeight(!0)];
              for (var i = 0; i < 2; i++)
                if (settings.centeredposition) {
                  position[i] =
                    Math.round(
                      (($item_position[i] + $item_size[i] / 2) /
                        $this_size[i]) *
                        1000
                    ) / 1000;
                } else {
                  position[i] =
                    Math.round(
                      ($item_position[i] / ($this_size[i] - $item_size[i])) *
                        1000
                    ) / 1000;
                }
              $item.data("position", position);
              return;
            }
            position = parse_Position(position);
            $item.data("position", position);
            var _position = [],
              $item_size = [$item.outerWidth(!0), $item.outerHeight(!0)];
            for (var i = 0; i < 2; i++)
              if (settings.css_calc) {
                var offset = [];
                if (settings.centeredposition) {
                  offset[i] =
                    $item_size[i] * position[i] +
                    $item_size[i] * (0.5 - position[i]);
                } else {
                  offset[i] = $item_size[i] * position[i];
                }
                _position[i] = offset[i]
                  ? "calc( " + position[i] * 100 + "% - " + offset[i] + "px )"
                  : position[i] + "%";
              } else {
                if (settings.centeredposition) {
                  _position[i] =
                    ($this_size[i] - $item_size[i]) * position[i] +
                    $item_size[i] * (position[i] - 0.5);
                } else {
                  _position[i] = ($this_size[i] - $item_size[i]) * position[i];
                }
              }
            $item.css({ left: _position[0], top: _position[1] });
          });
        })
        .off("resize.pointparallax")
        .on("resize.pointparallax", function (event, settings) {
          var settings = settings || s;
          if ($this.hasClass(settings.autoheightClass)) {
            $this.trigger("autoheight.pointparallax", settings);
          }
          $this
            .trigger("minsize.pointparallax", settings)
            .trigger("position.pointparallax", settings);
          requestAnimationFrame(update);
        })
        .off("scroll.pointparallax")
        .on("scroll.pointparallax", function (event, settings) {
          var settings = settings || s,
            progress = {
              wst: $(window).scrollTop(),
              wh: $(window).height(),
              tot: $this.offset().top,
              toh: $this.outerHeight(),
            };
          if (
            progress.wst + progress.wh + 20 < progress.tot ||
            progress.tot + progress.toh + 20 < progress.wst
          )
            return;
          requestAnimationFrame(update);
        })
        .off("init.pointparallax")
        .on("init.pointparallax", function (event, settings) {
          var settings = settings || s,
            $this = $(this);
          $items = $this.children(s.itemsSelector);
          $.each(settings.items, function (index, value) {
            var $item = $this.children(index);
            $.each(value, function (index, value) {
              $item.data(index, value);
            });
            if ($item.length) $items = $items.not($item);
            $items = $items.add($item);
          });
          if (settings.autoheight) $this.addClass(settings.autoheightClass);
          if ($this.data("point"))
            $this.data("point", parse_Position($this.data("point") || s.point));
          if ("relative" !== $this.css("position"))
            $this.css("position", "relative");
          $items.each(function () {
            var $item = $(this);
            $item.data(
              "point",
              parse_Position(
                $item.data("point") || $this.data("point") || s.point
              )
            );
            $item.data(
              "position",
              parse_Position($item.data("position") || s.position)
            );
          });
          $items.each(function () {
            var $item = $(this);
            $item.data(
              "point",
              parse_Position(
                $item.data("point") || $this.data("point") || s.point
              )
            );
            $item.data(
              "position",
              parse_Position($item.data("position") || s.position)
            );
          });
          $this
            .trigger("resize.pointparallax", settings)
            .trigger("inited.pointparallax", settings);
        });
      function update() {
        var progress = {
            wst: $(window).scrollTop(),
            wh: $(window).height(),
            tot: $this.offset().top,
            toh: $this.outerHeight(),
          },
          $this_padding = parse_Float(
            $this.css([
              "padding-top",
              "padding-right",
              "padding-bottom",
              "padding-left",
            ])
          ),
          $this_size = [
            $this.width() +
              $this_padding["padding-right"] +
              $this_padding["padding-left"],
            $this.height() +
              $this_padding["padding-top"] +
              $this_padding["padding-bottom"],
          ],
          point = parse_Position($this.data("point") || s.point),
          path = $this.data("path") || s.path,
          easing = $this.data("easing") || s.easing,
          step = $this.data("step") || s.step,
          stoponpoint = s.stoponpoint,
          progress =
            (progress.wst - progress.tot + progress.wh) /
            (progress.wh + progress.toh),
          _progress = progress;
        if (0 > progress) progress = 0;
        if (1 < progress) progress = 1;
        if ("function" === typeof easing) {
          progress = easing(progress);
        } else if ("string" === typeof easing) {
          if ("function" === typeof jQuery.easing[easing])
            progress = jQuery.easing[easing](progress);
        }
        $items.each(function (index) {
          var $item = $(this);
          if ($item.hasClass(s.fixedClass) || $item.data("fixed")) return;
          var $item_size = [$item.outerWidth(!0), $item.outerHeight(!0)],
            $item_point = parse_Position($item.data("point") || point),
            $item_position = parse_Position($item.data("position")),
            $item_step = $item.data("step") || step,
            $item_path = ($item.data("path") || path) / 100,
            $item_easing = $item.data("easing"),
            $item_progress,
            translate = [];
          if (s.vector) {
            if (
              $item.hasClass(s.afterdisplayedClass) ||
              $item.data("afterdisplayed") ||
              s.afterdisplayed
            ) {
              var startoffset = $item.data("startoffest");
              if (!startoffset) {
                startoffset = $item.offset().top - $this.offset().top;
                $item.data("startoffest", startoffset);
              }
              $item_progress =
                ($(window).scrollTop() +
                  $(window).height() -
                  $this.offset().top -
                  startoffset) /
                ($item_step * 100);
              if (0 > $item_progress) $item_progress = 0;
            } else {
              if (
                "string" === typeof $item_easing &&
                "function" === typeof jQuery.easing[$item_easing]
              ) {
                $item_progress = jQuery.easing[$item_easing](_progress);
              } else {
                $item_progress = progress;
              }
            }
            $item_progress = $item_path * $item_progress;
            for (var i = 0; i < 2; i++) {
              translate[i] = $item_point[i] - $item_position[i];
              translate[i] *= $item_progress * 100;
            }
            if (
              stoponpoint &&
              ($item_path < translate[0] || $item_path < translate[1])
            )
              return;
            $item.css(
              "transform",
              "translate3d(" + translate[0] + "%, " + translate[1] + "%, 0)"
            );
          } else {
            if (
              "string" === typeof $item_easing &&
              "function" === typeof jQuery.easing[$item_easing]
            ) {
              $item_progress = jQuery.easing[$item_easing](_progress);
            } else {
              $item_progress = progress;
            }
            $item_progress = $item_path * progress;
            if (stoponpoint && 1 < $item_progress) {
              $item_progress = 1;
            }
            for (var i = 0; i < 2; i++)
              if (s.centeredposition) {
                translate[i] =
                  ($item_point[i] - $item_position[i]) *
                  $this_size[i] *
                  $item_progress;
              } else {
                translate[i] =
                  ($item_point[i] - $item_position[i]) *
                  ($this_size[i] - $item_size[i]) *
                  $item_progress;
              }
            if (s.css_calc) {
              for (var i = 0; i < 2; i++)
                translate[i] = (translate[i] * 100) / $item_size[i];
              $item.css(
                "transform",
                "translate3d(" + translate[0] + "%, " + translate[1] + "%, 0)"
              );
            } else {
              $item.css(
                "transform",
                "translate3d(" + translate[0] + "px, " + translate[1] + "px, 0)"
              );
            }
          }
        });
        $this.trigger("update.pointparallax", progress, $items, s);
      }
      $(window)
        .on("resize", function (event) {
          $this.trigger("resize.pointparallax", s);
        })
        .on("scroll", function (event) {
          $this.trigger("scroll.pointparallax", s);
        });
      $this.trigger("init.pointparallax", s);
      $this.find("img").on("load", function () {
        $this.trigger("init.pointparallax", s);
      });
    });
  };
})(jQuery);
