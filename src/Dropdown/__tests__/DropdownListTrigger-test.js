/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import renderer from "react-test-renderer";
import DropdownListTrigger from "../DropdownListTrigger.js";

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

describe("DropdownListTrigger", function() {
  it("renders correctly with given props", function() {
    const tree = renderer
      .create(
        <DropdownListTrigger
          onTrigger={this.callback}
          placeholder="Placeholder"
          disabled
          className="class-1 class-2"
          selectedItem={{
            html: "html",
            id: "id",
            selectedHtml: "selectedHtml"
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders corectly with null item", function() {
    const tree = renderer
      .create(
        <DropdownListTrigger
          onTrigger={this.callback}
          placeholder="Placeholder"
          disabled
          className="class-1 class-2"
          selectedItem={null}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders correctly with empty item", function() {
    const tree = renderer
      .create(
        <DropdownListTrigger
          onTrigger={this.callback}
          placeholder="Placeholder"
          disabled
          className="class-1 class-2"
          selectedItem={{
            id: "id"
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders correctly without props", function() {
    const tree = renderer.create(<DropdownListTrigger />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe("#onTrigger", function() {
    afterEach(function() {
      Array.prototype.slice
        .call(document.body.children)
        .forEach(function(node) {
          document.body.removeChild(node);
        });
    });
    it("triggers onTrigger", function() {
      const callback = jest.fn();
      const instance = TestUtils.renderIntoDocument(
        <DropdownListTrigger onTrigger={callback} />
      );
      const button = TestUtils.findRenderedDOMComponentWithTag(
        instance,
        "button"
      );
      TestUtils.Simulate.click(button);
      expect(callback).toBeCalled();
    });
    it("triggers onTrigger", function() {
      const callback = jest.fn();
      const instance = TestUtils.renderIntoDocument(
        <DropdownListTrigger disabled onTrigger={callback} />
      );
      const button = TestUtils.findRenderedDOMComponentWithTag(
        instance,
        "button"
      );
      TestUtils.Simulate.click(button);
      expect(callback).not.toBeCalled();
    });
  });
});
