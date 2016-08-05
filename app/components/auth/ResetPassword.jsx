import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'

export default class ResetPassword extends Component {
  static contextTypes = {
    csrf: Type.string
  }

  state = {
    errors: {},
    success: false,
    isWaitingForServer: false
  }

  onSubmit = (event) => {
    const formData = serialize(this.form, { hash: true })

    event.preventDefault()

    this.setState({
      errors: {},
      isWaitingForServer: true
    }, () => {
      axios
        .post('/ajax/reset-password/', formData)
        .then(() => {
          this.setState({
            success: true,
            isWaitingForServer: false
          })
        })
        .catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            isWaitingForServer: false
          })
        })
    })
  }

  render() {
    const { state, context } = this

    const genericError = get(state.errors, 'generic')

    const hasError = !isEmpty(state.errors)
    const hasGenericError = !isEmpty(genericError)

    return (
      <Layout>
        {state.success ? (
          <h1 className="auth-form-success">
            We sent you an email with instructions to recover your password.
          </h1>
        ) : (
          <form
            ref={form => { this.form = form }}
            action="/ajax/reset-password/"
            method="POST"
            onSubmit={this.onSubmit}
            className="form auth-form reset-password-form"
          >
            <input type="hidden" name="_csrf" value={context.csrf} />

            <h1 className="form-title">
              Reset Your Password
            </h1>

            <div className="form-group">
              <p className="form-text">
                Forgot your password? Don't worry, give us your username or
                email and we'll send you instructions on how to recover it.
              </p>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="emailOrUsername"
                required
                disabled={state.isWaitingForServer}
                autoFocus
                className={classNames({
                  textfield: true,
                  'textfield--error': hasError
                })}
                placeholder="username or email"
              />

              {hasGenericError ? (
                <small className="form-error">{genericError}</small>
              ) : null}
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={state.isWaitingForServer}
                className="button button--primary"
              >
                <span className="button-text">
                  {state.isWaitingForServer ? (
                    'Sending instructions...'
                  ) : (
                    'Request Password Reset'
                  )}
                </span>
              </button>
            </div>
          </form>
        )}
      </Layout>
    )
  }
}
