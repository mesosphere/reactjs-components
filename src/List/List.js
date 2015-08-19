import React from 'react/addons';
import classNames from 'classnames';

import ListItem from './ListItem';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class List extends React.Component {

  getListItems(list, childIndex = 0) {
    var items = list.map(function (item, parentIndex) {
      var key = `${parentIndex}.${childIndex}`;
      childIndex++;

      if (item.items) {
        return (
          <ListItem key={key} tag={item.tag} attributes={item.attributes}>
            {this.getListItems(item.items, childIndex)}
          </ListItem>
        );
      } else {
        return (
          <ListItem key={key} tag={item.tag} attributes={item.attributes}>
            {item.value}
          </ListItem>
        );
      }

    }, this);

    if (this.props.transition) {
      return (
        <CSSTransitionGroup transitionName={this.props.transitionName}>
          {items}
        </CSSTransitionGroup>
      );
    }

    return items;
  }

  render() {
    var defaultClasses = [
      'list'
    ];

    var classes = classNames(
      defaultClasses.concat(this.props.className.split(' '))
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
  tag: 'ul'
};

List.propTypes = {
  attributes: React.PropTypes.object,
  className: React.PropTypes.string,
  items: React.PropTypes.array.isRequired,
  tag: React.PropTypes.string
};
