jQuery(function ($) {
  (function () {
    $(".av5-product-gallery").each(function () {
      var $this = $(this),
        $window = $(window),
        $this_native_top = 167,
        $summary = $(".npack-product-summary-sticky");
      function update() {
        var scrollTop = $window.scrollTop(),
          $this_par_top = $this.parent().offset().top,
          $summaryHeight = $summary.outerHeight(),
          $bigger_col =
            $this.outerHeight() >= $summaryHeight
              ? $this.outerHeight()
              : $summaryHeight - 30;
        if ($(window).width() >= 1024) {
          $(
            ".woocommerce div.product.product_sticky1 .product-content-wrapper"
          ).height($bigger_col);
          $this.parent().height($bigger_col);
        }
        $this.css({ width: $this.parent().width() });
        if (
          $(window).width() < 1024 ||
          $summaryHeight < $window.height() - 100
        ) {
          $this.removeClass("_static").removeClass("_fixed");
          $this.css({ top: "" });
          return;
        }
        if (scrollTop >= $this.parent().outerHeight() - $this.outerHeight()) {
          $this.addClass("_static").removeClass("_fixed");
          $this.css({ top: "" });
          return;
        }
        $this.removeClass("_static").addClass("_fixed");
        $this.css({ top: $this_par_top });
      }
      update();
      $(window).on("scroll", function () {
        requestAnimationFrame(update);
      });
      $(window).on("resize", function () {
        requestAnimationFrame(update);
      });
      $(window).on("click", function () {
        requestAnimationFrame(update);
      });
      if (
        typeof wc_add_to_cart_variation_params !== "undefined" &&
        av5_shopJS.product_price_updater
      ) {
        $("body").on(
          "show_variation",
          ".variations_form .single_variation",
          function (event, variation) {
            requestAnimationFrame(update);
          }
        );
        $("body").on(
          "hide_variation",
          ".variations_form .single_variation",
          function (event) {
            requestAnimationFrame(update);
          }
        );
      }
    });
  })();
});
