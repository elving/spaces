/* eslint-disable max-len */
import ga from 'react-ga'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import capitalize from 'lodash/capitalize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Layout from '../common/Layout'

export default class Join extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      isFetching: false
    }
  }

  static contextTypes = {
    csrf: Type.string
  };

  static propTypes = {
    fields: Type.object
  };

  onSubmit(event) {
    const form = get(this.refs, 'form')
    const formData = serialize(form, { hash: true })
    const password = get(this.refs, 'password.value')
    const confirmPassword = get(this.refs, 'confirmPassword.value')

    event.preventDefault()

    ga.event({
      label: 'Join Form',
      action: 'Submitted Form',
      category: 'Join'
    })

    this.setState({ errors: {}, isFetching: true }, () => {
      if (isEmpty(password) || isEmpty(confirmPassword)) {
        this.setState({
          errors: {
            password: 'Please choose a valid password.'
          },
          isFetching: false
        })
      } else if (size(password) < 8 || size(confirmPassword) < 8) {
        this.setState({
          errors: {
            password: 'Password must have at least 8 characters.'
          },
          isFetching: false
        })
      } else if (!isEqual(password, confirmPassword)) {
        this.setState({
          errors: {
            password: 'Please check that your passwords match and try again.'
          },
          isFetching: false
        })
      } else {
        axios({
          url: '/ajax/join/',
          data: formData,
          method: 'post'
        }).then(() => {
          window.location.href = '/'
        }).catch((resp) => {
          this.setState({
            errors: resp.data.err,
            isFetching: false
          })
        })
      }
    })
  }

  onClickFacebook() {
    ga.event({
      label: 'Join with Facebook',
      action: 'Clicked Facebook Join Button',
      category: 'Join'
    })
  }

  onClickTwitter() {
    ga.event({
      label: 'Join with Twitter',
      action: 'Clicked Twitter Join Button',
      category: 'Join'
    })
  }

  onClickSubmit(socialNetwork) {
    ga.event({
      label: (
        !isEmpty(socialNetwork)
          ? `Join Via ${capitalize(socialNetwork)}`
          : 'Join'
      ),
      action: 'Clicked Join Button',
      category: 'Join'
    })
  }

  renderUserInfo() {
    const { fields } = this.props
    const avatar = get(fields, 'avatar')
    const fullName = get(fields, 'fullName')

    return !isEmpty(fullName) && !isEmpty(avatar) ? (
      <div className="auth-form-user-info">
        <img src={avatar} className="auth-form-user-info-avatar"/>
        <p className="auth-form-user-info-text">
          Joining spaces as <strong>{fullName}</strong>.
        </p>
      </div>
    ) : null
  }

  render() {
    const { csrf } = this.context
    const { fields, location } = this.props
    const { errors, isFetching } = this.state

    const usernameError = get(errors, 'username')
    const hasUsernameError = !isEmpty(usernameError)

    const emailError = get(errors, 'email')
    const hasEmailError = !isEmpty(emailError)

    const passwordError = get(errors, 'password')
    const hasPasswordError = !isEmpty(passwordError)

    const bio = get(fields, 'bio')
    const name = get(fields, 'name')
    const email = get(fields, 'email')
    const avatar = get(fields, 'avatar')
    const username = get(fields, 'username')
    const password = get(fields, 'password')
    const socialNetwork = get(location, 'query.socialNetwork')
    const confirmPassword = get(fields, 'confirmPassword')

    return (
      <Layout>
        <form
          ref="form"
          action="/ajax/join/"
          method="POST"
          onSubmit={::this.onSubmit}
          className="form auth-form join-form">
          <input type="hidden" name="_csrf" value={csrf}/>

          {!isEmpty(bio) ? (
            <input type="hidden" name="bio" value={bio}/>
          ) : null}

          {!isEmpty(avatar) ? (
            <input type="hidden" name="avatar" value={avatar}/>
          ) : null}

          {!isEmpty(name) ? (
            <input type="hidden" name="fullname" value={name}/>
          ) : null}

          {!isEmpty(socialNetwork) ? (
            <input type="hidden" name="provider" value={socialNetwork}/>
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
                onClick={::this.onClickFacebook}
                disabled={isFetching}
                className="button button--facebook">
                <Icon name="facebook" viewBox="0 0 56.693 56.693"/>
                Join with Facebook
              </a>
              <a
                href="/auth/twitter/"
                onClick={::this.onClickTwitter}
                disabled={isFetching}
                className="button button--twitter">
                <Icon name="twitter" viewBox="0 0 56.693 56.693"/>
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
              disabled={isFetching}
              className={classNames({
                'textfield': true,
                'textfield--error': hasUsernameError
              })}
              placeholder="Username"
              defaultValue={username}/>

            {hasUsernameError ? (
              <small className="form-error">{usernameError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              required
              disabled={isFetching}
              className={classNames({
                'textfield': true,
                'textfield--error': hasEmailError
              })}
              placeholder="Email"
              defaultValue={email}/>

            {hasEmailError ? (
              <small className="form-error">{emailError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <div className="form-group form-group--inline">
              <input
                ref="password"
                type="password"
                name="password"
                required
                disabled={isFetching}
                className={classNames({
                  'textfield': true,
                  'textfield--error': hasPasswordError
                })}
                placeholder="Password"
                defaultValue={password}/>

              <input
                ref="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                disabled={isFetching}
                className={classNames({
                  'textfield': true,
                  'textfield--error': hasPasswordError
                })}
                placeholder="Confirm Password"
                defaultValue={confirmPassword}/>
            </div>

            {hasPasswordError ? (
              <small className="form-error">{passwordError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <button
              type="submit"
              onClick={() => this.onClickSubmit(socialNetwork)}
              disabled={isFetching}
              className="button button--primary">
              <span className="button-text">
                {isFetching ? 'Creating account...' : 'Create account'}
              </span>
            </button>
          </div>

          <div className="form-group auth-form-legal">
            <small>
              By creating and account, you are agreeing to our <a href="/terms/" target="_blank">Terms of Service</a> and <a href="/privacy/" target="_blank">Privacy Policy</a>
            </small>
          </div>
        </form>
      </Layout>
    )
  }
}
