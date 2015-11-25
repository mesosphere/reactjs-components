import _ from "underscore";
import React from "react";

import FieldTypes from "../constants/FieldTypes";
import Util from "../utils/Util";

export default class FormControl extends React.Component {

  renderGroup(definition) {
    return definition.map((inputOptions) => {
      return this.renderDefinition(inputOptions);
    });
  }

  renderType(definition) {
    let fieldTypeName = definition.fieldType;
    let FieldTypeComponent = FieldTypes[fieldTypeName];
    let props = this.props;
    let attributes = _.omit(props, "definition");

    return (
      <FieldTypeComponent
        {...attributes}
        {..._.omit(definition, "value", "fieldType")}
        key={definition.fieldName}
        startValue={props.currentValue[definition.fieldName]}
        type={definition.fieldType} />
    );
  }

  renderDefinition(definition) {
    if (Util.isArray(definition)) {
      return this.renderGroup(definition);
    }

    return this.renderType(definition);
  }

  render() {
    let content = this.renderDefinition(this.props.definition);

    if (Util.isArray(content)) {
      content = _.flatten(content);
    }

    return (
      <div className="form-row">
        {content}
      </div>
    );
  }
}
