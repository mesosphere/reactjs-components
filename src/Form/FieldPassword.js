import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import FieldInput from './FieldInput';
import IconEdit from './icons/IconEdit';

const METHODS_TO_BIND = ['handleOnBlur', 'handleOnFocus'];

class FieldPassword extends FieldInput {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleOnBlur(event) {
    if (this.focused) {
      this.focused = false;
      this.forceUpdate();
    }

    this.props.handleEvent('blur', this.props.name, event.target.value, event);
  }

  handleOnFocus(event) {
    if (!this.focused) {
      this.focused = true;
      this.forceUpdate();
    }

    this.props.handleEvent('focus', this.props.name, event.target.value, event);
  }

  getInputElement(attributes) {
    let classes = classNames(this.props.inputClass, this.props.sharedClass);
    let inputContent = null;
    attributes = this.bindEvents(attributes, this.props.handleEvent);
    attributes.onBlur = this.handleOnBlur;
    attributes.onFocus = this.handleOnFocus;

    let fieldValue = attributes.defaultPasswordValue ||
      attributes.startValue || '';

    if (this.focused) {
      fieldValue = attributes.startValue;
    }

    if (this.isEditing() || this.props.writeType === 'input') {
      inputContent = (
        <input
          {...attributes}
          ref="inputElement"
          className={classes}
          onKeyDown={this.handleKeyDown.bind(this)}
          value={fieldValue} />
      );
    } else {
      inputContent = (
        <span
          ref="inputElement"
          {...attributes}
          className={classes}
          onClick={attributes.onFocus}>
          <span className={this.props.inlineTextClass}>
            {attributes.defaultPasswordValue || DEFAULT_PASSWORD_TEXT}
          </span>
          <span className={this.props.inlineIconClass}>
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

}

module.exports = FieldPassword;
