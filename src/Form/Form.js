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
  var flattenedOptions = _.flatten(options);
  return _.find(flattenedOptions, function (fieldOption) {
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
    if (this.props.triggerSubmit) {
      this.props.triggerSubmit(this.handleSubmit.bind(this));
    }

    this.setState({
      model: this.buildModel(this.props.definition),
      prevSaveModel: this.buildModel(this.props.definition),
      erroredFields: this.buildErroredFields(this.props.definition)
    });
  }

  handleSubmit() {
    let validated = this.validateSubmit();

    if (validated && this.props.onSubmit) {
      this.props.onSubmit(this.state.model);
      this.setState({prevSaveModel: _.clone(this.state.model)});
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

    return validation.test(value);
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
        _.extend(model, this.buildModel(formControlOption));
        return;
      }

      model[formControlOption.fieldName] = formControlOption.value || null;
    });

    return model;
  }

  buildErroredFields(definition) {
    let flattenedOptions = _.flatten(definition);
    let erroredFields = {};

    flattenedOptions.forEach((formControlOption) => {
      if (formControlOption.showError) {
        erroredFields[formControlOption.fieldName] = true;
      }
    });

    return erroredFields;
  }

  getFormControls(definition) {
    let flattenedOptions = _.flatten(definition);

    return flattenedOptions.map((formControlOption, i) => {
      let fieldName = formControlOption.fieldName;
      let currentlyEditing = fieldName === this.state.editingField;

      let showError = this.state.erroredFields[fieldName];

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          onBlur={this.handleBlur}
          onFocus={this.handleOnFocus}
          triggerSubmit={this.handleSubmit}
          onChange={this.handleValueChange}
          editing={currentlyEditing}
          validationError={showError}
          currentValue={this.state.model[fieldName]} />
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
  triggerSubmit: PropTypes.func,
  onSubmit: PropTypes.func

};

Form.defaultProps = {
  triggerSubmit: function () {},
  onSubmit: function () {},
  definition: {}
};

/*
  TODO:
  -x- Util to combine schema/options
  -x- Different field types
  -x- Required fields
  -x- Placeholders
  -x- Only validate on submit
  -x- Submission within form
  -x- Validation error shows help text
  -x- Handle form submit (it takes a callback and passes in the model)
  -x- Have the current values be the value of the input
  Switch modes between edit, read, input (also, elements)
  (another PR) Figure out what a schema looks like and how to better merge it
*/
