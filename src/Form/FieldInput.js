import classNames from "classnames/dedupe";
import React from "react";
import ReactDOM from "react-dom";

import BindMixin from "../Mixin/BindMixin";
import IconEdit from "./icons/IconEdit";
import KeyboardUtil from "../Util/KeyboardUtil";
import Util from "../Util/Util";

const EVENTS = ["blur", "change", "focus"];

class FieldInput extends Util.mixin(BindMixin) {
  shouldComponentUpdate(nextProps) {
    return !Util.isEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    const inputElement = ReactDOM.findDOMNode(this.refs.inputElement);

    if (this.isEditing() && inputElement !== global.document.activeElement) {
      inputElement.focus();
    }
  }

  componentDidMount() {
    const inputElement = ReactDOM.findDOMNode(this.refs.inputElement);
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
    const { props, refs } = this;
    // Force a blur on enter, which will trigger onBlur.
    if (event.key === KeyboardUtil.keys.enter) {
      if (props.writeType === "input") {
        props.handleSubmit();
      }

      ReactDOM.findDOMNode(refs.inputElement).blur();
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

    return (
      <span className={classNames(helpBlockClass)}>
        {helpBlock}
      </span>
    );
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
      writeType
    } = this.props;
    let inputContent = null;

    const classes = classNames(inputClass, sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || writeType === "input") {
      inputContent = (
        <input
          ref="inputElement"
          className={classes}
          onKeyDown={this.handleKeyDown.bind(this)}
          {...attributes}
          value={attributes.startValue}
        />
      );
    } else {
      inputContent = (
        <span
          ref="inputElement"
          {...attributes}
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

const classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

FieldInput.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Optional. Which field property is currently being edited
  // (usually passed down from form definition)
  editing: React.PropTypes.string,
  // Optional. Specify if the field should be focused
  // Useful in combination with preset values, will set cursor to end of input
  // (usually passed down from form definition)
  focused: React.PropTypes.bool,
  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: React.PropTypes.func,
  // Function to handle events like 'change', 'blur', 'focus', etc on the field
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,
  // Optional label to add
  label: React.PropTypes.string,
  // Optional help block
  helpBlock: React.PropTypes.node,
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
  startValue: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,
  // Optional value of the field
  value: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  // Optional field to set input to 'edit' or 'input' mode
  writeType: React.PropTypes.string,

  // Classes
  formElementClass: classPropType,
  formGroupClass: classPropType,
  // Class to be toggled, can be overridden by formGroupClass
  formGroupErrorClass: React.PropTypes.string,
  helpBlockClass: classPropType,
  inlineIconClass: classPropType,
  inlineTextClass: classPropType,
  labelClass: classPropType,
  sharedClass: classPropType
};

module.exports = FieldInput;
