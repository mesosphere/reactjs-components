import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import DOMUtil from "../Util/DOMUtil";
import Util from "../Util/Util";
import VirtualList from "../VirtualList/VirtualList";

const MAX_CACHE_SIZE = 10000;

const sortData = (columns, data, sortBy) => {
  if (sortBy.order === undefined || sortBy.prop === undefined) {
    return data;
  }

  let sortFunction;

  columns.forEach(column => {
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

  if (sortBy.order === "desc") {
    data.reverse();
  }

  return data;
};

const getClassName = (column, sortBy, data, columns) => {
  if (Util.isFunction(column.className)) {
    return column.className(column.prop, sortBy, data, columns);
  }

  return column.className || "";
};

class Table extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      sortBy: {}
    };
    this.cachedCells = {};
    this.cachedIDs = [];
    this.container = window;

    this.containerRef = React.createRef();
    this.headersRef = React.createRef();
    this.itemHeightContainer = React.createRef();
  }

  componentWillMount() {
    if (this.props.sortBy != null) {
      this.setState(
        { sortBy: this.props.sortBy },
        this.handleSort.bind(this, this.props.sortBy.prop, { toggle: false })
      );
    }
  }

  componentDidMount() {
    this.updateHeight();
  }

  componentWillReceiveProps() {
    this.updateHeight();

    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop, { toggle: false });
    }
  }

  checkFullCache() {
    if (this.cachedIDs.length < MAX_CACHE_SIZE) {
      return;
    }

    const lastID = this.cachedIDs.shift();
    delete this.cachedCells[lastID];
  }

  addToCache(id, element) {
    this.cachedCells[id] = element;
    this.cachedIDs.push(id);
    this.checkFullCache();
  }

  updateHeight() {
    const { props, state } = this;

    if (props.containerSelector && this.container === window) {
      this.container =
        DOMUtil.closest(ReactDOM.findDOMNode(this), props.containerSelector) ||
        window;
    }

    if (
      props.itemHeight == null &&
      state.itemHeight == null &&
      this.itemHeightContainer &&
      this.itemHeightContainer.current
    ) {
      // Calculate content height only once and when node is ready
      const itemHeight = DOMUtil.getComputedDimensions(
        ReactDOM.findDOMNode(this.itemHeightContainer.current).querySelector(
          "tr"
        )
      ).height;
      this.setState({ itemHeight });
    }
  }

  buildUniqueID(cellClassName, cellValue, prop) {
    return prop + cellClassName + cellValue;
  }

  getHeaders(headers, sortBy) {
    const buildSortAttributes = header => {
      const sortEvent = this.handleSort.bind(this, header.prop);

      return {
        onClick: sortEvent,
        tabIndex: 0,
        "aria-sort": this.state.sortBy.order,
        "aria-label": `${header.prop}: activate to sort column ${
          this.state.sortBy.order
        }`
      };
    };

    return headers.map((header, index) => {
      let order, heading;
      let attributes = {};

      // Only add sorting events if the column has a value for 'prop'
      // and the 'sorting' property is true.
      if (header.sortable !== false && "prop" in header) {
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
        header,
        this.state.sortBy,
        null,
        this.props.columns
      );
      attributes.key = index;

      return <th {...attributes}>{heading}</th>;
    });
  }

  getBufferItem(columns, styles) {
    return (
      <tr style={styles}>
        <td colSpan={columns.length} />
      </tr>
    );
  }

  getEmptyRowCell(columns) {
    return (
      <tr>
        <td colSpan={columns.length}>{this.props.emptyMessage}</td>
      </tr>
    );
  }

  getCellValue(row, prop, column) {
    const { getValue } = column;
    if (getValue && typeof getValue === "function") {
      return getValue(row, prop);
    }

    return row[prop];
  }

  getRowCells(columns, sortBy, buildRowOptions, row, rowIndex) {
    const rowCells = columns.map((column, index) => {
      let cellClassName = getClassName(column, sortBy, row, columns);
      const prop = column.prop;
      let cellValue = this.getCellValue(row, prop, column);
      let cellID;

      if (column.cacheCell === true) {
        cellID = this.buildUniqueID(cellClassName, cellValue, prop);
      }

      // Skip build cell if we have it memoized
      if (cellID === undefined || this.cachedCells[cellID] == null) {
        if (column.render) {
          cellValue = column.render(prop, row);
        }

        if (cellValue === undefined) {
          cellValue = column.defaultContent;
          cellClassName += " empty-cell";
        }

        const cellElement = (
          <td {...column.attributes} className={cellClassName} key={index}>
            {cellValue}
          </td>
        );

        if (!column.cacheCell) {
          return cellElement;
        }

        this.addToCache(cellID, cellElement);
      }

      return this.cachedCells[cellID];
    });

    return (
      <tr key={rowIndex} {...buildRowOptions(row, this)}>
        {rowCells}
      </tr>
    );
  }

  handleSort(prop, options) {
    const sortBy = this.state.sortBy;
    const onSortCallback = this.props.onSortCallback;
    options = Util.extend(
      {
        toggle: true
      },
      options
    );

    if (options.toggle) {
      let order;

      if (sortBy.order === "desc" || sortBy.prop !== prop) {
        order = "asc";
      } else {
        order = "desc";
      }

      this.setState({
        sortBy: { order, prop }
      });
    }

    if (Util.isFunction(onSortCallback)) {
      onSortCallback(sortBy);
    }
  }

  getTBody(columns, data, sortBy, itemHeight) {
    const buildRowOptions = this.props.buildRowOptions;
    let childToMeasure;

    if (itemHeight === 0 && data.length) {
      childToMeasure = this.getRowCells(
        columns,
        sortBy,
        buildRowOptions,
        data[0],
        -1
      );

      return <tbody ref={this.itemHeightContainer}>{childToMeasure}</tbody>;
    }

    if (data.length === 0) {
      return <tbody>{this.getEmptyRowCell(columns)}</tbody>;
    }

    return (
      <VirtualList
        className="table-virtual-list"
        container={this.container}
        itemBuffer={70}
        itemHeight={itemHeight}
        items={sortData(columns, data, sortBy)}
        renderBufferItem={this.getBufferItem.bind(this, columns)}
        renderItem={this.getRowCells.bind(
          this,
          columns,
          sortBy,
          buildRowOptions
        )}
        scrollDelay={200}
        tagName="tbody"
      />
    );
  }

  render() {
    const { props, state } = this;
    const { columns, data } = props;
    const classes = classNames(props.className, "flush-bottom");
    const sortBy = state.sortBy;
    const itemHeight = state.itemHeight || props.itemHeight || 0;

    return (
      <div ref={this.containerRef}>
        <table ref={this.headersRef} className={classes}>
          {props.colGroup}
          <thead>
            <tr>{this.getHeaders(columns, sortBy)}</tr>
          </thead>
          {this.getTBody(columns, data, sortBy, itemHeight)}
        </table>
      </div>
    );
  }
}

Table.defaultProps = {
  buildRowOptions: () => {
    return {};
  },
  sortBy: {},
  emptyMessage: "No data"
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
      // Attributes to pass down to each column item.
      attributes: PropTypes.object,

      // Class to give to each column item.
      // Can be a function to programmatically create a class.
      className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

      // Content to default to in the case of no data for the prop.
      defaultContent: PropTypes.string,

      // Enable caching of cells for better performance. Not cached by default.
      cacheCell: PropTypes.bool,

      // Function to render the header of the column. Can also be a string.
      // The arguments to the function will be:
      // prop (prop to sort by), order (asc/desc), sortBy (the sort function)
      heading: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,

      // What prop of the data object to use.
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

      // If true, the column will sort on column heading click.
      sortable: PropTypes.bool,

      // Custom sorting function. If this function returns null,
      // it will fallback to default sorting.
      sortFunction: PropTypes.func
    })
  ).isRequired,

  // Optional selector of the parent element that has a scrollbar in order to
  // listen to its scroll event.
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

  // Optional callback function when sorting is complete.
  onSortCallback: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(["asc", "desc"]),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

module.exports = Table;
