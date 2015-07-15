/** @jsx React.DOM */

var React = require('react');

var ListItem = React.createClass({

  displayName: 'ListItem',

  render: function() {
    return (
      <div {...this.props.attributes}>
        {this.props.children}
      </div>
    );
  }

});

module.exports = ListItem;
