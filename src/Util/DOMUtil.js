const DOMUtil = {

  closest: function (el, selector) {
    var currentEl = el;

    while (currentEl.parentElement !== null) {
      if (currentEl.matches && currentEl.matches(selector)) {
        return currentEl;
      }

      currentEl = currentEl.parentElement;
    }

    return null;
  }

};

export default DOMUtil;
