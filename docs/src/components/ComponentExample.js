import classnames from 'classnames/dedupe';
import React from 'react';

class ComponentExample extends React.Component {
  render() {
    let classes = classnames('panel-cell', this.props.classNames);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

ComponentExample.propTypes = {
  children: React.PropTypes.node.isRequired,
  classNames: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ])
};

module.exports = ComponentExample;
