import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default class ListItem extends React.Component {

  render() {
    var defaultClasses = [
      'list-item'
    ];

    var classes = classNames(
      defaultClasses.concat(this.props.attributes.className.split(' '))
    );

    var Tag = this.props.tag;

    return (
      <Tag {...this.props.attributes} className={classes}>
        {this.props.children}
      </Tag>
    );
  }

}

ListItem.defaultProps = {
  attributes: {
    className: ''
  },
  className: '',
  tag: 'li'
};

ListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  attributes: PropTypes.object,
  tag: PropTypes.string
};
