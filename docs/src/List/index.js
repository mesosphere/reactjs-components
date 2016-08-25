import React from 'react';
import ReactDOM from 'react-dom';

import CodeBlock from '../components/CodeBlock';
import ComponentExample from '../components/ComponentExample';
import ComponentExampleWrapper from '../components/ComponentExampleWrapper';
import ComponentWrapper from '../components/ComponentWrapper';
import List from '../../../src/List/List.js';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';

class ListExample extends React.Component {
  constructor() {
    super();

    this.state = {
      itemAdded: false
    };

    this.handleExtraItemToggle = this.handleExtraItemToggle.bind(this);
  }

  handleExtraItemToggle() {
    this.setState({
      itemAdded: !this.state.itemAdded
    });
  }

  getComplexNestedList() {
    // Here's an example of a list with customized list items.
    var list = [
      // First item
      {
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
      },
      // Second item
      {
        // Nested items
        content: [
          {
            className: 'text-uppercase',
            style: {
              display: 'block'
            },
            tag: 'strong',
            content: 'Cu movet numquam.'
          },
          {
            className: 'list a',
            tag: 'ol',
            content: [
              {
                content: 'Aliquam tincidunt mauris eu risus.'
              },
              {
                content: [
                  {
                    tag: 'em',
                    content: 'Mauris placerat eleifend leo.'
                  },
                  {
                    className: 'list I',
                    tag: 'ol',
                    content: [
                      {
                        content: 'Suspendisse laoreet. Fusce ut est sed dolor.'
                      },
                      {
                        content: <a>Gravida convallis. Morbi vitae ante.</a>
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      // Third item
      {
        content: 'Vestibulum auctor dapibus neque.'
      }
    ];

    if (this.state.itemAdded) {
      list[1].content[1].content.push({content: 'A wild transitioned list item appears.'});
    }

    return list;
  }

  render() {
    let toggleText = 'Add item';

    if (this.state.itemAdded) {
      toggleText = 'Remove item';
    }

    return (
      <ComponentWrapper title="List" srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/List/List.js">
        <p className="lead flush-bottom">
          Create lists with custom elements and transitions.
        </p>
        <div className="row">
          <div className="column-12">
            <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/List/List.js)'} />
          </div>
        </div>
        <ComponentExampleWrapper>
          <ComponentExample>
            <div className="row row-flex">
              <div className="column-9">
                <List
                  content={this.getComplexNestedList()}
                  tag="ol" />
              </div>
              <div className="column-3">
                <button
                  className="button button-small button-primary button-stroke pull-right"
                  onClick={this.handleExtraItemToggle}>
                  {toggleText}
                </button>
              </div>
            </div>
          </ComponentExample>
          <CodeBlock>
{`import {List} from 'reactjs-components';
import React from 'react';

var list = [
  // First item
  {
    content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
  },
  // Second item
  {
    // Nested items
    content: [
      {
        className: 'text-uppercase',
        style: {
          display: 'block'
        },
        tag: 'strong',
        content: 'Cu movet numquam.'
      },
      {
        className: 'list a',
        tag: 'ol',
        content: [
          {
            content: 'Aliquam tincidunt mauris eu risus.'
          },
          {
            content: [
              {
                tag: 'em',
                content: 'Mauris placerat eleifend leo.'
              },
              {
                className: 'list I',
                tag: 'ol',
                content: [
                  {
                    content: 'Suspendisse laoreet. Fusce ut est sed dolor.'
                  },
                  {
                    content: <a>Gravida convallis. Morbi vitae ante.</a>
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Third item
  {
    content: 'Vestibulum auctor dapibus neque.'
  }
];

class ListExample extends React.Component {
  render() {
    return <List content={list} tag="ol" />
  }
}`}
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }
}

module.exports = ListExample;
