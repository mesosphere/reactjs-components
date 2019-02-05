import classnames from "classnames/dedupe";
import PropTypes from "prop-types";
import React from "react";

class CodeBlock extends React.Component {
  render() {
    const panelInnerClasses = classnames(
      "panel-cell panel-cell-narrow panel-cell-short panel-cell-light panel-cell-code-block",
      this.props.panelInnerClassNames
    );
    const preClasses = classnames(
      `prettyprint transparent flush lang-${this.props.language}`,
      this.props.preClassNames
    );

    return (
      <div className={panelInnerClasses}>
        <pre className={preClasses}>{this.props.children}</pre>
      </div>
    );
  }
}

const classPropTypes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.string
]);

CodeBlock.defaultProps = {
  language: "javascript"
};

CodeBlock.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
  panelInnerClassNames: classPropTypes,
  preClassNames: classPropTypes
};

module.exports = CodeBlock;
