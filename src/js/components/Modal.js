/** @jsx React.DOM */

var React = require("react");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var GeminiScrollbar = require("react-gemini-scrollbar");

var DOMUtils = require("../utils/DOMUtils");

var Modal = React.createClass({

  displayName: "Modal",

  propTypes: {
    closeByBackdropClick: React.PropTypes.bool,
    closeText: React.PropTypes.string,
    footer: React.PropTypes.object,
    shouldClose: React.PropTypes.bool,
    showCloseButton: React.PropTypes.bool,
    showFooter: React.PropTypes.bool,
    size: React.PropTypes.string,
    subHeader: React.PropTypes.node,
    titleText: React.PropTypes.string,
    onClose: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      closeByBackdropClick: true,
      closeText: "Close",
      showCloseButton: true,
      titleText: "",
      size: "",
      shouldClose: false,
      subHeader: "",
      onClose: function () {}
    };
  },

  getInitialState: function () {
    return {
      closing: false
    };
  },

  handleWindowResize: function () {
    this.setState({innerContainerHeight: this.getInnerContainerMaxHeight()});
  },

  getInnerContainerMaxHeight: function () {
    if (this.refs.innerContainer === undefined) {
      return null;
    }

    var originalHeight = this.getElementHeight(this.refs.innerContainer.getDOMNode());
    var maxHeight = this.getPageHeight() * 0.6;

    return Math.min(originalHeight, maxHeight);
  },

  componentDidMount: function () {
    this.setState({innerContainerHeight: this.getInnerContainerMaxHeight()});

    window.addEventListener("resize", this.handleWindowResize);
  },

  componentDidUpdate: function () {
    if (this.state.innerContainerHeight === null) {
      this.setState({innerContainerHeight: this.getInnerContainerMaxHeight()});
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.shouldClose && !this.props.shouldClose) {
      this.closeModal();
    }
  },

  componentWillUnmount: function () {
    var modalElement = this.refs.modal.getDOMNode();
    var transitionEvent = DOMUtils.whichTransitionEvent(modalElement);
    modalElement.removeEventListener(transitionEvent, this.props.onClose);
    window.removeEventListener("resize", this.handleWindowResize);
  },

  shouldComponentUpdate: function (nextProps) {
    return nextProps.shouldClose === this.props.shouldClose;
  },

  handleBackdropClick: function () {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  },

  closeModal: function () {
    var modalElement = this.refs.modal.getDOMNode();
    var transitionEvent = DOMUtils.whichTransitionEvent(modalElement);

    if (transitionEvent == null) {
      this.props.onClose();
    } else {
      modalElement.addEventListener(transitionEvent, this.props.onClose);
    }

    this.setState({closing: true});
  },

  getPageHeight: function () {
    var body = document.body;
    var html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
                          html.clientHeight, html.scrollHeight, html.offsetHeight);

    return height;
  },

  getElementHeight: function (el) {
    return Math.max(el.clientHeight, el.scrollHeight, el.offsetHeight);
  },

  getCloseButton: function () {
    if (!this.props.showCloseButton) {
      return null;
    }

    return (
      <a className="modal-close">
        <span className="modal-close-title">
          Close
        </span>
        <i className="modal-close-icon icon icon-mini icon-mini-white icon-close"></i>
      </a>
    );
  },

  getFooter: function () {
    if (this.props.showFooter === false) {
      return null;
    }

    return (
      <div className="modal-footer">
        <div className="container container-pod container-pod-short">
          {this.props.footer}
        </div>
      </div>
    );
  },

  getContent: function (useGemini) {
    if (useGemini) {
      return (
        <GeminiScrollbar autoshow={true} className="container-scrollable">
          <div className="container-fluid">
            {this.props.children}
          </div>
        </GeminiScrollbar>
      );
    } else {
      return (
        <div className="container-fluid">
          {this.props.children}
        </div>
      );
    }
  },

  getModal: function (isMounted) {
    if (!isMounted || this.state.closing) {
      return null;
    }

    var modalClassSet = React.addons.classSet({
      "modal": true,
      "modal-large": this.props.size === "large"
    });

    var titleClassSet = React.addons.classSet({
      "modal-header-title": true,
      "text-align-center": true,
      "flush-top": true,
      "flush-bottom": !this.props.subHeader,
      "inverse": true
    });

    var modalStyle = {
      height: this.state.innerContainerHeight
    };
    var useGemini = modalStyle.height !== null;

    return (
      <div className={modalClassSet}>
        {this.getCloseButton()}
        <div className="modal-header">
          <div className="container container-pod container-pod-short">
            <h2 className={titleClassSet}>
              {this.props.titleText}
            </h2>
            {this.props.subHeader}
          </div>
        </div>
        <div className="modal-content container-scrollable">
          <div ref="innerContainer" className="modal-content-inner container container-pod container-pod-short" style={modalStyle}>
            {this.getContent(useGemini)}
          </div>
        </div>
        {this.getFooter()}
      </div>
    );
  },

  render: function () {
    var isMounted = this.isMounted();
    var backdropClassSet = React.addons.classSet({
      "fade": true,
      "in": isMounted && !this.state.closing,
      "modal-backdrop": true
    });

    return (
      <div className="modal-container container-scrollable">
        <CSSTransitionGroup transitionName="modal" transitionAppear={true} ref="modal" component="div">
          {this.getModal(isMounted)}
        </CSSTransitionGroup>
        <div className={backdropClassSet} onClick={this.handleBackdropClick}>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
