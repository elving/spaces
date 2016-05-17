import ga from 'react-ga'
import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import Avatar from './Avatar'

export default class EditProfile extends Component {
  constructor(props) {
    super(props)

    const bio = get(props, 'profile.bio', '')
    const bioLength = size(bio)

    this.state = {
      bioCharsLeft: 165 - bioLength,
      avatarPreview: null,
      removedAvatar: false,
      hasBioCharsError: bioLength > 165,
    }
  }

  static contextTypes = {
    csrf: Type.string,
    user: Type.object
  };

  static propTypes = {
    message: Type.string,
    profile: Type.object.isRequired
  };

  static defaultProps = {
    profile: {}
  };

  render() {
    const { csrf, user } = this.context
    const { errors, message, profile } = this.props

    const {
      bioCharsLeft,
      removeAvatar,
      avatarPreview,
      hasBioCharsError
    } = this.state

    const bio = get(profile, 'bio', '')
    const name = get(profile, 'name', '')
    const email = get(profile, 'email', '')
    const username = get(profile, 'username', '')
    const initials = get(profile, 'initials', '')
    const avatarUrl = get(profile, 'avatarUrl', '')

    const formAction = `/users/${get(user, 'username')}/edit/`

    const hasBioError = !isEmpty(errors) && errors.bio
    const hasNameError = !isEmpty(errors) && errors.name
    const hasEmailError = !isEmpty(errors) && errors.email
    const hasAvatarError = !isEmpty(errors) && errors.avatar
    const hasUsernameError = !isEmpty(errors) && errors.username

    const bioCharsColor = hasBioError
      ? '#ED4542'
      : '#999999'

    return (
      <Layout>
        <div className="edit-profile">
          <div className="edit-profile-header">
            <h1 className="edit-profile-header-title">Edit your profile</h1>
          </div>
          {!isEmpty(errors) ? (
            <div className="ui-banner" data-state="error">
              There was an error while trying to edit your profile
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
            encType="multipart/form-data"
            onClick={() => {
              ga.event({
                label: username,
                action: 'Submitted Form',
                category: 'Edit Profile'
              })
            }}
            className="edit-profile-form"
            data-form="profile">
            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="_method" value="PUT"/>

            <div className="ui-form-group">
              <div className="edit-profile-avatar-wrapper">
                <Avatar
                  width={82}
                  height={82}
                  imageUrl={removeAvatar ? null : (avatarPreview || avatarUrl)}
                  initials={initials}/>

                <div className="edit-profile-avatar-actions">
                  <button
                    type="button"
                    className="ui-button"
                    onClick={() => {
                      const action = isEmpty(avatarUrl)
                        ? 'Clicked Upload Avatar Button'
                        : 'Clicked Change Avatar Button'

                      ga.event({
                        label: username,
                        action,
                        category: 'Edit Profile'
                      })

                      this.refs.avatarInput.click()
                    }}
                    data-action="addAvatar">
                    {isEmpty(avatarUrl) ? 'Upload avatar' : 'Change avatar'}
                  </button>

                  {!isEmpty(avatarUrl) && !removeAvatar ? (
                    <button
                      type="button"
                      className="ui-button"
                      data-action="removeAvatar"
                      onClick={() => {
                        ga.event({
                          label: username,
                          action: 'Clicked Remove Avatar Button',
                          category: 'Edit Profile'
                        })

                        this.setState({
                          removeAvatar: true
                        }, () => {
                          this.refs.avatarInput.value = null
                        })
                      }}>
                      Remove avatar
                    </button>
                  ) : null}
                </div>

                <input
                  id="image"
                  ref="avatarInput"
                  type="file"
                  name="image"
                  accept="image/gif, image/png, image/jpg, image/jpeg"
                  multiple={false}
                  className="ui-textfield"
                  data-state={hasAvatarError ? 'error' : null}
                  onChange={(event) => {
                    var file = event.target.files[0]
                    var reader = new FileReader()

                    reader.onload = () => {
                      this.setState({
                        avatarPreview: reader.result
                      })
                    }

                    if (file) {
                      reader.readAsDataURL(file)
                    }
                  }}/>
              </div>

              {hasAvatarError ? (
                <span className="ui-form-error">{errors.avatar}</span>
              ) : null}

              <input
                type="hidden"
                name="removeAvatar"
                value={removeAvatar ? true : false}/>
            </div>

            <div className="ui-form-group">
              <label htmlFor="name" className="ui-label">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="ui-textfield"
                data-state={hasNameError ? 'error' : null}
                placeholder="Your Name"
                defaultValue={name}/>
              {hasNameError ? (
                <span className="ui-form-error">{errors.name}</span>
              ) : null}
            </div>

            <div className="ui-form-group">
              <label htmlFor="username" className="ui-label">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                required
                className="ui-textfield"
                data-state={hasUsernameError ? 'error' : null}
                placeholder="Your Username"
                defaultValue={username}/>
              {hasUsernameError ? (
                <span className="ui-form-error">{errors.username}</span>
              ) : null}
            </div>

            <div className="ui-form-group">
              <label htmlFor="email" className="ui-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="ui-textfield"
                data-state={hasEmailError ? 'error' : null}
                placeholder="Your Email"
                defaultValue={email}/>
              {hasEmailError ? (
                <span className="ui-form-error">{errors.email}</span>
              ) : null}
            </div>

            <div className="ui-form-group">
              <label className="ui-label">Password</label>
              <a href={`/users/${username}/password/`} className="ui-button">
                Change Password
              </a>
            </div>

            <div className="ui-form-group">
              <div className="edit-profile-form-bio-label">
                <label htmlFor="bio" className="ui-label">
                  Bio
                </label>
                <small style={{ color: bioCharsColor }}>
                  {bioCharsLeft}
                </small>
              </div>
              <textarea
                id="bio"
                type="text"
                name="bio"
                onChange={(event) => {
                  const bioCharsLeft = 165 - size(event.target.value)

                  this.setState({
                    bioCharsLeft,
                    hasBioCharsError: bioCharsLeft < 0
                  })
                }}
                className="ui-textfield"
                data-state={
                  hasBioError || hasBioCharsError ? 'error' : null
                }
                placeholder="Your Awesome Bio"
                defaultValue={bio}/>
              {hasBioError ? (
                <span className="ui-form-error">{errors.bio}</span>
              ) : null}
            </div>

            <button
              type="submit"
              onClick={() => {
                ga.event({
                  label: username,
                  action: 'Clicked Save Button',
                  category: 'Edit Profile'
                })
              }}
              disabled={hasBioCharsError}
              data-type="primary"
              className="ui-button edit-profile-action">
              Save
            </button>
          </form>
        </div>
      </Layout>
    )
  }
}
