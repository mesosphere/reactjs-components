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
    data = Util.sortBy(data, sortFunction(sortBy.prop));
  } else {
    // Otherwise, use default sorting.
    data = Util.sortBy(data, sortBy.prop);
  }

  if (sortBy.order === 'asc') {
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

// Superficial array check
let arrayDiff = (a, b) => {
  if (!a || !b) {
    return true;
  }

  return a.length !== b.length;
};

export default class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      sortBy: {}
    };
  }

  componentWillMount() {
    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop);
    }
  }

  componentDidMount() {
    this.updateHeight();
    this.forceUpdate();
  }

  componentWillReceiveProps() {
    this.updateHeight();

    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop, {toggle: false});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let sortBy = this.state.sortBy;
    let nextSortBy = nextState.sortBy;

    // Only update on props that should cause a re-render
    return props.keys !== nextProps.keys ||
      sortBy.prop !== nextSortBy.prop ||
      sortBy.order !== nextSortBy.order ||
      arrayDiff(props.columns, nextProps.columns) ||
      arrayDiff(props.data, nextProps.data);
  }

  updateHeight() {
    if (this.refs.gemini != null) {
      this.containerNode = React.findDOMNode(
        this.refs.gemini.refs['scroll-view']
      );
    }

    // Calculate content height only once and when node is ready
    if (this.refs.itemHeightContainer != null && this.itemHeight == null) {
      this.itemHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(this.refs.itemHeightContainer).children[0]
      ).height;
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

  getRowCells(columns, sortBy, buildRowOptions, keys, row) {
    let rowCells = columns.map((column, index) => {
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
      {key: Util.values(Util.pick(row, keys))},
      buildRowOptions(row, this)
    );

    return (
      <tr {...rowAttributes}>
        {rowCells}
      </tr>
    );
  }

  getRows(data, columns, sortBy, buildRowOptions, keys) {
    if (data.length === 0) {
      return this.getEmptyRowCell(columns);
    }

    return data.map((row) => this.getRowCells(columns, sortBy, buildRowOptions, keys, row));
  }

  handleSort(prop, options) {
    let sortBy = this.state.sortBy;
    let onSortCallback = this.props.onSortCallback;
    options = Util.extend({
      toggle: true
    }, options);

    if (options.toggle) {
      let order;

      if (sortBy.order === 'desc') {
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

  getTable(columns, data, sortBy) {
    let buildRowOptions = this.props.buildRowOptions;
    let keys = this.props.keys;
    let sortedData = sortData(columns, data, sortBy);

    let rows = this.getRows(sortedData, columns, sortBy, buildRowOptions, keys);

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

  getScrollTable(columns, data, sortBy, containerHeight) {
    let classes = classNames(this.props.className, 'flush-bottom');
    let buildRowOptions = this.props.buildRowOptions;
    let keys = this.props.keys;

    let innerContent = (
      <tbody ref="itemHeightContainer">
        {this.getRowCells(columns, sortBy, buildRowOptions, keys, data[0])}
      </tbody>
    );

    let style = {};

    if (this.containerNode != null) {
      style.height = containerHeight;
      let visibleItems = Math.ceil(containerHeight / this.itemHeight);

      // Re-render on ready, since VirtualList needs to be rendered on mount
      // and we need gemini to update accordingly.
      // Set itemBuffer and scrollDelay based on no. visible items.
      innerContent = (
        <VirtualList
          items={sortData(columns, data, sortBy)}
          container={this.containerNode}
          itemHeight={this.itemHeight}
          onReady={this.forceUpdate.bind(this)}
          tagName="tbody"
          renderBufferItem={this.getBufferItem.bind(this, columns)}
          renderItem={this.getRowCells.bind(this, columns, sortBy, buildRowOptions, keys)}
          itemBuffer={20 * visibleItems}
          scrollDelay={visibleItems / 4} />
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
    let classes = classNames(this.props.className, 'flush-bottom');
    let columns = this.props.columns;
    let data = this.props.data;
    let sortBy = this.state.sortBy;
    let tableContent = null;

    let itemHeight = this.itemHeight || 0;
    let itemListHeight = itemHeight * data.length;

    // Can't grow beyond 80% of the viewport height
    let viewportHeight = 0.8 * DOMUtil.getViewportHeight();

    // Calculate the minimum of either the content or 80% of the window height
    let containerHeight = Math.min(itemListHeight, viewportHeight);

    // Use scroll table on first render to check if we need to scroll
    // and if content is bigger than its container
    if (itemHeight === 0 || itemListHeight > containerHeight) {
      tableContent = this.getScrollTable(columns, data, sortBy, containerHeight);
    } else {
      tableContent = this.getTable(columns, data, sortBy);
    }

    return (
      <div>
        <table className={classes}>
          {this.props.colGroup}
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
  sortBy: {}
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

  // Provide what attributes in the data make a row unique.
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Optional callback function when sorting is complete.
  onSortCallback: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  // Optional property to add transitions or turn them off. Default is off.
  // Only available for tables that does not scroll
  transition: PropTypes.bool
};
