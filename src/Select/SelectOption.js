import React from "react";
import PropTypes from "prop-types";

class SelectOption extends React.Component {
  render() {
    return (
      <div>{this.props.children || this.props.label || this.props.value}</div>
    );
  }
}
SelectOption.defaultProps = {
  value: null,
  label: null,
  disabled: false,
  selected: false
};
SelectOption.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  selected: PropTypes.bool
};

module.exports = SelectOption;
