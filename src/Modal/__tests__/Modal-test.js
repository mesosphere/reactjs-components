var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../Modal');
jest.dontMock('../../Util/Util');

var Modal = require('../Modal');

describe('Modal', function () {

  describe('#getModal', function () {
    it('should return null if modal is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={false} />
      );

      expect(instance.getModal()).toEqual(null);
    });

    it('should return an element if modal is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={true} />
      );

      var modal = instance.getModal();
      expect(TestUtils.isElement(modal)).toEqual(true);
    });
  });

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <Modal onClose={this.onClose} open={true} />
      );
    });

    it('should not call onClose before the modal closes', function () {
      expect(this.onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when the modal closes', function () {
      this.instance.closeModal();
      expect(this.onClose).toHaveBeenCalled();
    });

    describe('#handleBackdropClick', function () {
      it('should call onClose', function () {
        this.instance.handleBackdropClick();
        expect(this.onClose).toHaveBeenCalled();
      });

      it('should not call onClose if closeByBackdropClick is false', function () {
        var instance = TestUtils.renderIntoDocument(
          <Modal onClose={this.onClose} 
            open={true} 
            closeByBackdropClick={false} />
        );

        instance.handleBackdropClick();
        expect(this.onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('#getFooter', function () {
    it('should not return a footer if disabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showFooter={false} />
      );

      expect(instance.getFooter()).toEqual(null);
    });

    it('should return a footer if enabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showFooter={true} />
      );

      var footer = instance.getFooter();
      expect(TestUtils.isElement(footer)).toEqual(true);
    });
  });

  describe('#getCloseButton', function () {
    it('should not return a button if disabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showCloseButton={false} />
      );

      expect(instance.getCloseButton()).toEqual(null);
    });

    it('should return a button if enabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showCloseButton={true} />
      );

      var closeButton = instance.getCloseButton();
      expect(TestUtils.isElement(closeButton)).toEqual(true);
    });
  });
});
