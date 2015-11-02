jest.dontMock('../Table');
jest.dontMock('../../Util/Util');
jest.dontMock('./fixtures/MockTable');
jest.dontMock('../../VirtualList/VirtualList');
jest.dontMock('../../Mixin/BindMixin');

import React from 'react/addons';
import Table from '../Table';
import Util from '../../Util/Util';
import DOMUtil from '../../Util/DOMUtil';

var TestUtils = React.addons.TestUtils;
var MockTable = require('./fixtures/MockTable');

describe('Table', function () {

  beforeEach(function () {
    // this.callback = jasmine.createSpy();
    // this.idAttribute = 'id';
    // this.sortBy = {
    //   prop: 'name',
    //   order: 'desc'
    // };
    // this.instance = TestUtils.renderIntoDocument(
    //   <Table
    //     className="table"
    //     columns={MockTable.columns}
    //     data={MockTable.rows}
    //     idAttribute={this.idAttribute}
    //     sortBy={this.sortBy}
    //     onSortCallback={this.callback} />
    // );
    // this.instance.itemHeight = 0;
    // this.getComputedDimensions = DOMUtil.getComputedDimensions;
    // DOMUtil.getComputedDimensions = function () {
    //   return {width: 0, height: 0};
    // };
  });

  // afterEach(function () {
  //   DOMUtil.getComputedDimensions = this.getComputedDimensions;
  // });

  // it('should render the proper number of columns', function () {
  //   expect(this.instance.getHeaders(MockTable.columns, this.sortBy).length)
  //     .toEqual(4);
  // });

  // it('should render the proper number of rows', function () {
  //   var rows = this.instance.getRows(
  //     MockTable.rows,
  //     MockTable.columns,
  //     this.sortBy,
  //     Util.noop,
  //     this.idAttribute
  //   );
  //   expect(rows.length).toEqual(5);
  // });

  // it('should call the callback when the data is sorted', function () {
  //   this.instance.handleSort();
  //   expect(this.callback).toHaveBeenCalled();
  // });

});
