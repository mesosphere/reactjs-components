import _ from "underscore";
import React from "react";
const PropTypes = React.PropTypes;

import FormControl from "./FormControl";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleBlur",
  "handleEvent",
  "handleOnFocus",
  "handleSubmit",
  "handleValueChange"
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
      model: this.buildStateObj(this.props.definition, "value"),
      erroredFields: this.buildStateObj(this.props.definition, "showError")
    });
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props;
    let state = this.state;
    let nextState = {};
    let currentModel = this.buildStateObj(props.definition, "value");
    let nextModel = this.buildStateObj(nextProps.definition, "value");
    if (!_.isEqual(currentModel, nextModel)) {
      nextState.model = _.extend({}, state.model, nextModel);
    }

    let currentErrors = this.buildStateObj(props.definition, "showError");
    let nextErrors = this.buildStateObj(nextProps.definition, "showError");
    if (!_.isEqual(currentErrors, nextErrors)) {
      nextState.erroredFields = _.extend(
        {}, state.erroredFields, nextErrors
      );
    }

    this.setState(nextState);
  }

  handleEvent(eventType, fieldName, fieldValue) {
    switch (eventType) {
      case "blur":
        this.handleBlur(fieldName);
        break;
      case "change":
        this.handleValueChange(fieldName, fieldValue);
        break;
      case "focus":
        this.handleOnFocus(fieldName);
        break;
    }

    this.props.onChange(this.state.model);
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    let model = this.state.model;
    let props = this.props;
    let validated = this.validateSubmit(
      model, props.definition
    );

    if (validated && props.onSubmit) {
      props.onSubmit(model);
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

    if (validation == null) {
      return true;
    }

    if (typeof validation === "function") {
      return validation(value);
    }

    return validation.test(value);
  }

  validateSubmit(model, definition) {
    let erroredFields = {};
    let submitValidated = true;

    Object.keys(model).forEach((name) => {
      let fieldValue = model[name];
      let options = findFieldOption(definition, name);
      let validated = this.validateValue(
        name, fieldValue, definition
      );

      if (!validated) {
        erroredFields[name] = options.validationErrorText;
        submitValidated = false;
        return;
      }

      if (options.required && (fieldValue == null || fieldValue === "")) {
        erroredFields[name] = "Field cannot be empty.";
        submitValidated = false;
      }
    });

    // Set the errored fields into state so we can render correctly.
    this.setState({erroredFields});

    return submitValidated;
  }

  buildStateObj(definition, fieldProp) {
    let stateObj = {};

    _.flatten(definition).forEach((formControlOption) => {
      stateObj[formControlOption.name] = formControlOption[fieldProp] || null;
    });

    return stateObj;
  }

  buildFormPropObj(formControlOption, stateObj) {
    let name = formControlOption.name;
    let isArray = Util.isArray(formControlOption);
    let propObj = {};

    if (isArray) {
      formControlOption.forEach((option) => {
        propObj[option.name] =
          stateObj[option.name];
      });
    } else {
      propObj[name] = stateObj[name];
    }

    return propObj;
  }

  getFormControls(definition) {
    let state = this.state;
    let classes = _.pick(
      this.props,
      "formControlClass",
      "helpBlockClass",
      "inlineIconClass",
      "inlineTextClass",
      "inputClass",
      "readClass",
      "sharedClass"
    );

    return definition.map((formControlOption, i) => {
      // Map each field to showError boolean
      let showError =
        this.buildFormPropObj(formControlOption, state.erroredFields);

      // Map each field to it's current value.
      let currentValue =
        this.buildFormPropObj(formControlOption, state.model);

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          editing={state.editingField}
          validationError={showError}
          currentValue={currentValue}
          handleEvent={this.handleEvent}
          handleSubmit={this.handleSubmit}
          maxColumnWidth={this.props.maxColumnWidth}
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
  // Classes.
  className: PropTypes.string,
  formControlClass: PropTypes.string,
  helpBlockClass: PropTypes.string,
  inlineIconClass: PropTypes.string,
  inlineTextClass: PropTypes.string,
  inputClass: PropTypes.string,
  readClass: PropTypes.string,
  sharedClass: PropTypes.string,

  definition: PropTypes.array,
  maxColumnWidth: PropTypes.number,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  triggerSubmit: PropTypes.func
};

Form.defaultProps = {
  // Classes.
  className: "form flush-bottom",
  formControlClass: "row form-group",
  helpBlockClass: "form-help-block",
  inlineIconClass: "form-element-inline-icon",
  inlineTextClass: "form-element-inline-text",
  inputClass: "form-control",
  readClass: "read-only",

  definition: {},
  onChange: function () {},
  onSubmit: function () {},
  maxColumnWidth: 12,
  triggerSubmit: function () {}
};
