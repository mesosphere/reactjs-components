var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../Modal');
jest.dontMock('../../Util/Util');

var Modal = require('../Modal');

describe('Modal', function () {

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <Modal onClose={this.onClose} open={true}>
          {this.content}
        </Modal>
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
    });
  });
});
