import React from 'react';

import IconCode from './icons/IconCode';

class ComponentWrapper extends React.Component {
  render() {
    let {props} = this;
    return (
      <section>
        <h2 className="component-title">
          {props.title}
          <a href={props.srcURI}>
            <IconCode />
          </a>
        </h2>
        {props.children}
      </section>
    );
  }
}

ComponentWrapper.propTypes = {
  children: React.PropTypes.node.isRequired,
  srcURI: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

module.exports = ComponentWrapper;
