import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'

export default class SetPassword extends Component {
  static contextTypes = {
    csrf: Type.string
  }

  static propTypes = {
    code: Type.string,
    email: Type.string
  }

  state = {
    errors: {},
    success: false,
    isWaitingForServer: false
  }

  onSubmit = (event) => {
    const { props } = this
    const formData = serialize(this.form, { hash: true })
    const { password, confirmPassword } = formData

    event.preventDefault()

    if (isEmpty(password) || isEmpty(confirmPassword)) {
      this.setState({
        errors: {
          password: 'Please choose a valid password.'
        },
        isWaitingForServer: false
      })
    } else if (size(password) < 8 || size(confirmPassword) < 8) {
      this.setState({
        errors: {
          password: 'Password must have at least 8 characters.'
        },
        isWaitingForServer: false
      })
    } else if (password !== confirmPassword) {
      this.setState({
        errors: {
          password: 'Please check that your passwords match and try again.'
        },
        isWaitingForServer: false
      })
    } else {
      this.setState({
        errors: {},
        isWaitingForServer: true
      }, () => {
        axios
          .post(`/ajax/set-password/${props.code}/`, formData)
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
  }

  render() {
    const { props, state, context } = this

    const passwordError = get(state.errors, 'password')
    const hasPasswordError = !isEmpty(passwordError)

    return (
      <Layout>
        {state.success ? (
          <div>
            <h1 className="auth-form-success">
              Your password was changed successfully.
            </h1>
            <a
              href="/products/"
              className="button button--primary auth-form-success-cta"
            >
              <span className="button-text">
                Design A New Space 😉
              </span>
            </a>
          </div>
        ) : (
          <form
            ref={form => { this.form = form }}
            action={`/ajax/set-password/${props.code}/`}
            method="POST"
            onSubmit={this.onSubmit}
            className="form auth-form set-password-form"
          >
            <input type="hidden" name="_csrf" value={context.csrf} />
            <input type="hidden" name="email" value={props.email} />

            <h1 className="form-title">
              Set Your New Password
            </h1>

            <div className="form-group">
              <input
                type="password"
                name="password"
                required
                disabled={state.isWaitingForServer}
                className={classNames({
                  textfield: true,
                  'textfield--error': hasPasswordError
                })}
                placeholder="Password"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                required
                disabled={state.isWaitingForServer}
                className={classNames({
                  textfield: true,
                  'textfield--error': hasPasswordError
                })}
                placeholder="Confirm Password"
              />

              {hasPasswordError ? (
                <span className="form-error">{passwordError}</span>
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
                    'Updating Your Password...'
                  ) : (
                    'Create New Password'
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
