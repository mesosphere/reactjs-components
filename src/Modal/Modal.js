import React from 'react/addons';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';

import * as Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

// Default classes for each of the sections in the Modal.
// This basically defaults to canvas UI classes.
const DEFAULT_MODAL_CLASSES = {
  'container': ['modal-container'],
  'header': ['modal-header'],
  'header-container': ['container', 'container-pod', 'container-pod-short'],
  'body': ['modal-content', 'container-scrollable'],
  'inner-body': ['modal-content-inner', 'container', 'container-pod', 'container-pod-short'],
  'footer': ['modal-footer'],
  'footer-container': ['container', 'container-pod', 'container-pod-short'],
  'close-button': ['modal-close'],
  'close-title': ['modal-close-title'],
  'close-icon': ['modal-close-icon icon', 'icon-mini', 'icon-mini-white', 'icon-close']
};
const METHODS_TO_BIND = ['handleWindowResize', 'handleBackdropClick'];

export default class Modal extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidUpdate() {
    this.renderModal();
  }

  componentDidMount() {
    this.forceUpdate();

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.open !== this.props.open;
  }

  getClass(section, addition) {
    let classes = DEFAULT_MODAL_CLASSES[section];

    if (addition !== '') {
      classes = addition.split(' ');
    }

    return classNames(classes);
  }

  handleBackdropClick() {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  }

  handleWindowResize() {
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
      <a className={this.getClass('close-button', this.props.closeButtonClass)}>
        <span className={this.getClass('close-title', this.props.closeTitleClass)}>
          Close
        </span>
        <i className={this.getClass('close-icon', this.props.closeIconClass)}></i>
      </a>
    );
  }

  getFooter() {
    if (this.props.showFooter === false) {
      return null;
    }

    return (
      <div className={this.getClass('footer', this.props.footerClass)}>
        <div className={this.getClass('footer-container', this.props.footerContainerClass)}>
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

    let backdropClassSet = classNames({
      'fade': true,
      'in': this.props.open,
      'modal-backdrop': true
    });

    let modalClassSet = classNames({
      'modal': true,
      'modal-large': this.props.size === 'large'
    });

    let titleClassSet = classNames({
      'modal-header-title': true,
      'text-align-center': true,
      'flush-top': true,
      'flush-bottom': !this.props.subHeader,
      'inverse': true
    });

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
        className={this.getClass('container', this.props.containerClass)}
        style={containerStyle}>
        <div className={modalClassSet}>
          {this.getCloseButton()}
          <div className={this.getClass('header', this.props.headerClass)}>
            <div className={this.getClass('header-container', this.props.headerContainerClass)}>
              <h2 className={titleClassSet}>
                {this.props.titleText}
              </h2>
              {this.props.subHeader}
            </div>
          </div>
          <div className={this.getClass('body', this.props.bodyClass)} style={modalStyle}>
            <div id="modal-inner-container" className={this.getClass('inner-body', this.props.innerBodyClass)}>
              {this.getModalContent(useScrollbar, innerHeight)}
            </div>
          </div>
          {this.getFooter()}
        </div>
        <div className={backdropClassSet} onClick={this.handleBackdropClick}>
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
      // We need to rerender after the initial render
      // in order to have the children transition correctly.
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
  closeByBackdropClick: true,
  closeText: 'Close',

  // Default classes
  bodyClass: '',
  closeButtonClass: '',
  closeIconClass: '',
  closeTitleClass: '',
  containerClass: '',
  footerClass: '',
  footerContainerClass: '',
  headerClass: '',
  headerContainerClass: '',
  innerBodyClass: '',

  showCloseButton: false,
  titleText: '',
  size: '',
  subHeader: '',
  open: false,
  onClose: () => {},
  maxHeightPercentage: 0.5
};

Modal.propTypes = {
  closeByBackdropClick: React.PropTypes.bool,
  closeText: React.PropTypes.string,
  footer: React.PropTypes.object,
  showCloseButton: React.PropTypes.bool,
  showFooter: React.PropTypes.bool,
  size: React.PropTypes.string,
  subHeader: React.PropTypes.node,
  titleText: React.PropTypes.string,
  open: React.PropTypes.bool,
  onClose: React.PropTypes.func,

  // Classes
  bodyClass: React.PropTypes.string,
  closeButtonClass: React.PropTypes.string,
  closeIconClass: React.PropTypes.string,
  closeTitleClass: React.PropTypes.string,
  containerClass: React.PropTypes.string,
  footerClass: React.PropTypes.string,
  footerContainerClass: React.PropTypes.string,
  headerClass: React.PropTypes.string,
  headerContainerClass: React.PropTypes.string,
  innerBodyClass: React.PropTypes.string
};
