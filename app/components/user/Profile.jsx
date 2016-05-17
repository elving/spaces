import ga from 'react-ga'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import Avatar from './Avatar'
import fullReload from '../../utils/fullReload'
import addTwitterLinks from '../../utils/addTwitterLinks'

export default class UserProfile extends Component {
  static propTypes = {
    profile: Type.object.isRequired,
    productLikes: Type.array
  };

  static contextTypes = {
    user: Type.object
  };

  isProfileOwner() {
    const userId = get(this.context, 'user.id')
    const profileId = get(this.props, 'profile.id')

    return (
      !isEmpty(userId) && !isEmpty(profileId) && userId === profileId
    )
  }

  renderHeader() {
    const { profile } = this.props
    const username = get(profile, 'username')
    const fullName = get(profile, 'fullName')
    const initials = get(profile, 'initials')
    const avatarUrl = get(profile, 'avatarUrl')

    return (
      <div className="user-profile-header">
        <div className="user-profile-header-info">
          <Avatar
            width={82}
            height={82}
            imageUrl={avatarUrl}
            initials={initials}
            className="user-profile-header-avatar"/>

          <h1 className="user-profile-header-username">
            {fullName}
          </h1>

          {!isEmpty(profile.bio) ? (
            <p
              className="user-profile-header-bio"
              dangerouslySetInnerHTML={{
                __html: addTwitterLinks(profile.bio)
              }}/>
          ) : null}

          {this.isProfileOwner() ? (
            <div className="user-profile-header-actions">
              <a
                href={`/users/${username}/edit/`}
                onClick={() => {
                  ga.event({
                    label: username,
                    action: 'Clicked Edit Button',
                    category: 'Profile'
                  })
                }}
                data-type="primary"
                data-size="small"
                className="ui-button">
                Edit
              </a>
            </div>
          ) : null}
        </div>

        {this.renderNavigation()}
      </div>
    )
  }

  renderNavigation() {
    const { username } = this.props.profile

    return (
      <div className="user-profile-navigation">
        <Link
          to={{pathname: `/users/${username}/likes`}}
          onClick={(event) => {
            ga.event({
              label: username,
              action: 'Clicked Likes Link',
              category: 'Profile'
            })

            fullReload(event)
          }}
          className="user-profile-navigation-link"
          activeClassName="is-active">
          Likes
        </Link>
        <Link
          to={{pathname: `/users/${username}/collections`}}
          onClick={(event) => {
            ga.event({
              label: username,
              action: 'Clicked Collections Link',
              category: 'Profile'
            })

            fullReload(event)
          }}
          className="user-profile-navigation-link"
          activeClassName="is-active">
          Collections
        </Link>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <div className="user-profile">
          {this.renderHeader()}
          {this.props.children}
        </div>
      </Layout>
    )
  }
}
