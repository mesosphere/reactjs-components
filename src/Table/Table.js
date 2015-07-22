import React, {PropTypes} from 'react';
import _ from 'underscore';

var getHeaders = (headers, sortBy, handleSort, context) => {
  var buildSortProps = (header) => {
    var order = 'none';
    if (sortBy.prop === header.prop) {
      order = sortBy.order;
    }

    var nextOrder;
    if (order === 'desc') {
      nextOrder = 'asc';
    } else {
      nextOrder = 'desc';
    }

    // Sort state data with new sortBy properties.
    var sortEvent = handleSort.bind(
      context,
      {prop: header.prop, order: nextOrder}
    );

    return {
      onClick: sortEvent,
      onMouseDown: (event) => {
        event.preventDefault();
      },
      tabIndex: 0,
      'aria-sort': order,
      'aria-label': header.heading + ': activate to sort column ' + nextOrder
    };
  };

  return headers.map((header, index) => {
    var headingAttributes, order, heading;
    // Only add sorting events if the column has a value for 'prop'
    // and the 'sorting' property is true.
    if (header.sortable !== false && 'prop' in header) {
      headingAttributes = buildSortProps(header);
      order = headingAttributes['aria-sort'];
    }

    // If the heading property is a method, then pass to it the options and
    // render the result. Otherwise, display the value.
    if (_.isFunction(header.heading)) {
      heading = header.heading(header.prop, order, sortBy);
    } else {
      heading = header.heading;
    }

    var attributes = _.extend({
      className: header.className,
      key: index
    }, headingAttributes);

    return <th {...attributes}>{heading}</th>;
  });
};

var getRows = (data, columns, keys, sortBy, buildRowOptions, context) => {
  if (data.length === 0) {
    return (
      <tr>
        <td colspan={columns.length}>
          No data
        </td>
      </tr>
    );
  }

  return data.map((row) => {
    // Create the custom row attributes object, always with a key.
    var rowAttributes = _.extend(
      {key: _.values(_.pick(row, keys))},
      buildRowOptions(row, context));

    // For each column in the data, output a cell in each row with the value
    // specified by the data prop.
    var rowCells = columns.map((column, index) => {
      var cellAttributes = column.attributes;
      var cellClassName = column.className;
      var cellValue = row[column.prop];

      if (_.isUndefined(cellValue)) {
        cellValue = column.defaultContent;
        cellClassName += ' empty-cell';
      }

      return (
        <td {...cellAttributes} className={cellClassName} key={index}>
          {cellValue}
        </td>
      );
    });

    return (
      <tr {...rowAttributes}>
        {rowCells}
      </tr>
    );
  });
};

var sortData = (data, sortBy, customSort) => {
  if (_.isFunction(customSort) && _.isFunction(customSort(sortBy.prop))) {
    // Use custom sort method if specified.
    data = _.sortBy(data, customSort(sortBy.prop));
  } else {
    // Otherwise, use default sorting.
    data = _.sortBy(data, sortBy.prop);
  }

  if (sortBy.order === 'asc') {
    data.reverse();
  }

  return data;
};

export default class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      sortBy: {}
    };
  }

  componentWillMount() {
    this.handleSort(this.props.sortBy);
  }

  componentWillReceiveProps() {
    this.handleSort();
  }

  handleSort(sortBy) {
    // If no sorting paramters or method are specified, use what's in state.
    sortBy = sortBy || this.state.sortBy;

    var onSort = this.props.onSort;

    if (!_.isEqual(this.state.sortBy, sortBy)) {
      this.setState({sortBy: sortBy});
    }

    if (_.isFunction(onSort)) {
      onSort(sortBy);
    }
  }

  render() {
    var buildRowOptions = this.props.buildRowOptions;
    var columns = this.props.columns;
    var keys = this.props.keys;
    var sortBy = this.state.sortBy;
    var sortedData = sortData(this.props.data, sortBy, this.props.sortFunc);

    return (
      <table className={this.props.className}>
        {this.props.colGroup}
        <thead>
          <tr>
            {getHeaders(columns, sortBy, this.handleSort, this)}
          </tr>
        </thead>
        <tbody>
          {getRows(sortedData, columns, keys, sortBy, buildRowOptions, this)}
        </tbody>
      </table>
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

  // Define how columns should be rendered and if they are sortable.
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: React.PropTypes.object,
      className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      defaultContent: PropTypes.string,
      heading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]).isRequired,
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      render: PropTypes.func,
      sortable: PropTypes.bool
    })
  ).isRequired,

  // Data to display in the table.
  // Make sure to clone the data, cannot be modified!
  data: PropTypes.array.isRequired,

  // Optional colgroup component.
  colGroup: PropTypes.object,

  // Provide what attributes in the data make a row unique.
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Optional callback function when sorting is complete.
  onSort: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  // Custom sorting function. If this function returns null,
  // it will fallback to default sorting.
  sortFunc: PropTypes.func
};
