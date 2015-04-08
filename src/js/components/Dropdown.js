/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var DropdownItem = require("./DropdownItem");

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
    resetElement: React.PropTypes.object,
    handleItemSelection: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      caption: "Dropdown"
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

  itemClicked: function (item) {
    var selected = this.getSelectedItem();
    var value = item.props.value;

    if (value !== selected.props.value) {
      this.props.handleItemSelection(value);
    }

    this.setState({open: false});
  },

  getItems: function () {
    var items = _.clone(this.props.children);
    if (this.props.resetElement != null) {
      items.unshift(this.props.resetElement);
    }

    return _.map(items, function (item) {
      return (
        <li className="clickable"
            key={item.props.value}
            onClick={this.itemClicked.bind(this, item)}>
          {item}
        </li>
      );
    }, this);
  },

  getSelectedItem: function () {
    var props = this.props;

    var selectedItem = _.find(props.children, function (item) {
      return item.props.selected;
    });

    if (!selectedItem) {
      selectedItem = (<DropdownItem>{props.caption}</DropdownItem>);
    }

    return (
      <DropdownItem className="button-container"
          tag="span"
          value={selectedItem.props.value}>
        {selectedItem.props.children}
      </DropdownItem>
    );
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
          {this.getSelectedItem()}
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
