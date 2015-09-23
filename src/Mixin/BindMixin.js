let BindMixin = {

  bindMethods: function(methods) {
    if (methods) {
      methods.forEach(function (method) {
        this[method] = this[method].bind(this);
      }.bind(this));
    }
  }
};

module.exports = BindMixin;
