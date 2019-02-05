import React from "react";

// Functions from lodash 4.0.0-pre

/**
 * The base implementation of `_.pick` without support for individual
 * property names.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property names to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);

  const { length } = props;
  const result = {};
  let index = -1;

  while (++index < length) {
    const key = props[index];
    if (key in object) {
      result[key] = object[key];
    }
  }

  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  const { length } = props;
  const result = Array(length);
  let index = -1;

  while (++index < length) {
    result[index] = object[props[index]];
  }

  return result;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return (
    isObjectLike(value) &&
    isArrayLike(value) &&
    hasOwnProperty.call(value, "callee") &&
    !propertyIsEnumerable.call(value, "callee")
  );
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @category Lang
 * @param {*} value The value to check.
 * @return {Boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return (
    value != null &&
    value.length &&
    !(
      typeof value === "function" &&
      Object.prototype.toString.call(value) === "[object Function]"
    ) &&
    typeof value === "object"
  );
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  return (
    (typeof value === "object" || typeof value === "function") &&
    Object.prototype.toString.call(value) === "[object Function]"
  );
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value === "object";
}

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property names to pick, specified
 *  individually or in arrays.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.pick(object, 'user');
 * // => { 'user': 'fred' }
 */
function pick(object, props) {
  return object === null ? {} : basePick(object, baseFlatten(props));
}

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, Object.keys(object)) : [];
}

// Functions from Underscore 1.9.0

// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  }
  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) {
    return a === b;
  }
  // `NaN`s are equivalent, but non-reflexive.
  /* eslint-disable no-self-compare */
  if (a !== a) {
    return b !== b;
  }
  /* eslint-enable no-self-compare */
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b !== "object") {
    return false;
  }

  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Compare `[[Class]]` names.
  var className = Object.prototype.toString.call(a);
  if (className !== Object.prototype.toString.call(b)) {
    return false;
  }

  /* eslint-disable no-fallthrough */
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;
    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN
      if (+a !== +a) {
        return +b !== +b;
      }

      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    /* eslint-enable no-fallthrough */
  }

  var areArrays = className === "[object Array]";
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") {
      return false;
    }

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      !(
        isFunction(aCtor) &&
        aCtor instanceof aCtor &&
        isFunction(bCtor) &&
        bCtor instanceof bCtor
      ) &&
      ("constructor" in a && "constructor" in b)
    ) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) {
        return false;
      }
    }
  } else {
    // Deep compare objects.
    var keys = Object.keys(a),
      key;
    length = keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (Object.keys(b).length !== length) {
      return false;
    }
    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) {
        return false;
      }
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();

  return true;
}

function property(key) {
  return function(obj) {
    /* eslint-disable no-void */
    return obj == null ? void 0 : obj[key];
    /* eslint-enable no-void */
  };
}

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object
var getLength = property("length");

// Internal implementation of a recursive `flatten` function.
function baseFlatten(input, shallow, strict, output) {
  output = output || [];
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
      // flatten current level of array or arguments object
      if (shallow) {
        var j = 0,
          len = value.length;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else {
        baseFlatten(value, shallow, strict, output);
        idx = output.length;
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }

  return output;
}

// Flatten out an array, either recursively (by default), or just one level.
function flatten(array, shallow) {
  return baseFlatten(array, shallow, false);
}

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

// Custom functions created for reactjs-components

function clone(object) {
  if (object === null || typeof object != "object") {
    return object;
  }
  const copy = object.constructor();
  for (const attr in object) {
    if (Object.prototype.hasOwnProperty.call(object, attr)) {
      copy[attr] = object[attr];
    }
  }

  return copy;
}

/**
 * Excludes given properties from object
 *
 * @param  {Object} object
 * @param  {Array} props Array of properties to remove
 * @return {Object} New object without given props
 */
function exclude(object, props) {
  const newObject = {};

  Object.keys(object).forEach(function(prop) {
    if (props.indexOf(prop) === -1) {
      newObject[prop] = object[prop];
    }
  });

  return newObject;
}
function extend(object, ...sources) {
  sources.forEach(function(source) {
    if (Object.prototype.toString.call(source) !== "[object Object]") {
      return;
    }

    Object.keys(source).forEach(function(key) {
      object[key] = source[key];
    });
  });

  return object;
}

function find(objects, predicate) {
  let result;
  objects.some(object => {
    if (predicate(object)) {
      result = object;
    }
  });

  return result;
}

var isArray = function(arg) {
  return Object.prototype.toString.call(arg) === "[object Array]";
};

function sortBy(collection, sortProp) {
  if (isFunction(sortProp)) {
    return collection.slice().sort(sortProp);
  } else {
    return collection.slice().sort((a, b) => {
      const keyA = a[sortProp];
      const keyB = b[sortProp];
      if (keyA < keyB) {
        return -1;
      } else if (keyA > keyB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

/*
 * From: https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
 * Based on: https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
 * by Sebastian Markbåge
 *
 * This is not the original file, and has been modified
 */

const lifecycleFunctions = [
  "componentWillMount",
  "componentDidMount",
  "componentWillReceiveProps",
  "componentWillUpdate",
  "componentDidUpdate",
  "componentWillUnmount",
  "render"
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

  return function(Base) {
    // mixin is old-react style plain object
    // convert to ES6 class
    class MixinClass extends Base {}

    const clonedMixin = Util.extend({}, mixin);
    // These React properties are defined as ES7 class static properties
    const staticProps = [
      "childContextTypes",
      "contextTypes",
      "defaultProps",
      "propTypes"
    ];
    staticProps.forEach(function(staticProp) {
      MixinClass[staticProp] = clonedMixin[staticProp];
      delete clonedMixin[staticProp];
    });

    // Omit lifecycle functions because we are already storing them elsewhere
    Util.extend(
      MixinClass.prototype,
      Util.exclude(clonedMixin, lifecycleFunctions)
    );

    return MixinClass;
  };
}

function setLifecycleMixinHandler(proto, lifecycleFn, mixins) {
  if (mixins == null || mixins.length === 0) {
    // No-ops so we need not check before calling super()
    proto[lifecycleFn] = noop;

    return;
  }

  proto[lifecycleFn] = function(...args) {
    mixins.forEach(mixin => {
      mixin.apply(this, args);
    });
  };
}

function addLifeCycleFunctions(proto, mixins) {
  const mixinLifecycleFnMap = {};
  mixins.forEach(function(mixin) {
    lifecycleFunctions.forEach(function(lifecycleFn) {
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

  lifecycleFunctions.forEach(function(lifecycleFn) {
    setLifecycleMixinHandler(
      proto,
      lifecycleFn,
      mixinLifecycleFnMap[lifecycleFn]
    );
  });
}

const Util = {
  mixin(...mixins) {
    // Creates base class
    class Base extends React.Component {}

    Base.prototype.shouldComponentUpdate = trueNoop;
    addLifeCycleFunctions(Base.prototype, mixins);

    mixins.reverse();

    mixins.forEach(function(mixin) {
      /* eslint-disable no-class-assign */
      Base = es6ify(mixin)(Base);
      /* eslint-enable no-class-assign */
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

  capitalize(string) {
    if (typeof string !== "string") {
      return null;
    }

    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
  },

  // Add external custom functions
  clone,
  exclude,
  extend,
  find,
  isArray,

  // Add external underscore functions
  flatten,
  isEqual,

  // Add external lodash functions
  isArguments,
  isArrayLike,
  isFunction,
  isObjectLike,
  noop,
  pick,
  sortBy,
  trueNoop,
  values
};

module.exports = Util;
