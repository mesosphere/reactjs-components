import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {
  onItemSelection(item) {
    console.log(item);
  }

  render() {
    var items = [{
      id: 'a',
      html: <span>Item A</span>,
      selectedHtml: <span>Item A</span>
    },
    {
      id: 'b',
      html: <span>Item B</span>,
      selectedHtml: <span>Item B</span>
    },
    {
      id: 'c',
      html: <span>Item C</span>,
      selectedHtml: <span>Item C</span>
    }];

    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <h2>Here is a simple dropdown.</h2>
            <Dropdown buttonClassName="button dropdown-toggle"
              dropdownMenuClassName="dropdown-menu"
              dropdownMenuListClassName="dropdown-menu-list"
              dropdownMenuListItemClassName="clickable"
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
