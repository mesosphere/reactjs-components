import classNames from 'classnames';
import React, {PropTypes} from 'react';

import Util from '../Util/Util';

export default class ListItem extends React.Component {
  render() {
    let defaultClass = ListItem.defaultProps.className;
    let classes = classNames(this.props.className, defaultClass);
    let Tag = this.props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    let attributes = Util.exclude(this.props, Object.keys(ListItem.propTypes));

    return (
      <Tag {...attributes} className={classes}>
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
