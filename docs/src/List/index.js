import React from 'react';

import List from '../../../src/List/List.js';

class ListExample extends React.Component {

  constructor() {
    super();
    this.state = {
      itemAdded: false
    };
    ['handleToggleExtraItem'].forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  handleToggleExtraItem() {
    this.setState({
      itemAdded: !this.state.itemAdded
    });
  }

  getSimpleList() {
    // The List component expects an array of objects, each object describing
    // an item in the list. If the object contains the "value" property,
    // then the List component will render that list item with the contents of
    // "value." If the object contains the "items" property, then it expects
    // an array of more items, and will render each object in the array with the
    // same logic.

    // The rendered HTML will be structured as follows:
    // <ul class="list">
    //   <li class="list-item">...</li>
    //   <li class="list-item">...</li>
    //   <li class="list-item">...</li>
    // </ul>

    var simpleList = [
      {
        value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
      },
      {
        value: 'Aliquam tincidunt mauris eu risus.'
      },
      {
        value: 'Vestibulum auctor dapibus neque.'
      }
    ];

    if (this.state.itemAdded) {
      simpleList.push({value: 'A wild transitioned list item appears.'});
    }

    return simpleList;
  }

  getSimpleNestedList() {
    // Here's a simple nested list, overriding a few of the default properties
    // to achieve the HTML that we desire for a nested list.

    // The rendered HTML will be structured as follows:
    // <ul class="list">
    //   <li class="list-item">...</li>
    //   <li class="list-item">
    //     <strong class="list-item">...</strong>
    //     <ul class="list list-item">
    //       <li class="list-item">...</li>
    //       <li class="list-item">...</li>
    //       <li class="list-item">...</li>
    //     </ul>
    //   </li>
    //   <li class="list-item">...</li>
    // </ul>

    var simpleNestedList = [
      {
        value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
      },
      {
        items: [
          {
            tag: 'strong',
            value: 'Cu movet numquam'
          },
          {
            attributes: {
              className: 'list'
            },
            tag: 'ul',
            items: [
              {
                value: 'Aliquam tincidunt mauris eu risus.'
              },
              {
                value: 'Minim facete albucius pro an.'
              },
              {
                value: 'Usu essent liberavisse necessitatibus cu.'
              }
            ]
          }
        ]
      },
      {
        value: 'Vestibulum auctor dapibus neque.'
      }
    ];

    return simpleNestedList;
  }

  getComplexNestedList() {
    // Here's a slightly more complex example, illustrating how you can
    // customize each list item as needed.

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
                value:
                  <strong className="emphasize danger">
                    Minim facete albucius pro an.
                  </strong>
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
                        value:
                          <a href="#">
                            Suspendisse laoreet. Fusce ut est sed dolor.
                          </a>
                      },
                      {
                        value:
                          <a href="#">
                            Gravida convallis. Morbi vitae ante.
                          </a>
                      },
                      {
                        value:
                          <a href="#">
                            Vivamus ultrices luctus nunc. Suspendisse et
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

    return complexNestedList;
  }

  render() {
    var toggleText = 'Add item';

    if (this.state.itemAdded) {
      toggleText = 'Remove item';
    }

    return (
      <div>
        <section className="row canvas-pod canvas-pod-light">
          <div className="container container-pod">
            <div className="row row-flex row-flex-align-vertical-center">
              <div className="column-9">
                <h2>
                  Here is a simple unordered list with transition.
                </h2>
              </div>
              <div className="column-3 text-align-right">
                <button className="button button-small button-primary button-stroke" onClick={this.handleToggleExtraItem}>
                  {toggleText}
                </button>
              </div>
            </div>
            <List
              items={this.getSimpleList()}
              transition={true}
              transitionName="list-item" />
          </div>
        </section>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <h2>Here is a simple nested unordered list.</h2>
            <List items={this.getSimpleNestedList()} />
          </div>
        </section>
        <section className="row canvas-pod canvas-pod-light">
          <div className="container container-pod">
            <h2>
              Here is a slightly more complex nested ordered list with
              customized elements.
            </h2>
            <List items={this.getComplexNestedList()} tag="ol" />
          </div>
        </section>
      </div>
    );
  }

}

React.render(<ListExample />, document.getElementById('list'));
