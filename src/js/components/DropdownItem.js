/** @jsx React.DOM */

var React = require("react/addons");

var DropdownItem = React.createClass({

  displayName: "DropdownItem",

  propTypes: {
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      value: "",
      selected: false,
      title: ""
    };
  },

  render: function () {
    var props = this.props;

    var classSet = React.addons.classSet({
      "selected": props.selected
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <a className={classSet} title={props.title}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = DropdownItem;
