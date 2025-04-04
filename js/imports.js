// Google Analytics
(function (i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);

// WooCommerce
(function () {
  var c = document.body.className;
  c = c.replace(/woocommerce-no-js/, "woocommerce-js");
  document.body.className = c;
})();

// Contact Form 7
var wpcf7 = {
  api: {
    root: "https://www.npack.eu/wp-json/",
    namespace: "contact-form-7/v1",
  },
  cached: "1",
};

// WooCommerce Params
var woocommerce_params = {
  ajax_url: "/wp-admin/admin-ajax.php",
  wc_ajax_url: "/?wc-ajax=%%endpoint%%",
};

// UACF7 Redirect Object
var uacf7_redirect_object = {
  // ... [redirect object data]
};

// UACF7 Multistep Object
var uacf7_multistep_obj = {
  ajax_url: "https://www.npack.eu/wp-admin/admin-ajax.php",
  nonce: "6b52063c32",
};

// UACF7 Conditional Redirect
var uacf7_cr_object = [];
var uacf7_redirect_type = [];
var uacf7_redirect_tag_support = [];
var uacf7_global_tag = {
  ajaxUrl: "https://www.npack.eu/wp-admin/admin-ajax.php",
};

// WP Util Settings
var _wpUtilSettings = {
  ajax: {
    url: "/wp-admin/admin-ajax.php",
  },
};

// WooCommerce Add to Cart Variation
var wc_add_to_cart_variation_params = {
  wc_ajax_url: "/?wc-ajax=%%endpoint%%",
  i18n_no_matching_variations_text:
    "Sorry, no products matched your selection. Please choose a different combination.",
  i18n_make_a_selection_text:
    "Please select some product options before adding this product to your cart.",
  i18n_unavailable_text:
    "Sorry, this product is unavailable. Please choose a different combination.",
};

// WP Rocket Lazy Load
window.lazyLoadOptions = [
  {
    elements_selector:
      "img[data-lazy-src],.rocket-lazyload,iframe[data-lazy-src]",
    data_src: "lazy-src",
    data_srcset: "lazy-srcset",
    data_sizes: "lazy-sizes",
    class_loading: "lazyloading",
    class_loaded: "lazyloaded",
    threshold: 300,
    callback_loaded: function (element) {
      if (
        element.tagName === "IFRAME" &&
        element.dataset.rocketLazyload == "fitvidscompatible"
      ) {
        if (element.classList.contains("lazyloaded")) {
          if (typeof window.jQuery != "undefined") {
            if (jQuery.fn.fitVids) {
              jQuery(element).parent().fitVids();
            }
          }
        }
      }
    },
  },
  {
    elements_selector: ".rocket-lazyload",
    data_src: "lazy-src",
    data_srcset: "lazy-srcset",
    data_sizes: "lazy-sizes",
    class_loading: "lazyloading",
    class_loaded: "lazyloaded",
    threshold: 300,
  },
];

// YouTube Lazy Load
function lazyLoadThumb(e) {
  var t =
    '<img data-lazy-src="https://i.ytimg.com/vi/ID/hqdefault.jpg" alt="" width="480" height="360"><noscript><img src="https://i.ytimg.com/vi/ID/hqdefault.jpg" alt="" width="480" height="360"></noscript>';
  var a = '<button class="play" aria-label="play Youtube video"></button>';
  return t.replace("ID", e) + a;
}

function lazyLoadYoutubeIframe() {
  var e = document.createElement("iframe");
  var t = "ID?autoplay=1";
  t +=
    0 === this.parentNode.dataset.query.length
      ? ""
      : "&" + this.parentNode.dataset.query;
  e.setAttribute("src", t.replace("ID", this.parentNode.dataset.src));
  e.setAttribute("frameborder", "0");
  e.setAttribute("allowfullscreen", "1");
  e.setAttribute(
    "allow",
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  );
  this.parentNode.parentNode.replaceChild(e, this.parentNode);
}

document.addEventListener("DOMContentLoaded", function () {
  var e,
    t,
    p,
    a = document.getElementsByClassName("rll-youtube-player");
  for (t = 0; t < a.length; t++) {
    e = document.createElement("div");
    e.setAttribute("data-id", a[t].dataset.id);
    e.setAttribute("data-query", a[t].dataset.query);
    e.setAttribute("data-src", a[t].dataset.src);
    e.innerHTML = lazyLoadThumb(a[t].dataset.id);
    a[t].appendChild(e);
    p = e.querySelector(".play");
    p.onclick = lazyLoadYoutubeIframe;
  }
});
