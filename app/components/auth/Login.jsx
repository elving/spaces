import ga from 'react-ga'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Layout from '../common/Layout'

export default class Login extends Component {
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

  onSubmit(event) {
    const form = get(this.refs, 'form')
    const formData = serialize(form, { hash: true })
    const password = get(this.refs, 'password.value')

    event.preventDefault()

    ga.event({
      label: 'Login Form',
      action: 'Submitted Form',
      category: 'Login'
    })

    this.setState({ errors: {}, isFetching: true }, () => {
      if (size(password) < 8) {
        this.setState({
          errors: {
            password: 'Password must have at least 8 characters.'
          },
          isFetching: false
        })
      } else {
        axios({
          url: '/ajax/login/',
          data: formData,
          method: 'post'
        }).then((resp) => {
          window.location.href = resp.data.returnTo
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
        label: 'Login with Facebook',
        action: 'Clicked Facebook Login Button',
        category: 'Login'
      })
  }

  onClickTwitter() {
    ga.event({
      label: 'Login with Twitter',
      action: 'Clicked Twitter Login Button',
      category: 'Login'
    })
  }

  onClickSubmit() {
    ga.event({
      label: 'Login',
      action: 'Clicked Login Button',
      category: 'Login'
    })
  }

  render() {
    const { csrf } = this.context
    const { errors, isFetching } = this.state

    const genericError = get(errors, 'generic')
    const passwordError = get(errors, 'password')

    const hasError = !isEmpty(errors)
    const hasGenericError = !isEmpty(genericError)
    const hasPasswordError = !isEmpty(passwordError)

    return (
      <Layout>
        <form
          ref="form"
          action="/login/"
          method="POST"
          onSubmit={::this.onSubmit}
          className="form auth-form login-form">
          <input type="hidden" name="_csrf" value={csrf}/>

          <h1 className="form-title">
            Good to see you again!
          </h1>

          <div className="auth-form-social">
            <a
              href="/auth/facebook/"
              onClick={::this.onClickFacebook}
              disabled={isFetching}
              className="button button--facebook">
              <Icon name="facebook" viewBox="0 0 56.693 56.693"/>
              Login with Facebook
            </a>
            <a
              href="/auth/twitter/"
              onClick={::this.onClickTwitter}
              disabled={isFetching}
              className="button button--twitter">
              <Icon name="twitter" viewBox="0 0 56.693 56.693"/>
              Login with Twitter
            </a>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="emailOrUsername"
              required
              disabled={isFetching}
              autoFocus
              className={classNames({
                'textfield': true,
                'textfield--error': hasError
              })}
              placeholder="username or email"/>
          </div>

          <div className="form-group">
            <input
              ref="password"
              type="password"
              name="password"
              required
              disabled={isFetching}
              className={classNames({
                'textfield': true,
                'textfield--error': hasError
              })}
              placeholder="password"/>

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
              onClick={::this.onClickSubmit}
              disabled={isFetching}
              className="button button--primary">
              <span className="button-text">
                {isFetching ? 'Logging in...' : 'Login'}
              </span>
            </button>
            <a
              href="/reset-password/"
              disabled={isFetching}
              className="button button--link">
              I forgot my password
            </a>
          </div>
        </form>
      </Layout>
    )
  }
}
