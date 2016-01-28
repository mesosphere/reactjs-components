jest.dontMock('../FieldCheckboxMultiple');
jest.dontMock('../ItemCheckbox');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var TestUtils = require('react-addons-test-utils');

var ItemCheckbox = require('../ItemCheckbox');
var FieldCheckboxMultiple = require('../FieldCheckboxMultiple');

describe('FieldCheckboxMultiple', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]}
          validationError={{bar: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]} />
      );

      expect(instance.hasError()).toEqual(false);
    });
  });

  describe('#getErrorMsg', function () {
    it('should return a label if validationError is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]} />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });

  describe('#getLabel', function () {
    it('should return a paragraph if showLabel has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          showLabel="bar"
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('p');
    });

    it('can handle a custom render function', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          showLabel={<h1>hello</h1>}
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('h1');
    });

    it('should return null if showLabel doesn\'t has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]} />
      );

      expect(instance.getLabel()).toEqual(null);
    });
  });

  describe('#getItems', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[
            {name: 'foo', indeterminate: false},
            {name: 'bar', checked: true},
            {name: 'quis', checked: false, indeterminate: true}
          ]}
          labelClass="foo" />
      );
      this.children = TestUtils.scryRenderedComponentsWithType(
        this.instance,
        ItemCheckbox
      );
    });

    it('should return an empty array if startValue is empty', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[]} />
      );

      expect(instance.getItems()).toEqual([]);
    });

    it('should return an instance of ItemCheckbox', function () {
      expect(TestUtils.isCompositeComponentWithType(
        this.children[0],
        ItemCheckbox
      )).toEqual(true);
    });

    it('should display items pass in from startValue', function () {
      expect(this.children.length).toEqual(3);
    });

    it('should display parent labelClass on all items', function () {
      for (var i = 0; i < this.children.length; i++) {
        expect(this.children[i].props.labelClass).toEqual('foo');
      }
    });

    it('should override parent labelClass with item labelClass', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckboxMultiple
          name="foo"
          startValue={[
            {name: 'foo', indeterminate: false},
            {name: 'bar', checked: true, labelClass: 'bar'},
            {name: 'quis', checked: false, indeterminate: true}
          ]}
          labelClass="foo" />
      );
      var children = TestUtils.scryRenderedComponentsWithType(
        instance,
        ItemCheckbox
      );

      expect(children[1].props.labelClass).toEqual('bar');
    });

    it('should have the parent handleEvent on all items', function () {
      for (var i = 0; i < this.children.length; i++) {
        expect(this.children[i].props.handleEvent)
          .toEqual(this.instance.handleEvent);
      }
    });

    it('should display the name of each item', function () {
      expect(this.children[0].props.name).toEqual('foo');
      expect(this.children[1].props.name).toEqual('bar');
      expect(this.children[2].props.name).toEqual('quis');
    });

    it('should display the checked of each item', function () {
      expect(this.children[0].props.checked).toEqual(undefined);
      expect(this.children[1].props.checked).toEqual(true);
      expect(this.children[2].props.checked).toEqual(false);
    });

    it('should display the indeterminate of each item', function () {
      expect(this.children[0].props.indeterminate).toEqual(false);
      expect(this.children[1].props.indeterminate).toEqual(undefined);
      expect(this.children[2].props.indeterminate).toEqual(true);
    });
  });
});
