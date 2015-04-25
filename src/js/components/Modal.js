/** @jsx React.DOM */

var React = require("react");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var Modal = React.createClass({

  displayName: "Modal",

  propTypes: {
    closeText: React.PropTypes.string,
    footer: React.PropTypes.object,
    showCloseButton: React.PropTypes.bool,
    showFooter: React.PropTypes.bool,
    subHeader: React.PropTypes.object,
    titleText: React.PropTypes.string,
    onClose: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      closeText: "Close",
      showCloseButton: true,
      titleText: "",
      onClose: function () {}
    };
  },

  componentDidMount: function () {
    this.forceUpdate();
  },

  handleBackdropClick: function () {
    this.props.onClose();
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

  getModal: function (isMounted) {
    if (!isMounted) {
      return null;
    }

    return (
      <div className="modal" >
        {this.getCloseButton()}
        <div className="modal-header">
          <div className="container container-pod container-pod-short">
            <h2 className="modal-header-title text-align-center flush-top inverse">
              {this.props.titleText}
            </h2>
            {this.props.subHeader}
          </div>
        </div>
        <div className="modal-content container-scrollable">
          <div className="modal-content-inner container container-pod container-pod-short">
            {this.props.children}
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
      "in": isMounted,
      "modal-backdrop": true
    });

    return (
      <div className="modal-container container-scrollable">
        <CSSTransitionGroup transitionName="modal" component="div">
          {this.getModal(isMounted)}
        </CSSTransitionGroup>
        <div className={backdropClassSet} onClick={this.handleBackdropClick}>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
