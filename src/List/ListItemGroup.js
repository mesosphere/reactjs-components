import React from 'react';

export default class ListItemGroup extends React.Component {

  propTypes: {
    attributes: React.PropTypes.object,
    tag: React.PropTypes.string
  }

  render() {
    var Tag = this.props.tag || 'div';
    return (
      <Tag {...this.props.attributes}>
        {this.props.children}
      </Tag>
    );
  }

}
