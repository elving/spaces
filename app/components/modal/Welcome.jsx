import Modal from 'react-modal'
import React, { Component, PropTypes } from 'react'

import cdnUrl from '../../utils/cdnUrl'
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

export default class WelcomeModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    onClose: (() => {}),
    isVisible: false
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
        style={resetModalStyles}
        isOpen={props.isVisible}
        className="modal welcome-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.close}
      >
        <button
          type="button"
          onClick={this.close}
          className={
            'welcome-modal-close button button--icon button--transparent'
          }
        >
          <MaterialDesignIcon name="close" />
        </button>
        <h1 className="welcome-modal-title">
          Welcome to Spaces!
        </h1>
        <div className="welcome-modal-content">
          <p>
            Spaces is a shopping guide for your home where
            you can find the best products curated by people with
            a passion for design and home decor.
          </p>
          <img
            src={cdnUrl('/static/images/welcome.jpg?v=1')}
            role="presentation"
          />
          <p>
            Join now and start designing spaces with the best products
            on the web.
          </p>
        </div>
        <div className="modal-actions form-group form-group--inline">
          <a href="/join/" className="button button--primary-alt">
            <span className="button-text">
              Join Now
            </span>
          </a>
          <a href="/about/" className="button">
            <span className="button-text">
              Learn More
            </span>
          </a>
        </div>
      </Modal>
    )
  }
}
