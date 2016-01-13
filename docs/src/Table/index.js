import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

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
    this.state = {
      rowAdded: false
    };
    ['handleToggleExtraRow', 'handleToggleScroll'].forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);

    // Cache huge rows so we don't recreate the data every update.
    this.hugeRows = this.getManyRows();
  }

  componentDidMount() {
    this.forceUpdate();
  }

  handleToggleExtraRow() {
    this.setState({
      rowAdded: !this.state.rowAdded
    });
  }

  handleToggleScroll() {
    this.setState({shouldScroll: !this.state.shouldScroll});
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
        dontCache: true,
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
    let newRows = rows.slice(0);

    if (this.state.rowAdded) {
      newRows.push({
        name: 'Cheryl',
        age: 28,
        gender: 'Female',
        location: 'Seattle, WA',
        id: 'k'
      });
    }

    return newRows;
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
    let rowButtonLabel;

    if (this.state.rowAdded) {
      rowButtonLabel = 'Remove Row';
    } else {
      rowButtonLabel = 'Add Row';
    }

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

  // Settings for each column in table.
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      // Attributes to pass down to each column item.
      attributes: React.PropTypes.object,

      // Class to give to each column item. Can be a function to programmatically create a class.
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),

      // Content to default to in the case of no data for the prop.
      defaultContent: PropTypes.string,

      // Function to render the header of the column. Can also be a string.
      // The arguments to the function will be: prop (prop to sort by), order (asc / desc), and sortBy (the sort function)
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

  // Data to display in the table.
  // Make sure to clone the data, cannot be modified!
  data: PropTypes.array.isRequired,

  // Optional item height for the scroll table. If not provided, it will render
  // once to measure the height of the first child.
  // NB: Initial render will stop any ongoing animation, if this is not provided
  itemHeight: PropTypes.number,

  // Provide what attribute in the data make a row unique.
  idAttribute: PropTypes.string.isRequired,

  // Optional callback function when sorting is complete.
  onSortCallback: PropTypes.func,

  // Optional default sorting criteria.
  sortBy: PropTypes.shape({
    order: PropTypes.oneOf(['asc', 'desc']),
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  // Optional property to add transitions or turn them off. Default is off.
  // Only available for tables that does not scroll
  transition: PropTypes.bool
};
`}
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
      dontCache: true,
      heading: this.getColumnHeading,
      prop: 'name',
      sortable: true

      // Using default sorting function.
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
                    <p>A simple example table with transition enabled.</p>
                  </div>
                  <div className="column-3 text-align-right">
                    <button
                      className="button button-small button-primary
                        button-stroke"
                      onClick={this.handleToggleExtraRow}>
                      {rowButtonLabel}
                    </button>
                  </div>
                </div>
                <Table
                  className="table flush-bottom"
                  colGroup={this.getColGroup()}
                  columns={this.getColumns()}
                  data={this.getRows('large')}
                  idAttribute="id"
                  transition={true} />
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
  constructor() {
    super();
    this.state = {
      rowAdded: false
    };
    ['handleToggleExtraRow', 'handleToggleScroll'].forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
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

  getRows() {
    let newRows = rows.slice(0);

    if (this.state.rowAdded) {
      newRows.push({
        name: 'Cheryl',
        age: 28,
        gender: 'Female',
        location: 'Seattle, WA',
        id: 'k'
      });
    }

    return newRows;
  }

  render() {
    return (
      <Table
        className="table"
        colGroup={this.getColGroup()}
        columns={this.getColumns()}
        data={this.getRows()}
        idAttribute="id"
        transition={true} />
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
                      Here is a scroll table with 10k items. It will not grow beyond window height. The data is not sorted by default.
                    </p>
                  </div>
                </div>
                <GeminiScrollbar
                  autoshow={true}
                  style={{height: 800}}>
                  <Table
                    className="table"
                    colGroup={this.getColGroup()}
                    columns={this.getColumns()}
                    data={this.hugeRows}
                    containerSelector=".gm-scroll-view"
                    idAttribute="id" />
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
      <Table
        className="table"
        colGroup={this.getColGroup()}
        columns={this.getColumns()}
        data={this.hugeRows}
        idAttribute="id" />
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

React.render(<TableExample />, document.getElementById('table'));
