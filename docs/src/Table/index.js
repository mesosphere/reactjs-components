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

  getColGroup(size) {
    let colGroup;

    switch (size) {
      case 'large':
      case 'huge':
        colGroup = (
          <colgroup>
            <col style={{width: '40%'}} />
            <col style={{width: '20%'}} />
            <col style={{width: '20%'}} />
            <col style={{width: '20%'}} />
          </colgroup>
        );
        break;
      case 'small':
        colGroup = (
          <colgroup>
            <col style={{width: '75%'}} />
            <col style={{width: '25%'}} />
          </colgroup>
        );
        break;
    }

    return colGroup;
  }

  getColumns(size) {
    let columns;

    switch (size) {
      case 'large':
      case 'huge':
        columns = [
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
        break;
      case 'small':
        columns = [
          {
            className: 'name',
            defaultContent: '',
            heading: this.getColumnHeading,
            prop: 'name',
            sortable: false
          },
          {
            className: 'age',
            defaultContent: 'None specified',
            heading: this.getColumnHeading,
            prop: 'age',
            sortable: false
          }
        ];
        break;
    }

    return columns;
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

    switch (size) {
      case 'large':
        // Do nothing
        break;
      case 'huge':
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
        break;
      case 'small':
        rows = rows.slice(0, 5);
        break;
    }

    if (this.state.rowAdded && size === 'small') {
      rows.push({
        name: 'Cheryl',
        age: 28,
        gender: 'Female',
        location: 'Seattle, WA',
        id: 'f'
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
          <div className="container container-pod">
            <h3>Here is a large, sortable table.</h3>
            <Table
              className="table"
              colGroup={this.getColGroup('large')}
              columns={this.getColumns('large')}
              data={this.getRows('large')}
              keys={['id']}
              sortBy={{
                prop: 'name',
                order: 'desc'
              }} />
          </div>
        </section>
        <section className="row canvas-pod canvas-pod-dark">
          <div className="container container-pod">
            <div className="row">
              <div className="column-9">
                <h3 className="inverse flush-top">
                  Here is a table with less data and sorting disabled.
                </h3>
              </div>
              <div className="column-3 text-align-right">
                <button
                  className="button button-small button-primary
                    button-stroke button-inverse"
                  onClick={this.handleToggleExtraRow}>
                  {rowButtonLabel}
                </button>
              </div>
            </div>
            <Table
              className="table inverse"
              colGroup={this.getColGroup('small')}
              columns={this.getColumns('small')}
              data={this.getRows('small')}
              keys={['id']}
              transition={true} />
          </div>
        </section>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <div className="row">
              <div className="column-9">
                <h3 className="flush-top">
                  Here is a scroll table with 100k items. It will not grow beyond window height.
                </h3>
              </div>
            </div>
            <Table
              className="table"
              colGroup={this.getColGroup('huge')}
              columns={this.getColumns('huge')}
              data={this.hugeRows}
              keys={['id']}
              sortBy={{
                prop: 'name',
                order: 'desc'
              }} />
          </div>
        </section>
      </div>
    );
  }

}

React.render(<TableExample />, document.getElementById('table'));
