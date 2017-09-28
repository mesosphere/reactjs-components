import classnames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";

class ComponentExampleWrapper extends React.Component {
  render() {
    const classes = classnames(
      "panel pod flush-top flush-right flush-left",
      this.props.className
    );

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

ComponentExampleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
};

module.exports = ComponentExampleWrapper;
