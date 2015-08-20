import React from 'react/addons';

import ModalPortal from './ModalPortal';
import Util from '../Util/Util';
import DEFAULT_CLASSES from './DefaultModalClasses';

// Lifecycle of a Modal:
// initial page load -> empty CSSTransitionGroup div will be on root of page
// interaction changes open to true -> render modal content without scrollbars
// get height of content -> rerender modal content and cap the height
export default class Modal extends React.Component {
  componentDidMount() {
    this.nodeEl = document.createElement('div');
    document.body.appendChild(this.nodeEl);
    this.renderModal(this.props);
  }

  componentWillUnmount() {
    React.unmountComponentAtNode(this.nodeEl);
    document.body.removeChild(this.nodeEl);
  }

  componentWillReceiveProps(newProps) {
    this.renderModal(newProps);
  }

  addDefaultClasses(props) {
    let defaultClassKeys = Object.keys(DEFAULT_CLASSES);
    let newProps = Util.extend({}, props);

    defaultClassKeys.forEach(function (key) {
      if (newProps[key]) {
        newProps[key] = DEFAULT_CLASSES[key] + ' ' + newProps[key];
      } else {
        newProps[key] = DEFAULT_CLASSES[key];
      }
    });

    return newProps;
  }

  renderModal(props) {
    var newProps = this.addDefaultClasses(props);
    React.render(
      <ModalPortal {...newProps}/>,
      this.nodeEl
    );
  }

  render() {
    return null;
  }
}

Modal.defaultProps = {
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
