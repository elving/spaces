import has from 'lodash/has'
import head from 'lodash/head'
import split from 'lodash/split'
import Modal from 'react-modal'
import compact from 'lodash/compact'
import React, { Component } from 'react'

import isNotAppRoute from '../../utils/isNotAppRoute'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

const resetModalStyles = {
  overlay: {
    backgroundColor: null
  },

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

export default class AdBlockModal extends Component {
  state = {
    isVisible: false
  }

  componentDidMount() {
    this.modalTimeout = setTimeout(() => {
      const isVisible = (
        !has(window.vglnk, 'convert_plugin') ||
        !has(window.vglnk, 'insert_plugin')
      ) && !isNotAppRoute(
        head(compact(split(window.location.pathname, '/')))
      ) && (
        sessionStorage.getItem('show-adblock') !== 'false'
      )

      this.setState({ isVisible })
    }, 60000)
  }

  componentWillUnmount() {
    clearTimeout(this.modalTimeout)
  }

  persistState = () => {
    document.body.classList.remove('ReactModal__Body--open')
    document.querySelector('html').classList.remove(
      'ReactModal__Body--open'
    )

    this.setState({
      isVisible: false
    }, () => {
      sessionStorage.setItem('show-adblock', 'false')
    })
  }

  render() {
    const { state } = this

    return (
      <Modal
        style={resetModalStyles}
        isOpen={state.isVisible}
        className="modal modal--small adblock-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.persistState}
      >
        <button
          type="button"
          onClick={this.persistState}
          className={
            'modal-close button button--icon button--transparent'
          }
        >
          <MaterialDesignIcon name="close" />
        </button>
        <h1 className="modal-title">
          Are you using an Ad Blocker?
        </h1>
        <div className="modal-content">
          <p>
            We will never show you any ads on Spaces, but we do use
            affiliate links to cover the costs of this website. Please
            consider turning your ad blocker off for this website if you want
            to help us keep Spaces alive.
          </p>
        </div>
        <div className="modal-actions form-group">
          <button
            type="button"
            onClick={this.persistState}
            className="button button--primary-alt"
          >
            <span className="button-text">
              Got it
            </span>
          </button>
        </div>
      </Modal>
    )
  }
}
