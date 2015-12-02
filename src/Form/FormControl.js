import _ from "underscore";
import React from "react";

import FieldTypes from "../constants/FieldTypes";
import Util from "../utils/Util";

export default class FormControl extends React.Component {

  renderGroup(definition) {
    return definition.map((inputOptions, i) => {
      return this.renderDefinition(
        inputOptions, definition.length, i === definition.length - 1
      );
    });
  }

  renderType(definition, columnLength, isLast) {
    let fieldTypeName = definition.fieldType;
    let FieldTypeComponent = FieldTypes[fieldTypeName];
    let props = this.props;
    let maxColumnWidth = props.maxColumnWidth;
    columnLength = columnLength || 1;

    if (isLast) {
      columnLength = Math.floor(maxColumnWidth / columnLength)
        + (maxColumnWidth % columnLength);
    }

    return (
      <FieldTypeComponent
        {..._.omit(props, "definition")}
        {..._.omit(definition, "value", "fieldType")}
        key={definition.name}
        startValue={props.currentValue[definition.name]}
        type={definition.fieldType}
        columnWidth={Math.floor(this.props.maxColumnWidth / columnLength)} />
    );
  }

  renderDefinition(definition, columnLength, isLast) {
    if (Util.isArray(definition)) {
      return this.renderGroup(definition);
    }

    return this.renderType(definition, columnLength, isLast);
  }

  render() {
    let props = this.props;
    let content = this.renderDefinition(props.definition);

    if (Util.isArray(content)) {
      content = _.flatten(content);
    }

    return (
      <div className={props.formControlClass}>
        {content}
      </div>
    );
  }
}
