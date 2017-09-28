import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";

import Modal from "../Modal/Modal";
import Util from "../Util/Util";

class Confirm extends React.Component {
  getButtons() {
    const disabledConfig = { disabled: this.props.disabled };

    const leftButtonClassName = classNames(this.props.leftButtonClassName);
    const rightButtonClassName = classNames(
      this.props.rightButtonClassName,
      disabledConfig
    );

    let extraAttributes = {};
    if (this.props.disabled) {
      extraAttributes = disabledConfig;
    }

    return (
      <div className="button-collection text-align-center flush-bottom">
        <button
          className={leftButtonClassName}
          onClick={this.props.leftButtonCallback}
        >
          {this.props.leftButtonText}
        </button>
        <button
          className={rightButtonClassName}
          onClick={this.props.rightButtonCallback}
          {...extraAttributes}
        >
          {this.props.rightButtonText}
        </button>
      </div>
    );
  }

  render() {
    const props = Util.exclude(
      this.props,
      "children",
      "disabled",
      "leftButtonText",
      "leftButtonClassName",
      "leftButtonCallback",
      "rightButtonText",
      "rightButtonClassName",
      "rightButtonCallback"
    );

    return (
      <Modal
        closeByBackdropClick={!this.props.disabled}
        modalClass="modal confirm-modal"
        showCloseButton={false}
        showFooter={true}
        footer={this.getButtons()}
        {...props}
      >
        {this.props.children}
      </Modal>
    );
  }
}

Confirm.defaultProps = {
  open: true,
  disabled: false,
  onClose() {},

  // Left button properties
  leftButtonText: "Cancel",
  leftButtonClassName: "button",
  leftButtonCallback() {},
  // Right button properties
  rightButtonText: "Confirm",
  rightButtonClassName: "button button-primary",
  rightButtonCallback() {}
};

Confirm.propTypes = {
  children: PropTypes.node.isRequired,

  open: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  // This will be triggered by backdrop click
  onClose: PropTypes.func,

  // Left button properties
  leftButtonText: PropTypes.string.isRequired,
  leftButtonClassName: PropTypes.string,
  leftButtonCallback: PropTypes.func.isRequired,
  // Right button properties
  rightButtonText: PropTypes.string.isRequired,
  rightButtonClassName: PropTypes.string,
  rightButtonCallback: PropTypes.func.isRequired
};

module.exports = Confirm;
