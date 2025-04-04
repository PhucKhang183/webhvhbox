jQuery(function ($) {
  class StickyNavigation {
    constructor() {
      this.currentId = null;
      this.currentTab = null;
      this.tabContainerHeight = $(".sticky-nav-tabs-container").outerHeight();
      this.headerHeight = this.getTabContainerHeight();
      this.firsTabId = $(
        ".sticky-nav-tabs ul.sticky-nav-tabs-container li.sticky-nav-tab a"
      )
        .first()
        .attr("href");
      this.lastScroll = 0;
      let self = this;
      $(".sticky-nav-tab").click(function () {
        self.onTabClick($(this), event);
      });
      $(".sticky-nav-tabs-container .hamburger-menu-icon-small").click(
        function () {
          self.onBurgerClick(event, $(this));
        }
      );
      $(window).scroll(() => {
        this.onScroll();
      });
      $(window).resize(() => {
        this.onResize();
      });
      $("body").scrollspy({
        target: ".sticky-nav-tabs",
        offset: this.tabContainerHeight + this.headerHeight + 10,
      });
      let hash = $(location).attr("hash");
      if (hash) {
        let tab = $(`[data-target="${hash}"]`);
        tab.trigger("click");
      }
    }
    onTabClick(element, event = !1) {
      if (event !== !1) {
        event.preventDefault();
      }
      let fixedTabNavCompensator = $(".sticky-nav-tabs-container._fixed").length
        ? 0
        : this.tabContainerHeight;
      let scrollTop =
        $(element.find("a").attr("href")).offset().top -
        this.tabContainerHeight -
        this.headerHeight -
        5;
      if (event === !1) {
        scrollTop = scrollTop - 19;
      }
      let self = this;
      $("html, body").animate({ scrollTop: scrollTop }, 600, function () {
        $(".sticky-nav-tabs-container").addClass("_fixed");
        self.rmMainNavShadow();
      });
      $(".sticky-nav-tab").toggleClass("hidden-xs hidden-sm");
    }
    onBurgerClick(event, element) {
      $(".sticky-nav-tab").toggleClass("hidden-xs hidden-sm");
    }
    onScroll() {
      this.checkHeaderPosition();
      this.lastScroll = $(window).scrollTop();
    }
    onResize() {
      this.headerHeight = this.getTabContainerHeight();
      this.checkHeaderPosition();
    }
    checkHeaderPosition() {
      let offset = $(".sticky-nav-tabs").offset().top - this.headerHeight;
      if ($(window).scrollTop() > offset) {
        $(".sticky-nav-tabs-container").css(
          "width",
          $(".sticky-nav-tabs").outerWidth()
        );
        $("#header.header.is-sticky.sticky-header--shadow-on .header-main").css(
          "box-shadow",
          "none"
        );
        $(".sticky-nav-tabs-container").addClass("_fixed");
        $(".sticky-nav-tabs-wrapper")
          .parent(".wpb_wrapper")
          .css("z-index", 998);
        $(this.firsTabId).css("margin-top", this.tabContainerHeight);
      } else {
        $(".sticky-nav-tabs-container").css("width", "");
        $("#header.header.is-sticky.sticky-header--shadow-on .header-main").css(
          "box-shadow",
          ""
        );
        $(".sticky-nav-tabs-container").removeClass("_fixed");
        $(this.firsTabId).css("margin-top", 0);
      }
    }
    getTabContainerHeight() {
      return window.innerWidth > 1024 ? 60 : 54;
    }
    rmMainNavShadow() {
      let self = this;
      if (
        $("#header.header.is-sticky.sticky-header--shadow-on .header-main")
          .length
      ) {
        $("#header.header.is-sticky.sticky-header--shadow-on .header-main").css(
          "box-shadow",
          "none"
        );
      } else {
        setTimeout(self.rmMainNavShadow, 100);
      }
    }
  }
  if ($(".sticky-nav-tabs-container").length) {
    new StickyNavigation();
  }
});
