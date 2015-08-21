import React from 'react/addons';
let PropTypes = React.PropTypes;

export default class Portal extends React.Component {
  componentDidMount() {
    this.nodeEl = document.createElement('div');
    document.body.appendChild(this.nodeEl);
    this.renderChildren(this.props);
  }

  componentWillUnmount() {
    React.unmountComponentAtNode(this.nodeEl);
    document.body.removeChild(this.nodeEl);
  }

  componentWillReceiveProps(newProps) {
    this.renderChildren(newProps);
  }

  renderChildren(props) {
    React.render(props.children, this.nodeEl);
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired
};
