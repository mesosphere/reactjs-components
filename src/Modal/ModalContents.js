import classNames from "classnames/dedupe";
import GeminiScrollbar from "react-gemini-scrollbar";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import PropTypes from "prop-types";
/**
 * Lifecycle of a Modal:
 * initial page load -> empty ReactCSSTransitionGroup
 * interaction changes open to true -> render modal content without scrollbars
 * get height of content -> rerender modal content and cap the height
 */
import { CSSTransitionGroup } from "react-transition-group";

import BindMixin from "../Mixin/BindMixin";
import DOMUtil from "../Util/DOMUtil";
import Keycodes from "../constants/Keycodes";
import Util from "../Util/Util";

// This value is used to designate "off-limits" vertical space, so that the
// modal never comes into contact with the edge of the viewport.
const MODAL_VERTICAL_INSET_DISTANCE = 48;

class ModalContents extends Util.mixin(BindMixin) {
  constructor() {
    super(...arguments);

    this.lastConstrainedHeight = null;
    this.state = {
      height: null
    };
  }

  get methodsToBind() {
    return [
      "calculateContentHeight",
      "closeModal",
      "handleBackdropClick",
      "handleKeyDown",
      "handleWindowResize"
    ];
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);

    if (this.props.open !== nextProps.open) {
      document.body.classList.toggle("no-overflow");
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);

    // If we don't already know the height of the content, we calculate it.
    if (this.props.open) {
      this.lastViewportHeight = Math.ceil(DOMUtil.getViewportHeight());
      global.requestAnimationFrame(this.calculateContentHeight);
    }
  }

  componentWillUpdate(nextProps) {
    // Reset the height of the content to null when the modal is closing so
    // that the height will be recalculated next time it opens.
    if (this.props.open && !nextProps.open) {
      this.setState({ height: null });
      this.removeKeydownListener();
    }

    if (!this.props.open && nextProps.open) {
      this.addKeydownListener();
    }
  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    if (this.props.open) {
      document.body.classList.add("no-overflow");
    }

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);

    document.body.classList.remove("no-overflow");
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleBackdropClick() {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === Keycodes.esc) {
      this.closeModal();
    }
  }

  handleWindowResize() {
    const { props, state } = this;

    // Return early if the modal is closed or not using Gemini.
    if (!props.open) {
      return;
    }

    const viewportHeight = Math.ceil(DOMUtil.getViewportHeight());

    // If the height of the viewport is getting shorter, or if it's growing
    // while the height is currently constrained, then we reset the restrained
    // height to null which will cause the height to be recalculated on the
    // next render.
    if (
      viewportHeight < this.lastViewportHeight ||
      (viewportHeight > this.lastViewportHeight && state.height !== null)
    ) {
      this.setState({ height: null });
    }

    this.lastViewportHeight = viewportHeight;
    global.requestAnimationFrame(this.calculateContentHeight);
  }

  addKeydownListener() {
    global.document.body.addEventListener("keydown", this.handleKeyDown);
  }

  removeKeydownListener() {
    global.document.body.removeEventListener("keydown", this.handleKeyDown);
  }

  calculateContentHeight() {
    // A full screen modal doesn't need to restrict its height.
    if (this.props.isFullScreen) {
      return;
    }

    const {
      footerRef,
      headerRef,
      modalRef,
      innerContentRef,
      innerContentContainerRef
    } = this;

    let headerHeight = 0;
    let footerHeight = 0;
    let modalHeight = 0;
    let innerContentHeight = 0;

    if (headerRef != null) {
      headerHeight = Math.ceil(headerRef.getBoundingClientRect().height);
    }

    if (footerRef != null) {
      footerHeight = Math.ceil(footerRef.getBoundingClientRect().height);
    }

    if (modalRef != null) {
      modalHeight = Math.ceil(modalRef.getBoundingClientRect().height);
    }

    if (innerContentRef != null) {
      innerContentHeight = Math.ceil(
        innerContentRef.getBoundingClientRect().height
      );
    }

    const maxModalHeight =
      this.lastViewportHeight - MODAL_VERTICAL_INSET_DISTANCE;

    const totalModalContentHeight =
      innerContentHeight + headerHeight + footerHeight;

    // When the modal's content fits on the screen, both the modal and body
    // height can be set to `auto` (default).
    let nextInnerContentContainerHeight = "auto";
    let nextModalHeight = "auto";

    // When the modal's content is too large to fit on the screen, then we need
    // to explicitly set the body's height to its exact pixel value and the
    // modal's height to `100%`.
    const shouldConstrainHeight =
      totalModalContentHeight >= maxModalHeight ||
      this.lastViewportHeight < this.lastConstrainedHeight;

    if (shouldConstrainHeight) {
      const availableContentHeight = modalHeight - headerHeight - footerHeight;
      nextInnerContentContainerHeight = `${availableContentHeight}px`;
      nextModalHeight = "100%";

      // We need to keep track of the largest viewport height that results in a
      // constrained modal.
      if (
        this.lastConstrainedHeight == null ||
        this.lastViewportHeight > this.lastConstrainedHeight
      ) {
        this.lastConstrainedHeight = this.lastViewportHeight;
      }

      if (
        this.props.useGemini &&
        this.state.height !== availableContentHeight
      ) {
        this.setState({ height: availableContentHeight });
      }
    }

    if (innerContentContainerRef != null) {
      innerContentContainerRef.style.height = nextInnerContentContainerHeight;
    }
    if (modalRef != null) {
      modalRef.style.height = nextModalHeight;
    }

    this.triggerGeminiUpdate();
  }

  closeModal() {
    this.props.onClose();
  }

  getCloseButton() {
    const { props } = this;

    if (props.closeButton) {
      return props.closeButton;
    }

    return null;
  }

  getHeader() {
    const { props } = this;

    if (props.showHeader === false) {
      return null;
    }

    return (
      <div
        className={props.headerClass}
        ref={element => (this.headerRef = element)}
      >
        {props.header}
        {props.subHeader}
      </div>
    );
  }

  getFooter() {
    const { props } = this;

    if (props.showFooter === false) {
      return null;
    }

    return (
      <div
        className={props.footerClass}
        ref={element => (this.footerRef = element)}
      >
        {props.footer}
      </div>
    );
  }

  getModalContent() {
    const { props, state } = this;

    const modalContent = (
      <div
        className={props.scrollContainerClass}
        ref={element => (this.innerContentRef = element)}
      >
        {props.children}
      </div>
    );

    // If the consume disables gemini or we don't know the height, then we
    // don't render with Gemini, unless the consumer is using specifying a
    // custom height.
    if (
      (!props.useGemini || state.height == null) &&
      props.modalHeight == null
    ) {
      return modalContent;
    }

    const geminiClasses = classNames("container-scrollable", props.geminiClass);
    const geminiContainerStyle = { height: state.height };

    if (props.modalHeight) {
      geminiContainerStyle.height = props.modalHeight;
    }

    return (
      <GeminiScrollbar
        autoshow={false}
        className={geminiClasses}
        ref={element => (this.geminiRef = element)}
        style={geminiContainerStyle}
      >
        {modalContent}
      </GeminiScrollbar>
    );
  }

  getModal() {
    const { props, state } = this;
    const modalBodyStyle = {};

    if (!props.open) {
      return null;
    }

    if (state.height != null) {
      modalBodyStyle.height = state.height;
    }

    return (
      <div
        ref={element => (this.modalRef = element)}
        className={props.modalClass}
      >
        {this.getCloseButton()}
        {this.getHeader()}
        <div
          className={props.bodyClass}
          style={modalBodyStyle}
          ref={element => (this.innerContentContainerRef = element)}
        >
          {this.getModalContent()}
        </div>
        {this.getFooter()}
      </div>
    );
  }

  getBackdrop() {
    const { props } = this;

    if (!props.open) {
      return null;
    }

    return (
      <div className={props.backdropClass} onClick={this.handleBackdropClick} />
    );
  }

  triggerGeminiUpdate() {
    if (this.geminiRef != null && this.geminiRef.scrollbar != null) {
      this.geminiRef.scrollbar.update();
    }
  }

  render() {
    const { props } = this;
    let modalContent = null;

    if (props.open) {
      modalContent = (
        <div className={classNames("modal-wrapper", props.modalWrapperClass)}>
          {this.getBackdrop()}
          {this.getModal()}
        </div>
      );
    }

    return (
      <CSSTransitionGroup
        transitionAppear={props.transitionAppear}
        transitionEnter={props.transitionEnter}
        transitionLeave={props.transitionLeave}
        transitionName={props.transitionNameModal}
        transitionAppearTimeout={props.transitionAppearTimeoutModal}
        transitionEnterTimeout={props.transitionEnterTimeoutModal}
        transitionLeaveTimeout={props.transitionLeaveTimeoutModal}
        component="div"
      >
        {modalContent}
      </CSSTransitionGroup>
    );
  }
}

ModalContents.defaultProps = {
  closeByBackdropClick: true,
  footer: null,
  header: null,
  isFullScreen: false,
  onClose: () => {},
  open: false,
  showHeader: false,
  showFooter: false,
  subHeader: null,
  transitionNameModal: "modal",
  transitionAppearTimeoutModal: 300,
  transitionEnterTimeoutModal: 300,
  transitionLeaveTimeoutModal: 300,
  transitionAppear: true,
  transitionEnter: true,
  transitionLeave: true,
  useGemini: true,

  // Default classes.
  backdropClass: "modal-backdrop",
  bodyClass: "modal-body-wrapper",
  closeButtonClass: "modal-close",
  footerClass: "modal-footer",
  headerClass: "modal-header",
  modalClass: "modal modal-large",
  scrollContainerClass: "modal-body"
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
  // Optionally set full screen modal to avoid content height restrictions.
  isFullScreen: PropTypes.bool,
  // Specify a custom modal height.
  modalHeight: PropTypes.string,
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
  geminiClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  headerClass: PropTypes.string,
  modalClass: PropTypes.string,
  modalWrapperClass: PropTypes.string,
  scrollContainerClass: PropTypes.string
};

module.exports = ModalContents;
