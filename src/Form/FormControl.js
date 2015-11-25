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
        errorMsg={definition.errorText}
        fieldName={definition.fieldName}
        placeholder={definition.placeholder}
        showLabel={definition.showLabel}
        type={definition.fieldType}
        writeType={definition.writeType} />
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

// FormControl.propTypes = {
//   key: PropTypes.any,
//   definition: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.array
//   ]),
//   handleBlur: PropTypes.func,
//   handleOnFocus: PropTypes.func,
//   handleSubmit: PropTypes.func,
//   handleValueChange: PropTypes.func,
//   editing: PropTypes.bool
// };

/*
  {
    fieldName: "username",
    value: "string",
    validation: fn/regex,
    placeholder: "",
    fieldType: "",
    required: true
  }

  OR

  [
    {
      fieldName: "password",
      value: "string",
      validation: fn/regex,
      placeholder: "",
      fieldType: "",
      required: true
    },
    {
      fieldName: "addy",
      value: "string",
      validation: fn/regex,
      placeholder: "",
      fieldType: "",
      required: true
    }
  ]
*/










/*
  <form>

    <input />
*/
