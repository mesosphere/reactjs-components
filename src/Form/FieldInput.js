import _ from "underscore";
import classNames from "classnames";
import React from "react";

import IconEdit from "./icons/IconEdit";
import KeyboardUtil from "../utils/KeyboardUtil";
import StringUtil from "../utils/StringUtil";

const EVENTS = ["blur", "change", "focus"];

export default class FieldInput extends React.Component {
  componentDidUpdate() {
    let inputElement = React.findDOMNode(this.refs.inputElement);

    if (this.isEditing() && inputElement !== global.document.activeElement) {
      inputElement.focus();
    }
  }

  bindEvents(attributes) {
    EVENTS.forEach((event) => {
      let htmlEvent = `on${StringUtil.capitalize(event)}`;
      attributes[htmlEvent] = this.handleEvent.bind(this, event);
    });

    return attributes;
  }

  handleEvent(event, eventObj) {
    this.props.handleEvent(
      event, this.props.name, eventObj.target.value, eventObj
    );
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
    let classObj = {
      "form-row-element": true,
      "form-row-edit": this.isEditing(),
      "form-row-input": props.writeType === "input",
      "form-row-read": !this.isEditing() && props.writeType === "edit"
    };
    classObj[`column-${props.columnWidth}`] = true;

    return classNames(classObj);
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
    let classes = classNames(this.props.inputClass, this.props.sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || this.props.writeType === "input") {
      return (
        <input
          ref="inputElement"
          className={classes}
          onKeyDown={this.handleKeyDown.bind(this)}
          {...attributes}
          value={attributes.startValue} />
      );
    }

    return (
      <span
        ref="inputElement"
        {...attributes}
        className={classes}
        onClick={attributes.onFocus}>
        {this.props.value || attributes.startValue}
        <IconEdit />
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
