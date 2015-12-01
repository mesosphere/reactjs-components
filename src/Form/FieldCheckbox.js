import React from "react";

export default class FieldCheckbox extends React.Component {
  componentDidMount() {
    if (this.props.startValue === "indeterminate") {
      React.findDOMNode(this.refs.checkbox).indeterminate = true;
    }
  }

  render() {
    let attributes;
    let startValue = this.props.startValue;

    if (startValue === "checked" || startValue === "unchecked") {
      attributes = {
        checked: startValue === "checked"
      };
    }

    return (
      <label className="form-row-element form-row-element-checkbox">
        <input ref="checkbox" type="checkbox"
          onChange={this.props.handleEvent.bind(
            this,
            "onChange",
            this.props.name
          )}
          {...attributes} />
        <span className="form-row-element-checkbox-label">
          {this.props.label}
        </span>
      </label>
    );
  }
}
