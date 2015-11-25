import _ from "underscore";
import React from "react";
const PropTypes = React.PropTypes;

import FormControl from "./FormControl";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleSubmit",
  "handleBlur",
  "handleValueChange",
  "handleOnFocus"
];

function findFieldOption(options, field) {
  return _.find(options, function (fieldOption) {
    return fieldOption.fieldName === field;
  });
}

export default class Form extends React.Component {
  constructor() {
    super();

    this.state = {
      prevSaveModel: {},
      model: {},
      editingField: "",
      erroredFields: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.handleSubmit.bind(this));
    }

    this.setState({
      model: this.buildModel(this.props.definition),
      prevSaveModel: this.buildModel(this.props.definition)
    });
  }

  handleSubmit() {
    let validated = this.validateSubmit();

    if (validated) {
      // else, make a request or something with the model.
      return;
    }
  }

  handleValueChange(field, value) {
    let model = _.clone(this.state.model);
    model[field] = value;

    this.setState({model});
  }

  handleBlur(fieldName) {
    let prevValue = this.state.prevSaveModel[fieldName];
    let currentValue = this.state.model[fieldName];

    if (prevValue !== currentValue) {
      this.handleSubmit();
    }

    this.setState({editingField: null});
  }

  handleOnFocus(fieldName) {
    let fieldOption = findFieldOption(this.props.definition, fieldName);
    if (fieldOption.writeType === "edit") {
      this.setState({editingField: fieldName});
    }
  }

  validateValue(field, value) {
    let validation = findFieldOption(this.props.definition, field).validation;

    if (typeof validation === "function") {
      return validation(value);
    }

    return value.match(validation);
  }

  validateSubmit() {
    var failedFields = _.filter(Object.keys(this.state.model), (fieldName) => {
      let model = this.state.model;
      let validated = this.validateValue(fieldName, model[fieldName]);

      if (!validated) {
        return true;
      }

      let options = findFieldOption(this.props.definition, fieldName);
      if (options.required) {
        return model[fieldName] == null;
      }

      return false;
    });

    let erroredFields = {};
    failedFields.forEach(function (field) {
      erroredFields[field] = true;
    });

    this.setState({erroredFields});

    return failedFields.length === 0;
  }

  buildModel(definition) {
    let model = {};

    definition.forEach((formControlOption) => {
      if (Util.isArray(formControlOption)) {
        _.merge(model, this.buildModel(formControlOption));
        return;
      }

      model[formControlOption.fieldName] = formControlOption.value || null;
    });

    return model;
  }

  getFormControls(definition) {
    return definition.map((formControlOption, i) => {
      let fieldName = formControlOption.fieldName;
      let currentlyEditing = fieldName === this.state.editingField;

      let showError = this.state.erroredFields[fieldName]
        || formControlOption.showError;

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          onBlur={this.handleBlur}
          onFocus={this.handleOnFocus}
          onSubmit={this.handleSubmit}
          onChange={this.handleValueChange}
          editing={currentlyEditing}
          validationError={showError} />
      );
    });
  }

  render() {
    let formControls = this.getFormControls(this.props.definition);

    return (
      <form>
        {formControls}
      </form>
    );
  }
}

Form.propTypes = {
  definition: PropTypes.array,
  onSubmit: PropTypes.func

};

Form.defaultProps = {
  onSubmit: function () {},
  definition: {}
};

/*
  [
    {
      fieldName: "username",
      value: "string",
      validation: fn/regex,
      placeholder: "",
      fieldType: "",
      required: true
    },
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
  ]
*/

/*
  TODO:
  -x- Util to combine schema/options
  -x- Different field types
  -x- Required fields
  -x- Placeholders
  ??? Handle form submit
  Switch modes between edit, read, input (also, elements)
  Only validate on submit
  Figure out what a schema looks like and how to better merge it
  Submission within form
  Validation error shows help text
*/
