import classNames from 'classnames';
import React from 'react';

import BindMixin from '../Mixin/BindMixin';
import IconRadioButton from './icons/IconRadioButton';
import Util from '../Util/Util';

class FieldRadioButton extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ['handleChange'];
  }

  hasError() {
    let {props} = this;
    let validationError = props.validationError;

    return !!(validationError && validationError[props.name]);
  }

  getErrorMsg() {
    let {helpBlockClass, name, validationError} = this.props;

    if (!this.hasError()) {
      return null;
    }

    return (
      <p className={classNames(helpBlockClass)}>
        {validationError[name]}
      </p>
    );
  }

  handleChange(eventName, name, event) {
    let {props} = this;
    let model = [{name, checked: event.target.checked}];

    if (eventName === 'multipleChange') {
      model = props.startValue.reduce(function (changedItems, item) {
        if (item.checked && item.name !== name) {
          item.checked = false;
          changedItems.push(item);
        }

        return changedItems;
      }, model);
    }

    props.handleEvent(eventName, props.name, model, event);
  }

  getLabel() {
    let {showLabel, name} = this.props;
    let label = name;

    if (!showLabel) {
      return null;
    }

    if (typeof showLabel === 'string') {
      label = showLabel;
    }

    if (typeof showLabel !== 'string' && showLabel !== true) {
      return showLabel;
    }

    return (
      <p>{label}</p>
    );
  }

  getItem(eventName, labelClass, disabled, attributes, index) {
    let itemLabel;

    if (attributes.label) {
      let labelClasses = classNames(
        attributes.radioButtonLabelClass,
        this.props.radioButtonLabelClass
      );
      itemLabel = (
        <span className={labelClasses}>
          {attributes.label}
        </span>
      );
    }

    return (
      <label className={labelClass} key={index}>
        <input
          disabled={disabled}
          onChange={this.handleChange.bind(this, eventName, attributes.name)}
          ref="radio"
          type="radio"
          {...attributes} />
        <span className="form-element-radio-button-decoy">
          <IconRadioButton labelClass={labelClass} {...attributes} />
        </span>
        {itemLabel}
      </label>
    );
  }

  getItems() {
    let {disabled, labelClass, startValue} = this.props;

    if (!Util.isArray(startValue)) {
      return this.getItem('change', labelClass, disabled, startValue, 0);
    }

    return startValue.map(
      this.getItem.bind(this, 'multipleChange', labelClass, disabled)
    );
  }

  getRowClass() {
    let {columnWidth, formElementClass} = this.props;

    return classNames(`column-${columnWidth}`, formElementClass);
  }

  render() {
    let {formGroupClass, formGroupErrorClass} = this;

    let classes = classNames(formGroupClass, {
      [formGroupErrorClass]: this.hasError()
    });

    return (
      <div className={this.getRowClass()}>
        <div className={classes}>
          {this.getLabel()}
          {this.getItems()}
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldRadioButton.defaultProps = {
  columnWidth: 12,
  formElementClass: 'form-row-element radio-button',
  handleEvent: function () {},
  labelClass: 'form-row-element form-element-radio-button',
  radioButtonLabelClass: 'form-element-radio-button-label'
};

let classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

FieldRadioButton.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Function to handle change event
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  // Attributes to pass to radio button(s)
  // (usually passed down from form definition)
  startValue: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object
  ]),
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,

  // Classes
  formElementClass: classPropType,
  formGroupClass: classPropType,
  formGroupErrorClass: classPropType,
  helpBlockClass: classPropType,
  labelClass: classPropType,
  radioButtonLabelClass: classPropType
};

module.exports = FieldRadioButton;
