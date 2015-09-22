import React, {PropTypes} from 'react/addons';
import * as Util from '../Util/Util';

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
      this.handleSort(this.props.sortBy.prop, {toggle: false});
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

  getRows(data, columns, keys, buildRowOptions) {
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
      let rowAttributes = Util.extend(
        {key: Util.values(Util.pick(row, keys))},
        buildRowOptions(row, this));

      // For each column in the data, output a cell in each row with the value
      // specified by the data prop.
      let rowCells = columns.map((column, index) => {
        let cellAttributes = column.attributes;
        let cellClassName = getClassName(column, this.state.sortBy, row);

        let cellValue = row[column.prop];

        if (column.render) {
          cellValue = column.render(column.prop, row);
        }

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

  render() {
    let buildRowOptions = this.props.buildRowOptions;
    let columns = this.props.columns;
    let data = this.props.data;
    let keys = this.props.keys;
    let sortBy = this.state.sortBy;
    let sortedData = sortData(columns, data, sortBy);

    let headers = this.getHeaders(columns, sortBy);
    let rows = this.getRows(sortedData, columns, keys, buildRowOptions);
    let tbody;

    if (this.props.transition === true) {
      tbody = (
        <CSSTransitionGroup component="tbody" transitionName="table-row">
          {rows}
        </CSSTransitionGroup>
      );
    } else {
      tbody = (
        <tbody>
          {rows}
        </tbody>
      );
    }

    return (
      <table className={this.props.className}>
        {this.props.colGroup}
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        {tbody}
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
  transition: PropTypes.bool

};
