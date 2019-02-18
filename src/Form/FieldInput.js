import classNames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import BindMixin from "../Mixin/BindMixin";
import IconEdit from "./icons/IconEdit";
import KeyboardUtil from "../Util/KeyboardUtil";
import Util from "../Util/Util";

const EVENTS = ["blur", "change", "focus"];

class FieldInput extends Util.mixin(BindMixin) {
  constructor() {
    super(...arguments);
    this.inputElementRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return !Util.isEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    const inputElement = ReactDOM.findDOMNode(this.inputElementRef.current);

    if (this.isEditing() && inputElement !== global.document.activeElement) {
      inputElement.focus();
    }
  }

  componentDidMount() {
    const inputElement = ReactDOM.findDOMNode(this.inputElementRef.current);
    if (
      inputElement != null &&
      inputElement.type === "text" &&
      this.props.focused
    ) {
      // Don't interfere with existing transitions
      setTimeout(function() {
        var valueLength = inputElement.value.length;
        inputElement.focus();
        inputElement.setSelectionRange(valueLength, valueLength);
      }, 0);
    }
  }

  bindEvents(attributes) {
    EVENTS.forEach(event => {
      const htmlEvent = `on${Util.capitalize(event)}`;
      attributes[htmlEvent] = this.handleEvent.bind(this, event);
    });

    return attributes;
  }

  handleEvent(event, eventObj) {
    const { props } = this;
    props.handleEvent(event, props.name, eventObj.target.value, eventObj);
  }

  handleKeyDown(event) {
    const { props } = this;
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === KeyboardUtil.keys.enter) {
      if (props.writeType === "input") {
        props.handleSubmit();
      }

      const inputNode = ReactDOM.findDOMNode(this.inputElementRef.current);

      if(inputNode) {
        ReactDOM.findDOMNode(this.inputElementRef.current).blur();
      }
    }
  }

  hasError() {
    const { props } = this;
    const validationError = props.validationError;

    return !!(validationError && validationError[props.name]);
  }

  isEditing() {
    const { props } = this;

    return props.editing === props.name && props.writeType === "edit";
  }

  getRowClass(props) {
    return classNames(
      `form-row-element column-${props.columnWidth}`,
      props.formElementClass,
      {
        "form-row-edit": this.isEditing(),
        "form-row-input": props.writeType === "input",
        "form-row-read": !this.isEditing() && props.writeType === "edit"
      }
    );
  }

  getErrorMsg() {
    let errorMsg = null;
    const { props } = this;

    if (this.hasError()) {
      errorMsg = (
        <p className={classNames(props.helpBlockClass)}>
          {props.validationError[props.name]}
        </p>
      );
    }

    return errorMsg;
  }

  getHelpBlock() {
    const { helpBlock, helpBlockClass } = this.props;

    if (!helpBlock) {
      return null;
    }

    return <span className={classNames(helpBlockClass)}>{helpBlock}</span>;
  }

  getLabel() {
    const { labelClass, name, showLabel } = this.props;
    let contents = name;

    if (!showLabel) {
      return null;
    }

    if (typeof showLabel === "string") {
      contents = showLabel;
    }

    if (typeof showLabel !== "string" && showLabel !== true) {
      return showLabel;
    }

    return <label className={classNames(labelClass)}>{contents}</label>;
  }

  getInputElement(attributes) {
    const {
      inlineIconClass,
      inlineTextClass,
      inputClass,
      renderer,
      sharedClass,
      value,
      writeType,
      fieldType
    } = this.props;
    let inputContent = null;

    const classes = classNames(inputClass, sharedClass);
    attributes = this.bindEvents(attributes);

    const htmlAttributes = Util.exclude(
      attributes,
      Object.keys(FieldInput.propTypes)
    );

    if (this.isEditing() || writeType === "input") {
      inputContent = (
        <input
          ref={this.inputElementRef}
          className={classes}
          onKeyDown={this.handleKeyDown.bind(this)}
          name={attributes.name}
          value={attributes.startValue}
          lang={fieldType === "number" ? navigator.language : null}
          {...htmlAttributes}
        />
      );
    } else {
      inputContent = (
        <span
          ref={this.inputElementRef}
          {...htmlAttributes}
          className={classes}
          onClick={attributes.onFocus}
        >
          <span className={classNames(inlineTextClass)}>
            {value || attributes.startValue}
          </span>
          <span className={classNames(inlineIconClass)}>
            <IconEdit />
          </span>
        </span>
      );
    }

    if (renderer) {
      return renderer(inputContent);
    }

    return inputContent;
  }

  render() {
    const { props } = this;

    const attributes = Util.exclude(props, "onChange", "value");

    const classes = classNames(
      { [props.formGroupErrorClass]: this.hasError() },
      props.formGroupClass
    );

    return (
      <div className={this.getRowClass(props)}>
        <div className={classes}>
          {this.getLabel()}
          {this.getInputElement(attributes)}
          {this.getHelpBlock()}
          {this.getErrorMsg()}
        </div>
      </div>
    );
  }
}

FieldInput.defaultProps = {
  columnWidth: 12,
  handleEvent() {},
  value: "",
  writeType: "input"
};

const classPropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.string
]);

FieldInput.propTypes = {
  // Number of columns to take up of the grid
  columnWidth: PropTypes.number.isRequired,
  // Optional. Which field property is currently being edited
  // (usually passed down from form definition)
  editing: PropTypes.string,
  // Optional. Specify if the field should be focused
  // Useful in combination with preset values, will set cursor to end of input
  // (usually passed down from form definition)
  focused: PropTypes.bool,
  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: PropTypes.func,
  // Function to handle events like 'change', 'blur', 'focus', etc on the field
  // (usually passed down from form definition)
  handleEvent: PropTypes.func,
  // Optional label to add
  label: PropTypes.string,
  // Optional help block
  helpBlock: PropTypes.node,
  // Name of the field property
  // (usually passed down from form definition)
  name: PropTypes.string.isRequired,
  // Custom render function, receives the input element as its only argument
  renderer: PropTypes.func,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.bool
  ]),
  // initial value of field
  startValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ]),
  // Optional object of error messages, with key equal to field property name
  validationError: PropTypes.object,
  // Optional value of the field
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ]),
  // Optional field to set input to 'edit' or 'input' mode
  writeType: PropTypes.string,

  // Classes
  formElementClass: classPropType,
  formGroupClass: classPropType,
  // Class to be toggled, can be overridden by formGroupClass
  formGroupErrorClass: PropTypes.string,
  helpBlockClass: classPropType,
  inlineIconClass: classPropType,
  inlineTextClass: classPropType,
  labelClass: classPropType,
  sharedClass: classPropType,
  fieldType: PropTypes.string,
  currentValue: PropTypes.object,
  maxColumnWidth: PropTypes.number,
  formRowClass: PropTypes.string,
  inputClass: PropTypes.string,
  readClass: PropTypes.string,
  validation: PropTypes.func,
  validationErrorText: PropTypes.string,
  showError: PropTypes.string,
  errorText: PropTypes.string
};

module.exports = FieldInput;
