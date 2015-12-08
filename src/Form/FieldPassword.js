/*eslint-disable no-unused-vars */
import React from "react";
/*eslint-enable no-unused-vars */

import FieldInput from "./FieldInput";

const DEFAULT_PASSWORD_TEXT = "••••••";

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

    if (this.isEditing() || this.props.writeType === "input") {
      return (
        <input
          ref="inputElement"
          className={this.props.inputClass}
          {...attributes}
          value={startValue} />
      );
    }

    return (
      <span
        ref="inputElement"
        {...attributes}
        className={this.props.readClass}
        onClick={attributes.onFocus}>
        {attributes.defaultPasswordValue || DEFAULT_PASSWORD_TEXT}
      </span>
    );
  }

}
