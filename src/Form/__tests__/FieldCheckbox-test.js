jest.dontMock('../FieldCheckbox');
jest.dontMock('../FieldRadioButton');
jest.dontMock('../icons/IconCheckbox');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var IconCheckbox = require('../icons/IconCheckbox');
var FieldCheckbox = require('../FieldCheckbox');

describe('FieldCheckbox', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{foo: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]}
          validationError={{bar: 'bar'}} />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = TestUtils.renderIntoDocument(
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

  describe('#getItems', function () {
    beforeEach(function () {
      this.handleEventSpy = jasmine.createSpy('handleEvent');
      this.instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          handleEvent={this.handleEventSpy}
          startValue={[
            {name: 'foo', indeterminate: false},
            {name: 'bar', checked: true},
            {name: 'quis', checked: false, indeterminate: true}
          ]}
          labelClass="foo" />
      );
      this.children = TestUtils.scryRenderedComponentsWithType(
        this.instance,
        IconCheckbox
      );

      this.inputChildren = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance,
        'input'
      );
    });

    it('should return an empty array if startValue is empty', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          startValue={[]} />
      );

      expect(instance.getItems()).toEqual([]);
    });

    it('should return an instance of IconCheckbox', function () {
      expect(TestUtils.isCompositeComponentWithType(
        this.children[0],
        IconCheckbox
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
          labelClass="foo" />
      );
      var children = TestUtils.scryRenderedComponentsWithType(
        instance,
        IconCheckbox
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
      expect(args[2]).toEqual([{name: 'foo', checked: true}]);
    });

    it('should call handleChange with \'change\' on single item', function () {
      var handleEventSpy = jasmine.createSpy('handleEvent');
      var instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          handleEvent={handleEventSpy}
          startValue={false}
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

    it('should change value of only the checked item', function () {
      this.instance.handleChange('multipleChange', 'quis', {target: {checked: true}})
      expect(this.handleEventSpy).toHaveBeenCalledWith(
        // Event name
        'multipleChange',
        // Field name
        'foo',
         // Changed radio buttons
        [{name: 'quis', checked: true}],
         // Event fired
        {target: {checked: true}}
      );
    });

    it('should display the indeterminate of each item', function () {
      expect(this.children[0].props.indeterminate).toEqual(false);
      expect(this.children[1].props.indeterminate).toEqual(undefined);
      expect(this.children[2].props.indeterminate).toEqual(true);
    });

  });

  describe('#render', function () {

    it('is not checked by default', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo" />
      );

      var inputComponent = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(inputComponent);

      expect(el.checked).toEqual(false);
    });

    it('allows setting initial checked value', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo"
          checked={true} />
      );

      var inputComponent = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(inputComponent);

      expect(el.checked).toEqual(true);
    });

    it('is not disabled by default', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
          name="foo" />
      );

      var inputComponent = TestUtils.findRenderedDOMComponentWithTag(
        instance, 'input'
      );
      var el = ReactDOM.findDOMNode(inputComponent);

      expect(el.disabled).toEqual(false);
    });

    it('allows setting checkbox to disabled', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldCheckbox
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
