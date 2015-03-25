/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = React.createClass({

  displayName: "Dropdown",

  propTypes: {
    defaultItem: React.PropTypes.string,
    items: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      defaultItem: <span>Dropdown</span>,
      items: []
    };
  },

  getInitialState: function () {
    return {
      open: false,
      buttonContent: this.props.defaultItem,
      selectedValue: null
    };
  },

  componentWillRecieveProps: function (props) {
    var state = {
      selectedValue: null,
      buttonContent: this.props.defaultItem
    };

    _.find(props.items, function (item) {
      if (item.selected) {
        state = {
          selectedValue: item.value,
          buttonContent: item.innerContent
        };
      }
      return item.selected;
    }.bind(this));

    this.setState(state);
  },

  componentDidMount: function () {
    window.addEventListener("click", this.closeHandler);
  },

  componentWillUnmount: function () {
    window.removeEventListener("click", this.closeHandler);
  },

  closeHandler: function (e) {
    if (e.target !== this.refs.button.getDOMNode()) {
      this.setState({open: false});
    }
  },

  itemClicked: function (i) {
    var value = this.props.items[i].value;
    if (value !== this.state.selectedValue) {
      this.setState({
        selectedValue: value,
        buttonContent: this.props.items[i].innerContent
      });
      this.props.onChange(value);
    }
  },

  toggleMenu: function () {
    this.setState({
      open: !this.state.open
    });
  },

  getItems: function () {
    return _.map(this.props.items, function (item, i) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <li className="clickable"
            key={item.value}
            onClick={this.itemClicked.bind(this, i)}>
          {item.innerContent}
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
            className="button dropdown-toggle"
            ref="button"
            onClick={this.toggleMenu}>
          {this.state.buttonContent}
        </button>
        <span className="dropdown-menu inverse" role="menu">
          <ul className="dropdown-menu-list">
            {this.getItems()}
          </ul>
        </span>
      </span>
    );
  }
});

module.exports = Dropdown;
