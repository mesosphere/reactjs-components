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
    return (
      <div>
        <button className="button button-stroke button-rounded"
          onClick={this.handlePanelClose.bind(this, id)}>
          ✕
        </button>
        <h2 className="side-panel-header-title text-align-center flush-top flush-bottom">
          {`Panel #${id}`}
        </h2>
        <p className="center">{description}</p>
      </div>
    );
  }

  render() {
    return (
      <div className="row canvas-pod canvas-pod-light">
        <div className="container container-pod">
          <h2>Here are various side panels.</h2>
          <section className="row canvas-pod">
            <div className="column-6">
              <h4 className="inverse">Long content</h4>
              <p>
                This side panel will scroll horizontally, but not vertically.
              </p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 1)}>
                Open side panel
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Short, but wide content</h4>
              <p>
                This side panel will scroll horizontally, but not vertically.
              </p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 2)}>
                Open side panel
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Alert on close - no header</h4>
              <p>
                This side panel will alert whenever the panel is closed, it does not use the panel header
              </p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 3)}>
                Open side panel
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Backdrop close off</h4>
              <p>
                Only way to close this panel is clicking the close button
              </p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 4)}>
                Open side panel
              </button>
            </div>
          </section>
        </div>

        <SidePanel header={this.getHeader(1, 'Long content')}
          open={this.state.panel1Open}
          onClose={this.handlePanelClose.bind(this, 1)}>
          <div>
            <p className="container-pod container-pod-short flush-bottom">
              This side panel will scroll vertically, but not horizontally.
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
          </div>
        </SidePanel>

        <SidePanel header={this.getHeader(2, 'Short, but wide content')}
          open={this.state.panel2Open}
          onClose={this.handlePanelClose.bind(this, 2)}>
          <p className="container-pod container-pod-short">
            This side panel will scroll horizontally, but not vertically.
          </p>
          <pre>
            Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
          </pre>
        </SidePanel>

        <SidePanel open={this.state.panel3Open}
          onClose={this.alertAndClosePanelID.bind(this, 3)}>
          <div className="container-pod container-pod-short">
            <button className="button button-stroke button-rounded"
              onClick={this.alertAndClosePanelID.bind(this, 3)}>
              ✕
            </button>
            <h2 className="side-panel-header-title text-align-center flush-top flush-bottom">
              Panel #3
            </h2>
            <p className="container-pod container-pod-short flush-bottom">
              This side panel will alert whenever the panel is closed
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
          </div>
        </SidePanel>

        <SidePanel header={this.getHeader(4, 'Backdrop click is turned off')}
          open={this.state.panel4Open}
          onClose={this.alertAndClosePanelID.bind(this, 4)}>
          <div>
            <p className="container-pod container-pod-short flush-bottom">
              Only way to close this panel is clciking the close button
            </p>
            <p className="container-pod container-pod-short flush-bottom">
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </p>
          </div>
        </SidePanel>
      </div>
    );
  }

}

React.render(<SidePanelExample />, document.getElementById('side-panel'));
