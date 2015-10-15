/**
 * Largely based on the VirtualList component from
 * https://github.com/developerdizzle/react-virtual-list
 */

/* eslint react/no-did-mount-set-state: 0 */
import BindMixin from '../Mixin/BindMixin';
import DOMUtil from '../Util/DOMUtil';
import React from 'react';
import Util from '../Util/Util';

let mathMax = Math.max;
let mathMin = Math.min;
let mathFloor = Math.floor;
let mathCeil = Math.ceil;

export default class VirtualList extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ['onScroll'];
  }
  constructor() {
    super(arguments);
    this.state = {
      bufferEnd: 0,
      bufferStart: 0,
      items: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let state = this.getVirtualState(nextProps);
    this.setState(state);
  }

  componentWillMount() {
    this.onScrollDebounced = Util.debounce(
      this.onScroll,
      this.props.scrollDelay,
      false
    );
  }

  componentDidMount() {
    let props = this.props;
    let state = this.getVirtualState(props);
    let onReady = props.onReady || Util.noop;
    this.setState(state, onReady);

    props.container.addEventListener('scroll', this.onScrollDebounced);
  }

  componentWillUnmount() {
    let props = this.props;
    props.container.removeEventListener('scroll', this.onScrollDebounced);
  }

  onScroll() {
    let state = this.getVirtualState(this.props);
    this.setState(state);
  }

  getVirtualState(props) {
    // Default values
    let state = {
      bufferEnd: 0,
      bufferStart: 0,
      items: []
    };

    // Early return if nothing to render
    if (typeof props.container === 'undefined' ||
        props.items.length === 0 ||
        props.itemHeight <= 0) {
      return state;
    }

    let items = props.items;
    let container = props.container;
    let viewHeight;
    if (typeof container.innerHeight !== 'undefined') {
      viewHeight = container.innerHeight;
    } else {
      viewHeight = container.clientHeight;
    }

    // No space to render
    if (viewHeight <= 0) {
      return state;
    }

    let offsetTop = this.props.offsetTop ||
      DOMUtil.topDifference(React.findDOMNode(this), container);
    let viewTop;
    if (typeof container.scrollY !== 'undefined') {
      viewTop = container.scrollY;
    } else {
      viewTop = container.scrollTop;
    }

    let renderStats = VirtualList.getItems(
      viewTop,
      viewHeight,
      offsetTop,
      props.itemHeight,
      items.length,
      props.itemBuffer
    );

    // No items to render
    if (renderStats.itemsInView.length === 0) {
      return state;
    }

    state.items = items.slice(
      renderStats.firstItemIndex,
      renderStats.lastItemIndex + 1
    );
    state.bufferStart = renderStats.firstItemIndex * props.itemHeight;
    state.bufferEnd = (props.items.length - renderStats.lastItemIndex - 1) *
      props.itemHeight;

    return state;
  }

  // In case you need to get the currently visible items
  visibleItems() {
    return this.state.items;
  }

  render() {
    let state = this.state;
    let props = this.props;

    let topStyles = {
      height: state.bufferStart
    };

    if (!(state.bufferStart > 0)) {
      topStyles.display = 'none';
    }

    let bottomStyles = {
      height: state.bufferEnd
    };

    if (!(state.bufferEnd > 0)) {
      bottomStyles.display = 'none';
    }

    return (
    <props.tagName {...props}>
      {props.renderBufferItem(topStyles)}
      {state.items.map(props.renderItem)}
      {props.renderBufferItem(bottomStyles)}
    </props.tagName>
    );
  }

}

VirtualList.getBox = function (view, list) {
  list.height = list.height || list.bottom - list.top;

  return {
    top: mathMax(0, mathMin(view.top - list.top)),
    bottom: mathMax(0, mathMin(list.height, view.bottom - list.top))
  };
};

VirtualList.getItems = function (viewTop, viewHeight, listTop, itemHeight,
  itemCount, itemBuffer) {
  if (itemCount === 0 || itemHeight === 0) {
    return {
      itemsInView: 0
    };
  }

  let listHeight = itemHeight * itemCount;

  let listBox = {
    top: listTop,
    height: listHeight,
    bottom: listTop + listHeight
  };

  let bufferHeight = itemBuffer * itemHeight;
  viewTop -= bufferHeight;
  viewHeight += bufferHeight * 2;

  let viewBox = {
    top: viewTop,
    bottom: viewTop + viewHeight
  };

  // List is below viewport
  if (viewBox.bottom < listBox.top) {
    return {
      itemsInView: 0
    };
  }

  // List is above viewport
  if (viewBox.top > listBox.bottom) {
    return {
      itemsInView: 0
    };
  }

  let listViewBox = VirtualList.getBox(viewBox, listBox);

  let firstItemIndex = mathMax(0, mathFloor(listViewBox.top / itemHeight));
  let lastItemIndex = mathCeil(listViewBox.bottom / itemHeight) - 1;

  let itemsInView = lastItemIndex - firstItemIndex + 1;

  let result = {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex,
    itemsInView: itemsInView
  };

  return result;
};

VirtualList.defaultProps = {
  container: typeof window !== 'undefined' ? window : undefined,
  offsetTop: 0,
  itemBuffer: 0,
  scrollDelay: 0,
  tagName: 'div'
};

VirtualList.propTypes = {
  // Array of items to render
  items: React.PropTypes.array.isRequired,

  // The fixed height of a single item. Needs to be the same for all items
  // We suggest that you add a CSS rule to set the row height to the same value
  itemHeight: React.PropTypes.number.isRequired,

  // Optional callback function. Gets called when list is fully loaded
  onReady: React.PropTypes.func,

  // Optional number to provide the difference between container and
  // the virtual list. It will default to 0. If undefined is provided,
  // it will be measured, but be careful! This might break animations!
  offsetTop: React.PropTypes.number,

  // This function should return the item view, the data model and the index
  // is passed to the function.
  // If you want to tweak performance, we suggest you memoize the results
  renderItem: React.PropTypes.func.isRequired,

  // Optional item that the items should be rendered within. Defaults to window
  container: React.PropTypes.object.isRequired,

  // Optional Specify which tag the container should render
  tagName: React.PropTypes.string,

  // Optional scroll delay to use in debounce function
  scrollDelay: React.PropTypes.number,

  // Optional number of items to use as buffer, before and after viewport
  itemBuffer: React.PropTypes.number
};
