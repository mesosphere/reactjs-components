jest.dontMock('../Tooltip');
jest.dontMock('../../Util/Util');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Tooltip = require('../Tooltip');

describe('Tooltip', function () {

  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <Tooltip anchor="start" className="foo" content="I'm a tooltip!"
        position="bottom">
        <span>Tooltip Trigger</span>
      </Tooltip>
    );
  });

  it('should render with the intended class', function () {
    var tooltip = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'foo'
    );

    expect(tooltip.length).toEqual(1);
  });

  it('should render with the intended position as a class', function () {
    var tooltip = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'position-bottom'
    );

    expect(tooltip.length).toEqual(1);
  });

  it('should render with the intended anchor as a class', function () {
    var tooltip = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, 'anchor-start'
    );

    expect(tooltip.length).toEqual(1);
  });

  describe('#handleMouseEnter', function () {

    it('should set isOpen to true', function () {
      this.instance.handleMouseEnter();

      expect(this.instance.state.isOpen).toBeTruthy();
    });

    it('should set anchor to what was returned from #getIdealPosition',
      function () {
      this.instance.handleMouseEnter();

      expect(this.instance.state.anchor).toEqual('start');
    });

    it('should set position to what was returned from #getIdealPosition',
      function () {
      this.instance.handleMouseEnter();

      expect(this.instance.state.position).toEqual('bottom');
    });

  });

  describe('#handleMouseLeave', function () {

    it('should set isOpen to true', function () {
      this.instance.handleMouseLeave();

      expect(this.instance.state.isOpen).toBeFalsy();
    });

  });

});
