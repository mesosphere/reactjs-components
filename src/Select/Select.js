import React from "react";
import PropTypes from "prop-types";

import Dropdown from "../Dropdown/Dropdown";
import DropdownListTrigger from "../Dropdown/DropdownListTrigger";

class Select extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      value: this.getInitialValue()
    };
  }

  buildItemsArray() {
    return React.Children.map(this.props.children, child => {
      return {
        html: child,
        id: child.props.value,
        selectedHtml: child.props.label,
        selectable: !child.props.disabled
      };
    });
  }

  getInitialValue() {
    const children = React.Children.toArray(this.props.children);
    const selectedChild = children.find(child => child.props.selected === true);

    if (selectedChild) {
      return selectedChild.props.value;
    }

    // if placeholder is set, we can return null
    if (this.props.placeholder !== "") {
      return null;
    }

    // if not, we need to return a value. (legacy)
    return children[0].props.value;
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
          className="dropdown-select input-value"
          name={this.props.name}
          ref={input => (this.input = input)}
          style={{
            display: "none"
          }}
          value={this.state.value}
          onChange={this.handleInputChange.bind(this)}
        />
        <Dropdown
          items={this.buildItemsArray()}
          initialID={this.state.value}
          onItemSelection={this.handleDropdownChange.bind(this)}
          buttonClassName={"button dropdown-toggle"}
          dropdownMenuClassName={"dropdown-menu"}
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
  placeholder: ""
};

Select.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string
};

module.exports = Select;
