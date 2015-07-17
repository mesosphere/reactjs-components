import React from 'react';
import classNames from 'classnames';

export default class ListItem extends React.Component {

  render() {
    var defaultClasses = [
      'list-item'
    ];
    var passedClasses = this.props.className.split(' ');
    var classes = classNames(defaultClasses.concat(passedClasses));

    var Tag = 'div';

    return (
      <Tag {...this.props.attributes} className={classes}>
        {this.props.children}
      </Tag>
    );
  }

}

ListItem.defaultProps = {
  className: '',
  tag: 'div'
};

ListItem.propTypes = {
  attributes: React.PropTypes.object,
  tag: React.PropTypes.string
};
