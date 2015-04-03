/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var Modal = React.createClass({

  displayName: "Modal",

  getDefaultProps: function () {
    return {
      show: false,
      showCloseButton: true,
      closeText: "Close",
      titleText: "",
      renderFooter: _.noop
    };
  },

  getCloseButton: function () {
    if (!this.props.showCloseButton) {
      return;
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

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    var backdropClassSet = React.addons.classSet({
      "fade": true,
      "hidden": !this.props.show,
      "in": this.props.show,
      "modal-backdrop": true
    });

    var modalClassSet = React.addons.classSet({
      "fade": true,
      "flex-container-col": true,
      "hidden": !this.props.show,
      "in": this.props.show,
      "inverse": true,
      "modal": true
    });

    return (
      <div>
        <div className={modalClassSet} tabIndex="-1">
          {this.getCloseButton()}
          <div className="modal-header">
            <div className="container container-pod container-pod-short">
              <h2 className="modal-header-title text-align-center flush-top flush-bottom">
                {this.props.titleText}
              </h2>
            </div>
          </div>
          <div className="modal-content container-scrollable">
            <div className="modal-content-inner container container-pod container-pod-short">
              {this.props.children}
            </div>
          </div>
          <div className="modal-footer">
            <div className="container container-pod container-pod-short">
              {this.props.renderFooter()}
            </div>
          </div>
        </div>
        <div className={backdropClassSet} />
      </div>
    );
  }
});

module.exports = Modal;
