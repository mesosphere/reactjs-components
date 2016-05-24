jest.dontMock('../FieldRadioButton');
jest.dontMock('../icons/IconRadioButton');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var TestUtils = require('react-addons-test-utils');

var IconRadioButton = require('../icons/IconRadioButton');
var FieldRadioButton = require('../FieldRadioButton');

describe('FieldRadioButton', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]}
          validationError={{bar: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]} />
      );

      expect(instance.hasError()).toEqual(false);
    });
  });

  describe('#getErrorMsg', function () {
    it('should return a label if validationError is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]} />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });

  describe('#getLabel', function () {
    it('should return a paragraph if showLabel has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          showLabel="bar"
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('p');
    });

    it('can handle a custom render function', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          showLabel={<h1>hello</h1>}
          startValue={[]} />
      );

      expect(instance.getLabel().type).toEqual('h1');
    });

    it('should return null if showLabel doesn\'t has a value', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]} />
      );

      expect(instance.getLabel()).toEqual(null);
    });
  });

  describe('#getItems', function () {
    beforeEach(function () {
      this.handleEventSpy = jasmine.createSpy('handleEvent');
      this.instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          handleEvent={this.handleEventSpy}
          startValue={[
            {name: 'foo'},
            {name: 'bar', checked: true},
            {name: 'quis', checked: false}
          ]}
          labelClass="foo" />
      );
      this.children = TestUtils.scryRenderedComponentsWithType(
        this.instance,
        IconRadioButton
      );

      this.inputChildren = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance,
        'input'
      );
    });

    it('should return an empty array if startValue is empty', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          startValue={[]} />
      );

      expect(instance.getItems()).toEqual([]);
    });

    it('should return an instance of IconRadioButton', function () {
      expect(TestUtils.isCompositeComponentWithType(
        this.children[0],
        IconRadioButton
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
        <FieldRadioButton
          name="foo"
          startValue={[
            {name: 'foo'},
            {name: 'bar', checked: true, labelClass: 'bar'},
            {name: 'quis', checked: false}
          ]}
          labelClass="foo" />
      );
      var children = TestUtils.scryRenderedComponentsWithType(
        instance,
        IconRadioButton
      );

      expect(children[1].props.labelClass).toEqual('bar');
    });

    it('should call handler with \'multipleChange\' for items', function () {
      TestUtils.Simulate.change(
        this.inputChildren[0],
        {target: {checked: true}}
      );
      var args = this.handleEventSpy.mostRecentCall.args;
      expect(args[0]).toEqual('multipleChange');
      expect(args[1]).toEqual('foo');
      expect(args[2]).toEqual([
        {name: 'foo', checked: true},
        {name: 'bar', checked: false}
      ]);
    });

    it('should call handleChange with \'change\' on single item', function () {
      var handleEventSpy = jasmine.createSpy('handleEvent');
      var instance = TestUtils.renderIntoDocument(
        <FieldRadioButton
          name="foo"
          handleEvent={handleEventSpy}
          startValue={{name: 'bar'}}
          labelClass="foo" />
      );
      var input = TestUtils.findRenderedDOMComponentWithTag(instance, 'input');
      TestUtils.Simulate.change(input, {target: {checked: true}});
      var args = handleEventSpy.mostRecentCall.args;
      expect(args[0]).toEqual('change');
      expect(args[1]).toEqual('foo');
      expect(args[2]).toEqual(true);
    });

    it('should display the checked of each item', function () {
      expect(this.children[0].props.checked).toEqual(undefined);
      expect(this.children[1].props.checked).toEqual(true);
      expect(this.children[2].props.checked).toEqual(false);
    });

    it('should change value of other checked items to false', function () {
      this.instance.handleChange('multipleChange', 'quis', {target: {checked: true}})
      expect(this.handleEventSpy).toHaveBeenCalledWith(
        // Event name
        'multipleChange',
        // Field name
        'foo',
         // Changed radio buttons
        [{name: 'quis', checked: true}, {name: 'bar', checked: false}],
         // Event fired
        {target: {checked: true}}
      );
    });
  });
});
