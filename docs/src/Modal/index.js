import React from "react";

import CodeBlock from "../components/CodeBlock";
import ComponentExample from "../components/ComponentExample";
import ComponentExampleWrapper from "../components/ComponentExampleWrapper";
import ComponentWrapper from "../components/ComponentWrapper";
import Modal from "../../../src/Modal/Modal.js";
import PropertiesAPIBlock from "../components/PropertiesAPIBlock";

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
    this.setState({ open: true });
  }

  // Pass the modal a function that will allow itself to close, by
  // setting `open` to false.
  handleModalClose() {
    this.setState({ open: false });
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
      <ComponentWrapper
        title="Modal"
        srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Modal/ModalContents.js"
      >
        <p className="lead flush-bottom">
          Style modals with optional header, footer, transition, and more.
        </p>
        <PropertiesAPIBlock
          propTypesBlock={"PROPTYPES_BLOCK(src/Modal/ModalContents.js)"}
        />
        <ComponentExampleWrapper>
          <ComponentExample>
            <div className="row row-flex">
              <div className="column-12">
                <p>Here is a modal with a title and footer.</p>
                <button
                  className="button button-inverse"
                  onClick={this.handleModalOpen}
                >
                  Open Modal
                </button>
                <Modal
                  footer={this.getModalFooter()}
                  header={
                    <h5 className="modal-header-title flush">Modal Header</h5>
                  }
                  onClose={this.handleModalClose}
                  open={this.state.open}
                  showFooter={true}
                  showHeader={true}
                >
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
          </ComponentExample>
          <CodeBlock>
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
          header={<h5 className="modal-header-title flush">Modal</h5>}>
          <div>
            Words words words
          </div>
        </Modal>
      </div>
    )
  }
}`}
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }
}

module.exports = ModalExample;
