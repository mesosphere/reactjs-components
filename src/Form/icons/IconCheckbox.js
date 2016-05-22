import classNames from 'classnames/dedupe';
import React from 'react';

class IconCheckbox extends React.Component {
  render() {
    let {checked, className, indeterminate} = this.props;
    let iconClasses = classNames(className);

    let checkIconClasses = classNames('icon', {
      hidden: !checked || indeterminate
    });

    let indeterminateIconClasses = classNames('icon', {
      hidden: !indeterminate
    });

    return (
      <svg className={iconClasses} viewBox="0 0 16 16">
        <g className={indeterminateIconClasses}>
          <path d="M5,9.75 L11,9.75 C11.4142136,9.75 11.75,9.41421356 11.75,9 C11.75,8.58578644 11.4142136,8.25 11,8.25 L5,8.25 C4.58578644,8.25 4.25,8.58578644 4.25,9 C4.25,9.41421356 4.58578644,9.75 5,9.75 L5,9.75 Z" fill="#000000" fillOpacity="0.13" />
          <path d="M5,8.75 L11,8.75 C11.4142136,8.75 11.75,8.41421356 11.75,8 C11.75,7.58578644 11.4142136,7.25 11,7.25 L5,7.25 C4.58578644,7.25 4.25,7.58578644 4.25,8 C4.25,8.41421356 4.58578644,8.75 5,8.75 L5,8.75 Z" fill="#ffffff" />
        </g>
        <g className={checkIconClasses}>
          <path d="M6.37547375,12.4433526 C6.66651906,12.8810343 7.30583183,12.8913338 7.61082475,12.4632544 L12.0274757,6.26416941 C12.2678262,5.92682021 12.1891933,5.45850202 11.8518441,5.21815145 C11.5144949,4.97780088 11.0461767,5.0564338 10.8058262,5.393783 L7.02648971,10.7134266 L5.62452625,8.60511675 C5.39516713,8.26020042 4.92962491,8.1665228 4.58470858,8.39588191 C4.23979226,8.62524103 4.14611463,9.09078326 4.37547375,9.43569958 L6.37547375,12.4433526 Z" fill="#000000" fillOpacity="0.13" />
          <path d="M6.37547375,11.4433526 C6.66651906,11.8810343 7.30583183,11.8913338 7.61082475,11.4632544 L12.0274757,5.26416941 C12.2678262,4.92682021 12.1891933,4.45850202 11.8518441,4.21815145 C11.5144949,3.97780088 11.0461767,4.0564338 10.8058262,4.393783 L7.02648971,9.71342659 L5.62452625,7.60511675 C5.39516713,7.26020042 4.92962491,7.1665228 4.58470858,7.39588191 C4.23979226,7.62524103 4.14611463,8.09078326 4.37547375,8.43569958 L6.37547375,11.4433526 Z" fill="#ffffff" />
        </g>
      </svg>
    );
  }
}

let classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

IconCheckbox.propTypes = {
  checked: React.PropTypes.bool,
  indeterminate: React.PropTypes.bool,

  // Classes
  className: classPropType
};

module.exports = IconCheckbox;
