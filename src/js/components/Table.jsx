/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PropTypes = React.PropTypes;

var _headers = [];

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

function buildSortProps(col, sortBy, handleSort) {
  var order = "none";
  if (sortBy.prop === col.prop) {
    order = sortBy.order;
  }

  var nextOrder = "asc";
  if (order === "asc") {
    nextOrder = "desc";
  }

  // sort state data with new sortBy properties
  var sortEvent = handleSort.bind(
    null,
    null,
    {prop: col.prop, order: nextOrder}
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

function getHeaders(columns, sortBy, handleSort) {
  return _.map(columns, function (col, index) {
    var sortProps, order;
    // Only add sorting events if the column has a property and is sortable.
    if (col.sortable !== false && "prop" in col) {
      sortProps = buildSortProps(col, sortBy, handleSort);
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

function getRowColumns(row, sortBy, columns) {
  return _.map(columns, function(col, i) {
    return (
      <td key={i} className={getCellClass(col, row, sortBy)}>
        {getCellValue(col, row, sortBy)}
      </td>
    );
  }, this);
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
      // clone the initial data
      data: this.props.dataArray.slice(0),
      sortBy: this.props.sortBy
    };
  },

  componentWillMount: function () {
    // do the initial sorting if specified
    this.handleSort();
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
      // clone new data
    this.handleSort(props.dataArray.slice(0));
  },

  handleSort: function (data, sortBy) {
    // if nothing is passed to handle sort,
    // just sort the state data w. state sortBy
    /* jshint -W030 */
    data || (data = this.state.data);
    sortBy || (sortBy = this.state.sortBy);
    /* jshint +W030 */

    var customSort = this.props.customSort;
    var onSort = this.props.onSort;

    var sortedData;
    if (_.isFunction(customSort)) {
      // use specfied sorting
      sortedData = _.sortBy(data, customSort);
    } else {
      // use default sorting
      sortedData = _.sortBy(data, sortBy.prop);
    }

    if (sortBy.order === "desc") {
      sortedData.reverse();
    }

    this.setState({
      sortBy: sortBy,
      data: sortedData
    });

    if (_.isFunction(onSort)) {
      onSort(sortBy, sortedData);
    }
  },

  render: function () {
    var buildRowOptions = this.props.buildRowOptions;
    var columns = this.props.columns;
    var keys = this.props.keys;
    var sortBy = this.state.sortBy;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className={this.props.className}>
        <thead>
          <tr>
            {getHeaders(columns, sortBy, this.handleSort)}
          </tr>
        </thead>
        <tbody>
          {getRows(this.state.data, columns, keys, sortBy, buildRowOptions)}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
