import classNames from 'classnames/dedupe';
import React from 'react';

import Dropdown from '../Dropdown/Dropdown';

class FieldSelect extends React.Component {

  handleChange(selectedValue, event) {
    this.props.handleEvent(
      'change',
      this.props.name,
      selectedValue.id,
      event,
      selectedValue
    );
  }

  hasError() {
    let {props} = this;
    let validationError = props.validationError;
    return !!(validationError && validationError[props.name]);
  }

  getDropDown(dropdownItems) {
    let {startValue, persistentID} = this.props;
    let classes = {
      buttonClassName: 'button dropdown-toggle',
      dropdownMenuClassName: 'dropdown-menu',
      dropdownMenuListClassName: 'dropdown-menu-list',
      wrapperClassName: 'dropdown'
    };

    classes = Object.keys(classes).reduce((classSet, className) => {
      classSet[className] = classNames(
        classes[className],
        this.props[className]
      );

      return classSet;
    }, classes);

    if (startValue == null) {
      startValue = dropdownItems[0];
    }

    if (typeof startValue === 'string') {
      startValue = {
        html: startValue,
        id: startValue
      };
    }

    return (
      <Dropdown {...classes}
        initialID={startValue.id}
        items={dropdownItems}
        onItemSelection={this.handleChange.bind(this)}
        persistentID={persistentID}
        transition={true} />
    );
  }

  getErrorMsg() {
    let errorMsg = null;
    let {props} = this;

    if (this.hasError()) {
      errorMsg = (
        <p className={classNames(props.helpBlockClass)}>
          {props.validationError[props.name]}
        </p>
      );
    }

    return errorMsg;
  }

  getLabel() {
    let {label, showLabel} = this.props;

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
      <label>{label}</label>
    );
  }

  render() {
    let {
      columnWidth, formGroupClass, formElementClass, formGroupErrorClass,
      options
    } = this.props;

    options = options.map(function (option) {
      if (typeof option === 'string') {
        return {
          html: option,
          id: option
        };
      }

      return option;
    });

    let classes = classNames(
      {[formGroupErrorClass]: this.hasError()},
      formGroupClass
    );

    let rowClass = classNames(
      'form-row-element',
      `column-${columnWidth}`,
      formElementClass
    );

    return (
      <div className={rowClass}>
        <div className={classes}>
          {this.getLabel()}
          {this.getDropDown(options)}
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldSelect.defaultProps = {
  columnWidth: 12,
  handleEvent: function () {}
};

let classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

FieldSelect.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,

  // Name of the field property
  // (usually passed down from form definition)
  name: React.PropTypes.string.isRequired,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.string,
    React.PropTypes.bool
  ]),

  // Function to handle events like 'change', 'blur', 'focus', etc on the field
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,

  // These are the options for the DropDown Component
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        html: React.PropTypes.string,
        id: React.PropTypes.string
      })
    ])
  ).isRequired,
  startValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.shape({
      html: React.PropTypes.string,
      id: React.PropTypes.string
    })
  ]),
  persisitentID: React.PropTypes.string,

  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,

  // Classes
  formGroupClass: classPropType,
  // Class to be toggled, can be overridden by formGroupClass
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: classPropType,
  formElementClass: classPropType,

  // Classes for the Dropdown
  buttonClassName: classPropType,
  dropdownMenuClassName: classPropType,
  dropdownMenuListClassName: classPropType,
  wrapperClassName: classPropType
};

module.exports = FieldSelect;
