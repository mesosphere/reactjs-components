jest.dontMock("../../Mixin/BindMixin");
jest.dontMock("../../Util/Util");
jest.dontMock("../../Util/DOMUtil");
jest.dontMock("../Select");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

var Select = require("../Select.js").default;

describe("Select", function() {
  beforeEach(function() {
    this.callback = jasmine.createSpy();
    this.select = TestUtils.renderIntoDocument(
      <Select
        className="select-class-1 select-class-2"
        onChange={this.callback}
        name="SelectName"
        value="option-3"
      >
        <option value="option-1">
          default & disabled(false)
        </option>
        <option value="option-2" disabled={true}>
          disabled
        </option>
        <option value="option-3" disabled={false}>
          selected
        </option>
        <option value="option-5">
          <p>One HTML Child</p>
        </option>
        <option value="option-6">
          <p>Multiple HTML Children</p>
          <p>Multiple HTML Children</p>
        </option>
      </Select>
    );
  });

  afterEach(function() {
    Array.prototype.slice.call(document.body.children).forEach(function(node) {
      document.body.removeChild(node);
    });
  });
  describe("#Init", function() {
    it("has correct classes", function() {
      expect(this.select.props.className).toEqual(
        "select-class-1 select-class-2"
      );
    });
    it("has correct name", function() {
      expect(this.select.props.name).toEqual("SelectName");
    });
    it("has correct change listener", function() {
      expect(this.select.props.onChange).toBe(this.callback);
    });
    it("does not call change listener on init", function() {
      expect(this.callback).not.toBeCalled();
    });
    it("has correct initial value", function() {
      const input = TestUtils.findRenderedDOMComponentWithClass(
        this.select,
        "dropdown-select-input-value"
      );
      expect(input.value).toEqual("option-3");
    });
  });
});
