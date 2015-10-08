import React from 'react';

function noop() {
  return null;
}
function trueNoop() {
  return true;
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

  debounce(func, wait, immediate) {
    if (!wait) {
      return func;
    }

    var timeout;

    return function () {
      var context = this, args = arguments;

      var later = function () {
        timeout = null;

        if (!immediate) {
          func.apply(context, args);
        }
      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args);
      }
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
    return value != null &&
      !(
        typeof value === 'function' &&
        Object.prototype.toString.call(value) === '[object Function]'
      ) && value.length;
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

export default Util;
