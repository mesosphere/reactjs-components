import React from 'react';

import IconCode from './icons/IconCode';

class ComponentWrapper extends React.Component {
  render() {
    let {props} = this;
    return (
      <div>
        <section className="row canvas-pod">
          <div>
            <div className="row row-flex row-flex-align-vertical-center">
              <div className="column-12">
                <h2 className="component-title">
                  {props.title}
                  <a href={props.srcURI}>
                    <IconCode />
                  </a>
                </h2>
                {props.children}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

ComponentWrapper.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element)
  ]).isRequired,
  srcURI: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

module.exports = ComponentWrapper;
