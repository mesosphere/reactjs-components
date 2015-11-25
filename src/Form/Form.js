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
  let flattenedOptions = _.flatten(options);
  return _.find(flattenedOptions, function (fieldOption) {
    return fieldOption.fieldName === field;
  });
}

export default class Form extends React.Component {
  constructor() {
    super();

    this.state = {
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
      erroredFields: this.buildErroredFields(this.props.definition)
    });
  }

  handleSubmit() {
    let validated = this.validateSubmit(this.state.model, this.props.definition);

    if (validated && this.props.onSubmit) {
      this.props.onSubmit(this.state.model);
      return;
    }
  }

  handleValueChange(field, value) {
    let model = _.clone(this.state.model);
    model[field] = value;

    this.setState({model});
  }

  handleBlur() {
    this.handleSubmit();

    this.setState({editingField: null});
  }

  handleOnFocus(fieldName) {
    let fieldOption = findFieldOption(this.props.definition, fieldName);

    if (fieldOption.writeType === "edit") {
      this.setState({editingField: fieldName});
    }
  }

  validateValue(field, value, definition) {
    let validation = findFieldOption(definition, field).validation;

    if (typeof validation === "function") {
      return validation(value);
    }

    return validation.test(value);
  }

  validateSubmit(model, definition) {
    let failedFields = _.filter(Object.keys(model), (fieldName) => {
      let validated = this.validateValue(
        fieldName, model[fieldName], definition
      );
      if (!validated) {
        return true;
      }

      let options = findFieldOption(definition, fieldName);
      if (options.required) {
        return model[fieldName] == null;
      }

      return false;
    });

    // Set the errored fields into state so we can render correctly.
    let erroredFields = {};
    failedFields.forEach(function (field) {
      erroredFields[field] = true;
    });
    this.setState({erroredFields});

    return failedFields.length === 0;
  }

  buildModel(definition) {
    let model = {};
    let flattenedOptions = _.flatten(definition);
    flattenedOptions.forEach((formControlOption) => {
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
    let props = _.pick(
      this.props,
      "readClass",
      "inputClass",
      "formControlClass",
      "helpBlockClass"
    );

    return definition.map((formControlOption, i) => {
      let isArray = Util.isArray(formControlOption);

      let fieldName = formControlOption.fieldName;
      if (isArray) {
        fieldName = formControlOption.map(function (option) {
          return option.fieldName;
        });
      }

      let showError = {};
      if (isArray) {
        formControlOption.map((option) => {
          showError[option.fieldName] =
            this.state.erroredFields[option.fieldName];
        });
      } else {
        showError[fieldName] = this.state.erroredFields[fieldName];
      }

      let currentValue = {};
      if (isArray) {
        formControlOption.forEach((option) => {
          currentValue[option.fieldName] = this.state.model[option.fieldName];
        });
      } else {
        currentValue[fieldName] = this.state.model[fieldName];
      }

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          onBlur={this.handleBlur}
          onFocus={this.handleOnFocus}
          triggerSubmit={this.handleSubmit}
          onChange={this.handleValueChange}
          editing={this.state.editingField}
          validationError={showError}
          currentValue={currentValue}
          {...props} />
      );
    });
  }

  render() {
    return (
      <form className={this.props.className}>
        {this.getFormControls(this.props.definition)}
      </form>
    );
  }
}

Form.propTypes = {
  definition: PropTypes.array,
  onSubmit: PropTypes.func,
  triggerSubmit: PropTypes.func
};

Form.defaultProps = {
  definition: {},
  onSubmit: function () {},
  triggerSubmit: function () {}
};
