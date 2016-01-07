jest.dontMock('../FieldCheckbox');
jest.dontMock('../ItemCheckbox');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var ItemCheckbox = require('../ItemCheckbox');
var FieldCheckbox = require('../FieldCheckbox');

describe('FieldCheckbox', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}}
          fieldType="checkbox" />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{bar: 'bar'}}
          fieldType="checkbox" />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          fieldType="checkbox" />
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
          validationError={{foo: 'bar'}}
          fieldType="checkbox" />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          fieldType="checkbox" />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });

  describe('#getDescription', function () {
    it('should return a paragraph if description has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          description="bar"
          startValue={[]}
          fieldType="checkbox" />
      );

      expect(instance.getDescription().type).toEqual('p');
    });

    it('should return null if description doesn\'t has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          fieldType="checkbox" />
      );

      expect(instance.getDescription()).toEqual(null);
    });
  });

  describe('#getItems', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[
            {name: 'foo', indeterminate: false},
            {name: 'bar', checked: true},
            {name: 'quis', checked: false, indeterminate: true}
          ]}
          labelClass="foo"
          fieldType="checkbox" />
      );
      this.children = TestUtils.scryRenderedComponentsWithType(
        this.instance,
        ItemCheckbox
      );
    });

    it('should return an empty array if startValue is empty', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          fieldType="checkbox" />
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
        <FieldCheckbox
          name="foo"
          startValue={[
            {name: 'foo', indeterminate: false},
            {name: 'bar', checked: true, labelClass: 'bar'},
            {name: 'quis', checked: false, indeterminate: true}
          ]}
          labelClass="foo"
          fieldType="checkbox" />
      );
      var children = TestUtils.scryRenderedComponentsWithType(
        instance,
        ItemCheckbox
      );

      expect(children[1].props.labelClass).toEqual('bar');
    });

    it('should have the parent handleChange on all items', function () {
      for (var i = 0; i < this.children.length; i++) {
        expect(this.children[i].props.handleChange)
          .toEqual(this.instance.handleChange);
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
