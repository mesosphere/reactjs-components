/**
 * Largely based on the VirtualList component from
 * https://github.com/developerdizzle/react-virtual-list
 */

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import throttle from "lodash.throttle";

import DOMUtil from "../Util/DOMUtil";
import Util from "../Util/Util";

const mathMax = Math.max;
const mathMin = Math.min;
const mathFloor = Math.floor;
const mathCeil = Math.ceil;
const METHODS_TO_BIND = [
  "onScroll",
  "getBox",
  "getItems",
  "getItemsToRender",
  "getVirtualState",
  "visibleItems"
];

const safeCall = f => {
  try {
    return f();
  } catch (e) {
    console.error(e);
  }
};

class VirtualList extends React.Component {
  constructor() {
    super(...arguments);

    this.state = this.getVirtualState(this.props);

    // Replace onScroll by throttling
    if (this.props.scrollDelay > 0) {
      this.onScroll = throttle(
        this.onScroll,
        this.props.scrollDelay,
        // Fire on both leading and trailing edge to minize flash of
        // un-rendered items
        { leading: true, trailing: true }
      );
    }

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });

    this.listRef = React.createRef();
  }

  componentDidMount() {
    // Make sure to trigger this scroll event and make necessary adjustments
    // before (useCapture = true) any other scroll event is handled
    this.props.container.addEventListener("scroll", this.onScroll, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      this.props.container.removeEventListener("scroll", this.onScroll, true);
      // Make sure to trigger this scroll event and make necessary adjustments
      // before (useCapture = true) any other scroll event is handled
      nextProps.container.addEventListener("scroll", this.onScroll, true);
    }

    const state = this.getVirtualState(nextProps);
    this.setState(state);
  }

  componentWillUnmount() {
    const props = this.props;
    props.container.removeEventListener("scroll", this.onScroll, true);
  }

  onScroll() {
    const state = this.getVirtualState(this.props);
    this.setState(state);
  }

  getBox(view, list) {
    list.height = list.height || list.bottom - list.top;

    return {
      top: mathMax(0, mathMin(view.top - list.top)),
      bottom: mathMax(0, mathMin(list.height, view.bottom - list.top))
    };
  }

  getItems(viewTop, viewHeight, listTop, itemHeight, itemCount, itemBuffer) {
    if (itemCount === 0 || itemHeight === 0) {
      return {
        firstItemIndex: 0,
        lastItemIndex: 0
      };
    }

    const listHeight = itemHeight * itemCount;

    const listBox = {
      top: listTop,
      height: listHeight,
      bottom: listTop + listHeight
    };

    const bufferHeight = itemBuffer * itemHeight;
    viewTop -= bufferHeight;
    viewHeight += bufferHeight * 2;

    const viewBox = {
      top: viewTop,
      bottom: viewTop + viewHeight
    };

    // List is below viewport
    if (viewBox.bottom < listBox.top) {
      return {
        firstItemIndex: 0,
        lastItemIndex: viewHeight / itemHeight + itemBuffer
      };
    }

    // List is above viewport
    if (viewBox.top > listBox.bottom) {
      return {
        firstItemIndex: 0,
        lastItemIndex: viewHeight / itemHeight + itemBuffer
      };
    }

    const listViewBox = this.getBox(viewBox, listBox);

    const firstItemIndex = mathMax(0, mathFloor(listViewBox.top / itemHeight));
    const lastItemIndex = mathCeil(listViewBox.bottom / itemHeight) - 1;

    const result = {
      firstItemIndex,
      lastItemIndex
    };

    return result;
  }

  getItemsToRender(props, state) {
    return state.items.map(function(item, index) {
      return safeCall(() => {
        return props.renderItem(
          item,
          // Start from number of buffered items
          state.bufferStart / props.itemHeight + index
        );
      });
    });
  }

  getVirtualState(props) {
    // Default values
    const state = {
      bufferEnd: 0,
      bufferStart: 0,
      items: []
    };

    // Early return if nothing to render
    if (
      typeof props.container === "undefined" ||
      props.items.length === 0 ||
      props.itemHeight <= 0
    ) {
      return state;
    }

    const items = props.items;
    const container = props.container;
    const viewHeight = DOMUtil.getViewportHeight();

    let viewTop;
    if (typeof container.scrollY !== "undefined") {
      viewTop = container.scrollY;
    } else {
      viewTop = DOMUtil.getScrollTop(container) || 0;
    }

    if (this.listRef && this.listRef.current) {
      const listBounding = ReactDOM.findDOMNode(
        this.listRef.current
      ).getBoundingClientRect();

      const elementTop =
        listBounding.top + DOMUtil.getScrollTop(container) || 0;

      viewTop -= elementTop;
    }

    const renderStats = this.getItems(
      viewTop,
      viewHeight,
      0,
      props.itemHeight,
      items.length,
      props.itemBuffer
    );

    state.items = items.slice(
      renderStats.firstItemIndex,
      renderStats.lastItemIndex + 1
    );

    state.bufferStart = renderStats.firstItemIndex * props.itemHeight;
    state.bufferEnd =
      (props.items.length - renderStats.lastItemIndex - 1) * props.itemHeight;

    return state;
  }

  // In case you need to get the currently visible items
  visibleItems() {
    return this.state.items;
  }

  render() {
    const state = this.state;
    const props = this.props;

    const topStyles = {
      height: state.bufferStart
    };

    if (!(state.bufferStart > 0)) {
      topStyles.display = "none";
    }

    const bottomStyles = {
      height: state.bufferEnd
    };

    if (!(state.bufferEnd > 0)) {
      bottomStyles.display = "none";
    }

    const htmlAttributes = Util.exclude(
      props,
      Object.keys(VirtualList.propTypes)
    );

    return (
      <props.tagName ref={this.listRef} {...htmlAttributes}>
        {safeCall(() => props.renderBufferItem(topStyles))}
        {this.getItemsToRender(props, state)}
        {safeCall(() => props.renderBufferItem(bottomStyles))}
      </props.tagName>
    );
  }
}

VirtualList.defaultProps = {
  container: typeof window !== "undefined" ? window : undefined,
  itemBuffer: 0,
  scrollDelay: 0,
  tagName: "div"
};

VirtualList.propTypes = {
  // Array of items to render
  items: PropTypes.array.isRequired,

  // The fixed height of a single item. Needs to be the same for all items
  // We suggest that you add a CSS rule to set the row height to the same value
  itemHeight: PropTypes.number.isRequired,

  // This function should return the item view, the data model and the index
  // is passed to the function.
  // If you want to tweak performance, we suggest you memoize the results
  renderItem: PropTypes.func.isRequired,

  // This function should return an item buffer view, the data model and the
  // index is passed to the function.
  renderBufferItem: PropTypes.func.isRequired,

  // Optional item that the items should be rendered within. Defaults to window
  container: PropTypes.object,

  // Optional Specify which tag the container should render
  tagName: PropTypes.string,

  // Optional scroll delay to use in throttle function
  scrollDelay: PropTypes.number,

  // Optional number of items to use as buffer, before and after viewport
  itemBuffer: PropTypes.number
};

module.exports = VirtualList;
