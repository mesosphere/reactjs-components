import React from 'react';

const Util = {
  getPropTypes(props) {
    return props.map(function (prop) {
      let propName = prop.name;
      let propType = prop.type;
      let propDefault = null;
      let propDescription = prop.description;

      if (prop.hasOwnProperty('default')) {
        propDefault = (
          <span>
            &mdash; default: <code>{prop.default}</code>
          </span>
        );
      }

      return (
        <p>
          <code>{propName}</code>
          &mdash; type: <code>{propType}</code>
          &mdash; type: <code>{propType}</code>
          {propDefault}
          {propDescription}
        </p>
      );
    });
  }
};

export default Util;
