import classNames from 'classnames';
import React from 'react/addons';

import BindMixin from '../Mixin/BindMixin';
import DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Dropdown extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleMenuToggle',
      'handleExternalClick',
      'handleWrapperBlur'
    ];
  }

  constructor() {
    super();
    this.state = {
      isOpen: false,
      selectedID: null
    };
  }

  componentWillMount() {
    this.setState({
      selectedID: this.props.selectedID
    });
  }

  getSelectedHtml(id, items) {
    let obj = Util.find(items, function (item) {
      return item.id === id;
    });

    return obj.selectedHtml || obj.html;
  }

  getMenuItems(items) {
    return items.map((item) => {
      let classSet = classNames(
        {
          'is-selectable': item.selectable !== false,
          'is-selected': item.id === this.state.selectedID
        },
        item.className,
        this.props.dropdownMenuListItemClassName
      );

      let handleUserClick = null;

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

  handleExternalClick() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  }

  handleItemClick(item) {
    this.props.onItemSelection(item);

    this.setState({
      isOpen: false,
      selectedID: item.id
    });
  }

  handleWrapperBlur(e) {
    let elID = React.findDOMNode(this).dataset.reactid;
    let currentEl = e.relatedTarget;

    // If the blur event fired from within the current dropdown, then the menu
    // needs to remain open. Otherwise it can safely be closed.
    if (currentEl && DOMUtil.closest(currentEl, `[data-reactid="${elID}"]`)) {
      return;
    }

    if (this.state.isOpen === true) {
      this.setState({isOpen: false});
    }
  }

  handleMenuToggle(e) {
    e.stopPropagation();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    let dropdownStateClassSet = {
      'open': this.state.isOpen
    };
    let dropdownMenu = null;
    let items = this.props.items;
    let wrapperClassSet = classNames(
      dropdownStateClassSet,
      this.props.wrapperClassName
    );

    if (this.state.isOpen) {
      dropdownMenu = (
        <span className={this.props.dropdownMenuClassName}
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
      <span className={wrapperClassSet}
        tabIndex="1"
        onBlur={this.handleWrapperBlur}>
        <button className={this.props.buttonClassName}
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
      // The HTML (or text) to display when the option is selected. If this is
      // not provided, the value for the `html` property will be used.
      selectedHtml: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ])
    })
  ).isRequired,
  // An optional callback when an item is selected. Will receive an argument
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

  // Classes:
  // Classname for the element that ther user interacts with to open menu.
  buttonClassName: React.PropTypes.string,
  // Classname for the dropdown menu wrapper.
  dropdownMenuClassName: React.PropTypes.string,
  // Classname for the dropdown list wrapper.
  dropdownMenuListClassName: React.PropTypes.string,
  // Classname for the dropdown list item.
  dropdownMenuListItemClassName: React.PropTypes.string,
  // Classname for the element that wraps the entire component.
  wrapperClassName: React.PropTypes.string
};
