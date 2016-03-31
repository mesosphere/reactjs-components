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
      'handleMouseLeave'
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
    // Transform the anchor based on the clearance available.
    let tooltipOverflow = tooltipDimension / 2 - triggerDimension / 2;
    let isStartOverflowing = clearanceStart < tooltipOverflow;
    let isEndOverflowing = clearanceEnd < tooltipOverflow;

    if (anchor === 'start' && clearanceEnd < tooltipDimension) {
      return 'end';
    } else if (anchor === 'end' && clearanceStart < tooltipDimension) {
      return 'start';
    } else if (anchor === 'center' && isStartOverflowing) {
      return 'start';
    } else if (anchor === 'center' && isEndOverflowing) {
      return 'end';
    }

    return anchor;
  }

  getAnchor(isVertical, anchor, clearance, tooltipWidth, tooltipHeight,
    triggerRect) {
    // Change the anchor if the tooltip will be rendered off the screen.
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
        top: triggerRect.top - tooltipHeight
      };
    } else if (position === 'right') {
      return {
        left: triggerRect.right + ARROW_SIZE,
        top: triggerRect.top + triggerRect.height / 2
      };
    } else if (position === 'bottom') {
      return {
        left: triggerRect.left + triggerRect.width / 2,
        top: triggerRect.bottom + ARROW_SIZE
      };
    }

    return {
      left: triggerRect.left - tooltipWidth,
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

    if (isVertical) {
      tooltipWidth = tooltipRect.width;
    } else {
      tooltipHeight = tooltipRect.height;
    }

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
        'wrap-text': props.wrapText
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

    return (
      <props.elementTag className={props.wrapperClassName}
        onMouseEnter={this.handleMouseEnter.bind(this, props.anchor,
          props.position)}
        onMouseLeave={this.handleMouseLeave}
        {...elementProps} ref="triggerNode">
        {props.children}
        <Portal>
          <div className={tooltipClasses} ref="tooltipNode"
            style={tooltipStyle}>
            {props.content}
          </div>
        </Portal>
      </props.elementTag>
    );
  }
}

Tooltip.defaultProps = {
  anchor: 'center',
  className: 'tooltip',
  elementTag: 'div',
  interactive: false,
  position: 'top',
  wrapperClassName: 'tooltip-wrapper text-align-center',
  wrapText: false
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
  // Allows user interaction on tooltips.
  interactive: React.PropTypes.bool,
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: React.PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  // Explicitly set the width of the tooltip. Default is auto.
  width: React.PropTypes.number,
  wrapperClassName: React.PropTypes.string,
  // Allow the text content to wrap. Default is false. This should be used with
  // the width property, because otherwise the width of the content will be the
  // same as the trigger.
  wrapText: React.PropTypes.bool
};

module.exports = Tooltip;
