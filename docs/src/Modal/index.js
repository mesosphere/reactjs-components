import React from 'react';

import Modal from '../../../src/Modal/Modal.js';

const METHODS_TO_BIND = [
  'openModal1',
  'closeModal1',
  'openModal2',
  'closeModal2',
  'openModal3',
  'closeModal3',
  'openModal4',
  'closeModal4'
];
class ModalExample extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  // In order to use a modal, have an interaction that changes
  // `open` to true.
  openModal1() {
    this.setState({modal1Open: true});
  }

  // Pass the modal a function that will allow itself to close, by
  // setting `open` to false.
  closeModal1() {
    this.setState({modal1Open: false});
  }

  openModal2() {
    this.setState({modal2Open: true});
  }

  closeModal2() {
    this.setState({modal2Open: false});

  }

  openModal3() {
    this.setState({modal3Open: true});
  }

  closeModal3() {
    this.setState({modal3Open: false});
  }

  openModal4() {
    this.setState({modal4Open: true});
  }

  closeModal4() {
    this.setState({modal4Open: false});
  }

  getModalFooter() {
    return (
      <div>
        <h5 className="text-align-center">Example Footer</h5>
      </div>
    );
  }

  getModalSubheader() {
    return (
      <div>
        <h5 className="text-align-center inverse">Example subheader</h5>
      </div>
    );
  }

  render() {
    return (
      <div className="row canvas-pod canvas-pod-dark">
        <div className="container container-pod">
          <h2 className="inverse">Here are various modals.</h2>
          <section className="row canvas-pod">
            <div className="column-6">
              <h4 className="inverse">Long content</h4>
              <button className="button button-inverse" onClick={this.openModal1}>
                {"Open Modal"}
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Short content - with footer</h4>
              <button className="button button-inverse" onClick={this.openModal2}>
                {"Open Modal"}
              </button>
            </div>
          </section>
          <section className="row canvas-pod">
            <div className="column-6">
              <h4 className="inverse">Close button on - backdrop close off</h4>
              <button className="button button-inverse" onClick={this.openModal3}>
                {"Open Modal"}
              </button>
            </div>
            <div className="column-6">
              <h4 className="inverse">Inverse style - small max height - with subheader</h4>
              <button className="button button-inverse" onClick={this.openModal4}>
                {"Open Modal"}
              </button>
            </div>
          </section>

          <Modal open={this.state.modal1Open}
            onClose={this.closeModal1}
            showFooter={false}
            size="large"
            titleText="Modal #1">
            <div>
              <div className="container-pod">
                {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisl dolor, finibus vel egestas et, scelerisque placerat quam.Etiam purus mauris, tempor vel lorem vitae, finibus semper tortor. Nulla nisi nisl, tempus vitae risus ut, gravida elementum purus.Cras scelerisque quis velit at aliquet. Aenean congue faucibus magna nec pellentesque. Nulla facilisi. Etiam feugiat consequat metus,eget consectetur erat sollicitudin in. Maecenas posuere lorem lorem, eu porttitor leo fermentum at. Phasellus volutpat,neque at faucibus dapibus, odio quam molestie lorem, vel gravida lectus diam sit amet neque. Cras ultricies auctor diam,a varius massa eleifend quis. Nulla nec rhoncus odio'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
            </div>
          </Modal>
          <Modal open={this.state.modal2Open}
            footer={this.getModalFooter()}
            onClose={this.closeModal2}
            showFooter={true}
            size="large"
            titleText="Modal #2">
            <div>
              <h3 className="text-align-center">This is a short modal</h3>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
            </div>
          </Modal>
          <Modal open={this.state.modal3Open}
            onClose={this.closeModal3}
            footer={this.getModalFooter()}
            titleText="Modal #3"
            showFooter={true}
            showCloseButton={true}
            closeByBackdropClick={false}
            size="large">
            <div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
              <div className="container-pod">
                {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
              </div>
            </div>
          </Modal>
          <Modal open={this.state.modal4Open}
            bodyClass="modal-content inverse container-scrollable"
            headerClass="canvas-pod canvas-pod-light modal-header"
            modalClass="modal modal-large inverse"
            titleClass="inverse modal-header-title text-align-center flush-top flush-bottom"
            maxHeightPercentage={0.3}
            onClose={this.closeModal4}
            showFooter={false}
            size="large"
            subHeader={this.getModalSubheader()}
            titleText="Modal #4">
            <div>
              <h3 className="text-align-center">This is a short modal</h3>
              <div>
                <div className="container-pod">
                  {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
                </div>
                <div className="container-pod">
                  {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
                </div>
                <div className="container-pod">
                  {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
                </div>
                <div className="container-pod">
                  {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
                </div>
                <div className="container-pod">
                  {'Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placeratSed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.Proin venenatis libero sodales, dictum augue non, pretium dolor'}
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

React.render(<ModalExample />, document.getElementById('modal'));
