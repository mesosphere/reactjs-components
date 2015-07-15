var React = require('react');

var ListItem = React.createClass({

  displayName: 'ListItem',

  render: function() {
    var Tag = this.props.tag || 'div';
    return (
      <Tag {...this.props.attributes}>
        {this.props.children}
      </Tag>
    );
  }

});

module.exports = ListItem;
