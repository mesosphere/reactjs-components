import classNames from "classnames";

import React from "react";
import IconCheckboxes from "./icons/IconCheckboxes";

const METHODS_TO_BIND = ["handleChange"];

export default class FieldCheckbox extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    if (this.props.startValue === "indeterminate") {
      React.findDOMNode(this.refs.checkbox).indeterminate = true;
    }
  }

  handleChange() {
    let value = null;
    let checkbox = React.findDOMNode(this.refs.checkbox);

    if (checkbox.checked) {
      value = "checked";
    } else {
      value = "unchecked";
    }

    this.props.handleEvent("change", this.props.name, value);
  }

  getLabel() {
    if (this.props.label) {
      return (
        <span className="form-element-checkbox-label">
          {this.props.label}
        </span>
      );
    }

    return null;
  }

  render() {
    let attributes;
    let startValue = this.props.startValue;

    let labelClass = classNames({
      "form-row-element form-element-checkbox": true,
      [this.props.labelClass]: true
    });

    if (startValue === "checked" || startValue === "unchecked") {
      attributes = {
        checked: startValue === "checked"
      };
    }

    return (
      <label className={labelClass}>
        <input ref="checkbox" type="checkbox"
          onChange={this.handleChange}
          {...attributes} />
        <span className="form-element-checkbox-decoy">
          <IconCheckboxes />
        </span>
        {this.getLabel()}
      </label>
    );
  }
}
