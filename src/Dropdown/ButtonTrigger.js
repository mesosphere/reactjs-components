import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ButtonTrigger extends Component {
  constructor() {
    super(...arguments);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.onAction(event);
  }

  getSelectedHtml(item) {
    if (item != null) {
      return item.selectedHtml || item.html;
    }

    return this.props.placeholder;
  }

  render() {
    const { className, disabled, selectedItem } = this.props;

    return (
      <button
        className={className}
        disabled={disabled}
        onClick={this.handleClick}
        type="button"
      >
        {this.getSelectedHtml(selectedItem)}
      </button>
    );
  }
}

ButtonTrigger.defaultProps = {
  className: "",
  disabled: false,
  onAction() {},
  placeholder: ""
};

ButtonTrigger.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onAction: PropTypes.function,
  placeholder: PropTypes.string
};
