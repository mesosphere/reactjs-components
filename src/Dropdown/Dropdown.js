import classNames from "classnames";
import GeminiScrollbar from "react-gemini-scrollbar";
import React from "react";
import { CSSTransitionGroup } from "react-transition-group";
import ReactDOM from "react-dom";

import BindMixin from "../Mixin/BindMixin";
import DOMUtil from "../Util/DOMUtil";
import Keycodes from "../constants/Keycodes";
import Portal from "../Portal/Portal.js";
import Util from "../Util/Util";

class Dropdown extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      "closeDropdown",
      "handleMenuToggle",
      "handleExternalClick",
      "handleKeyDown",
      "handleMenuRender",
      "handleWrapperBlur",
      "setDropdownMenuRef",
      "setDropdownWrapperRef"
    ];
  }

  constructor() {
    super();
    this.container = null;
    this.state = {
      maxDropdownHeight: null,
      menuDirection: "down",
      menuHeight: null,
      menuPositionStyle: null,
      isOpen: false,
      renderHidden: false,
      selectedID: null
    };
  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    const props = this.props;
    if (!props.persistentID) {
      this.setState({ selectedID: props.initialID });
    }
  }

  componentDidMount() {
    this.container = this.getScrollContainer();
  }

  componentWillUpdate(nextProps, nextState) {
    // If the open state changed, add or remove listener as needed.
    if (nextState.isOpen !== this.state.isOpen) {
      if (nextState.isOpen) {
        this.addKeydownListener();
        this.addScrollListener();
      } else {
        this.removeKeydownListener();
        this.removeScrollListener();
      }
    }
  }

  handleExternalClick() {
    this.closeDropdown();
  }

  handleKeyDown(event) {
    if (event.keyCode === Keycodes.esc) {
      this.closeDropdown();
    }
  }

  handleItemClick(item) {
    const props = this.props;
    props.onItemSelection(item);

    const newState = { isOpen: false };
    // Only set the selectedID if persistentID is not set
    if (!props.persistentID) {
      newState.selectedID = item.id;
    }

    this.setState(newState);
    this.removeBlurTimeout();
  }

  handleWrapperBlur() {
    this.removeBlurTimeout();

    this.currentBlurTimeout = setTimeout(() => {
      this.closeDropdown();
    }, 150);

    // We need to remove focus from the button to avoid this event firing again
    // when we open the dropdown
    global.focus();
  }

  handleMenuToggle(e) {
    e.stopPropagation();

    if (this.state.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }

    this.removeBlurTimeout();
  }

  handleMenuRender() {
    // If the menu is hidden while rendering, then we need to calculate its
    // optimal location and then un-hide it.
    if (this.state.renderHidden) {
      this.determineOptimalMenuLocation();
    }
  }

  addKeydownListener() {
    global.document.body.addEventListener("keydown", this.handleKeyDown);
  }

  addScrollListener() {
    this.container.addEventListener("scroll", this.closeDropdown);
  }

  removeKeydownListener() {
    global.document.body.removeEventListener("keydown", this.handleKeyDown);
  }

  removeScrollListener() {
    if (this.container) {
      this.container.removeEventListener("scroll", this.closeDropdown);
    }
  }

  removeBlurTimeout() {
    if (this.currentBlurTimeout) {
      global.clearTimeout(this.currentBlurTimeout);
    }
  }

  determineOptimalMenuLocation() {
    let height = null;
    let menuDirection = this.state.menuDirection;
    const menuPositionStyle = {};
    const spaceAroundDropdownButton = DOMUtil.getNodeClearance(
      this.dropdownWrapperRef
    );
    const menuHeight =
      this.state.menuHeight || this.dropdownMenuRef.firstChild.clientHeight;
    const isMenuTallerThanBottom =
      menuHeight > spaceAroundDropdownButton.bottom;
    const isMenuTallerThanTop = menuHeight > spaceAroundDropdownButton.top;
    const isMenuShorterThanTop = !isMenuTallerThanTop;
    const isTopTallerThanBottom =
      spaceAroundDropdownButton.top > spaceAroundDropdownButton.bottom;

    // If the menu height is larger than the space available on the bottom and
    // less than the space available on top, then render it up. If the height
    // of the menu exceeds the space below and above, but there is more space
    // above than below, render it up. Otherwise, render down.
    if (
      (isMenuTallerThanBottom && isMenuShorterThanTop) ||
      (isMenuTallerThanBottom && isMenuTallerThanTop && isTopTallerThanBottom)
    ) {
      menuDirection = "up";
      menuPositionStyle.bottom =
        spaceAroundDropdownButton.bottom +
        spaceAroundDropdownButton.boundingRect.height;
      menuPositionStyle.top = "auto";
      height = spaceAroundDropdownButton.top;
    } else {
      menuDirection = "down";
      menuPositionStyle.bottom = "auto";
      menuPositionStyle.top =
        spaceAroundDropdownButton.top +
        spaceAroundDropdownButton.boundingRect.height;
      height = spaceAroundDropdownButton.bottom;
    }

    if (this.props.matchButtonWidth) {
      menuPositionStyle.left = spaceAroundDropdownButton.left;
      menuPositionStyle.right = spaceAroundDropdownButton.right;
    } else if (this.props.anchorRight) {
      menuPositionStyle.left = "auto";
      menuPositionStyle.right = spaceAroundDropdownButton.right;
    } else {
      menuPositionStyle.left = spaceAroundDropdownButton.left;
      menuPositionStyle.right = "auto";
    }

    // We assume that 125 pixels is the smallest height we should render.
    if (height < 125) {
      height = 125;
    }

    this.setState({
      menuDirection,
      maxDropdownHeight: height,
      menuHeight,
      menuPositionStyle,
      renderHidden: false
    });
  }

  openDropdown() {
    const state = Object.assign({}, this.state);

    state.isOpen = true;
    state.renderHidden = true;

    // If we don't already know the menu height, we need to set the menu
    // position to a default state to trigger its recalculation on the next
    // render.
    if (this.state.menuHeight == null) {
      const buttonPosition = this.dropdownWrapperRef.getBoundingClientRect();

      state.menuDirection = "down";
      state.menuPositionStyle = {
        top: buttonPosition.top + buttonPosition.height,
        left: buttonPosition.left
      };
    }

    this.setState(state);
  }

  closeDropdown() {
    if (this.state.isOpen) {
      this.setState({ isOpen: false, renderHidden: false });
    }
  }

  getMenuItems(items) {
    const selectedID = this.getSelectedID();

    return items.map(item => {
      const classSet = classNames(
        {
          "is-selectable": item.selectable !== false,
          "is-selected": item.id === selectedID
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
    });
  }

  getScrollContainer() {
    let { scrollContainer, scrollContainerParentSelector } = this.props;

    if (typeof scrollContainer === "string") {
      // Find the closest scrolling element by the specified selector.
      scrollContainer =
        DOMUtil.closest(ReactDOM.findDOMNode(this), scrollContainer) || window;

      const { parentElement } = scrollContainer;

      // If the user specified scrollContainerParentSelector, we check to see
      // if the parent scrolling element matches the specified parent selector.
      if (
        scrollContainer !== window &&
        scrollContainerParentSelector != null &&
        parentElement != null &&
        parentElement[DOMUtil.matchesFn](scrollContainerParentSelector)
      ) {
        scrollContainer = parentElement;
      }
    }

    return scrollContainer;
  }

  getSelectedHtml(id, items) {
    const obj = Util.find(items, function(item) {
      return item.id === id;
    });

    if (obj != null) {
      return obj.selectedHtml || obj.html;
    }

    return null;
  }

  getSelectedID() {
    return this.props.persistentID || this.state.selectedID;
  }

  setDropdownMenuRef(element) {
    this.dropdownMenuRef = element;
  }

  setDropdownWrapperRef(element) {
    this.dropdownWrapperRef = element;
  }

  render() {
    // Set a key based on the menu height so that React knows to keep the
    // the DOM element around while we are measuring it.
    const { props, state } = this;
    let dropdownMenu = <div key="placeholder-element" />;
    const dropdownMenuClassSet = classNames(
      state.menuDirection,
      props.dropdownMenuClassName
    );
    const { items } = props;
    const transitionName = `${props.transitionName}-${state.menuDirection}`;
    const wrapperClassSet = classNames(
      state.menuDirection,
      props.wrapperClassName,
      {
        open: state.isOpen
      }
    );

    if (state.isOpen) {
      let dropdownMenuItems = (
        <ul className="dropdown-menu-items">
          {this.getMenuItems(items)}
        </ul>
      );

      // Render with Gemini scrollbar if the dropdown's height should be
      // constrainted.
      if (state.menuHeight >= state.maxDropdownHeight) {
        let height = "auto";

        // Remove 30 pixels from the dropdown height to account for offset
        // positioning from the dropdown button.
        if (state.maxDropdownHeight > 30) {
          height = state.maxDropdownHeight - 30;
        }

        const dropdownMenuStyle = { height };

        if (props.useGemini && height !== "auto") {
          dropdownMenuItems = (
            <GeminiScrollbar
              autoshow={true}
              className="container-scrollable"
              style={dropdownMenuStyle}
            >
              {dropdownMenuItems}
            </GeminiScrollbar>
          );
        } else {
          dropdownMenuItems = (
            <div className="container-scrollable" style={dropdownMenuStyle}>
              {dropdownMenuItems}
            </div>
          );
        }
      }

      dropdownMenu = (
        <span
          className={dropdownMenuClassSet}
          role="menu"
          ref={this.setDropdownMenuRef}
          style={state.menuPositionStyle}
        >
          <div className={props.dropdownMenuListClassName}>
            {dropdownMenuItems}
          </div>
        </span>
      );
    }

    if (state.renderHidden) {
      dropdownMenu = (
        <div key="concealer" className="dropdown-menu-concealer">
          {dropdownMenu}
        </div>
      );
    }

    if (props.transition) {
      dropdownMenu = (
        <CSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={props.transitionEnterTimeout}
          transitionLeaveTimeout={props.transitionLeaveTimeout}
        >
          {dropdownMenu}
        </CSSTransitionGroup>
      );
    }

    return (
      <span
        className={wrapperClassSet}
        tabIndex="1"
        onBlur={this.handleWrapperBlur}
        ref={this.setDropdownWrapperRef}
      >
        <button
          className={props.buttonClassName}
          onClick={this.handleMenuToggle}
          type="button"
        >
          {this.getSelectedHtml(this.getSelectedID(), items)}
        </button>
        <Portal onRender={this.handleMenuRender}>
          {dropdownMenu}
        </Portal>
      </span>
    );
  }
}

Dropdown.defaultProps = {
  anchorRight: false,
  matchButtonWidth: false,
  scrollContainer: window,
  scrollContainerParentSelector: null,
  transition: false,
  transitionName: "dropdown-menu",
  transitionEnterTimeout: 250,
  transitionLeaveTimeout: 250,
  onItemSelection: () => {},
  useGemini: true
};

Dropdown.propTypes = {
  // When true, anchors the dropdown to the right of the trigger.
  anchorRight: React.PropTypes.bool,
  // When set it will always set this property as the selected ID.
  // Notice: This property will override the initialID
  persistentID: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
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
  // The ID of the item that should be selected initially.
  initialID: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  // When true, the width of the dropdown will match the width of the button.
  matchButtonWidth: React.PropTypes.bool,
  // An optional callback when an item is selected. Will receive an argument
  // containing the selected item as it was supplied via the items array.
  onItemSelection: React.PropTypes.func,
  // The nearest scrolling DOMNode that contains the dropdown. Defaults to
  // window. Also accepts a string, treated as a selector for the node.
  scrollContainer: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.string
  ]),
  // Will attach the scroll handler to the the direct parent of scrollContainer
  // if it matches this selector. Defaults to null.
  scrollContainerParentSelector: React.PropTypes.string,
  // Optional transition on the dropdown menu. Must be accompanied
  // by an animation or transition in CSS.
  transition: React.PropTypes.bool,
  // The prefix of the transition classnames.
  transitionName: React.PropTypes.string,
  // Transition lengths
  transitionEnterTimeout: React.PropTypes.number,
  transitionLeaveTimeout: React.PropTypes.number,
  // Option to use Gemini scrollbar. Defaults to true.
  useGemini: React.PropTypes.bool,

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

module.exports = Dropdown;
