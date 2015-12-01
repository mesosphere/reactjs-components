import classNames from 'classnames';
import DOMUtil from '../Util/DOMUtil';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, {PropTypes} from 'react/addons';
import Util from '../Util/Util';
import VirtualList from '../VirtualList/VirtualList';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

let sortData = (columns, data, sortBy) => {
  if (sortBy.order === undefined || sortBy.prop === undefined) {
    return data;
  }

  let sortFunction;

  columns.forEach((column) => {
    if (column.prop === sortBy.prop) {
      sortFunction = column.sortFunction;
    }
  });

  if (sortFunction) {
    // Use custom sort method if specified.
    data = Util.sortBy(data, sortFunction(sortBy.prop, sortBy.order));
  } else {
    // Otherwise, use default sorting.
    data = Util.sortBy(data, sortBy.prop);
  }

  if (sortBy.order === 'desc') {
    data.reverse();
  }

  return data;
};

let getClassName = (column, sortBy, data) => {
  if (Util.isFunction(column.className)) {
    return column.className(
      column.prop, sortBy, data
    );
  }

  return column.className || '';
};

export default class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      sortBy: {}
    };
    this.cachedRows = {};
  }

  componentWillMount() {
    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop);
    }
  }

  componentDidMount() {
    this.updateHeight();
  }

  componentWillReceiveProps() {
    this.updateHeight();

    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop, {toggle: false});
    }
  }

  componentWillUpdate() {
    // Clear cached rows
    this.cachedRows = {};
  }

  updateHeight() {
    let newState = {};
    let props = this.props;
    let state = this.state;
    let refs = this.refs;

    if (state.scrollContainer == null && refs.gemini != null) {
      // Get the Gemini scroll view as the container view.
      // We need this since both Gemini and VirtualList need the same element
      newState.scrollContainer = React.findDOMNode(
        refs.gemini.refs['scroll-view']
      );
    }

    if (props.itemHeight == null &&
      state.itemHeight == null &&
      refs.itemHeightContainer != null) {
      // Calculate content height only once and when node is ready
      newState.itemHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(refs.itemHeightContainer).querySelector('tr')
      ).height;
    }

    if (props.useFlex) {
      let headerHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(refs.headers)
      ).height;

      // Default to not grow beyond the specified ratio of viewport height
      newState.viewportHeight =
        props.windowRatio * DOMUtil.getViewportHeight() - headerHeight;
      // Calculated scroll container height

      let scrollContainerHeight =
        DOMUtil.getComputedDimensions(React.findDOMNode(refs.container)).height -
        headerHeight - 30; // 30px for padding
      newState.viewportHeight = scrollContainerHeight;
    } else if (state.viewportHeight == null) {
      let headerHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(refs.headers)
      ).height;

      // Default to not grow beyond the specified ratio of viewport height
      newState.viewportHeight =
        props.windowRatio * DOMUtil.getViewportHeight() - headerHeight;
      // Calculated scroll container height
      let scrollContainerHeight =
        DOMUtil.getComputedDimensions(React.findDOMNode(refs.container)).height -
        headerHeight;

      // Gemini may not always be present
      if (newState.scrollContainer) {
        // Calculate the element we grow with flex
        let growContainer = scrollContainerHeight -
          DOMUtil.getComputedDimensions(newState.scrollContainer).height;

        // Check if the table can grow to take up the rest of its parent.
        // If it can select the smallest viewport; parent or window.
        if (growContainer > 0) {
          newState.viewportHeight = scrollContainerHeight;
        }
      }
    }

    // Only update if we have a change
    if (state.scrollContainer !== newState.scrollContainer ||
      state.itemHeight !== newState.itemHeight ||
      state.viewportHeight !== newState.viewportHeight) {
      this.setState(newState);
    }
  }

  getHeaders(headers, sortBy) {
    let buildSortAttributes = (header) => {
      let sortEvent = this.handleSort.bind(this, header.prop);
      return {
        onClick: sortEvent,
        tabIndex: 0,
        'aria-sort': this.state.sortBy.order,
        'aria-label':
          `${header.prop}: activate to sort column ${this.state.sortBy.order}`
      };
    };

    return headers.map((header, index) => {
      let order, heading;
      let attributes = {};

      // Only add sorting events if the column has a value for 'prop'
      // and the 'sorting' property is true.
      if (header.sortable !== false && 'prop' in header) {
        attributes = buildSortAttributes(header);
        order = this.state.sortBy.order;
      }

      // If the heading property is a method, then pass to it the options and
      // render the result. Otherwise, display the value.
      if (Util.isFunction(header.heading)) {
        heading = header.heading(header.prop, order, sortBy);
      } else {
        heading = header.heading;
      }

      attributes.className = getClassName(header, this.state.sortBy, null);
      attributes.key = index;

      return (
        <th {...attributes}>
          {heading}
        </th>
      );
    });
  }

  getBufferItem(columns, styles) {
    return <tr style={styles}><td colSpan={columns.length} /></tr>;
  }

  getEmptyRowCell(columns) {
    return (
      <tr>
        <td colSpan={columns.length}>
          No data
        </td>
      </tr>
    );
  }

  getRowCells(columns, sortBy, buildRowOptions, idAttribute, row) {
    let id = row[idAttribute];
    // Skip build row if we have it memoized
    if (this.cachedRows[id] == null) {
      let rowCells = columns.map(function (column, index) {
        // For each column in the data, output a cell in each row with the value
        // specified by the data prop.
        let cellClassName = getClassName(column, sortBy, row);

        let cellValue = row[column.prop];

        if (column.render) {
          cellValue = column.render(column.prop, row);
        }

        if (cellValue === undefined) {
          cellValue = column.defaultContent;
          cellClassName += ' empty-cell';
        }

        return (
          <td {...column.attributes} className={cellClassName} key={index}>
            {cellValue}
          </td>
        );
      });

      // Create the custom row attributes object, always with a key.
      let rowAttributes = Util.extend(
        {key: id},
        buildRowOptions(row, this)
      );

      this.cachedRows[id] = (
        <tr {...rowAttributes}>
          {rowCells}
        </tr>
      );
    }

    return this.cachedRows[id];
  }

  getRows(data, columns, sortBy, buildRowOptions, idAttribute) {
    if (data.length === 0) {
      return this.getEmptyRowCell(columns);
    }

    return data.map((row) =>
      this.getRowCells(columns, sortBy, buildRowOptions, idAttribute, row)
    );
  }

  handleSort(prop, options) {
    let sortBy = this.state.sortBy;
    let onSortCallback = this.props.onSortCallback;
    options = Util.extend({
      toggle: true
    }, options);

    if (options.toggle) {
      let order;

      if (sortBy.order === 'desc' || sortBy.prop !== prop) {
        order = 'asc';
      } else {
        order = 'desc';
      }

      this.setState({
        sortBy: {order, prop}
      });
    }

    if (Util.isFunction(onSortCallback)) {
      onSortCallback(sortBy);
    }
  }

  getTable(columns, data, sortBy, idAttribute) {
    let buildRowOptions = this.props.buildRowOptions;
    let sortedData = sortData(columns, data, sortBy);

    let rows = this.getRows(sortedData, columns, sortBy, buildRowOptions, idAttribute);

    // Can only use transitions in tables that does not scroll
    if (this.props.transition === true) {
      rows = (
        <CSSTransitionGroup component="tbody" transitionName="table-row">
          {rows}
        </CSSTransitionGroup>
      );
    }

    return (
      <table className={this.props.className}>
        {this.props.colGroup}
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  getScrollTable(columns, data, sortBy, itemHeight, containerHeight, idAttribute) {
    let classes = classNames(this.props.className, 'flush-bottom');
    let scrollContainer = this.state.scrollContainer;
    let buildRowOptions = this.props.buildRowOptions;
    let childToMeasure;

    if (itemHeight === 0 && data.length) {
      childToMeasure = this.getRowCells(columns, sortBy, buildRowOptions, idAttribute, data[0]);
    }

    let innerContent = (
      <tbody ref="itemHeightContainer">
        {childToMeasure}
      </tbody>
    );

    let style = {};

    if (data.length === 0) {
      innerContent = (
        <tbody>
          {this.getEmptyRowCell(columns)}
        </tbody>
      );
    } else if (scrollContainer != null) {
      style.height = containerHeight;
      let visibleItems = Math.ceil(containerHeight / itemHeight);

      // itemBuffer and scrollDelay is based on number of visible items
      // with a max value cutoff.
      innerContent = (
        <VirtualList
          container={scrollContainer}
          itemBuffer={Math.min(200, 10 * visibleItems)}
          itemHeight={itemHeight}
          items={sortData(columns, data, sortBy)}
          renderBufferItem={this.getBufferItem.bind(this, columns)}
          renderItem={this.getRowCells.bind(this, columns, sortBy, buildRowOptions, idAttribute)}
          scrollDelay={Math.min(5, visibleItems / 4)}
          tagName="tbody" />
      );
    }

    return (
      <GeminiScrollbar
        autoshow={true}
        ref="gemini"
        style={style}>
        <table className={classes}>
          {this.props.colGroup}
          {innerContent}
        </table>
      </GeminiScrollbar>
    );
  }

  render() {
    let props = this.props;
    let state = this.state;
    let classes = classNames(props.className, 'flush-bottom');
    let columns = props.columns;
    let data = props.data;
    let idAttribute = props.idAttribute;
    let sortBy = state.sortBy;
    let tableContent = null;

    let itemHeight = state.itemHeight || props.itemHeight || 0;
    let itemListHeight = itemHeight * data.length;

    // Calculate the minimum of either the content or viewport height
    let containerHeight = Math.min(itemListHeight, state.viewportHeight);

    // Use scroll table on first render to check if we need to scroll
    // and if content is bigger than its container
    if (props.useFlex || itemHeight === 0 || itemListHeight > containerHeight) {
      tableContent =
        this.getScrollTable(
          columns, data, sortBy, itemHeight, containerHeight, idAttribute
        );
    } else {
      tableContent = this.getTable(columns, data, sortBy, idAttribute);
    }

    let styles = {};
    let className = '';

    if (props.useFlex) {
      className = 'no-overflow';
      styles.flexGrow = 1;
    }

    return (
      <div ref="container" className={className} style={styles}>
        <table ref="headers" className={classes}>
          {props.colGroup}
          <thead>
            <tr>
              {this.getHeaders(columns, sortBy)}
            </tr>
          </thead>
        </table>
        {tableContent}
      </div>
    );
  }
}

Table.defaultProps = {
  buildRowOptions: () => { return {}; },
  sortBy: {},
  useFlex: false,
  windowRatio: 0.8
};

Table.propTypes = {
  // Optional attributes to be passed to the row elements.
  buildRowOptions: PropTypes.func,

  className: PropTypes.string,

  // Optional colgroup component.
  colGroup: PropTypes.object,

  // Define how columns should be rendered and if they are sortable.
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: React.PropTypes.object,
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      defaultContent: PropTypes.string,
      heading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]).isRequired,
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sortable: PropTypes.bool,
      // Custom sorting function. If this function returns null,
      // it will fallback to default sorting.
      sortFunction: PropTypes.func
    })
  ).isRequired,

  // Data to display in the table.
  // Make sure to clone the data, cannot be modified!
  data: PropTypes.array.isRequired,

  // Optional item height for the scroll table. If not provided, it will render
  // once to measure the height of the first child.
  // NB: Initial render will stop any ongoing animation, if this is not provided
  itemHeight: PropTypes.number,

  // Provide what attribute in the data make a row unique.
  idAttribute: PropTypes.string.isRequired,

  // Optional callback function when sorting is complete.
  onSortCallback: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  // Optional property to add transitions or turn them off. Default is off.
  // Only available for tables that does not scroll
  transition: PropTypes.bool,

  useFlex: PropTypes.bool,

  // Optional property to set a ratio of the window you want the table
  // to not grow beyond. Defaults to 0.8 (meaning 80% of the window height).
  windowRatio: PropTypes.number
};
