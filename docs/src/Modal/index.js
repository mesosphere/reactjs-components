import React from 'react';

import BindMixin from '../../../src/Mixin/BindMixin';
import Modal from '../../../src/Modal/Modal.js';
import Util from '../../../src/Util/Util';

class ModalExample extends Util.mixin(BindMixin) {
  get methodsToBind() {
    return [
      'handleModalOpen',
      'handleModalClose'
    ];
  }

  constructor() {
    super();
    this.state = {};
  }

  // In order to use a modal, have an interaction that changes
  // `open` to true.
  handleModalOpen() {
    this.setState({open: true});
  }

  // Pass the modal a function that will allow itself to close, by
  // setting `open` to false.
  handleModalClose() {
    this.setState({open: false});
  }

  getModalFooter() {
    return (
      <div>
        <h5 className="text-align-center">This is not a Footer</h5>
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
      <div className="row canvas-pod">
        <div className="container container-pod">
          <section className="row canvas-pod">
            <div className="column-12">
              <h2>Modals</h2>
              <p>
                Style modals with optional header, footer, transition, and more.
                For details, view full <a href="https://github.com/mesosphere/reactjs-components/blob/master/docs/src/Modal/index.js">example source</a> and <a href="https://github.com/mesosphere/reactjs-components/blob/master/src/Modal/ModalContents.js">component source</a>.
              </p>
              <div className="example-block flush-bottom">
                <div className="example-block-content">
                  <div className="row row-flex">
                    <div className="column-12">
                      <p>Here is a modal with a title and footer.</p>
                      <button className="button button-inverse"
                        onClick={this.handleModalOpen}>
                        Open Modal
                      </button>
                      <Modal open={this.state.open}
                        footer={this.getModalFooter()}
                        showFooter={true}
                        onClose={this.handleModalClose}
                        size="large"
                        titleText="Modal">
                        <div>
                          <div className="container-pod">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisl dolor, finibus vel egestas et, scelerisque placerat quam.Etiam purus mauris, tempor vel lorem vitae, finibus semper tortor. Nulla nisi nisl, tempus vitae risus ut, gravida elementum purus.Cras scelerisque quis velit at aliquet. Aenean congue faucibus magna nec pellentesque. Nulla facilisi. Etiam feugiat consequat metus,eget consectetur erat sollicitudin in. Maecenas posuere lorem lorem, eu porttitor leo fermentum at. Phasellus volutpat,neque at faucibus dapibus, odio quam molestie lorem, vel gravida lectus diam sit amet neque. Cras ultricies auctor diam,a varius massa eleifend quis. Nulla nec rhoncus odio
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
                      </Modal>
                    </div>
                  </div>
                </div>
                <div className="example-block-footer example-block-footer-codeblock">
                  <pre className="prettyprint linenums flush-bottom">

{`import Modal from 'Modal.js';

// In order to use a modal, have an interaction that changes
// 'open' to true.
handleModalOpen() {
  this.setState({open: true});
}

// Pass the modal a function that will allow itself to close, by
// setting 'open' to false.
handleModalClose() {
  this.setState({open: false});
}

getModalFooter() {
  return (
    <div>
      <h5 className="text-align-center">This is not a Footer</h5>
    </div>
  );
}

render() {
  return (
    <button className="button button-inverse"
      onClick={this.handleModalOpen}>
      Open Modal
    </button>
    <Modal
      open={this.state.open}
      footer={this.getModalFooter()}
      showFooter={true}
      onClose={this.handleModalClose}
      size="large"
      titleText="Modal">
      <div>
        Words words words
      </div>
    </Modal>
  )
}
`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

React.render(<ModalExample />, document.getElementById('modal'));
