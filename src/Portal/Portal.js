import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
  componentDidMount() {
    this.nodeEl = document.createElement('div');
    document.body.appendChild(this.nodeEl);
    this.renderChildren(this.props);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.nodeEl);
    document.body.removeChild(this.nodeEl);
  }

  componentWillReceiveProps(nextProps) {
    this.renderChildren(nextProps);
  }

  renderChildren(props) {
    let {children} = props;

    if (children == null) {
      children = <div />;
    }

    ReactDOM.render(children, this.nodeEl, this.props.onRender);
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.node,
  onRender: PropTypes.func
};

module.exports = Portal;
