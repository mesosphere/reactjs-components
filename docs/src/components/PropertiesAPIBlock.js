import classNames from 'classnames';
import React from 'react';

import CodeBlock from './CodeBlock';
import CodeBlockWrapper from './CodeBlockWrapper';
import BindMixin from '../../../src/Mixin/BindMixin';
import Util from '../../../src/Util/Util';

class PropertiesAPIBlock extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleToggleClick'
    ];
  }

  constructor() {
    super();

    this.state = {
      open: false
    };
  }

  handleToggleClick() {
    this.setState({open: !this.state.open});
  }

  render() {
    let toggleClasses = classNames('h4 button button-link dropdown-toggle',
      'example-block-toggle flush-bottom', {
        open: this.state.open
      }, this.props.toggleClasses);
    let panelInnerClassNames = classNames('example-block', {
      'is-expanded': !this.state.open
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
  toggleClasses: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  propTypesBlock: React.PropTypes.string.isRequired,
};

module.exports = PropertiesAPIBlock;
