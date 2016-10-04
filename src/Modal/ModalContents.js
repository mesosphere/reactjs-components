import GeminiScrollbar from 'react-gemini-scrollbar';
/* eslint-disable no-unused-vars */
import React, {PropTypes} from 'react';
/* eslint-enable no-unused-vars */
/**
 * Lifecycle of a Modal:
 * initial page load -> empty ReactCSSTransitionGroup
 * interaction changes open to true -> render modal content without scrollbars
 * get height of content -> rerender modal content and cap the height
 */
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import BindMixin from '../Mixin/BindMixin';
import DOMUtil from '../Util/DOMUtil';
import KeyDownMixin from '../Mixin/KeyDownMixin';
import Util from '../Util/Util';

class ModalContents extends Util.mixin(BindMixin, KeyDownMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      height: null
    };
  }

  get methodsToBind() {
    return [
      'calculateContentHeight',
      'closeModal',
      'handleBackdropClick',
      'handleWindowResize'
    ];
  }

  get keysToBind() {
    return {
      esc: this.closeModal
    };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);

    if (this.props.open !== nextProps.open) {
      document.body.classList.toggle('no-overflow');
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);

    // If we don't already know the height of the content, we calculate it.
    if (this.props.open && this.props.useGemini && this.state.height == null) {
      global.requestAnimationFrame(this.calculateContentHeight);
    }
  }

  componentWillUpdate(nextProps) {
    // Reset the height of the content to null when the modal is closing so
    // that the height will be recalculated next time it opens.
    if (this.props.open && !nextProps.open) {
      this.setState({height: null});
    }
  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    if (this.props.open) {
      document.body.classList.add('no-overflow');
    }

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);

    document.body.classList.remove('no-overflow');
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleBackdropClick() {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  }

  handleWindowResize() {
    let {props, state} = this;

    // Return early if the modal is closed or not using Gemini.
    if (!props.open || !props.useGemini) {
      return;
    }

    let viewportHeight = DOMUtil.getViewportHeight();

    // If the height of the viewport is getting shorter, or if it's growing
    // while the height is currently constrained, then we reset the restrained
    // height to null which will cause the height to be recalculated on the
    // next render.
    if (viewportHeight < this.lastViewportHeight
      || (viewportHeight > this.lastViewportHeight
        && state.height !== null)) {
      this.setState({height: null});
    }

    this.lastViewportHeight = viewportHeight;
  }

  calculateContentHeight() {
    let {innerContent, innerContentContainer} = this.refs;

    let innerContentHeight = innerContent.getBoundingClientRect().height;
    let innerContentContainerHeight = innerContentContainer
      .getBoundingClientRect().height;

    if (innerContentHeight > innerContentContainerHeight) {
      this.setState({height: innerContentContainerHeight});
    }
  }

  closeModal() {
    this.props.onClose();
  }

  getCloseButton() {
    let {props} = this;

    if (props.closeButton) {
      return props.closeButton;
    }

    return null;
  }

  getHeader() {
    let {props} = this;

    if (props.showHeader === false) {
      return null;
    }

    return (
      <div className={props.headerClass}>
        {props.header}
        {props.subHeader}
      </div>
    );
  }

  getFooter() {
    let {props} = this;

    if (props.showFooter === false) {
      return null;
    }

    return (
      <div className={props.footerClass}>
        {props.footer}
      </div>
    );
  }

  getModalContent() {
    let {props, state} = this;

    let modalContent = (
      <div className={props.scrollContainerClass} ref="innerContent">
        {props.children}
      </div>
    );

    // If we aren't rendering with Gemini, or we don't know the height of the
    // modal's content, then we render without Gemini.
    if (!props.useGemini || state.height == null) {
      return modalContent;
    }

    let geminiContainerStyle = {
      height: state.height
    };

    return (
      <GeminiScrollbar
        autoshow={false}
        className="container-scrollable"
        style={geminiContainerStyle}>
        {modalContent}
      </GeminiScrollbar>
    );
  }

  getModal() {
    let {props, state} = this;
    let modalStyle = null;

    if (!props.open) {
      return null;
    }

    if (state.height != null) {
      modalStyle = {flexBasis: state.height};
    }

    return (
      <div ref="modal" className={props.modalClass}>
        {this.getCloseButton()}
        {this.getHeader()}
        <div className={props.bodyClass}
          style={modalStyle}
          ref="innerContentContainer">
          {this.getModalContent()}
        </div>
        {this.getFooter()}
      </div>
    );
  }

  getBackdrop() {
    let {props} = this;

    if (!props.open) {
      return null;
    }

    return (
      <div className={props.backdropClass} onClick={this.handleBackdropClick} />
    );
  }

  render() {
    let {props} = this;
    let modalContent = null;

    if (props.open) {
      modalContent = (
        <div className={props.modalWrapperClass}>
          {this.getBackdrop()}
          {this.getModal()}
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup
        transitionAppear={props.transitionAppear}
        transitionEnter={props.transitionEnter}
        transitionLeave={props.transitionLeave}
        transitionName={props.transitionNameModal}
        transitionAppearTimeout={props.transitionAppearTimeoutModal}
        transitionEnterTimeout={props.transitionEnterTimeoutModal}
        transitionLeaveTimeout={props.transitionLeaveTimeoutModal}
        component="div">
        {modalContent}
      </ReactCSSTransitionGroup>
    );
  }
}

ModalContents.defaultProps = {
  closeByBackdropClick: true,
  footer: null,
  header: null,
  onClose: () => {},
  open: false,
  showHeader: false,
  showFooter: false,
  subHeader: null,
  transitionNameModal: 'modal',
  transitionAppearTimeoutModal: 300,
  transitionEnterTimeoutModal: 300,
  transitionLeaveTimeoutModal: 300,
  transitionAppear: true,
  transitionEnter: true,
  transitionLeave: true,
  useGemini: true,

  // Default classes.
  backdropClass: 'modal-backdrop',
  bodyClass: 'modal-body-wrapper',
  closeButtonClass: 'modal-close',
  footerClass: 'modal-footer',
  headerClass: 'modal-header',
  modalClass: 'modal modal-large',
  scrollContainerClass: 'modal-body'
};

ModalContents.propTypes = {
  children: PropTypes.node,
  // Appends whatever value is provided as a close button.
  closeButton: PropTypes.node,
  // Allow closing of modal when click happens outside modal. Defaults to true.
  closeByBackdropClick: PropTypes.bool,
  // Allow resize of modal to fit screen. Defaults to true.
  // Optional footer
  footer: PropTypes.object,
  // Optional header.
  header: PropTypes.node,
  // Optional callback function exected when modal is closed.
  onClose: PropTypes.func,
  // True if modal is open, false otherwise.
  open: PropTypes.bool,
  // Set true to show header. Defaults to false.
  showHeader: PropTypes.bool,
  // Set true to show footer. Defaults to false.
  showFooter: PropTypes.bool,
  // Optional subheader.
  subHeader: PropTypes.node,
  // Optional enter and leave transition name for modal
  transitionNameModal: PropTypes.string,
  // Transition lengths, must be non-zero
  transitionAppearTimeoutModal: PropTypes.number,
  transitionEnterTimeoutModal: PropTypes.number,
  transitionLeaveTimeoutModal: PropTypes.number,
  // Optionally disable transitions
  transitionAppear: PropTypes.bool,
  transitionEnter: PropTypes.bool,
  transitionLeave: PropTypes.bool,
  // Option to use Gemini scrollbar. Defaults to true.
  useGemini: PropTypes.bool,

  // Classes
  backdropClass: PropTypes.string,
  bodyClass: PropTypes.string,
  closeButtonClass: PropTypes.string,
  footerClass: PropTypes.string,
  headerClass: PropTypes.string,
  modalClass: PropTypes.string,
  modalWrapperClass: PropTypes.string,
  scrollContainerClass: PropTypes.string
};

module.exports = ModalContents;
