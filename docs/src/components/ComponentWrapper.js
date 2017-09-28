import React from "react";
import PropTypes from "prop-types";

import IconCode from "./icons/IconCode";

class ComponentWrapper extends React.Component {
  render() {
    const { props } = this;

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
  children: PropTypes.node.isRequired,
  srcURI: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

module.exports = ComponentWrapper;
