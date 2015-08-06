import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {
  onItemSelection(item) {
    // Do something interesting with the item object.
    console.log(item);
  }

  render() {
    var items = [
    {
      className: 'dropdown-menu-header',
      html: 'Dropdown Header',
      id: 'a',
      selectable: false
    },
    {
      html: 'Item A',
      id: 'b',
      selectedHtml: 'Item A'
    },
    {
      html: 'Item B',
      id: 'c',
      selectedHtml: 'Item B'
    },
    {
      html: 'Item C',
      id: 'd',
      selectedHtml: 'Item C'
    },
    {
      className: 'dropdown-menu-divider',
      id: 'e',
      selectable: false
    },
    {
      className: 'dropdown-menu-header',
      html: 'Dropdown Header',
      id: 'f',
      selectable: false
    },
    {
      html: 'Item D',
      id: 'g',
      selectedHtml: 'Item D'
    }];

    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <h2>Here is a simple dropdown.</h2>
            <Dropdown buttonClassName="button dropdown-toggle"
              dropdownMenuClassName="dropdown-menu"
              dropdownMenuListClassName="dropdown-menu-list"
              items={items}
              onItemSelection={this.onItemSelection}
              selectedId="b"
              wrapperClassName="dropdown" />
          </div>
        </section>
      </div>
    );
  }
}

React.render(<DropdownExample />, document.getElementById('dropdown'));
