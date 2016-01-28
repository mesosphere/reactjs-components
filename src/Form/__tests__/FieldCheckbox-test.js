jest.dontMock('../FieldCheckbox');
jest.dontMock('../ItemCheckbox');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ItemCheckbox = require('../ItemCheckbox');
var FieldCheckbox = require('../FieldCheckbox');

describe('FieldCheckbox', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{bar: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]} />
      );

      expect(instance.hasError()).toEqual(false);
    });
  });

  describe('#getErrorMsg', function () {
    it('should return a label if validationError is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]} />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });

  describe('#getLabel', function () {
    it('should return a paragraph if showLabel has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          showLabel="bar"
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('p');
    });

    it('can handle a custom render function', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          showLabel={<h1>hello</h1>}
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('h1');
    });

    it('should return null if showLabel doesn\'t has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]} />
      );

      expect(instance.getLabel()).toEqual(null);
    });
  });

  describe('#render', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          labelClass="foo" />
      );
      this.children = TestUtils.scryRenderedComponentsWithType(
        this.instance,
        ItemCheckbox
      );
    });

    it('should return an instance of ItemCheckbox', function () {
      expect(TestUtils.isCompositeComponentWithType(
        this.children[0],
        ItemCheckbox
      )).toEqual(true);
    });

  });

});
