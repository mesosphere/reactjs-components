import React from "react";

import FieldInput from "./FieldInput";

const DEFAULT_PASSWORD_TEXT = "default";

export default class FieldPassword extends FieldInput {

  getOnFocus() {
    return () => {
      if (!this.focused) {
        this.focused = true;
        this.forceUpdate();
      }

      this.props.onFocus(this.props.name);
    };
  }

  getInputElement(attributes) {
    // Bind field name as the first argument.
    attributes.onBlur = attributes.onBlur.bind(this, this.props.name);
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
        onChange={this.handleValueChange.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        value={startValue} />
    );
  }
}
