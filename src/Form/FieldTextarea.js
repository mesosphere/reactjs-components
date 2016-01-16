import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import FieldInput from './FieldInput';
import IconEdit from './icons/IconEdit';

module.exports = class FieldTextarea extends FieldInput {
  getInputElement(attributes) {
    let {props} = this;
    let inputContent = null;

    let classes = classNames(props.inputClass, props.sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || props.writeType === 'input') {
      inputContent = (
        <textarea
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
}
