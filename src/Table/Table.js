import React, {PropTypes} from 'react';
import Util from '../Util/Util';

var sortData = (columns, data, sortBy) => {
  if (sortBy.order === undefined || sortBy.prop === undefined) {
    return data;
  }

  var sortFunction;

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

  componentWillReceiveProps() {
    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop);
    }
  }

  getHeaders(headers, sortBy) {
    var buildSortProps = (header) => {
      var sortEvent = this.handleSort.bind(this, header.prop);
      return {
        onClick: sortEvent,
        tabIndex: 0,
        'aria-sort': this.state.sortBy.order,
        'aria-label': `${header.prop}: activate to sort column ${this.state.sortBy.order}`
      };
    };

    return headers.map((header, index) => {
      var order, heading;
      var attributes = {};

      // Only add sorting events if the column has a value for 'prop'
      // and the 'sorting' property is true.
      if (header.sortable !== false && 'prop' in header) {
        attributes = buildSortProps(header);
        order = this.state.sortBy.order;
      }

      // If the heading property is a method, then pass to it the options and
      // render the result. Otherwise, display the value.
      if (Util.isFunction(header.heading)) {
        heading = header.heading(header.prop, order, sortBy);
      } else {
        heading = header.heading;
      }

      attributes.className = header.className;
      attributes.key = index;

      return (
        <th {...attributes}>
          {heading}
        </th>
      );
    });
  }

  getRows(data, columns, keys, sortBy, buildRowOptions) {
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
      var rowAttributes = Util.extend(
        {key: Util.values(Util.pick(row, keys))},
        buildRowOptions(row, this));

      // For each column in the data, output a cell in each row with the value
      // specified by the data prop.
      var rowCells = columns.map((column, index) => {
        var cellAttributes = column.attributes;
        var cellClassName = column.className || '';
        var cellValue = row[column.prop];

        if (cellValue === undefined) {
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
  }

  handleSort(prop) {
    var sortBy = this.state.sortBy;
    var onSort = this.props.onSort;
    var order;

    if (sortBy.order === 'desc') {
      order = 'asc';
    } else {
      order = 'desc';
    }

    this.setState({
      sortBy: {
        order: order,
        prop: prop
      }
    });

    if (Util.isFunction(onSort)) {
      onSort(sortBy);
    }
  }

  render() {
    var buildRowOptions = this.props.buildRowOptions;
    var columns = this.props.columns;
    var data = this.props.data;
    var keys = this.props.keys;
    var sortBy = this.state.sortBy;
    var sortedData = sortData(columns, data, sortBy);

    var headers = this.getHeaders(columns, sortBy);
    var rows = this.getRows(sortedData, columns, keys, sortBy, buildRowOptions);

    return (
      <table className={this.props.className}>
        {this.props.colGroup}
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows}
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

  // Optional colgroup component.
  colGroup: PropTypes.object,

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
  onSort: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })

};
