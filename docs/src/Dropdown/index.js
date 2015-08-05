import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {
  onItemSelection(item) {
    // Do something interesting with the item object.
  }

  render() {
    var items = [
    {
      className: 'dropdown-menu-header',
      id: 'a',
      html: 'Dropdown Header',
      selectable: false
    },
    {
      id: 'b',
      html: 'Item A',
      selectedHtml: 'Item A'
    },
    {
      id: 'c',
      html: 'Item B',
      selectedHtml: 'Item B'
    },
    {
      id: 'd',
      html: 'Item C',
      selectedHtml: 'Item C'
    },
    {
      className: 'dropdown-menu-divider',
      id: 'e',
      selectable: false
    },
    {
      className: 'dropdown-menu-header',
      id: 'f',
      html: 'Dropdown Header',
      selectable: false
    },
    {
      id: 'g',
      html: 'Item D',
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
              selectedId="a"
              wrapperClassName="dropdown" />
          </div>
        </section>
      </div>
    );
  }
}

React.render(<DropdownExample />, document.getElementById('dropdown'));
