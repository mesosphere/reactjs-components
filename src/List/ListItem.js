import React from 'react';

var ListItem = React.createClass({
  displayName: 'ListItem',

  propTypes: {
    attributes: React.PropTypes.object,
    tag: React.PropTypes.string
  },

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
