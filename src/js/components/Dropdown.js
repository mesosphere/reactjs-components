/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = React.createClass({

  displayName: "Dropdown",

  actions_configuration: {
    state: {
      open: function (isOpen) {
        // if (isOpen) {
        //   return this.props.caption.replace(/\s+/g, "");
        // } else {
        //   return this.props.caption.replace(/\s+/g, "");
        // }
      }
    }
  },

  propTypes: {
    items: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]).isRequired,
        render: React.PropTypes.func.isRequired,
        selectedRender: React.PropTypes.func
      })
    ).isRequired,
    handleItemSelection: React.PropTypes.func.isRequired,
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

  onItemClick: function (obj) {
    this.props.handleItemSelection(obj);

    this.setState({
      open: false
    });
  },

  renderSelectedItem: function (id, items) {
    var obj = _.find(items, function (item) {
      return item.id === id;
    });

    if (_.isFunction(obj.selectedRender)) {
      return obj.selectedRender(obj);
    }

    return obj.render(obj);
  },

  renderItems: function (items) {
    return _.map(items, function (item) {
      return (
        <li className="clickable"
          key={item.id}
          onClick={this.onItemClick.bind(this, item)}>
          <a>
            {item.render(item)}
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
          {this.renderSelectedItem(this.props.selectedId, items)}
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
