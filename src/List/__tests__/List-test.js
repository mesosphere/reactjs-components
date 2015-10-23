var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../List.js');
jest.dontMock('../ListItem.js');
jest.dontMock('./fixtures/MockList');
jest.dontMock('../../Util/Util');

var MockList = require('./fixtures/MockList');
var List = require('../List.js');

describe('List', function () {

  beforeEach(function () {
    this.listTag = 'ul';
    this.instance = TestUtils.renderIntoDocument(
      <List content={MockList} tag={this.listTag} />
    );
  });

  it('should render whatever tag it receives in its attributes', function () {
    var ulElements = TestUtils.scryRenderedDOMComponentsWithTag(
      this.instance, this.listTag
    );

    expect(ulElements.length).toEqual(1);
  });

  it('should render only one element with the class list', function () {
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'list'
    );

    expect(listItems.length).toEqual(1);
  });

  it('renders one row per top-level item in the list array', function () {
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'my-custom-row-class'
    );

    expect(listItems.length).toEqual(MockList.length);
  });

});
