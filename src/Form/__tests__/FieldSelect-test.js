jest.dontMock('../FieldSelect');
jest.dontMock('../icons/IconEdit');
jest.dontMock('../../Util/KeyboardUtil');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var TestUtils = require('react-addons-test-utils');

var FieldSelect = require('../FieldSelect');

describe('FieldSelect', function () {

  describe('#hasError', function () {
    it('should return true when error contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          validationError={{username: 'bar'}}
          handleEvent={function () {}} />
      );

      expect(instance.hasError()).toEqual(true);
    });

    it('should return false when error doesn\'t contains name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          validationError={{foo: 'bar'}}
          handleEvent={function () {}} />
      );

      expect(instance.hasError()).toEqual(false);
    });

    it('should return false when error is undefined', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}} />
      );

      expect(instance.hasError()).toEqual(false);
    });
  });

  describe('#getLabel', function () {
    it('should return a label if showLabel is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}}
          showLabel={true} />
      );

      expect(instance.getLabel().type).toEqual('label');
    });

    it('can handle a custom render function', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}}
          showLabel={<h1>hello</h1>} />
      );

      expect(instance.getLabel().type).toEqual('h1');
    });

    it('should return null if showLabel is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}}
          showLabel={false} />
      );

      expect(instance.getLabel()).toEqual(null);
    });
  });

  describe('#getErrorMsg', function () {
    it('should return a label if validationError is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}}
          validationError={{username: 'errored'}} />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldSelect
          name="username"
          options={[
            '1', '2'
          ]}
          handleEvent={function () {}} />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });
});
