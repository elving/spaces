import Modal from 'react-modal'
import React, { Component, PropTypes } from 'react'

import Spaces from '../space/Spaces'
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

export default class RedesignsModal extends Component {
  static propTypes = {
    parent: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired
  }

  static defaultProps = {
    onClose: (() => {}),
    isVisible: false
  }

  onCloseClick = () => {
    const { props } = this

    document.body.classList.remove('ReactModal__Body--open')
    document.querySelector('html').classList.remove(
      'ReactModal__Body--open'
    )

    props.onClose()
  }

  renderCloseButton() {
    return (
      <button
        type="button"
        onClick={this.onCloseClick}
        className={
          'redesigns-modal-close button button--icon button--transparent'
        }
      >
        <MaterialDesignIcon name="close" />
      </button>
    )
  }

  renderRedesigns() {
    const { props } = this

    return (
      <section
        className="redesigns-modal-inner"
        data-type="redesigns"
      >
        {this.renderCloseButton()}
        <h1 className="redesigns-modal-title">Redesigns</h1>
        <Spaces
          params={{ originalSpace: props.parent }}
          emptyMessage="No one has redesigned this space yet..."
        />
      </section>
    )
  }

  render() {
    const { props } = this

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className="modal redesigns-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.onCloseClick}
      >
        {this.renderRedesigns()}
      </Modal>
    )
  }
}
