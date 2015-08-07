import React from 'react/addons';
import classNames from 'classnames';
import * as Util from '../Util/Util';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Dropdown extends React.Component {
  constructor() {
    const methodsToBind = [
      'handleButtonBlur',
      'handleMenuToggle',
      'handleMouseLeave',
      'handleMouseEnter'
    ];
    super();
    this.state = {
      isOpen: false,
      selectedID: ''
    };
    methodsToBind.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentWillMount() {
    this.setState({
      selectedID: this.props.selectedID
    });
  }

  handleMouseEnter() {
    this.preventBlur = true;
  }

  handleMouseLeave() {
    this.preventBlur = false;
  }

  handleButtonBlur() {
    if (!this.preventBlur) {
      this.setState({isOpen: false});
    }
  }

  handleMenuToggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleItemClick(item) {
    this.props.onItemSelection(item);

    this.setState({
      isOpen: false,
      selectedID: item.id
    });
  }

  getSelectedHtml(id, items) {
    var obj = Util.find(items, function (item) {
      return item.id === id;
    });

    if (obj.selectedHtml != null) {
      return obj.selectedHtml;
    }

    return obj.html;
  }

  getMenuItems(items) {
    return items.map((item) => {
      var classSet = classNames(
        item.className,
        this.props.dropdownMenuListItemClassName
      );
      var handleUserClick = null;

      if (item.selectable !== false) {
        handleUserClick = this.handleItemClick.bind(this, item);
      }

      return (
        <li className={classSet} key={item.id} onClick={handleUserClick}>
          {item.html}
        </li>
      );
    }, this);
  }

  render() {
    var dropdownStateClassSet = {
      'open': this.state.isOpen
    };
    var dropdownMenu = null;
    var items = this.props.items;
    var wrapperClassSet = classNames(
      dropdownStateClassSet,
      this.props.wrapperClassName
    );

    if (this.state.isOpen) {
      dropdownMenu = (
        <span className={this.props.dropdownMenuClassName}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          role="menu">
          <ul className={this.props.dropdownMenuListClassName}>
            {this.getMenuItems(items)}
          </ul>
        </span>
      );
    }

    if (this.props.transition) {
      dropdownMenu = (
        <CSSTransitionGroup transitionName={this.props.transitionName}>
          {dropdownMenu}
        </CSSTransitionGroup>
      );
    }

    return (
      <span className={wrapperClassSet}>
        <button className={this.props.buttonClassName}
          onBlur={this.handleButtonBlur}
          onClick={this.handleMenuToggle}
          ref="button"
          type="button">
          {this.getSelectedHtml(this.state.selectedID, items)}
        </button>
        {dropdownMenu}
      </span>
    );
  }
}

Dropdown.defaultProps = {
  transition: false,
  transitionName: 'dropdown-menu',
  onItemSelection: () => {}
};

Dropdown.propTypes = {
  // Classname for the element that ther user interacts with to open menu.
  buttonClassName: React.PropTypes.string,
  // Classname for the dropdown menu wrapper.
  dropdownMenuClassName: React.PropTypes.string,
  // Classname for the dropdown list wrapper.
  dropdownMenuListClassName: React.PropTypes.string,
  // The items to display in the dropdown.
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      // An optional classname for the menu item.
      className: React.PropTypes.string,
      // A required ID for each item
      id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]).isRequired,
      // The HTML (or text) to render for the list item.
      html: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]),
      // Whether or not the user can choose the item.
      selectable: React.PropTypes.bool,
      // The HTML (or text) to display when the option is selected. If this is not
      // provided, the value for the `html` property will be used.
      selectedHtml: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ])
    })
  ).isRequired,
  // An optional callback when an item is slected. Will receive an arugment
  // containing the selected item as it was supplied via the items array.
  onItemSelection: React.PropTypes.func,
  // The ID of the item that should be selected by default.
  selectedID: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired,
  // Optional transition on the dropdown menu. Must be accompanied
  // by an animation or transition in CSS.
  transition: React.PropTypes.bool,
  // The prefix of the transition classnames.
  transitionName: React.PropTypes.string,
  // Classname for the element that wraps the entire component.
  wrapperClassName: React.PropTypes.string
};
