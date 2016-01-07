import classNames from 'classnames';
import React from 'react';

import BindMixin from '../Mixin/BindMixin';
import ItemCheckbox from './ItemCheckbox';
import Util from '../Util/Util';

export default class FieldCheckbox extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ['handleChange'];
  }

  handleChange(name, modelState) {
    let {props} = this;

    props.handleEvent(
      'multipleChange',
      props.name,
      {
        name: name,
        checked: modelState.checked,
        indeterminate: modelState.indeterminate
      }
    );
  }

  hasError() {
    let {props} = this;
    let validationError = props.validationError;
    return !!(validationError && validationError[props.name]);
  }

  getErrorMsg() {
    let {props} = this;
    let errorMsg = null;
    let validationError = props.validationError;
    if (validationError && validationError[props.name]) {
      errorMsg = (
        <p className={props.helpBlockClass}>
          {validationError[props.name]}
        </p>
      );
    }

    return errorMsg;
  }

  getDescription() {
    let {props} = this;
    if (!props.description) {
      return null;
    }

    return (
      <p className={props.descriptionClass}>
        {props.description}
      </p>
    );
  }

  getItems() {
    let {props, handleChange} = this;
    return props.startValue.map(function (attributes, index) {
      return (
        <ItemCheckbox
          labelClass={props.labelClass}
          handleChange={handleChange}
          key={index}
          {...attributes} />
      );
    });
  }

  getRowClass(props) {
    return classNames(
      `column-${props.columnWidth}`,
      'form-row-element checkbox'
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

    return (
      <div className={this.getRowClass(this.props)}>
        <div className={classes}>
          {this.getDescription()}
          <div ref="checkboxes">
            {this.getItems()}
          </div>
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldCheckbox.defaultProps = {
  columnWidth: 12,
  handleEvent: function () {}
};

FieldCheckbox.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Function to handle change event
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,
  // Optional description for field
  description: React.PropTypes.string,
  // Array of checkbox states to render
  // (usually passed down from value in form definition)
  startValue: React.PropTypes.array.isRequired,
  // Optional name of the field property
  // (usually passed down from form definition)
  name: React.PropTypes.string,
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,

  // Classes
  descriptionClass: React.PropTypes.string,
  formGroupClass: React.PropTypes.string,
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: React.PropTypes.string,
  labelClass: React.PropTypes.string
};
