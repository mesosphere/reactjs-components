jest.dontMock("../../Mixin/BindMixin");
jest.dontMock("../../Util/Util");
jest.dontMock("../../Util/DOMUtil");
jest.dontMock("../Select");
jest.dontMock("../SelectOption");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

var Select = require("../Select.js");
var SelectOption = require("../SelectOption.js");

describe("Select", function() {
  beforeEach(function() {
    this.callback = jasmine.createSpy();
    this.select = TestUtils.renderIntoDocument(
      <Select
        className="select-class-1 select-class-2"
        onChange={this.callback}
        name="SelectName"
      >
        <SelectOption value="option-1" label="option-1-label">
          default selected(false) & disabled(false)
        </SelectOption>
        <SelectOption
          value="option-2"
          label="option-2-label"
          disabled={true}
          selected={false}
        >
          disabled
        </SelectOption>
        <SelectOption
          value="option-3"
          label="option-3-label"
          disabled={false}
          selected={true}
        >
          selected
        </SelectOption>
        <SelectOption value="option-5" label="option-5-label">
          <p>One HTML Child</p>
        </SelectOption>
        <SelectOption value="option-6" label="option-6-label">
          <p>Multiple HTML Children</p>
          <p>Multiple HTML Children</p>
        </SelectOption>
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
        "dropdown-select input-value"
      );
      expect(input.value).toEqual("option-3");
    });
  });
});
