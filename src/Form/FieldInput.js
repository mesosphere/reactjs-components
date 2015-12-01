import _ from "underscore";
import classNames from "classnames";
import React from "react";

import KeyboardUtil from "../utils/KeyboardUtil";

const EVENTS = ["onBlur", "onChange", "onFocus"];

export default class FieldInput extends React.Component {
  componentDidUpdate() {
    let inputElement = React.findDOMNode(this.refs.inputElement);

    if (this.isEditing() && inputElement !== document.activeElement) {
      inputElement.focus();
    }
  }

  bindEvents(attributes, handleEvent) {
    EVENTS.forEach((event) => {
      attributes[event] = handleEvent.bind(this, event, this.props.name);
    });

    return attributes;
  }

  handleValueChange(event) {
    this.props.onChange(this.props.name, event.target.value);
  }

  handleKeyDown(event) {
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === KeyboardUtil.keys.enter) {
      React.findDOMNode(this.refs.inputElement).blur();
    }
  }

  isEditing() {
    return this.props.editing === this.props.name
      && this.props.writeType === "edit";
  }

  getRowClass(props) {
    return classNames({
      "form-row-element": true,
      "form-row-edit": this.isEditing(),
      "form-row-input": props.writeType === "input",
      "form-row-read": !this.isEditing() && props.writeType === "edit"
    });
  }

  getErrorMsg() {
    let errorMsg = null;
    let validationError = this.props.validationError;
    if (validationError && validationError[this.props.name]) {
      errorMsg = (
        <p className={this.props.helpBlockClass}>
          {validationError[this.props.name]}
        </p>
      );
    }

    return errorMsg;
  }

  getLabel() {
    let label = null;
    if (this.props.showLabel) {
      label = (
        <label>{this.props.name}</label>
      );
    }

    return label;
  }

  getInputElement(attributes) {
    attributes = this.bindEvents(attributes, this.props.handleEvent);

    if (this.isEditing() || this.props.writeType === "input") {
      return (
        <input
          ref="inputElement"
          className={this.props.inputClass}
          onKeyDown={this.handleKeyDown.bind(this)}
          {...attributes}
          value={attributes.startValue} />
      );
    }

    return (
      <span
        ref="inputElement"
        {...attributes}
        className={this.props.readClass}
        onClick={attributes.onFocus}>
        {this.props.value || attributes.startValue}
      </span>
    );
  }

  render() {
    let attributes = _.omit(
      this.props, "onChange", "value"
    );
    let formRowElementClassSet = this.getRowClass(this.props);

    return (
      <div className={formRowElementClassSet}>
        {this.getLabel()}
        {this.getInputElement(attributes)}
        {this.getErrorMsg()}
      </div>
    );
  }
}
