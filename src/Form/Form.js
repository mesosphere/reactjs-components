import _ from "underscore";
import React from "react";
const PropTypes = React.PropTypes;

import FormControl from "./FormControl";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleSubmit",
  "handleBlur",
  "handleValueChange",
  "handleOnFocus",
  "handleEvent"
];

// Find a the options for a particular field in the form.
function findFieldOption(options, field) {
  let flattenedOptions = _.flatten(options);
  return _.find(flattenedOptions, function (fieldOption) {
    return fieldOption.name === field;
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
      this.props.triggerSubmit(this.handleSubmit);
    }

    this.setState({
      model: this.buildModel(this.props.definition),
      erroredFields: this.buildErroredFields(this.props.definition)
    });
  }

  handleEvent(eventType, fieldName, eventObj) {
    switch (eventType) {
      case "onBlur":
        this.handleBlur(fieldName);
        break;
      case "onChange":
        this.handleValueChange(fieldName, eventObj.target.value);
        break;
      case "onFocus":
        this.handleOnFocus(fieldName);
        break;
      case "onKeyDown":
        this.handleValueChange(fieldName, eventObj.target.value);
    }
  }

  handleSubmit() {
    let validated = this.validateSubmit(
      this.state.model, this.props.definition
    );

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

  handleBlur(field) {
    let options = findFieldOption(this.props.definition, field);

    if (options.writeType === "input") {
      return;
    }

    this.handleSubmit();
    this.setState({editingField: null});
  }

  handleOnFocus(name) {
    let fieldOption = findFieldOption(this.props.definition, name);

    if (fieldOption.writeType === "edit") {
      this.setState({editingField: name});
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
    let erroredFields = {};
    let submitValidated = true;

    Object.keys(model).forEach((name) => {
      let options = findFieldOption(definition, name);
      let validated = this.validateValue(
        name, model[name], definition
      );

      if (!validated) {
        erroredFields[name] = options.validationErrorText;
        submitValidated = false;
        return;
      }

      if (options.required) {
        let isEmpty = model[name] == null || model[name] === "";
        if (isEmpty) {
          erroredFields[name] = "Field cannot be empty.";
          submitValidated = false;
        }
      }
    });

    // Set the errored fields into state so we can render correctly.
    this.setState({erroredFields});

    return submitValidated;
  }

  buildModel(definition) {
    let model = {};
    let flattenedOptions = _.flatten(definition);
    flattenedOptions.forEach((formControlOption) => {
      model[formControlOption.name] = formControlOption.value || null;
    });

    return model;
  }

  buildErroredFields(definition) {
    let flattenedOptions = _.flatten(definition);
    let erroredFields = {};

    flattenedOptions.forEach((formControlOption) => {
      if (formControlOption.showError) {
        erroredFields[formControlOption.name] = formControlOption.showError;
      }
    });

    return erroredFields;
  }

  getFormControls(definition) {
    let classes = _.pick(
      this.props,
      "readClass",
      "inputClass",
      "formControlClass",
      "helpBlockClass"
    );

    return definition.map((formControlOption, i) => {
      let isArray = Util.isArray(formControlOption);
      let name = formControlOption.name;

      // Map each field to showError boolean
      let showError = {};
      if (isArray) {
        formControlOption.forEach((option) => {
          showError[option.name] =
            this.state.erroredFields[option.name];
        });
      } else {
        showError[name] = this.state.erroredFields[name];
      }

      // Map each field to it's current value.
      let currentValue = {};
      if (isArray) {
        formControlOption.forEach((option) => {
          currentValue[option.name] = this.state.model[option.name];
        });
      } else {
        currentValue[name] = this.state.model[name];
      }

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          editing={this.state.editingField}
          validationError={showError}
          currentValue={currentValue}
          handleEvent={this.handleEvent}
          {...classes} />
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={this.props.className}>
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
