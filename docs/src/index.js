import classnames from "classnames";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import ReactDOM from "react-dom";

import BindMixin from "../../src/Mixin/BindMixin";
import ConfirmExample from "./Confirm";
import DOMUtil from "../../src/Util/DOMUtil";
import DropdownExample from "./Dropdown";
import SelectExample from "./Select";
import FormExample from "./Form";
import ListExample from "./List";
import ModalExample from "./Modal";
import TableExample from "./Table";
import TooltipExample from "./Tooltip";
import Util from "../../src/Util/Util";

import "./vendor/prettify.js";

const navigationItems = [
  {
    label: "Dropdown",
    id: "dropdown",
    component: DropdownExample,
    passScrollContainer: true
  },
  {
    label: "Select",
    id: "select",
    component: SelectExample,
    passScrollContainer: false
  },
  {
    label: "Form",
    id: "form",
    component: FormExample,
    passScrollContainer: false
  },
  {
    label: "List",
    id: "list",
    component: ListExample,
    passScrollContainer: false
  },
  {
    label: "Table",
    id: "table",
    component: TableExample,
    passScrollContainer: false
  },
  {
    label: "Modal",
    id: "modal",
    component: ModalExample,
    passScrollContainer: false
  },
  {
    label: "Confirm",
    id: "confirm",
    component: ConfirmExample,
    passScrollContainer: false
  },
  {
    label: "Tooltip",
    id: "tooltip",
    component: TooltipExample,
    passScrollContainer: true
  }
];

class Docs extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return ["handlePageScroll", "calculateNodePositions"];
  }

  constructor() {
    super();

    this.nodeRefs = {
      sectionRefs: {}
    };
    this.sectionScrollPositions = {};
    this.state = {
      activeSection: null,
      pageRef: null
    };
    this.viewportHeight = 0;
  }

  componentDidMount() {
    window.addEventListener("resize", this.calculateNodePositions);
  }

  componentDidUpdate() {
    this.calculateNodePositions();
  }

  handleNavigationClick(id) {
    const { pageRef } = this.state;
    const sectionPosition = this.sectionScrollPositions[id];

    if (pageRef && sectionPosition != null) {
      pageRef.scrollTop = sectionPosition;
    }
  }

  handlePageScroll() {
    let activeSection = null;
    const pageScrollTop = this.state.pageRef.scrollTop;
    const scrollThreshhold = pageScrollTop + this.viewportHeight / 2;

    Object.keys(this.sectionScrollPositions).forEach(ref => {
      const nodePosition = this.sectionScrollPositions[ref];
      if (scrollThreshhold > nodePosition) {
        activeSection = ref;
      }
    });

    if (activeSection !== this.state.activeSection) {
      this.setState({ activeSection });
    }
  }

  setPageRef(pageRef) {
    if (this.state.pageRef === null) {
      this.setState({ pageRef });
    }
  }

  calculateNodePositions() {
    const pageHeaderHeight = this.nodeRefs.pageHeader.offsetHeight;
    this.viewportHeight = DOMUtil.getViewportHeight();

    Object.keys(this.nodeRefs.sectionRefs).forEach(ref => {
      const top = this.nodeRefs.sectionRefs[ref].offsetTop + pageHeaderHeight;
      this.sectionScrollPositions[ref] = top;
    });
  }

  getNavigationItems() {
    const items = navigationItems.map((item, index) => {
      const classes = classnames({
        selected: this.state.activeSection === item.id
      });

      return (
        <li className={classes} key={index}>
          <a onClick={this.handleNavigationClick.bind(this, item.id)}>
            {item.label}
          </a>
        </li>
      );
    });

    return (
      <ul id="page-content-navigation" className="sidebar-menu list-unstyled">
        {items}
      </ul>
    );
  }

  render() {
    let docsContent = null;
    const { pageRef } = this.state;

    // Delay the rendering of the components until we have a reference to the
    // scrolling container's DOM node.
    if (pageRef !== null) {
      docsContent = navigationItems.map((navigationItem, index) => {
        const { id, passScrollContainer } = navigationItem;
        const props = {};

        if (passScrollContainer) {
          props.scrollContainer = pageRef;
        }

        return (
          <div
            key={index}
            ref={ref => {
              this.nodeRefs.sectionRefs[id] = ref;
            }}
          >
            <navigationItem.component {...props} />
          </div>
        );
      });
    }

    return (
      <div
        id="canvas"
        className="canvas flex flex-direction-top-to-bottom flex-direction-left-to-right-screen-medium flex-item-grow-1"
      >
        <div className="sidebar custom-scrollbar flex flex-direction-top-to-bottom flex-item-shrink-0">
          <nav className="navigation fill">
            <div className="navigation-inner">
              <div className="container-fluid-narrow pod pod-narrow flush-bottom">
                {this.getNavigationItems()}
              </div>
            </div>
          </nav>
        </div>
        <div
          className="page flex-item-grow-1"
          id="page"
          onScroll={this.handlePageScroll}
          ref={ref => this.setPageRef(ref)}
        >
          <div
            id="page-header"
            className="page-header fill fill-light left"
            ref={ref => (this.nodeRefs.pageHeader = ref)}
          >
            <div id="page-header-inner" className="page-header-inner">
              <div className="container-fluid pod">
                <div className="row">
                  <div className="column-small-8 column-medium-8 column-large-10">
                    <h1 className="page-header-headline flush-top text-align-left short">
                      ReactJS Components
                    </h1>
                    <p className="page-header-description lead text-align-left flush-bottom">
                      A library of reusable React components.
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="https://github.com/mesosphere/reactjs-components"
                className="github-corner"
              >
                <svg className="octocat" viewBox="0 0 150 125">
                  <path
                    className="octocat-tail"
                    d="M63.71,111.33c-16.83,3.68-20.29-7.14-20.29-7.14-2.76-7-6.72-8.84-6.72-8.84-5.59-3.75.42-3.68,0.42-3.68,6,0.49,9.26,6.29,9.26,6.29,5.44,9.12,13.93,6.72,17.54,4.95"
                  />
                  <path
                    className="octocat-body"
                    d="M58.55,125c0,0.14,3.68-1.56,3.68-3.11l0.07-19.59c0.57-4,2.12-6.65,3.89-8.13C52.75,92.6,38.68,87.43,38.61,64.31A23.51,23.51,0,0,1,44.9,48.12c-0.71-1.56-2.76-7.71.57-16,0,0,5-1.63,16.62,6.15a58.66,58.66,0,0,1,15.06-2.05,54.32,54.32,0,0,1,15.13,2.12c11.53-7.85,16.62-6.29,16.62-6.29,3.25,8.34,1.2,14.5.57,16a23.44,23.44,0,0,1,6.22,16.26c0,23.19-14.14,28.28-27.58,29.84,2.12,1.84,4.1,5.52,4.1,11.17L92.13,121.8c0,1.7,4.24,3.39,4.31,3.18H58.55Z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div
            id="page-content"
            className="page-content flex flex-direction-top-to-bottom flex-item-grow-1"
          >
            <div className="container-fluid pod">
              <section id="goals">
                <h3 className="flush-top">Goals</h3>
                <ul>
                  <li>
                    <strong>Independent</strong>
                    {" "}
                    — pick and use only the components you need.
                  </li>
                  <li>
                    <strong>Styled</strong>
                    {" "}
                    — default classes from
                    {" "}
                    <a href="http://mesosphere.github.io/cnvs">Canvas UI</a>
                    {" "}
                    (use is optional).
                  </li>
                  <li>
                    <strong>Customizable</strong>
                    {" "}
                    — properties allow many different settings to adapt to your app.
                  </li>
                  <li>
                    <strong>Reliable</strong>
                    {" "}
                    — each component is rigorously tested.
                  </li>
                </ul>
              </section>
              <section id="getting-started">
                <h3>Getting Started</h3>
                <p>
                  <strong>1.</strong>
                  {" "}
                  From the command line inside of your project:
                </p>
                <div className="panel pod flush-right flush-left flush-top">
                  <div className="panel-cell panel-cell-narrow panel-cell-short panel-cell-light panel-cell-code-block">
                    <pre className="prettyprint transparent flush lang-shell">
                      npm install --save reactjs-components react react-gemini-scrollbar canvas-ui
                    </pre>
                  </div>
                </div>
                <p>
                  <strong>2.</strong> Import the component that you want to use:
                </p>
                <div className="panel pod flush-right flush-left flush-top">
                  <div className="panel-cell panel-cell-narrow panel-cell-short panel-cell-light panel-cell-code-block">
                    <pre className="prettyprint transparent flush lang-javascript">
                      {`// es6
import {Modal} from 'reactjs-components';
// es5
var Modal = require('reactjs-components').Modal;`}
                    </pre>
                  </div>
                </div>
                <p><strong>3.</strong> Use as if it was any other component:</p>
                <div className="panel pod flush-right flush-left flush-top">
                  <div className="panel-cell panel-cell-narrow panel-cell-short panel-cell-light panel-cell-code-block">
                    <pre className="prettyprint transparent flush lang-javascript">
                      {`render: function () {
  return (
    <Modal ...{props}>
      // Content
    </Modal>
  );
}`}
                    </pre>
                  </div>
                </div>
                <p>
                  <strong>4.</strong>
                  {" "}
                  Import LESS files which will add all styles for all components.
                </p>
                <div className="panel pod flush-right flush-left flush-top">
                  <div className="panel-cell panel-cell-narrow panel-cell-short panel-cell-light panel-cell-code-block">
                    <pre className="prettyprint transparent flush lang-less">
                      @import "./node_modules/canvas-ui/styles/canvas.less"
                      @import (inline) "./node_modules/reactjs-components/lib/index.less"
                    </pre>
                  </div>
                </div>
              </section>
              {docsContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Docs />,
  document.getElementById("reactjs-components-docs"),
  function() {
    global.prettyPrint();
  }
);
