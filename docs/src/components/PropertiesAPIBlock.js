import classNames from 'classnames';
import React from 'react';

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
    }
  }

  handleToggleClick() {
    this.setState({open: !this.state.open});
  }

  render() {
    let toggleClasses = classNames({
      'h4 button button-link dropdown-toggle example-block-toggle': true,
      'flush-bottom': true,
      open: this.state.open
    })
    let blockClassNames = classNames({
      'example-block': true,
      'show-snippet': !this.state.open
    });

    return (
      <div>
        <h4 className={toggleClasses} onClick={this.handleToggleClick}>
          Properties API
        </h4>
        <div className={blockClassNames}>
          <pre className="prettyprint linenums flush-bottom">{this.props.propTypesBlock}</pre>
        </div>
      </div>
    );
  }
}

PropertiesAPIBlock.propTypes = {
  propTypesBlock: React.PropTypes.string.isRequired,
};

module.exports = PropertiesAPIBlock;
