jest.dontMock("../Table");
jest.dontMock("../../Util/Util");
jest.dontMock("./fixtures/MockTable");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */
var ReactDOM = require("react-dom");

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

var Table = require("../Table");
var DOMUtil = require("../../Util/DOMUtil");

var MockTable = require("./fixtures/MockTable");

describe("Table", function() {
  beforeEach(function() {
    this.callback = jasmine.createSpy();
    this.sortBy = {
      prop: "name",
      order: "desc"
    };
    this.instance = TestUtils.renderIntoDocument(
      <Table
        className="table"
        columns={MockTable.columns}
        data={MockTable.rows}
        sortBy={this.sortBy}
        onSortCallback={this.callback}
      />
    );
    this.instance.itemHeight = 0;
    this.getComputedDimensions = DOMUtil.getComputedDimensions;
    DOMUtil.getComputedDimensions = function() {
      return { width: 0, height: 0 };
    };
  });

  afterEach(function() {
    DOMUtil.getComputedDimensions = this.getComputedDimensions;
  });

  it("should render the proper number of columns", function() {
    expect(
      this.instance.getHeaders(MockTable.columns, this.sortBy).length
    ).toEqual(4);
  });

  it("should call the callback when the data is sorted", function() {
    this.instance.handleSort();
    expect(this.callback).toHaveBeenCalled();
  });

  describe("emptyMessage prop", function() {
    it("should display the custom empty message", function() {
      var instance = TestUtils.renderIntoDocument(
        <Table
          className="table"
          columns={MockTable.columns}
          data={[]}
          emptyMessage={"Custom message"}
          sortBy={this.sortBy}
          onSortCallback={this.callback}
        />
      );

      this.node = document.createElement("tbody");
      ReactDOM.render(instance.getEmptyRowCell([1]), this.node);
      let td = this.node.querySelector("td");
      expect(td.textContent).toBe("Custom message");
    });

    it("should display the default empty message", function() {
      this.node = document.createElement("tbody");
      ReactDOM.render(this.instance.getEmptyRowCell([1]), this.node);
      let td = this.node.querySelector("td");
      expect(td.textContent).toBe(Table.defaultProps.emptyMessage);
    });
  });

  describe("initial sorting", function() {
    it("should sort the data descending on initial mount", function() {
      this.instance = TestUtils.renderIntoDocument(
        <Table
          className="table"
          columns={MockTable.columns}
          data={MockTable.rows}
          itemHeight={20}
          sortBy={{ prop: "name", order: "desc" }}
        />
      );

      var tableRows = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance,
        "tr"
      );

      expect(tableRows[2].children[0].textContent).toEqual("Zach");
      expect(tableRows[6].children[0].textContent).toEqual("Francis");
    });

    it("should sort the data ascending on initial mount", function() {
      this.instance = TestUtils.renderIntoDocument(
        <Table
          className="table"
          columns={MockTable.columns}
          data={MockTable.rows}
          itemHeight={20}
          sortBy={{ prop: "name", order: "asc" }}
          onSortCallback={this.callback}
        />
      );

      var tableRows = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance,
        "tr"
      );

      expect(tableRows[2].children[0].textContent).toEqual("Francis");
      expect(tableRows[6].children[0].textContent).toEqual("Zach");
    });
  });
});
