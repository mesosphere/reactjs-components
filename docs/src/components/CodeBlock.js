import classnames from "classnames/dedupe";
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
        <pre className={preClasses}>
          {this.props.children}
        </pre>
      </div>
    );
  }
}

const classPropTypes = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

CodeBlock.defaultProps = {
  language: "javascript"
};

CodeBlock.propTypes = {
  children: React.PropTypes.node.isRequired,
  language: React.PropTypes.string,
  panelInnerClassNames: classPropTypes,
  preClassNames: classPropTypes
};

module.exports = CodeBlock;
