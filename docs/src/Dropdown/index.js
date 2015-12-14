import React from 'react';

import Dropdown from '../../../src/Dropdown/Dropdown.js';

class DropdownExample extends React.Component {

  constructor() {
    super();

    this.state = {
      selectedIDOne: 'foo',
      selectedIDTwo: 'foo',
      selectedIDThree: 'foo'
    };

    this.onItemSelectionOne = this.onItemSelectionOne.bind(this);
    this.onItemSelectionTwo = this.onItemSelectionTwo.bind(this);
    this.onItemSelectionThree = this.onItemSelectionThree.bind(this);
  }

  onItemSelectionOne(item) {
    this.setState({selectedIDOne: item.id});
  }

  onItemSelectionTwo(item) {
    this.setState({selectedIDTwo: item.id});
  }

  onItemSelectionThree(item) {
    this.setState({selectedIDTwo: item.id});
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

    let manyDropdownItems = [
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
      },
      {
        html: 'Foo',
        id: 'afoo'
      },
      {
        html: 'Bar',
        id: 'abar'
      },
      {
        html: 'Baz',
        id: 'abaz'
      },
      {
        html: 'A tiny whale',
        id: 'atiny-whale'
      },
      {
        html: 'Foo',
        id: 'bfoo'
      },
      {
        html: 'Bar',
        id: 'bbar'
      },
      {
        html: 'Baz',
        id: 'bbaz'
      },
      {
        html: 'A tiny whale',
        id: 'btiny-whale'
      },
      {
        html: 'Foo',
        id: 'cfoo'
      },
      {
        html: 'Bar',
        id: 'cbar'
      },
      {
        html: 'Baz',
        id: 'cbaz'
      },
      {
        html: 'A tiny whale',
        id: 'ctiny-whale'
      },
      {
        html: 'Foo',
        id: 'dfoo'
      },
      {
        html: 'Bar',
        id: 'dbar'
      },
      {
        html: 'Baz',
        id: 'dbaz'
      },
      {
        html: 'A tiny whale',
        id: 'dtiny-whale'
      },
      {
        html: 'Foo',
        id: 'efoo'
      },
      {
        html: 'Bar',
        id: 'ebar'
      },
      {
        html: 'Baz',
        id: 'ebaz'
      },
      {
        html: 'A tiny whale',
        id: 'etiny-whale'
      },
      {
        html: 'Foo',
        id: 'ffoo'
      },
      {
        html: 'Bar',
        id: 'fbar'
      },
      {
        html: 'Baz',
        id: 'fbaz'
      },
      {
        html: 'A tiny whale',
        id: 'ftiny-whale'
      },
      {
        html: 'Bar',
        id: 'gbar'
      },
      {
        html: 'Baz',
        id: 'gbaz'
      },
      {
        html: 'A tiny whale',
        id: 'gtiny-whale'
      },
      {
        html: 'Foo',
        id: 'gfoo'
      },
      {
        html: 'Bar',
        id: 'hbar'
      },
      {
        html: 'Baz',
        id: 'hbaz'
      },
      {
        html: 'A tiny whale',
        id: 'htiny-whale'
      },
      {
        html: 'Foo',
        id: 'hfoo'
      },
      {
        html: 'Bar',
        id: 'ibar'
      },
      {
        html: 'Baz',
        id: 'ibaz'
      },
      {
        html: 'A tiny whale',
        id: 'itiny-whale'
      },
      {
        html: 'Foo',
        id: 'ifoo'
      },
      {
        html: 'Bar',
        id: 'jbar'
      },
      {
        html: 'Baz',
        id: 'jbaz'
      },
      {
        html: 'A tiny whale',
        id: 'jtiny-whale'
      },
      {
        html: 'Foo',
        id: 'kfoo'
      },
      {
        html: 'Bar',
        id: 'kbar'
      },
      {
        html: 'Baz',
        id: 'kbaz'
      },
      {
        html: 'A tiny whale',
        id: 'ktiny-whale'
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
          <div>
            <div className="row">
              <div className="column-12">
                <h2>Dropdowns</h2>
                <p>
                  Create a dropdown menu with custom HTML and onclick callback
                  functionality. View the full <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Dropdown/Dropdown.js">component source</a>.
                </p>
                <h3>Properties API</h3>
                <div className="example-block">
                  <pre className="prettyprint linenums flush-bottom">
{`Dropdown.propTypes = {
  // The items to display in the dropdown.
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      // An optional classname for the menu item.
      className: React.PropTypes.string,
      // A required ID for each item
      id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]).isRequired,
      // The HTML (or text) to render for the list item.
      html: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]),
      // Whether or not the user can choose the item.
      selectable: React.PropTypes.bool,
      // The HTML (or text) to display when the option is selected. If this is
      // not provided, the value for the \`html\` property will be used.
      selectedHtml: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ])
    })
  ).isRequired,
  // An optional callback when an item is selected. Will receive an argument
  // containing the selected item as it was supplied via the items array.
  onItemSelection: React.PropTypes.func,
  // The ID of the item.
  selectedID: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired,
  // Optional transition on the dropdown menu. Must be accompanied
  // by an animation or transition in CSS.
  transition: React.PropTypes.bool,
  // The prefix of the transition classnames.
  transitionName: React.PropTypes.string,

  // Classes:
  // Classname for the element that ther user interacts with to open menu.
  buttonClassName: React.PropTypes.string,
  // Classname for the dropdown menu wrapper.
  dropdownMenuClassName: React.PropTypes.string,
  // Classname for the dropdown list wrapper.
  dropdownMenuListClassName: React.PropTypes.string,
  // Classname for the dropdown list item.
  dropdownMenuListItemClassName: React.PropTypes.string,
  // Classname for the element that wraps the entire component.
  wrapperClassName: React.PropTypes.string
};
`}
                  </pre>
                </div>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <div className="row">
                      <div className="column-6">
                        <p>Here is a simple dropdown...</p>
                        <Dropdown buttonClassName="button dropdown-toggle"
                          dropdownMenuClassName="dropdown-menu"
                          dropdownMenuListClassName="dropdown-menu-list"
                          items={dropdownItems}
                          onItemSelection={this.onItemSelectionOne}
                          selectedID={this.state.selectedIDOne}
                          transition={true}
                          wrapperClassName="dropdown" />
                      </div>
                      <div className="column-6">
                        <p>...and a very large dropdown.</p>
                        <Dropdown buttonClassName="button dropdown-toggle"
                          dropdownMenuClassName="dropdown-menu"
                          dropdownMenuListClassName="dropdown-menu-list"
                          items={manyDropdownItems}
                          onItemSelection={this.onItemSelectionTwo}
                          selectedID={this.state.selectedIDTwo}
                          transition={true}
                          wrapperClassName="dropdown" />
                      </div>
                    </div>
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import {Dropdown} from 'reactjs-components';
import React from 'react';

class CallbackDropdownExample extends React.Component {

  constructor() {
    super();
    this.state = {selectedIDOne: 'foo'};

    this.onItemSelectionOne = this.onItemSelectionOne.bind(this);
  }

  onItemSelectionOne(item) {
    this.setState({selectedIDOne: item.id});
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
        id: 'whale'
      }
    ];

    return (
      <div>
        <p>You have selected {this.state.selectedID}.</p>
        <Dropdown buttonClassName="button dropdown-toggle"
          dropdownMenuClassName="dropdown-menu"
          dropdownMenuListClassName="dropdown-menu-list"
          items={dropdownItems}
          onItemSelection={this.onItemSelection}
          selectedID={this.state.selectedID}
          transition={true}
          wrapperClassName="dropdown" />
      </div>
    );
  }
`}
                    </pre>
                  </div>
                </div>

              <h3>Custom HTML elements</h3>
              <p>Use HTML to style dropdown elements.</p>
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
                    <p>Here is a styled dropdown.</p>
                    <Dropdown buttonClassName="button dropdown-toggle"
                      dropdownMenuClassName="dropdown-menu"
                      dropdownMenuListClassName="dropdown-menu-list"
                      items={styledItemsList}
                      onItemSelection={this.onItemSelectionThree}
                      selectedID={this.state.selectedIDThree}
                      transition={true}
                      wrapperClassName="dropdown" />
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import {Dropdown} from 'reactjs-components';
import React from 'react';

class CallbackDropdownExample extends React.Component {

  constructor() {
    super();
    this.state = {selectedIDThree: 'foo'};

    this.onItemSelectionThree = this.onItemSelectionThree.bind(this);
  }

  onItemSelectionThree(item) {
    this.setState({selectedIDThree: item.id});
  }

  render() {
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
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={dropdownItems}
        onItemSelection={this.onItemSelectionThree}
        selectedID={this.state.selectedIDThree}
        transition={true}
        wrapperClassName="dropdown" />
    );
  }
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
