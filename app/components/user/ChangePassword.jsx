import ga from 'react-ga'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'

export default class ChangePassword extends Component {
  constructor(props) {
    super(props)

    const passwordError = get(props, 'errors.password')

    this.state = {
      passwordError,
      hasPasswordError: !isEmpty(passwordError)
    }
  }

  static contextTypes = {
    csrf: Type.string
  };

  static propTypes = {
    fields: Type.object,
    errors: Type.object,
    profile: Type.object.isRequired
  };

  static defaultProps = {
    profile: {}
  };

  validate(event) {
    const password = get(this.refs, 'password.value')
    const newPassword = get(this.refs, 'newPassword.value')
    const confirmPassword = get(this.refs, 'confirmPassword.value')

    ga.event({
      label: 'Join Form',
      action: 'Submitted Form',
      category: 'Join'
    })

    if (isEmpty(newPassword) || isEmpty(confirmPassword)) {
      event.preventDefault()

      this.setState({
        passwordError: 'Please choose a valid password.',
        hasPasswordError: true
      })
    } else if (!isEqual(newPassword, confirmPassword)) {
      event.preventDefault()

      this.setState({
        passwordError: 'Please check that your passwords match and try again.',
        hasPasswordError: true
      })
    } else if (isEqual(password, newPassword)) {
      event.preventDefault()

      this.setState({
        passwordError: (
          'Your new password must be different from your current password.'
        ),
        hasPasswordError: true
      })
    }
  }

  render() {
    const { csrf } = this.context
    const { passwordError, hasPasswordError } = this.state
    const { fields, profile, errors, message } = this.props

    const username = get(profile, 'username')
    const password = get(fields, 'password')
    const newPassword = get(fields, 'newPassword')
    const confirmPassword = get(fields, 'confirmPassword')

    const formAction = `/users/${username}/password/`

    return (
      <Layout>
        <div className="edit-profile">
          <div className="edit-profile-header">
            <h1 className="edit-profile-header-title">
              Change Your Password
            </h1>
          </div>
          {!isEmpty(errors) ? (
            <div className="ui-banner" data-state="error">
              There was an error while trying to change your password
            </div>
          ) : null}
          {!isEmpty(message) ? (
            <div className="ui-banner" data-state="success">
              {message}
            </div>
          ) : null}
          <form
            method="POST"
            action={formAction}
            onSubmit={::this.validate}
            onClick={() => {
              ga.event({
                label: username,
                action: 'Submitted Form',
                category: 'Change Password'
              })
            }}
            className="edit-profile-form"
            data-form="profile">
            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="_method" value="PUT"/>

            <div className="ui-form-group">
              <label htmlFor="password" className="ui-label">
                Current Password
              </label>
              <input
                id="password"
                ref="password"
                type="password"
                name="password"
                required
                className="ui-textfield"
                data-state={hasPasswordError ? 'error' : null}
                placeholder="••••••••"
                defaultValue={password}/>
            </div>

            <div className="ui-form-group">
              <label htmlFor="newPassword" className="ui-label">
                New Password
              </label>
              <input
                id="newPassword"
                ref="newPassword"
                type="password"
                name="newPassword"
                required
                className="ui-textfield"
                data-state={hasPasswordError ? 'error' : null}
                placeholder="••••••••"
                defaultValue={newPassword}/>
            </div>

            <div className="ui-form-group">
              <label htmlFor="confirmPassword" className="ui-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                ref="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                className="ui-textfield"
                data-state={hasPasswordError ? 'error' : null}
                placeholder="••••••••"
                defaultValue={confirmPassword}/>
                {hasPasswordError ? (
                  <span className="ui-form-error">{passwordError}</span>
                ) : null}
            </div>

            <button
              type="submit"
              onClick={() => {
                ga.event({
                  label: username,
                  action: 'Clicked Change Password Button',
                  category: 'Change Password'
                })
              }}
              className="ui-button"
              data-type="primary"
              data-action="updatePassword">
              <span className="button-text">Update Password</span>
            </button>
          </form>
        </div>
      </Layout>
    )
  }
}
