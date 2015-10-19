/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

const Util = {

  // Pass in an array of objects.
  // Ex:
  // {
  //   name: 'open',
  //   type: 'bool',
  //   default: 'false', (this property is optional. don't use if there is no default)
  //   description: 'To open or not to open... that is the question.'
  // }
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
