import React from 'react';

import Portal from '../../../src/Portal/Portal.js';
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
          onClick={this.alertAndClosePanelID.bind(this, id)}>
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
              <h4 className="inverse">Long content - panel header - alert on close</h4>
              <p>This side panel will scroll vertically, but not horizontally. Click on backdrop will close the panel and this uses a panel header</p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 1)}>
                {'Open side panel'}
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Short, but wide content - backdrop close off - just content</h4>
              <p>This side panel will scroll horizontally, but not vertically. It does not use a header, the close by backdrop click is turned off, but you can close it by clicking the close button</p>
              <button
                className="button button-inverse"
                onClick={this.handlePanelOpen.bind(this, 2)}>
                {'Open side panel'}
              </button>
            </div>
          </section>
        </div>

        <Portal>
          <SidePanel header={this.getHeader(1, 'Long content - panel header - alert on close')}
            open={this.state.panel1Open}
            onClose={this.alertAndClosePanelID.bind(this, 1)}>
            <div>
              <p className="containter-pod">
                This side panel will scroll vertically, but not horizontally. Click on backdrop will close the panel and this uses a panel header
              </p>
              <p className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </p>
              <p className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </p>
              <p className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </p>
              <p className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </p>
              <p className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </p>
            </div>
          </SidePanel>
        </Portal>

        <Portal>
          <SidePanel closeByBackdropClick={false}
            open={this.state.panel2Open}>
            <button className="button button-stroke button-rounded"
              onClick={this.handlePanelClose.bind(this, 2)}>
              ✕
            </button>
            <h2 className="center">Short, but wide content - backdrop close off - just content</h2>
            <p className="containter-pod">
              This side panel will scroll horizontally, but not vertically. It does not use a header, the close by backdrop click is turned off, but <b>you can close it by clicking the close button</b>
            </p>
            <pre>
              Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
            </pre>
          </SidePanel>
        </Portal>
      </div>
    );
  }

}

React.render(<SidePanelExample />, document.getElementById('side-panel'));
