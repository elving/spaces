import set from 'lodash/set'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import assign from 'lodash/assign'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Avatar from './Avatar'
import Notification from '../common/Notification'

import toStringId from '../../api/utils/toStringId'
import focusOnFirstError from '../../utils/dom/focusOnFirstError'

export default class EditProfile extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object
  }

  static propTypes = {
    email: PropTypes.string
  }

  static defaultProps = {
    email: ''
  }

  constructor(props, context) {
    super(props, context)

    const bio = get(context.user, 'bio', '')
    const bioLength = size(bio)

    this.state = {
      bio,
      email: get(props, 'email', ''),
      errors: {},
      avatar: get(context.user, 'avatar', ''),
      fullname: get(context.user, 'fullname', ''),
      username: get(context.user, 'username', ''),
      isWaiting: false,
      bioCharsLeft: 165 - bioLength,
      hasBioCharsError: bioLength > 165,
      savingSuccessful: false
    }
  }

  componentDidUpdate() {
    const { state } = this

    if (!isEmpty(state.errors)) {
      focusOnFirstError()
    }
  }

  onSubmit = (event) => {
    event.preventDefault()

    const { context } = this
    const formData = assign({ _csrf: context.csrf }, this.getFormData())

    this.setState({
      errors: {},
      isWaiting: true
    }, () => {
      axios
      .put(`/ajax/designers/${toStringId(context.user)}/`, formData)
      .then(({ data: user }) => {
        const username = get(user, 'username')

        if (username !== get(context.user, 'username')) {
          window.location.href = `/designers/${username}/edit/`
        } else {
          this.setState({
            bio: get(user, 'bio', ''),
            errors: {},
            avatar: get(user, 'avatar', ''),
            fullname: get(user, 'fullname', ''),
            username,
            isWaiting: false,
            savingSuccessful: true
          })
        }
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

  onImageChange = ({ currentTarget: input }) => {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      this.setState({
        avatar: reader.result
      })
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  onFullNameChange = ({ currentTarget: input }) => {
    this.setState({
      fullname: input.value
    })
  }

  onEmailChange = ({ currentTarget: input }) => {
    this.setState({
      email: input.value
    })
  }

  onUsernameChange = ({ currentTarget: input }) => {
    this.setState({
      username: input.value
    })
  }

  onBioChange = ({ currentTarget: input }) => {
    const bioCharsLeft = 165 - size(input.value)

    this.setState({
      bio: input.value,
      bioCharsLeft,
      hasBioCharsError: bioCharsLeft < 0
    })
  }

  onNotificationClose = () => {
    this.setState({
      savingSuccessful: false
    })
  }

  getFormData() {
    const { props, state, context } = this

    return reduce([
      'bio',
      'email',
      'avatar',
      'fullname',
      'username'
    ], (formData, field) => {
      const oldValue = field === 'email'
        ? get(props, field)
        : get(context.user, field)

      const fieldValue = get(state, field)

      if (oldValue !== fieldValue) {
        set(formData, field, fieldValue)
      }

      return formData
    }, {})
  }

  getImageUrl() {
    const { state, context } = this
    return state.avatar || get(context.user, 'avatar')
  }

  triggerAvatarInput = () => {
    this.avatarInput.click()
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
          Profile updated successfully!
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
    const { props, state, context } = this

    const username = get(context.user, 'username', '')

    const bioError = get(state.errors, 'bio')
    const hasBioError = !isEmpty(bioError)

    const emailError = get(state.errors, 'email')
    const hasEmailError = !isEmpty(emailError)

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const avatarError = get(state.errors, 'avatar')
    const hasAvatarError = !isEmpty(avatarError)

    const usernameError = get(state.errors, 'username')
    const hasUsernameError = !isEmpty(usernameError)

    return (
      <Layout>
        {this.renderNotification()}

        <h1 className="page-title">Edit Your Profile</h1>

        <form
          ref={form => { this.form = form }}
          method="POST"
          action={`/designers/${username}/edit/`}
          encType="multipart/form-data"
          onSubmit={this.onSubmit}
          className="edit-profile-form"
          data-form="profile"
        >
          <input type="hidden" name="_csrf" value={context.csrf} />
          <input type="hidden" name="_method" value="PUT" />

          <div className="form-group">
            <div className="edit-profile-avatar-wrapper">
              <Avatar
                width={82}
                height={82}
                imageUrl={this.getImageUrl()}
                initials={get(context.user, 'initials', '')}
              />

              <div className="edit-profile-avatar-actions">
                <button
                  type="button"
                  onClick={this.triggerAvatarInput}
                  className="button"
                >
                  {isEmpty(get(context.user, 'avatar'))
                    ? 'Upload avatar'
                    : 'Change avatar'
                  }
                </button>
              </div>

              <input
                id="image"
                ref={avatarInput => { this.avatarInput = avatarInput }}
                type="file"
                name="image"
                accept="image/gif, image/png, image/jpg, image/jpeg"
                multiple={false}
                onChange={this.onImageChange}
                className={classNames({
                  textfield: true,
                  'textfield--error': hasAvatarError
                })}
              />
            </div>

            {hasAvatarError ? (
              <small className="form-error">{avatarError}</small>
            ) : null}

            {!isEmpty(state.avatar) ? (
              <input
                type="hidden"
                name="avatar"
                value={state.avatar}
              />
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="fullname" className="form-label">Name</label>

            <input
              id="fullname"
              type="text"
              name="fullname"
              disabled={state.isWaiting}
              onChange={this.onFullNameChange}
              className={classNames({
                textfield: true,
                'textfield--error': hasNameError
              })}
              placeholder="Your Name"
              defaultValue={get(context.user, 'fullname')}
            />

            {hasNameError ? (
              <small className="form-error">{nameError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>

            <input
              id="username"
              type="text"
              name="username"
              required
              disabled={state.isWaiting}
              onChange={this.onUsernameChange}
              className={classNames({
                textfield: true,
                'textfield--error': hasUsernameError
              })}
              placeholder="Your Username"
              defaultValue={username}
            />

            {hasUsernameError ? (
              <small className="form-error">{usernameError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              required
              disabled={state.isWaiting}
              onChange={this.onEmailChange}
              className={classNames({
                textfield: true,
                'textfield--error': hasEmailError
              })}
              placeholder="Your Email"
              defaultValue={props.email}
            />

            {hasEmailError ? (
              <small className="form-error">{emailError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>

            <a
              id="password"
              href={`/designers/${username}/password/`}
              className="button"
            >
              Change Password
            </a>
          </div>

          <div className="form-group">
            <div className="edit-profile-form-bio-label">
              <label htmlFor="bio" className="form-label">
                Bio
                <small
                  style={{
                    color: state.hasBioCharsError ? '#ED4542' : '#999999'
                  }}
                >
                  {state.bioCharsLeft}
                </small>
              </label>
            </div>

            <textarea
              id="bio"
              type="text"
              name="bio"
              disabled={state.isWaiting}
              onChange={this.onBioChange}
              className={classNames({
                textfield: true,
                'textfield--error': hasBioError || state.hasBioCharsError
              })}
              placeholder="Your Awesome Bio"
              defaultValue={get(context.user, 'bio')}
            />

            {hasBioError ? (
              <small className="form-error">{bioError}</small>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={state.isWaiting || state.hasBioCharsError}
            className="button button--primary edit-profile-action"
          >
            {state.isWaiting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </Layout>
    )
  }
}
