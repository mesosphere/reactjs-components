import classNames from 'classnames';
import React, {PropTypes} from 'react/addons';

import ListItem from './ListItem';
import Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class List extends React.Component {
  getListItemContents(item, childIndex) {
    if (item.items) {
      return this.getListItems(item.items, childIndex);
    } else {
      return item.value;
    }
  }

  getListItems(list, childIndex = 0) {
    let items = list.map(function (item, parentIndex) {
      let key = `${parentIndex}.${childIndex}`;
      childIndex++;

      return (
        <ListItem key={key} {...Util.exclude(item, ['items', 'value'])}>
          {this.getListItemContents(item, childIndex)}
        </ListItem>
      );
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
    let defaultClass = List.defaultProps.className;
    let classes = classNames(this.props.className, defaultClass);
    let Tag = this.props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    let attributes = Util.exclude(this.props, Object.keys(List.propTypes));

    return (
      <Tag {...attributes} className={classes}>
        {this.getListItems(this.props.items)}
      </Tag>
    );
  }
}

List.defaultProps = {
  className: 'list',
  tag: 'ul',
  transition: true,
  transitionName: 'list-item'
};

List.propTypes = {
  className: PropTypes.string,
  // List of items in the list
  items: PropTypes.arrayOf(
    // Each item in the array should be an object
    React.PropTypes.shape({
      // Optionally add a class to a given item
      className: PropTypes.string,
      // An item can be a container of another ist
      items: PropTypes.array,
      // Optional tag for item instead of an `li`
      tag: PropTypes.string,
      // If this item isn't a list of other items just use a value
      value: PropTypes.string
    })
  ).isRequired,
  // Optional tag for the container of the list
  tag: PropTypes.string,
  transition: PropTypes.bool,
  transitionName: PropTypes.string
};
