import _ from "underscore";
import React from "react";

import FieldTypes from "../constants/FieldTypes";
import Util from "../utils/Util";

export default class FormControl extends React.Component {

  renderGroup(definition) {
    return definition.map((inputOptions) => {
      return this.renderDefinition(inputOptions, definition.length);
    });
  }

  renderType(definition, columnLength) {
    let fieldTypeName = definition.fieldType;
    let FieldTypeComponent = FieldTypes[fieldTypeName];
    let props = this.props;
    let attributes = _.omit(props, "definition");
    columnLength = columnLength || 1;

    return (
      <FieldTypeComponent
        {...attributes}
        {..._.omit(definition, "value", "fieldType")}
        key={definition.name}
        startValue={props.currentValue[definition.name]}
        type={definition.fieldType}
        columnWidth={Math.floor(12 / columnLength)} />
    );
  }

  renderDefinition(definition, columnLength) {
    if (Util.isArray(definition)) {
      return this.renderGroup(definition);
    }

    return this.renderType(definition, columnLength);
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
