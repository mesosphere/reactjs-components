import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {
  onItemSelection(item) {
    /*eslint-disable no-alert */
    alert(`You selected ${item.id}!`);
    /*eslint-enable no-alert */
  }

  render() {
    var simpleList = [
      {
        html: 'Foo',
        id: 'foo'
      },
      {
        html: 'Bar',
        id: 'bar'
      },
      {
        html: 'Baz',
        id: 'baz'
      },
      {
        html: 'Qux',
        id: 'qux'
      }
    ];

    var styledItemsList = [
      {
        html:
          <span>
            <span className="emphasize">Foo </span>
            <em className="small mute">Recommended</em>
          </span>,
        id: 'foo',
        selectedHtml: 'Foo'
      },
      {
        html:
          <span>
            <em>
              Bar
              <sup>1</sup>
            </em>
          </span>,
        id: 'bar',
        selectedHtml:
          <span>
            <em>
              Bar
              <sup>1</sup>
            </em>
          </span>
      },
      {
        html:
          <span>
            <em>
              Baz
              <sup>2</sup>
            </em>
          </span>,
        id: 'baz',
        selectedHtml:
          <span>
            <em>
              Baz
              <sup>2</sup>
            </em>
          </span>
      },
      {
        html:
          <span>
            <em>
              Quz
              <sup>3</sup>
            </em>
          </span>,
        id: 'qux',
        selectedHtml:
          <span>
            <em>
              Quz
              <sup>3</sup>
            </em>
          </span>
      }
    ];

    var dividedList = [
      {
        className: 'dropdown-menu-header',
        html: 'Foo',
        id: 'foo',
        selectable: false,
        selectedHtml: 'Foo'
      },
      {
        html: 'Bar',
        id: 'bar',
        selectedHtml: 'Bar'
      },
      {
        html: 'Baz',
        id: 'baz',
        selectedHtml: 'Baz'
      },
      {
        html: 'Qux',
        id: 'quz',
        selectedHtml: 'Qux'
      },
      {
        className: 'dropdown-menu-divider',
        id: 'divider-a',
        selectable: false
      },
      {
        className: 'dropdown-menu-header',
        html: 'Corge',
        id: 'corge',
        selectable: false
      },
      {
        html: 'Grault',
        id: 'grault',
        selectedHtml: 'Grault'
      }
    ];

    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <div className="row">
              <div className="column-6 column-overflow">
                <p>Here is a simple dropdown.</p>
                <Dropdown buttonClassName="button dropdown-toggle"
                  dropdownMenuClassName="dropdown-menu"
                  dropdownMenuListClassName="dropdown-menu-list"
                  items={simpleList}
                  selectedID="foo"
                  transition={true}
                  wrapperClassName="dropdown" />
              </div>
              <div className="column-6 column-overflow">
                <p>Here is a simple dropdown with an <code>alert</code> callback.</p>
                <Dropdown buttonClassName="button dropdown-toggle"
                  dropdownMenuClassName="dropdown-menu"
                  dropdownMenuListClassName="dropdown-menu-list"
                  items={simpleList}
                  onItemSelection={this.onItemSelection}
                  selectedID="foo"
                  transition={true}
                  wrapperClassName="dropdown" />
              </div>
            </div>
            <div className="row">
              <div className="column-6 column-overflow">
                <p>Here is a dropdown with custom HTML elements.</p>
                <Dropdown buttonClassName="button dropdown-toggle"
                  dropdownMenuClassName="dropdown-menu"
                  dropdownMenuListClassName="dropdown-menu-list"
                  items={styledItemsList}
                  selectedID="foo"
                  transition={true}
                  wrapperClassName="dropdown" />
              </div>
              <div className="column-6 column-overflow">
                <p>Here is a dropdown with dividers.</p>
                <Dropdown buttonClassName="button dropdown-toggle"
                  dropdownMenuClassName="dropdown-menu"
                  dropdownMenuListClassName="dropdown-menu-list"
                  items={dividedList}
                  selectedID="bar"
                  transition={true}
                  wrapperClassName="dropdown" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

React.render(<DropdownExample />, document.getElementById('dropdown'));
