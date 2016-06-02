import classNames from 'classnames/dedupe';
import React from 'react';

class FieldSubmit extends React.Component {

  render() {
    let {
      buttonClass, columnWidth, buttonText, formGroupClass, handleSubmit,
      formElementClass
    } = this.props;

    let rowClass = classNames(
      `column-${columnWidth}`,
      formElementClass
    );

    return (
      <div className={rowClass}>
        <div className={classNames(formGroupClass)}>
          <div className={classNames(buttonClass)}
            onClick={handleSubmit}>
            {buttonText}
          </div>
        </div>
      </div>
    );
  }

}

FieldSubmit.defaultProps = {
  buttonText: 'Submit',
  formElementClass: 'form-row-element',
  handleSubmit: function () {}
};

let classPropType = React.PropTypes.oneOfType([
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
