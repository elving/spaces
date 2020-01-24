import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SocialIcon from '../common/SocialIcon'

export default class Login extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  state = {
    errors: {},
    isWaitingForServer: false
  }

  onSubmit = (event) => {
    const formData = serialize(this.form, { hash: true })

    event.preventDefault()

    if (size(formData.password) < 8) {
      this.setState({
        errors: {
          password: 'Password must have at least 8 characters.'
        },
        isWaitingForServer: false
      })
    } else {
      this.setState({
        errors: {},
        isWaitingForServer: true
      }, () => {
        axios
          .post('/ajax/login/', formData)
          .then((res) => {
            const redirect = get(res, 'data.redirect', '/feed/')
            window.location.href = redirect
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              isWaitingForServer: false
            })
          })
      })
    }
  }

  form = null;

  render() {
    const { state, context } = this

    const genericError = get(state.errors, 'generic')
    const passwordError = get(state.errors, 'password')

    const hasError = !isEmpty(state.errors)
    const hasGenericError = !isEmpty(genericError)
    const hasPasswordError = !isEmpty(passwordError)

    return (
      <Layout>
        <form
          ref={form => { this.form = form }}
          action="/login/"
          method="POST"
          onSubmit={this.onSubmit}
          className="form auth-form login-form"
        >
          <input type="hidden" name="_csrf" value={context.csrf} />

          <div className="auth-form-social">
            <a
              href="/auth/facebook/"
              disabled={state.isWaitingForServer}
              className="button button--facebook"
            >
              <span className="button-text">
                <SocialIcon name="facebook" />
                Login with Facebook
              </span>
            </a>
            <a
              href="/auth/twitter/"
              disabled={state.isWaitingForServer}
              className="button button--twitter"
            >
              <span className="button-text">
                <SocialIcon name="twitter" />
                Login with Twitter
              </span>
            </a>
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
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              required
              disabled={state.isWaitingForServer}
              className={classNames({
                textfield: true,
                'textfield--error': hasError
              })}
              placeholder="password"
            />

            {hasPasswordError ? (
              <small className="form-error">{passwordError}</small>
            ) : null}

            {hasGenericError ? (
              <small className="form-error">{genericError}</small>
            ) : null}
          </div>

          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={state.isWaitingForServer}
              className="button button--primary"
            >
              <span className="button-text">
                {state.isWaitingForServer ? 'Logging in...' : 'Login'}
              </span>
            </button>
            <a
              href="/reset-password/"
              disabled={state.isWaitingForServer}
              className="button button--link"
            >
              <span className="button-text">
                I forgot my password
              </span>
            </a>
          </div>
        </form>
      </Layout>
    )
  }
}
