jest.dontMock("../VirtualList");
jest.dontMock("../../Util/Util");
jest.dontMock("../../Util/DOMUtil");

/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const ReactDOM = require("react-dom");
const VirtualList = require("../VirtualList");

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

describe("VirtualList", function() {
  beforeEach(function() {
    this.container = global.document.createElement("div");
    this.instance = ReactDOM.render(
      <VirtualList
        items={[1]}
        itemHeight={10}
        renderItem={function(item) { return <span>item</span>;}}
        renderBufferItem={function(item) { return <span>item</span>;}}
      />,
      this.container
    );
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe("#getBox box that defines the visible part of the list", function() {
    it("matches the viewport when starting at 0 and filling the viewport", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: view.top,
        bottom: view.bottom
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });

    it("matches the viewport when starting at 0 and overfilling the viewport", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 0,
        bottom: 2000
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });

    it("matches the top half of the viewport when starting at 0 and only filling the first half", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 0,
        bottom: 500
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(500);
    });

    it("matches the bottom half of the viewport when starting halfway down", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: 500,
        bottom: 1500
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(500);
    });

    it("matches the bottom half of the list when scrolled 500px past the bottom of the list", function() {
      var view = {
        top: 500,
        bottom: 1500
      };

      var list = {
        top: 0,
        bottom: 1000
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(500);
      expect(box.bottom).toBe(1000);
    });

    it("matches the mid-section of the list when scrolled down appropriately", function() {
      var view = {
        top: 1000,
        bottom: 2000
      };

      var list = {
        top: 0,
        bottom: 3000
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(1000);
      expect(box.bottom).toBe(2000);
    });

    it("fills the list box when the viewbox is larger", function() {
      var view = {
        top: 0,
        bottom: 2000
      };

      var list = {
        top: 500,
        bottom: 1500
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });
  });

  describe("renderer that calculates the items to render (and to not render)", function() {
    var viewport = 1000;
    var itemHeight = 200;
    var itemCount = 20;

    it("shows the first 5 items at the top of the viewport", function() {
      var windowScrollY = 0;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        0
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(4);
    });

    it("shows the last 5 items at the bottom of the viewport", function() {
      var windowScrollY = 3000;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        0
      );

      expect(result.firstItemIndex).toBe(15);
      expect(result.lastItemIndex).toBe(19);
    });

    it("shows 6 items if the viewport starts in the middle of an item", function() {
      var windowScrollY = 100;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        0
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(5);
    });

    it("shows the first 3 (2.5 items) if the list starts halfway down the page", function() {
      var windowScrollY = 0;
      var offsetTop = viewport / 2;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        0
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(2);
    });

    it("shows the last 3 (2.5 items) if the viewport is scrolled 500px past the bottom of the list", function() {
      var windowScrollY = 3500;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        0
      );

      expect(result.firstItemIndex).toBe(17);
      expect(result.lastItemIndex).toBe(19);
    });

    it("shows all items if the list is smaller than the viewbox", function() {
      var windowScrollY = 0;
      var offsetTop = 100;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        4,
        0
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(3);
    });

    it("shows items that are in the viewport and buffer", function() {
      var windowScrollY = 0;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        5
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(9);
    });

    it("does not show items after the viewport, beyond the buffer", function() {
      var windowScrollY = 0;
      var offsetTop = 1000;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        5
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(4);
    });

    it("does not show items before the viewport, beyond the buffer", function() {
      var windowScrollY = 4000;
      var offsetTop = 0;

      var result = this.instance.getItems(
        windowScrollY,
        viewport,
        offsetTop,
        itemHeight,
        itemCount,
        5
      );

      expect(result.firstItemIndex).toBe(15);
      expect(result.lastItemIndex).toBe(19);
    });

    it("shows items before and after the viewport, in the buffer", function() {
      var result = this.instance.getItems(
        1000,
        viewport,
        0,
        itemHeight,
        itemCount,
        5
      );

      expect(result.firstItemIndex).toBe(0);
      expect(result.lastItemIndex).toBe(14);
    });

    it("renders only required items", function() {
      var renderItemSpy = jasmine.createSpy("renderItemSpy");
      this.instance.getItemsToRender(
        { itemHeight: 20, renderItem: renderItemSpy },
        { items: Array.from({ length: 2 }), bufferStart: 2 * 20 }
      );

      expect(renderItemSpy.calls.count()).toBe(2);
      expect(renderItemSpy.calls.allArgs()).toEqual([
        [undefined, 2],
        [undefined, 3]
      ]);
    });
  });

  describe("with some content", function(){
    it("renders something", function() {
      var tableContents = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance,
        "span"
      );

      expect(tableContents.length).toBe(3);
    });
  });

  describe("with failing renderItem", function() {
    beforeEach(function() {
      this.container = global.document.createElement("div");
      this.instance = ReactDOM.render(
        <VirtualList
          items={[<li>1</li>]}
          itemHeight={10}
          renderItem={function() {
            throw Error("fail");
          }}
          renderBufferItem={function() {}}
        />,
        this.container
      );
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it("renders properly filling the viewport", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: view.top,
        bottom: view.bottom
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });
  });

  describe("with failing renderBufferItem", function() {
    beforeEach(function() {
      this.container = global.document.createElement("div");
      this.instance = ReactDOM.render(
        <VirtualList
          items={[<li>1</li>]}
          itemHeight={10}
          renderItem={function() {}}
          renderBufferItem={function() {
            throw Error("fail");
          }}
        />,
        this.container
      );
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it("renders properly filling the viewport", function() {
      var view = {
        top: 0,
        bottom: 1000
      };

      var list = {
        top: view.top,
        bottom: view.bottom
      };

      var box = this.instance.getBox(view, list);

      expect(box.top).toBe(0);
      expect(box.bottom).toBe(1000);
    });
  });
});
