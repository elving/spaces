import Modal from 'react-modal'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import SpaceForm from '../space/Form'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

const overrideDefaultStyles = {
  overlay: { backgroundColor: null },
  content: {
    top: 'initial',
    left: 'initial',
    right: 'initial',
    bottom: 'initial',
    border: null,
    padding: null,
    position: null,
    background: null,
    borderRadius: null
  }
}

export default class SpaceFormModal extends Component {
  static propTypes = {
    space: PropTypes.object,
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    isVisible: PropTypes.bool,
    formMethod: PropTypes.string
  };

  static defaultProps = {
    space: {},
    onClose: (() => {}),
    onSuccess: (() => {}),
    isVisible: false,
    formMethod: 'POST'
  };

  render() {
    const { props } = this

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className="modal space-form-modal"
        onRequestClose={props.onClose}
      >
        <button
          type="button"
          onClick={::props.onClose}
          className={classNames({
            button: true,
            'button--icon': true,
            'button--transparent': true,
            'space-form-modal-close': true
          })}
        >
          <MaterialDesignIcon name="close" />
        </button>

        <SpaceForm
          space={props.space}
          onCancel={::props.onClose}
          onSuccess={::props.onSuccess}
          formMethod={props.formMethod}
        />
      </Modal>
    )
  }
}
