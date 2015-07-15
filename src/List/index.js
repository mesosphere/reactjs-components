var React = require('react');

var List = require('List');

var config = [
  {
    title: {
      value: 'Hello'
    }
  },
  {
    title: {
      value: <h1>World</h1>
    }
  }
];

React.render(
  <List list={config} />,
  document.getElementById('application')
);
