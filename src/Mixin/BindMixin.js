const BindMixin = {
  componentWillMount() {
    if (this.methodsToBind) {
      this.methodsToBind.forEach(method => {
        this[method] = this[method].bind(this);
      });
    }
  }
};

module.exports = BindMixin;
