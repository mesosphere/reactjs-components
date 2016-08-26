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
import KeyDownMixin from '../Mixin/KeyDownMixin';
import * as DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

const DEFAULT_HEIGHT = {
  height: 'auto',
  contentHeight: 'auto',
  innerContentHeight: null
};

class ModalContents extends Util.mixin(BindMixin, KeyDownMixin) {
  get methodsToBind() {
    return [
      'handleWindowResize',
      'handleBackdropClick',
      'closeModal'
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

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);

    if (this.props.open) {
      this.checkHeight();
    } else if (!this.props.open && prevProps.open) {
      this.resetHeight();
      this.rerendered = false;
    }
  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    this.resetHeight();
    if (this.props.open) {
      document.body.classList.add('no-overflow');
    }
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);

    this.resetHeight();
    document.body.classList.remove('no-overflow');
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleBackdropClick() {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  }

  handleWindowResize() {
    // Render the modal again if the window resizes because the height
    // of the viewport may change and we need to adapt to that.
    if (this.props.open) {
      this.forceUpdate();
    }
  }

  resetHeight() {
    this.heightInfo = Util.clone(DEFAULT_HEIGHT);
  }

  checkContentHeightChange(prevHeightInfo, heightInfo) {
    let {contentHeight, height, maxHeight, innerContentHeight} = heightInfo;
    let prevInnerContentHeight = prevHeightInfo.innerContentHeight;
    let prevHeight = prevHeightInfo.height;
    let prevContentHeight = prevHeightInfo.contentHeight;
    let prevMaxHeight = prevHeightInfo.maxHeight;

    // Default update height to whether there is some change in height
    let update = prevHeight !== height || prevContentHeight !== contentHeight;

    if (prevInnerContentHeight != null) {
      // Make sure to update heightInfo with new height difference
      let difference = innerContentHeight - prevInnerContentHeight;
      if (difference !== 0 && height + difference < maxHeight) {
        // Changes this.heightInfo as this is a reference
        heightInfo.height += difference;
        heightInfo.contentHeight += difference;
        update = true;
      }

      // Make sure to update heightInfo with new max height difference
      let maxHeightDifference = maxHeight - prevMaxHeight;
      if (maxHeightDifference > 0 &&
        (heightInfo.contentHeight + difference < innerContentHeight)) {
        // Changes this.heightInfo as this is a reference
        heightInfo.height += maxHeightDifference;
        heightInfo.contentHeight += maxHeightDifference;
        update = true;
      }

    }

    if (update) {
      this.forceUpdate();
    }
  }

  checkHeight() {
    let prevHeightInfo = this.heightInfo;

    // Calculate height and call a render on first render cycle
    this.heightInfo = this.calculateModalHeight();
    this.checkContentHeightChange(prevHeightInfo, this.heightInfo);

    // This only occurs on first render
    if (!this.rerendered) {
      this.rerendered = true;
      this.forceUpdate();
    }
  }

  closeModal() {
    this.props.onClose();
  }

  getInnerContentHeight() {
    if (!this.refs.innerContent) {
      return null;
    }

    return DOMUtil.getComputedDimensions(this.refs.innerContent).height;
  }

  getInnerContainerHeightInfo() {
    let innerContainer = this.refs.innerContainer;
    let originalHeight = innerContainer.offsetHeight;
    let totalContentHeight = this.refs.modal.offsetHeight;

    // Height without padding, margin, border.
    let contentHeight = DOMUtil.getComputedDimensions(innerContainer).height;

    // Height of padding, margin, border.
    let outerHeight = originalHeight - contentHeight;

    let innerContentHeight = this.getInnerContentHeight();

    // Modal cannot be bigger than this height. Add 10 for the gemini
    // horizontal scrollbar.
    let maxHeight = Math.ceil(
      window.innerHeight * this.props.maxHeightPercentage
    ) + 10;

    // We minus the maxHeight with the outerHeight because it will
    // not show the content correctly due to 'box-sizing: border-box'.
    if (contentHeight > maxHeight) {
      contentHeight = maxHeight;
    }

    return {
      contentHeight,
      innerContentHeight,
      maxHeight,
      originalHeight,
      outerHeight,
      totalContentHeight
    };
  }

  calculateModalHeight() {
    let height = 0;
    let {
      contentHeight,
      innerContentHeight,
      maxHeight,
      originalHeight,
      outerHeight,
      totalContentHeight
    } = this.getInnerContainerHeightInfo();

    if (totalContentHeight > maxHeight) {
      height = maxHeight - (totalContentHeight - originalHeight);
      contentHeight = height - outerHeight;
    } else {
      height = originalHeight;
    }

    // Default to auto height because we don't want height to be 0. This may
    // happen when you close a modal and there is no content.
    if (height == null || height <= 0) {
      return Util.clone(DEFAULT_HEIGHT);
    }

    return {height, contentHeight, innerContentHeight, maxHeight};
  }

  getCloseButton() {
    let props = this.props;
    if (!props.showCloseButton) {
      return null;
    }

    return (
      <a
        className={props.closeButtonClass}
        onClick={this.closeModal}>
        <span className={props.closeTitleClass}>
          Close
        </span>
        <i className={props.closeIconClass}></i>
      </a>
    );
  }

  getHeader() {
    let props = this.props;

    if (props.showHeader === false) {
      return null;
    }

    return (
      <div className={props.headerClass}>
        <div className={props.headerContainerClass}>
          <h5 className={props.titleClass}>
            {props.titleText}
          </h5>
          {props.subHeader}
        </div>
      </div>
    );
  }

  getFooter() {
    let props = this.props;
    if (props.showFooter === false) {
      return null;
    }

    return (
      <div className={props.footerClass}>
        <div className={props.footerContainerClass}>
          {props.footer}
        </div>
      </div>
    );
  }

  getModalContent(useScrollbar, contentHeight) {
    if (!useScrollbar) {
      return (
        <div className={this.props.scrollContainerClass}>
          {this.props.children}
        </div>
      );
    }

    let geminiContainerStyle = {
      height: contentHeight
    };

    return (
      <GeminiScrollbar
        autoshow={true}
        className="container-scrollable"
        style={geminiContainerStyle}>
        <div className={this.props.scrollContainerClass} ref="innerContent">
          {this.props.children}
        </div>
      </GeminiScrollbar>
    );
  }

  getModal() {
    let props = this.props;
    if (!props.open) {
      return null;
    }

    let calculatedHeight = this.heightInfo;
    let contentHeight = calculatedHeight.contentHeight;

    let modalStyle = null;
    if (this.props.dynamicHeight) {
      modalStyle = {height: calculatedHeight.height};
    }

    let useScrollbar = false;
    if (this.props.useGemini && calculatedHeight.height !== 'auto') {
      useScrollbar = true;
    }

    return (
      <div ref="modal" className={props.modalClass}>
        {this.getCloseButton()}
        {this.getHeader()}
        <div className={props.bodyClass} style={modalStyle}>
          <div ref="innerContainer" className={props.innerBodyClass}>
            {this.getModalContent(useScrollbar, contentHeight)}
          </div>
        </div>
        {this.getFooter()}
      </div>
    );
  }

  getBackdrop() {
    let props = this.props;
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
  dynamicHeight: true,
  footer: null,
  maxHeightPercentage: 0.6,
  onClose: () => {},
  open: false,
  showCloseButton: false,
  showHeader: false,
  showFooter: false,
  subHeader: null,
  titleText: '',
  transitionNameBackdrop: 'modal-backdrop',
  transitionAppearTimeoutBackdrop: 500,
  transitionEnterTimeoutBackdrop: 500,
  transitionLeaveTimeoutBackdrop: 500,
  transitionNameModal: 'modal',
  transitionAppearTimeoutModal: 500,
  transitionEnterTimeoutModal: 500,
  transitionLeaveTimeoutModal: 500,
  transitionAppear: true,
  transitionEnter: true,
  transitionLeave: true,
  useGemini: true,

  // Default classes.
  backdropClass: 'modal-backdrop',
  bodyClass: 'modal-body',
  closeButtonClass: 'modal-close',
  closeIconClass: 'modal-close-icon icon icon-mini icon-mini-white icon-close',
  closeTitleClass: 'modal-close-title',
  footerClass: 'modal-footer',
  footerContainerClass: 'container',
  headerClass: 'modal-header',
  headerContainerClass: 'container',
  modalClass: 'modal modal-large',
  scrollContainerClass: 'modal-content-inner',
  titleClass: 'modal-header-title flush'
};

ModalContents.propTypes = {
  children: PropTypes.node,
  // Allow closing of modal when click happens outside modal. Defaults to true.
  closeByBackdropClick: PropTypes.bool,
  // Allow resize of modal to fit screen. Defaults to true.
  dynamicHeight: PropTypes.bool,
  // Optional footer
  footer: PropTypes.object,
  // Maximum percent of the viewport the modal can be. Defaults to 0.5.
  maxHeightPercentage: PropTypes.number,
  // Optional callback function exected when modal is closed.
  onClose: PropTypes.func,
  // True if modal is open, false otherwise.
  open: PropTypes.bool,
  // Set true to show explicit close button. Defaults to false.
  showCloseButton: PropTypes.bool,
  // Set true to show header. Defaults to false.
  showHeader: PropTypes.bool,
  // Set true to show footer. Defaults to false.
  showFooter: PropTypes.bool,
  // Optional subheader.
  subHeader: PropTypes.node,
  // Optional title.
  titleText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  // Optional enter and leave transition name for backdrop
  transitionNameBackdrop: PropTypes.string,
  // Optional enter and leave transition name for modal
  // Transition lengths, must be non-zero
  transitionAppearTimeoutBackdrop: PropTypes.number,
  transitionEnterTimeoutBackdrop: PropTypes.number,
  transitionLeaveTimeoutBackdrop: PropTypes.number,
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
  closeIconClass: PropTypes.string,
  closeTitleClass: PropTypes.string,
  footerClass: PropTypes.string,
  footerContainerClass: PropTypes.string,
  headerClass: PropTypes.string,
  headerContainerClass: PropTypes.string,
  innerBodyClass: PropTypes.string,
  modalClass: PropTypes.string,
  modalWrapperClass: PropTypes.string,
  scrollContainerClass: PropTypes.string,
  titleClass: PropTypes.string
};

module.exports = ModalContents;
