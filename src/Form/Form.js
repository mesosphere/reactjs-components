import React from 'react';
const PropTypes = React.PropTypes;

import BindMixin from '../Mixin/BindMixin';
import FormControl from './FormControl';
import Util from '../Util/Util';

// Find a the options for a particular field in the form.
function findFieldOption(options, field) {
  let flattenedOptions = Util.flatten(options);
  return Util.find(flattenedOptions, function (fieldOption) {
    var isField = fieldOption.name === field;
    if (fieldOption.fieldType === 'object' && !isField) {
      return findFieldOption(fieldOption.definition, field);
    }

    return isField;
  });
}

function mergeNewModel(stateModel, currentDefinitionModel, nextDefinitionModel) {
  let newModel = {};
  let stateModelClone = Util.extend({}, stateModel);

  // This allows us to remove fields on the model, if we remove that field from
  // the definition.
  Object.keys(stateModelClone).forEach(function (modelKey) {
    if (!nextDefinitionModel.hasOwnProperty(modelKey)) {
      delete stateModelClone[modelKey];
    }
  });

  // This makes sure we only update the keys that are different.
  Object.keys(nextDefinitionModel).forEach(function (key) {
    if (currentDefinitionModel[key] !== nextDefinitionModel[key]) {
      newModel[key] = nextDefinitionModel[key];
    }
  });

  return Util.extend({}, stateModelClone, newModel);
}

class Form extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'getBlurChange',
      'getOnFocusChange',
      'getValueChange',
      'handleEvent',
      'handleSubmit'
    ];
  }

  constructor() {
    super();

    this.state = {
      model: {},
      editingField: '',
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
      model: this.buildStateObj(this.props.definition, 'value'),
      erroredFields: this.buildStateObj(this.props.definition, 'showError')
    });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps();

    let props = this.props;
    let state = this.state;
    let nextState = {};
    let currentModel = this.buildStateObj(props.definition, 'value');
    let nextModel = this.buildStateObj(nextProps.definition, 'value');
    if (!Util.isEqual(currentModel, nextModel)) {
      nextState.model = mergeNewModel(state.model, currentModel, nextModel);
    }

    let currentErrors = this.buildStateObj(props.definition, 'showError');
    let nextErrors = this.buildStateObj(nextProps.definition, 'showError');
    if (!Util.isEqual(currentErrors, nextErrors)) {
      nextState.erroredFields = mergeNewModel(
        state.erroredFields,
        currentErrors,
        nextErrors
      );
    }

    this.setState(nextState);
  }

  handleEvent(eventType, fieldName, fieldValue, event, ...rest) {
    let eventObj = {eventType, fieldName, fieldValue, event};
    let newState = {};

    switch (eventType) {
      case 'blur':
        newState = this.getBlurChange(fieldName);
        break;
      case 'change':
        newState = this.getValueChange(fieldName, fieldValue);
        break;
      case 'focus':
        newState = this.getOnFocusChange(fieldName);
        break;
      case 'multipleChange':
        newState = this.getMultipleChange(fieldName, fieldValue);
    }

    // If there is no change to the model, just return the old one
    let newModel = newState.model || this.state.model;
    this.props.onChange(newModel, eventObj, ...rest);
    if (Object.keys(newState).length) {
      this.setState(newState);
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

    let model = this.state.model;
    let props = this.props;
    let validated = this.validateSubmit(
      model, props.definition
    );

    Object.keys(this.submitMap).forEach((formKey) => {
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
    let model = Util.clone(this.state.model);
    model[field] = value;

    return {model};
  }

  getMultipleChange(field, values) {
    let model = Util.clone(this.state.model);
    model[field].forEach(function (item) {
      let {name} = item;
      if (Util.isArray(values)) {
        values.forEach(function (value) {
          // Update value in field
          if (name === value.name) {
            Util.extend(item, value);
          }
        });
      } else if (name === values.name) {
        Util.extend(item, values);
      }
    });

    return {model};
  }

  getBlurChange(field) {
    let options = findFieldOption(this.props.definition, field);

    if (options.writeType === 'input') {
      return {};
    }

    this.handleSubmit();
    return {editingField: null};
  }

  getOnFocusChange(name) {
    let fieldOption = findFieldOption(this.props.definition, name);

    if (fieldOption.writeType === 'edit') {
      return {editingField: name};
    }

    return {};
  }

  validateValue(field, value, definition) {
    let options = findFieldOption(definition, field);

    if (options == null || options.validation == null) {
      return true;
    }

    let {validation} = options;

    if (typeof validation === 'function') {
      return validation(value);
    }

    return validation.test(value);
  }

  validateSubmit(model, definition) {
    let erroredFields = {};
    let submitValidated = true;

    Object.keys(model).forEach((name) => {
      let options = findFieldOption(definition, name);
      if (options == null) {
        return true;
      }

      let fieldValue = model[name];
      let validated = this.validateValue(
        name, fieldValue, definition
      );

      if (!validated) {
        erroredFields[name] = options.validationErrorText;
        submitValidated = false;
        return;
      }

      if (options.required && (fieldValue == null || fieldValue === '')) {
        erroredFields[name] = 'Field cannot be empty.';
        submitValidated = false;
      }
    });

    erroredFields = Util.extend(
      {}, this.buildStateObj(this.props.definition, 'showError'), erroredFields
    );

    // Set the errored fields into state so we can render correctly.
    this.setState({erroredFields});

    return submitValidated;
  }

  buildStateObj(definition, fieldProp) {
    let stateObj = {};
    Util.flatten(definition).forEach((formControlOption) => {
      // If the element is a React element, then we don't want to add it to the
      // state object, which represents the form values.
      if (React.isValidElement(formControlOption)
        || formControlOption.render
        || formControlOption.fieldType === 'submit') {
        return;
      }

      if (formControlOption.fieldType === 'object') {
        stateObj[formControlOption.name] = this.buildStateObj(
          formControlOption.definition, fieldProp
        );

        return;
      }

      stateObj[formControlOption.name] = formControlOption[fieldProp] || null;
    });

    return stateObj;
  }

  buildFormPropObj(formControlOption, stateObj) {
    let name = formControlOption.name;
    let propObj = {};

    if (Util.isArray(formControlOption)) {
      formControlOption.forEach(function (option) {
        propObj[option.name] = stateObj[option.name];
      });
    } else {
      propObj[name] = stateObj[name];
    }

    return propObj;
  }

  getFormControls(definition) {
    let {props, state} = this;
    let classes = Util.pick(props, [
      'formGroupClass',
      'formGroupErrorClass',
      'formRowClass',
      'helpBlockClass',
      'inlineIconClass',
      'inlineTextClass',
      'inputClass',
      'readClass',
      'sharedClass'
    ]);

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

      if (formControlOption.fieldType === 'object') {
        let nestedDefinition = [formControlOption.render()]
          .concat(formControlOption.definition);

        return (
          <Form
            className={this.props.className}
            key={i}
            definition={nestedDefinition}
            triggerSubmit={this.getTriggerSubmit.bind(this, formControlOption.name)}
            onChange={this.props.onChange}
            onSubmit={this.handleSubSubmit.bind(this, formControlOption.name)}
            formTag="div" />
        );
      }

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
          maxColumnWidth={props.maxColumnWidth}
          {...classes} />
      );
    });
  }

  render() {
    /* eslint-disable react/jsx-no-undef */
    return (
      <this.props.formTag
        key={this.props.key}
        onSubmit={this.handleSubmit}
        className={this.props.className}>
        {this.getFormControls(this.props.definition)}
      </this.props.formTag>
    );
    /* eslint-enable react/jsx-no-undef */
  }
}

Form.defaultProps = {
  // Classes.
  className: 'form flush-bottom',
  formGroupClass: 'form-group',
  formGroupErrorClass: 'form-group-error',
  formRowClass: 'row',
  helpBlockClass: 'form-help-block',
  inlineIconClass: 'form-element-inline-icon',
  inlineTextClass: 'form-element-inline-text',
  inputClass: 'form-control',
  readClass: 'read-only',

  formTag: 'form',
  key: '',

  definition: {},
  onChange: function () {},
  onError: function () {},
  onSubmit: function () {},
  maxColumnWidth: 12,
  triggerSubmit: function () {}
};

Form.propTypes = {
  // Classes.
  className: PropTypes.string,
  formGroupClass: PropTypes.string,
  formGroupErrorClass: PropTypes.string,
  formRowClass: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func
  ]),
  helpBlockClass: PropTypes.string,
  inlineIconClass: PropTypes.string,
  inlineTextClass: PropTypes.string,
  inputClass: PropTypes.string,
  readClass: PropTypes.string,
  sharedClass: PropTypes.string,

  formTag: PropTypes.string,
  key: PropTypes.node,

  // Form definition to build the form from. Contains either:
  // 1. Array of field definitions will be created on same row
  // 2. Field definition (object) will create a single field in that row
  definition: PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
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
  triggerSubmit: PropTypes.func
};

module.exports = Form;
