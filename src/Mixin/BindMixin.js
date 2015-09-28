const BindMixin = {
  constructor() {
    super.constructor();
    if (this.methodsToBind) {
      this.methodsToBind.forEach((method) => {
        this[method] = this[method].bind(this);
      });
    }
  }
};

export default BindMixin;
