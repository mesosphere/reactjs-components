var VirtualList = require('../VirtualList');

jest.dontMock('../VirtualList');
jest.dontMock('../../Util/Util');
jest.dontMock('../../Util/DOMUtil');
jest.dontMock('../../Mixin/BindMixin');

describe('VirtualList', function () {

  describe('#getBox box that defines the visible part of the list', function () {
    it('matches the viewport when starting at 0 and filling the viewport', function () {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: view.top,
        bottom: view.bottom
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });

    it('matches the viewport when starting at 0 and overfilling the viewport', function () {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 0,
        bottom: 2000
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });

    it('matches the top half of the viewport when starting at 0 and only filling the first half', function () {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 0,
        bottom: 500
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(500);
    });

    it('matches the bottom half of the viewport when starting halfway down', function () {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 500,
        bottom: 1500
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(500);
    });

    it('matches the bottom half of the list when scrolled 500px past the bottom of the list', function () {
      var view = {
        top: 500,
        bottom: 1500
      };

      var list = {
        top: 0,
        bottom: 1000
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(500);
      expect(box.bottom).toBe(1000);
    });

    it('matches the mid-section of the list when scrolled down appropriately', function () {
      var view = {
        top: 1000,
        bottom: 2000
      };

      var list = {
        top: 0,
        bottom: 3000
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(1000);
      expect(box.bottom).toBe(2000);
    });

    it('fills the list box when the viewbox is larger', function () {
      var view = {
        top: 0,
        bottom: 2000
      };

      var list = {
        top: 500,
        bottom: 1500
      };

      var box = VirtualList.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });
  });

  describe('renderer that calculates the items to render (and to not render)', function () {
    var viewport = 1000;
    var itemHeight = 200;
    var itemCount = 20;

    it('shows items that are in the viewport', function () {
      var windowScrollY = 0;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBeGreaterThan(0);
    });

    it('does not show items after the viewport', function () {
      var windowScrollY = 0;
      var offsetTop = 1000;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBe(0);
    });

    it('does not show items before the viewport', function () {
      var windowScrollY = 4000;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBe(0);
    });

    it('shows the first 5 items at the top of the viewport', function () {
      var windowScrollY = 0;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBe(5);
      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(4);
    });

    it('shows the last 5 items at the bottom of the viewport', function () {
      var windowScrollY = 3000;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBe(5);
      expect(result.firstItemIndex).toBe(15);
      expect(result.lastItemIndex).toBe(19);
    });

    it('shows 6 items if the viewport starts in the middle of an item', function () {
      var windowScrollY = 100;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.itemsInView).toBe(6);
    });

    it('shows the first 3 (2.5 items) if the list starts halfway down the page', function () {
      var windowScrollY = 0;
      var offsetTop = viewport / 2;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.firstItemIndex).toBe(0);
      expect(result.itemsInView).toBe(3);
    });

    it('shows the last 3 (2.5 items) if the viewport is scrolled 500px past the bottom of the list', function () {
      var windowScrollY = 3500;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 0);

      expect(result.firstItemIndex).toBe(17);
      expect(result.itemsInView).toBe(3);
    });

    it('shows all items if the list is smaller than the viewbox', function () {
      var windowScrollY = 0;
      var offsetTop = 100;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, 4, 0);

      expect(result.firstItemIndex).toBe(0);
      expect(result.itemsInView).toBe(4);
      expect(result.lastItemIndex).toBe(3);
    });

    it('shows items that are in the viewport and buffer', function () {
      var windowScrollY = 0;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 5);

      expect(result.itemsInView).toBeGreaterThan(5);
    });

    it('does not show items after the viewport, beyond the buffer', function () {
      var windowScrollY = 0;
      var offsetTop = 1000;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 5);

      expect(result.itemsInView).toBe(5);
    });

    it('does not show items before the viewport, beyond the buffer', function () {
      var windowScrollY = 4000;
      var offsetTop = 0;

      var result = VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount, 5);

      expect(result.itemsInView).toBe(5);
    });

    it('shows items before and after the viewport, in the buffer', function () {
      var result = VirtualList.getItems(1000, viewport, 0, itemHeight, itemCount, 5);

      expect(result.itemsInView).toBe(15);
    });
  });
});
