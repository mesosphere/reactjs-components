/** @jsx React.DOM */

var React = require("react/addons");

var DropdownItem = React.createClass({

  displayName: "DropdownItem",

  propTypes: {
    className: React.PropTypes.string,
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
    tag: React.PropTypes.string,
    title: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      value: "",
      selected: false,
      tag: "a",
      title: ""
    };
  },

  render: function () {
    var props = this.props;
    var classes = {
      "selected": props.selected
    };

    if (props.className) {
      classes[props.className] = true;
    }

    return React.createElement(
      props.tag, {
        className: React.addons.classSet(classes),
        title: props.title
      },
      props.children
    );
  }
});

module.exports = DropdownItem;
