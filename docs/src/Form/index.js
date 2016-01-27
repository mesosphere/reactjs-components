import React from 'react';

import Form from '../../../src/Form/Form.js';

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
        fieldType: 'checkbox',
        name: 'single-checkbox',
        showLabel: 'Accept terms of service',
        required: true,
        label: 'Single checkbox',
        validation: function (value) {
          return value && value.checked;
        },
        validationErrorText: 'Must check checkbox!',
        writeType: 'input'
      },
      {
        fieldType: 'checkboxMultiple',
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
            checked: false
          }
        ],
        showLabel: 'What is your role?',
        name: 'role',
        validation: function (value) {
          let result = false;
          value.forEach(function (item) {
            if (item.checked) {
              result = item.checked;
            }
          });

          return result;
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
      }
    ];
  }

  render() {

    return (
      <div>
        <section className="row canvas-pod">
          <div>
            <div className="row row-flex row-flex-align-vertical-center">
              <div className="column-12">
                <h2>
                  Forms
                </h2>
                <p>
                  Create forms with custom elements.
                </p>
                <p>
                  View full source&nbsp;
                  <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Form/Form.js">
                    here
                  </a>.
                </p>
                <div className="row row-flex row-flex">
                  <div className="column-12">
                    <h3>Properties API</h3>
                    <div className="example-block">
                      <div className="example-block-footer example-block-footer-codeblock">
                        <pre className="prettyprint linenums flush-bottom">
{`Form.propTypes = {
  // Classes.
  className: PropTypes.string,
  formGroupClass: PropTypes.string,
  formRowClass: PropTypes.string,
  helpBlockClass: PropTypes.string,
  inlineIconClass: PropTypes.string,
  inlineTextClass: PropTypes.string,
  inputClass: PropTypes.string,
  readClass: PropTypes.string,
  sharedClass: PropTypes.string,

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
};`}
                        </pre>
                      </div>
                    </div>
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
          showError: 'Setting "showError" will make a field display an error'
        },
        {
          fieldType: 'text',
          name: 'uid',
          placeholder: 'Last name',
          required: true
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
        validationErrorText: 'Password needs to be greater than 8 characters'
      },
      {
        fieldType: 'checkboxMultiple',
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
            checked: false
          }
        ],
        showLabel: 'What is your role?',
        name: 'role',
        validation: function (value) {
          let result = false;
          value.forEach(function (item) {
            if (item.checked) {
              result = item.checked;
            }
          });

          return result;
        },
        validationErrorText: 'Please select at least one option.'
      },
      {
        fieldType: 'textarea',
        name: 'message',
        required: true,
        showLabel: 'Message',
        validation: function (value) {
          return value && value.length < 140;
        },
        validationErrorText: 'Message needs to be less than 140 characters'
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
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

React.render(<FormExample />, document.getElementById('form'));
