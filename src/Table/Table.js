import classNames from 'classnames';
import DOMUtil from '../Util/DOMUtil';
import React, {PropTypes} from 'react/addons';
import Util from '../Util/Util';
import VirtualList from '../VirtualList/VirtualList';

const MAX_CACHE_SIZE = 10000;

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
    this.cachedCells = {};
    this.cachedIDs = [];
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

  checkFullCache() {
    if (this.cachedIDs.length < MAX_CACHE_SIZE) {
      return;
    }

    let lastID = this.cachedIDs.shift();
    delete this.cachedCells[lastID];
  }

  addToCache(id, element) {
    this.cachedCells[id] = element;
    this.cachedIDs.push(id);
    this.checkFullCache();
  }

  updateHeight() {
    let {state, refs} = this;

    // Calculate content height only once and when node is ready
    if (this.props.itemHeight == null && state.itemHeight == null &&
      refs.itemHeightContainer != null) {
      let itemHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(refs.itemHeightContainer).querySelector('tr')
      ).height;

      this.setState({itemHeight});
    }
  }

  buildUniqueID(cellClassName, cellValue, column) {
    return column.prop + cellClassName + cellValue;
  }

  buildSortAttributes(header) {
    let sortEvent = this.handleSort.bind(this, header.prop);
    return {
      onClick: sortEvent,
      tabIndex: 0,
      'aria-sort': this.state.sortBy.order,
      'aria-label':
        `${header.prop}: activate to sort column ${this.state.sortBy.order}`
    };
  }

  getHeaders(headers, sortBy) {
    return headers.map((header, index) => {
      let order, heading;
      let attributes = {};

      // Only add sorting events if the column has a value for 'prop'
      // and the 'sorting' property is true.
      if (header.sortable !== false && 'prop' in header) {
        attributes = this.buildSortAttributes(header);
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
          {this.props.emptyMessage}
        </td>
      </tr>
    );
  }

  getRow(columns, sortBy, buildRowOptions, idAttribute, row) {
    let id = row[idAttribute];

    let rowCells = columns.map((column, index) => {
      let cellClassName = getClassName(column, sortBy, row, columns.length);
      let cellValue = row[column.prop];
      let cellID;

      if (!column.dontCache) {
        cellID = this.buildUniqueID(cellClassName, cellValue, column);
      }

      // Skip build cell if we have it memoized
      if (cellID === undefined || this.cachedCells[cellID] == null) {
        if (column.render) {
          cellValue = column.render(column.prop, row);
        }

        if (cellValue === undefined) {
          cellValue = column.defaultContent;
          cellClassName += ' empty-cell';
        }

        let cellElement = (
          <td {...column.attributes} className={cellClassName} key={index}>
            {cellValue}
          </td>
        );

        if (column.dontCache) {
          return cellElement;
        }

        this.addToCache(cellID, cellElement);
      }

      return this.cachedCells[cellID];
    });

    return (
      <tr key={id} {...buildRowOptions(row, this)}>
        {rowCells}
      </tr>
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

  getEmptyTable(columns) {
    return (
      <tbody>
        {this.getEmptyRowCell(columns)}
      </tbody>
    );
  }

  getMeasuringTable(columns, sortBy, buildRowOptions, idAttribute, data) {
    return (
      <tbody ref="itemHeightContainer">
        {
          this.getRow(
            columns, sortBy, buildRowOptions, idAttribute, data
          )
        }
      </tbody>
    );
  }

  getTBody() {
    let {state, props} = this;
    let {columns, data, idAttribute, buildRowOptions} = props;
    let sortBy = state.sortBy;

    let itemHeight = state.itemHeight || props.itemHeight || 0;

    // Render first item only to measure the height later on.
    if (itemHeight === 0 && data.length) {
      return this.getMeasuringTable(
        columns, sortBy, buildRowOptions, idAttribute, data[0]
      );
    }

    if (data.length === 0) {
      return this.getEmptyTable(columns);
    }

    // itemBuffer and scrollDelay is based on number of visible items
    // with a max value cutoff.
    return (
      <VirtualList
        container={window}
        itemBuffer={200}
        itemHeight={itemHeight}
        items={sortData(columns, data, sortBy)}
        renderBufferItem={this.getBufferItem.bind(this, columns)}
        renderItem={
          this.getRow.bind(
            this, columns, sortBy, buildRowOptions, idAttribute
          )
        }
        scrollDelay={100}
        tagName="tbody" />
    );
  }

  render() {
    let props = this.props;
    let sortBy = this.state.sortBy;
    let columns = props.columns;
    let classes = classNames(props.className, 'flush-bottom');

    return (
      <table ref="headers" className={classes}>
        {props.colGroup}
        <thead>
          <tr>
            {this.getHeaders(columns, sortBy)}
          </tr>
        </thead>
        {this.getTBody()}
      </table>
    );
  }
}

Table.defaultProps = {
  buildRowOptions: () => { return {}; },
  emptyMessage: 'No data',
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

  emptyMessage: PropTypes.string,

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
  transition: PropTypes.bool
};
