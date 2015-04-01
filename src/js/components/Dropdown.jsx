/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var DropdownItem = require("./DropdownItem");

function getDefaultItem(props) {
  return {
    buttonContent: <DropdownItem>{props.caption}</DropdownItem>,
    selectedValue: null
  };
}

var Dropdown = React.createClass({

  displayName: "Dropdown",

  propTypes: {
    caption: React.PropTypes.string,
    resetElement: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      caption: "Dropdown",
      resetElement: <DropdownItem key="default">Show all</DropdownItem>
    };
  },

  getInitialState: function () {
    return _.extend({
      open: false
    }, getDefaultItem(this.props));
  },

  componentWillReceiveProps: function (nextProps) {
    var state = getDefaultItem(nextProps);

    var selectedItem = _.find(nextProps.children, function (item) {
      return item.props.selected;
    });

    if (selectedItem != null) {
      state = {
        selectedValue: selectedItem.props.value,
        buttonContent: selectedItem
      };
    }

    this.setState(state);
  },

  menuMouseEnter: function () {
    this.preventBlur = true;
  },

  menuMouseLeave: function () {
    this.preventBlur = false;
  },

  onButtonBlur: function () {
    if (!this.preventBlur) {
      this.setState({open: false});
    }
  },

  toggleMenu: function () {
    this.setState({
      open: !this.state.open
    });
  },

  itemClicked: function (item) {
    var value = item.props.value;
    if (value !== this.state.selectedValue) {
      this.setState({
        selectedValue: value,
        buttonContent: item
      });
      this.props.onChange(value);
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
    }.bind(this));
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
            onClick={this.toggleMenu}
            onBlur={this.onButtonBlur}>
          {this.state.buttonContent}
        </button>
        <span className="dropdown-menu inverse" role="menu"
            onMouseEnter={this.menuMouseEnter}
            onMouseLeave={this.menuMouseLeave}>
          <ul className="dropdown-menu-list">
            {this.getItems()}
          </ul>
        </span>
      </span>
    );
  }
});

module.exports = Dropdown;
