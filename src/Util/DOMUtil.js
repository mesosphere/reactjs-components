var computeInnerBound = function(compstyle, acc, key) {
  var val = parseInt(compstyle[key], 10);

  if (isNaN(val)) {
    return acc;
  } else {
    return acc - val;
  }
};

const DOMUtil = {
  closest(el, selector) {
    var currentEl = el;

    while (currentEl && currentEl.parentElement !== null) {
      if (currentEl[this.matchesFn] && currentEl[this.matchesFn](selector)) {
        return currentEl;
      }

      currentEl = currentEl.parentElement;
    }

    return null;
  },

  getPageHeight() {
    var body = document.body;
    var html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  },

  getComputedDimensions(obj) {
    var compstyle;
    if (typeof window.getComputedStyle === "undefined") {
      compstyle = obj.currentStyle;
    } else {
      compstyle = window.getComputedStyle(obj);
    }

    var width = [
      "borderLeftWidth",
      "borderRightWidth",
      "marginLeft",
      "marginRight",
      "paddingLeft",
      "paddingRight"
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetWidth);

    var height = [
      "borderTopWidth",
      "borderBottomWidth",
      "marginTop",
      "marginBottom",
      "paddingTop",
      "paddingBottom"
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetHeight);

    return {
      width,
      height
    };
  },

  getNodeClearance(DOMNode) {
    if (!DOMNode) {
      return {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        boundingRect: new DOMRect()
      };
    }

    const viewportHeight = DOMUtil.getViewportHeight();
    const viewportWidth = DOMUtil.getViewportWidth();
    const boundingRect = DOMNode.getBoundingClientRect();

    return {
      bottom: viewportHeight - boundingRect.bottom,
      left: boundingRect.left,
      right: viewportWidth - boundingRect.right,
      top: boundingRect.top,
      boundingRect
    };
  },

  getViewportHeight() {
    return Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
  },

  getViewportWidth() {
    return Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
  },

  getScrollTop(element) {
    if (element === window || element === document) {
      return (
        self.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      );
    } else {
      return element.scrollTop;
    }
  },

  matchesFn: (function() {
    const el = document.querySelector("body");
    const names = [
      "matches",
      "matchesSelector",
      "msMatchesSelector",
      "oMatchesSelector",
      "mozMatchesSelector",
      "webkitMatchesSelector"
    ];

    for (let i = 0; i < names.length; i++) {
      if (el[names[i]]) {
        return names[i];
      }
    }

    return names[0];
  })()
};

module.exports = DOMUtil;
