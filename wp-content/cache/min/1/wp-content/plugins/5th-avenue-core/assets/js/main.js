jQuery(function ($) {
  "use strict";
  $("body")
    .on("init_shortcode.hotspot", function (e, parent) {
      var parent = parent || $("body");
      $(parent)
        .find(".block-hotspot")
        .each(function () {
          $(this).pointparallax({
            itemsSelector: ".hotspot-element",
            fixedClass: "hotspot-element-fixed",
            afterdisplayedClass: "hotspot-element-after-displayed",
            point: "center",
            stoponpoint: "on" == $(this).data("stoponpoint"),
            centeredposition: !1,
            afterdisplayed: !1,
            css_calc: !0,
            vector: "path" != $(this).data("motiontype"),
            path: 100,
            step: 30,
          });
        });
    })
    .trigger("init_shortcode.hotspot");
});
