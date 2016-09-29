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
  }

  static defaultProps = {
    space: {},
    onClose: (() => {}),
    onSuccess: (() => {}),
    isVisible: false,
    formMethod: 'POST'
  }

  close = () => {
    const { props } = this

    document.body.classList.remove('ReactModal__Body--open')
    document.querySelector('html').classList.remove(
      'ReactModal__Body--open'
    )

    props.onClose()
  }

  render() {
    const { props } = this

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className="modal space-form-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        onRequestClose={this.close}
      >
        <button
          type="button"
          onClick={this.close}
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
          onCancel={this.close}
          onSuccess={props.onSuccess}
          formMethod={props.formMethod}
        />
      </Modal>
    )
  }
}
