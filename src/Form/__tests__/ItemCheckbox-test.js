jest.dontMock('../ItemCheckbox');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var ItemCheckbox = require('../ItemCheckbox');

describe('ItemCheckbox', function () {

  describe('#render', function () {

    it('is not checked by default', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <ItemCheckbox
          name="foo" />
      );

      var component = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(component);

      expect(el.checked).toEqual(false);
    });

    it('is not checked by default', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <ItemCheckbox
          name="foo"
          checked={true} />
      );

      var component = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(component);

      expect(el.checked).toEqual(true);
    });

    it('is not disabled by default', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <ItemCheckbox
          name="foo" />
      );

      var component = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(component);

      expect(el.disabled).toEqual(false);
    });

    it('allows setting checkbox to disabled', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <ItemCheckbox
          name="foo"
          disabled={true} />
      );

      var component = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(component);

      expect(el.disabled).toEqual(true);
    });

  });

});
