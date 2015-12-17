jest.dontMock("../FormControl");
jest.dontMock("../FormControl");
jest.dontMock("../FieldInput");
jest.dontMock("../icons/IconEdit");
jest.dontMock("../../constants/FieldTypes");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var FormControl = require("../FormControl");

function getDefinition() {
  return {
    fieldName: "username",
    value: "string",
    validation: function (arg) {
      return arg.length < 15;
    },
    placeholder: "What's up?",
    fieldType: "text",
    errorText: "Must be less than 8 characters",
    required: true,
    showLabel: true,
    writeType: "edit"
  };
}

function getInstance() {
  return TestUtils.renderIntoDocument(
    <FormControl
      currentValue="default"
      definition={getDefinition()}
      editing={null}
      handleEvent={function () {}}
      maxColumnWidth={13}
      validationError={false} />
  );
}

describe("FormControl", function () {

  describe("#renderDefinition", function () {
    beforeEach(function () {
      this.instance = getInstance();

      this.prevRenderGroup = this.instance.renderGroup;
      this.prevRenderType = this.instance.renderType;

      this.instance.renderGroup = jasmine.createSpy();
      this.instance.renderType = jasmine.createSpy();
    });

    afterEach(function () {
      this.instance.renderGroup = this.prevRenderGroup;
      this.instance.renderType = this.prevRenderType;
    });

    it("calls #renderGroup if definition is an array", function () {
      this.instance.renderDefinition([]);

      expect(this.instance.renderGroup).toHaveBeenCalled();
    });

    it("calls #renderType if definition is an object", function () {
      this.instance.renderDefinition({});

      expect(this.instance.renderType).toHaveBeenCalled();
    });
  });

  describe("#renderGroup", function () {
    beforeEach(function () {
      this.instance = getInstance();

      this.prevRenderDefinition = this.instance.renderDefinition;
      this.instance.renderDefinition = jest.genMockFunction();
    });

    afterEach(function () {
      this.instance.renderDefinition = this.prevRenderDefinition;
    });

    it("calls #renderDefinition for every item in the array", function () {
      var items = [1, 2, 3, 4, 5];
      this.instance.renderGroup(items);

      var calls = this.instance.renderDefinition.mock.calls;
      expect(calls.length).toEqual(5);

      calls.forEach(function (call, i) {
        // Expect first argument of each call to be the item.
        expect(call[0]).toEqual(items[i]);
      });
    });
  });

  describe("#renderType", function () {
    beforeEach(function () {
      this.instance = getInstance();
    });

    it("calculates correct column width for last element", function () {
      var definition = {
        fieldType: "text"
      };
      var result = this.instance.renderType(definition, 7, true);

      expect(result.props.columnWidth).toEqual(7);
    });

    it("calculates correct column width for all other", function () {
      var definition = {
        fieldType: "text"
      };
      var result = this.instance.renderType(definition, 7, false);

      expect(result.props.columnWidth).toEqual(1);
    });
  });

});
