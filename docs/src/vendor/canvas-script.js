/* eslint-disable */
!(function($) {
  $(window).on("load", function() {
    init();
  });

  function init() {
    $.app = {};
    $.app.stage = $("#stage");
    $.app.scrollbar_width = get_scrollbar_width();

    $(window).resize(function() {
      window_resize();
    });

    window_resize();

    $(window).scroll(function() {
      window_scroll();
    });

    window_scroll();
    scroll_to_anchor();

    window.prettyPrint && prettyPrint();

    page_content_navigation_update();
  }

  function window_resize() {
    var responsive_viewport = $(window).width() + $.app.scrollbar_width;
    window_scroll();

    $("#page-content-navigation").affix({
      offset: {
        top: function() {
          var page_content_navigation = $("#page-content-navigation");
          var page_content_navigation_threshold_top = $(
            "#page-content"
          ).offset().top;
          return page_content_navigation_threshold_top;
        },

        bottom: function() {
          var footer_height = $("#footer").outerHeight(true);
          var page_content_navigation_margin_bottom = parseInt(
            jQuery("#page-content-navigation").css("margin-bottom")
          );
          var page_content_navigation_threshold_bottom =
            footer_height + page_content_navigation_margin_bottom;
          return page_content_navigation_threshold_bottom;
        }
      }
    });
  }

  window.window_resize = window_resize;

  function window_scroll() {
    var scroll_top = $(window).scrollTop() - $("#canvas").offset().top;
    page_content_navigation_update();
  }

  function page_content_navigation_update() {
    var scroll_top = $(window).scrollTop() - $("#canvas").offset().top;
    var page_content_navigation = $("#page-content-navigation");

    page_content_navigation.find("li").each(function() {
      $(this)
        .children("a")
        .each(function() {
          var el = $($(this).attr("href"));

          if (el != null) {
            var el_top = el.offset().top;
            var el_height = el.height();

            if (scroll_top >= el_top - 1 && scroll_top < el_top + el_height) {
              $(this)
                .parent()
                .addClass("active");
            } else {
              $(this)
                .parent()
                .removeClass("active");
            }
          }
        });
    });
  }

  function get_browser_dimensions() {
    var dimensions = {
      width: 0,
      height: 0
    };

    if ($(window)) {
      dimensions.width = $(window).width();
      dimensions.height = $(window).height();
    }

    return dimensions;
  }

  function get_scrollbar_width() {
    var div = $(
      '<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>'
    );
    $("body").append(div);
    var w1 = $("div", div).innerWidth();
    div.css("overflow-y", "auto");
    var w2 = $("div", div).innerWidth();
    $(div).remove();
    return w1 - w2;
  }

  function scroll_to_anchor(speed) {
    if (typeof speed === "undefined" || speed === null) {
      speed = 500;
    }

    $("a[href*=#]:not([href=#])").click(function() {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");

        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top
            },
            speed
          );

          return false;
        }
      }
    });
  }
})(window.jQuery);
