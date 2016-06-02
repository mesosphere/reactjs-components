import classNames from 'classnames/dedupe';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import FieldInput from './FieldInput';
import IconEdit from './icons/IconEdit';

module.exports = class FieldTextarea extends FieldInput {
  getInputElement(attributes) {
    let {
      inlineIconClass,
      inlineTextClass,
      inputClass,
      renderer,
      sharedClass,
      value,
      writeType,
    } = this.props;
    let inputContent = null;

    let classes = classNames(inputClass, sharedClass);
    attributes = this.bindEvents(attributes);

    if (this.isEditing() || writeType === 'input') {
      inputContent = (
        <textarea
          ref="inputElement"
          className={classes}
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
}
