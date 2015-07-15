/** @jsx React.DOM */

var React = require('react');

var ListItemGroup = React.createClass({

  displayName: 'ListItemGroup',

  render: function() {
    return (
      <div {...this.props.attributes}>
        {this.props.children}
      </div>
    );
  }

});

module.exports = ListItemGroup;
