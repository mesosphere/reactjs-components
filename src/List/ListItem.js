import React from 'react';
import classNames from 'classnames';

export default class ListItem extends React.Component {

  render() {
    var defaultClasses = [
      'list-item'
    ];

    var classes = classNames(
      defaultClasses.concat(
        this.props.className.split(' '),
        this.props.attributes.className.split(' ')
      )
    );

    var Tag = 'div';

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
  tag: 'div'
};

ListItem.propTypes = {
  attributes: React.PropTypes.object,
  tag: React.PropTypes.string
};
