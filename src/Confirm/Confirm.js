import React, {PropTypes} from 'react/addons';

import Modal from '../Modal/Modal';

export default class Confirm extends React.Component {
  getButtons() {
    return (
      <div className="button-collection text-align-center flush-bottom">
        <button
          className={this.props.leftButtonClassName}
          onClick={this.props.leftButtonCallback}>
          {this.props.leftButtonText}
        </button>
        <button
          className={this.props.rightButtonClassName}
          onClick={this.props.rightButtonCallback}>
          {this.props.rightButtonText}
        </button>
      </div>
    );
  }

  render() {
    return (
      <Modal
        closeByBackdropClick={!this.props.disabled}
        modalClass="modal confirm-modal"
        onClose={this.props.onClose}
        open={this.props.open}
        showCloseButton={false}
        showFooter={true}
        footer={this.getButtons()}
        titleClass="modal-header-title text-align-center flush-top
          flush-bottom"
        >
        {this.props.children}
      </Modal>
    );
  }
}

Confirm.defaultProps = {
  open: true,
  disabled: false,
  onClose: function () {},

  // Left button properties
  leftButtonText: 'Cancel',
  leftButtonClassName: 'button',
  leftButtonCallback: function () {},
  // Right button properties
  rightButtonText: 'Confirm',
  rightButtonClassName: 'button button-primary',
  rightButtonCallback: function () {}
};

Confirm.propTypes = {
  children: React.PropTypes.element.isRequired,

  open: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  // This will be triggered by backdrop click
  onClose: PropTypes.func,

  // Left button properties
  leftButtonText: PropTypes.string.isRequired,
  leftButtonClassName: PropTypes.string,
  leftButtonCallback: PropTypes.func.isRequired,
  // Right button properties
  rightButtonText: PropTypes.string.isRequired,
  rightButtonClassName: PropTypes.string,
  rightButtonCallback: PropTypes.func.isRequired
};
