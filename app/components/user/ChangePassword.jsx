import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import toStringId from '../../api/utils/toStringId'

export default class ChangePassword extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      isWaiting: false,
      savingSuccessful: false
    }
  }

  onSubmit = (event) => {
    const { context } = this
    const formData = serialize(this.form, { hash: true })
    const password = this.password.value
    const newPassword = this.newPassword.value
    const confirmPassword = this.confirmPassword.value

    event.preventDefault()

    if (isEmpty(newPassword) || isEmpty(confirmPassword)) {
      return this.setState({
        password: 'Please choose a valid password.'
      })
    } else if (newPassword !== confirmPassword) {
      return this.setState({
        password: 'Please check that your passwords match and try again.'
      })
    } else if (password === newPassword) {
      return this.setState({
        password: (
          'Your new password must be different from your current password.'
        )
      })
    }

    this.setState({
      errors: {},
      isWaiting: true
    }, () => {
      axios
      .put(`/ajax/designers/${toStringId(context.user)}/password/`, formData)
      .then(() => {
        this.setState({
          errors: {},
          isWaiting: false,
          savingSuccessful: true
        })
      })
      .catch(({ response }) => {
        this.setState({
          errors: get(response, 'data.err', {}),
          isWaiting: false,
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

  renderNotification() {
    const { state } = this
    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    if (state.savingSuccessful) {
      return (
        <Notification
          type="success"
          timeout={3500}
          onClose={this.onNotificationClose}
          isVisible
        >
          Password updated successfully!
        </Notification>
      )
    } else if (hasGenericError) {
      return (
        <Notification
          type="error"
          timeout={3500}
          onClose={this.onNotificationClose}
          isVisible
        >
          {genericError}
        </Notification>
      )
    }

    return null
  }

  render() {
    const { state, context } = this

    const passwordError = get(state.errors, 'password')
    const hasPasswordError = !isEmpty(passwordError)

    return (
      <Layout>
        {this.renderNotification()}

        <h1 className="page-title">Change Your Password</h1>

        <form
          ref={form => { this.form = form }}
          method="POST"
          onSubmit={this.onSubmit}
          className="edit-profile-form"
          data-form="password"
        >
          <input type="hidden" name="_csrf" value={context.csrf} />
          <input type="hidden" name="_method" value="PUT" />

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Current Password
            </label>

            <input
              id="password"
              ref={password => { this.password = password }}
              type="password"
              name="password"
              required
              disabled={state.isWaiting}
              className={classNames({
                textfield: true,
                'textfield--error': hasPasswordError
              })}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>

            <input
              id="newPassword"
              ref={newPassword => { this.newPassword = newPassword }}
              type="password"
              name="newPassword"
              required
              disabled={state.isWaiting}
              className={classNames({
                textfield: true,
                'textfield--error': hasPasswordError
              })}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              ref={confirmPassword => {
                this.confirmPassword = confirmPassword
              }}
              type="password"
              name="confirmPassword"
              required
              disabled={state.isWaiting}
              className={classNames({
                textfield: true,
                'textfield--error': hasPasswordError
              })}
              placeholder="••••••••"
            />

            {hasPasswordError ? (
              <span className="form-error">{passwordError}</span>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={state.isWaiting}
            className="button button--primary"
            data-action="updatePassword"
          >
            <span className="button-text">
              {state.isWaiting ? 'Updating Password...' : 'Update Password'}
            </span>
          </button>
        </form>
      </Layout>
    )
  }
}
