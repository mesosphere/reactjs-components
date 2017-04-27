import classNames from "classnames/dedupe";
import React, { PropTypes } from "react";

import BindMixin from "../Mixin/BindMixin";
import FormControl from "./FormControl";
import Util from "../Util/Util";

// Find a the options for a particular field in the form.
function findFieldOption(options, field) {
  const flattenedOptions = Util.flatten(options);

  return Util.find(flattenedOptions, function(fieldOption) {
    var isField = fieldOption.name === field;
    if (fieldOption.fieldType === "object" && !isField) {
      return findFieldOption(fieldOption.definition, field);
    }

    return isField;
  });
}

function mergeNewModel(
  stateModel,
  currentDefinitionModel,
  nextDefinitionModel
) {
  const newModel = {};
  const stateModelClone = Util.extend({}, stateModel);

  // This allows us to remove fields on the model, if we remove that field from
  // the definition.
  Object.keys(stateModelClone).forEach(function(modelKey) {
    if (!Object.prototype.hasOwnProperty.call(nextDefinitionModel, modelKey)) {
      delete stateModelClone[modelKey];
    }
  });

  // This makes sure we only update the keys that are different.
  Object.keys(nextDefinitionModel).forEach(function(key) {
    if (currentDefinitionModel[key] !== nextDefinitionModel[key]) {
      newModel[key] = nextDefinitionModel[key];
    }
  });

  return Util.extend({}, stateModelClone, newModel);
}

class Form extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      "getBlurChange",
      "getOnFocusChange",
      "getValueChange",
      "handleEvent",
      "handleSubmit"
    ];
  }

  constructor() {
    super();

    this.state = {
      model: {},
      editingField: "",
      erroredFields: {}
    };

    this.submitMap = {};
  }

  componentWillMount() {
    super.componentWillMount();

    if (this.props.triggerSubmit) {
      this.props.triggerSubmit(this.handleSubmit);
    }

    this.setState({
      model: this.buildStateObj(this.props.definition, "value"),
      erroredFields: this.buildStateObj(this.props.definition, "showError")
    });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps();

    const props = this.props;
    const state = this.state;
    const nextState = {};
    const currentModel = this.buildStateObj(props.definition, "value");
    const nextModel = this.buildStateObj(nextProps.definition, "value");
    if (!Util.isEqual(currentModel, nextModel)) {
      nextState.model = mergeNewModel(state.model, currentModel, nextModel);
    }

    if (this.props.useExternalErrors) {
      nextState.erroredFields = this.buildStateObj(
        nextProps.definition,
        "showError"
      );
    } else {
      const currentErrors = this.buildStateObj(props.definition, "showError");
      const nextErrors = this.buildStateObj(nextProps.definition, "showError");
      if (!Util.isEqual(currentErrors, nextErrors)) {
        nextState.erroredFields = mergeNewModel(
          state.erroredFields,
          currentErrors,
          nextErrors
        );
      }
    }

    this.setState(nextState);
  }

  handleEvent(eventType, fieldName, fieldValue, event, ...rest) {
    const eventObj = { eventType, fieldName, fieldValue, event };
    let newState = {};

    switch (eventType) {
      case "blur":
        newState = this.getBlurChange(fieldName);
        break;
      case "change":
        newState = this.getValueChange(fieldName, fieldValue);
        break;
      case "focus":
        newState = this.getOnFocusChange(fieldName);
        break;
      case "multipleChange":
        newState = this.getMultipleChange(fieldName, fieldValue);
    }

    // If there is no change to the model, just return the old one
    const newModel = newState.model || this.state.model;
    const onChange = this.props.onChange.bind(
      this,
      newModel,
      eventObj,
      ...rest
    );
    if (Object.keys(newState).length) {
      // Make sure to call onChange on setState callback,
      // so users can get updated model from triggerSubmit
      this.setState(newState, onChange);
    } else {
      onChange();
    }
  }

  getTriggerSubmit(formKey, triggerSubmit) {
    this.submitMap[formKey] = triggerSubmit;
  }

  handleSubSubmit(formKey, model) {
    this.state.model[formKey] = model;
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const model = this.state.model;
    const props = this.props;
    const validated = this.validateSubmit(model, props.definition);

    Object.keys(this.submitMap).forEach(formKey => {
      this.submitMap[formKey]();
    });

    if (!validated) {
      props.onError();
    }

    if (validated && props.onSubmit) {
      props.onSubmit(model);
    }
  }

  getValueChange(field, value) {
    const model = Util.clone(this.state.model);
    model[field] = value;

    return { model };
  }

  getMultipleChange(field, values) {
    const model = Util.clone(this.state.model);
    model[field].forEach(function(item) {
      const { name } = item;
      if (Util.isArray(values)) {
        values.forEach(function(value) {
          // Update value in field
          if (name === value.name) {
            Util.extend(item, value);
          }
        });
      } else if (name === values.name) {
        Util.extend(item, values);
      }
    });

    return { model };
  }

  getBlurChange(field) {
    const options = findFieldOption(this.props.definition, field);

    if (options.writeType === "input") {
      return {};
    }

    this.handleSubmit();

    return { editingField: null };
  }

  getOnFocusChange(name) {
    const fieldOption = findFieldOption(this.props.definition, name);

    if (fieldOption.writeType === "edit") {
      return { editingField: name };
    }

    return {};
  }

  validateValue(field, value, definition) {
    const options = findFieldOption(definition, field);

    if (options == null || options.validation == null) {
      return true;
    }

    const { validation } = options;

    if (typeof validation === "function") {
      return validation(value);
    }

    return validation.test(value);
  }

  validateSubmit(model, definition) {
    let erroredFields = {};
    let submitValidated = true;

    Object.keys(model).forEach(name => {
      const options = findFieldOption(definition, name);
      if (options == null) {
        return true;
      }

      const fieldValue = model[name];
      const validated = this.validateValue(name, fieldValue, definition);

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

    erroredFields = Util.extend(
      {},
      this.buildStateObj(this.props.definition, "showError"),
      erroredFields
    );

    // Set the errored fields into state so we can render correctly.
    this.setState({ erroredFields });

    return submitValidated;
  }

  buildStateObj(definition, fieldProp) {
    const stateObj = {};
    Util.flatten(definition).forEach(formControlOption => {
      // If the element is a React element, then we don't want to add it to the
      // state object, which represents the form values.
      if (
        React.isValidElement(formControlOption) ||
        formControlOption.render ||
        formControlOption.fieldType === "submit"
      ) {
        return;
      }

      if (formControlOption.fieldType === "object") {
        stateObj[formControlOption.name] = this.buildStateObj(
          formControlOption.definition,
          fieldProp
        );

        return;
      }

      stateObj[formControlOption.name] = formControlOption[fieldProp] || null;
    });

    return stateObj;
  }

  buildFormPropObj(formControlOption, stateObj) {
    const name = formControlOption.name;
    const propObj = {};

    if (Util.isArray(formControlOption)) {
      formControlOption.forEach(function(option) {
        propObj[option.name] = stateObj[option.name];
      });
    } else {
      propObj[name] = stateObj[name];
    }

    return propObj;
  }

  getFormControls(definition) {
    const { props, state } = this;
    const classes = {
      formGroupClass: "form-group",
      formGroupErrorClass: "form-group-danger",
      formRowClass: "row",
      helpBlockClass: "form-control-feedback",
      inlineIconClass: "form-element-inline-icon",
      inlineTextClass: "form-element-inline-text",
      inputClass: "form-control",
      readClass: "read-only"
    };

    Object.keys(classes).forEach(function(className) {
      classes[className] = classNames(classes[className], props[className]);
    });

    return definition.map((formControlOption, i) => {
      // If it's a React element, we just want to return it. We need to add a
      // key to the object because we're iterating over a list of items.
      if (React.isValidElement(formControlOption)) {
        return (
          <span key={i}>
            {formControlOption}
          </span>
        );
      }

      if (formControlOption.render && !formControlOption.definition) {
        return formControlOption.render();
      }

      if (formControlOption.fieldType === "object") {
        const nestedDefinition = [formControlOption.render()].concat(
          formControlOption.definition
        );

        return (
          <Form
            className={this.props.className}
            key={i}
            definition={nestedDefinition}
            triggerSubmit={this.getTriggerSubmit.bind(
              this,
              formControlOption.name
            )}
            onChange={this.props.onChange}
            onSubmit={this.handleSubSubmit.bind(this, formControlOption.name)}
            formTag="div"
          />
        );
      }

      // Map each field to showError boolean
      const showError = this.buildFormPropObj(
        formControlOption,
        state.erroredFields
      );

      // Map each field to it's current value.
      const currentValue = this.buildFormPropObj(
        formControlOption,
        state.model
      );

      return (
        <FormControl
          key={i}
          definition={formControlOption}
          editing={state.editingField}
          validationError={showError}
          currentValue={currentValue}
          handleEvent={this.handleEvent}
          handleSubmit={this.handleSubmit}
          maxColumnWidth={props.maxColumnWidth}
          {...classes}
        />
      );
    });
  }

  render() {
    const { className, definition, key } = this.props;

    return (
      <this.props.formTag
        key={key}
        onSubmit={this.handleSubmit}
        className={classNames("form flush-bottom", className)}
      >
        {this.getFormControls(definition)}
      </this.props.formTag>
    );
  }
}

const classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

Form.defaultProps = {
  definition: {},
  formTag: "form",
  key: "",
  maxColumnWidth: 12,
  onChange() {},
  onError() {},
  onSubmit() {},
  triggerSubmit() {}
};

Form.propTypes = {
  // Classes.
  className: classPropType,
  formGroupClass: classPropType,
  formGroupErrorClass: classPropType,
  formRowClass: classPropType,
  helpBlockClass: classPropType,
  inlineIconClass: classPropType,
  inlineTextClass: classPropType,
  inputClass: classPropType,
  readClass: classPropType,
  sharedClass: classPropType,

  formTag: PropTypes.string,
  key: PropTypes.node,

  // Form definition to build the form from. Contains either:
  // 1. Array of field definitions will be created on same row
  // 2. Field definition (object) will create a single field in that row
  definition: PropTypes.arrayOf(
    React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array])
  ),

  // Optional number of columns in the grid
  maxColumnWidth: PropTypes.number,
  // Optional function to call on error
  onError: PropTypes.func,
  // Optional function to call on change
  onChange: PropTypes.func,
  // Optional function to call on submit
  onSubmit: PropTypes.func,
  // Optional function. Will receive a trigger function.
  // Call the trigger function, when a submit needs to be triggered externally
  triggerSubmit: PropTypes.func,
  // If set to true, errors will be completely driven from the form definition.
  useExternalErrors: PropTypes.bool
};

module.exports = Form;
