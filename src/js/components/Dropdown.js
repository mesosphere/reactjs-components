/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = React.createClass({

  displayName: "Dropdown",

  propTypes: {
    items: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]).isRequired,
        html: React.PropTypes.object.isRequired,
        selectedHtml: React.PropTypes.object
      })
    ).isRequired,
    onItemSelection: React.PropTypes.func.isRequired,
    selectedId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
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

  handleItemClick: function (obj) {
    this.props.onItemSelection(obj);

    this.setState({
      open: false
    });
  },

  getSelectedHtml: function (id, items) {
    var obj = _.find(items, function (item) {
      return item.id === id;
    });

    if (obj.selectedHtml != null) {
      return obj.selectedHtml;
    }

    return obj.html;
  },

  renderItems: function (items) {
    return _.map(items, function (item) {
      return (
        <li className="clickable"
          key={item.id}
          onClick={this.handleItemClick.bind(this, item)}>
          <a>
            {item.html}
          </a>
        </li>
      );
    }, this);
  },

  render: function () {
    var items = this.props.items;
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
          {this.getSelectedHtml(this.props.selectedId, items)}
        </button>
        <span className="dropdown-menu inverse" role="menu"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}>
          <ul className="dropdown-menu-list">
            {this.renderItems(items)}
          </ul>
        </span>
      </span>
    );
  }
});

module.exports = Dropdown;
