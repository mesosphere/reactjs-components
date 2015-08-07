import React from 'react/addons';
import GeminiScrollbar from 'react-gemini-scrollbar';

import * as Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;
const METHODS_TO_BIND = ['handleWindowResize', 'handleBackdropClick', 'closeModal'];

export default class Modal extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  // Lifecycle of a Modal:
  // initial page load -> empty CSSTransitionGroup div will be on root of page
  // interaction changes open to true -> render modal content without scrollbars
  // get height of content -> rerender modal content and cap the height

  componentDidUpdate() {
    // We need this in order to listen to the `open` prop change,
    // then we'll render the modal according to whether it's true
    // or false.
    this.renderModal();
  }

  componentWillMount() {
    // For initial mount, we need to call this to have the CSSTransitionGroup
    // on the page. There will be nothing inside of it because the modal will
    // be closed.
    this.renderModal();

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
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
    this.renderModal();
  }

  closeModal() {
    if (this.rootEl) {
      this.rerendered = false;
      this.props.onClose();
    }
  }

  getInnerContainerHeightInfo() {
    // We have to search the DOM for this since we went outside of React
    // for the render.
    let innerContainer = document.getElementById('modal-inner-container');
    if (!innerContainer) {
      return null;
    }

    let originalHeight = innerContainer.offsetHeight;

    // Height without padding, margin, border.
    let innerHeight = Util.getComputedDimensions(innerContainer).height;

    // Height of padding, margin, border.
    let outerHeight = originalHeight - innerHeight;

    // Modal cannot be bigger than this height.
    let maxHeight = window.innerHeight * this.props.maxHeightPercentage;

    return {
      // Add 10 for the gemini horizontal scrollbar
      maxHeight: Math.min(originalHeight, maxHeight + 10),

      // We minus the maxHeight with the outerHeight because it will
      // not show the content correctly due to 'box-sizing: border-box'.
      innerHeight: Math.min(innerHeight, maxHeight - outerHeight)
    };
  }

  getCloseButton() {
    if (!this.props.showCloseButton) {
      return null;
    }

    return (
      <a
        className={this.props.closeButtonClass}
        onClick={this.closeModal}>
        <span className={this.props.closeTitleClass}>
          Close
        </span>
        <i className={this.props.closeIconClass}>x</i>
      </a>
    );
  }

  getFooter() {
    if (this.props.showFooter === false) {
      return null;
    }

    return (
      <div className={this.props.footerClass}>
        <div className={this.props.footerContainerClass}>
          {this.props.footer}
        </div>
      </div>
    );
  }

  getModalContent(useScrollbar, innerHeight) {
    if (!useScrollbar && !this.rerendered) {
      return (
        <div className="container-fluid">
          {this.props.children}
        </div>
      );
    }

    let geminiContainerStyle = {
      height: innerHeight
    };

    return (
      <GeminiScrollbar autoshow={true} className="container-scrollable" style={geminiContainerStyle}>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </GeminiScrollbar>
    );
  }

  getModal() {
    if (!this.props.open) {
      return null;
    }

    let heightInfo = this.getInnerContainerHeightInfo();
    let maxHeight = null;
    let innerHeight = null;
    let useScrollbar = false;

    if (heightInfo !== null) {
      useScrollbar = true;
      innerHeight = heightInfo.innerHeight;
      maxHeight = heightInfo.maxHeight;
    }

    let modalStyle = {
      height: maxHeight
    };

    let containerStyle = {
      height: window.innerHeight
    };

    return (
      <div
        className={this.props.containerClass}
        style={containerStyle}>
        <div className={this.props.modalClass}>
          {this.getCloseButton()}
          <div className={this.props.headerClass}>
            <div className={this.props.headerContainerClass}>
              <h2 className={this.props.titleClass}>
                {this.props.titleText}
              </h2>
              {this.props.subHeader}
            </div>
          </div>
          <div className={this.props.bodyClass} style={modalStyle}>
            <div id="modal-inner-container" className={this.props.innerBodyClass}>
              {this.getModalContent(useScrollbar, innerHeight)}
            </div>
          </div>
          {this.getFooter()}
        </div>
        <div className={this.props.backdropClass} onClick={this.handleBackdropClick}>
        </div>
      </div>
    );
  }

  renderModal() {
    let modal = (
      <CSSTransitionGroup transitionAppear={true} transitionName="modal" component="section">
        {this.getModal()}
      </CSSTransitionGroup>
    );

    if (!this.rootEl) {
      this.rootEl = document.createElement('div');
      document.body.appendChild(this.rootEl);
    }

    React.render(
      modal,
      this.rootEl,
      // We render once to compute the content height,
      // then render again to have access to the content height.
      function () {
        if (!this.rerendered && this.props.open) {
          this.rerendered = true;
          this.renderModal();
        }
      }.bind(this)
    );
  }

  render() {
    return null;
  }

}

Modal.defaultProps = {
  // Default classes for each of the sections in the Modal.
  // This basically defaults to canvas UI classes.
  backdropClass: 'fade in modal-backdrop',
  bodyClass: 'modal-content container-scrollable',
  closeButtonClass: 'modal-close',
  closeIconClass: 'modal-close-icon icon icon-mini icon-mini-white icon-close',
  closeTitleClass: 'modal-close-title',
  containerClass: 'modal-container',
  footerClass: 'modal-footer',
  footerContainerClass: 'container container-pod container-pod-short',
  headerClass: 'modal-header',
  headerContainerClass: 'container container-pod container-pod-short',
  innerBodyClass: 'modal-content-inner container container-pod container-pod-short',
  modalClass: 'modal modal-large',
  titleClass: 'modal-header-title text-align-center flush-top flush-bottom',

  closeByBackdropClick: true,
  footer: null,
  maxHeightPercentage: 0.5,
  onClose: () => {},
  open: false,
  showCloseButton: false,
  showFooter: false,
  subHeader: '',
  titleText: ''
};

Modal.propTypes = {
  closeByBackdropClick: React.PropTypes.bool,
  footer: React.PropTypes.object,
  maxHeightPercentage: React.PropTypes.number,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,
  showCloseButton: React.PropTypes.bool,
  showFooter: React.PropTypes.bool,
  subHeader: React.PropTypes.node,
  titleText: React.PropTypes.string,

  // Classes
  backdropClass: React.PropTypes.string,
  bodyClass: React.PropTypes.string,
  closeButtonClass: React.PropTypes.string,
  closeIconClass: React.PropTypes.string,
  closeTitleClass: React.PropTypes.string,
  containerClass: React.PropTypes.string,
  footerClass: React.PropTypes.string,
  footerContainerClass: React.PropTypes.string,
  headerClass: React.PropTypes.string,
  headerContainerClass: React.PropTypes.string,
  innerBodyClass: React.PropTypes.string,
  modalClass: React.PropTypes.string,
  titleClass: React.PropTypes.string
};
