var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../Table');
jest.dontMock('../../Util/Util');
jest.dontMock('./fixtures/MockTable');

var MockTable = require('./fixtures/MockTable');
var Table = require('../Table');

describe('Table', function() {

  beforeEach(function () {
    this.callback = jasmine.createSpy();
    this.instance = TestUtils.renderIntoDocument(
      <Table
        className="table"
        columns={MockTable.columns}
        data={MockTable.rows}
        keys={['id']}
        sortBy={{
          prop: 'name',
          order: 'desc'
        }}
        onSort={this.callback} />
    );
  });

  it('should render the proper number of columns', function() {
    var thElements = TestUtils.scryRenderedDOMComponentsWithTag(
      this.instance, 'th'
    );

    expect(thElements.length).toEqual(MockTable.columns.length);
  });

  it('should render the proper number of rows', function() {
    var tbody = TestUtils.findRenderedDOMComponentWithTag(
      this.instance, 'tbody'
    );
    var trElements = TestUtils.scryRenderedDOMComponentsWithTag(
      tbody, 'tr'
    );
    expect(trElements.length).toEqual(MockTable.rows.length);
  });

  it('should call the callback when the data is sorted', function() {
    this.instance.handleSort();
    expect(this.callback).toHaveBeenCalled();
  });

});
