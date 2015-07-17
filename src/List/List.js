import React from 'react';
import classNames from 'classnames';

import ListItem from './ListItem';

export default class List extends React.Component {

  getListItems(list, childIndex) {
    var that = this;
    childIndex = childIndex || 0;

    var items = list.map(function(item, parentIndex) {
      var key = parentIndex + '.' + childIndex;

      if (item.items) {
        return (
          <ListItem key={key} tag={item.tag} className="group" attributes={item.attributes}>
            {that.getListItems(item.items, childIndex++)}
          </ListItem>
        );
      } else {
        return (
          <ListItem key={key} tag={item.tag} attributes={item.attributes}>
            {item.value}
          </ListItem>
        );
      }

    });

    return items;
  }

  render() {
    var defaultClasses = [
      'list',
      'list-unstyled'
    ];

    var classes = classNames(
      defaultClasses.concat(
        this.props.className.split(' '),
        this.props.attributes.className.split(' ')
      )
    );

    var Tag = this.props.tag;

    return (
      <Tag {...this.props} className={classes}>
        {this.getListItems(this.props.items)}
      </Tag>
    );
  }

}

List.defaultProps = {
  attributes: {
    className: ''
  },
  className: '',
  tag: 'div'
};

List.propTypes = {
  attributes: React.PropTypes.object,
  className: React.PropTypes.string,
  items: React.PropTypes.array.isRequired,
  tag: React.PropTypes.string
};
