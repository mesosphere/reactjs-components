import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';
import ReactDOM from 'react-dom';

import Table from '../../../src/Table/Table.js';

function compareValues(a, b) {
  if (b == null || a > b) {
    return 1;
  } else if (a == null || a < b) {
    return -1;
  } else {
    return 0;
  }
}

function getSortFunction(tieBreaker) {
  return function (prop) {
    return function (a, b) {
      if (a[prop] === b[prop]) {
        return compareValues(a[tieBreaker], b[tieBreaker]);
      }

      return compareValues(a[prop], b[prop]);
    };
  };
}

let rows = [
  {
    name: 'Zach',
    age: 11,
    gender: 'Male',
    location: 'SF, CA',
    id: 'a'
  },
  {
    name: 'Francis',
    age: 34,
    gender: 'Female',
    location: 'Boston, MA',
    id: 'b'
  },
  {
    name: 'Sandy',
    age: 68,
    gender: 'Female',
    location: 'Kalamazoo, MI',
    id: 'c'
  },
  {
    name: 'Jeffrey',
    age: 21,
    gender: 'Male',
    id: 'd'
  },
  {
    name: 'Louise',
    age: 94,
    gender: 'Female',
    location: 'Boulder, CO',
    id: 'e'
  },
  {
    name: 'Nancy',
    age: 28,
    gender: 'Female',
    location: 'Salt Lake, UT',
    id: 'f'
  },
  {
    name: 'Anna',
    age: 63,
    gender: 'Female',
    location: 'Las Vegas, NV',
    id: 'g'
  },
  {
    name: 'Jay',
    age: 35,
    gender: 'Male',
    location: 'Washington, DC',
    id: 'h'
  },
  {
    name: 'Bob',
    age: 47,
    gender: 'Male',
    location: 'New Oleans, LA',
    id: 'i'
  },
  {
    name: 'Nick',
    age: 51,
    gender: 'Male',
    location: 'Houston, TX',
    id: 'j'
  }
];

class TableExample extends React.Component {
  constructor(props) {
    super(props);

    // Cache huge rows so we don't recreate the data every update.
    this.hugeRows = this.getManyRows();
  }

  componentDidMount() {
    this.forceUpdate();
  }

  getColumnHeading(prop, order, sortBy) {
    let caretClassNames = classNames({
      'caret': true,
      'caret--asc': order === 'asc',
      'caret--desc': order === 'desc',
      'caret--visible': sortBy.prop === prop
    });

    let headingStrings = {
      'age': 'Age',
      'gender': 'Gender',
      'location': 'Location',
      'name': 'Name'
    };

    return (
      <span>
        {headingStrings[prop]}
        <span className={caretClassNames}></span>
      </span>
    );
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '40%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
      </colgroup>
    );
  }

  getColumns() {
    return [
      {
        className: 'name',
        heading: this.getColumnHeading,
        prop: 'name',
        sortable: true
        // Using default sorting.
        // Uncomment this to use age as tie breaker for name
        // sortFunction: getSortFunction('age')
      },
      {
        cacheCell: true,
        className: 'age',
        heading: this.getColumnHeading,
        prop: 'age',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        cacheCell: true,
        className: 'location',
        defaultContent: 'None Specified',
        heading: this.getColumnHeading,
        prop: 'location',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        cacheCell: true,
        className: 'gender',
        heading: this.getColumnHeading,
        prop: 'gender',
        sortable: true,
        sortFunction: getSortFunction('name')
      }
    ];
  }

  getRows() {
    return rows.slice(0);
  }

  getManyRows() {
    let oldRows = rows.slice(0);
    let newRows = [];
    for (var i = 0; i < 10000; i++) {
      let item = oldRows[Math.floor(Math.random() * oldRows.length)];
      newRows.push({
        name: item.name,
        age: item.age,
        gender: item.gender,
        location: item.location,
        id: i
      });
    }

    return newRows;
  }

  render() {
    return (
      <div>
        <section className="row canvas-pod">
          <div className="flush-bottom">
            <h2>Tables</h2>
            <p>This is a Table component that allows for displaying data in a structured way. Smart enough, while handling extremely large amounts of data, to only display the rows needed (à la infinite scroll). If no item height is passed, table will first render one row to measure</p>
            <p>View component source <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Table/Table.js">here</a>. View full example source <a href="https://github.com/mesosphere/reactjs-components/blob/master/docs/src/Table/index.js">here</a>.</p>
            <h3>Properties API</h3>
            <div className="example-block">
              <pre className="prettyprint linenums flush-bottom">
{`Table.propTypes = {
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
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),

      // Content to default to in the case of no data for the prop.
      defaultContent: PropTypes.string,

      // Enable caching of cells for better performance. Not cached by default.
      cacheCell: PropTypes.bool,

      // Function to render the header of the column. Can also be a string.
      // The arguments to the function will be:
      // prop (prop to sort by), order (asc/desc), sortBy (the sort function)
      heading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]).isRequired,

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
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};`}
              </pre>
            </div>
            <h3>A Closer Look At Table Columns</h3>
            <p>Columns are an important piece of this component. The following columns are used for all of the example Tables on this page.</p>
            <div className="example-block">
              <pre className="prettyprint linenums flush-bottom">
{`getColumns() {
  // We want to pass an array of objects.
  // Each object should contain information about the settings for that column.
  return [
    // The first column will be a "name" column.
    {
      className: 'name',
      heading: this.getColumnHeading,
      prop: 'name',
      sortable: true

      // Using default sorting function.
      // Uncomment this to use age as tie breaker for name
      // sortFunction: getSortFunction('age')
    },
    {
      cacheCell: true,
      className: 'age',
      heading: this.getColumnHeading,
      prop: 'age',
      sortable: true,
      sortFunction: getSortFunction('name')
    },
    {
      cacheCell: true,
      className: 'location',
      defaultContent: 'None Specified',
      heading: this.getColumnHeading,
      prop: 'location',
      sortable: true,
      sortFunction: getSortFunction('name')
    },
    {
      cacheCell: true,
      className: 'gender',
      heading: this.getColumnHeading,
      prop: 'gender',
      sortable: true,
      sortFunction: getSortFunction('name')
    }
  ];
}

<Table
  //...
  columns={this.getColumns()} />

`}
              </pre>
            </div>
            <h3>Examples</h3>
            <div className="example-block flush-bottom">
              <div className="example-block-content">
                <div className="container-pod-short
                  flush-top row row-flex">
                  <div className="column-9">
                    <p>A simple example table.</p>
                  </div>
                </div>
                <Table
                  className="table flush-bottom"
                  colGroup={this.getColGroup()}
                  columns={this.getColumns()}
                  data={this.getRows('large')} />
              </div>
              <div className="example-block-footer example-block-footer-codeblock">
                <pre className="prettyprint linenums flush-bottom">
{`import {Table} from 'reactjs-components';
import React from 'react';

function compareValues(a, b) {
  if (b == null || a > b) {
    return 1;
  } else if (a == null || a < b) {
    return -1;
  } else {
    return 0;
  }
}

function getSortFunction(tieBreaker) {
  return function (prop) {
    return function (a, b) {
      if (a[prop] === b[prop]) {
        return compareValues(a[tieBreaker], b[tieBreaker]);
      }

      return compareValues(a[prop], b[prop]);
    };
  };
}

let rows = [
  {
    name: 'Zach',
    age: 11,
    gender: 'Male',
    location: 'San Francisco, CA',
    id: 'a'
  },
  {
    name: 'Francis',
    age: 34,
    gender: 'Female',
    location: 'Boston, MA',
    id: 'b'
  },
  //...
];

class TableExample extends React.Component {
  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '40%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
      </colgroup>
    );
  }

  getColumns() {
    return [
      {
        className: 'name',
        heading: this.getColumnHeading,
        prop: 'name',
        sortable: true
        // Using default sorting.
        // Uncomment this to use age as tie breaker for name
        // sortFunction: getSortFunction('age')
      },
      {
        className: 'age',
        heading: this.getColumnHeading,
        prop: 'age',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        className: 'location',
        defaultContent: 'None Specified',
        heading: this.getColumnHeading,
        prop: 'location',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        className: 'gender',
        heading: this.getColumnHeading,
        prop: 'gender',
        sortable: true,
        sortFunction: getSortFunction('name')
      }
    ];
  }

  getRows() {
    return rows.slice(0);
  }

  render() {
    return (
      <Table
        className="table"
        colGroup={this.getColGroup()}
        columns={this.getColumns()}
        data={this.getRows()} />
    );
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>
        <section className="row canvas-pod">
          <div>
            <h4>Infinite Scroll Example</h4>
            <div className="example-block flush-bottom">
              <div className="example-block-content">
                <div className="row row-flex">
                  <div className="column-12">
                    <p>
                      Here is a scroll table with 10k items. Use the
                      "containerSelector" property to indicate the parent
                      element with a scrollbar in order to listen to its scroll
                      event. The data is not sorted by default.
                    </p>
                  </div>
                </div>
                <GeminiScrollbar
                  autoshow={true}
                  className="container-scrollable"
                  style={{height: 800}}>
                  <Table
                    className="table"
                    colGroup={this.getColGroup()}
                    columns={this.getColumns()}
                    data={this.hugeRows}
                    containerSelector=".gm-scroll-view" />
                </GeminiScrollbar>
              </div>
              <div className="example-block-footer example-block-footer-codeblock">
                <pre className="prettyprint linenums flush-bottom">
{`import {Table} from 'reactjs-components';
import React from 'react';

function compareValues(a, b) {
  if (b == null || a > b) {
    return 1;
  } else if (a == null || a < b) {
    return -1;
  } else {
    return 0;
  }
}

function getSortFunction(tieBreaker) {
  return function (prop) {
    return function (a, b) {
      if (a[prop] === b[prop]) {
        return compareValues(a[tieBreaker], b[tieBreaker]);
      }

      return compareValues(a[prop], b[prop]);
    };
  };
}

let rows = [
  {
    name: 'Zach',
    age: 11,
    gender: 'Male',
    location: 'San Francisco, CA',
    id: 'a'
  },
  {
    name: 'Francis',
    age: 34,
    gender: 'Female',
    location: 'Boston, MA',
    id: 'b'
  },
  //...
];

class InfiniteScrollExample extends React.Component {
  constructor() {
    super();
    // Cache huge rows so we don't recreate the data every update.
    this.hugeRows = this.getManyRows();
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '40%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
      </colgroup>
    );
  }

  getColumns() {
    return [
      {
        className: 'name',
        heading: this.getColumnHeading,
        prop: 'name',
        sortable: true
        // Using default sorting.
        // Uncomment this to use age as tie breaker for name
        // sortFunction: getSortFunction('age')
      },
      {
        className: 'age',
        heading: this.getColumnHeading,
        prop: 'age',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        className: 'location',
        defaultContent: 'None Specified',
        heading: this.getColumnHeading,
        prop: 'location',
        sortable: true,
        sortFunction: getSortFunction('name')
      },
      {
        className: 'gender',
        heading: this.getColumnHeading,
        prop: 'gender',
        sortable: true,
        sortFunction: getSortFunction('name')
      }
    ];
  }

  getManyRows() {
    let oldRows = rows.slice(0);
    let newRows = [];
    for (var i = 0; i < 10000; i++) {
      let item = oldRows[Math.floor(Math.random() * oldRows.length)];
      newRows.push({
        name: item.name,
        age: item.age,
        gender: item.gender,
        location: item.location,
        id: i
      });
    }

    return newRows;
  }

  render() {
    return (
      <div class="container">
        <Table
          className="table"
          colGroup={this.getColGroup()}
          columns={this.getColumns()}
          containerSelector=".container"
          data={this.hugeRows} />
      </div>
    );
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

ReactDOM.render(<TableExample />, document.getElementById('table'));
