import classnames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";

class CodeBlockWrapper extends React.Component {
  render() {
    const panelClasses = classnames(
      "panel pod flush-right flush-left flush-top",
      this.props.panelClassNames
    );

    return <div className={panelClasses}>{this.props.children}</div>;
  }
}

CodeBlockWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  panelClassNames: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
};

module.exports = CodeBlockWrapper;
