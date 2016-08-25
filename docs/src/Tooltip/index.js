import React from 'react';
import ReactDOM from 'react-dom';

import CodeBlock from '../components/CodeBlock';
import ComponentExample from '../components/ComponentExample';
import ComponentExampleWrapper from '../components/ComponentExampleWrapper';
import ComponentWrapper from '../components/ComponentWrapper';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';
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
      <ComponentWrapper title="Tooltip" srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Tooltip/Tooltip.js">
        <p className="lead">
          A tooltip appears when a user hover overs an element. The tooltips will adjust their position if the supplied positioning results in the tooltip rendering outside of the veiwport.
        </p>
        <p>
          The tooltip allows users to set the position and anchor. Position refers to the position of the tooltip relative to its trigger (which is its children), and acceptable values are top, right, bottom, and left. Anchor refers to where the tooltip is anchored on the triggered element, and acceptable values are start, center, and end. Think of flexbox alignment when thinking about the start and end values.
        </p>
        <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/Tooltip/Tooltip.js)'} />
        <ComponentExampleWrapper>
          <ComponentExample>
            <p>
              Hover over the following buttons to observe the behavior
              of the tooltips.
            </p>
            <div className="button-collection flush">
              <Tooltip content={tooltipContent} elementTag="button"
                scrollContainer={this.props.scrollContainer}
                wrapperClassName="tooltip-wrapper text-align-center
                button">
                Top
              </Tooltip>
              <Tooltip content={tooltipContent} elementTag="button"
                scrollContainer={this.props.scrollContainer}
                position="bottom" wrapperClassName="tooltip-wrapper
                text-align-center button">
                Bottom
              </Tooltip>
              <Tooltip content={interactiveTooltipContent}
                elementTag="button" interactive={true} maxWidth={225}
                scrollContainer={this.props.scrollContainer}
                position="left" wrapperClassName="tooltip-wrapper
                text-align-center button" wrapText={true}>
                Left
              </Tooltip>
              <Tooltip content={interactiveTooltipContent}
                elementTag="button" interactive={true} maxWidth={225}
                scrollContainer={this.props.scrollContainer}
                position="right" wrapperClassName="tooltip-wrapper
                text-align-center button" wrapText={true}>
                Right
              </Tooltip>
            </div>
          </ComponentExample>
          <CodeBlock>
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
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }

}

module.exports = ToolTipExample;
