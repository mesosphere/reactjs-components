import React, {PropTypes} from 'react';

import Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class ListItem extends React.Component {
  render() {
    let Tag = this.props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    let attributes = Util.exclude(this.props, Object.keys(ListItem.propTypes)) || {};

    if (attributes.transition) {
      return (
        <CSSTransitionGroup
          {...attributes}
          className={this.props.className}
          component={this.props.tag}>
          {this.props.children}
        </CSSTransitionGroup>
      );
    }

    return (
      <Tag {...attributes} className={this.props.className}>
        {this.props.children}
      </Tag>
    );
  }
}

ListItem.defaultProps = {
  className: 'list-item',
  tag: 'li'
};

ListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.string
};
