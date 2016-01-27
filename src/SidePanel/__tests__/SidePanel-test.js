/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var TestUtils = require('react-addons-test-utils');

jest.dontMock('../SidePanelContents');
jest.dontMock('../../Util/DOMUtil');

var SidePanelContents = require('../SidePanelContents');

describe('SidePanelContents', function () {

  describe('#getContents', function () {
    it('should return null if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={false} />
      );

      var sidePanel = instance.getContents();
      expect(sidePanel).toEqual(null);
    });

    it('should return an element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true} />
      );

      var sidePanel = instance.getContents();
      expect(TestUtils.isElement(sidePanel)).toEqual(true);
    });

    it('should have the gemini scrollbar', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true} />
      );

      var scrollbar = TestUtils.findRenderedDOMComponentWithClass(
        instance,
        'gm-scroll-view'
      );
      expect(TestUtils.isDOMComponent(scrollbar)).toEqual(true);
    });

    it('should render its children if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true}>
          <div className="child">foo</div>
        </SidePanelContents>
      );

      var child = TestUtils.findRenderedDOMComponentWithClass(
        instance,
        'child'
      );
      expect(child.textContent).toEqual('foo');
    });
  });

  describe('#getBackdrop', function () {
    it('should not return a backdrop if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={false} />
      );

      var backdrop = instance.getBackdrop();
      expect(backdrop).toEqual(null);
    });

    it('should return a backdrop element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true} />
      );

      var backdrop = instance.getBackdrop();
      expect(TestUtils.isElement(backdrop)).toEqual(true);
    });
  });

  describe('#getHeader', function () {
    it('should return null if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true} />
      );

      var header = instance.getHeader();
      expect(header).toEqual(null);
    });

    it('should return an element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanelContents open={true} header={<p>Foo</p>} />
      );

      var header = instance.getHeader();
      expect(TestUtils.isElement(header)).toEqual(true);
    });
  });

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <SidePanelContents
          onClose={this.onClose}
          open={true}
          closeByBackdropClick={true} />
      );
    });

    it('should not call onClose before the side panel closes', function () {
      expect(this.onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when the side panel closes', function () {
      this.instance.closeSidePanel();
      expect(this.onClose).toHaveBeenCalled();
    });

    describe('#handleBackdropClick', function () {
      it('should call onClose', function () {
        this.instance.handleBackdropClick();
        expect(this.onClose).toHaveBeenCalled();
      });

      it('should not call onClose if closeByBackdropClick is false', function () {
        var instance = TestUtils.renderIntoDocument(
          <SidePanelContents onClose={this.onClose}
            open={true}
            closeByBackdropClick={false} />
        );

        instance.handleBackdropClick();
        expect(this.onClose).not.toHaveBeenCalled();
      });
    });
  });
});
