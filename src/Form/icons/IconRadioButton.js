import classNames from 'classnames/dedupe';
import React from 'react';

class IconRadioButton extends React.Component {
  render() {
    let {checked, className, shadowClassName, radioDotClassName} = this.props;
    let iconClasses = classNames('icon-radio-button', className);
    let shadowClasses = classNames(
      'icon-radio-button-shadow',
      {'hidden-up': !checked},
      shadowClassName
    );
    let radioDotClasses = classNames(
      'icon-radio-button-dot',
      {'hidden-up': !checked},
      radioDotClassName
    );

    return (
      <svg className={iconClasses} width="16" height="16" viewBox="0 0 16 16">
        <rect
          className={shadowClasses}
          fillOpacity=".13"
          x="5"
          y="6"
          width="6"
          height="6"
          rx="8" />
        <rect
          className={radioDotClasses}
          x="5"
          y="5"
          width="6"
          height="6"
          rx="8" />
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
  radioDotClassName: classPropType
};

module.exports = IconRadioButton;
