import React from 'react';

import List from '../../../src/List/List.js';

class ListExample extends React.Component {

  constructor() {
    super();
    this.state = {
      itemAdded: false
    };
    this.handleToggleExtraItem = this.handleToggleExtraItem.bind(this);
  }

  handleToggleExtraItem() {
    this.setState({
      itemAdded: !this.state.itemAdded
    });
  }

  getComplexNestedList() {
    // Here's an example of a list with customized list items.

    var complexNestedList = [
      {
        value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
      },
      {
        items: [
          {
            attributes: {
              className: 'text-uppercase',
              style: {
                display: 'block'
              }
            },
            tag: 'strong',
            value: 'Cu movet numquam.'
          },
          {
            attributes: {
              className: 'list a'
            },
            tag: 'ol',
            items: [
              {
                value: 'Aliquam tincidunt mauris eu risus.'
              },
              {
                items: [
                  {
                    tag: 'em',
                    value: 'Mauris placerat eleifend leo.'
                  },
                  {
                    attributes: {
                      className: 'list I'
                    },
                    tag: 'ol',
                    items: [
                      {
                        value: 'Suspendisse laoreet. Fusce ut est sed dolor.'
                      },
                      {
                        value:
                          <a href="#">
                            Gravida convallis. Morbi vitae ante.
                          </a>
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        value: 'Vestibulum auctor dapibus neque.'
      }
    ];

    if (this.state.itemAdded) {
      complexNestedList.push({value: 'A wild transitioned list item appears.'});
    }

    return complexNestedList;
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
                  View full source
                  <a href="https://github.com/mesosphere/reactjs-components/blob/master/docs/src/List/index.js"> here</a>.
                </p>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <div className="row row-flex">
                      <div className="column-9">
                        <List
                          items={this.getComplexNestedList()}
                          tag="ol"
                          transition={true}
                          transitionName="list-item" />
                      </div>
                      <div className="column-3">
                        <button
                          className="button button-small button-primary button-stroke"
                          onClick={this.handleToggleExtraItem}>
                          {toggleText}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">

{`import List from 'List.js';

[...]

var complexNestedList = [
  {
    value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
  },
  {
    items: [
      {
        attributes: {
          className: 'text-uppercase',
          style: {
            display: 'block'
          }
        },
        tag: 'strong',
        value: 'Cu movet numquam.'
      },
      {
        attributes: {
          className: 'list a'
        },
        tag: 'ol',
        items: [
          {
            value: 'Aliquam tincidunt mauris eu risus.'
          },
          {
            items: [
              {
                tag: 'em',
                value: 'Mauris placerat eleifend leo.'
              },
              {
                attributes: {
                  className: 'list I'
                },
                tag: 'ol',
                items: [
                  {
                    value: 'Suspendisse laoreet. Fusce ut est sed dolor.'
                  },
                  {
                    value:
                      <a href="#">
                        Gravida convallis. Morbi vitae ante.
                      </a>
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'Vestibulum auctor dapibus neque.'
  }
];

[...]`}

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
