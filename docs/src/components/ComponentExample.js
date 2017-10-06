import classnames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";

class ComponentExample extends React.Component {
  render() {
    const classes = classnames("panel-cell", this.props.classNames);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

ComponentExample.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
};

module.exports = ComponentExample;
