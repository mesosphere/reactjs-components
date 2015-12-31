jest.dontMock('../FieldInput');
jest.dontMock('../icons/IconEdit');
jest.dontMock('../../utils/KeyboardUtil');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var FieldInput = require('../FieldInput');

describe('FieldInput', function () {

  describe('#isEditing', function () {
    it('should return true when editing is equal to name', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="edit"
          editing="username"
          handleEvent={function () {}} />
      );

      expect(instance.isEditing()).toEqual(true);
    });

    it('should return false when editing is false', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="edit"
          editing={false}
          handleEvent={function () {}} />
      );

      expect(instance.isEditing()).toEqual(false);
    });

    it('should return false when writeType is not edit', function () {
      var instance = instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing={true}
          handleEvent={function () {}} />
      );

      expect(instance.isEditing()).toEqual(false);
    });
  });

  describe('#getInputElement', function () {
    it('should return a span if not editing', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="edit"
          editing={false}
          handleEvent={function () {}} />
      );

      expect(instance.getInputElement({}).type).toEqual('span');
    });

    it('should return an input if editing', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="edit"
          editing="username"
          handleEvent={function () {}} />
      );

      expect(instance.getInputElement({}).type).toEqual('input');
    });

    it('should return an input if writeType is input', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing={false}
          handleEvent={function () {}} />
      );

      expect(instance.getInputElement({}).type).toEqual('input');
    });
  });

  describe('#getLabel', function () {
    it('should return a label if showLabel is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing={false}
          handleEvent={function () {}}
          showLabel={true} />
      );

      expect(instance.getLabel().type).toEqual('label');
    });

    it('should return null if showLabel is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing={false}
          handleEvent={function () {}}
          showLabel={false} />
      );

      expect(instance.getLabel()).toEqual(null);
    });
  });

  describe('#getErrorMsg', function () {
    it('should return a label if validationError is true', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing="username"
          handleEvent={function () {}}
          validationError={{username: 'errored'}} />
      );

      expect(instance.getErrorMsg().type).toEqual('p');
    });

    it('should return null if validationError is false', function () {
      var instance = TestUtils.renderIntoDocument(
        <FieldInput
          name="username"
          fieldType="text"
          writeType="input"
          editing={false}
          handleEvent={function () {}}
          validationError={false} />
      );

      expect(instance.getErrorMsg()).toEqual(null);
    });
  });
});
