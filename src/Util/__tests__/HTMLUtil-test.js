jest.dontMock("../HTMLUtil");
jest.dontMock("../../constants/HtmlAttributes");

const HTMLUtil = require("../HTMLUtil");
const HtmlAttributes = require("../../constants/HtmlAttributes");

describe("HTMLUtil", function() {
  describe("#filterAttributes", function() {
    it("keeps html attributes", function() {
      expect(HTMLUtil.filterAttributes(HtmlAttributes)).toEqual(HtmlAttributes);
    });

    it("keeps data-* attributes", function() {
      expect(HTMLUtil.filterAttributes({ "data-test": "test" })).toEqual({
        "data-test": "test"
      });
    });

    it("keeps aria-* attributes", function() {
      expect(HTMLUtil.filterAttributes({ "aria-test": "test" })).toEqual({
        "aria-test": "test"
      });
    });

    it("filters unknown attributes", function() {
      expect(HTMLUtil.filterAttributes({ randomAttr: "test" })).toEqual({});
    });
  });
});
