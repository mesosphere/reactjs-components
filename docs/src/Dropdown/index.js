import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {

  constructor() {
    super();
    this.dropdownSelected = 'foo';
    this.onItemSelection = this.onItemSelection.bind(this);
  }

  onItemSelection(item) {
    this.dropdownSelected = item.html.toLowerCase();
    this.forceUpdate();
  }

  render() {
    let dropdownItems = [
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
        html: 'A tiny whale',
        id: 'tiny-whale'
      }
    ];

    let styledItemsList = [
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
        className: 'dropdown-menu-divider',
        id: 'divider-a',
        selectable: false
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
      }
    ];

    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <div className="row">
              <div className="column-12">
                <h2>
                  Dropdowns
                </h2>
                <p>
                  Use custom html elements within dropdowns, style with dividers, and add callbacks.
                </p>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <p>Here is a simple dropdown.</p>
                    <Dropdown buttonClassName="button dropdown-toggle"
                      dropdownMenuClassName="dropdown-menu"
                      dropdownMenuListClassName="dropdown-menu-list"
                      items={dropdownItems}
                      selectedID="foo"
                      transition={true}
                      wrapperClassName="dropdown" />
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import Dropdown from 'Dropdown.js';

[...]

let dropdownItems = [
  {
    html: 'Foo',f
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
    html: 'A tiny whale',
    id: 'whale'
  }
];

<Dropdown buttonClassName="button dropdown-toggle"
  dropdownMenuClassName="dropdown-menu"
  dropdownMenuListClassName="dropdown-menu-list"
  items={dropdownItems}
  selectedID="foo"
  transition={true}
  wrapperClassName="dropdown" />
`}
                    </pre>
                  </div>
                </div>

                <h4>
                  Callbacks
                </h4>
                <p>
                  Use the <code>onItemSelection</code> attribute to add
                  callbacks to item selection.
                </p>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <p>You have selected {this.dropdownSelected}.</p>
                    <Dropdown buttonClassName="button dropdown-toggle"
                      dropdownMenuClassName="dropdown-menu"
                      dropdownMenuListClassName="dropdown-menu-list"
                      items={dropdownItems}
                      onItemSelection={this.onItemSelection}
                      selectedID="foo"
                      transition={true}
                      wrapperClassName="dropdown" />
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import Dropdown from 'Dropdown.js';

[...]

onItemSelection(item) {
    this.dropdownSelected = item.html.toLowerCase();
}

[...]

let dropdownItems = [
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
    html: 'A tiny whale',
    id: 'whale'
  }
];

[...]

<p>You have selected {this.dropdownSelected}.</p>

<Dropdown buttonClassName="button dropdown-toggle"
  dropdownMenuClassName="dropdown-menu"
  dropdownMenuListClassName="dropdown-menu-list"
  items={dropdownItems}
  onItemSelection={this.onItemSelection}
  selectedID="foo"
  transition={true}
  wrapperClassName="dropdown" />
`}
                    </pre>
                  </div>
                </div>

              <h4>
                Custom HTML elements
              </h4>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <p>Here is a dropdown with custom HTML elements.</p>
                    <Dropdown buttonClassName="button dropdown-toggle"
                      dropdownMenuClassName="dropdown-menu"
                      dropdownMenuListClassName="dropdown-menu-list"
                      items={styledItemsList}
                      selectedID="foo"
                      transition={true}
                      wrapperClassName="dropdown" />
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import Dropdown from 'Dropdown.js';

[...]

let styledItemsList = [
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
    className: 'dropdown-menu-divider',
    id: 'divider-a',
    selectable: false
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
  }
];

[...]

<Dropdown buttonClassName="button dropdown-toggle"
  dropdownMenuClassName="dropdown-menu"
  dropdownMenuListClassName="dropdown-menu-list"
  items={styledItemsList}
  selectedID="foo"
  transition={true}
  wrapperClassName="dropdown" />
`}
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

React.render(<DropdownExample />, document.getElementById('dropdown'));
