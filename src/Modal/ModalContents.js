import GeminiScrollbar from 'react-gemini-scrollbar';
import React, {PropTypes} from 'react/addons';

import BindMixin from '../Mixin/BindMixin';
import * as DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

/**
 * Lifecycle of a Modal:
 * initial page load -> empty CSSTransitionGroup
 * interaction changes open to true -> render modal content without scrollbars
 * get height of content -> rerender modal content and cap the height
 */
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

const DEFAULT_HEIGHT = {
  height: 'auto',
  contentHeight: 'auto'
};

export default class ModalContents extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleWindowResize',
      'handleBackdropClick',
      'closeModal'
    ];
  }

  componentDidUpdate() {
    if (this.props.open) {
      this.checkHeight();
    } else {
      this.resetHeight();
      this.rerendered = false;
    }
  }

  componentWillMount() {
    this.resetHeight();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    this.resetHeight();
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
    this.forceUpdate();
  }

  resetHeight() {
    this.heightInfo = Util.clone(DEFAULT_HEIGHT);
  }

  checkHeight() {
    // Calculate height and call a render on first render cycle
    this.heightInfo = this.calculateModalHeight();
    if (!this.rerendered) {
      this.rerendered = true;
      this.forceUpdate();
    }
  }

  closeModal() {
    this.props.onClose();
  }

  getInnerContainerHeightInfo() {
    let innerContainer = this.refs.innerContainer;

    let originalHeight = React.findDOMNode(innerContainer).offsetHeight;
    let totalContentHeight = React.findDOMNode(this.refs.modal).offsetHeight;

    // Height without padding, margin, border.
    let contentHeight = DOMUtil.getComputedDimensions(
      innerContainer.getDOMNode()
    ).height;

    // Height of padding, margin, border.
    let outerHeight = originalHeight - contentHeight;

    // Modal cannot be bigger than this height. Add 10 for the gemini
    // horizontal scrollbar.
    let maxHeight = Math.ceil(
      window.innerHeight * this.props.maxHeightPercentage
    ) + 10;

    // We minus the maxHeight with the outerHeight because it will
    // not show the content correctly due to 'box-sizing: border-box'.
    contentHeight = Math.min(contentHeight, maxHeight - outerHeight);

    return {
      contentHeight,
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

    return {height, contentHeight};
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
          <h2 className={props.titleClass}>
            {props.titleText}
          </h2>
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
      return this.props.children;
    }

    let geminiContainerStyle = {
      height: contentHeight
    };

    return (
      <GeminiScrollbar
        autoshow={true}
        className="container-scrollable"
        style={geminiContainerStyle}>
        {this.props.children}
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
    let modalStyle = {height: calculatedHeight.height};

    let useScrollbar = false;
    if (calculatedHeight.height !== 'auto') {
      useScrollbar = true;
    }

    return (
      <div className={props.containerClass}>
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
    let props = this.props;

    return (
      <div className={props.modalWrapperClass}>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName={props.transitionNameBackdrop}
          component="div">
          {this.getBackdrop()}
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName={props.transitionNameModal}
          component="div">
          {this.getModal()}
        </CSSTransitionGroup>
      </div>
    );
  }
}

ModalContents.defaultProps = {
  closeByBackdropClick: true,
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
  transitionNameModal: 'modal',

  // Default classes.
  backdropClass: 'modal-backdrop',
  bodyClass: 'modal-content',
  closeButtonClass: 'modal-close',
  closeIconClass: 'modal-close-icon icon icon-mini icon-mini-white icon-close',
  closeTitleClass: 'modal-close-title',
  containerClass: 'modal-container',
  footerClass: 'modal-footer',
  footerContainerClass: 'container',
  headerClass: 'modal-header',
  headerContainerClass: 'container',
  innerBodyClass: 'modal-content-inner container container-pod ' +
    'container-pod-short flex-container-col',
  modalClass: 'modal modal-large',
  titleClass: 'modal-header-title text-align-center flush-top flush-bottom'
};

ModalContents.propTypes = {
  children: PropTypes.node,
  // Allow closing of modal when click happens outside modal. Defaults to true.
  closeByBackdropClick: PropTypes.bool,
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
  titleText: PropTypes.string,
  // Optional enter and leave transition name for backdrop
  transitionNameBackdrop: PropTypes.string,
  // Optional enter and leave transition name for modal
  transitionNameModal: PropTypes.string,

  // Classes
  backdropClass: PropTypes.string,
  bodyClass: PropTypes.string,
  closeButtonClass: PropTypes.string,
  closeIconClass: PropTypes.string,
  closeTitleClass: PropTypes.string,
  containerClass: PropTypes.string,
  footerClass: PropTypes.string,
  footerContainerClass: PropTypes.string,
  headerClass: PropTypes.string,
  headerContainerClass: PropTypes.string,
  innerBodyClass: PropTypes.string,
  modalClass: PropTypes.string,
  modalWrapperClass: PropTypes.string,
  titleClass: PropTypes.string
};
