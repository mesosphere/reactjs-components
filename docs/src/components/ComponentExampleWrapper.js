import classnames from "classnames/dedupe";
import React from "react";

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
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ])
};

module.exports = ComponentExampleWrapper;
