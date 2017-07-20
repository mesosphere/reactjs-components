import HtmlAttributes from "../constants/HtmlAttributes";

const HTMLUtil = {
  filterAttributes(object) {
    object = Object(object);

    return Object.keys(object).reduce(function(acc, key) {
      if (
        key.toLowerCase() in HtmlAttributes ||
        /^(data-.+|aria-.+)/.test(key)
      ) {
        acc[key] = object[key];
      }

      return acc;
    }, {});
  }
};

module.exports = HTMLUtil;
