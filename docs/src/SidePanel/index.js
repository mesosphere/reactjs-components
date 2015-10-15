import React from 'react';

import SidePanel from '../../../src/SidePanel/SidePanel.js';

class SidePanelExample extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  // In order to use a panel, have an interaction that changes
  // `open` to true.
  handlePanelOpen(id) {
    let state = {};
    state[`panel${id}Open`] = true;
    this.setState(state);
  }

  // Pass the panel a function that will allow itself to close, by
  // setting `open` to false.
  handlePanelClose(id) {
    let state = {};
    state[`panel${id}Open`] = false;
    this.setState(state);
  }

  alertAndClosePanelID(id) {
    /*eslint-disable no-alert */
    alert(`You just closed panel number ${id}!`);
    /*eslint-enable no-alert */
    this.handlePanelClose(id);
  }

  getHeader(id, description) {
    return [
      <div
        key="header-actions-primary"
        className="side-panel-header-actions side-panel-header-actions-primary">
        <button
          className="side-panel-header-action button button-stroke
            button-rounded"
          onClick={this.handlePanelClose.bind(this, id)}>
          ✕
        </button>
      </div>,
      <div
        key="header-content"
        className="side-panel-header-content">
        <h3 className="side-panel-header-content-title text-align-center flush">
          {`Panel #${id}`}
        </h3>
        <p
          className="side-panel-header-content-subtitle text-align-center flush">
          {description}
        </p>
      </div>,
      <div
        key="header-actions-secondary"
        className="
          side-panel-header-actions
          side-panel-header-actions-secondary"
        >
      </div>
    ];
  }

  render() {
    return (
      <div className="row canvas-pod">
        <div className="container container-pod">
          <h2 className="short-bottom">Side panels</h2>
          <p>
            Create a panel that shows itself based on user-interaction. View full source <a href="https://github.com/mesosphere/reactjs-components/blob/master/docs/src/SidePanel/index.js">here</a>.
          </p>
          <div className="example-block flush-bottom">
            <div className="example-block-content">
              <section className="row canvas-pod">
                <div className="column-6">
                  <p>
                    The panel will pop out from the side; thus, the side panel.
                  </p>
                  <button
                    className="button button-inverse"
                    onClick={this.handlePanelOpen.bind(this, 1)}>
                    Open side panel
                  </button>
                </div>
              </section>
            </div>
            <div className="example-block-footer example-block-footer-codeblock">
              <pre className="prettyprint linenums flush-bottom">
{`<SidePanel
  header={this.getHeader()}
  open={this.state.panelIsOpen}
  onClose={this.handlePanelClose.bind(this)}>
  <div>
    <p className="container-pod container-pod-short flush-bottom">
      This side panel will scroll vertically, but not horizontally.
    </p>
    <p className="container-pod container-pod-short flush-bottom">
      Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim ...
    </p>
    <p className="container-pod container-pod-short flush-bottom">
      Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim ...
    </p>
    <p className="container-pod container-pod-short flush-bottom">
      Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim ...
    </p>
    <p className="container-pod container-pod-short flush-bottom">
      Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim ...
    </p>
    <p className="container-pod container-pod-short flush-bottom">
      Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim ...
    </p>
  </div>
</SidePanel>`}
              </pre>
            </div>
          </div>
        </div>

        <SidePanel header={this.getHeader(1, 'Long content')}
          open={this.state.panel1Open}
          onClose={this.handlePanelClose.bind(this, 1)}>
          <div className="container container-fluid container-pod">
            <p>
              This side panel will scroll vertically, but not horizontally.
            </p>
            <p>
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p>
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p>
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p>
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p className="flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
          </div>
        </SidePanel>
      </div>
    );
  }

}

React.render(<SidePanelExample />, document.getElementById('side-panel'));
