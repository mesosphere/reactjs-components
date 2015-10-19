/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

const Util = {
  getPropTypes(props) {
    return props.map(function (prop, i) {
    let propName = prop.name;
    let propType = prop.type;
    let propDefault = null;
    let propDescription = prop.description;

    if (prop.hasOwnProperty('default')) {
      propDefault = (
        <span>
          &nbsp; &mdash; default: <code>{prop.default}</code>
        </span>
      );
    }

    return (
      <p key={i}>
        <code>{propName}</code>
        &nbsp; &mdash; type: <code>{propType}</code>
        {propDefault}
        &nbsp; &mdash; {propDescription}
      </p>
    );
  });
  }
};

export default Util;
