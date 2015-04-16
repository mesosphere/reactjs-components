/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

function getCurrentItem(key, children) {
  return _.find(children, function (item) {
    return item.key === key;
  });
}

var Dropdown = React.createClass({

  displayName: "Dropdown",

  actions_configuration: {
    state: {
      open: function (isOpen) {
        if (isOpen) {
          return this.props.caption.replace(/\s+/g, "");
        } else {
          return this.props.caption.replace(/\s+/g, "");
        }
      }
    }
  },

  propTypes: {
    caption: React.PropTypes.string,
    selectedKey: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    getCurrentItem: React.PropTypes.func,
    handleItemSelection: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      caption: "Dropdown",
      getCurrentItem: getCurrentItem
    };
  },

  getInitialState: function () {
    return {
      open: false
    };
  },

  handleMouseEnter: function () {
    this.preventBlur = true;
  },

  handleMouseLeave: function () {
    this.preventBlur = false;
  },

  handleButtonBlur: function () {
    if (!this.preventBlur) {
      this.setState({open: false});
    }
  },

  handleMenuToggle: function () {
    this.setState({
      open: !this.state.open
    });
  },

  onItemClick: function (key) {
    this.props.handleItemSelection(key);

    this.setState({
      open: false
    });
  },

  getItems: function () {
    return _.map(this.props.children, function (item) {
      var key = item.key;
      return (
        <li className="clickable"
          key={key}
          onClick={this.onItemClick.bind(this, key)}>
          <a>
            {item}
          </a>
        </li>
      );
    }, this);
  },

  render: function () {
    var dropdownClassSet = React.addons.classSet({
      "dropdown": true,
      "open": this.state.open
    });

    return (
      <span className={dropdownClassSet}>
        <button type="button"
            className="button button-medium button-inverse dropdown-toggle"
            ref="button"
            onClick={this.handleMenuToggle}
            onBlur={this.handleButtonBlur}>
          {this.props.getCurrentItem(this.props.selectedKey, this.props.children)}
        </button>
        <span className="dropdown-menu inverse" role="menu"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}>
          <ul className="dropdown-menu-list">
            {this.getItems()}
          </ul>
        </span>
      </span>
    );
  }
});

module.exports = Dropdown;
