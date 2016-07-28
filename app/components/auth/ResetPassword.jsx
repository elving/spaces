import ga from 'react-ga'
import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'

export default class ResetPassword extends Component {
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

  onClickSubmit() {
    ga.event({
      label: 'Request Password Reset',
      action: 'Clicked Request Password Reset Button',
      category: 'Reset Password'
    })
  }

  onSubmit(event) {
    const form = get(this.refs, 'form')
    const formData = serialize(form, { hash: true })

    event.preventDefault()

    ga.event({
      label: 'Reset Password Form',
      action: 'Submitted Form',
      category: 'Reset Password'
    })

    this.setState({ errors: {}, isFetching: true }, () => {
      axios({
        url: '/ajax/reset-password/',
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
    })
  }

  render() {
    const { csrf } = this.context
    const { errors, success, isFetching } = this.state

    const genericError = get(errors, 'generic')

    const hasError = !isEmpty(errors)
    const hasGenericError = !isEmpty(genericError)

    return (
      <Layout>
        {success ? (
          <h1 className="auth-form-success">
            We sent you an email with instructions to recover your password.
          </h1>
        ) : (
          <form
            ref="form"
            action="/ajax/reset-password/"
            method="POST"
            onSubmit={::this.onSubmit}
            className="form auth-form reset-password-form">
            <input type="hidden" name="_csrf" value={csrf}/>

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
                ref="emailOrUsername"
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

              {hasGenericError ? (
                <small className="form-error">{genericError}</small>
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
