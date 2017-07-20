import React, { PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Util from "../Util/Util";
// import HTMLUtil from "../Util/HTMLUtil";

class ListItem extends React.Component {
  render() {
    const { props } = this;
    const Tag = props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    const htmlAttributes = Util.exclude(props, Object.keys(ListItem.propTypes));

    if (props.transition) {
      return (
        <ReactCSSTransitionGroup
          {...htmlAttributes}
          className={props.className}
          component={props.tag}
        >
          {props.children}
        </ReactCSSTransitionGroup>
      );
    }

    return (
      <Tag {...htmlAttributes} className={props.className}>
        {props.children}
      </Tag>
    );
  }
}

ListItem.defaultProps = {
  className: "list-item",
  tag: "li"
};

ListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.string,
  transition: PropTypes.bool
};

module.exports = ListItem;
