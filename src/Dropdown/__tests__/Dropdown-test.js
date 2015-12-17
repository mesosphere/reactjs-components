jest.dontMock('../../Mixin/BindMixin');
jest.dontMock('../../Util/Util');
jest.dontMock('../../Util/DOMUtil');
jest.dontMock('../Dropdown');
jest.dontMock('./fixtures/MockDropdownList');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var MockDropdownList = require('./fixtures/MockDropdownList');
var Dropdown = require('../Dropdown.js');

describe('Dropdown', function () {

  beforeEach(function () {
    this.callback = jasmine.createSpy();
    this.instance = TestUtils.renderIntoDocument(
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={MockDropdownList}
        initialID="bar"
        onItemSelection={this.callback}
        transition={false}
        wrapperClassName="dropdown" />
    );
  });

  it('should display a dropdown menu when the button is clicked', function () {
    // Click on the dropdown button to open the menu
    TestUtils.Simulate.click(this.instance.refs.button);
    // Find the dropdown menu in the DOM
    var dropdownMenu = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'dropdown-menu'
    );
    expect(dropdownMenu.length).toEqual(1);
  });

  it('should remove the dropdown menu when it loses focus', function () {
    // Start with the dropdown menu being open
    this.instance.setState({
      isOpen: true
    });
    // Add a dataset to the instance
    var el = React.findDOMNode(this.instance);
    if (!el.dataset) {
      el.dataset = {reactid: 'something'};
    }
    // Trigger #handleWrapperBlur on the instance to simulate a user dismissing
    // the dropdown menu.
    this.instance.handleWrapperBlur({});
    expect(this.instance.state.isOpen).toEqual(false);
  });

  it('shouldn\'t call the callback after initialization', function () {
    expect(this.callback).not.toHaveBeenCalled();
  });

  it('should call the callback when selecting a selectable item', function () {
    // Click on the dropdown button to open the menu
    TestUtils.Simulate.click(this.instance.refs.button);
    // Find the selectable menu items
    var selectableElements = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'is-selectable'
    );
    // Click on the first menu item returned, which we know to be selectable
    TestUtils.Simulate.click(selectableElements[0]);
    expect(this.callback).toHaveBeenCalled();
  });

  it('correctly displays the selected item', function () {
    // Click on the dropdown button to open the menu
    TestUtils.Simulate.click(this.instance.refs.button);
    // Find the selectable menu items
    var selectableElements = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'is-selectable'
    );
    // Click on the second menu item returned, which we know to be "Baz"
    TestUtils.Simulate.click(selectableElements[1]);
    var buttonText = React.findDOMNode(this.instance.refs.button).textContent;
    expect(buttonText).toEqual('Baz');
  });

  it('correctly displays the selected item with forceSelectedID', function () {
    var instance = TestUtils.renderIntoDocument(
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={MockDropdownList}
        forceSelectedID="quz"
        transition={false}
        wrapperClassName="dropdown" />
    );

    var buttonText = React.findDOMNode(instance.refs.button).textContent;
    expect(buttonText).toEqual('Quz');
  });

  it('displays forceSelectedID when initialID and forceSelectedID is set', function () {
    var instance = TestUtils.renderIntoDocument(
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={MockDropdownList}
        forceSelectedID="quz"
        initialID="foo"
        transition={false}
        wrapperClassName="dropdown" />
    );

    var buttonText = React.findDOMNode(instance.refs.button).textContent;
    expect(buttonText).toEqual('Quz');
  });

  it('displays nothing when an non-existing item is selected', function () {
    var instance = TestUtils.renderIntoDocument(
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={MockDropdownList}
        initialID="i-do-not-exist"
        transition={false}
        wrapperClassName="dropdown" />
    );

    var buttonText = React.findDOMNode(instance.refs.button).textContent;
    expect(buttonText).toEqual('');
  });

  it('displays nothing when an non-existing item is force selected', function () {
    var instance = TestUtils.renderIntoDocument(
      <Dropdown buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        items={MockDropdownList}
        forceSelectedID="i-do-not-exist"
        transition={false}
        wrapperClassName="dropdown" />
    );

    var buttonText = React.findDOMNode(instance.refs.button).textContent;
    expect(buttonText).toEqual('');
  });
});
