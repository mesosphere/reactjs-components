import React, { Component } from "react";

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

    return null;
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

export class InputTrigger extends ButtonTrigger {
  constructor() {
    super(...arguments);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.onChange(event);
  }
  getValue(item) {
    if (item === null) {
      return "Select…";
    }

    return item.selectedHtml || item.html;
  }
  render() {
    const { className, disabled, selectedItem } = this.props;

    return (
      <input
        className={className}
        disabled={disabled}
        onClick={this.handleClick}
        onChange={this.handleChange}
        type="text"
        value={this.getValue(selectedItem)}
      />
    );
  }
}
