/* eslint-disable max-len */
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import SocialIcon from '../common/SocialIcon'

export default class Join extends Component {
  static contextTypes = {
    csrf: Type.string
  }

  static propTypes = {
    fields: Type.object
  }

  state = {
    errors: {},
    isWaitingForServer: false
  }

  onSubmit = (event) => {
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
          .post('/ajax/join/', formData)
          .then(() => {
            window.location.href = '/onboarding/'
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

  renderUserInfo() {
    const { props } = this
    const avatar = get(props.fields, 'avatar')
    const fullName = get(props.fields, 'fullName')

    return !isEmpty(fullName) && !isEmpty(avatar) ? (
      <div className="auth-form-user-info">
        <img
          src={avatar}
          alt={fullName}
          className="auth-form-user-info-avatar"
        />
        <p className="auth-form-user-info-text">
          Joining spaces as <strong>{fullName}</strong>.
        </p>
      </div>
    ) : null
  }

  render() {
    const { props, state, context } = this

    const usernameError = get(state.errors, 'username')
    const hasUsernameError = !isEmpty(usernameError)

    const emailError = get(state.errors, 'email')
    const hasEmailError = !isEmpty(emailError)

    const passwordError = get(state.errors, 'password')
    const hasPasswordError = !isEmpty(passwordError)

    const bio = get(props.fields, 'bio')
    const name = get(props.fields, 'name')
    const email = get(props.fields, 'email')
    const avatar = get(props.fields, 'avatar')
    const username = get(props.fields, 'username')
    const password = get(props.fields, 'password')
    const socialNetwork = get(props.location, 'query.socialNetwork')
    const confirmPassword = get(props.fields, 'confirmPassword')

    return (
      <Layout>
        <form
          ref={form => { this.form = form }}
          action="/ajax/join/"
          method="POST"
          onSubmit={this.onSubmit}
          className="form auth-form join-form"
        >
          <input type="hidden" name="_csrf" value={context.csrf} />

          {!isEmpty(bio) ? (
            <input type="hidden" name="bio" value={bio} />
          ) : null}

          {!isEmpty(avatar) ? (
            <input type="hidden" name="avatar" value={avatar} />
          ) : null}

          {!isEmpty(name) ? (
            <input type="hidden" name="fullname" value={name} />
          ) : null}

          {!isEmpty(socialNetwork) ? (
            <input type="hidden" name="provider" value={socialNetwork} />
          ) : null}

          {isEmpty(socialNetwork) ? (
            <h1 className="form-title">
              Join Spaces
            </h1>
          ) : this.renderUserInfo()}

          {isEmpty(socialNetwork) ? (
            <div className="auth-form-social">
              <a
                href="/auth/facebook/"
                disabled={state.isWaitingForServer}
                className="button button--facebook"
              >
                <SocialIcon name="facebook" />
                Join with Facebook
              </a>
              <a
                href="/auth/twitter/"
                disabled={state.isWaitingForServer}
                className="button button--twitter"
              >
                <SocialIcon name="twitter" />
                Join with Twitter
              </a>
            </div>
          ) : null}

          <div className="form-group">
            <input
              type="text"
              name="username"
              required
              autoFocus
              disabled={state.isWaitingForServer}
              className={classNames({
                textfield: true,
                'textfield--error': hasUsernameError
              })}
              placeholder="Username"
              defaultValue={username}
            />

            {hasUsernameError ? (
              <small className="form-error">{usernameError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              required
              disabled={state.isWaitingForServer}
              className={classNames({
                textfield: true,
                'textfield--error': hasEmailError
              })}
              placeholder="Email"
              defaultValue={email}
            />

            {hasEmailError ? (
              <small className="form-error">{emailError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <div className="form-group form-group--inline">
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
                defaultValue={password}
              />

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
                defaultValue={confirmPassword}
              />
            </div>

            {hasPasswordError ? (
              <small className="form-error">{passwordError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={state.isWaitingForServer}
              className="button button--primary"
            >
              <span className="button-text">
                {state.isWaitingForServer ? 'Creating account...' : 'Create account'}
              </span>
            </button>
          </div>

          <div className="form-group auth-form-legal">
            <small>
              By creating and account, you are {' '}
              agreeing to our {' '}
              <a
                rel="noopener noreferrer"
                href="/terms/"
                target="_blank"
              >
                Terms of Service
              </a>
              {' and '}
              <a
                rel="noopener noreferrer"
                href="/privacy/"
                target="_blank"
              >
              Privacy Policy
              </a>
            </small>
          </div>
        </form>
      </Layout>
    )
  }
}
