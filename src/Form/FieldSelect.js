import classNames from 'classnames/dedupe';
import React from 'react';

import Dropdown from '../Dropdown/Dropdown';

class FieldSelect extends React.Component {

  handleChange(selectedValue) {
    this.props.handleEvent('change',
      this.props.name, selectedValue);
  }

  hasError() {
    let {props} = this;
    let validationError = props.validationError;
    return !!(validationError && validationError[props.name]);
  }

  getDropDown(dropdownItems) {
    let {
      defaultValue,
      dropdownMenuButtonClassName,
      dropdownMenuClassName,
      dropdownMenuListClassName,
      dropdownMenuWrapperClassName,
      persistentID
    } = this.props;

    if (defaultValue == null) {
      defaultValue = dropdownItems[0];
    }

    if (typeof defaultValue === 'string'){
      defaultValue = {
        html: defaultValue,
        id: defaultValue.toLowerCase()
      };
    }

    let dropdownMenuButtonClassSet = classNames('button dropdown-toggle',
      dropdownMenuButtonClassName);
    let dropdownMenuClassSet = classNames('dropdown-menu',
      dropdownMenuClassName);
    let dropdownMenuListClassSet = classNames('dropdown-menu-list',
      dropdownMenuListClassName);
    let dropdownMenuWrapperClassSet = classNames('dropdown',
      dropdownMenuWrapperClassName);

    return (
      <Dropdown buttonClassName={dropdownMenuButtonClassSet}
        dropdownMenuClassName={dropdownMenuClassSet}
        dropdownMenuListClassName={dropdownMenuListClassSet}
        items={dropdownItems}
        onItemSelection={this.handleChange.bind(this)}
        transition={true}
        persistentID={persistentID}
        initialID={defaultValue.id}
        wrapperClassName={dropdownMenuWrapperClassSet} />
    );
  }

  getErrorMsg() {
    let errorMsg = null;
    let {props} = this;

    if (this.hasError()) {
      errorMsg = (
        <p className={props.helpBlockClass}>
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
          id: option.toLowerCase()
        };
      }

      return option;
    });

    let classes = classNames(
      formGroupClass,
      {
        [formGroupErrorClass]: this.hasError()
      }
    );

    let rowClass = classNames(
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
  formElementClass: 'form-row-element'
};

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
  defaultValue: React.PropTypes.oneOfType([
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
  formGroupClass: React.PropTypes.string,
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: React.PropTypes.string,
  formElementClass: React.PropTypes.string,

  //Classes for the Dropdown
  dropdownMenuButtonClassName: React.PropTypes.string,
  dropdownMenuListClassName: React.PropTypes.string,
  dropdownMenuClassName: React.PropTypes.string,
};

module.exports = FieldSelect;
