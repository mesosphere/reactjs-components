/** @jsx React.DOM */

var React = require("react");

var Modal = React.createClass({

  displayName: "Modal",

  propTypes: {
    closeText: React.PropTypes.string,
    footer: React.PropTypes.object,
    showCloseButton: React.PropTypes.bool,
    subHeader: React.PropTypes.object,
    titleText: React.PropTypes.string,
  },

  getDefaultProps: function () {
    return {
      closeText: "Close",
      show: false,
      showCloseButton: true,
      titleText: ""
    };
  },

  componentDidMount: function () {
    this.forceUpdate();
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
      "in": this.isMounted(),
      "modal-backdrop": true
    });

    var modalClassSet = React.addons.classSet({
      "fade": true,
      "flex-container-col": true,
      "in": this.isMounted(),
      "modal": true
    });

    return (
      <div>
        <div className={modalClassSet} tabIndex="-1">
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
          <div className="modal-footer">
            <div className="container container-pod container-pod-short">
              {this.props.footer}
            </div>
          </div>
        </div>
        <div className={backdropClassSet} />
      </div>
    );
  }
});

module.exports = Modal;
