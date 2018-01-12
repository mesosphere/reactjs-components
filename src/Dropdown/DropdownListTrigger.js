import React from "react";
import PropTypes from "prop-types";
import DropdownTrigger from "./DropdownTrigger";

export default class DropdownListTrigger extends DropdownTrigger {
  render() {
    const { className, disabled, selectedItem } = this.props;
    const html = selectedItem
      ? selectedItem.selectedHtml || selectedItem.html
      : this.props.placeholder || null;

    return (
      <button
        className={className}
        disabled={disabled}
        onClick={this.handleTrigger}
        type="button"
      >
        {html}
      </button>
    );
  }
}

DropdownListTrigger.defaultProps = {
  className: "",
  placeholder: "",
  selectedItem: null,
  onTrigger() {},
  disabled: false
};

DropdownListTrigger.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  selectedItem: PropTypes.object,
  onTrigger: PropTypes.func,
  disabled: PropTypes.bool
};
