jest.dontMock('../DOMUtil');

var DOMUtil = require('../DOMUtil');

describe('DOMUtil', function () {

  describe('#closest', function () {

    it('should should return the parent element when provided a selector and ' +
      'element where the element is a child of the selection', function () {
      var el = {
        parentElement: {
          id: 'something-fake',
          matches: function () {
            return true;
          },
          matchesSelector: function () {
            return true;
          }
        },
        matches: function () {
          return false;
        }
      };
      var match = DOMUtil.closest(el, '.fake-selector');

      expect(match.id).toEqual('something-fake');
    });

    it('should should return null when provided a selector and element where ' +
      'the element is not a child of the selection', function () {
      var el = {
        parentElement: null,
        matches: function () {
          return true;
        },
        matchesSelector: function () {
          return true;
        }
      };
      var match = DOMUtil.closest(el, '.fake-selector');

      expect(match).toEqual(null);
    });

    it('should should return the provided element when the provided element' +
      'matches the selector AND has a parent element', function () {
      var el = {
        parentElement: {
          id: 'something-fake',
          matches: function () {
            return false;
          },
          matchesSelector: function () {
            return false;
          }
        },
        id: 'child-element',
        matches: function () {
          return true;
        }
      };
      var match = DOMUtil.closest(el, '.fake-selector');

      expect(match.id).toEqual('child-element');
    });

  });

});
