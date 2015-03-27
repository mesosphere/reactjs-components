/** @jsx React.DOM */

var React = require("react/addons");

var DropdownItem = React.createClass({

  displayName: "DropdownItem",

  propTypes: {
    value: React.PropTypes.string,
    selected: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      value: "",
      selected: false
    };
  },

  render: function () {
    var classSet = React.addons.classSet({
      "selected": this.props.selected
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <a className={classSet}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = DropdownItem;
