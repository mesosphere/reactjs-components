let computeInnerBound = (compstyle, acc, key) => {
  var val = parseInt(compstyle[key], 10);

  if (isNaN(val)) {
    return acc;
  } else {
    return acc - val;
  }
};

function topFromWindow(element) {
  if (!element || element === window) {
    return 0;
  }

  return element.offsetTop + topFromWindow(element.offsetParent);
}

const DOMUtil = {

  closest(el, selector) {
    var currentEl = el;

    while (currentEl.parentElement !== null) {
      if (currentEl.matches && currentEl.matches(selector)) {
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
      'paddingLeft',
      'paddingRight',
      'borderLeftWidth',
      'borderRightWidth'
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetWidth);

    var height = [
      'paddingTop',
      'paddingBottom',
      'borderTopWidth',
      'borderBottomWidth'
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetHeight);

    return {
      width: width,
      height: height
    };
  },

  topDifference(element, container) {
    return topFromWindow(element) - topFromWindow(container);
  }

};

export default DOMUtil;
