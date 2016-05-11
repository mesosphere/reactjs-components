import React from 'react';
import ReactDOM from 'react-dom';

import Tooltip from '../../../src/Tooltip/Tooltip.js';

class ToolTipExample extends React.Component {
  render() {
    let tooltipContent = (
      <p className="text-color-white small flush-bottom">
        This tooltip is not interactive.
      </p>
    );
    let interactiveTooltipContent = (
      <div>
        <p className="text-color-white small">
          This tooltip is interactive, so the user is able to interact with its contents.
        </p>
        <p className="text-color-white small flush-bottom">
          Example: <a href="#">Back to Top</a>.
        </p>
      </div>
    );

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
  // The type of node rendered.
  elementTag: React.PropTypes.string,
  // Allows user interaction on tooltips. When false, the tooltip is dismissed
  // when the mouse leaves the trigger. When true, the mouse is allowed to enter
  // the tooltip. Default is false.
  interactive: React.PropTypes.bool,
  maxWidth: React.PropTypes.oneOfType([React.PropTypes.number,
    React.PropTypes.string]),
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: React.PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  // The nearest scrolling DOMNode that contains the tooltip. Default is window.
  // Also accepts a string, which will be treated as a selector for the node.
  scrollContainer: React.PropTypes.oneOfType([React.PropTypes.object,
    React.PropTypes.string]),
  // Keeps a tooltip open after it's triggered. Defaults to false.
  stayOpen: React.PropTypes.bool,
  // Prevents a tooltip from being displayed. Defaults to false.
  suppress: React.PropTypes.bool,
  // Explicitly set the width of the tooltip. Default is auto.
  width: React.PropTypes.number,
  wrapperClassName: React.PropTypes.string,
  // Allow the text content to wrap. Default is false.
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
                    <Tooltip content={tooltipContent} elementTag="button"
                      wrapperClassName="tooltip-wrapper text-align-center
                      button">
                      Top
                    </Tooltip>
                    <Tooltip content={tooltipContent} elementTag="button"
                      position="bottom" wrapperClassName="tooltip-wrapper
                      text-align-center button">
                      Bottom
                    </Tooltip>
                    <Tooltip content={interactiveTooltipContent}
                      elementTag="button" interactive={true} maxWidth={225}
                      position="left" wrapperClassName="tooltip-wrapper
                      text-align-center button" wrapText={true}>
                      Left
                    </Tooltip>
                    <Tooltip content={interactiveTooltipContent}
                      elementTag="button" interactive={true} maxWidth={225}
                      position="right" wrapperClassName="tooltip-wrapper
                      text-align-center button" wrapText={true}>
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
    let tooltipContent = (
      <p className="text-color-white small flush-bottom">
        This tooltip is not interactive.
      </p>
    );
    let interactiveTooltipContent = (
      <div>
        <p className="text-color-white small">
          This tooltip is interactive, so the user is able to interact with its contents.
        </p>
        <p className="text-color-white small flush-bottom">
          Example: <a href="#">Back to Top</a>.
        </p>
      </div>
    );

    return (
      <section className="row canvas-pod">
        <div className="column-12 column-mini-12">
          <div className="button-collection">
            <Tooltip content={tooltipContent} elementTag="button"
              wrapperClassName="tooltip-wrapper text-align-center
              button">
              Top
            </Tooltip>
            <Tooltip content={tooltipContent} elementTag="button"
              position="bottom" wrapperClassName="tooltip-wrapper
              text-align-center button">
              Bottom
            </Tooltip>
            <Tooltip content={interactiveTooltipContent}
              elementTag="button" interactive={true} maxWidth={225}
              position="left" wrapperClassName="tooltip-wrapper
              text-align-center button">
              Left
            </Tooltip>
            <Tooltip content={interactiveTooltipContent}
              elementTag="button" interactive={true} maxWidth={225}
              position="right" wrapperClassName="tooltip-wrapper
              text-align-center button">
              Right
            </Tooltip>
          </div>
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
