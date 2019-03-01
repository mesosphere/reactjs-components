import React from "react";
import PropTypes from "prop-types";

import Util from "../Util/Util";

class ListItem extends React.Component {
  render() {
    const { props } = this;
    const Tag = props.tag;

    // Uses all passed properties as attributes, excluding propTypes
    const htmlAttributes = Util.exclude(props, Object.keys(ListItem.propTypes));

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
  tag: PropTypes.string
};

module.exports = ListItem;
