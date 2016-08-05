/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';

import BindMixin from '../../../src/Mixin/BindMixin';
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
      <div>
        <section className="row canvas-pod">
          <div>
            <div className="row">
              <div className="column-12">
                <h2>Confirm</h2>
                <p>
                  Opens a Confirm modal. View the full <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Confirm/Confirm.js">component source</a>.
                </p>
                <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/Confirm/Confirm.js)'} />
                <div className="example-block flush-bottom">
                  <div className="example-block-content">
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
                  </div>
                  <div className="example-block-footer example-block-footer-codeblock">
                    <pre className="prettyprint linenums flush-bottom">
{`import {Confirm} from 'reactjs-components';
import React from 'react';

class ConfirmExample extends React.Component {

  render() {
    return (
      <Confirm
        open={this.state.openConfirm}
        onClose={this.handleButtonCancel}
        leftButtonCallback={this.handleButtonCancel}
        leftButtonCallback={this.handleButtonConfirm} />
    );
  }
}
`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

ReactDOM.render(<ConfirmExample />, document.getElementById('confirm'));
