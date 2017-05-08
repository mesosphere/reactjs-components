/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */
var TestUtils = require("react-addons-test-utils");

jest.dontMock("../Confirm.js");

var Confirm = require("../Confirm.js");

describe("Confirm", function() {
  describe("enabled", function() {
    beforeEach(function() {
      this.closeCallback = jasmine.createSpy("closeCallback");
      this.confirmCallback = jasmine.createSpy("confirmCallback");
      this.instance = TestUtils.renderIntoDocument(
        <Confirm
          open={true}
          leftButtonCallback={this.closeCallback}
          rightButtonCallback={this.confirmCallback}
          leftButtonClassName="left-button"
          rightButtonClassName="right-button"
        >
          <div className="container-pod">
            Would you like to perform this action?
          </div>
        </Confirm>
      );

      // Gotta do this hacky thing,
      // because rendering the portal is not a good idea
      this.instance = TestUtils.renderIntoDocument(this.instance.getButtons());
    });

    it("calls the left button callback", function() {
      var button = this.instance.querySelector(".left-button");
      TestUtils.Simulate.click(button);
      expect(this.closeCallback).toHaveBeenCalled();
    });

    it("calls the right button callback", function() {
      var button = this.instance.querySelector(".right-button");
      TestUtils.Simulate.click(button);
      expect(this.confirmCallback).toHaveBeenCalled();
    });
  });

  describe("disabled", function() {
    beforeEach(function() {
      this.closeCallback = jasmine.createSpy("closeCallback");
      this.confirmCallback = jasmine.createSpy("confirmCallback");
      this.instance = TestUtils.renderIntoDocument(
        <Confirm
          open={true}
          disabled={true}
          leftButtonCallback={this.closeCallback}
          rightButtonCallback={this.confirmCallback}
          leftButtonClassName="button left-button"
          rightButtonClassName="button right-button"
        >
          <div className="container-pod">
            Would you like to perform this action?
          </div>
        </Confirm>
      );

      // Gotta do this hacky thing,
      // because rendering the portal is not a good idea
      this.instance = TestUtils.renderIntoDocument(this.instance.getButtons());
    });

    it("does call the left button callback", function() {
      var button = this.instance.querySelector(".left-button");
      TestUtils.Simulate.click(button);
      expect(this.closeCallback).toHaveBeenCalled();
    });

    it("does not call the right button callback", function() {
      var button = this.instance.querySelector(".right-button");
      TestUtils.Simulate.click(button);
      expect(this.confirmCallback).not.toHaveBeenCalled();
    });

    it("sets the disabled class on buttons", function() {
      var buttons = this.instance.querySelectorAll(".button");
      expect(buttons.length).toEqual(2);
    });
  });
});
