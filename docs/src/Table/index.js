import React from 'react';
import classNames from 'classnames';

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
    this.hugeRows = this.getRows('huge');
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

  getRows(size) {
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

    if (size === 'huge') {
      let oldRows = rows.slice(0);
      rows = [];
      for (var i = 0; i < 100000; i++) {
        let item = oldRows[Math.floor(Math.random() * oldRows.length)];
        rows.push({
          name: item.name,
          age: item.age,
          gender: item.gender,
          location: item.location,
          id: i
        });
      }
    }

    if (this.state.rowAdded && size === 'large') {
      rows.push({
        name: 'Cheryl',
        age: 28,
        gender: 'Female',
        location: 'Seattle, WA',
        id: 'k'
      });
    }

    return rows;
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
          <div className="container container-pod flush-bottom">
            <h2>Tables</h2>
            <div className="example-block flush-bottom">
              <div className="example-block-content">
                <div className="
                  container
                  container-pod
                  container-pod-short
                  flush-top
                  row
                  row-flex">
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
{`
import {Table} from 'reactjs-components';

//...

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

getRows(size) {
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

  if (this.state.rowAdded && size === 'large') {
    rows.push({
      name: 'Cheryl',
      age: 28,
      gender: 'Female',
      location: 'Seattle, WA',
      id: 'k'
    });
  }

  return rows;
}

<Table
  className="table"
  colGroup={this.getColGroup()}
  columns={this.getColumns()}
  data={this.getRows('large')}
  idAttribute="id"
  transition={true} />`}
                </pre>
              </div>
            </div>
          </div>
        </section>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <div className="example-block flush-bottom">
              <div className="example-block-content">
                <div className="
                  container
                  container-pod
                  container-pod-short
                  flush-top
                  row
                  row-flex">
                  <div className="column-12">
                    <p>
                      Here is a scroll table with 100k items. It will not grow beyond window height. The data is not sorted by default.
                    </p>
                  </div>
                </div>
                <Table
                  className="table"
                  colGroup={this.getColGroup()}
                  columns={this.getColumns()}
                  data={this.hugeRows}
                  idAttribute="id" />
              </div>
              <div className="example-block-footer example-block-footer-codeblock">
                <pre className="prettyprint linenums flush-bottom">
{`
import {Table} from 'reactjs-components';

//...

getRows(size) {

  //...

  if (size === 'huge') {
    let oldRows = rows.slice(0);
    rows = [];
    for (var i = 0; i < 100000; i++) {
      let item = oldRows[Math.floor(Math.random() * oldRows.length)];
      rows.push({
        name: item.name,
        age: item.age,
        gender: item.gender,
        location: item.location,
        id: i
      });
    }
  }

  //...

  return rows;
}

<Table
  className="table"
  colGroup={this.getColGroup()}
  columns={this.getColumns()}
  data={this.hugeRows}
  idAttribute="id" />
`}
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
