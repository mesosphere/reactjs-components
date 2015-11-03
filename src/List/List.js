import classNames from 'classnames';
import React, {PropTypes} from 'react/addons';

import ListItem from './ListItem';
import Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class List extends React.Component {
  getListItems(list, childIndex = 0) {
    let items = list.map(function (item, parentIndex) {
      let key = `${parentIndex}.${childIndex}`;
      childIndex++;

      if (Util.isArrayLike(item.content)) {
        return (
          <ListItem
            {...Util.exclude(item, ['content'])}
            key={key}
            tag={item.tag}
            transition={true}
            transitionName={this.props.transitionName}>
            {this.getListItems(item.content, childIndex)}
          </ListItem>
        );
      } else {
        return (
          <ListItem key={key} {...Util.exclude(item, ['content'])}>
            {item.content}
          </ListItem>
        );
      }
    }, this);

    return items;
  }

  render() {
    let Tag = this.props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    let attributes = Util.exclude(this.props, Object.keys(List.propTypes));

    if (this.props.transition) {
      return (
        <CSSTransitionGroup
          {...attributes}
          component={Tag}
          transitionName={this.props.transitionName}
          className={this.props.className}>
          {this.getListItems(this.props.content)}
        </CSSTransitionGroup>
      );
    }

    return (
      <Tag {...attributes} className={this.props.className}>
        {this.getListItems(this.props.content)}
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
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(
      // Each item in the array should be an object
      PropTypes.shape({
        // Optionally add a class to a given item
        className: PropTypes.string,
        // An item can be a container of another ist
        items: PropTypes.array,
        // Optional tag for item instead of an `li`
        tag: PropTypes.string,
        // If this item isn't a list of other items just use a value
        value: PropTypes.string
      })
    ),
    PropTypes.string
  ]).isRequired,
  // Optional tag for the container of the list
  tag: PropTypes.string,
  transition: PropTypes.bool,
  transitionName: PropTypes.string
};
