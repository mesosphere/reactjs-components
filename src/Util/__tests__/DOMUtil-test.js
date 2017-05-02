jest.dontMock("../DOMUtil");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var DOMUtil = require("../DOMUtil");

describe("DOMUtil", function() {
  describe("#closest", function() {
    it(
      "should should return the parent element when provided a selector and " +
        "element where the element is a child of the selection",
      function() {
        var el = {
          parentElement: {
            id: "something-fake",
            matches: function() {
              return true;
            }
          },
          matches: function() {
            return false;
          }
        };
        var match = DOMUtil.closest(el, ".fake-selector");

        expect(match.id).toEqual("something-fake");
      }
    );

    it(
      "should should return null when provided a selector and element where " +
        "the element is not a child of the selection",
      function() {
        var el = {
          parentElement: null,
          matches: function() {
            return true;
          }
        };
        var match = DOMUtil.closest(el, ".fake-selector");

        expect(match).toEqual(null);
      }
    );

    it(
      "should should return the provided element when the provided element" +
        "matches the selector AND has a parent element",
      function() {
        var el = {
          parentElement: {
            id: "something-fake",
            matches: function() {
              return false;
            }
          },
          id: "child-element",
          matches: function() {
            return true;
          }
        };
        var match = DOMUtil.closest(el, ".fake-selector");

        expect(match.id).toEqual("child-element");
      }
    );
  });

  describe("#getNodeClearance", function() {
    beforeEach(function() {
      DOMUtil.getViewportHeight = function() {
        return 600;
      };

      DOMUtil.getViewportWidth = function() {
        return 600;
      };
    });

    it("should return the element's distance from all edges", function() {
      let node = {
        getBoundingClientRect: function() {
          return {
            bottom: 200,
            left: 100,
            right: 200,
            top: 100
          };
        }
      };

      let clearance = DOMUtil.getNodeClearance(node);

      expect(clearance.bottom).toEqual(400);
      expect(clearance.left).toEqual(100);
      expect(clearance.right).toEqual(400);
      expect(clearance.top).toEqual(100);
    });
  });
});
