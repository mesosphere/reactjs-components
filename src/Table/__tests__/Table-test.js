jest.dontMock('../Table');
jest.dontMock('../../Util/Util');
jest.dontMock('../../Util/DOMUtil');
jest.dontMock('./fixtures/MockTable');

import React from 'react/addons';
import Table from '../Table';
import Util from '../../Util/Util';

var TestUtils = React.addons.TestUtils;
var MockTable = require('./fixtures/MockTable');

describe('Table', function () {

  beforeEach(function () {
    this.callback = jasmine.createSpy();
    this.keys = ['id'];
    this.sortBy = {
      prop: 'name',
      order: 'desc'
    };
    this.instance = TestUtils.renderIntoDocument(
      <Table
        className="table"
        columns={MockTable.columns}
        data={MockTable.rows}
        keys={this.keys}
        sortBy={this.sortBy}
        onSortCallback={this.callback} />
    );
    this.instance.itemHeight = 0;
  });

  it('should render the proper number of columns', function () {
    expect(this.instance.getHeaders(MockTable.columns, this.sortBy).length)
      .toEqual(4);
  });

  it('should render the proper number of rows', function () {
    var rows = this.instance.getRows(
      MockTable.rows,
      MockTable.columns,
      this.sortBy,
      Util.noop,
      this.keys
    );
    expect(rows.length).toEqual(5);
  });

  it('should call the callback when the data is sorted', function () {
    this.instance.handleSort();
    expect(this.callback).toHaveBeenCalled();
  });

});
