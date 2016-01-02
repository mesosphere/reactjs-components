/*
 * From: https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
 * Based on: https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
 * by Sebastian Markbåge
 *
 * This is not the original file, and has been modified
 */

import React from "react";

let lifecycleFunctions = [
  "componentWillMount", "componentDidMount",
  "componentWillReceiveProps", "componentWillUpdate", "componentDidUpdate",
  "componentWillUnmount", "render"
];

function noop() {
  return null;
}
function trueNoop() {
  return true;
}

function es6ify(mixin) {
  if (typeof mixin === "function") {
    // mixin is already es6 style
    return mixin;
  }

  return function (Base) {
    // mixin is old-react style plain object
    // convert to ES6 class
    class MixinClass extends Base {}

    const clonedMixin = Util.extend({}, mixin);
    // These React properties are defined as ES7 class static properties
    let staticProps = [
      "childContextTypes", "contextTypes",
      "defaultProps", "propTypes"
    ];
    staticProps.forEach(function (staticProp) {
      MixinClass[staticProp] = clonedMixin[staticProp];
      delete clonedMixin[staticProp];
    });

    // Omit lifecycle functions because we are already storing them elsewhere
    Util.extend(MixinClass.prototype, Util.exclude(clonedMixin, lifecycleFunctions));

    return MixinClass;
  };
}

function setLifecycleMixinHandler(proto, lifecycleFn, mixins) {
  if (mixins == null || mixins.length === 0) {
    // No-ops so we need not check before calling super()
    proto[lifecycleFn] = noop;
    return;
  }

  proto[lifecycleFn] = function (...args) {
    mixins.forEach((mixin) => {
      mixin.apply(this, args);
    });
  };
}

function addLifeCycleFunctions(proto, mixins) {
  let mixinLifecycleFnMap = {};
  mixins.forEach(function (mixin) {
    lifecycleFunctions.forEach(function (lifecycleFn) {
      if (mixin[lifecycleFn] == null) {
        return;
      }

      if (mixinLifecycleFnMap[lifecycleFn] == null) {
        mixinLifecycleFnMap[lifecycleFn] = [];
      }

      // Use push as we want to preserve order
      mixinLifecycleFnMap[lifecycleFn].push(mixin[lifecycleFn]);
    });
  });

  lifecycleFunctions.forEach(function (lifecycleFn) {
    setLifecycleMixinHandler(
      proto, lifecycleFn, mixinLifecycleFnMap[lifecycleFn]
    );
  });
}

const Util = {
  mixin: function (...mixins) {
    // Creates base class
    class Base extends React.Component {}

    Base.prototype.shouldComponentUpdate = trueNoop;
    addLifeCycleFunctions(Base.prototype, mixins);

    mixins.reverse();

    mixins.forEach(function (mixin) {
      Base = es6ify(mixin)(Base);
    });

    return Base;
  },

  // Superficial array check
  arrayDiff(a, b) {
    if (!a || !b) {
      return true;
    }

    return a.length !== b.length;
  },

  arrayPush(array, values) {
    let index = -1,
      length = values.length,
      offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  },

  baseFlatten(array, isDeep, isStrict, result) {
    result = result || [];

    let index = -1,
      length = array.length;

    while (++index < length) {
      let value = array[index];
      if (Util.isObjectLike(value) && Util.isArrayLike(value) &&
          (isStrict || value.isArray || Util.isArguments(value))) {
        if (isDeep) {
          // Recursively flatten arrays (susceptible to call stack limits).
          Util.baseFlatten(value, isDeep, isStrict, result);
        } else {
          Util.arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  },

  basePick(object, props) {
    object = Object(object);

    let index = -1,
      length = props.length,
      result = {};

    while (++index < length) {
      let key = props[index];
      if (key in object) {
        result[key] = object[key];
      }
    }
    return result;
  },

  /**
   * Excludes given properties from object
   *
   * @param  {Object} object
   * @param  {Array} props Array of properties to remove
   * @return {Object} New object without given props
   */
  exclude(object, props) {
    let newObject = {};

    Object.keys(object).forEach(function (prop) {
      if (props.indexOf(prop) === -1) {
        newObject[prop] = object[prop];
      }
    });

    return newObject;
  },

  /**
   * @param {Function} func A callback function to be called
   * @param {Number} wait How long to wait
   * @param {Boolean} immediate If it should be called immediately
   * @returns {Function} A function, that, as long as it continues to be
   * invoked, will not be triggered. The function will be called
   * after it stops being called for N milliseconds.
   * If `immediate` is passed, trigger the function on the leading edge,
   * instead of the trailing.
   */
  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    let later = function () {
      let last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      let callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  },

  extend(object, ...sources) {

    sources.forEach(function (source) {
      if (Object.prototype.toString.call(source) !== '[object Object]') {
        return;
      }

      Object.keys(source).forEach(function (key) {
        object[key] = source[key];
      });
    });

    return object;
  },

  baseValues(object, props) {
    let index = -1,
      length = props.length,
      result = Array(length);

    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  },

  isArrayLike(value) {
    return value != null && value.length &&
      !(
        typeof value === 'function' &&
        Object.prototype.toString.call(value) === '[object Function]'
      ) && typeof value === 'object';
  },

  isObjectLike(value) {
    return !!value && typeof value === 'object';
  },

  isArguments(value) {
    return Util.isObjectLike(value) && Util.isArrayLike(value) &&
      hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  },

  clone(object) {
    if (object === null || typeof object != 'object') {
      return object;
    }
    let copy = object.constructor();
    for (let attr in object) {
      if (object.hasOwnProperty(attr)) {
        copy[attr] = object[attr];
      }
    }
    return copy;
  },

  find(objects, predicate) {
    let result;
    objects.some((object) => {
      if (predicate(object)) {
        result = object;
      }
    });
    return result;
  },

  isFunction(value) {
    return (typeof value === 'object' || typeof value === 'function') &&
      Object.prototype.toString.call(value) === '[object Function]';
  },

  noop() {
    return null;
  },

  trueNoop() {
    return true;
  },

  pick(object, props) {
    return object === null ? {} : Util.basePick(object, Util.baseFlatten(props));
  },

  sortBy(collection, sortProp) {
    if (Util.isFunction(sortProp)) {
      return collection.sort(sortProp);
    } else {
      return collection.sort((a, b) => {
        let keyA = a[sortProp],
          keyB = b[sortProp];
        if (keyA < keyB) {
          return -1;
        } else if (keyA > keyB) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  },

  values(object) {
    return object ? Util.baseValues(object, Object.keys(object)) : [];
  }
};

module.exports = Util;
