import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import BindMixin from '../Mixin/BindMixin';
import DOMUtil from '../Util/DOMUtil';
import Portal from '../Portal/Portal';
import Util from '../Util/Util';

const ARROW_SIZE = 7;

class Tooltip extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'dismissTooltip',
      'getIdealLocation',
      'handleMouseEnter',
      'handleMouseLeave',
      'handleTooltipMouseEnter',
      'handleTooltipMouseLeave'
    ];
  }

  constructor() {
    super(...arguments);
    this.state = {isOpen: false};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.dismissTooltip);
    window.addEventListener('resize', this.dismissTooltip);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.dismissTooltip);
    window.removeEventListener('resize', this.dismissTooltip);
  }

  dismissTooltip() {
    this.setState({isOpen: false});
  }

  transformAnchor(anchor, clearanceStart, clearanceEnd, tooltipDimension,
    triggerDimension) {
    // Change the provided anchor based on the clearance available.
    if (anchor === 'start' && clearanceEnd < tooltipDimension) {
      return 'end';
    }

    if (anchor === 'end' && clearanceStart < tooltipDimension) {
      return 'start';
    }

    if (anchor === 'center') {
      let tooltipOverflow = (tooltipDimension - triggerDimension) / 2;

      if (clearanceStart < tooltipOverflow) {
        return 'start';
      }

      if (clearanceEnd < tooltipOverflow) {
        return 'end';
      }
    }

    return anchor;
  }

  getAnchor(isVertical, anchor, clearance, tooltipWidth, tooltipHeight,
    triggerRect) {
    // Calculate the ideal anchor.
    if (isVertical) {
      return this.transformAnchor(anchor, clearance.left, clearance.right,
        tooltipWidth, triggerRect.width);
    }

    return this.transformAnchor(anchor, clearance.top, clearance.bottom,
      tooltipHeight, triggerRect.height);
  }

  getCoordinates(triggerRect, position, clearance, tooltipWidth,
    tooltipHeight) {
    // Calculate the coordinates of the tooltip content.
    if (position === 'top') {
      return {
        left: triggerRect.left + triggerRect.width / 2,
        top: triggerRect.top - tooltipHeight + ARROW_SIZE
      };
    } else if (position === 'right') {
      return {
        left: triggerRect.right,
        top: triggerRect.top + triggerRect.height / 2
      };
    } else if (position === 'bottom') {
      return {
        left: triggerRect.left + triggerRect.width / 2,
        top: triggerRect.bottom
      };
    }

    return {
      left: triggerRect.left - tooltipWidth + ARROW_SIZE,
      top: triggerRect.top + triggerRect.height / 2
    };
  }

  isVertical(position) {
    if (position === 'left' || position === 'right') {
      return false;
    }

    return true;
  }

  getPosition(position, clearance, tooltipWidth, tooltipHeight) {
    // Change the position if the tooltip will be rendered off the screen.
    if (position === 'left' && clearance.left < tooltipWidth) {
      position = 'right';
    } else if (position === 'right' && clearance.right < tooltipWidth) {
      position = 'left';
    }

    if (position === 'top' && clearance.top < tooltipHeight) {
      position = 'bottom';
    } else if (position === 'bottom' && clearance.bottom < tooltipHeight) {
      position = 'top';
    }

    return position;
  }

  getIdealLocation(anchor, position) {
    let isVertical = this.isVertical(position);
    let triggerNode = ReactDOM.findDOMNode(this.refs.triggerNode);
    let tooltipNode = ReactDOM.findDOMNode(this.refs.tooltipNode);
    let triggerRect = triggerNode.getBoundingClientRect();
    let tooltipRect = tooltipNode.getBoundingClientRect();
    let viewportHeight = DOMUtil.getViewportHeight();
    let viewportWidth = DOMUtil.getViewportWidth();
    let tooltipHeight = tooltipRect.height + ARROW_SIZE;
    let tooltipWidth = tooltipRect.width + ARROW_SIZE;

    let clearance = {
      bottom: viewportHeight - triggerRect.bottom,
      left: triggerRect.left,
      right: viewportWidth - triggerRect.right,
      top: triggerRect.top
    };

    anchor = this.getAnchor(isVertical, anchor, clearance, tooltipWidth,
      tooltipHeight, triggerRect);
    position = this.getPosition(position, clearance, tooltipWidth,
      tooltipHeight);

    let coordinates = this.getCoordinates(triggerRect, position, clearance,
      tooltipWidth, tooltipHeight);

    return {anchor, position, coordinates};
  }

  handleMouseEnter(currentAnchor, currentPosition) {
    let {anchor, position, coordinates} = this.getIdealLocation(currentAnchor,
      currentPosition);
    this.setState({anchor, isOpen: true, position, coordinates});
  }

  handleMouseLeave() {
    this.dismissTooltip();
  }

  handleTooltipMouseEnter() {
    if (this.props.interactive) {
      this.setState({isOpen: true});
    }
  }

  handleTooltipMouseLeave() {
    this.dismissTooltip();
  }

  render() {
    let {props, state} = this;
    let tooltipStyle = {};

    // Get the anchor and position from state if possible. If not, get it from
    // the props.
    let anchor = state.anchor || props.anchor;
    let position = state.position || props.position;
    // Pass along any props that aren't specific to the Tooltip.
    let elementProps = Util.exclude(props, Object.keys(Tooltip.propTypes));

    let tooltipClasses = classnames(props.className, `anchor-${anchor}`,
      `position-${position}`, {
        'is-interactive': props.interactive,
        'is-open': state.isOpen,
        'no-wrap': !props.wrapText
      }
    );

    if (state.coordinates) {
      tooltipStyle = {
        left: state.coordinates.left,
        top: state.coordinates.top
      };
    }

    if (props.width) {
      tooltipStyle.width = `${props.width}px`;
    }

    if (props.maxWidth) {
      let maxWidth = props.maxWidth;

      if (typeof props.maxWidth === 'number') {
        maxWidth = `${maxWidth}px`;
      }

      tooltipStyle.maxWidth = maxWidth;
    }

    return (
      <props.elementTag className={props.wrapperClassName}
        onMouseEnter={this.handleMouseEnter.bind(this, props.anchor,
          props.position)}
        onMouseLeave={this.handleMouseLeave}
        {...elementProps} ref="triggerNode">
        {props.children}
        <Portal>
          <div className={tooltipClasses} ref="tooltipNode"
            style={tooltipStyle} onMouseEnter={this.handleTooltipMouseEnter}
            onMouseLeave={this.handleTooltipMouseLeave}>
            <div className={props.contentClassName}>
              {props.content}
            </div>
          </div>
        </Portal>
      </props.elementTag>
    );
  }
}

Tooltip.defaultProps = {
  anchor: 'center',
  className: 'tooltip',
  contentClassName: 'tooltip-content',
  elementTag: 'div',
  interactive: false,
  position: 'top',
  wrapperClassName: 'tooltip-wrapper text-align-center',
  wrapText: true
};

Tooltip.propTypes = {
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
  maxWidth: React.PropTypes.oneOf([React.PropTypes.number,
    React.PropTypes.string]),
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: React.PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  // Explicitly set the width of the tooltip. Default is auto.
  width: React.PropTypes.number,
  wrapperClassName: React.PropTypes.string,
  // Allow the text content to wrap. Default is true.
  wrapText: React.PropTypes.bool
};

module.exports = Tooltip;
