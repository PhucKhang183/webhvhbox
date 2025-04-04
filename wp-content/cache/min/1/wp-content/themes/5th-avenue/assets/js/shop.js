(function ($) {
  "use strict";
  $("body").on(
    "mouseenter mouseleave",
    ".av5-hover-thumbnails-wrapper",
    function (e) {
      if ("mouseenter" !== e.type && "mouseleave" !== e.type) {
        return;
      }
      var duration = 300,
        second_i = $(this).find("img.av5-second-hover-image"),
        second_show = "mouseenter" == e.type;
      if (second_show) {
        second_i
          .stop(1, 1)
          .css("opacity", 0)
          .show()
          .animate({ opacity: 1 }, duration);
      } else {
        second_i
          .stop(1, 1)
          .css("opacity", 1)
          .animate({ opacity: 0 }, duration, function () {
            if (!second_show) {
              $(this).hide();
            }
          });
      }
    }
  );
  (function (old) {
    $.fn.attr = function () {
      if (arguments.length === 0) {
        if (this.length === 0) {
          return null;
        }
        var obj = {};
        $.each(this[0].attributes, function () {
          if (this.specified) {
            obj[this.name] = this.value;
          }
        });
        return obj;
      }
      return old.apply(this, arguments);
    };
  })($.fn.attr);
  $("body").on("init_shortcode.productcarousel", function (e, parent) {
    var parent = parent || $("body");
    $(parent)
      .find(
        ".av5-product-carousel-shortcode, .av5-upsell-carousel, .av5-related-carousel"
      )
      .each(function () {
        var $this = $(this),
          $products = $this.find("ul.products");
        if (
          $this.is(".av5-upsell-carousel, .av5-related-carousel") &&
          $products.children("li.product").length <=
            ($this.data("column-desktop") || $this.data("columnDesktop") || 1)
        ) {
          return !0;
        }
        $products.addClass("owl-carousel owl-theme").removeClass("reveal--on");
        if (!$products.hasClass("owl-loaded")) {
          $products
            .children()
            .removeClass("first last")
            .not("li.product")
            .each(function () {
              $(this).remove();
            });
        }
        var sc_options = { responsive: {} },
          sc_data = $this.data();
        if (sc_data.hasOwnProperty("column-mobile")) {
          sc_options.responsive["0"] = { items: sc_data["column-mobile"] };
        } else if (sc_data.hasOwnProperty("columnMobile")) {
          sc_options.responsive["0"] = { items: sc_data.columnMobile };
        }
        if (sc_data.hasOwnProperty("column-table")) {
          sc_options.responsive["690"] = { items: sc_data["column-table"] };
        } else if (sc_data.hasOwnProperty("columnTable")) {
          sc_options.responsive["690"] = { items: sc_data.columnTable };
        }
        if (sc_data.hasOwnProperty("column-desktop-small")) {
          sc_options.responsive["1000"] = {
            items: sc_data["column-desktop-small"],
          };
        } else if (sc_data.hasOwnProperty("columnDesktopSmall")) {
          sc_options.responsive["1000"] = { items: sc_data.columnDesktopSmall };
        }
        if (sc_data.hasOwnProperty("column-desktop")) {
          sc_options.responsive["1300"] = { items: sc_data["column-desktop"] };
        } else if (sc_data.hasOwnProperty("columnDesktop")) {
          sc_options.responsive["1300"] = { items: sc_data.columnDesktop };
        }
        if (sc_data.hasOwnProperty("margin"))
          sc_options.margin = sc_data.margin;
        if (sc_data.hasOwnProperty("loop")) sc_options.loop = sc_data.loop;
        if (sc_data.hasOwnProperty("nav")) sc_options.nav = sc_data.nav;
        if (sc_data.hasOwnProperty("dots")) sc_options.dots = sc_data.dots;
        if (sc_data.hasOwnProperty("counter"))
          sc_options.counter = sc_data.counter;
        if (sc_data.hasOwnProperty("autoplay"))
          sc_options.autoplay = 1 == sc_data.autoplay;
        if (sc_data.hasOwnProperty("autoplay-timeout")) {
          sc_options.autoplayTimeout = sc_data["autoplay-timeout"];
        } else if (sc_data.hasOwnProperty("autoplayTimeout")) {
          sc_options.autoplayTimeout = sc_data.autoplayTimeout;
        }
        var update_owl_timer = null;
        var options = $.extend(
          {
            responsive: {
              0: { items: 1 },
              690: { items: 2 },
              1000: { items: 3 },
              1300: { items: 4 },
            },
            margin: 0,
            dotsEach: 1,
            smartSpeed: 400,
            autoplay: !1,
            autoplayTimeout: 5000,
            onResize: function () {
              var $carousel = $(this.$element);
              $carousel.removeClass(
                (
                  $products
                    .attr("class")
                    .match(/(product-columns-\d+|mobile-columns-\d+)/gi) || []
                ).join(" ")
              );
              $carousel.addClass("product-columns-" + this.settings.items);
              if (
                this.options.hasOwnProperty("responsive") &&
                this.options.responsive.hasOwnProperty("0") &&
                this.options.responsive[0].hasOwnProperty("items")
              ) {
                $carousel.addClass(
                  "mobile-columns-" + this.options.responsive[0].items
                );
              }
            },
            onInitialized: function () {
              var itemClass = this.options.itemClass;
              $(this.$element)
                .find("." + itemClass)
                .each(function (index) {
                  var $liproduct = $(this).children("li");
                  if (!$liproduct.length) {
                    return;
                  }
                  var attrs = $liproduct.attr();
                  if (attrs.hasOwnProperty("style")) {
                    delete attrs.style;
                  }
                  if (attrs.hasOwnProperty("class")) {
                    $(this)
                      .addClass(attrs.class)
                      .removeClass("animated av5-fadeInUp");
                    delete attrs.class;
                  }
                  $(this).attr(attrs);
                  $liproduct.children().appendTo($(this));
                  $liproduct.remove();
                  $(this)
                    .find(".owl-carousel")
                    .each(function () {
                      var owl = $(this)
                        .removeClass("owl-drag")
                        .data("owl.carousel");
                      if (owl) {
                        var settings = $.extend({}, owl.settings, {
                          mouseDrag: !1,
                          touchDrag: !1,
                          pullDrag: !1,
                        });
                        $(this)
                          .trigger("destroy.owl.carousel")
                          .owlCarousel(settings);
                      }
                    });
                });
              if ($this.data("counter")) {
                if (!this.$element.children(".owl-counter").length) {
                  this.$element.append(
                    '<div class="owl-counter"><span class="owl-conter-current"></span><span class="owl-conter-max"></span></div>'
                  );
                }
                var max_slides,
                  current_slide,
                  max_items = this.items().length,
                  display_items = this.settings.items,
                  current_item = this.current();
                if (this.settings.loop) {
                  current_item =
                    (current_item - Math.ceil(max_items / 2)) % max_items || 0;
                }
                if ("pages" == $this.data("countertype")) {
                  current_slide = current_item / display_items + 1;
                  max_slides = Math.ceil(max_items / display_items);
                  if (0.5 < current_slide % 1) {
                    current_slide = Math.ceil(current_slide);
                  } else {
                    current_slide = Math.floor(current_slide);
                  }
                  if (max_items <= current_item + display_items) {
                    current_slide = max_slides;
                  }
                } else {
                  current_slide = display_items + current_item;
                  max_slides = max_items;
                }
                this.$element
                  .children(".owl-counter")
                  .find(".owl-conter-current")
                  .text(current_slide);
                this.$element
                  .children(".owl-counter")
                  .find(".owl-conter-max")
                  .text(max_slides);
              }
              if ("function" === typeof this.options.onResize) {
                this.options.onResize.call(this);
              }
            },
            onTranslate: function () {
              $(this.$element).addClass("moving");
            },
            onTranslated: function () {
              $(this.$element).removeClass("moving");
              if (update_owl_timer) {
                clearTimeout(update_owl_timer);
              }
              var child_owl = $(this.$element).find(
                ".owl-item.product .owl-carousel"
              );
              update_owl_timer = setTimeout(function () {
                child_owl.trigger("refresh.owl.carousel");
              }, 1000);
            },
            onChanged: function (e) {
              if ($this.data("counter")) {
                var max_slides,
                  current_slide,
                  max_items = this.items().length,
                  display_items = this.settings.items,
                  current_item = this.current();
                if (this.settings.loop) {
                  current_item =
                    (current_item - Math.ceil(max_items / 2)) % max_items || 0;
                }
                if ("pages" == $this.data("countertype")) {
                  current_slide = current_item / display_items + 1;
                  max_slides = Math.ceil(max_items / display_items);
                  if (0.5 < current_slide % 1) {
                    current_slide = Math.ceil(current_slide);
                  } else {
                    current_slide = Math.floor(current_slide);
                  }
                  if (max_items <= current_item + display_items) {
                    current_slide = max_slides;
                  }
                } else {
                  current_slide = display_items + current_item;
                  max_slides = max_items;
                  if (current_slide > max_slides) {
                    current_slide -= max_slides;
                  }
                }
                this.$element
                  .children(".owl-counter")
                  .find(".owl-conter-current")
                  .text(current_slide);
                this.$element
                  .children(".owl-counter")
                  .find(".owl-conter-max")
                  .text(max_slides);
              }
            },
          },
          av5_JS.owlcarousel_shortcode,
          sc_options
        );
        $products.owlCarousel(options);
      });
  });
  $(document).on("vc-full-width-row-single", function (e, data) {
    data.el.find(".owl-carousel").trigger("refresh.owl.carousel");
  });
  if (av5_shopJS.quickview) {
    $("body").on("click", ".av5-quickview-button", function (event) {
      event.preventDefault();
      if ($(this).data("product_id")) {
        if (!$(".av5-quickview__wrapper").length) {
          $("body").append(
            $("<div>").attr({ class: "av5-quickview__wrapper woocommerce" })
          );
        }
        $(".av5-quickview__wrapper_null").av5overlay({
          object: ".av5-quickview__wrapper",
        });
        $(".av5-quickview__wrapper").on("show.overlay", function (e, data) {
          var $this = $(this),
            $this_modal = $this.closest(".av5-overlay-modal");
          if (!$this_modal.hasClass("av5-overlay-quickview-small")) {
            $this_modal.addClass("av5-overlay-quickview-small");
          }
          $(window)
            .on("resize", function () {
              $this_modal.css({
                left:
                  "calc( 50% - " +
                  av5_shopJS.quickview_settings.width / 2 +
                  "px)",
                top:
                  "calc( 50% - " +
                  av5_shopJS.quickview_settings.height / 2 +
                  "px)",
              });
            })
            .trigger("resize");
          $this_modal.css({
            left: "50%",
            top:
              "calc( 50% - " + av5_shopJS.quickview_settings.height / 2 + "px)",
            width: 200,
            height: av5_shopJS.quickview_settings.height + "px",
          });
          var _left = parseInt(
            window.innerWidth / 2 - av5_shopJS.quickview_settings.width / 2
          );
          var _width = parseInt(av5_shopJS.quickview_settings.width);
          $this_modal.velocity(
            { width: _width, left: _left },
            { duration: 600, easing: "easeOutQuint" }
          );
          $(".slideout_close").on("click", function () {
            $this.trigger("hide.overlay");
          });
          $this.html($("<div>").attr({ class: "line-preloader" }));
          $.post({
            url: av5_shopJS.wc_ajax_url
              .toString()
              .replace("%%endpoint%%", "quickview"),
            data: data,
            success: function (data) {
              if (data) {
                var loadQuickviewContent = function () {
                  $this.html(data);
                  $this.trigger("loaded.quickview");
                  $("body").trigger("loaded.quickview", $this);
                  $("div.product div.images").addClass(
                    "animated av5-fadeInLeft"
                  );
                  $(".quickview-summary-wrapper").addClass(
                    "animated av5-fadeInUp"
                  );
                  $(".av5-overlay-quickview-small")
                    .find(".quick-view__button-sticky")
                    .find(".single_add_to_cart_button.button")
                    .addClass("animated fadeInUp");
                };
                if ($(".line-preloader")) {
                  $(".line-preloader").velocity(
                    { opacity: 0 },
                    {
                      duration: 300,
                      complete: function () {
                        loadQuickviewContent();
                      },
                    }
                  );
                } else {
                  loadQuickviewContent();
                }
              } else {
                $this.trigger("hide.overlay");
              }
            },
            error: function () {
              $this.trigger("hide.overlay");
            },
          });
        });
        $(".av5-quickview__wrapper").on("hided.overlay", function () {
          $(this).find(".owl-carousel").trigger("destroy.owl.carousel");
          $(this).html("");
        });
        $(".av5-quickview__wrapper").trigger("show.overlay", $(this).data());
      }
    });
    $("body").on("loaded.quickview", function (e, object) {
      var $object = $(object);
      if (!object || !$object.length) {
        return !1;
      }
      $("body").trigger("init_shortcode", [$object]);
      $object.find(".av5-product-gallery").av5_product_gallery();
      $object.find("[data-av5-overlay], .av5-overlay-button").hide();
      $object.find(".variations_form").each(function () {
        $(this).wc_variation_form();
      });
      $("body").one("added_to_cart", function () {
        $(".av5-overlay-modal.av5-open .av5-overlay-wrap")
          .children()
          .trigger("hide.overlay");
      });
      if ("function" === typeof _ct_woo_color_swatch_document_ready) {
        _ct_woo_color_swatch_document_ready();
      }
      if ("function" === typeof $.fn.tawcvs_variation_swatches_form) {
        $object.find(".variations_form").tawcvs_variation_swatches_form();
      }
      if ("function" === typeof $.yith_wccl) {
        var attr =
          $object
            .find(
              ".quickview-popup-container[data-yith_attr], .product[data-yith_attr]"
            )
            .eq(0)
            .data("yith_attr") || [];
        $.yith_wccl(attr);
      }
    });
  }
  $(window).on("load", function () {
    $("div.wishlist_products_counter")
      .off("mouseleave.hoverIntent")
      .on("mouseleave.hoverIntent", function () {
        var a = $(this).find(".wishlist_products_counter_wishlist");
        a.removeClass("opened").velocity(
          { opacity: 0, top: 70 },
          {
            display: "none",
            duration: 200,
            easing: "easeOut",
            complete: function () {
              $(this).removeClass("opened");
            },
          }
        );
      });
    $("div.wishlist_products_counter")
      .off("mouseenter.hoverIntent")
      .on("mouseenter.hoverIntent", function () {
        var a = $(this).find(".wishlist_products_counter_wishlist");
        if (
          a.hasClass("opens") ||
          a.hasClass("opened") ||
          a.hasClass("closes")
        ) {
          return;
        }
        a.show();
        var ao = a.offset(),
          al = ao.left,
          aw = a.outerWidth(),
          la = parseFloat(a.css("left")),
          aol = al - la,
          _la = la,
          ww = $(window).width(),
          os = 50,
          r = ww - aol - aw - os,
          l = os - aol;
        if (ww <= aw) {
          _la = -1 * aol;
        } else if (0 > ww - (aw + os * 2)) {
          _la = (ww - aw) / 2 - aol;
        } else if (0 < l) {
          _la = l;
        } else if (0 > r) {
          _la = r;
        }
        a.stop(!0, !0)
          .show()
          .css({ left: _la, opacity: 0 })
          .addClass("opens")
          .velocity(
            { opacity: 1, top: 32 },
            {
              display: "block",
              duration: 300,
              easing: "easeOut",
              complete: function () {
                a.removeClass("opens").addClass("opened");
              },
            }
          );
      });
  });
})(jQuery);
jQuery(function ($) {
  "use strict";
  $("body").trigger("init_shortcode.productcarousel");
  (function () {
    if ($(".av5-products-filter-wrap").length) {
      var toggle_filter_elem = function (show) {
        return $(this).each(function () {
          var $this = $(this);
          show = "undefined" === typeof show ? !$this.hasClass("open") : show;
          if (show) {
            $this
              .addClass("open")
              .velocity(
                { opacity: 1 },
                { display: "block", duration: 200, easing: "easeIn" }
              );
            $(".av5-products-filter-overlay").show();
          } else {
            $this
              .removeClass("open")
              .velocity(
                { opacity: 0 },
                { display: "none", duration: 200, easing: "easeOut" }
              );
            $(".av5-products-filter-overlay").remove();
          }
        });
      };
      if ($(".av5-products-filter-wrap.single-drop").length > 0) {
        $(
          ".av5-products-filter-wrap .av5-products-filter-single .av5-products-filter-title"
        ).on("click touchstart", function (e) {
          e.preventDefault();
          var filter = $(this).closest(".av5-products-filter-single").eq(0),
            filter_area = filter.find(".av5-products-filter-area-single");
          toggle_filter_elem.call(filter_area);
        });
      } else {
        if (!is_touch_device()) {
          $(".av5-products-filter-wrap .av5-products-filter").hoverIntent(
            function () {
              toggle_filter_elem.call(
                $(this).find(".av5-products-filter-area"),
                !0
              );
            },
            function () {
              toggle_filter_elem.call(
                $(this).find(".av5-products-filter-area"),
                !1
              );
            }
          );
        }
        $("body").on(
          "click touchstart",
          ".av5-products-filter-overlay",
          function () {
            toggle_filter_elem.call($(".av5-products-filter-area:visible"), !1);
          }
        );
        $(
          ".av5-products-filter-wrap .av5-products-filter .av5-products-filter-title"
        ).on("click touchstart", function (e) {
          e.preventDefault();
          var filter = $(this).closest(".av5-products-filter").eq(0),
            filter_area = filter.find(".av5-products-filter-area");
          if (!filter_area.hasClass("open")) {
            if (
              is_touch_device() &&
              !$(".av5-products-filter-overlay").length
            ) {
              $("body").append(
                $("<div>").attr({ class: "av5-products-filter-overlay" })
              );
            }
            toggle_filter_elem.call(filter_area, !0);
          }
        });
      }
      $("body").on(
        "change",
        ".av5-products-filter-wrap .av5-products-filter-element",
        function () {
          var elements = $(this)
              .closest(".av5-products-filter")
              .eq(0)
              .find('[name="' + $(this).attr("name") + '"]'),
            element_all = elements.filter('[value=""]'),
            elements = elements.filter('[value!=""]');
          if (!$(this).val() && $(this).is(":checked")) {
            elements.prop("checked", !1);
          } else {
            element_all.prop("checked", !elements.filter(":checked").length);
            if (elements.length === elements.filter(":checked").length) {
              element_all.prop("checked", !0);
              elements.prop("checked", !1);
            }
          }
          return !0;
        }
      );
    }
  })();
  (function () {
    if (
      $(".av5-products-filter-widget-wrap, .av5-products-filter-slideout-wrap")
        .length
    ) {
      $(".av5-products-filter-widget-wrap .av5-products-filter-area").each(
        function () {
          $(this).before($("<i>").attr("class", "av5_toggle_icon"));
        }
      );
      $(".av5-products-filter-slideout-wrap  .av5-products-filter-area").each(
        function () {
          $(this).before($("<i>").attr("class", "av5_toggle_icon"));
        }
      );
      if (is_touch_device()) {
        $(".av5-products-filter-slideout-wrap .av5-products-filter-area").each(
          function () {
            $(this).before($("<i>").attr("class", "av5_toggle_icon"));
          }
        );
      }
      $("body").on(
        "click",
        ".av5-products-filter-widget-wrap i.av5_toggle_icon, .av5-products-filter-slideout-wrap i.av5_toggle_icon",
        function () {
          var $this = $(this);
          $this.toggleClass("opened");
          var $filter = $this.siblings(".av5-products-filter-area");
          $filter["slide" + ($filter.is(":visible") ? "Up" : "Down")](400);
        }
      );
      $("body").on(
        "change",
        ".av5-products-filter-widget-wrap .av5-products-filter-element, .av5-products-filter-slideout-wrap .av5-products-filter-element",
        function () {
          var elements = $(this)
              .closest(".av5-products-filter")
              .eq(0)
              .find('[name="' + $(this).attr("name") + '"]'),
            element_all = elements.filter('[value=""]'),
            elements = elements.filter('[value!=""]');
          if (!$(this).val() && $(this).is(":checked")) {
            elements.prop("checked", !1);
          } else {
            element_all.prop("checked", !elements.filter(":checked").length);
            if (elements.length === elements.filter(":checked").length) {
              element_all.prop("checked", !0);
              elements.prop("checked", !1);
            }
          }
          return !0;
        }
      );
    }
  })();
  (function () {
    if ($(".reveal--on").length) {
      var options = {
        handler: function (direction) {
          var $this;
          if (this.hasOwnProperty("element")) {
            $this = $(this.element);
          } else {
            $this = $(this);
          }
          if (!$this.hasClass("animated")) {
            $this.css("visibility", "visible");
            if ($(".reveal-animation--fadeinbottom").length) {
              $this.addClass("animated  av5-fadeInUp");
            } else {
              $this.addClass("animated  fadeIn");
            }
          }
        },
        offset: "90%",
      };
      $("ul.products li").waypoint(options);
      $("#primary .page-layout .products").on(
        "append.infiniteScroll",
        function (event, response, path, items) {
          $(items).addClass("infiniteScroll-loaded");
          $("ul.products li.infiniteScroll-loaded").waypoint(options);
        }
      );
    }
  })();
  (function () {
    if (
      !$.fn.hasOwnProperty("infiniteScroll") ||
      0 >= $("#primary .page-layout .products").length ||
      0 >= $("nav.woocommerce-pagination .next").length
    ) {
      return;
    }
    if ("infinitescroll" === av5_shopJS.pagination_type) {
      var loader = $("<div>")
        .attr("class", "infinite-scroll-request")
        .html(av5_shopJS.pagination_infinity_loader);
      var last = $("<div>")
        .attr("class", "infinite-scroll-last")
        .html(av5_shopJS.pagination_message);
      var status = $("<div>")
        .attr({ class: "infiniteScroll-load-status", style: "display: none;" })
        .append(loader)
        .append(last);
      $("nav.woocommerce-pagination").append(status);
      $("#primary .page-layout .products")
        .infiniteScroll({
          path: "nav.woocommerce-pagination .next",
          append: "#primary .page-layout .products > li",
          hideNav: "nav.woocommerce-pagination .page-numbers",
          status: "nav.woocommerce-pagination .infiniteScroll-load-status",
          history: !1,
          elementScroll: !1,
        })
        .on("load.infiniteScroll", function (event, response) {
          var agent = navigator.userAgent;
          if (
            (agent.indexOf("Safari") != -1 && agent.indexOf("Chrome") == -1) ||
            (agent.indexOf("iPad") != -1 && agent.indexOf("Chrome") == -1)
          ) {
            $(response).find("img").attr("srcset", null);
          }
        });
    } else if ("loadmore" === av5_shopJS.pagination_type) {
      var loader = $("<div>")
        .attr("class", "infinite-scroll-request")
        .html(av5_shopJS.pagination_infinity_loader);
      var last = $("<div>")
        .attr("class", "infinite-scroll-last")
        .html(av5_shopJS.pagination_message);
      var status = $("<div>")
        .attr({ class: "infiniteScroll-load-status", style: "display: none;" })
        .append(loader)
        .append(last);
      var button = $("<a>")
        .attr({ class: "morescroll-button button", href: "#" })
        .html(av5_shopJS.pagination_load_more);
      $("nav.woocommerce-pagination").append(status).append(button);
      $("#primary .page-layout .products")
        .infiniteScroll({
          path: "nav.woocommerce-pagination .next",
          append: "#primary .page-layout .products > li",
          hideNav: "nav.woocommerce-pagination .page-numbers",
          status: "nav.woocommerce-pagination .infiniteScroll-load-status",
          button: "nav.woocommerce-pagination .morescroll-button",
          history: !1,
          elementScroll: !1,
          scrollThreshold: !1,
        })
        .on("request.infiniteScroll", function () {
          button.hide();
        })
        .on("load.infiniteScroll", function (event, response) {
          var agent = navigator.userAgent;
          if (
            (agent.indexOf("Safari") != -1 && agent.indexOf("Chrome") == -1) ||
            (agent.indexOf("iPad") != -1 && agent.indexOf("Chrome") == -1)
          ) {
            $(response).find("img").attr("srcset", null);
          }
        })
        .on("load.infiniteScroll", function (event, response) {
          console.log(response);
        })
        .on("append.infiniteScroll", function () {
          button.show();
        })
        .on("last.infiniteScroll", function () {
          button.remove();
        });
    }
    $("#primary .products").on(
      "append.infiniteScroll",
      function (event, response, path, items) {
        $(items).removeClass("first last");
      }
    );
  })();
  (function () {
    var options = $.extend({ items: 1, lazyLoad: !0 }, av5_shopJS.owlcarousel);
    function init_thumbnails_carousel() {
      $(".av5-carousel-thumbnails-wrapper.owl-carousel").each(function () {
        $(this).owlCarousel(options);
      });
    }
    if ($(".av5-carousel-thumbnails-wrapper").length) {
      init_thumbnails_carousel();
    }
    $("#primary .page-layout .products").on(
      "append.infiniteScroll",
      function (e, i) {
        init_thumbnails_carousel();
      }
    );
  })();
  (function () {
    if (av5_shopJS.product_ajax_addtocart) {
      $("body").on("click", ".single_add_to_cart_button", function (e) {
        var $button = $(this),
          $form = $button.closest("form").eq(0),
          form = {};
        if (
          $button.hasClass("disabled") ||
          $button.is(":disabled") ||
          !$form.length ||
          "post" != $form.attr("method")
        ) {
          return;
        }
        e.preventDefault();
        $button.removeClass("added").addClass("loading");
        if ($button.is("button")) {
          form[$button.attr("name")] = $button.val();
        }
        $form.find("input, select, textarea").each(function () {
          var name_elm = $(this).attr("name"),
            type_elm = $(this).attr("type"),
            value_elm = $(this).val(),
            count = 10,
            ti_merge_value = function (o1, o2) {
              if ("object" === typeof o2) {
                if ("undefined" === typeof o1) {
                  o1 = {};
                }
                for (var i in o2) {
                  if ("" === i) {
                    var j = -1;
                    for (j in o1) {
                      j = j;
                    }
                    j = parseInt(j) + 1;
                    o1[j] = ti_merge_value(o1[i], o2[i]);
                  } else {
                    o1[i] = ti_merge_value(o1[i], o2[i]);
                  }
                }
                return o1;
              } else {
                return o2;
              }
            };
          if ("button" === type_elm) {
            return;
          }
          while (/^(.+)\[([^\[\]]*?)\]$/.test(name_elm) && 0 < count) {
            var n_name = name_elm.match(/^(.+)\[([^\[\]]*?)\]$/);
            if (3 === n_name.length) {
              var _value_elm = {};
              _value_elm[n_name[2]] = value_elm;
              value_elm = _value_elm;
            }
            name_elm = n_name[1];
            count--;
          }
          if ("checkbox" === type_elm || "radio" === type_elm) {
            if ($(this).is(":checked")) {
              if (!value_elm.length && "object" !== typeof value_elm) {
                value_elm = !0;
              }
              form[name_elm] = ti_merge_value(form[name_elm], value_elm);
            }
          } else {
            form[name_elm] = ti_merge_value(form[name_elm], value_elm);
          }
        });
        for (var i in form) {
          if ("add-to-cart" == i) {
            if (!form.hasOwnProperty("product_id")) {
              form.product_id = form[i];
            }
            delete form[i];
            break;
          }
        }
        if (form.hasOwnProperty("undefined")) {
          delete form.undefined;
        }
        $.ajax({
          url: av5_shopJS.wc_ajax_url
            .toString()
            .replace("%%endpoint%%", "av5_add_to_cart"),
          data: form,
          method: "POST",
          dataType: "json",
          success: function (response) {
            if (!response) {
              $button.removeClass("loading");
              return;
            }
            if (response.error && response.product_url) {
              window.location = response.product_url;
              return;
            }
            if (typeof wc_add_to_cart_params !== "undefined") {
              if (wc_add_to_cart_params.cart_redirect_after_add === "yes") {
                window.location = wc_add_to_cart_params.cart_url;
                return;
              }
            }
            $button.removeClass("loading").addClass("added");
            $(document.body).trigger("added_to_cart", [
              response.fragments,
              response.cart_hash,
            ]);
            $(document.body).trigger("av5_added_to_cart", response.fragments);
          },
        });
      });
      var add_to_cart_button_added_timer;
      $("body").on("added_to_cart", function () {
        clearTimeout(add_to_cart_button_added_timer);
        add_to_cart_button_added_timer = setTimeout(function () {
          $(".single_add_to_cart_button.added").removeClass("loading added");
        }, 3000);
      });
    }
  })();
  (function () {
    $("#header.header .header-item.cart > div").hide();
    $("#header.header .header__item.header__item__cart--drop-down").hoverIntent(
      {
        over: function () {
          $(this)
            .children("div:not(.opens):not(.opened)")
            .addClass("opens")
            .velocity(
              { opacity: 1, top: 42 },
              {
                display: "block",
                duration: 200,
                easing: "easeOut",
                complete: function () {
                  $(this).removeClass("opens").addClass("opened");
                },
              }
            );
        },
        out: function () {
          $(this)
            .children("div")
            .removeClass("opened")
            .velocity(
              { opacity: 0, top: 70 },
              {
                display: "none",
                duration: 300,
                easing: "easeOut",
                complete: function () {
                  $(this).removeClass("opened");
                },
              }
            );
        },
        timeout: 150,
      }
    );
    if ($("#header .header__item.header__item__cart--fullscreen").length) {
      $("#header .header__item.header__item__cart--fullscreen").av5overlay({
        object:
          ".header__item.header__item__cart--fullscreen #av5_woocommerce_mini_cart_drop_down",
      });
    }
    if (
      $("#header .header-right .header__item.header__item__cart--canvas-slide")
        .length
    ) {
      $(
        "#header .header-right .header__item.header__item__cart--canvas-slide"
      ).av5slideout({
        object:
          ".header-right .header__item.header__item__cart--canvas-slide #av5_woocommerce_mini_cart_drop_down",
        from: "right",
      });
    }
    if (
      $("#header .header-left .header__item.header__item__cart--canvas-slide")
        .length
    ) {
      $(
        "#header .header-left .header__item.header__item__cart--canvas-slide"
      ).av5slideout({
        object:
          ".header-left .header__item.header__item__cart--canvas-slide #av5_woocommerce_mini_cart_drop_down",
        from: "left",
      });
    }
    if ($("#header-mobile .header-right .header__item.cart").length) {
      $("#header-mobile .header-right .header__item.cart").av5slideout({
        object: "#av5_woocommerce_mini_cart_mobile",
        from: "right",
      });
    }
    if ($("#header-mobile .header-left .header__item.cart").length) {
      $("#header-mobile .header-left .header__item.cart").av5slideout({
        object: "#av5_woocommerce_mini_cart_mobile",
        from: "left",
      });
    }
    if ($("body.mini-cart-show-when-added").length > 0) {
      var minicart_ddt = null;
      $("body").on("added_to_cart", function (event, fragments) {
        if (
          $(
            ".header__item.header__item__cart--drop-down #av5_woocommerce_mini_cart_drop_down"
          ).length &&
          $("#header.header").css("display") != "none"
        ) {
          $("#header.header .header-item.cart > div:not(.opens):not(.opened)")
            .addClass("opens")
            .velocity(
              { opacity: 1, top: 42 },
              {
                display: "block",
                duration: 200,
                easing: "easeOut",
                complete: function () {
                  $(this).removeClass("opens").addClass("opened");
                },
              }
            );
          if (minicart_ddt) {
            clearTimeout(minicart_ddt);
          }
          minicart_ddt = setTimeout(function () {
            $("#header.header .header-item.cart > div")
              .removeClass("opened")
              .velocity(
                { opacity: 0, top: 70 },
                {
                  display: "none",
                  duration: 300,
                  easing: "easeOut",
                  complete: function () {
                    $(this).removeClass("opened");
                  },
                }
              );
          }, 3000);
        } else if (
          $(".av5-overlay-modal #av5_woocommerce_mini_cart_drop_down").length
        ) {
          $(
            ".av5-overlay-modal #av5_woocommerce_mini_cart_drop_down:first"
          ).trigger("show.overlay");
        } else if (
          $(".av5-slide-out-modal #av5_woocommerce_mini_cart_drop_down").length
        ) {
          $(
            ".av5-slide-out-modal #av5_woocommerce_mini_cart_drop_down"
          ).trigger("show.slideout");
        } else if (
          $(".av5-slide-out-modal #av5_woocommerce_mini_cart_mobile").length
        ) {
          $(".av5-slide-out-modal #av5_woocommerce_mini_cart_mobile").trigger(
            "show.slideout"
          );
        }
      });
    }
  })();
  (function () {
    $.fn.scrolledPast = function () {
      var scrollPosition = $(window).scrollTop();
      var objEndPos = $(this).offset().top + $(this).outerHeight();
      return scrollPosition <= objEndPos ? !0 : !1;
    };
    var $productBar = $(".product-bar");
    var $cartButton = $(".single_add_to_cart_button");
    var $toTop = $("#toTop");
    var $footerButton = $(".footer-fixed-button");
    var productBar = function () {
      var $fbDialog = $(".fb_dialog");
      if (
        !$cartButton.scrolledPast() &&
        $(document).height() > $(window).height() + $(window).scrollTop() + 400
      ) {
        $productBar.addClass("show");
        $footerButton
          .stop()
          .velocity({ bottom: "65px" }, { duration: 200, queue: !1 });
        $toTop
          .stop()
          .velocity({ bottom: "70px" }, { duration: 200, queue: !1 });
        $fbDialog
          .stop()
          .velocity({ translateY: "-35px" }, { duration: 200, queue: !1 });
      } else {
        $productBar.removeClass("show");
        $footerButton
          .stop()
          .velocity({ bottom: "30px" }, { duration: 200, queue: !1 });
        $toTop
          .stop()
          .velocity({ bottom: "30px" }, { duration: 200, queue: !1 });
        $fbDialog
          .stop()
          .velocity({ translateY: 0 }, { duration: 200, queue: !1 });
      }
    };
    if (
      $productBar.length > 0 &&
      $cartButton.length > 0 &&
      $(window).width() >= 1240
    ) {
      $(window).on("scroll", function () {
        productBar();
      });
      productBar();
    }
  })();
  (function () {
    if (typeof av5_single_product_params === "undefined") {
      return !1;
    }
    var ProductGallery = function ($target, args) {
      this.$target = $target;
      this.$bigCarousel = $target.find(
        ".owl-product-gallery__wrapper, .woocommerce-product-sticky-gallery__wrapper"
      );
      this.$horizontalThumb = $target.find(".owl-product-thumbnail-horizontal");
      this.$verticalThumb = $target.find(".owl-product-thumbnail-vertical");
      this.$images = $(".av5-product-gallery__image", this.$bigCarousel);
      this.$video = $(".av5-product-gallery__video", this.$bigCarousel);
      this.big_active_class = "big-active";
      if (0 === this.$images.length) {
        this.$target.css("opacity", 1);
        return;
      }
      $target.data("product_gallery", this);
      this.owlCarousel_enabled =
        $.isFunction($.fn.owlCarousel) &&
        av5_single_product_params.owlCarousel_enabled &&
        this.$bigCarousel.hasClass("owl-product-gallery__wrapper");
      this.thumb_horizontal_enabled =
        $.isFunction($.fn.owlCarousel) &&
        av5_single_product_params.thumb_horizontal_enabled;
      this.thumb_vertical_enabled =
        $.isFunction($.fn.owlCarousel) &&
        av5_single_product_params.thumb_vertical_enabled;
      this.zoom_enabled =
        $.isFunction($.fn.zoom) &&
        av5_single_product_params.zoom_enabled &&
        !is_touch_device() &&
        1 > this.$target.closest(".av5-quickview__wrapper").length;
      this.photoswipe_enabled =
        typeof PhotoSwipe !== "undefined" &&
        av5_single_product_params.photoswipe_enabled;
      if (args) {
        this.owlCarousel_enabled =
          !1 === args.owlCarousel_enabled ? !1 : this.owlCarousel_enabled;
        this.zoom_enabled = !1 === args.zoom_enabled ? !1 : this.zoom_enabled;
        this.photoswipe_enabled =
          !1 === args.photoswipe_enabled ? !1 : this.photoswipe_enabled;
      }
      if (1 === this.$images.length && 0 === this.$video.length) {
        this.owlCarousel_enabled = !1;
      }
      this.initowlCarousel = this.initowlCarousel.bind(this);
      this.onResetSlidePosition = this.onResetSlidePosition.bind(this);
      this.loadFirstImage = this.loadFirstImage.bind(this);
      this.initZoom = this.initZoom.bind(this);
      this.initZoomForTarget = this.initZoomForTarget.bind(this);
      this.initPhotoswipe = this.initPhotoswipe.bind(this);
      this.openPhotoswipe = this.openPhotoswipe.bind(this);
      if (this.owlCarousel_enabled) {
        if (this.thumb_horizontal_enabled) {
          this.initThumbHorizontal();
        } else {
          this.$horizontalThumb.remove();
        }
        if (this.thumb_vertical_enabled) {
          this.initThumbVertical();
        } else {
          this.$verticalThumb.remove();
        }
        this.initowlCarousel();
        $target.on(
          "woocommerce_gallery_reset_slide_position",
          this.onResetSlidePosition
        );
        $target.on(
          "av5_gallery_reset_slide_position",
          this.onResetSlidePosition
        );
      } else if (
        this.$bigCarousel.hasClass(
          "woocommerce-product-sticky-gallery__wrapper"
        )
      ) {
        this.loadImages();
        this.$target.css("opacity", 1);
        this.$horizontalThumb.remove();
        this.$verticalThumb.remove();
      } else {
        this.loadFirstImage();
        this.$target.css("opacity", 1);
        this.$horizontalThumb.remove();
        this.$verticalThumb.remove();
      }
      if (this.zoom_enabled) {
        this.initZoom();
        $target.on("woocommerce_gallery_init_zoom", this.initZoom);
        $target.on("av5_gallery_init_zoom", this.initZoom);
      }
      if (this.photoswipe_enabled) {
        this.initPhotoswipe();
      }
    };
    ProductGallery.prototype.loadImages = function () {
      var $product_carousel = this.$target,
        $target = this.$bigCarousel;
      $target.find("img").each(function () {
        var $image = $(this);
        if (
          !$image.attr("src") ||
          ($image.data("src") && $image.attr("src") != $image.data("src"))
        ) {
          $image.attr("src", $image.data("src"));
        }
        $image.wrap($("<div>").attr({ class: "owl-item" }));
        $image.css("opacity", 1);
      });
      $product_carousel.css("opacity", 1);
      $target.show().css("opacity", 1);
    };
    ProductGallery.prototype.loadFirstImage = function () {
      var $product_carousel = this.$target,
        $target = this.$bigCarousel,
        $image = $target.find("img").first();
      if (
        $image.hasClass("owl-lazy") &&
        (!$image.attr("src") ||
          ($image.data("src") && $image.attr("src") != $image.data("src")))
      ) {
        $image.attr("src", $image.data("src"));
      }
      $image.wrap($("<div>").attr({ class: "owl-item" }));
      $image.css("opacity", 1);
      $product_carousel.css("opacity", 1);
      var items = $target.find(".owl-item"),
        data = { _items: [] };
      for (var i = 0; i < items.length; i++) {
        data._items.push(items.eq(i));
      }
      $target
        .show()
        .css("opacity", 1)
        .data("owl.carousel", data)
        .addClass("owl-loaded");
    };
    ProductGallery.prototype.initowlCarousel = function () {
      var $product_carousel = this.$target,
        $target = this.$bigCarousel,
        $targetHThumb = this.$horizontalThumb,
        $targetVThumb = this.$verticalThumb,
        gallery = this;
      var options = $.extend(
        {
          items: 1,
          lazyLoad: !0,
          autoplay: !1,
          autoplayTimeout: 5000,
          autoplaySpeed: !1,
          animateOut: !1,
          animateIn: !1,
          loop: !1,
          dots: !1,
          nav: !0,
          video: !0,
          navText: ["prev", "next"],
          onInitialized: function () {
            $product_carousel.css("opacity", 1);
            $target.css("opacity", 1);
          },
          onChanged: function (e) {
            var index = e.item.index;
            $targetHThumb.trigger("to.owl.carousel", [index, 300]);
            $targetHThumb
              .find(".owl-item")
              .removeClass(gallery.big_active_class)
              .eq(index)
              .addClass(gallery.big_active_class);
            $targetVThumb
              .find(".owl-item")
              .removeClass(gallery.big_active_class)
              .eq(index)
              .addClass(gallery.big_active_class);
            gallery.initZoomForTarget(gallery.$images.eq(index));
          },
        },
        av5_single_product_params.owlcarousel
      );
      $target.owlCarousel(options);
    };
    ProductGallery.prototype.initThumbHorizontal = function () {
      var $target = this.$horizontalThumb,
        $targetBCarousel = this.$bigCarousel,
        gallery = this;
      var columns = parseInt($target.data("columns"));
      var options = $.extend(
        {
          items: columns,
          lazyLoad: !0,
          loop: !1,
          dots: !1,
          nav: !1,
          margin: 10,
          onInitialized: function () {
            $.each(this._items, function (index) {
              $(this)
                .removeClass(gallery.big_active_class)
                .on("click", function (e) {
                  e.preventDefault();
                  $targetBCarousel.trigger("to.owl.carousel", [index, 300]);
                });
            });
            this._items[0].addClass(gallery.big_active_class);
            $target.css("opacity", 1);
          },
        },
        av5_single_product_params.thumb_horizontal
      );
      $target.owlCarousel(options);
    };
    ProductGallery.prototype.initThumbVertical = function () {
      var $target = this.$verticalThumb,
        $targetBCarousel = this.$bigCarousel,
        gallery = this;
      $target.each(function () {
        var $this = $(this),
          $items = $this.children();
        $items.each(function () {
          var $this = $(this);
          if ($this.hasClass("owl-lazy")) {
            if ($this.is("img")) {
              if (
                !$this.attr("src") ||
                ($this.data("src") && $this.attr("src") != $this.data("src"))
              ) {
                $this.attr("src", $this.data("src"));
              }
            } else {
              $this.find("img").each(function () {
                var $this = $(this);
                if (
                  !$this.attr("src") ||
                  ($this.data("src") && $this.attr("src") != $this.data("src"))
                ) {
                  $this.attr("src", $this.data("src"));
                }
              });
            }
          }
          if (!$this.hasClass("owl-item")) {
            $this.wrap($("<div>").attr({ class: "owl-item" }));
          }
        });
        $this
          .find(".owl-item")
          .removeClass(gallery.big_active_class)
          .eq(0)
          .addClass(gallery.big_active_class);
        $this.find(".owl-item").each(function (index) {
          $(this).on("click", function (e) {
            e.preventDefault();
            $targetBCarousel.trigger("to.owl.carousel", [index, 300]);
          });
        });
      });
      $target.css("opacity", 1);
    };
    ProductGallery.prototype.onResetSlidePosition = function () {
      this.$bigCarousel.trigger("to.owl.carousel", [0, 300]);
    };
    ProductGallery.prototype.initZoom = function () {
      for (var i = 0; i < this.$images.length; i++) {
        this.initZoomForTarget($(this.$images[i]));
      }
    };
    ProductGallery.prototype.initZoomForTarget = function (zoomTarget) {
      if (!this.zoom_enabled) {
        return !1;
      }
      var galleryWidth = this.$bigCarousel.width(),
        zoomEnabled = !1;
      $(zoomTarget).each(function (index, target) {
        var image = $(target);
        if (image.data("large_image_width") > galleryWidth) {
          zoomEnabled = !0;
          return !1;
        }
      });
      if (zoomEnabled) {
        var zoom_options = $.extend(
          { touch: !1 },
          av5_single_product_params.zoom_options
        );
        zoom_options.url = $(zoomTarget).data("large_image") || !1;
        if ("ontouchstart" in window) {
          zoom_options.on = "click";
        }
        zoomTarget = zoomTarget.closest(".owl-item");
        zoomTarget.trigger("zoom.destroy");
        zoomTarget.zoom(zoom_options);
      }
    };
    ProductGallery.prototype.initPhotoswipe = function () {
      if (this.zoom_enabled && this.$images.length > 0) {
        this.$target.on("click", ".zoomImg", this.openPhotoswipe);
      }
      this.$target.on(
        "click",
        ".av5-product-gallery__image",
        this.openPhotoswipe
      );
    };
    ProductGallery.prototype.getGalleryItems = function () {
      var $slides = this.$images,
        items = [];
      if ($slides.length > 0) {
        $slides.each(function (i, el) {
          var img = $(el),
            large_image_src = img.attr("data-large_image"),
            large_image_w = img.attr("data-large_image_width"),
            large_image_h = img.attr("data-large_image_height"),
            item = {
              src: large_image_src,
              w: large_image_w,
              h: large_image_h,
              title: img.attr("data-caption")
                ? img.attr("data-caption")
                : img.attr("title"),
            };
          items.push(item);
        });
      }
      return items;
    };
    ProductGallery.prototype.openPhotoswipe = function (e) {
      e.preventDefault();
      var pswpElement = $(".pswp")[0],
        items = this.getGalleryItems(),
        eventTarget = $(e.target),
        clicked;
      if (
        eventTarget.is(".woocommerce-product-gallery__trigger") ||
        eventTarget.is(".woocommerce-product-gallery__trigger img")
      ) {
        clicked = this.$bigCarousel.find(".active");
      } else {
        clicked = eventTarget.closest(".owl-item");
      }
      var options = $.extend(
        { index: $(clicked).index() },
        av5_single_product_params.photoswipe_options
      );
      var photoswipe = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        options
      );
      photoswipe.init();
    };
    $.fn.av5_product_gallery = function (args) {
      return $(this).each(function () {
        new ProductGallery($(this), args);
      });
    };
    $.fn.wc_variations_image_update = function (variation) {
      var $form = $(this),
        $product = $form.closest(".product"),
        $product_gallery = $product.find(".images"),
        $gallery_nav = $product.find(
          ".owl-product-gallery__wrapper.owl-loaded"
        ),
        $gallery_sticky_nav = $product.find(
          ".woocommerce-product-sticky-gallery__wrapper"
        ),
        $owl = $gallery_nav.data("owl.carousel");
      if (!$owl) {
        return;
      }
      var first_element = $owl._items[0],
        $product_img = first_element.find("img[data-src]");
      if (
        $gallery_nav.length &&
        $gallery_nav.data("owl.carousel") &&
        variation &&
        variation.image &&
        variation.image.src &&
        variation.image.src.length > 1
      ) {
        var image_exist = !1;
        $product_img.wc_reset_variation_attr("src");
        $product_img.wc_reset_variation_attr("width");
        $product_img.wc_reset_variation_attr("height");
        $product_img.wc_reset_variation_attr("srcset");
        $product_img.wc_reset_variation_attr("sizes");
        $product_img.wc_reset_variation_attr("title");
        $product_img.wc_reset_variation_attr("data-caption");
        $product_img.wc_reset_variation_attr("alt");
        $product_img.wc_reset_variation_attr("data-src");
        $product_img.wc_reset_variation_attr("data-large_image");
        $product_img.wc_reset_variation_attr("data-large_image_width");
        $product_img.wc_reset_variation_attr("data-large_image_height");
        first_element
          .find('img[role="presentation"]')
          .wc_reset_variation_attr("src");
        $.each(
          $gallery_nav.data("owl.carousel")._items,
          function (index, element) {
            if (
              element.find('img[src="' + variation.image.src + '"]').length ||
              element.find('img[data-src="' + variation.image.src + '"]')
                .length ||
              element.find(
                'img[data-large_image="' + variation.image.full_src + '"]'
              ).length
            ) {
              $gallery_nav.trigger("to.owl.carousel", [index, 300]);
              image_exist = !0;
              return !1;
            }
          }
        );
        if (
          !image_exist &&
          variation.image_id != $gallery_nav.data("excludeimagevariation")
        ) {
          $product_img.wc_set_variation_attr("src", variation.image.src);
          $product_img.wc_set_variation_attr("height", variation.image.src_h);
          $product_img.wc_set_variation_attr("width", variation.image.src_w);
          $product_img.wc_set_variation_attr("srcset", variation.image.srcset);
          $product_img.wc_set_variation_attr("sizes", variation.image.sizes);
          $product_img.wc_set_variation_attr("title", variation.image.title);
          $product_img.wc_set_variation_attr(
            "data-caption",
            variation.image.caption
          );
          $product_img.wc_set_variation_attr("alt", variation.image.alt);
          $product_img.wc_set_variation_attr(
            "data-src",
            variation.image.full_src
          );
          $product_img.wc_set_variation_attr(
            "data-large_image",
            variation.image.full_src
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_width",
            variation.image.full_src_w
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_height",
            variation.image.full_src_h
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_height",
            variation.image.full_src_h
          );
          first_element
            .find('img[role="presentation"]')
            .wc_set_variation_attr("src", variation.image.full_src);
          $product_gallery.trigger("woocommerce_gallery_reset_slide_position");
        }
      } else if (
        $gallery_sticky_nav.length &&
        variation &&
        variation.image &&
        variation.image.src &&
        variation.image.src.length > 1
      ) {
        var image_exist = !1;
        $product_img.wc_reset_variation_attr("src");
        $product_img.wc_reset_variation_attr("width");
        $product_img.wc_reset_variation_attr("height");
        $product_img.wc_reset_variation_attr("srcset");
        $product_img.wc_reset_variation_attr("sizes");
        $product_img.wc_reset_variation_attr("title");
        $product_img.wc_reset_variation_attr("data-caption");
        $product_img.wc_reset_variation_attr("alt");
        $product_img.wc_reset_variation_attr("data-src");
        $product_img.wc_reset_variation_attr("data-large_image");
        $product_img.wc_reset_variation_attr("data-large_image_width");
        $product_img.wc_reset_variation_attr("data-large_image_height");
        first_element
          .find('img[role="presentation"]')
          .wc_reset_variation_attr("src");
        $gallery_sticky_nav.find(".owl-item").each(function () {
          var element = $(this);
          if (
            element.find('img[src="' + variation.image.src + '"]').length ||
            element.find('img[data-src="' + variation.image.src + '"]')
              .length ||
            element.find(
              'img[data-large_image="' + variation.image.full_src + '"]'
            ).length
          ) {
            $("html, body")
              .stop(!0, !0)
              .animate(
                { scrollTop: element.offset().top - sticky_top_offset(30) },
                1000
              );
            image_exist = !0;
            return !1;
          }
        });
        if (
          !image_exist &&
          variation.image_id !=
            $gallery_sticky_nav.data("excludeimagevariation")
        ) {
          $product_img.wc_set_variation_attr("src", variation.image.src);
          $product_img.wc_set_variation_attr("height", variation.image.src_h);
          $product_img.wc_set_variation_attr("width", variation.image.src_w);
          $product_img.wc_set_variation_attr("srcset", variation.image.srcset);
          $product_img.wc_set_variation_attr("sizes", variation.image.sizes);
          $product_img.wc_set_variation_attr("title", variation.image.title);
          $product_img.wc_set_variation_attr(
            "data-caption",
            variation.image.caption
          );
          $product_img.wc_set_variation_attr("alt", variation.image.alt);
          $product_img.wc_set_variation_attr(
            "data-src",
            variation.image.full_src
          );
          $product_img.wc_set_variation_attr(
            "data-large_image",
            variation.image.full_src
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_width",
            variation.image.full_src_w
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_height",
            variation.image.full_src_h
          );
          $product_img.wc_set_variation_attr(
            "data-large_image_height",
            variation.image.full_src_h
          );
          first_element
            .find('img[role="presentation"]')
            .wc_set_variation_attr("src", variation.image.full_src);
          $("html, body")
            .stop(!0, !0)
            .animate(
              { scrollTop: first_element.offset().top - sticky_top_offset(30) },
              1000
            );
          $product_gallery.trigger("woocommerce_gallery_reset_slide_position");
        }
      } else {
        $product_img.wc_reset_variation_attr("src");
        $product_img.wc_reset_variation_attr("width");
        $product_img.wc_reset_variation_attr("height");
        $product_img.wc_reset_variation_attr("srcset");
        $product_img.wc_reset_variation_attr("sizes");
        $product_img.wc_reset_variation_attr("title");
        $product_img.wc_reset_variation_attr("data-caption");
        $product_img.wc_reset_variation_attr("alt");
        $product_img.wc_reset_variation_attr("data-src");
        $product_img.wc_reset_variation_attr("data-large_image");
        $product_img.wc_reset_variation_attr("data-large_image_width");
        $product_img.wc_reset_variation_attr("data-large_image_height");
        first_element
          .find('img[role="presentation"]')
          .wc_reset_variation_attr("src");
        $product_gallery.trigger("woocommerce_gallery_reset_slide_position");
      }
    };
    $(".av5-product-gallery").av5_product_gallery();
  })();
  (function () {
    if ($(".woocommerce.single-product")) {
      if ($(".av5-product-gallery-sticky").length > 0) {
        $("div.product div.images").addClass("animated");
        $(".summary-right, .summary-left").addClass("animated av5-fadeIn");
        $("div.product .product_title, div.product h1.product_title").addClass(
          "animated fadeIn"
        );
        $("div.product p.price").addClass("animated fadeIn");
      } else if ($(".product_layout_v5").length > 0) {
        $("div.product div.images").addClass("animated");
        $(".summary-right").addClass("animated av5-fadeInRight");
        $("div.product .product_title, div.product h1.product_title").addClass(
          "animated av5-fadeIn"
        );
        $("div.product p.price").addClass("animated av5-fadeIn");
      } else {
        $("div.product div.images").addClass("animated");
        $(".summary-right, .summary-left").addClass("animated av5-fadeInUp");
        $("div.product .product_title, div.product h1.product_title").addClass(
          "animated fadeInUp"
        );
        $("div.product p.price").addClass("animated fadeInUp");
      }
      $(
        ".thumbnails-carousel-thumbs-left .av5-product-gallery .owl-product-gallery__wrapper.owl-loaded .owl-item.active > img"
      ).on("load", function () {
        var prod_gallery_height = $(
          ".av5-product-gallery .owl-product-gallery__wrapper.owl-loaded .owl-item.active"
        ).height();
        if (
          prod_gallery_height > 1 &&
          $(".owl-product-thumbnail-vertical").height() < prod_gallery_height
        ) {
          $(".owl-product-thumbnail-vertical").css({
            "min-height": prod_gallery_height,
            height: "auto",
          });
        } else {
          $(".owl-product-thumbnail-vertical").css("height", "100%");
        }
      });
      var vertical_thumbs_position = function () {
        if (
          $(
            ".thumbnails-carousel-thumbs-left .av5-product-gallery .owl-product-gallery__wrapper.owl-loaded .owl-item.active > img"
          ).length > 0
        ) {
          var prod_gallery_height = $(
            ".av5-product-gallery .owl-product-gallery__wrapper.owl-loaded .owl-item.active"
          ).height();
          if (prod_gallery_height > 1) {
            $(".owl-product-thumbnail-vertical").css({
              "min-height": prod_gallery_height,
              height: "auto",
            });
          } else {
            $(".owl-product-thumbnail-vertical").css("height", "100%");
          }
        }
      };
      $(window)
        .on("resize", function () {
          setTimeout(function () {
            vertical_thumbs_position();
          }, 1000);
          vertical_thumbs_position();
        })
        .trigger("resize");
    }
  })();
  (function () {
    if ($("form.lost_reset_password").length) {
      $(".lost_reset_password").off("submit");
      $("form.lost_reset_password").validate({
        submitHandler: function (form) {
          $(form).find('button[type="submit"]').prop("disabled", !0);
          form.trigger("submit");
        },
        rules: { user_login: "required" },
      });
    }
    if ($("form.login").length) {
      $("form.login").each(function () {
        $(this).validate({
          submitHandler: function (form) {
            var $form = $(form),
              wrap = $form.closest(".av5-wc-login-wrapper").eq(0);
            $form
              .find('button[type="submit"]')
              .prop("disabled", !0)
              .addClass("av5-loading-ajax");
            var formData = $form.formData();
            if (formData.hasOwnProperty("woocommerce-login-nonce")) {
              formData["av5_woocommerce-login-nonce"] =
                formData["woocommerce-login-nonce"];
              delete formData["woocommerce-login-nonce"];
            }
            if (formData.hasOwnProperty("_wpnonce")) {
              formData.av5__wpnonce = formData._wpnonce;
              delete formData._wpnonce;
            }
            wrap.find(".woocommerce-error").remove();
            $.ajax({
              url: av5_shopJS.wc_ajax_url
                .toString()
                .replace("%%endpoint%%", "login"),
              data: formData,
              method: "POST",
              dataType: "json",
              success: function (response) {
                $form
                  .find('button[type="submit"]')
                  .prop("disabled", !1)
                  .removeClass("av5-loading-ajax");
                if (response) {
                  if (response.success) {
                    window.location = response.data;
                  } else {
                    if (response.hasOwnProperty("data")) {
                      if (wrap.find(".woocommerce-error").length) {
                        wrap
                          .find(".woocommerce-error")
                          .replaceWith(response.data);
                      } else {
                        wrap.append(response.data);
                      }
                    } else {
                      window.location.reload();
                    }
                  }
                } else {
                  window.location.reload();
                }
              },
            });
          },
          rules: { username: "required", password: "required" },
          messages: av5_shopJS.validation_login,
        });
      });
    }
    if ($("form.register").length) {
      $("form.register").each(function () {
        $(this).validate({
          submitHandler: function (form) {
            var $form = $(form),
              wrap = $form.closest(".av5-wc-login-wrapper").eq(0);
            $form
              .find('button[type="submit"]')
              .prop("disabled", !0)
              .addClass("av5-loading-ajax");
            var formData = $form.formData();
            if (formData.hasOwnProperty("woocommerce-register-nonce")) {
              formData["av5_woocommerce-register-nonce"] =
                formData["woocommerce-register-nonce"];
              delete formData["woocommerce-register-nonce"];
            }
            if (formData.hasOwnProperty("_wpnonce")) {
              formData.av5__wpnonce = formData._wpnonce;
              delete formData._wpnonce;
            }
            $.ajax({
              url: av5_shopJS.wc_ajax_url
                .toString()
                .replace("%%endpoint%%", "register"),
              data: formData,
              method: "POST",
              dataType: "json",
              success: function (response) {
                $form
                  .find('button[type="submit"]')
                  .prop("disabled", !1)
                  .removeClass("av5-loading-ajax");
                if (response) {
                  if (response.success) {
                    window.location = response.data;
                  } else {
                    if (response.hasOwnProperty("data")) {
                      if (wrap.find(".woocommerce-error").length) {
                        wrap
                          .find(".woocommerce-error")
                          .replaceWith(response.data);
                      } else {
                        wrap.append(response.data);
                      }
                    } else {
                      window.location.reload();
                    }
                  }
                } else {
                  window.location.reload();
                }
              },
            });
          },
          rules: { email: { required: !0, email: !0 }, password: "required" },
          messages: av5_shopJS.validation_register,
        });
      });
    }
  })();
  (function () {
    $(".summary-fixed-scrolling").each(function () {
      var $this = $(this),
        $window = $(window),
        $scrollto = $(".woocommerce-page div.product .product-info-background"),
        $gallery = $scrollto.find(".av5-product-gallery-sticky");
      function update() {
        var scrollTop = $window.scrollTop(),
          _height = 0,
          $this_par_top = $this.parent().offset().top,
          $scrollto_h =
            $scrollto.offset().top + $scrollto.height() - $this.outerHeight(),
          $galleryHeight = $gallery.outerHeight();
        if (
          $(window).width() < 1024 ||
          $galleryHeight < $this.outerHeight() + 200
        ) {
          $this.removeClass("_static").removeClass("_fixed");
          $this.css({ top: "" });
          return;
        }
        if ($("header.sticky").length > 0)
          _height += $("header.sticky").height();
        if ($("#wpadminbar").length > 0) _height += $("#wpadminbar").height();
        if (scrollTop >= $scrollto_h - _height) {
          $this.addClass("_static").removeClass("_fixed");
          $this.css({ top: "auto" });
          return;
        }
        $this
          .removeClass("_static")
          .toggleClass("_fixed", scrollTop + _height >= $this_par_top);
        if (scrollTop + _height >= $this_par_top) {
          $this.css({ top: _height });
        } else {
          $this.css({ top: "" });
        }
      }
      update();
      $(window).on("scroll", function () {
        requestAnimationFrame(update);
      });
      $(window).on("resize", function () {
        requestAnimationFrame(update);
      });
    });
  })();
  (function () {
    $("ul.products.reveal-animation--fadein").each(function () {
      function set_index() {
        var $this = $(this),
          i = 1,
          colm_i = parseInt(
            (($this.attr("class") || "").match(/product-columns-(\d+)/i) || [
              "",
              "4",
            ])[1]
          ),
          $li = $this.children("li");
        $li.each(function () {
          $(this).addClass("product-num-" + i);
          i++;
          if (i > colm_i) {
            i = 1;
          }
        });
      }
      $(this).on("append.infiniteScroll", set_index);
      set_index.call(this);
    });
  })();
  (function () {
    $("body")
      .on("init", ".wc-tabs-wrapper, .woocommerce-tabs", function () {
        var $tabs = $(this).find(".wc-tabs, ul.tabs").first();
        $tabs.append($("<div>").attr("class", "tab-slide"));
      })
      .off("click", ".wc-tabs li a, ul.tabs li a")
      .on("click", ".wc-tabs li a, ul.tabs li a", function (e) {
        e.preventDefault();
        var $tab = $(this);
        var $tabs_wrapper = $tab.closest(".wc-tabs-wrapper, .woocommerce-tabs");
        var $tabs = $tabs_wrapper.find(".wc-tabs, ul.tabs");
        var $tabli = $tab.closest("li");
        var $slide = $tabs.find(".tab-slide");
        $tabs.find("li").removeClass("active");
        $tabli.addClass("active");
        if ($tab.closest(".woocommerce-Tabs-panel-heading").length) {
          $tabs = $tabs_wrapper.find(".wc-tabs, ul.tabs").first();
          $tabli = $tabs
            .find('a[href="' + $tab.attr("href") + '"]')
            .closest("li");
          $tabs.find("li").removeClass("active");
          $tabli.addClass("active");
        } else {
          var $tab_content = $tabs_wrapper.find($tab.attr("href"));
          $tab_content
            .closest(".woocommerce-Tabs-panel-container")
            .eq(0)
            .find(".woocommerce-Tabs-panel-heading > li")
            .addClass("active");
        }
        $slide.css({
          width: $tabli.outerWidth(),
          left:
            $tabli.position().left +
            parseFloat($tabli.css("margin-left").replace(/[^0-9.,-]/g, "")),
        });
        var $tab_content = $tabs_wrapper.find($tab.attr("href"));
        var $otabs_content = $tab_content
          .closest(".woocommerce-Tabs-panel-container")
          .eq(0)
          .siblings(".woocommerce-Tabs-panel-container")
          .find(".wc-tab, .panel:not(.panel .panel)");
        var $prev_tab_content = $otabs_content.filter(":visible");
        if ($prev_tab_content.length) {
          $prev_tab_content.stop(!0, !0).fadeOut(300, function () {
            $otabs_content.removeClass("current").hide();
            $tab_content
              .addClass("current")
              .stop(!0, !0)
              .fadeIn(300, function () {
                $otabs_content.hide();
                $("body").trigger("update.niceScroll");
              });
          });
        } else {
          $otabs_content.hide();
          $tab_content
            .addClass("current")
            .stop(!0, !0)
            .fadeIn(300, function () {
              $otabs_content.hide();
              $("body").trigger("update.niceScroll");
            });
        }
      });
    $(window).on("resize", function () {
      $(".wc-tabs-wrapper, .woocommerce-tabs").each(function () {
        var $tabs = $(this).find(".wc-tabs, ul.tabs").first();
        var $tab = $tabs.find("li.active");
        var $slide = $tabs.find(".tab-slide");
        $slide.css({
          width: $tab.outerWidth(),
          left:
            $tab.position().left +
            parseFloat($tab.css("margin-left").replace(/[^0-9.,-]/g, "")),
        });
      });
    });
    $("body")
      .on("click", "#respond p.stars a", function () {
        $(this)
          .closest(".comment-form-rating")
          .find(".av5-reviews-error-field")
          .remove();
      })
      .off("click", "#respond #submit")
      .on("click", "#respond #submit", function () {
        var $rating = $(this).closest("#respond").find("#rating"),
          rating = $rating.val();
        if (
          $rating.length > 0 &&
          !rating &&
          wc_single_product_params.review_rating_required === "yes"
        ) {
          if (!$rating.next(".av5-reviews-error-field").length) {
            $rating.after($("<div>").attr("class", "av5-reviews-error-field"));
          }
          $rating
            .next(".av5-reviews-error-field")
            .text(wc_single_product_params.i18n_required_rating_text);
          return !1;
        }
      });
    $("body")
      .off("click", ".av5-tabs .av5-tabs-list a")
      .on("click", ".av5-tabs .av5-tabs-list a", function (e) {
        e.preventDefault();
        var $tab = $(this);
        var $tabs_wrapper = $tab.closest(".av5-tabs");
        var $tabs = $tabs_wrapper.find(".av5-tabs-list");
        var $tabli = $tab.closest("a");
        $tabs.find("a").removeClass("active");
        $tabli.addClass("active");
        var $tab_content = $tabs_wrapper.find($tab.attr("href"));
        var $otabs_content = $tab_content.siblings(".tab-panel");
        var $prev_tab_content = $otabs_content.filter(":visible");
        if ($prev_tab_content.length) {
          $prev_tab_content.stop(!0, !0).fadeOut(300, function () {
            $otabs_content.removeClass("current").hide();
            $tab_content
              .addClass("current")
              .stop(!0, !0)
              .fadeIn(300, function () {
                $otabs_content.hide();
              });
          });
        } else {
          $otabs_content.hide();
          $tab_content
            .addClass("current")
            .stop(!0, !0)
            .fadeIn(300, function () {
              $otabs_content.hide();
            });
        }
      });
    $("body").on("init", ".wc-tabs-wrapper, .woocommerce-tabs", function () {
      $(".wc-tab, .woocommerce-tabs .panel:not(.panel .panel)").hide();
      var hash = window.location.hash;
      var url = window.location.href;
      var $tabs = $(this).find(".wc-tabs, ul.tabs").first();
      if (1 >= $tabs.children("li").length) {
        $(this).find(".wc-tabs, ul.tabs").hide();
      }
      if (
        $tabs.find("li.reviews_tab a").length &&
        (hash.toLowerCase().indexOf("comment-") >= 0 ||
          hash === "#reviews" ||
          hash === "#tab-reviews")
      ) {
        $tabs.find("li.reviews_tab a").trigger("click");
      } else if (
        $tabs.find("li.reviews_tab a").length &&
        (url.indexOf("comment-page-") > 0 || url.indexOf("cpage=") > 0)
      ) {
        $tabs.find("li.reviews_tab a").trigger("click");
      } else if (hash === "#tab-additional_information") {
        $tabs.find("li.additional_information_tab a").trigger("click");
      } else {
        $tabs.find("li:first a").trigger("click");
      }
    });
    $(".wc-tabs-wrapper, .woocommerce-tabs").trigger("init");
  })();
});
jQuery(function ($) {
  "use strict";
  if (
    typeof wc_add_to_cart_variation_params !== "undefined" &&
    av5_shopJS.product_price_updater
  ) {
    $("body").on(
      "show_variation",
      ".variations_form .single_variation",
      function (event, variation) {
        var $this = $(this),
          $product = $this
            .closest(".product-info-background,.product-bar")
            .eq(0),
          $price = $product
            .find(".price:not(.price-variation)")
            .filter(function () {
              return 0 == $(this).closest(".owl-carousel").length;
            }),
          $price_variation = $price.next(".price-variation");
        if (!$price_variation.length) {
          $price.after(
            $("<div>").addClass("price price-variation").css("display", "none")
          );
          $price_variation = $price.next(".price-variation");
        }
        $price_variation.html(variation.price_html).show();
        $price.hide();
        $this.find(".woocommerce-variation-price").hide();
      }
    );
    $("body").on(
      "hide_variation",
      ".variations_form .single_variation",
      function (event) {
        var $this = $(this),
          $product = $this
            .closest(".product-info-background,.product-bar")
            .eq(0),
          $price = $product
            .find(".price:not(.price-variation)")
            .filter(function () {
              return 0 == $(this).closest(".owl-carousel").length;
            }),
          $price_variation = $price.next(".price-variation");
        $price.show();
        $price_variation.hide();
      }
    );
  }
});
