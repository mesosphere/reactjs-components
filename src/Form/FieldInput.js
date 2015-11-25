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
    return this.props.editing === this.props.fieldName
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
    if (validationError && validationError[this.props.fieldName]) {
      errorMsg = (
        <p className={this.props.helpBlockClass}>
          {this.props.errorText}
        </p>
      );
    }

    return errorMsg;
  }

  getLabel() {
    let label = null;
    if (this.props.showLabel) {
      label = (
        <label>{this.props.fieldName}</label>
      );
    }

    return label;
  }

  getInputElement(attributes) {
    // Bind field name as the first argument.
    attributes.onBlur = attributes.onBlur.bind(this, this.props.fieldName);
    attributes.onFocus = attributes.onFocus.bind(this, this.props.fieldName);

    if (this.isEditing() || this.props.writeType === "input") {
      return (
        <input
          ref="inputElement"
          className={this.props.inputClass}
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
        className={this.props.readClass}
        onClick={attributes.onFocus}>
        {this.props.value || attributes.startValue}
      </span>
    );
  }

  render() {
    let attributes = _.omit(
      this.props, "onChange", "onSubmit", "value"
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
