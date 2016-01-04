import React from 'react';

function arrayPush(array, values) {
  let index = -1,
    length = values.length,
    offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

function baseFlatten(array, isDeep, isStrict, result) {
  result = result || [];

  let index = -1,
    length = array.length;

  while (++index < length) {
    let value = array[index];
    if (Util.isObjectLike(value) && Util.isArrayLike(value) &&
        (isStrict || value.isArray || Util.isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

function basePick(object, props) {
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
}

function baseValues(object, props) {
  let index = -1,
    length = props.length,
    result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

function es6ify(mixin) {
  if (typeof mixin === 'function') {
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
      'childContextTypes', 'contextTypes',
      'defaultProps', 'propTypes'
    ];
    staticProps.forEach(function (staticProp) {
      MixinClass[staticProp] = clonedMixin[staticProp];
      delete clonedMixin[staticProp];
    });

    MixinClass.prototype = Util.extend(MixinClass.prototype, clonedMixin);
    return MixinClass;
  };
}

function noop() {
  return null;
}

function trueNoop() {
  return true;
}

const Util = {

  /*
   * https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
  */
  mixin(...mixins) {
    // Creates base class
    class Base extends React.Component {}
    Base.prototype.shouldComponentUpdate = trueNoop;

    // No-ops so we need not check before calling super()
    let functions = [
      'componentWillMount', 'componentDidMount',
      'componentWillReceiveProps', 'componentWillUpdate', 'componentDidUpdate',
      'componentWillUnmount', 'render'
    ];
    functions.forEach(function (lifecycleFn) {
      Base.prototype[lifecycleFn] = noop;
    });

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

  pick(object, props) {
    return object === null ? {} : basePick(object, baseFlatten(props));
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
    return object ? baseValues(object, Object.keys(object)) : [];
  }
};

export default Util;
