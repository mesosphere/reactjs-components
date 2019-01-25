import classnames from "classnames";
import React from "react";
import PropTypes from "prop-types";

import BindMixin from "../Mixin/BindMixin";
import DOMUtil from "../Util/DOMUtil";
import Portal from "../Portal/Portal";
import Util from "../Util/Util";

const ARROW_SIZE = 7;

class Tooltip extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      "dismissTooltip",
      "getIdealLocation",
      "handleMouseEnter",
      "handleMouseLeave",
      "handleTooltipMouseEnter",
      "handleTooltipMouseLeave",
      "triggerClose"
    ];
  }

  constructor() {
    super(...arguments);
    this.state = { isOpen: false, wasTriggeredClose: false };
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  handleMouseEnter(options = {}) {
    const { props } = this;

    if (props.suppress && !options.forceOpen) {
      return;
    }

    const { anchor, position, coordinates } = this.getIdealLocation(
      props.anchor,
      props.position
    );

    this.setState({
      anchor,
      isOpen: true,
      position,
      coordinates,
      wasTriggeredClose: false
    });
    this.addScrollListener();
  }

  handleMouseLeave() {
    this.dismissTooltip();
  }

  handleTooltipMouseEnter() {
    if (this.props.interactive && !this.state.wasTriggeredClose) {
      this.setState({ isOpen: true });
      this.addScrollListener();
    }
  }

  handleTooltipMouseLeave() {
    this.dismissTooltip();
  }

  addScrollListener() {
    global.addEventListener("scroll", this.dismissTooltip, true);
  }

  dismissTooltip(options = {}) {
    if ((!this.props.stayOpen || options.forceClose) && this.state.isOpen) {
      this.setState({ isOpen: false });
      this.removeScrollListener();
    }
  }

  getAnchor(isVertical, anchor, clearance, tooltipWidth, tooltipHeight) {
    // Calculate the ideal anchor.
    if (isVertical) {
      return this.transformAnchor(
        anchor,
        clearance.left,
        clearance.right,
        tooltipWidth,
        clearance.boundingRect.width
      );
    }

    return this.transformAnchor(
      anchor,
      clearance.top,
      clearance.bottom,
      tooltipHeight,
      clearance.boundingRect.height
    );
  }

  getCoordinates(position, clearance, tooltipWidth, tooltipHeight) {
    // Calculate the coordinates of the tooltip content.
    if (position === "top") {
      return {
        left: clearance.boundingRect.left + clearance.boundingRect.width / 2,
        top: clearance.boundingRect.top - tooltipHeight + ARROW_SIZE
      };
    } else if (position === "right") {
      return {
        left: clearance.boundingRect.right,
        top: clearance.boundingRect.top + clearance.boundingRect.height / 2
      };
    } else if (position === "bottom") {
      return {
        left: clearance.boundingRect.left + clearance.boundingRect.width / 2,
        top: clearance.boundingRect.bottom
      };
    }

    return {
      left: clearance.boundingRect.left - tooltipWidth + ARROW_SIZE,
      top: clearance.boundingRect.top + clearance.boundingRect.height / 2
    };
  }

  isVertical(position) {
    return position !== "left" && position !== "right";
  }

  getPosition(position, clearance, tooltipWidth, tooltipHeight) {
    // Change the position if the tooltip will be rendered off the screen.
    if (position === "left" && clearance.left < tooltipWidth) {
      position = "right";
    } else if (position === "right" && clearance.right < tooltipWidth) {
      position = "left";
    }

    if (position === "top" && clearance.top < tooltipHeight) {
      position = "bottom";
    } else if (position === "bottom" && clearance.bottom < tooltipHeight) {
      position = "top";
    }

    return position;
  }

  getIdealLocation(anchor, position) {
    if (!this.triggerNode || !this.tooltipNode) {
      return {
        anchor: "center",
        position: "top",
        coordinates: { left: 0, top: 0 }
      };
    }

    const isVertical = this.isVertical(position);
    const clearance = DOMUtil.getNodeClearance(this.triggerNode);
    const tooltipRect = this.tooltipNode.getBoundingClientRect();
    const tooltipHeight = tooltipRect.height + ARROW_SIZE;
    const tooltipWidth = tooltipRect.width + ARROW_SIZE;

    anchor = this.getAnchor(
      isVertical,
      anchor,
      clearance,
      tooltipWidth,
      tooltipHeight
    );
    position = this.getPosition(
      position,
      clearance,
      tooltipWidth,
      tooltipHeight
    );

    const coordinates = this.getCoordinates(
      position,
      clearance,
      tooltipWidth,
      tooltipHeight
    );

    return { anchor, position, coordinates };
  }

  removeScrollListener() {
    global.removeEventListener("scroll", this.dismissTooltip, true);
  }

  triggerClose() {
    this.setState({ wasTriggeredClose: true });
    this.dismissTooltip({ forceClose: true });
  }

  triggerOpen() {
    this.handleMouseEnter({ forceOpen: true });
  }

  transformAnchor(
    anchor,
    clearanceStart,
    clearanceEnd,
    tooltipDimension,
    triggerDimension
  ) {
    // Change the provided anchor based on the clearance available.
    if (anchor === "start" && clearanceEnd < tooltipDimension) {
      return "end";
    }

    if (anchor === "end" && clearanceStart < tooltipDimension) {
      return "start";
    }

    if (anchor === "center") {
      const tooltipOverflow = (tooltipDimension - triggerDimension) / 2;

      if (clearanceStart < tooltipOverflow) {
        return "start";
      }

      if (clearanceEnd < tooltipOverflow) {
        return "end";
      }
    }

    return anchor;
  }

  render() {
    const { props, state } = this;
    let tooltipStyle = {};

    // Get the anchor and position from state if possible. If not, get it from
    // the props.
    const anchor = state.anchor || props.anchor;
    const position = state.position || props.position;
    // Pass along any props that aren't specific to the Tooltip.
    const elementProps = Util.exclude(props, Object.keys(Tooltip.propTypes));

    const tooltipClasses = classnames(
      props.className,
      `anchor-${anchor}`,
      `position-${position}`,
      {
        "is-interactive": props.interactive,
        "is-open": state.isOpen,
        "no-wrap": !props.wrapText
      }
    );

    if (state.coordinates) {
      tooltipStyle = {
        left: state.coordinates.left,
        top: state.coordinates.top
      };
    }

    if (props.width) {
      tooltipStyle.width = props.width;
    }

    if (props.maxWidth) {
      tooltipStyle.maxWidth = props.maxWidth;
    }

    return (
      <props.elementTag
        className={props.wrapperClassName}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...elementProps}
        ref={el => (this.triggerNode = el)}
      >
        {props.children}
        <Portal>
          <div
            className={tooltipClasses}
            ref={el => (this.tooltipNode = el)}
            style={tooltipStyle}
            onMouseEnter={this.handleTooltipMouseEnter}
            onMouseLeave={this.handleTooltipMouseLeave}
          >
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
  anchor: "center",
  className: "tooltip",
  contentClassName: "tooltip-content",
  elementTag: "div",
  interactive: false,
  position: "top",
  stayOpen: false,
  suppress: false,
  wrapperClassName: "tooltip-wrapper text-align-center",
  wrapText: false
};

Tooltip.propTypes = {
  // Anchor the tooltip to an edge of the tooltip trigger. Start and end refer
  // to the logical respective edges of the tooltip. When tooltip is positioned
  // on the right, start refers to the top of the tooltip. When tooltip is
  // positioned on the bottom, start refers to the left edge of the tooltip.
  anchor: PropTypes.oneOf(["start", "center", "end"]),
  // The children will be used as the trigger.
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  // The tooltip's content.
  content: PropTypes.node.isRequired,
  // The type of node rendered.
  elementTag: PropTypes.string,
  // Allows user interaction on tooltips. When false, the tooltip is dismissed
  // when the mouse leaves the trigger. When true, the mouse is allowed to enter
  // the tooltip. Default is false.
  interactive: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: PropTypes.oneOf(["top", "bottom", "right", "left"]),
  // Keeps a tooltip open after it's triggered. Defaults to false.
  stayOpen: PropTypes.bool,
  // Prevents a tooltip from being displayed. Defaults to false.
  suppress: PropTypes.bool,
  // Explicitly set the width of the tooltip. Default is auto.
  width: PropTypes.number,
  wrapperClassName: PropTypes.string,
  // Allow the text content to wrap. Default is false.
  wrapText: PropTypes.bool,
  contentClassName: PropTypes.string
};

module.exports = Tooltip;
