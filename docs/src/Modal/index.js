import React from 'react';
import ReactDOM from 'react-dom';

import ComponentWrapper from '../components/ComponentWrapper';
import Modal from '../../../src/Modal/Modal.js';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';

class ModalExample extends React.Component {
  constructor() {
    super();
    this.state = {};

    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
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
        <h5 className="text-align-center">hello footer</h5>
      </div>
    );
  }

  render() {
    return (
      <ComponentWrapper title="Modal" srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Modal/ModalContents.js">
        <p className="lead flush-bottom">
          Style modals with optional header, footer, transition, and more.
        </p>
        <PropertiesAPIBlock propTypesBlock={'PROPTYPES_BLOCK(src/Modal/ModalContents.js)'} />
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
                  showHeader={true}
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
{`import {Modal} from 'reactjs-components';
import React from 'react';

class ModalExample extends React.Component {

  constructor() {
    super();
    this.state = {};

    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

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
        <h5 className="text-align-center">hello footer</h5>
      </div>
    );
  }

  render() {
    return (
      <div>
        <button className="button button-inverse"
          onClick={this.handleModalOpen}>
          Open Modal
        </button>
        <Modal
          open={this.state.open}
          footer={this.getModalFooter()}
          showHeader={true}
          showFooter={true}
          onClose={this.handleModalClose}
          size="large"
          titleText="Modal">
          <div>
            Words words words
          </div>
        </Modal>
      </div>
    )
  }
}
`}
            </pre>
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

ReactDOM.render(<ModalExample />, document.getElementById('modal'));
