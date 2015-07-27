var arrayPush = (array, values) => {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
};

var isArrayLike = (value) => {
  return value != null &&
    !(
      typeof value === 'function' &&
      Object.prototype.toString.call(value) === '[object Function]'
    ) && value.length;
};

var isObjectLike = (value) => {
  return !!value && typeof value === 'object';
};

var isArguments = (value) => {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

var baseFlatten = (array, isDeep, isStrict, result) => {
  result = result || [];

  var index = -1,
    length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || value.isArray || isArguments(value))) {
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
};

var basePick = (object, props) => {
  object = Object(object);

  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
};

var baseValues = (object, props) => {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
};

var clone = (obj) => {
  if (obj === null || typeof obj != 'object') {
    return obj;
  }
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

var Util = {
  extend(object, source) {
    var props = Object.keys(source);

    object = clone(object) || {};

    var index = -1,
      length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
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
        var keyA = a[sortProp],
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

export {Util};
