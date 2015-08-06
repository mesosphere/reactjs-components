import React from 'react';

import Modal from '../../../src/Modal/Modal.js';

const METHODS_TO_BIND = [
  'openModal1',
  'closeModal1',
  'openModal2',
  'closeModal2'
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

  getModal2Footer() {
    return (
      <div>
        <h5 className="text-align-center">Example Footer</h5>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="row canvas-pod">
          <div className="container container-pod text-align-center">
            <h2>Here is an example of a long modal.</h2>
            <button className="button button-inverse" onClick={this.openModal1}>
              {"Example of a long modal"}
            </button>
          </div>
        </section>
        <section className="row canvas-pod canvas-pod-light">
          <div className="container container-pod text-align-center">
            <h2>Here is an example of a short modal.</h2>
            <button className="button button-inverse" onClick={this.openModal2}>
              {"Example of a short modal"}
            </button>
          </div>
        </section>

        <Modal open={this.state.modal1Open}
          onClose={this.closeModal1}
          titleText="Long Modal"
          showFooter={false}
          size="large">
          <div>
            <div className="container-pod">
              {`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisl dolor, finibus vel egestas et, scelerisque placerat quam.
                Etiam purus mauris, tempor vel lorem vitae, finibus semper tortor. Nulla nisi nisl, tempus vitae risus ut, gravida elementum purus.
                Cras scelerisque quis velit at aliquet. Aenean congue faucibus magna nec pellentesque. Nulla facilisi. Etiam feugiat consequat metus,
                eget consectetur erat sollicitudin in. Maecenas posuere lorem lorem, eu porttitor leo fermentum at. Phasellus volutpat,
                neque at faucibus dapibus, odio quam molestie lorem, vel gravida lectus diam sit amet neque. Cras ultricies auctor diam,
                a varius massa eleifend quis. Nulla nec rhoncus odio
              `}
            </div>
            <div className="container-pod">
              {`
                Fusce sed nibh luctus, ultricies urna eget, eleifend lectus. Etiam sagittis mauris et enim tristique, dignissim varius sem placerat
                Sed molestie purus vitae hendrerit congue. Aliquam viverra cursus odio a ullamcorper.
                Curabitur venenatis ex quis volutpat suscipit. Nulla ante purus, laoreet vel fermentum vitae, sollicitudin nec erat.
                Proin venenatis libero sodales, dictum augue non, pretium dolor
              `}
            </div>
            <div className="container-pod">
              {`
                Mauris malesuada quis lectus id interdum. Nullam non aliquam ligula, quis eleifend quam. Maecenas eu nisl dolor.
                Fusce dapibus iaculis mi, eget facilisis est rhoncus sed. Ut sit amet purus ut magna pharetra tristique sed vitae purus.
                Donec ultricies augue ac magna auctor facilisis. Fusce vestibulum suscipit velit. Donec id odio condimentum,
                efficitur lacus et, volutpat nisi. Sed non tellus neque. Mauris maximus efficitur arcu, vel consequat purus aliquet fringilla
              `}
            </div>
            <div className="container-pod">
              {`
                Vivamus eget dolor rutrum, elementum massa id, venenatis purus. Quisque sed tempor massa. Duis nibh enim,
                finibus et molestie a, fringilla ut arcu. Donec libero massa, fringilla vitae vehicula fringilla, pharetra ut
                risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus felis ex, placerat at enim et, suscipit
                ultrices tellus. Praesent posuere neque eu sapien iaculis tristique. Phasellus enim ante, facilisis id enim at,
                maximus rutrum enim. Aliquam neque justo, ultrices non tortor at, fermentum commodo orci. Donec tempus dui orci,
                eget mattis mauris hendrerit in. Duis tristique ex non elit scelerisque luctus. Praesent a nunc sodales, gravida
                lorem sed, cursus lacus. Sed dictum quam vel est scelerisque, nec volutpat enim tincidunt.
              `}
            </div>
            <div className="container-pod">
              {`
                Donec nec rutrum nibh. In pellentesque non enim et egestas. Ut facilisis, magna sit amet blandit fringilla,
                magna sem bibendum mi, ac feugiat orci mi vestibulum nibh. Praesent semper justo in tempor lacinia. Suspendisse potenti.
                Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi vel finibus ante. Sed sagittis ut tortor in blandit.
                Proin felis sapien, interdum non rhoncus et, fermentum et metus. Pellentesque auctor ligula ac mauris molestie, at dictum metus euismod.
                Suspendisse sed lacinia ligula. Praesent commodo maximus tellus, eu molestie tortor accumsan vel. Aliquam dignissim,
                risus eu tincidunt mollis, mi ipsum pulvinar metus, non porta erat ligula a leo. Proin vitae tincidunt nisi.\n\n
                Cras fermentum vehicula efficitur.
              `}
            </div>
          </div>
        </Modal>
        <Modal open={this.state.modal2Open}
          onClose={this.closeModal2}
          footer={this.getModal2Footer()}
          titleText="Short Modal"
          showFooter={true}
          size="large">
          <div>
            <h3 className="text-align-center">This is a short modal</h3>
            <div className="container-pod">
              {`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisl dolor, finibus vel egestas et, scelerisque placerat quam.
                Etiam purus mauris, tempor vel lorem vitae, finibus semper tortor. Nulla nisi nisl, tempus vitae risus ut, gravida elementum purus.
                Cras scelerisque quis velit at aliquet. Aenean congue faucibus magna nec pellentesque. Nulla facilisi. Etiam feugiat consequat metus,
                eget consectetur erat sollicitudin in.
              `}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

React.render(<ModalExample />, document.getElementById('modal'));
