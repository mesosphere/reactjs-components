import React from 'react';
import classNames from 'classnames';

import Table from '../../../src/Table/Table.js';

class TableExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowAdded: false
    };
    ['handleToggleExtraRow'].forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  handleToggleExtraRow() {
    this.setState({
      rowAdded: !this.state.rowAdded
    });
  }

  getColumnHeading(prop, order, sortBy) {
    var caretClassNames = classNames({
      'caret': true,
      'caret--asc': order === 'asc',
      'caret--desc': order === 'desc',
      'caret--visible': sortBy.prop === prop
    });

    var headingStrings = {
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
    var colGroup;

    switch (size) {
      case 'large':
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
    var columns;

    switch (size) {
      case 'large':
        columns = [
          {
            className: 'name',
            heading: this.getColumnHeading,
            prop: 'name',
            sortable: false
          },
          {
            className: 'age',
            heading: this.getColumnHeading,
            prop: 'age',
            sortable: false
          },
          {
            className: 'location',
            defaultContent: 'None Specified',
            heading: this.getColumnHeading,
            prop: 'location',
            sortable: false
          },
          {
            className: 'gender',
            heading: this.getColumnHeading,
            prop: 'gender',
            sortable: false
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
            sortable: true
          },
          {
            className: 'age',
            defaultContent: 'None specified',
            heading: this.getColumnHeading,
            prop: 'age',
            sortable: true
          }
        ];
        break;
    }

    return columns;
  }

  getRows(size) {
    var rows;

    switch (size) {
      case 'large':
        rows = [
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
          }
        ];
        break;
      case 'small':
        rows = [
          {
            name: 'Zach',
            age: 11,
            id: 'a'
          },
          {
            name: 'Frederick',
            age: 34,
            id: 'b'
          },
          {
            name: 'Andy',
            age: 68,
            id: 'c'
          },
          {
            name: 'Jeffrey',
            age: 21,
            id: 'd'
          },
          {
            name: 'Lewis',
            age: 94,
            id: 'e'
          }
        ];
        break;
    }

    if (this.state.rowAdded && size === 'large') {
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
    var buttonLabel;

    if (this.state.rowAdded) {
      buttonLabel = 'Remove Row';
    } else {
      buttonLabel = 'Add Row';
    }

    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <h3>Here is a small, sortable table.</h3>
            <Table
              className="table"
              colGroup={this.getColGroup('small')}
              columns={this.getColumns('small')}
              data={this.getRows('small')}
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
                  Here is a table with more data and sorting disabled.
                </h3>
              </div>
              <div className="column-3 text-align-right">
                <button className="button button-small button-primary button-stroke button-inverse" onClick={this.handleToggleExtraRow}>
                  {buttonLabel}
                </button>
              </div>
            </div>
            <Table
              className="table inverse"
              colGroup={this.getColGroup('large')}
              columns={this.getColumns('large')}
              data={this.getRows('large')}
              keys={['id']}
              transition={true} />
          </div>
        </section>
      </div>
    );
  }

}

React.render(<TableExample />, document.getElementById('table'));
