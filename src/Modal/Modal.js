import React from 'react/addons';

import ModalPortal from './ModalPortal';

// Lifecycle of a Modal:
// initial page load -> empty CSSTransitionGroup div will be on root of page
// interaction changes open to true -> render modal content without scrollbars
// get height of content -> rerender modal content and cap the height
export default class Modal extends React.Component {
  componentDidMount() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.renderModal(this.props);
  }

  componentWillUnmount() {
    React.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  }

  componentWillReceiveProps(newProps) {
    this.renderModal(newProps);
  }

  renderModal(props) {
    React.render(
      <ModalPortal {...props}/>,
      this.node
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
  subHeader: null,
  titleText: ''
};

Modal.propTypes = {
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
  titleClass: React.PropTypes.string,

  closeByBackdropClick: React.PropTypes.bool,
  footer: React.PropTypes.object,
  maxHeightPercentage: React.PropTypes.number,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,
  showCloseButton: React.PropTypes.bool,
  showFooter: React.PropTypes.bool,
  subHeader: React.PropTypes.node,
  titleText: React.PropTypes.string
};
