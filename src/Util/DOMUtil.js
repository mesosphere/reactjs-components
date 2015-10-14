let computeInnerBound = (compstyle, acc, key) => {
  var val = parseInt(compstyle[key], 10);

  if (isNaN(val)) {
    return acc;
  } else {
    return acc - val;
  }
};

// Calculates the distance from window top to element top
function windowTopToElemenTop(element) {
  if (!element || element === window) {
    return 0;
  }

  return element.offsetTop + windowTopToElemenTop(element.offsetParent);
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
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetWidth || 0);

    var height = [
      'paddingTop',
      'paddingBottom',
      'borderTopWidth',
      'borderBottomWidth'
    ].reduce(computeInnerBound.bind(this, compstyle), obj.offsetHeight || 0);

    return {
      width: width,
      height: height
    };
  },

  getViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  },

  // Calculates the difference between element top and container top
  topDifference(element, container) {
    return windowTopToElemenTop(element) - windowTopToElemenTop(container);
  }

};

export default DOMUtil;
