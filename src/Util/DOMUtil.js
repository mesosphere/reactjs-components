var computeInnerBound = function (compstyle, acc, key) {
  var val = parseInt(compstyle[key], 10);

  if (isNaN(val)) {
    return acc;
  } else {
    return acc - val;
  }
};

var matchesFn = (function () {
  var el = document.querySelector('body');
  var names = [
    'matches', 'matchesSelector', 'msMatchesSelector',
    'oMatchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector'
  ];

  for (var i = 0; i < names.length; i++) {
    if (el[names[i]]) {
      return names[i];
    }
  }

  return names[0];
})();

const DOMUtil = {
  closest(el, selector) {
    var currentEl = el;

    while (currentEl.parentElement !== null) {
      if (currentEl[matchesFn] && currentEl[matchesFn](selector)) {
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
    if (typeof window.getComputedStyle === 'undefined') {
      compstyle = obj.currentStyle;
    } else {
      compstyle = window.getComputedStyle(obj);
    }

    var width = [
      'borderLeftWidth',
      'borderRightWidth',
      'marginLeft',
      'marginRight',
      'paddingLeft',
      'paddingRight'
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetWidth);

    var height = [
      'borderTopWidth',
      'borderBottomWidth',
      'marginTop',
      'marginBottom',
      'paddingTop',
      'paddingBottom'
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetHeight);

    return {
      width: width,
      height: height
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
  }
};

module.exports = DOMUtil;
