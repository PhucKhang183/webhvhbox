jQuery(function ($) {
  "use strict";
  var av5ResizeVideoBackground = function ($element) {
    var $element = $($element),
      $video = $element.find("video").eq(0);
    var marginLeft,
      marginTop,
      containerW = $element.innerWidth(),
      containerH = $element.innerHeight(),
      iframeW = containerW,
      iframeH = containerH,
      proportions = $video[0].videoWidth / $video[0].videoHeight;
    if (isNaN(proportions)) {
      return;
    }
    if (containerW / containerH < proportions) {
      iframeW = containerH * proportions;
    } else {
      iframeH = containerW / proportions;
    }
    marginLeft = -Math.round((iframeW - containerW) / 2) + "px";
    marginTop = -Math.round((iframeH - containerH) / 2) + "px";
    iframeW += "px";
    iframeH += "px";
    $video.css({
      maxWidth: "1000%",
      marginLeft: marginLeft,
      marginTop: marginTop,
      width: iframeW,
      height: iframeH,
    });
  };
  $(".av5-background-video").each(function () {
    var $element = $(this);
    var resizeTimer;
    $(window).on("resize", function () {
      av5ResizeVideoBackground($element);
    });
    $element.find("video").on("loadeddata", function () {
      av5ResizeVideoBackground($element);
    });
    av5ResizeVideoBackground($element);
  });
});
