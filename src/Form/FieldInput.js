import _ from "underscore";
import classNames from "classnames";
import React from "react";

export default class FieldInput extends React.Component {
  handleValueChange(event) {
    this.props.onChange(this.props.fieldName, event.target.value);
  }

  onKeyDown(event) {
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === "Enter") {
      React.findDOMNode(this.refs.inputElement).blur();
    }
  }

  getErrorMsg() {
    let errorMsg = null;
    if (this.props.validationError) {
      errorMsg = (
        <label className="form-validation-error-label">
          {this.props.errorMsg}
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

  render() {
    let props = this.props;
    let attributes = _.omit(
      props, "onChange", "onSubmit"
    );
    let formRowElementClassSet = classNames({
      "form-row-element": true,
      "form-row-edit": props.editing,
      "form-row-input": props.writeType === "input",
      "form-row-read": !props.editing && props.writeType === "edit"
    });
    let label = this.getLabel();
    let errorMsg = this.getErrorMsg();

    // Bind field name as the first argument.
    attributes.onBlur = attributes.onBlur.bind(this, props.fieldName);
    attributes.onFocus = attributes.onFocus.bind(this, props.fieldName);

    return (
      <div className={formRowElementClassSet}>
        {label}
        <input
          ref="inputElement"
          {...attributes}
          onChange={this.handleValueChange.bind(this)}
          onKeyDownCapture={this.onKeyDown.bind(this)} />
        {errorMsg}
      </div>
    );
  }
}
