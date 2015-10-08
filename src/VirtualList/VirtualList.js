import React from 'react';
import DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

var VirtualList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
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
    var state = {
      items: [],
      bufferStart: 0,
      height: 0
    };

    // early return if nothing to render
    if (typeof props.container === 'undefined' ||
        props.items.length === 0 ||
        props.itemHeight <= 0 ||
        !this.isMounted()) {
      return state;
    }

    var items = props.items;
    var container = props.container;
    var viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;

    // no space to render
    if (viewHeight <= 0) {
      return state;
    }

    var list = this.getDOMNode();
    var offsetTop = DOMUtil.topDifference(list, container);
    var viewTop = typeof container.scrollY !== 'undefined' ? container.scrollY : container.scrollTop;
    var renderStats = VirtualList.getItems(viewTop, viewHeight, offsetTop, props.itemHeight, items.length, props.itemBuffer);

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

  // shouldComponentUpdate: function (nextProps, nextState) {
  //     let state = this.state;
  //     if (state.bufferStart !== nextState.bufferStart) return true;

  //     if (state.height !== nextState.height) return true;

  //     // Superficial array check
  //     let items = state.items;
  //     let nextItems = nextState.items;
  //     if (!items || !nextItems) return false;
  //     if (items.length != nextItems.length) return false;
  //   return true;
  // },

  componentWillReceiveProps: function (nextProps) {
    var state = this.getVirtualState(nextProps);

    this.props.container.removeEventListener('scroll', this.onScrollDebounced);

    this.onScrollDebounced = Util.debounce(this.onScroll, nextProps.scrollDelay, false);

    nextProps.container.addEventListener('scroll', this.onScrollDebounced);

    this.setState(state);
  },

  componentWillMount: function () {
    this.onScrollDebounced = Util.debounce(this.onScroll, this.props.scrollDelay, false);
  },

  componentDidMount: function () {
    var state = this.getVirtualState(this.props);

    this.setState(state);

    this.props.container.addEventListener('scroll', this.onScrollDebounced);
  },

  componentWillUnmount: function () {
    this.props.container.removeEventListener('scroll', this.onScrollDebounced);
  },

  onScroll: function () {
    var state = this.getVirtualState(this.props);
    this.setState(state);
  },

  // in case you need to get the currently visible items
  visibleItems: function () {
    return this.state.items;
  },

  render: function () {

    var state = this.state;
    var props = this.props;

    var topStyles = {
      height: state.bufferStart
    };

    if (!(state.bufferStart > 0)) {
      topStyles.display = 'none';
    }

    var bottomStyles = {
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

  var listHeight = itemHeight * itemCount;

  var listBox = {
    top: listTop,
    height: listHeight,
    bottom: listTop + listHeight
  };

  var bufferHeight = itemBuffer * itemHeight;
  viewTop -= bufferHeight;
  viewHeight += bufferHeight * 2;

  var viewBox = {
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

  var listViewBox = VirtualList.getBox(viewBox, listBox);

  var firstItemIndex = Math.max(0, Math.floor(listViewBox.top / itemHeight));
  var lastItemIndex = Math.ceil(listViewBox.bottom / itemHeight) - 1;

  var itemsInView = lastItemIndex - firstItemIndex + 1;

  var result = {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex,
    itemsInView: itemsInView
  };

  return result;
};

module.exports = VirtualList;
