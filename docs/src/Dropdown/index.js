import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {

  handleItemSelection(item) {
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
        <section className="row canvas-pod canvas-pod-light">
          <div className="container container-pod">
            <h2>Here is a simple dropdown.</h2>
            <Dropdown wrapperClassName="dropdown"
              buttonClassName="button dropdown-toggle"
              dropdownMenuClassName="dropdown-menu"
              dropdownMenuListClassName="dropdown-menu-list"
              items={items}
              onItemSelection={this.handleItemSelection}
              selectedId="a" />
          </div>
        </section>
      </div>
    );
  }
}

React.render(<DropdownExample />, document.getElementById('dropdown'));
