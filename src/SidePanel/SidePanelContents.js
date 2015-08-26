import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react/addons';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;
const METHODS_TO_BIND = ['handleBackdropClick', 'closeSidePanel'];

export default class SidePanel extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    this.checkRerendered();
  }

  componentDidUpdate() {
    this.checkRerendered();
  }

  checkRerendered() {
    let open = this.props.open;
    if (open && !this.rerendered) {
      // Trigger another render on first render cycle
      this.rerendered = true;
      this.forceUpdate();
    } else if (!open) {
      // Reset rerendered whenever we want to close
      this.rerendered = false;
    }
  }

  closeSidePanel() {
    this.props.onClose();
  }

  handleBackdropClick() {
    if (this.props.closeByBackdropClick) {
      this.closeSidePanel();
    }
  }

  getBackdrop() {
    let props = this.props;

    if (!props.open) {
      return null;
    }

    return (
      <div
        className={props.backdropClass}
        onClick={this.handleBackdropClick}>
      </div>
    );
  }

  getHeader() {
    let props = this.props;

    if (props.header == null) {
      return null;
    }

    return (
      <div className={props.headerClass}>
        <div className={props.headerContainerClass}>
          {props.header}
        </div>
      </div>
    );
  }

  getContents() {
    let props = this.props;

    if (!props.open) {
      return null;
    }

    let contents = (
      <div className={props.bodyClass}>
        {props.children}
      </div>
    );

    if (this.rerendered) {
      // Wrap in scrollbar after first render
      contents = (
        <GeminiScrollbar
          autoshow={true}
          className={props.bodyClass}>
          {props.children}
        </GeminiScrollbar>
      );
    }

    return (
      <div className={props.sidePanelClass}>
        {this.getHeader()}
        {contents}
      </div>
    );
  }

  render() {
    let props = this.props;

    let classes = classNames(props.containerClass, props.classNames);

    return (
      <div className={classes}>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName="fade-in"
          component="div">
          {this.getBackdrop()}
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName="slide-left"
          component="div">
          {this.getContents()}
        </CSSTransitionGroup>
      </div>
    );
  }

}

SidePanel.defaultProps = {
  closeByBackdropClick: true,
  header: null,
  onClose: () => {},
  open: false,

  // Classes
  backdropClass: 'side-panel-backdrop',
  bodyClass: 'side-panel-content container container-scrollable container-fluid container-fluid-narrow',
  containerClass: 'side-panel-container',
  headerClass: 'side-panel-header',
  headerContainerClass: 'container container-pod container-pod-short',
  sidePanelClass: 'side-panel side-panel-large flex-container-col container container-pod container-pod-short flush-top'
};

SidePanel.propTypes = {
  children: React.PropTypes.node,
  closeByBackdropClick: React.PropTypes.bool,
  header: React.PropTypes.node,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,

  // Classes
  backdropClass: React.PropTypes.string,
  bodyClass: React.PropTypes.string,
  containerClass: React.PropTypes.string,
  headerClass: React.PropTypes.string,
  headerContainerClass: React.PropTypes.string,
  sidePanelClass: React.PropTypes.string
};
