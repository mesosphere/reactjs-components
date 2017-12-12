import React from "react";
import PropTypes from "prop-types";

import Dropdown from "../Dropdown/Dropdown";
import DropdownListTrigger from "../Dropdown/DropdownListTrigger";

export default class Select extends React.Component {
  buildItemsArray() {
    return React.Children.map(this.props.children, child => {
      if (this.props.selected) {
        console.warn(
          "The 'selected' attribute is ignored on children of <Select />, use 'value' instead in the Select."
        );
      }

      return {
        html: child.props.children,
        id: child.props.value,
        selectedHtml: child.props.value,
        selectable: !child.props.disabled
      };
    });
  }

  handleInputChange(event) {
    this.props.onChange(event);
  }

  handleDropdownChange(selectedOption) {
    const event = new Event("input", { bubbles: true });

    this.setState({ value: selectedOption.id });

    this.input.value = selectedOption.id;
    this.input.dispatchEvent(event);
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
          initialID={
            this.props.value === "" && this.props.placeholder
              ? null
              : this.props.value
          }
          onItemSelection={this.handleDropdownChange.bind(this)}
          buttonClassName={"button dropdown-toggle"}
          dropdownMenuClassName={"dropdown-menu dropdown-select"}
          dropdownMenuListClassName={"dropdown-menu-list dropdown-select-list"}
          dropdownMenuListItemClassName={
            "dropdown-menu-list-item dropdown-select-list-item"
          }
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
  value: "",
  placeholder: ""
};

Select.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string
};
