import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, {PropTypes} from 'react/addons';

import BindMixin from '../Mixin/BindMixin';
import Util from '../Util/Util';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class SidePanelContents extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleBackdropClick',
      'closeSidePanel'
    ];
  }

  constructor() {
    super();
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

    let classes = classNames(props.containerClass, props.className);

    return (
      <div className={classes}>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName="side-panel-fade-in"
          component="div">
          {this.getBackdrop()}
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName="side-panel-slide-left"
          component="div">
          {this.getContents()}
        </CSSTransitionGroup>
      </div>
    );
  }

}

SidePanelContents.defaultProps = {
  closeByBackdropClick: true,
  header: null,
  onClose: () => {},
  open: false,

  // Classes
  backdropClass: 'side-panel-backdrop',
  bodyClass: 'side-panel-content',
  containerClass: 'side-panel-container',
  headerClass: 'side-panel-header',
  headerContainerClass: 'side-panel-header-container container container-fluid container-fluid-narrow container-pod container-pod-short',
  sidePanelClass: 'side-panel side-panel-large flex-container-col container container-pod container-pod-short flush-top flush-bottom'
};

SidePanelContents.propTypes = {
  children: PropTypes.node,
  closeByBackdropClick: PropTypes.bool,
  header: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,

  // Classes.
  backdropClass: PropTypes.string,
  bodyClass: PropTypes.string,
  containerClass: PropTypes.string,
  headerClass: PropTypes.string,
  headerContainerClass: PropTypes.string,
  sidePanelClass: PropTypes.string
};
