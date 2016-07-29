import Modal from 'react-modal'
import React, { Component, PropTypes } from 'react'

import cdnUrl from '../../utils/cdnUrl'

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

export default class OnboardingModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    onClose: (() => {}),
    isVisible: false
  };

  render() {
    const { props } = this

    const onClose = () => {
      history.replaceState({}, document.title, location.pathname)
      props.onClose()
    }

    return (
      <Modal
        style={resetModalStyles}
        isOpen={props.isVisible}
        className="modal onboarding-modal"
        onRequestClose={onClose}
      >
        <h1 className="onboarding-modal-title">
          What's Next?
        </h1>
        <div className="onboarding-modal-content">
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/1.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Become a designer
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/2.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Redesign your favorite spaces
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/3.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Show your love
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/4.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Share with your friends
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/5.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Follow your favorite designers
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
          <div className="onboarding-modal-content-row">
            <img
              src={cdnUrl('/static/onboarding/6.png')}
              role="presentation"
              className="onboarding-modal-content-media"
            />
            <h3 className="onboarding-modal-content-title">
              Become a curator
            </h3>
            <p className="onboarding-modal-content-text">
              Design your own spaces featuring products curated by
              a community with good taste.
            </p>
          </div>
        </div>
        <div className="onboarding-modal-actions">
          <button
            onClick={onClose}
            className="onboarding-modal-action button button--primary-alt"
          >
            Ok, got it!
          </button>
        </div>
      </Modal>
    )
  }
}
