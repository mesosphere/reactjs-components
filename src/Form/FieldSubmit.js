import classNames from "classnames/dedupe";
import React from "react";

import Util from "../Util/Util";

class FieldSubmit extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Util.isEqual(this.props, nextProps);
  }

  render() {
    const {
      buttonClass,
      columnWidth,
      buttonText,
      formGroupClass,
      handleSubmit,
      formElementClass
    } = this.props;

    const rowClass = classNames(
      `form-row-element column-${columnWidth}`,
      formElementClass
    );

    return (
      <div className={rowClass}>
        <div className={classNames(formGroupClass)}>
          <div className={classNames(buttonClass)} onClick={handleSubmit}>
            {buttonText}
          </div>
        </div>
      </div>
    );
  }
}

FieldSubmit.defaultProps = {
  buttonText: "Submit",
  handleSubmit() {}
};

const classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

FieldSubmit.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,

  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: React.PropTypes.func,

  // Text inside button
  buttonText: React.PropTypes.string,

  // Classes
  buttonClass: classPropType,
  formGroupClass: classPropType,
  formElementClass: classPropType
};

module.exports = FieldSubmit;
