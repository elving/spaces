import ga from 'react-ga'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'

export default class SetPassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      success: false,
      isFetching: false
    }
  }

  static contextTypes = {
    csrf: Type.string
  };

  static propTypes = {
    code: Type.string,
    email: Type.string
  };

  onSubmit(event) {
    const form = get(this.refs, 'form')
    const formData = serialize(form, { hash: true })
    const { code } = this.props
    const password = get(this.refs, 'password.value')
    const confirmPassword = get(this.refs, 'confirmPassword.value')

    event.preventDefault()

    ga.event({
      label: 'Set Password Form',
      action: 'Submitted Form',
      category: 'Set Password'
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
          url: `/ajax/set-password/${code}/`,
          data: formData,
          method: 'post'
        }).then(() => {
          this.setState({
            success: true,
            isFetching: false
          })
        }).catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            isFetching: false
          })
        })
      }
    })
  }

  onClickSubmit() {
    ga.event({
      label: 'Set New Password',
      action: 'Clicked Request Password Reset Button',
      category: 'Set Password'
    })
  }

  render() {
    const { csrf } = this.context
    const { code, email } = this.props
    const { errors, success, isFetching } = this.state

    const passwordError = get(errors, 'password')
    const hasPasswordError = !isEmpty(passwordError)

    return (
      <Layout>
        {success ? (
          <div>
            <h1 className="auth-form-success">
              Your password was changed successfully.
            </h1>
            <a
              href="#"
              className="button button--primary auth-form-success-cta">
              Design A New Space 😉
            </a>
          </div>
        ) : (
          <form
            ref="form"
            action={`/ajax/set-password/${code}/`}
            method="POST"
            onSubmit={::this.onSubmit}
            className="form auth-form set-password-form">

            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="email" value={email}/>

            <h1 className="form-title">
              Set Your New Password
            </h1>

            <div className="form-group">
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
                placeholder="Password"/>
            </div>

            <div className="form-group">
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
                placeholder="Confirm Password"/>

              {hasPasswordError ? (
                <span className="form-error">{passwordError}</span>
              ) : null}
            </div>

            <div className="form-group">
              <button
                type="submit"
                onClick={::this.onClickSubmit}
                disabled={isFetching}
                className="button button--primary">
                <span className="button-text">
                  {isFetching ? (
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
