import classNames from "classnames/dedupe";
import React from "react";
import PropTypes from "prop-types";

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

const classPropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.string
]);

FieldSubmit.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: PropTypes.number.isRequired,

  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: PropTypes.func,

  // Text inside button
  buttonText: PropTypes.string,

  // Classes
  buttonClass: classPropType,
  formGroupClass: classPropType,
  formElementClass: classPropType
};

module.exports = FieldSubmit;
