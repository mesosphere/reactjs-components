/**
 * Largely based on the VirtualList component from
 * https://github.com/developerdizzle/react-virtual-list
 */

/* eslint react/no-did-mount-set-state: 0 */
import React from 'react';
import DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

const VirtualList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    onReady: React.PropTypes.func,
    renderItem: React.PropTypes.func.isRequired,
    container: React.PropTypes.object.isRequired,
    tagName: React.PropTypes.string.isRequired,
    scrollDelay: React.PropTypes.number,
    itemBuffer: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      container: typeof window !== 'undefined' ? window : undefined,
      tagName: 'div',
      scrollDelay: 0,
      itemBuffer: 0
    };
  },

  getVirtualState: function (props) {
    // default values
    let state = {
      bufferEnd: 0,
      bufferStart: 0,
      height: 0,
      items: []
    };

    // early return if nothing to render
    if (typeof props.container === 'undefined' ||
        props.items.length === 0 ||
        props.itemHeight <= 0 ||
        !this.isMounted()) {
      return state;
    }

    let items = props.items;
    let container = props.container;
    let viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;

    // no space to render
    if (viewHeight <= 0) {
      return state;
    }

    let list = this.getDOMNode();
    let offsetTop = DOMUtil.topDifference(list, container);
    let viewTop = typeof container.scrollY !== 'undefined' ? container.scrollY : container.scrollTop;
    let renderStats = VirtualList.getItems(viewTop, viewHeight, offsetTop, props.itemHeight, items.length, props.itemBuffer);

    // no items to render
    if (renderStats.itemsInView.length === 0) {
      return state;
    }

    state.height = props.items.length * props.itemHeight;
    state.items = items.slice(renderStats.firstItemIndex, renderStats.lastItemIndex + 1);
    state.bufferStart = renderStats.firstItemIndex * props.itemHeight;
    state.bufferEnd = (props.items.length - renderStats.lastItemIndex - 1) * props.itemHeight;

    return state;
  },

  getInitialState: function () {
    return this.getVirtualState(this.props);
  },

  componentWillReceiveProps: function (nextProps) {
    let state = this.getVirtualState(nextProps);

    this.props.container.removeEventListener('scroll', this.onScrollDebounced);

    this.onScrollDebounced = Util.debounce(this.onScroll, nextProps.scrollDelay, false);

    nextProps.container.addEventListener('scroll', this.onScrollDebounced);

    this.setState(state);
  },

  componentWillMount: function () {
    this.onScrollDebounced = Util.debounce(this.onScroll, this.props.scrollDelay, false);
  },

  componentDidMount: function () {
    let state = this.getVirtualState(this.props);
    let onReady = this.props.onReady || Util.noop;
    this.setState(state, onReady);

    this.props.container.addEventListener('scroll', this.onScrollDebounced);
  },

  componentWillUnmount: function () {
    this.props.container.removeEventListener('scroll', this.onScrollDebounced);
  },

  onScroll: function () {
    let state = this.getVirtualState(this.props);
    this.setState(state);
  },

  // in case you need to get the currently visible items
  visibleItems: function () {
    return this.state.items;
  },

  render: function () {

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
});

VirtualList.getBox = function (view, list) {
  list.height = list.height || list.bottom - list.top;

  return {
    top: Math.max(0, Math.min(view.top - list.top)),
    bottom: Math.max(0, Math.min(list.height, view.bottom - list.top))
  };
};

VirtualList.getItems = function (viewTop, viewHeight, listTop, itemHeight, itemCount, itemBuffer) {
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

  // list is below viewport
  if (viewBox.bottom < listBox.top) {
    return {
      itemsInView: 0
    };
  }

  // list is above viewport
  if (viewBox.top > listBox.bottom) {
    return {
      itemsInView: 0
    };
  }

  let listViewBox = VirtualList.getBox(viewBox, listBox);

  let firstItemIndex = Math.max(0, Math.floor(listViewBox.top / itemHeight));
  let lastItemIndex = Math.ceil(listViewBox.bottom / itemHeight) - 1;

  let itemsInView = lastItemIndex - firstItemIndex + 1;

  let result = {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex,
    itemsInView: itemsInView
  };

  return result;
};

module.exports = VirtualList;
