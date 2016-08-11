import React from 'react';
import ReactDOM from 'react-dom';

import ComponentWrapper from '../components/ComponentWrapper';
import Form from '../../../src/Form/Form.js';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';

class FormExample extends React.Component {
  getDefinition() {
    return [
      [
        {
          fieldType: 'text',
          name: 'description',
          placeholder: 'First name',
          showError: 'Setting "showError" will make a field display an error',
          writeType: 'input'
        },
        {
          fieldType: 'text',
          name: 'uid',
          placeholder: 'Last name',
          required: true,
          value: 'Last name',
          writeType: 'input'
        }
      ],
      {
        fieldType: 'password',
        name: 'Password',
        required: true,
        showLabel: true,
        validation: function (value) {
          return value && value.length > 8;
        },
        validationErrorText: 'Password needs to be greater than 8 characters',
        writeType: 'input'
      },
      {
        fieldType: 'number',
        name: 'Number',
        required: false,
        showLabel: true,
        max: '10',
        min: '0',
        step: '1',
        validation: function (value) {
          return value >= 0 && value <= 10;
        },
        validationErrorText: 'Must be a positive integer between 0 and 10 representing its priority',
        writeType: 'input'
      },
      {
        fieldType: 'checkbox',
        name: 'single-checkbox',
        checked: true,
        disabled: true,
        showLabel: 'Accept terms of service',
        required: true,
        label: 'Single checkbox',
        value: true,
        validation: function (value) {
          return value;
        },
        validationErrorText: 'Must check checkbox!',
        writeType: 'input'
      },
      {
        fieldType: 'select',
        label: 'Level',
        showLabel: true,
        options: [
          {
            html: 'Senior',
            id: 'senior'
          },
          {
            html: 'Junior',
            id: 'junior'
          }
        ],
        value: 'junior',
        name: 'level',
        validation: function (value) {
          return !!value;
        },
        validationErrorText: 'One option has to be selected'
      },
      {
        fieldType: 'checkbox',
        value: [
          {
            name: 'isManager',
            label: 'Manager',
            checked: false
          },
          {
            name: 'isDeveloper',
            label: 'Developer',
            checked: false
          },
          {
            name: 'isSRE',
            label: 'SRE',
            checked: true
          }
        ],
        showLabel: 'What is your role?',
        name: 'role',
        validation: function (value) {;
          return value.some(function (item) {
            return item.checked;
          });
        },
        validationErrorText: 'Please select at least one option.',
        writeType: 'input'
      },
      {
        fieldType: 'radioButton',
        value: [
          {
            disabled: true,
            name: 'bananas',
            label: 'Bananas (disabled)',
            checked: false
          },
          {
            name: 'apple',
            label: 'Apple',
            checked: false
          },
          {
            name: 'pineapple',
            label: 'Pineapple',
            checked: true
          },
          {
            name: 'other',
            label: 'Something else',
            checked: false
          }
        ],
        showLabel: 'What is your favorite fruit?',
        name: 'fruit',
        validation: function (value) {
          return value.some(function (item) {
            return item.checked;
          });
        },
        validationErrorText: 'Please select at least one option.',
        writeType: 'input'
      },
      {
        fieldType: 'textarea',
        name: 'message',
        required: true,
        showLabel: 'Message',
        validation: function (value) {
          return value && value.length < 140;
        },
        validationErrorText: 'Message needs to be less than 140 characters',
        writeType: 'input'
      },
      {
        fieldType: 'submit',
        buttonText: 'Submit',
        buttonClass: 'button button-primary button-wide'
      }
    ];
  }

  render() {
    return (
      <ComponentWrapper title="Form" srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Form/Form.js">
        <div className="row row-flex row-flex">
          <div className="column-12">
            <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/Form/Form.js)'} toggleClasses="flush-top" />
          </div>
        </div>
        <div className="example-block flush-bottom">
          <div className="example-block-content">
            <div className="row row-flex">
              <div className="column-9">
                <Form definition={this.getDefinition()} />
              </div>
            </div>
          </div>
          <div className="example-block-footer example-block-footer-codeblock">
            <pre className="prettyprint linenums flush-bottom">
{`import {Form} from 'reactjs-components';
import React from 'react';

class FormExample extends React.Component {
  getDefinition() {
    return [
      [
        {
          fieldType: 'text',
          name: 'description',
          placeholder: 'First name',
          showError: 'Setting "showError" will make a field display an error',
          writeType: 'input'
        },
        {
          fieldType: 'text',
          name: 'uid',
          placeholder: 'Last name',
          required: true,
          value: 'Last name',
          writeType: 'input'
        }
      ],
      {
        fieldType: 'password',
        name: 'Password',
        required: true,
        showLabel: true,
        validation: function (value) {
          return value && value.length > 8;
        },
        validationErrorText: 'Password needs to be greater than 8 characters',
        writeType: 'input'
      },
      {
        fieldType: 'number',
        name: 'Number',
        required: false,
        showLabel: true,
        max: '10',
        min: '0',
        step: '1',
        validation: function (value) {
          return value >= 0 && value <= 10;
        },
        validationErrorText: 'Must be a positive integer between 0 and 10 representing its priority',
        writeType: 'input'
      },
      {
        fieldType: 'checkbox',
        name: 'single-checkbox',
        checked: true,
        disabled: true,
        showLabel: 'Accept terms of service',
        required: true,
        label: 'Single checkbox',
        value: true,
        validation: function (value) {
          return value;
        },
        validationErrorText: 'Must check checkbox!',
        writeType: 'input'
      },
      {
        fieldType: 'checkbox',
        value: [
          {
            name: 'isManager',
            label: 'Manager',
            checked: false
          },
          {
            name: 'isDeveloper',
            label: 'Developer',
            checked: false
          },
          {
            name: 'isSRE',
            label: 'SRE',
            checked: true
          }
        ],
        showLabel: 'What is your role?',
        name: 'role',
        validation: function (value) {
          let result = false;
          value.forEach(function (item) {
            return item.checked;
          });

          return result;
        },
        validationErrorText: 'Please select at least one option.',
        writeType: 'input'
      },
      {
        fieldType: 'radioButton',
        value: [
          {
            disabled: true,
            name: 'bananas',
            label: 'Bananas (disabled)',
            checked: false
          },
          {
            name: 'apple',
            label: 'Apple',
            checked: false
          },
          {
            name: 'pineapple',
            label: 'Pineapple',
            checked: true
          },
          {
            name: 'other',
            label: 'Something else',
            checked: false
          }
        ],
        showLabel: 'What is your favorite fruit?',
        name: 'fruit',
        validation: function (value) {
          let result = false;
          value.forEach(function (item) {
            return item.checked;
          });

          return result;
        },
        validationErrorText: 'Please select at least one option.',
        writeType: 'input'
      },
      {
        fieldType: 'select',
        label: 'Level',
        showLabel: true,
        options: [
          {
            html: 'Senior',
            id: 'Senior'
          },
          {
            html: 'Junior',
            id: 'junior'
          }
        ],
        value: 'junior',
        name: 'level',
        validation: function (value) {
          return !!value;
        },
        validationErrorText: 'One option has to be selected'
      },
      {
        fieldType: 'textarea',
        name: 'message',
        required: true,
        showLabel: 'Message',
        validation: function (value) {
          return value && value.length < 140;
        },
        validationErrorText: 'Message needs to be less than 140 characters',
        writeType: 'input'
      },
      {
        fieldType: 'submit',
        buttonText: 'Submit',
        buttonClass: 'button button-primary button-wide'
      }
    ];
  }

  render() {
    return (
      <Form definition={this.getDefinition()} />
    );
  }
}`}
            </pre>
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

ReactDOM.render(<FormExample />, document.getElementById('form'));
