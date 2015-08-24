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

  getHeader() {
    return (
      <div>
        <button className="button button-stroke button-rounded"
          onClick={this.handlePanelClose.bind(this, 1)}>
          ✕
        </button>
        <h2 className="side-panel-header-title text-align-center flush-top flush-bottom">
          Panel #1
        </h2>
      </div>
    );
  }

  render() {
    return (
      <div className="row canvas-pod canvas-pod-light">
        <div className="container container-pod">
          <h2>Here is a slide out panel.</h2>
          <section className="row canvas-pod">
            <h4 className="inverse">Long content</h4>
            <button
              className="button button-inverse"
              onClick={this.handlePanelOpen.bind(this, 1)}>
              {'Open slide panel'}
            </button>
          </section>
        </div>
        <Portal>
          <SidePanel open={this.state.panel1Open}
            onClose={this.handlePanelClose.bind(this, 1)}
            header={this.getHeader()}
            closeByBackdropClick={true}
            size="large">
            <div>
              <div className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </div>
              <div className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </div>
              <div className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </div>
              <div className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </div>
              <div className="container-pod">
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor
              </div>
            </div>
          </SidePanel>
        </Portal>
      </div>
    );
  }

}

React.render(<SidePanelExample />, document.getElementById('side-panel'));
