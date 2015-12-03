var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../Confirm.js');

var Confirm = require('../Confirm.js');

describe('Confirm', function () {

  beforeEach(function () {
    this.closeCallback = jasmine.createSpy("closeCallback");
    this.confirmCallback = jasmine.createSpy("confirmCallback");
    this.instance = TestUtils.renderIntoDocument(
      <Confirm
        open={true}
        leftButtonCallback={this.closeCallback}
        rightButtonCallback={this.confirmCallback}
        leftButtonClassName="left-button"
        rightButtonClassName="right-button">
        <div className="container-pod">
          Would you like to perform this action?
        </div>
      </Confirm>
    );

    // Gotta do this hacky thing,
    // because rendering the portal is not a good idea
    this.instance = TestUtils.renderIntoDocument(this.instance.getButtons());
  });

  it('calls the left button callback', function () {
    var button = TestUtils.findRenderedDOMComponentWithClass(
      this.instance, 'left-button'
    );

    TestUtils.Simulate.click(button);
    expect(this.closeCallback).toHaveBeenCalled();
  });

  it('calls the right button callback', function () {
    var button = TestUtils.findRenderedDOMComponentWithClass(
      this.instance, 'right-button'
    );

    TestUtils.Simulate.click(button);
    expect(this.confirmCallback).toHaveBeenCalled();
  });

});
