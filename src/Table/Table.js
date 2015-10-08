import VirtualList from '../VirtualList/VirtualList';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, {PropTypes} from 'react/addons';
import DOMUtil from '../Util/DOMUtil';
import Util from '../Util/Util';

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

  componentDidMount() {
    if (this.props.contentMaxHeight) {
      this.updateHeight();
      this.forceUpdate();
    }
  }

  componentWillReceiveProps() {
    if (this.props.contentMaxHeight) {
      this.updateHeight();
    }
    if (this.props.sortBy.prop) {
      this.handleSort(this.props.sortBy.prop, {toggle: false});
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data !== nextProps.data;
  }

  updateHeight() {
    this.containerNode = React.findDOMNode(this.refs.virtualContainer.refs['scroll-view']);
    // let dimensions = DOMUtil.getComputedDimensions(React.findDOMNode(this.refs.tableBody));
    // this.currentHeight = dimensions.height;
    // this.currentWidth = dimensions.width;
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

  getRowCells(columns, sortBy, buildRowOptions, keys, row) {
    // console.log(columns, sortBy, row);
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
      return (
        <tr>
          <td colSpan={columns.length}>
            No data
          </td>
        </tr>
      );
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

  render() {
    let buildRowOptions = this.props.buildRowOptions;
    let columns = this.props.columns;
    let contentMaxHeight = this.props.contentMaxHeight;
    let keys = this.props.keys;
    let sortBy = this.state.sortBy;
    let sortedData = sortData(columns, this.props.data, sortBy);

    // let tableBody = null;

    let tableContents = null;
    // Wrap another table in scrolling div,
    // when higher than specified max height
    if (this.containerNode) {
      let visibleItems = contentMaxHeight / 41;
      tableContents = (
        <table className={this.props.className + " flush-bottom"}>
          {this.props.colGroup}
          <VirtualList
            items={sortedData}
            container={this.containerNode}
            itemHeight={41}
            tagName="tbody"
            renderBufferItem={this.getBufferItem.bind(this, columns)}
            renderItem={this.getRowCells.bind(this, columns, sortBy, buildRowOptions, keys)}
            itemBuffer={20 * visibleItems}
            scrollDelay={visibleItems / 4} />
        </table>
      );
    }

    if (this.props.transition === true) {
      tableContents = (
        <CSSTransitionGroup
          component="tbody"
          transitionName="table-row"
          ref="tableBody">
          {tableContents}
        </CSSTransitionGroup>
      );
    }

    return (
      <div>
        <table className={this.props.className + " flush-bottom"}>
          {this.props.colGroup}
          <thead>
            <tr>
              {this.getHeaders(columns, sortBy)}
            </tr>
          </thead>
        </table>
        <GeminiScrollbar ref="virtualContainer" autoshow={true} style={{height: `${contentMaxHeight}px`, overflow: 'auto'}}>
          {tableContents}
        </GeminiScrollbar>
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

  // Maximum height in pixels
  contentMaxHeight: PropTypes.number,

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
