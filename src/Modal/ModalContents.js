import React from 'react/addons';
import GeminiScrollbar from 'react-gemini-scrollbar';

import * as DOMUtil from '../Util/DOMUtil';

/**
 * Lifecycle of a Modal:
 * initial page load -> empty CSSTransitionGroup
 * interaction changes open to true -> render modal content without scrollbars
 * get height of content -> rerender modal content and cap the height
 */
const PropTypes = React.PropTypes;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;
const METHODS_TO_BIND = ['handleWindowResize', 'handleBackdropClick', 'closeModal'];

export default class ModalContents extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidUpdate() {
    this.checkHeight();
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.heightInfo = null;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.open !== this.props.open;
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

  checkHeight() {
    // Calculate height and call a render on first render cycle
    if (this.props.open && !this.rerendered) {
      this.heightInfo = this.getInnerContainerHeightInfo();
      this.rerendered = true;
      this.forceUpdate();
    }
  }

  closeModal() {
    this.props.onClose();
    this.heightInfo = null;
    this.rerendered = false;
  }

  getInnerContainerHeightInfo() {
    let heightInfo = {
      originalHeight: null,
      innerHeight: null,
      maxHeight: null
    };

    let innerContainer = this.refs.innerContainer;
    if (!innerContainer) {
      return heightInfo;
    }

    let originalHeight = React.findDOMNode(innerContainer).offsetHeight;

    // Height without padding, margin, border.
    let innerHeight = DOMUtil.getComputedDimensions(innerContainer.getDOMNode()).height;

    // Height of padding, margin, border.
    let outerHeight = originalHeight - innerHeight;

    // Modal cannot be bigger than this height.
    let maxHeight = Math.ceil(
      window.innerHeight * this.props.maxHeightPercentage
    );

    return {
      // Add 10 for the gemini horizontal scrollbar
      maxHeight: Math.min(originalHeight, maxHeight + 10),

      // We minus the maxHeight with the outerHeight because it will
      // not show the content correctly due to 'box-sizing: border-box'.
      innerHeight: Math.min(innerHeight, maxHeight - outerHeight),

      originalHeight: originalHeight
    };
  }

  getCloseButton(props) {
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

  getFooter(props) {
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

  getModalContent(useScrollbar, innerHeight) {
    if (!useScrollbar) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }

    let geminiContainerStyle = {
      height: innerHeight
    };

    return (
      <GeminiScrollbar autoshow={true} className="container-scrollable" style={geminiContainerStyle}>
        <div>
          {this.props.children}
        </div>
      </GeminiScrollbar>
    );
  }

  getModal(props) {
    if (!props.open) {
      return null;
    }

    let heightInfo = this.heightInfo;
    let maxHeight = null;
    let innerHeight = null;
    let useScrollbar = false;
    let originalHeight = null;

    if (heightInfo) {
      useScrollbar = true;
      innerHeight = heightInfo.innerHeight;
      maxHeight = heightInfo.maxHeight;
      originalHeight = heightInfo.originalHeight;
    }
    let modalStyle = {
      height: Math.min(originalHeight, maxHeight)
    };

    // Default to auto height
    if (modalStyle.height === 0) {
      modalStyle.height = 'auto';
    }

    let containerStyle = {
      height: window.innerHeight
    };

    return (
      <div
        className={props.containerClass}
        style={containerStyle}>
        <div className={props.modalClass}>
          {this.getCloseButton(props)}
          <div className={props.headerClass}>
            <div className={props.headerContainerClass}>
              <h2 className={props.titleClass}>
                {props.titleText}
              </h2>
              {props.subHeader}
            </div>
          </div>
          <div className={props.bodyClass} style={modalStyle}>
            <div ref="innerContainer" className={props.innerBodyClass}>
              {this.getModalContent(useScrollbar, innerHeight)}
            </div>
          </div>
          {this.getFooter(props)}
        </div>
        <div
          className={props.backdropClass}
          onClick={this.handleBackdropClick}>
        </div>
      </div>
    );
  }

  render() {
    return (
      <CSSTransitionGroup
        transitionAppear={true}
        transitionName="modal"
        component="div">
        {this.getModal(this.props)}
      </CSSTransitionGroup>
    );
  }
}

ModalContents.defaultProps = {
  closeByBackdropClick: true,
  footer: null,
  maxHeightPercentage: 0.5,
  onClose: () => {},
  open: false,
  showCloseButton: false,
  showFooter: false,
  subHeader: null,
  titleText: '',

  // Classes
  backdropClass: 'fade in modal-backdrop',
  bodyClass: 'modal-content',
  closeButtonClass: 'modal-close',
  closeIconClass: 'modal-close-icon icon icon-mini icon-mini-white icon-close',
  closeTitleClass: 'modal-close-title',
  containerClass: 'modal-container',
  footerClass: 'modal-footer',
  footerContainerClass: 'container container-pod container-pod-short',
  headerClass: 'modal-header',
  headerContainerClass: 'container container-pod container-pod-short',
  innerBodyClass:
    'modal-content-inner container container-pod container-pod-short',
  modalClass: 'modal modal-large',
  titleClass: 'modal-header-title text-align-center flush-top flush-bottom'
};

ModalContents.propTypes = {
  children: PropTypes.node,
  closeByBackdropClick: PropTypes.bool,
  footer: PropTypes.object,
  maxHeightPercentage: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  showFooter: PropTypes.bool,
  subHeader: PropTypes.node,
  titleText: PropTypes.string,

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
  titleClass: PropTypes.string
};
