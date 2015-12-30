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

let getClassName = (column, sortBy, data, columns) => {
  if (Util.isFunction(column.className)) {
    return column.className(
      column.prop, sortBy, data, columns
    );
  }

  return column.className || '';
};

class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      sortBy: {}
    };
    this.cachedCells = {};
    this.cachedIDs = [];
    this.container = window;
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
    let {props, state, refs} = this;

    if (props.containerSelector && this.container === window) {
      this.container = DOMUtil.closest(
        React.findDOMNode(this), props.containerSelector
      );
    }

    if (props.itemHeight == null &&
      state.itemHeight == null &&
      refs.itemHeightContainer != null) {
      // Calculate content height only once and when node is ready
      let itemHeight = DOMUtil.getComputedDimensions(
        React.findDOMNode(refs.itemHeightContainer).querySelector('tr')
      ).height;
      this.setState({itemHeight});
    }
  }

  buildUniqueID(cellClassName, cellValue, prop) {
    return prop + cellClassName + cellValue;
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

      attributes.className = getClassName(
        header, this.state.sortBy, null, this.props.columns
      );
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

  getRowCells(columns, sortBy, buildRowOptions, idAttribute, row) {
    let id = row[idAttribute];

    let rowCells = columns.map((column, index) => {
      let cellClassName = getClassName(column, sortBy, row, columns);
      let prop = column.prop;
      let cellValue = row[prop];
      let cellID;

      if (!column.dontCache) {
        cellID = this.buildUniqueID(cellClassName, cellValue, prop);
      }

      // Skip build cell if we have it memoized
      if (cellID === undefined || this.cachedCells[cellID] == null) {
        if (column.render) {
          cellValue = column.render(prop, row);
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

  getTBody(columns, data, sortBy, itemHeight, idAttribute) {
    let buildRowOptions = this.props.buildRowOptions;
    let childToMeasure;

    if (itemHeight === 0 && data.length) {
      childToMeasure = this.getRowCells(columns, sortBy, buildRowOptions, idAttribute, data[0]);
      return (
        <tbody ref="itemHeightContainer">
          {childToMeasure}
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          {this.getEmptyRowCell(columns)}
        </tbody>
      );
    }

    return (
      <VirtualList
        container={this.container}
        itemBuffer={70}
        itemHeight={itemHeight}
        items={sortData(columns, data, sortBy)}
        renderBufferItem={this.getBufferItem.bind(this, columns)}
        renderItem={this.getRowCells.bind(this, columns, sortBy, buildRowOptions, idAttribute)}
        scrollDelay={200}
        tagName="tbody" />
    );
  }

  render() {
    let {props, state} = this;
    let {columns, data, idAttribute} = props;
    let classes = classNames(props.className, 'flush-bottom');
    let sortBy = state.sortBy;
    let itemHeight = state.itemHeight || props.itemHeight || 0;

    return (
      <div ref="container">
        <table ref="headers" className={classes}>
          {props.colGroup}
          <thead>
            <tr>
              {this.getHeaders(columns, sortBy)}
            </tr>
          </thead>
          {this.getTBody(columns, data, sortBy, itemHeight, idAttribute)}
        </table>
      </div>
    );
  }
}

Table.defaultProps = {
  buildRowOptions: () => { return {}; },
  sortBy: {},
  emptyMessage: 'No data'
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
      // Column cached by default; disable with this setting.
      dontCache: PropTypes.bool,
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

  // Optional selector to use as container.
  containerSelector: PropTypes.string,

  // Data to display in the table.
  // Make sure to clone the data, cannot be modified!
  data: PropTypes.array.isRequired,

  // Text to show if there is no data.
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
  })
};

module.exports = Table;
