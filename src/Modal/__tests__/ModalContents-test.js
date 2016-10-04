/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';
var TestUtils = require('react-addons-test-utils');

jest.dontMock('../../Util/DOMUtil');
jest.dontMock('../ModalContents');

var DOMUtil = require('../../Util/DOMUtil');
var ModalContents = require('../ModalContents');

// We need to add requestAnimationFrame for the component.
window.requestAnimationFrame = function (func) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  return func.apply(this, args);
};

describe('ModalContents', function () {

  beforeEach(function () {
    document.body.classList.add = function () {};
    document.body.classList.remove = function () {};
    document.body.classList.toggle = function () {};
  });

  describe('#getModal', function () {
    it('should return null if modal is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={false} />
      );

      expect(instance.getModal()).toEqual(null);
    });

    it('should return an element if modal is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      var modal = instance.getModal();
      expect(TestUtils.isElement(modal)).toEqual(true);
    });

    it('should instruct #getModalContent not to render with scrollbar if useGemini is false',
      function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents
            open={true}
            useGemini={false} />
        );
        instance.getModalContent = jasmine.createSpy();
        instance.getModal();

        expect(instance.getModalContent.mostRecentCall.args[0]).toEqual(false);
      }
    );

    it('should instruct #getModalContent to render with scrollbar if useGemini is true',
      function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents
            open={true}
            useGemini={true} />
        );
        instance.getModalContent = jasmine.createSpy();
        instance.getModal();

        expect(instance.getModalContent).toHaveBeenCalledWith(true);
      }
    );
  });

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <ModalContents
          onClose={this.onClose}
          open={true}
          closeByBackdropClick={true}/>
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

      it('does not call onClose if closeByBackdropClick is false', function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents onClose={this.onClose}
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
        <ModalContents showFooter={false} />
      );

      expect(instance.getFooter()).toEqual(null);
    });

    it('should return a footer if enabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents showFooter={true} />
      );

      var footer = instance.getFooter();
      expect(TestUtils.isElement(footer)).toEqual(true);
    });
  });

  describe('#getBackdrop', function () {
    it('should not return a backdrop when closed', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={false} />
      );

      expect(instance.getBackdrop()).toEqual(null);
    });

    it('should return a backdrop when open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      var backdrop = instance.getBackdrop();
      expect(TestUtils.isElement(backdrop)).toEqual(true);
    });
  });

  describe('#getCloseButton', function () {
    it('should not return a button if disabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents />
      );

      expect(instance.getCloseButton()).toEqual(null);
    });

    it('should return a button if closeButton is provided', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents closeButton={<button>Close</button>} />
      );

      var closeButton = instance.getCloseButton();
      expect(TestUtils.isElement(closeButton)).toEqual(true);
    });
  });

  describe('#handleWindowResize', function () {
    beforeEach(function () {
      var getVeiwportHeightCalls = 0;
      var viewportHeightValues = [100, 99, 101, 102];

      this.getViewportHeight = DOMUtil.getViewportHeight;

      DOMUtil.getViewportHeight = function () {
        return viewportHeightValues[getVeiwportHeightCalls++];
      };
    });

    afterEach(function () {
      DOMUtil.getViewportHeight = this.getViewportHeight;
    });

    it('should store the last viewport height on the instance', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} useGemini={true} />
      );

      instance.handleWindowResize();

      expect(instance.lastViewportHeight).toEqual(100);
    });

    it('should reset the height stored in state to null when the viewport ' +
      'height is shrinking',
      function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents open={true} useGemini={true} />
        );

        instance.state.height = 300;

        // The first call returns 100.
        instance.handleWindowResize();
        expect(instance.state.height).toEqual(300);

        // The second call returns 99, so the viewport is shrinking and
        // state.height should be reset to null.
        instance.handleWindowResize();

        expect(instance.lastViewportHeight).toEqual(99);
        expect(instance.state.height).toEqual(null);
      });

    it('should reset the height stored in state to null when the viewport ' +
      'height is growing and state.height has previously been calculated',
      function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents open={true} useGemini={true} />
        );

        // The first call returns 100.
        instance.handleWindowResize();
        expect(instance.state.height).toEqual(null);
        // The second call returns 99, so the viewport is shrinking and
        // state.height should be reset to null.
        instance.handleWindowResize();
        expect(instance.state.height).toEqual(null);
        // The third call returns 101, so the viewport height is growing, but
        // state.height should already be null.
        instance.handleWindowResize();
        expect(instance.state.height).toEqual(null);
        expect(instance.lastViewportHeight).toEqual(101);
        // We explicitly set state to 300 so that the next resize handler call
        // will trigger setState.
        instance.state.height = 300;
        // The fourth call returns 102, so the viewport height is growing, and
        // state.height is not null, so the fourth call should trigger a setState
        // with the height as null.
        instance.handleWindowResize();
        expect(instance.state.height).toEqual(null);
      });
  });

  describe('#calculateContentHeight', function () {
    it('sets state.height to the height of the innerContentContainer if ' +
      'innerContentHeight is larger than innerContentContainerHeight',
      function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents open={true} useGemini={true} />
        );

        instance.refs.innerContent.getBoundingClientRect = function () {
          return {height: 400};
        };

        instance.refs.innerContentContainer.getBoundingClientRect = function () {
          return {height: 200};
        };

        instance.calculateContentHeight();

        expect(instance.state.height).toEqual(200);
      });
  });

  describe('overflow hidden on body', function () {
    beforeEach(function () {
      document.body.classList.add = jasmine.createSpy();
      document.body.classList.remove = jasmine.createSpy();
      document.body.classList.toggle = jasmine.createSpy();

      this.node = document.createElement('div');
    });

    it('should toggle no-overflow on body when updated to open', function () {
      ReactDOM.render(<ModalContents open={false} />, this.node);
      ReactDOM.render(<ModalContents open={true} />, this.node);

      expect(document.body.classList.toggle)
        .toHaveBeenCalledWith('no-overflow');
    });

    it('should toggle no-overflow on body when updated to close', function () {
      ReactDOM.render(<ModalContents open={true} />, this.node);
      ReactDOM.render(<ModalContents open={false} />, this.node);

      expect(document.body.classList.toggle)
        .toHaveBeenCalledWith('no-overflow');
    });

    it('should add no-overflow on body when mounted open', function () {
      ReactDOM.render(<ModalContents open={true} />, this.node);

      expect(document.body.classList.add).toHaveBeenCalledWith('no-overflow');
    });

    it('should not change class on body when mounted close', function () {
      ReactDOM.render(<ModalContents open={false} />, this.node);

      expect(document.body.classList.toggle).not.toHaveBeenCalledWith();
      expect(document.body.classList.add).not.toHaveBeenCalledWith();
      expect(document.body.classList.remove).not.toHaveBeenCalledWith();
    });

    it('should remove no-overflow on body when unmounted', function () {
      ReactDOM.render(<ModalContents open={true} />, this.node);
      ReactDOM.render(<div />, this.node);

      expect(document.body.classList.remove)
        .toHaveBeenCalledWith('no-overflow');
    });
  });
});
