import classNames from 'classnames';
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

    let buttonClassSet = classNames({
      [buttonClass]: !!buttonClass
    });

    return (
      <div className={rowClass}>
        <div className={formGroupClass}>
          <div className={buttonClassSet}
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

FieldSubmit.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,

  // Function to handle when form is submitted
  // (usually passed down from form definition)
  handleSubmit: React.PropTypes.func,

  // Text inside button
  buttonText: React.PropTypes.string,

  // Classes
  buttonClass: React.PropTypes.string,
  formGroupClass: React.PropTypes.string,
  formElementClass: React.PropTypes.string
};

module.exports = FieldSubmit;
