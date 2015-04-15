/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

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
    handleItemSelection: React.PropTypes.func.isRequired,
    resetElement: React.PropTypes.object,
    items: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      caption: "Dropdown"
    };
  },

  getInitialState: function () {
    return {
      open: false,
      selectedItem: null
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

  onItemClick: function (item) {
    this.props.handleItemSelection(item);

    this.setState({
      open: false,
      selectedItem: item
    });
  },

  getCurrentItem: function () {
    if (this.state.selectedItem &&
        this.props.resetElement.id !== this.state.selectedItem.id) {
      return this.state.selectedItem.render();
    }

    return this.props.caption;
  },

  getItems: function () {
    return _.map(this.props.items, function (item, i) {
      return (
        <li className="clickable"
          key={i}
          onClick={this.onItemClick.bind(this, item)}>
          <a>
            {item.render()}
          </a>
        </li>
      );
    }, this);
  },

  render: function () {
    var resetElement = this.props.resetElement;

    var dropdownClassSet = React.addons.classSet({
      "dropdown": true,
      "open": this.state.open
    });

    var resetClassSet = React.addons.classSet({
      "clickable": true,
      "hidden": resetElement == null
    });

    return (
      <span className={dropdownClassSet}>
        <button type="button"
            className="button button-medium button-inverse dropdown-toggle"
            ref="button"
            onClick={this.handleMenuToggle}
            onBlur={this.handleButtonBlur}>
          {this.getCurrentItem()}
        </button>
        <span className="dropdown-menu inverse" role="menu"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}>
          <ul className="dropdown-menu-list">
            <li className={resetClassSet}
                onClick={this.onItemClick.bind(this, resetElement)}>
                <a>
                  {resetElement.render()}
                </a>
            </li>
            {this.getItems()}
          </ul>
        </span>
      </span>
    );
  }
});

module.exports = Dropdown;
