import classNames from "classnames/dedupe";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import throttle from "lodash.throttle";

import FieldInput from "./FieldInput";
import IconEdit from "./icons/IconEdit";
import Util from "../Util/Util";

class FieldTextarea extends FieldInput {
  get methodsToBind() {
    return [
      "handleContentEditableBlur",
      "handleContentEditableChange",
      "handleContentEditableFocus"
    ];
  }

  constructor() {
    super(...arguments);

    this.state = { height: this.props.minHeight };
    this.updateTextareaHeight = throttle(this.updateTextareaHeight, 100);
  }

  componentDidMount() {
    super.componentDidMount(...arguments);

    if (this.isEditing() || this.props.writeType === "input") {
      this.updateTextareaHeight(this.refs.inputElement);

      // React throws a warning if children are specified in an element with
      // contenteditable="true", so this hack allows us to set a default value
      // for this form field.
      if (this.props.startValue) {
        this.refs.inputElement.textContent = this.props.startValue;
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !Util.isEqual(this.props, nextProps) ||
      !Util.isEqual(this.state, nextState)
    );
  }

  handleContentEditableBlur(event) {
    const { props } = this;
    props.handleEvent("blur", props.name, event.target.innerText, event);
  }

  handleContentEditableChange(event) {
    const { props } = this;

    this.updateTextareaHeight(event.target);
    props.handleEvent("change", props.name, event.target.innerText, event);
  }

  handleContentEditableFocus(event) {
    const { props } = this;
    props.handleEvent("focus", props.name, event.target.innerText, event);
  }

  getInputElement(attributes, htmlAttributes) {
    const {
      inlineIconClass,
      inlineTextClass,
      inputClass,
      minHeight,
      renderer,
      sharedClass,
      value,
      writeType
    } = this.props;
    let inputContent = null;

    const classes = classNames("content-editable", inputClass, sharedClass);

    htmlAttributes = this.bindEvents(htmlAttributes);

    if (this.isEditing() || writeType === "input") {
      inputContent = (
        <div
          className="content-editable-wrapper"
          style={{ height: `${this.state.height}px` }}
        >
          <div
            ref="inputElement"
            className={classes}
            {...htmlAttributes}
            contentEditable={true}
            onBlur={this.handleContentEditableBlur}
            onFocus={this.handleContentEditableFocus}
            onInput={this.handleContentEditableChange}
            style={{ minHeight: `${minHeight}px` }}
          />
        </div>
      );
    } else {
      inputContent = (
        <span
          ref="inputElement"
          {...htmlAttributes}
          className={classes}
          onClick={htmlAttributes.onFocus}
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

  updateTextareaHeight(domElement) {
    const { minHeight, maxHeight, scrollHeightOffset } = this.props;
    let newHeight = minHeight;
    const { scrollHeight } = domElement;

    if (scrollHeight > minHeight && scrollHeight < maxHeight) {
      newHeight = scrollHeight + scrollHeightOffset;
    } else if (scrollHeight >= maxHeight) {
      newHeight = maxHeight;
    }

    if (newHeight !== this.state.height) {
      this.setState({ height: newHeight });
    }
  }
}

FieldTextarea.defaultProps = {
  maxHeight: 400,
  minHeight: 100,
  scrollHeightOffset: 2
};

FieldTextarea.propTypes = {
  maxHeight: React.PropTypes.number,
  minHeight: React.PropTypes.number,
  scrollHeightOffset: React.PropTypes.number
};

module.exports = FieldTextarea;
