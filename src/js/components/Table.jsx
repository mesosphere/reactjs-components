/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PropTypes = React.PropTypes;

var _headers = [];

// creates a compare function with a property to sort on
function sortByFunc(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  };
}

// default sort function
function sort(sortBy, data, providedSortFunc) {
  // default sorting
  var sortFunc = sortByFunc(sortBy.prop);

  if (_.isFunction(providedSortFunc) &&
      _.isFunction(providedSortFunc(sortBy.prop))) {
    // use specfied sorting
    sortFunc = providedSortFunc(sortBy.prop);
  }

  var sortedData = data.sort(sortFunc);
  if (sortBy.order === "desc") {
    sortedData.reverse();
  }
  return sortedData;
}

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

function getHeaderRef(c, index) {
  _headers[index] = c.title;
  return _headers[index];
}

function getHeaderClass(ref, sortBy) {
  var prop = ref.prop;
  var className = ref.headerClassName || "";
  if (_.isFunction(className)) {
    return className(prop, sortBy);
  }

  return className;
}

function buildSortProps(col, sortBy, onSort, callback) {
  var order = "none";
  if (sortBy.prop === col.prop) {
    order = sortBy.order;
  }

  var nextOrder = "asc";
  if (order === "asc") {
    nextOrder = "desc";
  }

  var sortEvent = onSort.bind(
    null,
    {prop: col.prop, order: nextOrder},
    callback
  );

  return {
    onClick: sortEvent,
    // Fire the sort event on enter.
    onKeyDown: function (e) {
      if (e.keyCode === 13) {
        sortEvent();
      }
    },
    // Prevents selection with mouse.
    onMouseDown: function (e) {
      return e.preventDefault();
    },
    tabIndex: 0,
    "aria-sort": order,
    "aria-label": "" + col.title + ": activate to sort column " + nextOrder
  };
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

function getHeaders(columns, sortBy, onSort, callback) {
  return _.map(columns, function (col, index) {
    var sortProps, order;
    // Only add sorting events if the column has a property and is sortable.
    if (col.sortable !== false && "prop" in col) {
      sortProps = buildSortProps(col, sortBy, onSort, callback);
      order = sortProps["aria-sort"];
    }

    var caretClassSet = React.addons.classSet({
      "caret": true,
      "dropup": order === "asc",
      "invisible": col.prop !== sortBy.prop
    });

    // need react functions here, because we are extending props
    return React.createElement(
      "th",
      _.extend({
        className: getHeaderClass(col, sortBy),
        ref: getHeaderRef,
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

function getRows(data, columns, keys, sortBy, buildRowOptions) {
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
      _.extend({key: _.values(_.pick(row, keys))}, buildRowOptions(row)),
      getRowColumns(row, sortBy, columns)
    );
  });
}

var Table = React.createClass({

  displayName: "Table",

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
    dataArray: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
      ])
    ).isRequired,

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
      // Clone the initialData.
      data: this.props.dataArray.slice(0),
      sortBy: this.props.sortBy,
      onSort: this.onSort
    };
  },

  componentWillMount: function () {
    // Do the initial sorting if specified.
    var sortBy = this.state.sortBy;
    var data = this.state.data;
    if (sortBy != null) {
      this.setState({ data: sort(sortBy, data, this.props.sortFunc) });
    }
  },

  componentDidMount: function () {
    // If no width was specified, then set the width that the browser applied
    // initially to avoid recalculating width between pages.
    _headers.forEach(function (header) {
      var thDom = this.refs[header].getDOMNode();
      if (!thDom.style.width) {
        thDom.style.width = thDom.offsetWidth + "px";
      }
    }, this);
  },

  componentWillReceiveProps: function (props) {
    var sortBy = this.state.sortBy;
    var data = props.dataArray;
    if (sortBy != null) {
      this.setState({ data: sort(sortBy, data, props.sortFunc) });
    }
  },

  onSort: function (sortBy, callback) {
    var data = sort(sortBy, this.state.data, this.props.sortFunc);
    this.setState({
      sortBy: sortBy,
      data: data
    });

    if (_.isFunction(callback)) {
      callback(sortBy, data);
    }
  },

  render: function () {
    var data = this.state.data;
    var columns = this.props.columns;
    var keys = this.props.keys;
    var sortBy = this.state.sortBy;
    var buildRowOptions = this.props.buildRowOptions;
    var onSort = this.state.onSort;
    var callback = this.props.onSort;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className={this.props.className}>
        <thead>
          <tr>
            {getHeaders(columns, sortBy, onSort, callback)}
          </tr>
        </thead>
        <tbody>
          {getRows(data, columns, keys, sortBy, buildRowOptions)}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
