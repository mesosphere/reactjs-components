import classNames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import FieldRadioButton from "./FieldRadioButton";
import Util from "../Util/Util";

class FieldCheckbox extends FieldRadioButton {
  constructor() {
    super(...arguments);

    this.refElements = {};
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    this.updateCheckbox();
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    this.updateCheckbox();
  }

  updateCheckbox() {
    const { props, refElements } = this;
    Object.keys(refElements).forEach(function(refName) {
      const checkbox = ReactDOM.findDOMNode(refElements[refName]);
      let indeterminate;
      // Single checkbox
      if (props.name === refName) {
        indeterminate = props.indeterminate;
      }

      // Multiple checkboxes
      if (Util.isArray(props.startValue)) {
        indeterminate = Util.find(props.startValue, function(item) {
          return item.name === refName;
        }).indeterminate;
      }

      if (indeterminate != null) {
        checkbox.indeterminate = indeterminate;
      }
    });
  }

  handleChange(eventName, name, event) {
    const { props } = this;

    if (eventName === "multipleChange") {
      props.handleEvent(
        eventName,
        props.name,
        { name, checked: event.target.checked },
        event
      );
    }

    if (eventName === "change") {
      props.handleEvent(eventName, props.name, event.target.checked, event);
    }
  }

  getItemLabel(attributes) {
    if (!attributes.label) {
      return null;
    }

    const checkboxLabelClass = classNames(
      "form-element-checkbox-label",
      attributes.checkboxLabelClass,
      this.props.checkboxLabelClass
    );

    return (
      <span className={checkboxLabelClass}>
        {attributes.label}
      </span>
    );
  }

  getItem(eventName, labelClass, attributes, index) {
    const labelClasses = classNames(
      "form-control-toggle form-control-toggle-custom",
      labelClass,
      { mute: attributes.disabled },
      attributes.labelClass
    );

    const indicatorClasses = classNames(
      "form-control-toggle-indicator",
      attributes.indicatorClass
    );

    const htmlAttributes = Util.pick(attributes, [
      "checked",
      "className",
      "disabled",
      "name"
    ]);

    return (
      <label className={labelClasses} key={index}>
        <input
          onChange={this.handleChange.bind(this, eventName, attributes.name)}
          ref={el => (this.refElements[attributes.name] = el)}
          type="checkbox"
          {...htmlAttributes}
        />
        <span className={indicatorClasses} />
        {this.getItemLabel(attributes)}
      </label>
    );
  }

  getRowClass() {
    const { columnWidth, formElementClass } = this.props;

    return classNames(
      `form-row-element column-${columnWidth}`,
      formElementClass
    );
  }
}

FieldCheckbox.defaultProps = {
  columnWidth: 12,
  handleEvent() {}
};

FieldCheckbox.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: PropTypes.number.isRequired,
  // Function to handle change event
  // (usually passed down from form definition)
  handleEvent: PropTypes.func,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.bool
  ]),
  // Optional object of error messages, with key equal to field property name
  validationError: PropTypes.object,

  // Classes
  checkboxButtonLabelClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  startValue: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  labelClass: PropTypes.string,
  indicatorClasses: PropTypes.string,
  indeterminate: PropTypes.bool
};

module.exports = FieldCheckbox;
