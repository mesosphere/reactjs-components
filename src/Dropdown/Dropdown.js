import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDOM from 'react-dom';

import BindMixin from '../Mixin/BindMixin';
import DOMUtil from '../Util/DOMUtil';
import KeyDownMixin from '../Mixin/KeyDownMixin';
import Util from '../Util/Util';

class Dropdown extends Util.mixin(BindMixin, KeyDownMixin) {
  get methodsToBind() {
    return [
      'closeDropdown',
      'handleMenuToggle',
      'handleExternalClick',
      'handleWrapperBlur'
    ];
  }

  get keysToBind() {
    return {
      esc: this.handleExternalClick
    };
  }

  constructor() {
    super();
    this.container = null;
    this.state = {
      maxDropdownHeight: null,
      menuDirection: 'down',
      menuHeight: null,
      menuPosition: {},
      isOpen: false,
      selectedID: null
    };
  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    let props = this.props;
    if (!props.persistentID) {
      this.setState({selectedID: props.initialID});
    }
  }

  componentDidMount() {
    this.container = this.getScrollContainer();
  }

  componentWillUpdate(nextProps, nextState) {
    // If the open state changed, add or remove listener as needed.
    if (nextState.isOpen !== this.state.isOpen) {
      if (nextState.isOpen) {
        this.addScrollListener();
      } else {
        this.removeScrollListener();
      }
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);

    // If we don't know the menu height already, we need to calculate it after
    // it's rendered. It's rendered inside a concealed container, so it's okay
    // if it renders in the wrong direction.
    if (this.state.menuHeight == null &&
      this.refs.dropdownMenuConcealer != null) {
      let dropdownMenuConcealer = this.refs.dropdownMenuConcealer;
      let {
        maxDropdownHeight,
        menuDirection,
        menuHeight,
        menuPosition
      } = this.state;

      if (dropdownMenuConcealer != null) {
        // Get the height and direction of the concealed menu.
        menuHeight = dropdownMenuConcealer.firstChild.clientHeight || 0;
        let menuStyle = this.getOptimalMenuStyle(menuHeight);

        maxDropdownHeight = menuStyle.height;
        menuDirection = menuStyle.direction;
        menuPosition = menuStyle.position;
      }

      // Setting state with menu height and direction will re-render the
      // dropdown in the correct direction and not concealed.
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        maxDropdownHeight,
        menuDirection,
        menuHeight,
        menuPosition
      });
      /* eslint-enable react/no-did-update-set-state */
    }
  }

  addScrollListener() {
    this.container.addEventListener('scroll', this.closeDropdown);
  }

  closeDropdown() {
    this.setState({isOpen: false});
  }

  getOptimalMenuStyle(menuHeight) {
    let direction = 'down';
    let height = null;
    let position = {};

    // If we don't know the menu height, render it down.
    if (menuHeight == null) {
      return {direction: 'down', height: null};
    }
    // Calculate the space above and below the dropdown button.
    let spaceAroundDropdown = DOMUtil
      .getNodeClearance(this.refs.dropdownWrapper);

    // If the menu height is larger than the space available on the bottom and
    // less than the space available on top, then render it up. If the height of
    // the menu exceeds the space below and above, but there is more space above
    // than below, render it up. Otherwise, render down.
    if ((menuHeight > spaceAroundDropdown.bottom
      && menuHeight < spaceAroundDropdown.top)
      || (menuHeight > spaceAroundDropdown.bottom
      && menuHeight > spaceAroundDropdown.top
      && spaceAroundDropdown.top > spaceAroundDropdown.bottom)) {
      direction = 'up';
      position.bottom = spaceAroundDropdown.bottom + spaceAroundDropdown.boundingRect.height;
      height = spaceAroundDropdown.top;
    } else {
      direction = 'down';
      position.top = spaceAroundDropdown.top + spaceAroundDropdown.boundingRect.height;
      height = spaceAroundDropdown.bottom;
    }

    if (this.props.matchButtonWidth) {
      position.left = spaceAroundDropdown.left;
      position.right = spaceAroundDropdown.right;
    } else if (this.props.anchorRight) {
      position.right = spaceAroundDropdown.right;
    } else {
      position.left = spaceAroundDropdown.left;
    }

    // We assume that 125 pixels is the smallest height we should render.
    if (height < 125) {
      height = 125;
    }

    return {direction, height, position};
  }

  getMenuItems(items) {
    let selectedID = this.getSelectedID();

    return items.map((item) => {
      let classSet = classNames(
        {
          'is-selectable': item.selectable !== false,
          'is-selected': item.id === selectedID
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
    let {scrollContainer, scrollContainerParentSelector} = this.props;

    if (typeof scrollContainer === 'string') {
      // Find the closest scrolling element by the specified selector.
      scrollContainer = DOMUtil.closest(ReactDOM.findDOMNode(this),
        scrollContainer) || window;

      let {parentElement} = scrollContainer;

      // If the user specified scrollContainerParentSelector, we check to see
      // if the parent scrolling element matches the specified parent selector.
      if (scrollContainer !== window && scrollContainerParentSelector != null
        && parentElement != null && parentElement[DOMUtil.matchesFn](
          scrollContainerParentSelector
        )) {
        scrollContainer = parentElement;
      }
    }

    return scrollContainer;
  }

  getSelectedHtml(id, items) {
    let obj = Util.find(items, function (item) {
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

  removeScrollListener() {
    if (this.container) {
      this.container.removeEventListener('scroll', this.closeDropdown);
    }
  }

  removeBlurTimeout() {
    if (this.currentBlurTimeout) {
      global.clearTimeout(this.currentBlurTimeout);
    }
  }

  handleExternalClick() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  }

  handleItemClick(item) {
    let props = this.props;
    props.onItemSelection(item);

    let newState = {isOpen: false};
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
      if (this.state.isOpen === true) {
        this.setState({isOpen: false});
      }
    }, 150);

    // We need to remove focus from the button to avoid this event firing again
    // when we open the dropdown
    global.focus();
  }

  handleMenuToggle(e) {
    e.stopPropagation();
    let menuDirection = this.state.menuDirection;
    let maxDropdownHeight = this.state.maxDropdownHeight;
    let menuPosition = {};

    // If the menu isn't open, then we're about to open it and we need to
    // calculate the direction every time.
    if (!this.state.isOpen) {
      let menuStyle = this.getOptimalMenuStyle(this.state.menuHeight);
      maxDropdownHeight = menuStyle.height;
      menuDirection = menuStyle.direction;
      menuPosition = menuStyle.position;
    }

    this.removeBlurTimeout();
    this.setState({
      maxDropdownHeight,
      menuDirection,
      menuPosition,
      isOpen: !this.state.isOpen
    });
  }

  render() {
    // Set a key based on the menu height so that React knows to keep the
    // the DOM element around while we are measuring it.
    let props = this.props;
    let state = this.state;
    let dropdownKey = 'initial-render';
    let dropdownMenu = null;
    let dropdownMenuClassSet = classNames(
      state.menuDirection,
      props.dropdownMenuClassName
    );
    let dropdownMenuStyle;
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

    if (state.menuHeight != null) {
      dropdownKey = state.menuHeight;
    }

    if (state.isOpen) {
      let dropdownMenuItems = (
        <ul>
          {this.getMenuItems(props.items)}
        </ul>
      );
      let dropdownMenuWrapperStyle = Object.assign({}, state.menuPosition);

      // Render with Gemini scrollbar if the dropdown's height is constrainted.
      if (state.menuHeight >= state.maxDropdownHeight) {
        let height = 'auto';

        // Remove 30 pixels from the dropdown height to account for offset
        // positioning from the dropdown button.
        if (state.maxDropdownHeight && state.maxDropdownHeight > 30) {
          height = `${state.maxDropdownHeight - 30}px`
        }

        dropdownMenuStyle = {height};

        if (props.useGemini && height !== 'auto') {
          dropdownMenuItems = (
            <GeminiScrollbar
            autoshow={true}
            className="container-scrollable"
            style={dropdownMenuStyle}>
            {dropdownMenuItems}
            </GeminiScrollbar>
          );
        } else {
          dropdownMenuItems = (
            <div
              className="container-scrollable"
              style={dropdownMenuStyle}>
              {dropdownMenuItems}
            </div>
          );
        }
      }

      dropdownMenu = (
        <span
          className={dropdownMenuClassSet}
          key={dropdownKey}
          role="menu"
          ref="dropdownMenu"
          style={dropdownMenuWrapperStyle}>
          <div className={props.dropdownMenuListClassName}>
            {dropdownMenuItems}
          </div>
        </span>
      );

      // If we don't know the menu's height, we render it invisibly and then
      // immediately measure its height in #componentDidUpdate, which will change
      // the state and trigger another render.
      if (state.menuHeight == null) {
        dropdownMenu = (
          <div className="dropdown-menu-concealer" ref="dropdownMenuConcealer">
            {dropdownMenu}
          </div>
        );
      }
    }

    if (props.transition) {
      dropdownMenu = (
        <ReactCSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={props.transitionEnterTimeout}
          transitionLeaveTimeout={props.transitionLeaveTimeout}>
          {dropdownMenu}
        </ReactCSSTransitionGroup>
      );
    }

    let selectedID = this.getSelectedID();

    return (
      <span className={wrapperClassSet}
        tabIndex="1"
        onBlur={this.handleWrapperBlur}
        ref="dropdownWrapper">
        <button className={props.buttonClassName}
          onClick={this.handleMenuToggle}
          ref="button"
          type="button">
          {this.getSelectedHtml(selectedID, items)}
        </button>
        {dropdownMenu}
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
  transitionName: 'dropdown-menu',
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
  scrollContainer: React.PropTypes.oneOfType([React.PropTypes.object,
    React.PropTypes.string]),
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
