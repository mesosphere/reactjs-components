import classnames from "classnames/dedupe";
import React from "react";

class CodeBlockWrapper extends React.Component {
  render() {
    const panelClasses = classnames(
      "panel pod flush-right flush-left flush-top",
      this.props.panelClassNames
    );

    return (
      <div className={panelClasses}>
        {this.props.children}
      </div>
    );
  }
}

CodeBlockWrapper.propTypes = {
  children: React.PropTypes.node.isRequired,
  panelClassNames: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ])
};

module.exports = CodeBlockWrapper;
