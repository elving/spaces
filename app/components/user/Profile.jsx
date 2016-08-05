import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import React, { PropTypes, PureComponent } from 'react'

import Layout from '../common/Layout'
import Avatar from './Avatar'
import CuratorBadge from './CuratorBadge'

import isCurator from '../../utils/user/isCurator'
import toStringId from '../../api/utils/toStringId'
import addTwitterLinks from '../../utils/addTwitterLinks'

export default class UserProfile extends PureComponent {
  static propTypes = {
    profile: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    profile: {}
  }

  static contextTypes = {
    user: PropTypes.object
  }

  isProfileOwner() {
    const { props, context } = this

    const userId = toStringId(context.user)
    const profileId = toStringId(props.profile)

    return (
      !isEmpty(userId) &&
      !isEmpty(profileId) &&
      userId === profileId
    )
  }

  renderHeader() {
    const { props } = this

    const bio = get(props.profile, 'bio')
    const username = get(props.profile, 'username')

    return (
      <div className="user-profile-header">
        <div className="user-profile-header-info">
          <Avatar
            user={props.profile}
            width={82}
            height={82}
            className="user-profile-header-avatar"
          />

          <h1 className="user-profile-header-username">
            {get(props.profile, 'name')}
            <CuratorBadge user={props.profile} size={22} />
          </h1>

          {!isEmpty(bio) ? (
            <p
              className="user-profile-header-bio"
              dangerouslySetInnerHTML={{
                __html: addTwitterLinks(bio)
              }}
            />
          ) : null}

          {this.isProfileOwner() ? (
            <div className="user-profile-header-actions">
              <a
                href={`/users/${username}/edit/`}
                className="button button--small button--primary-alt"
              >
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
    const { props } = this
    const username = get(props.profile, 'username')

    return (
      <div className="user-profile-navigation">
        <Link
          to={{ pathname: `/designers/${username}/spaces` }}
          className="user-profile-navigation-link"
          activeClassName="is-active"
        >
          Spaces
        </Link>
        {isCurator(props.profile) ? (
          <Link
            to={{ pathname: `/designers/${username}/products` }}
            className="user-profile-navigation-link"
            activeClassName="is-active"
          >
            Products
          </Link>
        ) : null}
        <Link
          to={{ pathname: `/designers/${username}/likes` }}
          className="user-profile-navigation-link"
          activeClassName="is-active"
        >
          Likes
        </Link>
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <div className="user-profile">
          {this.renderHeader()}
          <div className="user-profile-content">
            {props.children}
          </div>
        </div>
      </Layout>
    )
  }
}
