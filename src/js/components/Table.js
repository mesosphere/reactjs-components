/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PropTypes = React.PropTypes;

function getCellValue(ref, row, sortBy) {
  var prop = ref.prop;
  var defaultContent = ref.defaultContent;
  var render = ref.render;
  // use the render function for the value.
  if (_.isFunction(render)) {
    return render(prop, row, sortBy);
  }
  // return `defaultContent` if the value is empty.
  if (!_.isEmpty(prop) && _.isEmpty(row[prop])) {
    return defaultContent;
  }
  // otherwise just return the value.
  return row[prop];
}

function getCellClass(ref, row, sortBy) {
  var prop = ref.prop;
  var className = ref.className || "";
  // prefer classname function
  if (_.isFunction(className)) {
    return className(prop, sortBy, row);
  }
  // if cell is empty add empty-cell class
  if (!_.isEmpty(prop) && _.isEmpty(row[prop]) ) {
    return "empty-cell";
  }
  // otherwise just return the className string
  return className;
}

function getHeaderRef(headers, c, index) {
  headers[index] = c.title;
  return headers[index];
}

function getHeaderClass(ref, sortBy) {
  var prop = ref.prop;
  var className = ref.headerClassName || "";
  if (_.isFunction(className)) {
    return className(prop, sortBy);
  }

  return className;
}

function buildSortProps(col, sortBy, handleSort) {
  var order = "none";
  if (sortBy.prop === col.prop) {
    order = sortBy.order;
  }

  var nextOrder = "desc";
  if (order === "desc") {
    nextOrder = "asc";
  }

  // sort state data with new sortBy properties
  var sortEvent = handleSort.bind(
    null,
    {prop: col.prop, order: nextOrder}
  );

  return {
    onClick: sortEvent,
    // prevents selection with mouse.
    onMouseDown: function (e) {
      return e.preventDefault();
    },
    tabIndex: 0,
    "aria-sort": order,
    "aria-label": col.title + ": activate to sort column " + nextOrder
  };
}

function getHeaders(columns, headers, sortBy, handleSort) {
  return _.map(columns, function (col, index) {
    var sortProps, order;
    // Only add sorting events if the column has a property and is sortable.
    if (col.sortable !== false && "prop" in col) {
      sortProps = buildSortProps(col, sortBy, handleSort);
      order = sortProps["aria-sort"];
    }

    var caretClassSet = React.addons.classSet({
      "caret": true,
      "dropup": order === "desc",
      "invisible": col.prop !== sortBy.prop
    });

    // need react functions here, because we are extending props
    return React.createElement(
      "th",
      _.extend({
        className: getHeaderClass(col, sortBy),
        ref: getHeaderRef(headers, headers, col, index),
        key: index
      }, sortProps),
      React.createElement(
        "span",
        null,
        col.title
      ),
      React.createElement(
        "span",
        {className: caretClassSet, "aria-hidden": "true"}
      )
    );
  });
}

function getRowColumns(row, sortBy, columns) {
  return _.map(columns, function(col, i) {
    return (
      <td key={i} className={getCellClass(col, row, sortBy)}>
        {getCellValue(col, row, sortBy)}
      </td>
    );
  }, this);
}

function sortData(data, sortBy, customSort) {
  if (_.isFunction(customSort) && _.isFunction(customSort(sortBy.prop))) {
    // use specfied sorting
    data = _.sortBy(data, customSort(sortBy.prop));
  } else {
    // use default sorting
    data = _.sortBy(data, sortBy.prop);
  }

  if (sortBy.order === "asc") {
    data.reverse();
  }

  return data;
}

function getRows(data, columns, keys, sortBy, buildRowOptions, context) {
  if (data.length === 0) {
    return (
      <tr>
        <td colSpan={columns.length} className="text-center">
          No data
        </td>
      </tr>
    );
  }

  return _.map(data, function (row) {
    // need react functions here, because we are extending props
    return React.createElement(
      "tr",
      _.extend({key: _.values(_.pick(row, keys))}, buildRowOptions(row, context)),
      getRowColumns(row, sortBy, columns)
    );
  });
}

var Table = React.createClass({

  displayName: "Table",

  actions_configuration: {
    state: {
      sortBy: function (value) {
        // {"prop":"name","order":"asc"}
        return "Changed " + Table.displayName +
          " to sort by " + value.prop + " in " + value.order + " direction";
      },
      headers: {skip: true}
    }
  },

  propTypes: {

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
        title: PropTypes.string.isRequired,
        width: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ])
      })
    ).isRequired,

    // data to display in the table
    // make sure to clone if data, cannot be modified!
    data: PropTypes.array.isRequired,

    // options to be passed to the rows
    buildRowOptions: PropTypes.func,

    sortBy: PropTypes.shape({
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      order: PropTypes.oneOf(["asc", "desc"])
    }),

    // custom sort function,
    // if function returns null it will fallback to default sorting
    sortFunc: PropTypes.func,

    // on sort callback function
    onSort: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      buildRowOptions: function () { return {}; },
      sortBy: {}
    };
  },

  getInitialState: function () {
    return {
      sortBy: this.props.sortBy,
      headers: []
    };
  },

  componentWillMount: function () {
    // do the initial sorting if specified
    this.handleSort();
  },

  componentDidMount: function () {
    // If no width was specified, then set the width that the browser applied
    // initially to avoid recalculating width between pages.
    var refs = this.refs;
    this.state.headers.forEach(function (header) {
      var thDom = refs[header].getDOMNode();
      if (!thDom.style.width) {
        thDom.style.width = thDom.offsetWidth + "px";
      }
    });
  },

  componentWillReceiveProps: function () {
    this.handleSort();
  },

  handleSort: function (sortBy) {
    // if nothing is passed to handle sort,
    // just sort the state data w. state sortBy
    sortBy = sortBy || this.state.sortBy;

    var onSort = this.props.onSort;

    if (!_.isEqual(this.state.sortBy, sortBy)) {
      this.setState({sortBy: sortBy});
    }

    if (_.isFunction(onSort)) {
      onSort(sortBy);
    }
  },

  render: function () {
    var buildRowOptions = this.props.buildRowOptions;
    var columns = this.props.columns;
    var keys = this.props.keys;
    var sortBy = this.state.sortBy;
    var sortedData = sortData(this.props.data, sortBy, this.props.sortFunc);

    return (
      <table className={this.props.className}>
        <thead>
          <tr>
            {getHeaders(columns, this.state.headers, sortBy, this.handleSort)}
          </tr>
        </thead>
        <tbody>
          {getRows(sortedData, columns, keys, sortBy, buildRowOptions, this)}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
