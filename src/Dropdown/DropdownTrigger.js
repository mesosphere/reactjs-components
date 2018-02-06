import { Component } from "react";
import PropTypes from "prop-types";

export default class DropdownTrigger extends Component {
  constructor() {
    super(...arguments);

    this.handleTrigger = this.handleTrigger.bind(this);
  }

  handleTrigger(event) {
    if (!this.props.disabled) {
      this.props.onTrigger(event);
    }
  }
}

DropdownTrigger.defaultProps = {
  onTrigger() {},
  disabled: false
};

DropdownTrigger.propTypes = {
  onTrigger: PropTypes.func,
  disabled: PropTypes.bool
};
