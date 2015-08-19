import React from 'react/addons';
import GeminiScrollbar from 'react-gemini-scrollbar';

import * as DOMUtil from '../Util/DOMUtil';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;
const METHODS_TO_BIND = ['handleWindowResize', 'handleBackdropClick', 'closeModal'];

export default class ModalPortal extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidUpdate() {
    if (this.props.open) {
      this.checkHeight();
    }
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
    this.heightInfo = this.getInnerContainerHeightInfo();
    let heightInfo = this.heightInfo;

    let biggerThanMaxHeight = heightInfo.originalHeight > heightInfo.maxHeight;

    // If content is bigger than the maxHeight, cap it.
    if (biggerThanMaxHeight && this.props.open || !this.rerendered) {
      this.rerendered = true;
      this.forceUpdate();
    }
  }

  closeModal() {
    this.props.onClose();
    this.heightInfo = false;
    this.rerendered = false;
  }

  getInnerContainerHeightInfo() {
    let heightInfo = {
      originalHeight: null,
      innerHeight: null,
      maxHeight: null
    };

    let innerContainer = this.refs['inner-container'];
    if (!innerContainer) {
      return heightInfo;
    }

    let originalHeight = innerContainer.getDOMNode().offsetHeight;

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
    if (!useScrollbar) {
      return (
        <div className="container container-fluid container-fluid-narrow">
          {this.props.children}
        </div>
      );
    }

    let geminiContainerStyle = {
      height: innerHeight
    };

    return (
      <GeminiScrollbar autoshow={true} className="container-scrollable" style={geminiContainerStyle}>
        <div className="container container-fluid container-fluid-narrow">
          {this.props.children}
        </div>
      </GeminiScrollbar>
    );
  }

  getModal() {
    if (!this.props.open) {
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
            <div ref="inner-container" className={this.props.innerBodyClass}>
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

  render() {
    return (
      <CSSTransitionGroup transitionAppear={true} transitionName="modal" component="section">
        {this.getModal()}
      </CSSTransitionGroup>
    );
  }
}

ModalPortal.propTypes = {
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
