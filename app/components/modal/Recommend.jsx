import get from 'lodash/get'
import size from 'lodash/size'
import Modal from 'react-modal'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Notification from '../common/Notification'
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

export default class RecommendModal extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  static propTypes = {
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    onClose: (() => {}),
    onSuccess: (() => {}),
    isVisible: false
  }

  state = {
    url: '',
    note: '',
    isSaving: false,
    noteCharsLeft: 140,
    savingSuccessful: false,
    hasNoteCharsError: false
  }

  onAfterOpen = () => {
    document.body.classList.add('ReactModal__Body--open')
    document.querySelector('html').classList.add('ReactModal__Body--open')
  }

  onUrlChange = ({ currentTarget }) => {
    this.setState({
      url: currentTarget.value,
      savingSuccessful: false
    })
  }

  onNoteChange = ({ currentTarget: input }) => {
    const noteCharsLeft = 140 - size(input.value)

    this.setState({
      note: input.value,
      noteCharsLeft,
      savingSuccessful: false,
      hasNoteCharsError: noteCharsLeft < 0
    })
  }

  onSubmit = event => {
    event.preventDefault()

    const form = this.form
    const formData = serialize(form, { hash: true, empty: true })

    this.setState({
      errors: {},
      isSaving: true
    }, () => {
      axios
      .post('/ajax/recommendations/add/', formData)
      .then(({ data: recommendation }) => {
        this.setState({
          url: '',
          note: '',
          errors: {},
          isSaving: false,
          savingSuccessful: true
        }, () => {
          this.props.onSuccess(recommendation)
        })
      })
      .catch(({ response }) => {
        this.setState({
          errors: get(response, 'data.err', {}),
          isSaving: false,
          savingSuccessful: false
        })
      })
    })
  }

  onNotificationClose = () => {
    this.setState({
      savingSuccessful: false
    })
  }

  close = () => {
    this.setState({
      url: '',
      note: '',
      errors: {},
      isSaving: false,
      noteCharsLeft: 140,
      savingSuccessful: false,
      hasNoteCharsError: false
    }, () => {
      document.body.classList.remove('ReactModal__Body--open')
      document.querySelector('html').classList.remove('ReactModal__Body--open')
      this.props.onClose()
    })
  }

  render() {
    const urlError = get(this.state.errors, 'url')
    const hasUrlError = !isEmpty(urlError)

    const noteError = get(this.state.errors, 'note')
    const hasNoteError = !isEmpty(noteError)

    const formIsDisabled = (
      this.state.isSaving ||
      this.state.hasNoteCharsError
    )

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={this.props.isVisible}
        className="modal recommend-modal"
        onAfterOpen={this.onAfterOpen}
        contentLabel="Modal"
        onRequestClose={this.close}
      >
        <h3 className="recommend-modal-title">
          Recommend a product
          <a
            rel="noopener noreferrer"
            href="/about/#curating-products"
            target="_blank"
            className="button button--small button--link"
          >
            <MaterialDesignIcon name="help" />
            Learn more
          </a>
        </h3>

        <form
          ref={form => { this.form = form }}
          method="POST"
          onSubmit={this.onSubmit}
          className="form recommend-form"
        >
          <input type="hidden" name="_csrf" value={this.context.csrf} />
          <input type="hidden" name="_method" value="POST" />

          <div className="form-group">
            <label htmlFor="url" className="form-label">
              Url <small>required</small>
            </label>

            <input
              id="url"
              type="url"
              name="url"
              value={this.state.url}
              required
              disabled={formIsDisabled}
              onChange={this.onUrlChange}
              autoFocus
              className={classNames({
                textfield: true,
                'textfield--error': hasUrlError
              })}
              placeholder="E.g. https://www.amazon.com/dp/B01AHC9EG6"
            />

            {hasUrlError ? (
              <small className="form-error">{urlError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="note" className="form-label">
              Why should we add this product?
              <small
                style={{
                  color: this.state.hasNoteCharsError ? '#ED4542' : '#999999'
                }}
              >
                optional &middot; {this.state.noteCharsLeft}
              </small>
            </label>

            <textarea
              id="note"
              name="note"
              value={this.state.note}
              disabled={this.state.isSaving}
              onChange={this.onNoteChange}
              className={classNames({
                textfield: true,
                'textfield--error': (
                  hasNoteError ||
                  this.state.hasNoteCharsError
                )
              })}
              placeholder="E.g. You should add this product because..."
            />

            {hasNoteError ? (
              <small className="form-error">{noteError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <div
              className={classNames({
                'form-group': true,
                'form-group--inline': true
              })}
            >
              <button
                type="submit"
                disabled={formIsDisabled}
                className={classNames({
                  button: true,
                  'button--primary': true
                })}
              >
                <span className="button-text">
                  {this.state.isSaving ? 'Recommending...' : 'Recommend'}
                </span>
              </button>
              <button
                type="button"
                onClick={this.close}
                className="button button--link"
              >
                <span className="button-text">
                  Cancel
                </span>
              </button>
            </div>
          </div>
        </form>

        {this.state.savingSuccessful ? (
          <Notification
            type="success"
            onClose={this.onNotificationClose}
            timeout={3500}
            isVisible
          >
            Thanks for the recommendation! We&apos;ll review it shortly.
            &nbsp;<a href="/about/#curating-products">Learn about
            recommendations</a>.
          </Notification>
        ) : null}
      </Modal>
    )
  }
}
