import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";

import CodeBlock from "./CodeBlock";
import CodeBlockWrapper from "./CodeBlockWrapper";
import BindMixin from "../../../src/Mixin/BindMixin";
import Util from "../../../src/Util/Util";

class PropertiesAPIBlock extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ["handleToggleClick"];
  }

  constructor() {
    super();

    this.state = {
      open: false
    };
  }

  handleToggleClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const toggleClasses = classNames(
      "h4 button button-link dropdown-toggle",
      "example-block-toggle flush",
      {
        open: this.state.open
      },
      this.props.toggleClasses
    );
    const panelInnerClassNames = classNames("example-block", {
      "is-expanded": !this.state.open
    });

    return (
      <div>
        <h4 className={toggleClasses} onClick={this.handleToggleClick}>
          Properties API
        </h4>
        <CodeBlockWrapper>
          <CodeBlock panelInnerClassNames={panelInnerClassNames}>
            {this.props.propTypesBlock}
          </CodeBlock>
        </CodeBlockWrapper>
      </div>
    );
  }
}

PropertiesAPIBlock.propTypes = {
  toggleClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  propTypesBlock: PropTypes.string.isRequired
};

module.exports = PropertiesAPIBlock;
