import Modal from 'react-modal'
import toLower from 'lodash/toLower'
import React, { Component, PropTypes } from 'react'

import getSuggestionsUrl from '../../utils/space/getSuggestionsUrl'

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
    room: PropTypes.string,
    onClose: PropTypes.func,
    isVisible: PropTypes.bool,
    categories: PropTypes.array
  }

  static defaultProps = {
    room: 'space',
    onClose: (() => {}),
    isVisible: false,
    categories: []
  }

  onClose = () => {
    const { props } = this

    history.replaceState({}, document.title, location.pathname)
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
        className="modal onboarding-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.onClose}
      >
        <h1 className="onboarding-modal-title">
          Way to go!
        </h1>
        <div className="onboarding-modal-content">
          <div className="onboarding-modal-content-row">
            <h3 className="onboarding-modal-content-title">
              So what&apos;s next?
            </h3>
            <p className="onboarding-modal-content-text">
              Now that you&apos;ve designed your first space, take
              a look at some product suggestions for
              your <strong>{toLower(props.room)}</strong>.
            </p>
            <div className="onboarding-modal-actions">
              <a
                href={getSuggestionsUrl(props.categories)}
                className="onboarding-modal-action button button--primary-alt"
              >
                <span className="button-text">
                  Product Suggestions
                </span>
              </a>
            </div>
          </div>
          <div className="onboarding-modal-content-row">
            <h3 className="onboarding-modal-content-title">
              Share, discuss and curate.
            </h3>
            <p className="onboarding-modal-content-text">
              Share this <strong>{toLower(props.room)}</strong> with your
              friends to start a discussion. Get followers and gain influence
              to become a curator. Curators can add products that other
              designers can use to design their spaces.
            </p>
          </div>
        </div>
        <div
          className="onboarding-modal-actions onboarding-modal-actions--main"
        >
          <a
            href="/about/"
            className="onboarding-modal-action button button--primary"
          >
            <span className="button-text">
              Learn More
            </span>
          </a>
          <button
            onClick={this.onClose}
            className="onboarding-modal-action button"
          >
            Close
          </button>
        </div>
      </Modal>
    )
  }
}
