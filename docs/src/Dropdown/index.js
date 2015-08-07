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
      html: 'Foo',
      id: 'a',
      selectable: false
    },
    {
      html: 'Bar',
      id: 'b',
      selectedHtml: 'Bar'
    },
    {
      html: 'Baz',
      id: 'c',
      selectedHtml: 'Baz'
    },
    {
      html: 'Qux',
      id: 'd',
      selectedHtml: 'Qux'
    },
    {
      className: 'Quux',
      id: 'e',
      selectable: false
    },
    {
      className: 'dropdown-menu-header',
      html: 'Corge',
      id: 'f',
      selectable: false
    },
    {
      html: 'Grault',
      id: 'g',
      selectedHtml: 'Grault'
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
              selectedID="b"
              transition={true}
              wrapperClassName="dropdown" />
          </div>
        </section>
      </div>
    );
  }
}

React.render(<DropdownExample />, document.getElementById('dropdown'));
