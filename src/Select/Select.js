import React from "react";
import PropTypes from "prop-types";

import Dropdown from "../Dropdown/Dropdown";
import DropdownListTrigger from "../Dropdown/DropdownListTrigger";

export default class Select extends React.Component {
  buildItemsArray() {
    return React.Children.map(this.props.children, child => {
      return {
        html: child,
        id: child.props.value,
        selectedHtml: child.props.label || child.props.value,
        selectable: !child.props.disabled
      };
    });
  }

  handleInputChange(event) {
    this.props.onChange(event);
  }

  handleDropdownChange(selectedOption) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(this.input, selectedOption.id);

    if (this.input && this.input.current) {
      this.input.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <input
          className="dropdown-select-input-value"
          name={this.props.name}
          ref={input => (this.input = input)}
          style={{
            display: "none"
          }}
          value={this.props.value}
          onChange={this.handleInputChange.bind(this)}
        />
        <Dropdown
          items={this.buildItemsArray()}
          persistentID={
            this.props.value === "" && this.props.placeholder
              ? null
              : this.props.value
          }
          onItemSelection={this.handleDropdownChange.bind(this)}
          buttonClassName={"button dropdown-toggle"}
          dropdownMenuClassName={`${this.props.className} dropdown-menu`}
          dropdownMenuListClassName={"dropdown-menu-list"}
          dropdownMenuListItemClassName={"dropdown-menu-list-item"}
          wrapperClassName={"dropdown"}
          trigger={<DropdownListTrigger placeholder={this.props.placeholder} />}
        />
      </div>
    );
  }
}

Select.defaultProps = {
  className: "dropdown-select",
  onChange() {},
  name: null,
  placeholder: "",
  value: ""
};

Select.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
