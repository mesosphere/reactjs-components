/*eslint-disable no-unused-vars */
import React from "react";
/*eslint-enable no-unused-vars */

import FieldInput from "./FieldInput";

const DEFAULT_PASSWORD_TEXT = "default";

export default class FieldPassword extends FieldInput {
  getOnFocus() {
    return (event) => {
      if (!this.focused) {
        this.focused = true;
        this.forceUpdate();
      }

      this.props.handleEvent("onFocus", this.props.name, event);
    };
  }

  getInputElement(attributes) {
    attributes = this.bindEvents(attributes, this.props.handleEvent);
    attributes.onFocus = this.getOnFocus();

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
