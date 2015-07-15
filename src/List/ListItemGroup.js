var React = require('react');

var ListItemGroup = React.createClass({

  displayName: 'ListItemGroup',

  render: function() {
    var Tag = this.props.attributes.tag || 'div';
    return (
      <Tag {...this.props.attributes}>
        {this.props.children}
      </Tag>
    );
  }

});

module.exports = ListItemGroup;
