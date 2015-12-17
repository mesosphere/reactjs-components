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
      if (this.props.writeType === "edit") {
        React.findDOMNode(this.refs.inputElement).blur();
      }

      if (this.props.writeType === "input") {
        this.props.handleSubmit();
      }
    }
  }

  isEditing() {
    return this.props.editing === this.props.name
      && this.props.writeType === "edit";
  }

  getRowClass(props) {
    return classNames(
      `column-${props.columnWidth}`,
      "form-row-element",
      {
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
    let props = this.props;
    let classes = classNames(props.inputClass, props.sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || props.writeType === "input") {
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
        <span className={props.inlineTextClass}>
          {props.value || attributes.startValue}
        </span>
        <span className={props.inlineIconClass}>
          <IconEdit />
        </span>
      </span>
    );
  }

  render() {
    let props = this.props;

    let attributes = _.omit(props, "onChange", "value");
    let formRowElementClassSet = this.getRowClass(props);

    return (
      <div className={formRowElementClassSet}>
        <div className={props.formGroupClass}>
          {this.getLabel()}
          {this.getInputElement(attributes)}
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}
