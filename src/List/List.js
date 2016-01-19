import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ListItem from './ListItem';
import Util from '../Util/Util';

class List extends React.Component {
  getListItems(list, childIndex = 0) {
    let {props} = this;
    let items = list.map((item, parentIndex) => {
      let key = `${parentIndex}.${childIndex}`;
      childIndex++;

      if (Util.isArrayLike(item.content)) {
        return (
          <ListItem
            {...Util.exclude(item, ['content'])}
            key={key}
            tag={item.tag}
            transition={true}
            transitionName={props.transitionName}
            transitionEnterTimeout={props.transitionEnterTimeout}
            transitionLeaveTimeout={props.transitionLeaveTimeout}>
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
    });

    return items;
  }

  render() {
    let {props} = this;
    let Tag = props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    let attributes = Util.exclude(props, Object.keys(List.propTypes));

    if (props.transition) {
      return (
        <ReactCSSTransitionGroup
          {...attributes}
          className={props.className}
          component={Tag}
          transitionName={props.transitionName}
          transitionEnterTimeout={props.transitionEnterTimeout}
          transitionLeaveTimeout={props.transitionLeaveTimeout}>
          {this.getListItems(props.content)}
        </ReactCSSTransitionGroup>
      );
    }

    return (
      <Tag {...attributes} className={props.className}>
        {this.getListItems(props.content)}
      </Tag>
    );
  }
}

List.defaultProps = {
  className: 'list',
  tag: 'ul',
  transition: true,
  transitionName: 'list-item',
  transitionEnterTimeout: 500,
  transitionLeaveTimeout: 500
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
  transitionName: PropTypes.string,
  // Transition lengths
  transitionEnterTimeout: React.PropTypes.number,
  transitionLeaveTimeout: React.PropTypes.number
};

module.exports = List;
