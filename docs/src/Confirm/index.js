/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';

import BindMixin from '../../../src/Mixin/BindMixin';
import ComponentExample from '../components/ComponentExample';
import ComponentExampleWrapper from '../components/ComponentExampleWrapper';
import ComponentWrapper from '../components/ComponentWrapper';
import CodeBlock from '../components/CodeBlock';
import Confirm from '../../../src/Confirm/Confirm.js';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';
import Util from '../../../src/Util/Util';

class ConfirmExample extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleOpenConfirm',
      'handleButtonCancel',
      'handleButtonConfirm'
    ];
  }

  constructor() {
    super();

    this.state = {
      openConfirm: false
    };
  }

  handleOpenConfirm() {
    this.setState({openConfirm: true});
  }

  handleButtonCancel() {
    this.setState({openConfirm: false});
  }

  handleButtonConfirm() {
    /* eslint-disable no-alert */
    alert('Confirm was pressed!');
    /* eslint-enable no-alert */
    this.setState({openConfirm: false});
  }

  render() {
    return (
      <ComponentWrapper title="Confirm" srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Confirm/Confirm.js">
        <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/Confirm/Confirm.js)'} />
        <ComponentExampleWrapper>
          <ComponentExample>
            <button className="button button-inverse"
              onClick={this.handleOpenConfirm}>
              Here is a simple confirm
            </button>
            <Confirm
              open={this.state.openConfirm}
              onClose={this.handleButtonCancel}
              leftButtonCallback={this.handleButtonCancel}
              rightButtonCallback={this.handleButtonConfirm}>
              <div className="container-pod">
                Would you like to perform this action?
              </div>
            </Confirm>
          </ComponentExample>
          <CodeBlock>
{`import {Confirm} from 'reactjs-components';
import React from 'react';

class ConfirmExample extends React.Component {
  render() {
    return (
      <Confirm
        leftButtonCallback={this.handleButtonCancel}
        rightButtonCallback={this.handleButtonConfirm}
        open={this.state.openConfirm}
        onClose={this.handleButtonCancel}>
        <div className="container-pod">
          Would you like to perform this action?
        </div>
      </Confirm>
    );
  }
}
`}
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }
}

module.exports = ConfirmExample;
