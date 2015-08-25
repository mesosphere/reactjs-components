var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../SidePanel');
jest.dontMock('../../Util/DOMUtil');

var SidePanel = require('../SidePanel');

describe('SidePanel', function () {

  describe('#getContents', function () {
    it('should return null if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={false} />
      );

      var sidePanel = instance.getContents();
      expect(sidePanel).toEqual(null);
    });

    it('should return an element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={true} />
      );

      var sidePanel = instance.getContents();
      expect(TestUtils.isElement(sidePanel)).toEqual(true);
    });
  });

  describe('#getBackdrop', function () {
    it('should not return a backdrop if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={false} />
      );

      var backdrop = instance.getBackdrop();
      expect(backdrop).toEqual(null);
    });

    it('should return a backdrop element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={true} />
      );

      var backdrop = instance.getBackdrop();
      expect(TestUtils.isElement(backdrop)).toEqual(true);
    });
  });

  describe('#getHeader', function () {
    it('should return null if side panel is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={true} />
      );

      var header = instance.getHeader();
      expect(header).toEqual(null);
    });

    it('should return an element if side panel is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <SidePanel open={true} header={<p>Foo</p>} />
      );

      var header = instance.getHeader();
      expect(TestUtils.isElement(header)).toEqual(true);
    });
  });

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <SidePanel onClose={this.onClose} open={true} closeByBackdropClick={true}/>
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
          <SidePanel onClose={this.onClose}
            open={true}
            closeByBackdropClick={false} />
        );

        instance.handleBackdropClick();
        expect(this.onClose).not.toHaveBeenCalled();
      });
    });
  });
});
