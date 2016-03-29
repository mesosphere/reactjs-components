import React from 'react';
import ReactDOM from 'react-dom';

import Tooltip from '../../../src/Tooltip/Tooltip.js';

class ToolTipExample extends React.Component {
  render() {
    return (
      <div className="row canvas-pod">
        <div>
          <h2 className="short-bottom">Tooltips</h2>
          <p>
            A tooltip appears when a user hover overs an element. The tooltips will adjust their position if the supplied positioning results in the tooltip rendering outside of the veiwport. For example, if you supply the position of "bottom", but the element is at the bottom of the viewport, it will render the tooltip at the top of the element.
          </p>
          <p>
            The tooltip allows users to set the position and anchor. Position refers to the position of the tooltip relative to its trigger (which is its children), and acceptable values are top, right, bottom, and left. Anchor refers to where the tooltip is anchored on the triggered element, and acceptable values are start, center, and end. Think of flexbox alignment when thinking about the start and end values.
          </p>
          <p>
            View component source <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Tooltip/Tooltip.js">here</a>.
            View full example source <a href="https://github.com/mesosphere/reactjs-components/blob/master/docs/src/Tooltip/index.js">here</a>.
          </p>
          <h3>Properties API</h3>
          <div className="example-block">
            <pre className="prettyprint linenums flush-bottom">
{`Tooltip.propTypes = {
  // Anchor the tooltip to an edge of the tooltip trigger. Start and end refer
  // to the logical respective edges of the tooltip. When tooltip is positioned
  // on the right, start refers to the top of the tooltip. When tooltip is
  // positioned on the bottom, start refers to the left edge of the tooltip.
  anchor: React.PropTypes.oneOf(['start', 'center', 'end']),
  // The children will be used as the trigger.
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
  // The tooltip's content.
  content: React.PropTypes.node.isRequired,
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: React.PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  tooltipWrapperClassName: React.PropTypes.string,
  // Explicitly set the width of the tooltip. Default is auto.
  width: React.PropTypes.number,
  // Allow the text content to wrap. Default is false. This should be used with
  // the width property, because otherwise the width of the content will be the
  // same as the trigger.
  wrapText: React.PropTypes.bool
};`}
            </pre>
          </div>
          <div className="example-block flush-bottom example-block-overflow">
            <div className="example-block-content">
              <section className="row canvas-pod">
                <div className="column-12">
                  <p>
                    Hover over the following buttons to observe the behavior
                    of the tooltips.
                  </p>
                </div>
              </section>
              <section className="row canvas-pod">
                <div className="column-12 column-mini-12">
                  <div className="button-collection">
                    <Tooltip content="I'm a tooltip!" nodeType="button"
                      wrapperClassName="tooltip-wrapper text-align-center
                      button">
                      Top
                    </Tooltip>
                    <Tooltip content="I'm a tooltip!" nodeType="button"
                      position="bottom" wrapperClassName="tooltip-wrapper
                      text-align-center button">
                      Bottom
                    </Tooltip>
                    <Tooltip content="I'm a tooltip!" nodeType="button"
                      position="left" wrapperClassName="tooltip-wrapper
                      text-align-center button">
                      Left
                    </Tooltip>
                    <Tooltip content="I'm a tooltip!" nodeType="button"
                      position="right" wrapperClassName="tooltip-wrapper
                      text-align-center button">
                      Right
                    </Tooltip>
                  </div>
                </div>
              </section>
            </div>
            <div className="example-block-footer example-block-footer-codeblock">
              <pre className="prettyprint linenums flush-bottom">

{`import {Tooltip} from 'reactjs-components';
import React from 'react';

class FormExample extends React.Component {
  render() {
    return (
      <section className="row canvas-pod">
        <div className="column-6 column-mini-3">
          <Tooltip content="I'm a tooltip!">
            <button className="button">Top</button>
          </Tooltip>
        </div>
        <div className="column-6 column-mini-3">
          <Tooltip content="I'm a tooltip!" position="right">
            <button className="button">Right</button>
          </Tooltip>
        </div>
        <div className="column-6 column-mini-3">
          <Tooltip content="I'm a tooltip!" position="bottom">
            <button className="button">Bottom</button>
          </Tooltip>
        </div>
        <div className="column-6 column-mini-3">
          <Tooltip content="I'm a tooltip!" position="left">
            <button className="button">Left</button>
          </Tooltip>
        </div>
      </section>
    );
  }
}`}

              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<ToolTipExample />, document.getElementById('tooltip'));
