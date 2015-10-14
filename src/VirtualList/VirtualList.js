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

    this.props.container.removeEventListener('scroll', this.onScrollDebounced);

    this.onScrollDebounced = Util.debounce(
      this.onScroll,
      nextProps.scrollDelay,
      false
    );

    nextProps.container.addEventListener('scroll', this.onScrollDebounced);

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
    let state = this.getVirtualState(this.props);
    let onReady = this.props.onReady || Util.noop;
    this.setState(state, onReady);

    this.props.container.addEventListener('scroll', this.onScrollDebounced);
  }

  componentWillUnmount() {
    this.props.container.removeEventListener('scroll', this.onScrollDebounced);
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

    let list = React.findDOMNode(this);
    let offsetTop = DOMUtil.topDifference(list, container);
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
  tagName: 'div',
  scrollDelay: 0,
  itemBuffer: 0
};

VirtualList.propTypes = {
  items: React.PropTypes.array.isRequired,
  itemHeight: React.PropTypes.number.isRequired,
  onReady: React.PropTypes.func,
  renderItem: React.PropTypes.func.isRequired,
  container: React.PropTypes.object.isRequired,
  tagName: React.PropTypes.string.isRequired,
  scrollDelay: React.PropTypes.number,
  itemBuffer: React.PropTypes.number
};
