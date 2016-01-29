import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import IconEdit from './icons/IconEdit';
import KeyboardUtil from '../Util/KeyboardUtil';
import Util from '../Util/Util';

const EVENTS = ['blur', 'change', 'focus'];

class FieldInput extends React.Component {
  componentDidUpdate() {
    let inputElement = ReactDOM.findDOMNode(this.refs.inputElement);

    if (this.isEditing() && inputElement !== global.document.activeElement) {
      inputElement.focus();
    }
  }

  bindEvents(attributes) {
    EVENTS.forEach((event) => {
      let htmlEvent = `on${Util.capitalize(event)}`;
      attributes[htmlEvent] = this.handleEvent.bind(this, event);
    });

    return attributes;
  }

  handleEvent(event, eventObj) {
    let {props} = this;
    props.handleEvent(event, props.name, eventObj.target.value, eventObj);
  }

  handleKeyDown(event) {
    let {props, refs} = this;
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === KeyboardUtil.keys.enter) {
      if (props.writeType === 'input') {
        props.handleSubmit();
      }

      ReactDOM.findDOMNode(refs.inputElement).blur();
    }
  }

  hasError() {
    let {props} = this;
    let validationError = props.validationError;
    return !!(validationError && validationError[props.name]);
  }

  isEditing() {
    let {props} = this;
    return props.editing === props.name
      && props.writeType === 'edit';
  }

  getRowClass(props) {
    return classNames(
      `column-${props.columnWidth}`,
      'form-row-element',
      {
        'form-row-edit': this.isEditing(),
        'form-row-input': props.writeType === 'input',
        'form-row-read': !this.isEditing() && props.writeType === 'edit'
      });
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
      <label>{label}</label>
    );
  }

  getInputElement(attributes) {
    let {props} = this;
    let inputContent = null;

    let classes = classNames(props.inputClass, props.sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || props.writeType === 'input') {
      inputContent = (
        <input
          ref="inputElement"
          className={classes}
          onKeyDown={this.handleKeyDown.bind(this)}
          {...attributes}
          value={attributes.startValue} />
      );
    } else {
      inputContent = (
        <span
          ref="inputElement"
          {...attributes}
          className={classes}
          onClick={attributes.onFocus}>
          <span className={props.inlineTextClass}>
            {props.value || attributes.startValue}
          </span>
          <span className={props.inlineIconClass}>
            <IconEdit />
          </span>
        </span>
      );
    }

    if (this.props.renderer) {
      return this.props.renderer(inputContent);
    }

    return inputContent;
  }

  render() {
    let {props} = this;

    let attributes = Util.exclude(props, 'onChange', 'value');

    let classes = classNames(
      props.formGroupClass,
      {
        [props.formGroupErrorClass]: this.hasError()
      }
    );

    return (
      <div className={this.getRowClass(props)}>
        <div className={classes}>
          {this.getLabel()}
          {this.getInputElement(attributes)}
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldInput.defaultProps = {
  columnWidth: 12,
  handleEvent: function () {},
  value: '',
  writeType: 'input'
};

FieldInput.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Optional. Which field property is currently being edited
  // (usually passed down from form definition)
  editing: React.PropTypes.string,
  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: React.PropTypes.func,
  // Function to handle events like 'change', 'blur', 'focus', etc on the field
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,
  // Optional label to add
  label: React.PropTypes.string,
  // Name of the field property
  // (usually passed down from form definition)
  name: React.PropTypes.string.isRequired,
  // Custom render function, receives the input element as its only argument
  renderer: React.PropTypes.func,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  // initial value of field
  startValue: React.PropTypes.string,
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,
  // Optional value of the field
  value: React.PropTypes.string,
  // Optional field to set input to 'edit' or 'input' mode
  writeType: React.PropTypes.string,

  // Classes
  formGroupClass: React.PropTypes.string,
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: React.PropTypes.string,
  labelClass: React.PropTypes.string
};

module.exports = FieldInput;
