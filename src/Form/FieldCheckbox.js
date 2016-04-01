import classNames from 'classnames';
import React from 'react';

import BindMixin from '../Mixin/BindMixin';
import ItemCheckbox from './ItemCheckbox';
import Util from '../Util/Util';

class FieldCheckbox extends Util.mixin(BindMixin) {
  hasError() {
    let {props} = this;
    let validationError = props.validationError;
    return !!(validationError && validationError[props.name]);
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
    let {props} = this;
    let label = props.name;
    let showLabel = props.showLabel;

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
      <p>
        {label}
      </p>
    );
  }

  getRowClass(props) {
    return classNames(
      `column-${props.columnWidth}`,
      props.formElementClass
    );
  }

  render() {
    let {props} = this;
    let classes = classNames(
      props.formGroupClass,
      {
        [props.formGroupErrorClass]: this.hasError()
      }
    );

    let checked = this.props.checked;

    if (this.props.startValue != null) {
      checked = this.props.startValue;
    }

    return (
      <div className={this.getRowClass(props)}>
        <div className={classes}>
          {this.getLabel()}
          <ItemCheckbox
            {...this.props}
            checked={checked}/>
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldCheckbox.defaultProps = {
  columnWidth: 12,
  formElementClass: 'form-row-element checkbox',
  handleEvent: function () {}
};

FieldCheckbox.propTypes = {
  // Optional value for setting the checked state of the checkbox,
  // should be either true for 'checked' or false 'unchecked'
  checked: React.PropTypes.bool,
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  // Optional value to initialize the component with a non-empty checkbox
  // value, should be either true for 'checked' or false 'unchecked'
  startValue: React.PropTypes.bool,
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,

  // Classes
  formElementClass: React.PropTypes.string,
  formGroupClass: React.PropTypes.string,
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: React.PropTypes.string,
  labelClass: React.PropTypes.string
};

module.exports = FieldCheckbox;
