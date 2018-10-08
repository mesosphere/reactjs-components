import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

class Portal extends React.Component {
  componentDidMount() {
    this.nodeEl = document.createElement("div");
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
    // Compatibility notice: This component will need to be restructured
    // once this API goes away in favor of React.createPortal (16+)
    // The issue is that there is no render callback in that API
    // so props.onRender will need to be called in some other way.
    return ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      props.children,
      this.nodeEl,
      props.onRender
    );
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  onRender: PropTypes.func
};

module.exports = Portal;
