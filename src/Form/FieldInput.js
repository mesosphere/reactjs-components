import _ from "underscore";
import classNames from "classnames";
import React from "react";

export default class FieldInput extends React.Component {
  componentDidUpdate() {
    let inputElement = React.findDOMNode(this.refs.inputElement);

    if (this.isEditing() && inputElement !== document.activeElement) {
      inputElement.focus();
    }
  }

  handleValueChange(event) {
    this.props.onChange(this.props.fieldName, event.target.value);
  }

  onKeyDown(event) {
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === "Enter") {
      React.findDOMNode(this.refs.inputElement).blur();
    }
  }

  isEditing() {
    return this.props.editing && this.props.writeType === "edit";
  }

  getErrorMsg() {
    let errorMsg = null;
    if (this.props.validationError) {
      errorMsg = (
        <label className="form-validation-error-label">
          {this.props.errorText}
        </label>
      );
    }

    return errorMsg;
  }

  getLabel() {
    let label = null;
    if (this.props.showLabel) {
      label = (
        <label className="form-label">{this.props.fieldName}</label>
      );
    }

    return label;
  }

  getInputElement(attributes) {
    if (this.isEditing() || this.props.writeType === "input") {
      return (
        <input
          ref="inputElement"
          {...attributes}
          onChange={this.handleValueChange.bind(this)}
          onKeyDownCapture={this.onKeyDown.bind(this)}
          value={attributes.startValue} />
      );
    }

    return (
      <span
        ref="inputElement"
        {...attributes}
        onClick={attributes.onFocus}>
        {this.props.value || attributes.startValue}
      </span>
    );
  }

  render() {
    let props = this.props;
    let attributes = _.omit(
      props, "onChange", "onSubmit", "value"
    );
    let formRowElementClassSet = classNames({
      "form-row-element": true,
      "form-row-edit": props.editing,
      "form-row-input": props.writeType === "input",
      "form-row-read": !props.editing && props.writeType === "edit"
    });
    // Bind field name as the first argument.
    attributes.onBlur = attributes.onBlur.bind(this, props.fieldName);
    attributes.onFocus = attributes.onFocus.bind(this, props.fieldName);

    let label = this.getLabel();
    let errorMsg = this.getErrorMsg();
    let content = this.getInputElement(attributes);

    return (
      <div className={formRowElementClassSet}>
        {label}
        {content}
        {errorMsg}
      </div>
    );
  }
}
