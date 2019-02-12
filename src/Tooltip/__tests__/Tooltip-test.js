jest.dontMock("../Tooltip");
jest.dontMock("../../Util/Util");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

var Tooltip = require("../Tooltip");

describe("Tooltip", function() {
  beforeEach(function() {
    this.instance = TestUtils.renderIntoDocument(
      <Tooltip
        anchor="start"
        className="foo"
        content="I'm a tooltip!"
        position="bottom"
      >
        <span>Tooltip Trigger</span>
      </Tooltip>
    );
  });

  it("should render with the intended class", function() {
    expect(
      this.instance.tooltipNode.current.classList.contains("foo")
    ).toBeTruthy();
  });

  it("should render with the intended position as a class", function() {
    expect(
      this.instance.tooltipNode.current.classList.contains("position-bottom")
    ).toBeTruthy();
  });

  it("should render with the intended anchor as a class", function() {
    expect(
      this.instance.tooltipNode.current.classList.contains("anchor-start")
    ).toBeTruthy();
  });

  describe("#handleMouseEnter", function() {
    it("should set isOpen to true", function() {
      this.instance.handleMouseEnter();

      expect(this.instance.state.isOpen).toBeTruthy();
    });

    it("should set anchor to what was returned from #getIdealPosition", function() {
      this.instance.handleMouseEnter("start", "bottom");

      expect(this.instance.state.anchor).toEqual("start");
    });

    it("should set position to what was returned from #getIdealPosition", function() {
      this.instance.handleMouseEnter("start", "bottom");

      expect(this.instance.state.position).toEqual("bottom");
    });
  });

  describe("#handleMouseLeave", function() {
    it("should set isOpen to false", function() {
      this.instance.handleMouseLeave();

      expect(this.instance.state.isOpen).toBeFalsy();
    });
  });
});
