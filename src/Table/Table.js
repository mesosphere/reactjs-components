import React, {PropTypes} from 'react';
import _ from 'underscore';

function getHeaders(headers, sortBy, handleSort, context) {
  function buildSortProps(header) {
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

    // sort state data with new sortBy properties
    var sortEvent = handleSort.bind(
      context,
      {prop: header.prop, order: nextOrder}
    );

    return {
      onClick: sortEvent,
      onMouseDown: function(event) {
        event.preventDefault();
      },
      tabIndex: 0,
      'aria-sort': order,
      'aria-label': header.heading + ': activate to sort column ' + nextOrder
    };
  }

  return headers.map(function (header, index) {
    var sortProps, order, heading;
    // only add sorting events if the column has a value for 'prop'
    // and the 'sorting' property is true
    if (header.sortable !== false && 'prop' in header) {
      headingAttributes = buildSortProps(header);
      order = sortProps['aria-sort'];
    }

    // if the heading property is a method, then pass to it the options and
    // render the result. otherwise, display the value
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
}

function getRows(data, columns, keys, sortBy, buildRowOptions, context) {
  if (data.length === 0) {
    return (
      <tr>
        <td colspan={columns.length}>
          No data
        </td>
      </tr>
    );
  }

  return data.map(function(row) {
    // create the custom row attributes object, always with a key
    var rowAttributes = _.extend(
      {key: _.values(_.pick(row, keys))},
      buildRowOptions(row, context));

    // for each column in the data, output a cell in each row with the value
    // specified by the data prop
    var rowCells = columns.map(function(column, index) {
      var cellAttributes = column.attributes;
      var cellValue = row[column.prop];
      var cellClassName = column.className;

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

function sortData(data, sortBy, customSort) {
  if (_.isFunction(customSort) && _.isFunction(customSort(sortBy.prop))) {
    // use custom sort method if specified
    data = _.sortBy(data, customSort(sortBy.prop));
  } else {
    // otherwise use default sorting
    data = _.sortBy(data, sortBy.prop);
  }

  if (sortBy.order === 'asc') {
    data.reverse();
  }

  return data;
}

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
    // if no sorting paramters or method are specified, use what's in state
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
  buildRowOptions: function () { return {}; },
  sortBy: {}
};

Table.propTypes = {
  // provide what makes a table unique
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,

  // define how columns should be rendered and if they are sortable
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      defaultContent: PropTypes.string,
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      render: PropTypes.func,
      sortable: PropTypes.bool,
      heading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]).isRequired,
      attributes: React.PropTypes.object
    })
  ).isRequired,

  // optional colgroup component
  colGroup: PropTypes.object,

  // data to display in the table
  // make sure to clone if data, cannot be modified!
  data: PropTypes.array.isRequired,

  // attributes to be passed to the rows
  buildRowOptions: PropTypes.func,

  sortBy: PropTypes.shape({
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    order: PropTypes.oneOf(['asc', 'desc'])
  }),

  // custom sort function,
  // if function returns null it will fallback to default sorting
  sortFunc: PropTypes.func,

  // on sort callback function
  onSort: PropTypes.func
};
