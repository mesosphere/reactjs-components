import React from 'react';

import List from '../../../src/List/List.js';

class ListExample extends React.Component {

  getList() {
    var list = [
      {
        attributes: {
          className: 'my-custom-row-class my-custom-row-class--first-row'
        },
        items: [
          {
            attributes: {
              className: 'my-custom-item-class',
              style: {
                display: 'inline-block'
              }
            },
            tag: 'span',
            value: 'Row 1: Item 1'
          },
          {
            attributes: {
              className: 'my-custom-item-class',
              style: {
                display: 'inline-block'
              }
            },
            tag: 'span',
            value: 'Row 1: Item 2'
          }
        ]
      },
      {
        attributes: {
          className: 'my-custom-row-class'
        },
        value: 'Row 2: Item 1'
      }
    ];

    return list;
  }

  render() {
    return (
      <List
        className="my-custom-list-class two-class"
        data-example-property="some example"
        items={this.getList()}
        tag="div" />
    );
  }

}

React.render(<ListExample />, document.getElementById('application'));
