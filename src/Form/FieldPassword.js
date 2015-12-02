/*eslint-disable no-unused-vars */
import React from "react";
/*eslint-enable no-unused-vars */

import FieldInput from "./FieldInput";

const DEFAULT_PASSWORD_TEXT = "default";

const METHODS_TO_BIND = ["handleOnFocus"];

export default class FieldPassword extends FieldInput {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleOnFocus(event) {
    if (!this.focused) {
      this.focused = true;
      this.forceUpdate();
    }

    this.props.handleEvent("focus", this.props.name, event);
  }

  getInputElement(attributes) {
    attributes = this.bindEvents(attributes, this.props.handleEvent);
    attributes.onFocus = this.handleOnFocus;

    let startValue = DEFAULT_PASSWORD_TEXT;
    if (this.focused) {
      startValue = attributes.startValue;
    }

    return (
      <input
        ref="inputElement"
        className={this.props.inputClass}
        {...attributes}
        value={startValue} />
    );
  }
}
