const KEYCODES = {
  27: 'esc'
};

const KeyDownMixin = {
  componentWillMount() {
    this.keyDown_handleKeyDown = this.keyDown_handleKeyDown.bind(this);

    if (this.keysToBind) {
      document.body.addEventListener('keydown', this.keyDown_handleKeyDown);
    }
  },

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.keyDown_handleKeyDown);
  },

  keyDown_handleKeyDown(event) {
    let {keyCode} = event;
    let callback = this.keysToBind[KEYCODES[keyCode]];

    if (callback) {
      callback();
    }
  }
};

module.exports = KeyDownMixin;
