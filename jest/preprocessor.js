// To transform JSX in tests
var ReactTools = require("react-tools");
module.exports = {
  process: function(src) {
    return ReactTools.transform(src);
  }
};
