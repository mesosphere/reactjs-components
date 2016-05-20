import classNames from 'classnames/dedupe';
import React from 'react';

class IconRadioButton extends React.Component {
  render() {
    let {checked, className, shadowClassName, smallCircleClassName} = this.props;
    let iconClasses = classNames('icon-radio-button', className);
    let shadowClasses = classNames(
      'shadow',
      {hidden: !checked},
      shadowClassName
    );
    let smallCircleClasses = classNames(
      'small-circle',
      {hidden: !checked},
      smallCircleClassName
    );

    return (
      <svg
        className={iconClasses}
        width="16"
        height="16"
        viewBox="0 0 16 16">
        <rect className="large-circle" width="16" height="16" rx="8"/>
        <rect className={shadowClasses} fillOpacity=".13" x="5" y="6" width="6" height="6" rx="8"/>
        <rect className={smallCircleClasses} x="5" y="5" width="6" height="6" rx="8"/>
      </svg>
    );
  }
}

let classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

IconRadioButton.propTypes = {
  checked: React.PropTypes.bool,

  // Classes
  className: classPropType,
  shadowClassName: classPropType,
  smallCircleClassName: classPropType
};

module.exports = IconRadioButton;
