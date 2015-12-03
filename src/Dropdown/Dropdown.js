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
      menuDirection: 'down',
      menuHeight: null,
      isOpen: false,
      selectedID: null,
      knowMenuHeight: false
    };
  }

  componentDidUpdate() {
    // If we don't know the menu height already, we need to calculate it after
    // it's rendered. It's rendered inside a concealed container, so it's okay
    // if it renders in the wrong direction.
    if (!this.state.knowMenuHeight) {
      let dropdownMenuConcealer = React.findDOMNode(
        this.refs.dropdownMenuConcealer
      );
      let menuDirection = this.state.menuDirection;
      let menuHeight = this.state.menuHeight;

      if (dropdownMenuConcealer != null) {
        // Get the height and direction of the concealed menu.
        menuHeight = dropdownMenuConcealer.children[0].clientHeight;
        menuDirection = this.getMenuDirection(menuHeight);
      }

      // Setting state with knownHeight: true will re-render the dropdown in
      // the correct direction and not concealed.
      this.setState({
        knowMenuHeight: true,
        menuDirection,
        menuHeight
      });
    }
  }

  componentWillMount() {
    this.setState({
      selectedID: this.props.selectedID
    });
  }

  getMenuDirection(menuHeight) {
    // If we don't know the menu height, render it down.
    if (menuHeight == null) {
      return 'down';
    }
    // Calculate the space above and below the dropdown button.
    let spaceBelowDropdown = this.getSpaceBelowDropdown();

    if (menuHeight > spaceBelowDropdown) {
      return 'up';
    } else {
      return 'down';
    }
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

  getSelectedHtml(id, items) {
    let obj = Util.find(items, function (item) {
      return item.id === id;
    });

    return obj.selectedHtml || obj.html;
  }

  getSpaceBelowDropdown() {
    let dropdownWrapper = React.findDOMNode(this.refs.dropdownWrapper);
    let position = dropdownWrapper.getBoundingClientRect();
    let viewportHeight = global.window.innerHeight;

    // Calculate the distance from the bottom of the viewport to the bottom of
    // the dropdown button.
    return viewportHeight - position.bottom;
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
    let menuDirection = this.state.menuDirection;

    // If the menu isn't open, then we're about to open it and we need to
    // calculate the direction every time.
    if (!this.state.isOpen) {
      menuDirection = this.getMenuDirection(this.state.menuHeight);
    }

    this.setState({
      menuDirection,
      isOpen: !this.state.isOpen
    });
  }

  render() {
    // Set a key based on the menu height so that React knows to keep the
    // the DOM element around while we are measuring it.
    let props = this.props;
    let state = this.state;
    let dropdownKey = state.knowMenuHeight || 'initial-render';
    let dropdownMenu = null;
    let dropdownMenuClassSet = classNames(
      state.menuDirection,
      props.dropdownMenuClassName
    );
    let dropdownStateClassSet = {
      'open': state.isOpen
    };
    let items = props.items;
    let transitionName =
      `${props.transitionName}-${state.menuDirection}`;
    let wrapperClassSet = classNames(
      state.menuDirection,
      dropdownStateClassSet,
      props.wrapperClassName
    );

    if (state.isOpen) {
      dropdownMenu = (
        <span className={dropdownMenuClassSet}
          role="menu" ref="dropdownMenu" key={dropdownKey}>
          <ul className={props.dropdownMenuListClassName}>
            {this.getMenuItems(props.items)}
          </ul>
        </span>
      );
    }

    // If we don't know the menu's height, we render it invisibly and then
    // immediately measure its height in #componentDidUpdate, which will change
    // the state and trigger another render.
    if (state.isOpen && state.knowMenuHeight === false) {
      dropdownMenu = (
        <div className="dropdown-menu-concealer" ref="dropdownMenuConcealer">
          {dropdownMenu}
        </div>
      );
    }

    if (props.transition) {
      dropdownMenu = (
        <CSSTransitionGroup transitionName={transitionName}>
          {dropdownMenu}
        </CSSTransitionGroup>
      );
    }

    return (
      <span className={wrapperClassSet}
        tabIndex="1"
        onBlur={this.handleWrapperBlur}
        ref="dropdownWrapper">
        <button className={props.buttonClassName}
          onClick={this.handleMenuToggle}
          ref="button"
          type="button">
          {this.getSelectedHtml(state.selectedID, items)}
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
