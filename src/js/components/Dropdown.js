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
          return "Opened " + this.props.caption + " dropdown.";
        } else {
          return "Closed " + this.props.caption + " dropdown.";
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
      caption: "Dropdown",
      resetElement: <DropdownItem key="default">Show all</DropdownItem>
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
    items.unshift(this.props.resetElement);

    return _.map(items, function (item) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <li className="clickable"
            key={item.props.value}
            onClick={this.itemClicked.bind(this, item)}>
          {item}
        </li>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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

    return selectedItem;
  },

  render: function () {
    var dropdownClassSet = React.addons.classSet({
      "dropdown": true,
      "open": this.state.open
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
