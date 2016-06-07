import classNames from 'classnames/dedupe';
import React from 'react';

import FieldTypes from './FieldTypes';
import Util from '../Util/Util';

class FormControl extends React.Component {

  renderGroup(definition) {
    return definition.map((inputOptions, i) => {
      return this.renderDefinition(
        inputOptions, definition.length, i === definition.length - 1
      );
    });
  }

  renderType(definition, columnLength = 1, isLast) {
    let fieldTypeName = definition.fieldType;
    let FieldTypeComponent = FieldTypes[fieldTypeName];
    let props = this.props;
    let columnWidth;

    if (definition.columnWidth == null) {
      let maxColumnWidth = props.maxColumnWidth;
      columnWidth = Math.floor(maxColumnWidth / columnLength);
      if (isLast) {
        columnWidth += maxColumnWidth % columnLength;
      }
    } else {
      columnWidth = definition.columnWidth;
    }

    return (
      <FieldTypeComponent
        {...Util.exclude(props, 'definition')}
        {...Util.exclude(definition, 'value', 'fieldType')}
        key={definition.name}
        startValue={props.currentValue[definition.name]}
        type={definition.fieldType}
        columnWidth={columnWidth} />
    );
  }

  renderDefinition(definition, columnLength, isLast) {
    if (Util.isArray(definition)) {
      return this.renderGroup(definition);
    }

    if (React.isValidElement(definition)) {
      return definition;
    }

    return this.renderType(definition, columnLength, isLast);
  }

  render() {
    let props = this.props;
    let content = this.renderDefinition(props.definition);

    if (Util.isArray(content)) {
      content = Util.flatten(content);
    }

    return (
      <div className={classNames(props.formRowClass)}>
        {content}
      </div>
    );
  }
}

FormControl.propTypes = {
  // Optional number of columns in the grid
  maxColumnWidth: React.PropTypes.number,

  // Object with key as field propterty name, and value as current value
  currentValue: React.PropTypes.object,

  // Form definition to build the form from. Can be either:
  // 1. Array of field definitions will be created on same row
  // 2. Field definition (object) will create a single field in that row
  definition: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ])
};

module.exports = FormControl;
