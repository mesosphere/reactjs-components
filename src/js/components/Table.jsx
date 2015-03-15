/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PropTypes = React.PropTypes;

/**
 * Creates a compare function with a property to sort on.
 *
 * @param {string} prop Property to sort.
 * @return {function(object, object)} Compare function.
 */
function sortByFunc(prop) {
  return function (a, b) {
    return a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;
  };
}

/**
 * @param {object} sortBy Object containing `prop` and `order`.
 * @param {array} data Array to sort.
 * @return {array} Sorted array.
 */
function sort(sortBy, data, providedSortFunc) {
  var sortFunc = _.isFunction(providedSortFunc)  &&
    !_.isEmpty(providedSortFunc(sortBy.prop)) ?
      // use specfied sorting
      providedSortFunc(sortBy.prop) :
      // fallback to default sorting
      sortByFunc(sortBy.prop);

  var sortedData = data.sort(sortFunc);
  if (sortBy.order === "desc") {
    sortedData.reverse();
  }
  return sortedData;
}

var simpleGet = function (key) {
  return function (data) {
    return data[key];
  };
};

var keyGetter = function (keys) {
  return function (data) {
    return keys.map(function (key) {
      return data[key];
    });
  };
};

var getCellValue = function (ref, row, sortBy) {
  var prop = ref.prop;
  var defaultContent = ref.defaultContent;
  var render = ref.render;
  return (
    // Use the render function for the value.
    render ? render(prop, row, sortBy) :
    !_.isEmpty(prop) && _.isEmpty(row[prop]) ?
    // Return `defaultContent` if the value is empty.
    defaultContent :
    // Otherwise just return the value.
    row[prop]
  );
};

var getCellClass = function (ref, row, sortBy) {
  var prop = ref.prop;
  var className = ref.className;
  return !_.isEmpty(prop) && _.isEmpty(row[prop]) && !_.isFunction(ref.render) ?
    "empty-cell" : _.isFunction(className) ?
      className(prop, row, sortBy) : className;
};

var getHeaderClass = function (ref, sortBy) {
  var prop = ref.prop;
  var className = ref.headerClassName || "";
  return _.isFunction(className) ?
      className(prop, sortBy) : className;
};

function buildSortProps(col, sortBy, onSort, callback) {
  var order = sortBy.prop === col.prop ? sortBy.order : "none";
  var nextOrder = order === "asc" ? "desc" : "asc";
  var sortEvent = onSort.bind(null, { prop: col.prop, order: nextOrder }, callback);

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

var Table = React.createClass({

  displayName: "Table",

  propTypes: {

    keys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]).isRequired,

    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func,
        sortable: PropTypes.bool,
        defaultContent: PropTypes.string,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      })
    ).isRequired,

    dataArray: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
      ])
    ).isRequired,

    buildRowOptions: PropTypes.func,

    sortBy: PropTypes.shape({
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      order: PropTypes.oneOf(["asc", "desc"])
    }),

    sortFunc: PropTypes.func,

    onSort: PropTypes.func
  },

  _headers: [],

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
    this._headers.forEach(function (header) {
      var thDom = React.findDOMNode(header);
    });
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

  getRowColumns: function (row, sortBy) {
    return _.map(this.props.columns, function(col, i) {
      return (
        <td key={i} className={getCellClass(col, row, sortBy)}>
          {getCellValue(col, row, sortBy)}
        </td>
      );
    }, this);
  },

  getHeaders: function () {
    var sortBy = this.state.sortBy;
    var onSort = this.state.onSort;
    var callback = this.props.onSort;

    return _.map(this.props.columns, function (col, idx) {
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

      var headerClassSet = React.addons.classSet({
        "highlighted": col.prop === sortBy.prop
      });

      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <th
          className={getHeaderClass(col, sortBy)}
          ref={function (c) {
            this._headers[idx] = c;
            return this._headers[idx];
          }}
          key={idx}
          {...sortProps}>
          <span>{col.title}</span>
          <span className={caretClassSet} aria-hidden="true" />
        </th>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  getRows: function () {
    var data = this.state.data;
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={this.props.columns.length} className="text-center">
            No data
          </td>
        </tr>
      );
    }

    var keys = this.props.keys;
    var getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    var buildRowOptions = this.props.buildRowOptions;
    return _.map(data, function (row) {
      return (
        <tr key={getKeys(row)} {...buildRowOptions(row)}>
          {this.getRowColumns(row, this.state.sortBy)}
        </tr>
      );
    }, this);
  },

  render: function () {
    var sortBy = this.state.sortBy;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className={this.props.className}>
        <thead>
          <tr>
            {this.getHeaders()}
          </tr>
        </thead>
        <tbody>
          {this.getRows()}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
