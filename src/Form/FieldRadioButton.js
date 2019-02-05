import classNames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";

import BindMixin from "../Mixin/BindMixin";
import Util from "../Util/Util";

class FieldRadioButton extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ["handleChange"];
  }

  shouldComponentUpdate(nextProps) {
    return !Util.isEqual(this.props, nextProps);
  }

  hasError() {
    const { props } = this;
    const validationError = props.validationError;

    return !!(validationError && validationError[props.name]);
  }

  getErrorMsg() {
    const { helpBlockClass, name, validationError } = this.props;

    if (!this.hasError()) {
      return null;
    }

    return (
      <p className={classNames(helpBlockClass)}>{validationError[name]}</p>
    );
  }

  handleChange(eventName, name, event) {
    const { props } = this;

    if (eventName === "multipleChange") {
      const model = props.startValue.reduce(
        function(changedItems, item) {
          if (item.checked && item.name !== name) {
            item.checked = false;
            changedItems.push(item);
          }

          return changedItems;
        },
        [{ name, checked: event.target.checked }]
      );

      props.handleEvent(eventName, props.name, model, event);
    }

    if (eventName === "change") {
      props.handleEvent(eventName, props.name, event.target.checked, event);
    }
  }

  getLabel() {
    const { showLabel, name } = this.props;
    let label = name;

    if (!showLabel) {
      return null;
    }

    if (typeof showLabel === "string") {
      label = showLabel;
    }

    if (typeof showLabel !== "string" && showLabel !== true) {
      return showLabel;
    }

    return <p>{label}</p>;
  }

  getItemLabel(attributes) {
    if (!attributes.label) {
      return null;
    }

    const radioButtonLabelClass = classNames(
      "form-element-radio-button-label",
      attributes.radioButtonLabelClass,
      this.props.radioButtonLabelClass
    );

    return <span className={radioButtonLabelClass}>{attributes.label}</span>;
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

    const htmlAttributes = Util.exclude(
      attributes,
      Object.keys(FieldRadioButton.propTypes)
    );

    return (
      <label className={labelClasses} key={index}>
        <input
          onChange={this.handleChange.bind(this, eventName, attributes.name)}
          type="radio"
          {...htmlAttributes}
        />
        <span className={indicatorClasses} />
        {this.getItemLabel(attributes)}
      </label>
    );
  }

  getItems() {
    const { labelClass, startValue } = this.props;

    if (!Util.isArray(startValue)) {
      // Fetch other attributes from props
      const value = {};
      if (startValue != null) {
        value.checked = startValue;
      }
      const model = Util.extend({}, this.props, value);

      return this.getItem("change", labelClass, model, 0);
    }

    return startValue.map(
      this.getItem.bind(this, "multipleChange", labelClass)
    );
  }

  getRowClass() {
    const { columnWidth, formElementClass } = this.props;

    return classNames(
      `form-row-element column-${columnWidth}`,
      formElementClass
    );
  }

  render() {
    const {
      formGroupClass,
      formGroupErrorClass,
      itemWrapperClass
    } = this.props;

    const classes = classNames(
      { [formGroupErrorClass]: this.hasError() },
      formGroupClass
    );

    return (
      <div className={this.getRowClass()}>
        <div className={classes}>
          {this.getLabel()}
          <div className={classNames(itemWrapperClass)}>{this.getItems()}</div>
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldRadioButton.defaultProps = {
  columnWidth: 12,
  handleEvent() {}
};

const classPropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.string
]);

FieldRadioButton.propTypes = {
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
  // Attributes to pass to radio button(s)
  // (usually passed down from form definition)
  startValue: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  // Optional object of error messages, with key equal to field property name
  validationError: PropTypes.object,

  // Classes
  formElementClass: classPropType,
  formGroupClass: classPropType,
  // Class to be toggled, can be overridden by formGroupClass
  formGroupErrorClass: PropTypes.string,
  helpBlockClass: classPropType,
  itemWrapperClass: classPropType,
  labelClass: classPropType,
  radioButtonLabelClass: classPropType
};

module.exports = FieldRadioButton;
