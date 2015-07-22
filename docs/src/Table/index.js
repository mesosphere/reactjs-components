import React from 'react';

import Table from '../../../src/Table/Table.js';

class TableExample extends React.Component {

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '75%'}} />
        <col style={{width: '25%'}} />
      </colgroup>
    );
  }

  getColumns() {
    var columns = [
      {
        className: 'name',
        defaultContent: '',
        heading: 'Name',
        prop: 'name',
        sortable: true
      },
      {
        className: 'age',
        defaultContent: 'None specified',
        heading: 'Age',
        prop: 'age',
        sortable: true
      }
    ];

    return columns;
  }

  getRows() {
    var rows = [
      {
        name: 'Frederick',
        age: 34,
        id: 'b'
      },
      {
        name: 'Andy',
        age: 68,
        id: 'a'
      },
      {
        name: 'Jeffrey',
        age: 21,
        id: 'c'
      },
      {
        name: 'Lewis',
        age: 500,
        id: 'd'
      }
    ];

    return rows;
  }

  render() {
    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod">
            <h2>Here is a simple table.</h2>
            <Table
              className="table"
              colGroup={this.getColGroup()}
              columns={this.getColumns()}
              data={this.getRows()}
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
