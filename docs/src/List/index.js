import React from 'react';

import List from '../../../src/List/List.js';

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
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <div className="row row-flex row-flex-align-vertical-center">
              <div className="column-12">
                <h2>
                  Lists
                </h2>
                <p>
                  Create lists with custom elements and transitions.
                </p>
                <p>
                  View full source&nbsp;
                  <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/List/List.js">here</a>.
                </p>
                <div className="row row-flex row-flex">
                  <div className="column-12">
                    <h3>Properties API</h3>
                    <div className="example-block">
                      <div className="example-block-footer example-block-footer-codeblock">
                        <pre className="prettyprint linenums flush-bottom">
    {`List.propTypes = {
      className: PropTypes.string,
      // List of items in the list
      items: PropTypes.arrayOf(
        // Each item in the array should be an object
        React.PropTypes.shape({
          // Optionally add a class to a given item
          className: PropTypes.string,
          // An item can be a container of another ist
          items: PropTypes.array,
          // Optional tag for item instead of an \`li\`
          tag: PropTypes.string,
          // If this item isn't a list of other items just use a value
          value: PropTypes.string
        })
      ).isRequired,
      // Optional tag for the container of the list
      tag: PropTypes.string,
      transition: PropTypes.bool,
      transitionName: PropTypes.string
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
                        <List
                          items={this.getComplexNestedList()}
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
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">

{`import {List} from 'reactjs-components';

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
    return <List items={list} tag="ol" />
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

React.render(<ListExample />, document.getElementById('list'));
